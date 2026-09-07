"use server";

import { headers } from "next/headers";
import { buildContactMail } from "@/lib/mail/contact-mail";
import { mailConfig, sendMail } from "@/lib/mail/sendgrid";
import type { ContactState } from "@/lib/forms/contact-state";
import { checkRateLimit, claimSubmission, releaseSubmission } from "@/lib/forms/ratelimit";
import { contactSchema, toFieldErrors, type FieldName, type FieldValues } from "@/lib/forms/schema";
import { detectAnomalies, scoreSubmission, verifyTimestamp } from "@/lib/forms/spam";

/**
 * Server Action des Kontaktformulars (Briefing 0025, Ablauf aus docs/06).
 *
 *   zod → Stufe A (Honeypot, signierter Zeitstempel, Payload-Anomalien → stilles
 *   `ok`) → Stufe B (Rate-Limit, Duplikat, Heuristik-Score → Betreff-Tag `[Prüfen]`)
 *   → `sendMail()`
 *
 * Bewusst eine Server Action statt einer API-Route: kein offener Endpunkt, Next
 * prüft den Origin selbst, und das Formular funktioniert als normales `<form>`
 * **ohne JavaScript** (Progressive Enhancement).
 *
 * Zwei Regeln bestimmen jede Verzweigung:
 *  1. **Nichts Legitimes geht verloren.** Nur eindeutige Bot-Signale enden still;
 *     alles Unsichere wird zugestellt und markiert. Fällt ein Speicher aus, wird
 *     zugestellt.
 *  2. **Keine personenbezogenen Daten im Log** – auch nicht im Fehlerfall. Geloggt
 *     werden ausschließlich `contact.accepted | contact.flagged | contact.rejected`
 *     mit einem kurzen Grund ohne Inhalt (docs/06, Punkt 8).
 *
 * Der Rückgabewert trägt nur Meldungs-**Schlüssel**, nie fertigen Text – der Wortlaut
 * steht ausschließlich in `lib/forms/messages.ts`.
 */

/** Die Felder, deren Werte nach einem Fehler wieder ins Formular geschrieben werden. */
const ECHO_FIELDS: readonly FieldName[] = [
  "vorname",
  "nachname",
  "rolle",
  "club",
  "thema",
  "email",
  "telefon",
  "nachricht",
  "einwilligung",
];

function readValues(raw: Map<string, string>): FieldValues {
  const values: FieldValues = {};
  for (const field of ECHO_FIELDS) {
    const value = raw.get(field);
    if (value !== undefined) values[field] = value;
  }
  return values;
}

/**
 * Anfragende IP für das Rate-Limit. Sie wird nur an `checkRateLimit` gereicht und
 * dort ausschließlich gehasht gespeichert – nie geloggt, nie in der Mail.
 */
async function clientIp(): Promise<string | undefined> {
  const head = await headers();
  const forwarded = head.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || head.get("x-real-ip")?.trim() || undefined;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = new Map<string, string>();
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw.set(key, value);
  }

  /* ── Stufe A · eindeutige Bot-Signale → stilles Verwerfen, Antwort trotzdem ok ── */

  if ((raw.get("website") ?? "").length > 0) {
    console.info("contact.rejected", "honeypot");
    return { status: "ok" };
  }

  const stamp = verifyTimestamp(raw.get("ts"));
  if (!stamp.ok) {
    console.info("contact.rejected", stamp.reason);
    return { status: "ok" };
  }

  const anomalies = detectAnomalies(raw);
  if (anomalies.length > 0) {
    console.info("contact.rejected", anomalies.join("|"));
    return { status: "ok" };
  }

  /* ── Validierung (verbindlich serverseitig) ── */

  const parsed = contactSchema.safeParse({
    vorname: raw.get("vorname") ?? "",
    nachname: raw.get("nachname") ?? "",
    rolle: raw.get("rolle") || undefined,
    club: raw.get("club") ?? "",
    thema: raw.get("thema") || undefined,
    email: raw.get("email") ?? "",
    telefon: raw.get("telefon") ?? "",
    nachricht: raw.get("nachricht") ?? "",
    einwilligung: raw.get("einwilligung"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      formError: "invalid",
      fieldErrors: toFieldErrors(parsed.error),
      values: readValues(raw),
    };
  }

  const data = parsed.data;

  /* ── Stufe B · bewerten, nicht verwerfen ── */

  const limit = await checkRateLimit(await clientIp(), data.email);
  if (!limit.allowed) {
    console.info("contact.rejected", `ratelimit:${limit.reason}`);
    return { status: "error", formError: "ratelimit", values: readValues(raw) };
  }

  // Doppelklick oder Zurück-Taste: keine zweite Mail, aber dieselbe Erfolgsmeldung.
  const first = await claimSubmission(data.email, data.nachricht);
  if (!first) {
    console.info("contact.accepted", "duplicate");
    return { status: "ok" };
  }

  const score = scoreSubmission(data, { ageMs: stamp.ageMs, unsigned: stamp.unsigned });

  const result = await sendMail(buildContactMail({ data, to: mailConfig().to, score }));
  if (!result.ok) {
    // Die Duplikat-Sperre wieder freigeben: Sonst gälte der zweite Versuch derselben
    // Nachricht als Wiederholung und würde still verschluckt – die Anfrage wäre weg.
    await releaseSubmission(data.email, data.nachricht);
    return { status: "error", formError: "server", values: readValues(raw) };
  }

  if (score.review) {
    console.info("contact.flagged", `${score.score}:${score.reasons.join(",")}`);
  } else {
    console.info("contact.accepted", result.transport);
  }
  return { status: "ok" };
}
