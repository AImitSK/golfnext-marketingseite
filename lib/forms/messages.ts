/**
 * Zentrale Formular-Microcopys (Briefing 0009 · docs/08-zustaende-und-feedback.md §4).
 *
 * Feld-Validierung (an `FieldMessage`) und Formular-Ergebnis (Alert über dem Button
 * bzw. statt des Formulars). Komponenten enthalten KEINE freien Meldungstexte,
 * sondern lesen ausschließlich aus diesem Katalog.
 *
 * Tonalität (docs/08 §4): Sie-Form, ein Satz, benennt den nächsten Schritt, keine
 * Technik („Fehler 500", „Request failed" kommen nicht vor), keine Ausrufezeichen,
 * kein „Oops".
 *
 * Starter-Umfang nach Briefing 0009; das echte Formular (Server Action, weitere
 * Feldfehler, SendGrid) folgt in Phase 4 und erweitert diesen Katalog.
 */
export const formMessages = {
  /** Feld-Meldungen an `FieldMessage` (e = Fehler, s = bestätigt, h = Hinweis). */
  field: {
    required: "Bitte füllen Sie dieses Feld aus.",
    email: "Bitte geben Sie eine vollständige E-Mail-Adresse ein.",
    emailOk: "Die E-Mail-Adresse ist vollständig.",
    optional: "Optional – hilft uns, das Gespräch vorzubereiten.",
  },

  /** Ergebnis nach dem Absenden (Alert ok/err, docs/08 §3). */
  form: {
    success: "Ihre Anfrage ist eingegangen, wir melden uns innerhalb eines Werktags bei Ihnen.",
    invalid: "Bitte prüfen Sie die markierten Felder und senden Sie das Formular noch einmal.",
    network: "Die Anfrage ließ sich gerade nicht senden, bitte versuchen Sie es in einem Moment noch einmal.",
    server: "Beim Senden ist etwas dazwischengekommen, bitte versuchen Sie es in einem Moment noch einmal.",
  },
} as const;
