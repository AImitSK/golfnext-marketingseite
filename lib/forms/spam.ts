import { createHmac, timingSafeEqual } from "node:crypto";
import { MAX, type ContactInput } from "./schema";
import { isDisposableDomain } from "./disposable-domains";

/**
 * Spam-Schutz ohne CAPTCHA, in zwei Stufen (docs/06 §Spam-Schutz).
 *
 * Grundsatz, der jede Entscheidung hier bestimmt: **Legitime Anfragen dürfen nie
 * verloren gehen.** Nur eindeutige Bot-Signale werden still verworfen (Stufe A);
 * alles Unsichere wird zugestellt und im Betreff markiert (Stufe B).
 *
 * Kein reCAPTCHA, kein Turnstile (docs/06 Stufe C: erst bei konkretem Anlass).
 */

/* ────────────────────────── Signierter Zeitstempel ────────────────────────── */

/** Frühestens 4 Sekunden nach dem Rendern – schneller füllt kein Mensch aus. */
export const MIN_AGE_MS = 4_000;
/** Spätestens nach 2 Stunden – verhindert das Wiederverwenden alter Formulare. */
export const MAX_AGE_MS = 2 * 60 * 60 * 1000;

/** Kennung für den Fall „kein `FORM_SIGNING_SECRET` gesetzt" (siehe `signTimestamp`). */
const UNSIGNED = "unsigned";

function secret(): string | undefined {
  const value = process.env.FORM_SIGNING_SECRET?.trim();
  return value ? value : undefined;
}

/** Ist die Signatur scharf? Ohne Schlüssel läuft das Formular im Beobachtungsmodus. */
export function hasSigningSecret(): boolean {
  return secret() !== undefined;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

/**
 * Baut den Wert des versteckten Feldes `ts`: `<epoch>.<HMAC-SHA256>`.
 *
 * Fehlt `FORM_SIGNING_SECRET` (Stand 07.09.2026 noch offen, Briefing 0025), wird
 * `<epoch>.unsigned` gerendert. Dann prüft `verifyTimestamp` nur noch das Alter und
 * die Anfrage bekommt einen Score-Punkt – sie wird aber **nie deswegen verworfen**.
 * Ein hart abweisender Zweig ohne Schlüssel würde in einer serverlosen Umgebung
 * genau das tun, was hier verboten ist: legitime Anfragen verlieren.
 */
export function signTimestamp(now: number = Date.now()): string {
  const key = secret();
  const epoch = String(now);
  return key ? `${epoch}.${sign(epoch, key)}` : `${epoch}.${UNSIGNED}`;
}

export type TimestampVerdict =
  /** Eindeutig Bot: fehlt, gefälscht oder unmöglich alt/jung → stilles Verwerfen. */
  | { ok: false; reason: "ts.missing" | "ts.forged" | "ts.tooYoung" | "ts.tooOld" }
  /** In Ordnung; `ageMs` fließt in den Score ein, `unsigned` markiert den Notbetrieb. */
  | { ok: true; ageMs: number; unsigned: boolean };

export function verifyTimestamp(value: unknown, now: number = Date.now()): TimestampVerdict {
  if (typeof value !== "string" || value.length === 0 || value.length > 200) {
    return { ok: false, reason: "ts.missing" };
  }
  const sep = value.indexOf(".");
  if (sep <= 0) return { ok: false, reason: "ts.missing" };

  const epoch = value.slice(0, sep);
  const signature = value.slice(sep + 1);
  const issued = Number(epoch);
  if (!Number.isSafeInteger(issued) || issued <= 0) return { ok: false, reason: "ts.missing" };

  const key = secret();
  if (key) {
    const expected = sign(epoch, key);
    if (!equalsConstantTime(signature, expected)) return { ok: false, reason: "ts.forged" };
  } else if (signature !== UNSIGNED) {
    // Ohne Schlüssel kann nichts geprüft werden; ein fremdes Format ist trotzdem
    // ein klares Bot-Signal (unser Formular rendert genau `unsigned`).
    return { ok: false, reason: "ts.forged" };
  }

  const ageMs = now - issued;
  if (ageMs < MIN_AGE_MS) return { ok: false, reason: "ts.tooYoung" };
  if (ageMs > MAX_AGE_MS) return { ok: false, reason: "ts.tooOld" };
  return { ok: true, ageMs, unsigned: key === undefined };
}

function equalsConstantTime(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/* ────────────────────────── Stufe A · Payload-Anomalien ────────────────────────── */

/** Felder, die unser Formular sendet. Alles darüber hinaus ist manipuliert. */
const KNOWN_FIELDS = new Set([
  "vorname",
  "nachname",
  "rolle",
  "club",
  "thema",
  "email",
  "telefon",
  "nachricht",
  "einwilligung",
  "website",
  "ts",
  // React/Next hängen bei Server Actions eigene Felder an das FormData an.
  "$ACTION_ID",
]);

const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/gi;
// Steuerzeichen ohne Zeilenumbruch, Wagenrücklauf und Tabulator – in einem Formular
// hat nichts davon zu suchen (typisch für Header-Injection-Versuche).
function hasControlChars(value: string, mehrzeilig: boolean): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // Tabulator (9) ist überall harmlos. Zeilenumbruch (10) und Wagenrücklauf (13)
    // gehören nur in die Nachricht – in einem einzeiligen Feld sind sie der
    // klassische Versuch, weitere Mail-Kopfzeilen einzuschleusen.
    if (code === 9) continue;
    if (mehrzeilig && (code === 10 || code === 13)) continue;
    if (code < 32 || code === 127) return true;
  }
  return false;
}

export function countUrls(text: string): number {
  return text.match(URL_PATTERN)?.length ?? 0;
}

/**
 * Stufe A: eindeutige Bot-Signale in den Rohdaten. Ein Treffer verwirft still
 * (die Antwort bleibt `ok`, damit ein Bot nichts lernt).
 *
 * Bewusst grob kalibriert: Die Längenprüfung greift erst beim Vierfachen des
 * erlaubten Maximums – ein Mensch, der zu viel schreibt, bekommt den normalen
 * Feldfehler aus dem Katalog, keinen stillen Abbruch.
 */
export function detectAnomalies(raw: Map<string, string>): string[] {
  const reasons: string[] = [];

  for (const name of raw.keys()) {
    if (!KNOWN_FIELDS.has(name) && !name.startsWith("$ACTION")) {
      reasons.push("payload.unknownField");
      break;
    }
  }

  for (const [name, value] of raw) {
    if (name === "ts" || name.startsWith("$ACTION")) continue;
    if (hasControlChars(value, name === "nachricht")) {
      reasons.push("payload.controlChars");
      break;
    }
  }

  const oversized = [
    ["vorname", MAX.name],
    ["nachname", MAX.name],
    ["club", MAX.club],
    ["email", MAX.email],
    ["telefon", MAX.phone],
    ["nachricht", MAX.message],
  ] as const;
  for (const [name, max] of oversized) {
    if ((raw.get(name)?.length ?? 0) > max * 4) {
      reasons.push("payload.oversized");
      break;
    }
  }

  const message = raw.get("nachricht") ?? "";
  if (countUrls(message) > 2) reasons.push("payload.manyUrls");
  const withoutUrls = message.replace(URL_PATTERN, "").trim();
  if (message.length > 0 && countUrls(message) > 0 && withoutUrls.length === 0) {
    reasons.push("payload.onlyUrls");
  }
  // Ein einziger Block ohne ein einziges Leerzeichen ist kein Satz.
  if (message.length > 120 && !/\s/.test(message)) reasons.push("payload.noWhitespace");

  return reasons;
}

/* ────────────────────────── Stufe B · Heuristik-Score ────────────────────────── */

/** Ab diesem Score bekommt die Mail den Betreff-Präfix `[Prüfen]` – verworfen wird nie. */
export const REVIEW_THRESHOLD = 3;

/** Unter dieser Ausfüllzeit ist eine Anfrage auffällig schnell (docs/06, Punkt 7). */
const FAST_FILL_MS = 8_000;

const CYRILLIC = /[Ѐ-ӿ]/;
const LATIN = /[a-zA-Z]/;
const VOWEL = /[aeiouäöüáàéèíìóòúùyAEIOUÄÖÜY]/;

export interface ScoreResult {
  score: number;
  /** Kurze, personenfreie Gründe – nur diese landen im Log und in der Mail-Fußzeile. */
  reasons: string[];
  /** Ab `REVIEW_THRESHOLD`: Betreff bekommt `[Prüfen]`. */
  review: boolean;
}

/**
 * Stufe B: bewertet, verwirft nicht. Jeder Punkt ist ein schwaches Signal; erst die
 * Summe führt zur Markierung. Die Gründe stehen in der Mail, damit Fred die Schwelle
 * nach zwei Wochen Live-Betrieb nachziehen kann (docs/06, Punkt 8).
 */
export function scoreSubmission(
  data: ContactInput,
  context: { ageMs: number; unsigned: boolean },
): ScoreResult {
  const reasons: string[] = [];
  let score = 0;

  const urls = countUrls(data.nachricht);
  if (urls > 0) {
    score += 2;
    reasons.push("urls");
  }

  if (isDisposableDomain(data.email)) {
    score += 3;
    reasons.push("disposable");
  }

  const localPart = data.email.split("@")[0] ?? "";
  const name = `${data.vorname}${data.nachname}`.toLowerCase();
  if (localPart.length > 0 && localPart.toLowerCase() === name) {
    score += 1;
    reasons.push("nameEqualsLocalpart");
  }

  const alleTexte = [data.vorname, data.nachname, data.club ?? "", data.nachricht].join(" ");
  if (CYRILLIC.test(alleTexte) && LATIN.test(alleTexte)) {
    score += 3;
    reasons.push("mixedScripts");
  }

  const club = data.club?.trim();
  if (club && !club.includes(" ") && !VOWEL.test(club)) {
    score += 1;
    reasons.push("clubWithoutVowel");
  }

  if (context.ageMs < FAST_FILL_MS) {
    score += 2;
    reasons.push("fastFill");
  }

  if (context.unsigned) {
    // Kein FORM_SIGNING_SECRET gesetzt: Stufe A greift nur eingeschränkt, also
    // schaut Stufe B genauer hin. Ein einzelner Punkt markiert nichts allein.
    score += 1;
    reasons.push("unsignedTimestamp");
  }

  return { score, reasons, review: score >= REVIEW_THRESHOLD };
}
