/**
 * Zentrale Formular-Microcopys (Briefing 0009 · Wortlaut aus dem freigegebenen
 * Katalog in `docs/06-formulare-sendgrid.md`, Tonalität nach `docs/08` §4).
 *
 * Feld-Validierung (an `FieldMessage`) und Formular-Ergebnis (Alert über dem Button
 * bzw. statt des Formulars). Komponenten enthalten KEINE freien Meldungstexte,
 * sondern lesen ausschließlich aus diesem Katalog. Dieselbe Quelle gilt für zod
 * (serverseitig) und die Blur-Validierung (clientseitig) – kein Drift.
 *
 * Die Texte sind **wortgleich** aus `docs/06` (der von Fred freigegebene Katalog,
 * Z.77–90) übernommen – inklusive des konkreten Auswegs (Mail/Telefon) bei Server-
 * und Netzfehler, wie `docs/08` §3 ihn verlangt. Keine erfundenen Kontaktdaten.
 *
 * Ergänzt mit Briefing 0025 (Kontaktformular): Der Katalog in `docs/06` kannte noch
 * ein Feld „Ihr Name" und eine optionale Nachricht. Der Mock `3.10-kontakt.html`
 * trennt Vor- und Nachnamen und macht die Nachricht zur Pflicht – für diese drei
 * Felder fehlten Meldungen. Sie sind hier nach derselben Regel ergänzt (Sie-Form,
 * ein Satz, benennt den nächsten Schritt, keine Technik). `club` bleibt im Katalog,
 * obwohl „Golfclub oder Anlage" auf `/kontakt` optional ist: der Text wird gebraucht,
 * sobald das Feld irgendwo Pflicht ist, und stammt aus dem freigegebenen Katalog.
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

    // docs/06 Z.79–83, wortgleich.
    club: "Bitte geben Sie den Namen Ihrer Golfanlage an.",
    name: "Bitte geben Sie Ihren Namen an.",
    phone: "Bitte prüfen Sie die Telefonnummer – nur Ziffern, Leerzeichen, + und /.",
    messageLong: "Ihre Nachricht ist etwas zu lang – bitte kürzen Sie sie auf 3000 Zeichen.",
    consent:
      "Bitte bestätigen Sie die Datenschutzerklärung, damit wir Ihre Anfrage bearbeiten dürfen.",

    // Ergänzt mit 0025 (Feldliste aus Mock 3.10).
    vorname: "Bitte geben Sie Ihren Vornamen an.",
    nachname: "Bitte geben Sie Ihren Nachnamen an.",
    message: "Bitte schreiben Sie uns kurz, worum es geht.",
    /** Zu lange Eingabe in einem der kurzen Textfelder (Name, Club). */
    tooLong: "Diese Angabe ist zu lang – bitte kürzen Sie sie.",
  },

  /** Ergebnis nach dem Absenden (Alert ok/err, docs/06 Z.84–89, wortgleich). */
  form: {
    invalid:
      "Das Formular konnte nicht gesendet werden. Bitte prüfen Sie die markierten Felder – oder rufen Sie uns direkt an.",
    network:
      "Die Verbindung wurde unterbrochen. Ihre Eingaben sind noch da – bitte versuchen Sie es noch einmal.",
    server:
      "Das hat leider nicht geklappt. Schreiben Sie uns direkt an info@golfnext.de oder rufen Sie an: 0175 5951839.",
    ratelimit:
      "Sie haben in kurzer Zeit mehrere Anfragen gesendet. Bitte warten Sie einen Moment – oder schreiben Sie an info@golfnext.de.",
    // Erfolg ersetzt das Formular (Titel + Text, docs/06 Z.88–89).
    success: {
      title: "Vielen Dank – Ihre Anfrage ist eingegangen.",
      text: "Fred Hoffmann meldet sich innerhalb eines Werktags persönlich.",
      // Folge-Link zur Buchung (docs/06 §Zustände, „Erfolg"): Wortlaut aus derselben Zeile.
      link: "Oder direkt einen Termin wählen",
    },
  },
} as const;

/** Schlüssel einer Feldmeldung – die Server Action gibt nur Schlüssel zurück, nie Text. */
export type FieldMessageKey = keyof typeof formMessages.field;

/** Schlüssel einer Formularmeldung (Alert über dem Button). */
export type FormMessageKey = "invalid" | "network" | "server" | "ratelimit";
