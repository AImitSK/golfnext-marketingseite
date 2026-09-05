/**
 * Zentrale Formular-Microcopys (Briefing 0009 · Wortlaut aus dem freigegebenen
 * Katalog in `docs/06-formulare-sendgrid.md`, Tonalität nach `docs/08` §4).
 *
 * Feld-Validierung (an `FieldMessage`) und Formular-Ergebnis (Alert über dem Button
 * bzw. statt des Formulars). Komponenten enthalten KEINE freien Meldungstexte,
 * sondern lesen ausschließlich aus diesem Katalog.
 *
 * Die Texte sind **wortgleich** aus `docs/06` (der von Fred freigegebene Katalog,
 * Z.77–90) übernommen – inklusive des konkreten Auswegs (Mail/Telefon) bei Server-
 * und Netzfehler, wie `docs/08` §3 ihn verlangt. Keine erfundenen Kontaktdaten.
 *
 * Starter-Umfang nach Briefing 0009 (Pflichtfeld, E-Mail, Netz-/Serverfehler,
 * Erfolg – plus die für die Vorschau nötigen Feldmeldungen); das echte Formular
 * (Server Action, restliche Feldfehler, SendGrid) und die übrigen Katalogschlüssel
 * folgen in Phase 4.
 */
export const formMessages = {
  /** Feld-Meldungen an `FieldMessage` (e = Fehler, s = bestätigt, h = Hinweis). */
  field: {
    required: "Bitte füllen Sie dieses Feld aus.",
    email: "Bitte geben Sie eine vollständige E-Mail-Adresse ein.",
    // Positive Feldbestätigung (docs/06: „Erfolgszustand nur für Felder mit Format").
    emailOk: "Die E-Mail-Adresse ist vollständig.",
    // Hilfetext zur optionalen Nachricht (docs/06 Z.21, wortgleich).
    optional: "Optional – hilft uns, den Termin auf Ihre Situation vorzubereiten.",
  },

  /** Ergebnis nach dem Absenden (Alert ok/err, docs/06 Z.84–89, wortgleich). */
  form: {
    invalid:
      "Das Formular konnte nicht gesendet werden. Bitte prüfen Sie die markierten Felder – oder rufen Sie uns direkt an.",
    network:
      "Die Verbindung wurde unterbrochen. Ihre Eingaben sind noch da – bitte versuchen Sie es noch einmal.",
    server:
      "Das hat leider nicht geklappt. Schreiben Sie uns direkt an info@golfnext.de oder rufen Sie an: 0175 5951839.",
    // Erfolg ersetzt das Formular (Titel + Text, docs/06 Z.88–89).
    success: {
      title: "Vielen Dank – Ihre Anfrage ist eingegangen.",
      text: "Fred Hoffmann meldet sich innerhalb eines Werktags persönlich.",
    },
  },
} as const;
