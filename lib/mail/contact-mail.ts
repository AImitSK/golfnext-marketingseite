import type { ContactInput } from "@/lib/forms/schema";
import type { ScoreResult } from "@/lib/forms/spam";
import { escapeHtml, subjectSafe, type MailPayload } from "./sendgrid";

/**
 * Baut die Anfrage-Mail an GolfNext (docs/06 §SendGrid).
 *
 * Regeln, die hier durchgesetzt werden:
 *  - Jeder Nutzerwert läuft im HTML-Teil durch `escapeHtml` – aus dem Formular wird
 *    nie HTML übernommen.
 *  - Im Betreff stehen nur Name und Anlage, beide gekürzt und ohne Zeilenumbrüche
 *    (kein Einschleusen weiterer Kopfzeilen).
 *  - **Keine IP-Adresse** in der Mail. Der Score steht als Fußzeile darin, damit Fred
 *    eine `[Prüfen]`-Markierung einordnen kann.
 */

/** Beschriftungen der Zeilen – dieselbe Reihenfolge wie im Formular. */
const ZEILEN: { label: string; value: (data: ContactInput) => string | undefined }[] = [
  { label: "Vorname", value: (d) => d.vorname },
  { label: "Nachname", value: (d) => d.nachname },
  { label: "Ich bin", value: (d) => d.rolle },
  { label: "Golfclub oder Anlage", value: (d) => d.club },
  { label: "Worum geht es", value: (d) => d.thema },
  { label: "E-Mail", value: (d) => d.email },
  { label: "Telefon", value: (d) => d.telefon },
];

export function buildContactMail({
  data,
  to,
  score,
  now = new Date(),
}: {
  data: ContactInput;
  to: string;
  score: ScoreResult;
  now?: Date;
}): MailPayload {
  const name = subjectSafe(`${data.vorname} ${data.nachname}`);
  const anlage = data.club ? subjectSafe(data.club) : undefined;
  const betreff = anlage
    ? `[Website] Anfrage von ${name} – ${anlage}`
    : `[Website] Anfrage von ${name}`;
  const subject = score.review ? `[Prüfen] ${betreff}` : betreff;

  const zeitstempel = now.toISOString();
  const felder = ZEILEN.map(({ label, value }) => ({ label, value: value(data) })).filter(
    (z): z is { label: string; value: string } => Boolean(z.value),
  );

  const fuss = score.review
    ? `Hinweis: automatisch als prüfenswert markiert (Score ${score.score}: ${score.reasons.join(", ")}).`
    : `Prüfsumme der Spam-Bewertung: ${score.score}.`;

  const text = [
    ...felder.map((z) => `${z.label}: ${z.value}`),
    "",
    "Nachricht:",
    data.nachricht,
    "",
    `Eingegangen: ${zeitstempel}`,
    fuss,
  ].join("\n");

  const html = [
    '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">',
    ...felder.map(
      (z) =>
        `<tr><td style="padding:4px 14px 4px 0;color:#5C6F76">${escapeHtml(z.label)}</td>` +
        `<td style="padding:4px 0"><strong>${escapeHtml(z.value)}</strong></td></tr>`,
    ),
    "</table>",
    '<p style="font-family:Arial,sans-serif;font-size:15px;white-space:pre-wrap">',
    escapeHtml(data.nachricht),
    "</p>",
    `<p style="font-family:Arial,sans-serif;font-size:12px;color:#5C6F76">${escapeHtml(
      `Eingegangen: ${zeitstempel}`,
    )}<br>${escapeHtml(fuss)}</p>`,
  ].join("\n");

  return {
    to,
    subject,
    text,
    html,
    // Die Adresse hat das zod-Schema bestanden und enthält keine Steuerzeichen.
    replyTo: data.email,
  };
}
