/**
 * Zentrale UI-Microcopys (Briefing 0009 · docs/08-zustaende-und-feedback.md §4).
 *
 * Hier liegen alle Meldungstexte für Leerzustände, Fehlerseiten, Ladeansage und
 * den einen Toast (Cookie-Einstellungen). Komponenten enthalten KEINE freien
 * Meldungstexte, sondern lesen ausschließlich aus diesem Katalog.
 *
 * Tonalität (docs/08 §4): Sie-Form, ein Satz, benennt den nächsten Schritt, keine
 * Technik, keine Ausrufezeichen, kein „Oops". Das sind System-Texte (kein
 * Fred-Marketing) – bewusst knapp gehalten; die echten Seiten (error.tsx,
 * not-found.tsx, Empty-Einsatz) folgen in Phase 2/3.
 */
export const uiMessages = {
  /** sr-only-Ansage am ladenden Container (Skeleton, docs/08 §5). */
  loading: "Inhalte werden geladen",

  /** sr-only-Ansage im Button-Ladezustand (docs/08 §2). */
  sending: "Wird gesendet …",

  /** Einziger Toast der Website: gespeicherte Cookie-Einstellungen (docs/08 §3). */
  toast: {
    cookiesSaved: "Ihre Cookie-Einstellungen sind gespeichert.",
  },

  /** Info-Alert bei einem Modul mit Status „In Entwicklung" (ehrlicher Reifegrad,
      docs/design-system 2.5). Bewusst neutral – keine erfundenen Zahlen oder
      Gründungskonditionen (CLAUDE.md), anders als der Marketing-Text im Mock. */
  moduleInDevelopment:
    "Dieses Modul ist noch in Entwicklung – die verfügbaren Module sehen Sie in der Modulübersicht.",

  /** Leerzustand einer gefilterten Liste (Ratgeber-Filter ohne Treffer, docs/08 §3). */
  empty: {
    title: "Für diesen Filter gibt es noch keine Artikel",
    body: "Sie sehen sich am besten alle Artikel an und grenzen danach neu ein.",
    action: "Alle Artikel ansehen",
  },

  /** Segment-Fehlerseite, wenn Inhalte nicht geladen werden können (error.tsx, Phase 3). */
  error: {
    title: "Diese Inhalte lassen sich gerade nicht laden",
    body: "Bitte laden Sie die Seite in einem Moment noch einmal.",
    action: "Noch einmal versuchen",
  },

  /** 404 – Seite nicht gefunden (not-found.tsx, Phase 3). */
  notFound: {
    title: "Diese Seite gibt es nicht",
    body: "Über die Startseite finden Sie zurück, oder Sie vereinbaren ein Erstgespräch.",
    actionHome: "Zur Startseite",
    actionContact: "Erstgespräch vereinbaren",
  },
} as const;
