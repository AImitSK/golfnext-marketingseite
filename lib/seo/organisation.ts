/**
 * Die belegten Angaben zur Organisation – Quelle ist `docs/legal/impressum.md`
 * (Briefing 0034: „Organization enthält nur, was belegt in docs/legal/ oder in den
 * Sanity-Einstellungen steht").
 *
 * Warum nicht aus der Markdown-Datei gelesen: Der Impressumstext wird als Fließtext
 * gerendert (`lib/legal.ts`), nicht als Datensatz. Eine Anschrift aus Überschriften
 * und Zeilenumbrüchen zu klauben, wäre bei der ersten Umformulierung falsch. Hier
 * stehen dieselben Werte als Daten – wortgleich, mit Quellenangabe.
 *
 * Telefon und E-Mail stehen ebenfalls im Impressum. Liegen sie in den
 * Sanity-Einstellungen (`siteSettings`), haben die Vorrang: Fred pflegt sie dort.
 * Zurzeit gibt es das Dokument noch nicht, dann gelten diese Werte.
 */
export const ORGANISATION = {
  name: "GolfNext",
  /** Angaben gemäß § 5 DDG – die verantwortliche Person hinter GolfNext. */
  gruender: "Fred Hoffmann",
  strasse: "Richartzstraße 10",
  plz: "30519",
  ort: "Hannover",
  land: "DE",
  telefon: "0175 5951839",
  email: "info@golfnext.de",
} as const;
