import { z } from "zod";
import { KONTAKT_ROLLEN, KONTAKT_THEMEN } from "@/content/kontakt";
import type { FieldMessageKey } from "./messages";

/**
 * Feld-Schema des Kontaktformulars (Briefing 0025, Feldliste aus Mock 3.10).
 *
 * Eine Quelle für beide Seiten: Die Server Action validiert damit serverseitig
 * (verbindlich), die Blur-Validierung im Browser prüft mit denselben Regeln – kein
 * Drift zwischen Client und Server (docs/06). Der Browser bekommt hier weder
 * Schwellen noch Empfänger noch Schlüssel zu sehen; das steckt in `spam.ts`,
 * `ratelimit.ts` und der Action.
 *
 * zod-Meldungen sind **Schlüssel** aus `lib/forms/messages.ts`, kein fertiger Text –
 * so bleibt der Wortlaut an genau einer Stelle (CLAUDE.md: keine freien Meldungstexte).
 *
 * Es gibt bewusst KEIN Wunschzeit-Feld und KEIN Newsletter-Feld (Entscheidung
 * Stefan, 07.09.2026: Termine laufen über cal.com; der Hero verspricht ausdrücklich
 * „Keine Anmeldung zu irgendeinem Newsletter").
 */

/** Maximale Feldlängen – auch die Grundlage der Payload-Anomalie-Prüfung (Stufe A). */
export const MAX = {
  name: 80,
  club: 120,
  email: 254,
  phone: 30,
  message: 3000,
} as const;

/** Telefon: Ziffern, Leerzeichen, `+`, `/`, `-`, Klammern (docs/06, 6–30 Zeichen). */
const PHONE = /^[0-9+/\-() ]{6,30}$/;

/** Leere Zeichenketten aus dem Formular werden zu `undefined` (optionale Felder). */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "tooLong" satisfies FieldMessageKey)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

export const contactSchema = z.object({
  vorname: z
    .string()
    .trim()
    .min(2, "vorname" satisfies FieldMessageKey)
    .max(MAX.name, "tooLong" satisfies FieldMessageKey),
  nachname: z
    .string()
    .trim()
    .min(2, "nachname" satisfies FieldMessageKey)
    .max(MAX.name, "tooLong" satisfies FieldMessageKey),
  // Auswahlfelder sind optional (Briefing 0025). Der Mock führt keine leere
  // Vorauswahl – ein unbekannter Wert wäre also manipuliert und wird abgewiesen.
  rolle: z.enum(KONTAKT_ROLLEN).optional(),
  club: optionalText(MAX.club),
  thema: z.enum(KONTAKT_THEMEN).optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(MAX.email, "email" satisfies FieldMessageKey)
    .pipe(z.email("email" satisfies FieldMessageKey)),
  telefon: z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .optional()
    .refine((v) => v === undefined || PHONE.test(v), "phone" satisfies FieldMessageKey),
  nachricht: z
    .string()
    .trim()
    .min(1, "message" satisfies FieldMessageKey)
    .max(MAX.message, "messageLong" satisfies FieldMessageKey),
  // Ein nicht angehaktes Kontrollkästchen wird gar nicht mitgesendet → `undefined`.
  einwilligung: z
    .string()
    .optional()
    .refine((v) => v === "on", "consent" satisfies FieldMessageKey),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Namen aller sichtbaren Formularfelder – Reihenfolge = Reihenfolge im Formular. */
export const FIELD_ORDER = [
  "vorname",
  "nachname",
  "rolle",
  "club",
  "thema",
  "email",
  "telefon",
  "nachricht",
  "einwilligung",
] as const;

export type FieldName = (typeof FIELD_ORDER)[number];

/** Feldfehler als Schlüssel – der Text kommt erst beim Rendern aus dem Katalog. */
export type FieldErrors = Partial<Record<FieldName, FieldMessageKey>>;

/** Die vom Nutzer eingegebenen Werte, damit sie nach einem Fehler erhalten bleiben. */
export type FieldValues = Partial<Record<FieldName, string>>;

/**
 * Wandelt einen zod-Fehler in `{ feld: Meldungsschlüssel }`. Pro Feld bleibt die
 * erste Meldung stehen – ein Feld zeigt nie zwei Fehler gleichzeitig (docs/08 §4).
 */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const name = issue.path[0];
    if (typeof name !== "string") continue;
    const field = name as FieldName;
    if (out[field]) continue;
    // Unerwartete zod-Standardmeldungen (z. B. „Invalid input") würden Technik
    // durchreichen – deshalb der Fallback auf die allgemeine Pflichtfeld-Meldung.
    out[field] = isMessageKey(issue.message) ? issue.message : "required";
  }
  return out;
}

const MESSAGE_KEYS = new Set<string>([
  "required",
  "email",
  "emailOk",
  "optional",
  "club",
  "name",
  "phone",
  "messageLong",
  "consent",
  "vorname",
  "nachname",
  "message",
  "tooLong",
]);

function isMessageKey(value: string): value is FieldMessageKey {
  return MESSAGE_KEYS.has(value);
}

/**
 * Prüft ein einzelnes Feld – für die Blur-Validierung im Browser. Nutzt dasselbe
 * Schema wie der Server; ein Feld, das der Server akzeptiert, wird hier nie
 * beanstandet. Rückgabe: Meldungsschlüssel oder `undefined` (in Ordnung).
 */
export function validateField(field: FieldName, value: string): FieldMessageKey | undefined {
  const shape = contactSchema.shape[field];
  const result = shape.safeParse(value === "" ? undefined : value);
  if (result.success) return undefined;
  const first = result.error.issues[0];
  if (!first) return "required";
  return isMessageKey(first.message) ? first.message : "required";
}

/** Felder mit Format, die eine positive Bestätigung (`.inp.ok`) bekommen dürfen (docs/06). */
export const CONFIRMABLE_FIELDS: readonly FieldName[] = ["email", "telefon"];
