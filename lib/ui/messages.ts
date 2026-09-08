/**
 * Zentrale UI-Microcopys (Briefing 0009 · docs/08-zustaende-und-feedback.md §4).
 *
 * Hier liegen alle Meldungstexte für Leerzustände, Fehlerseiten, Ladeansage und
 * den einen Toast (Cookie-Einstellungen). Komponenten enthalten KEINE freien
 * Meldungstexte, sondern lesen ausschließlich aus diesem Katalog.
 *
 * Tonalität (docs/08 §4): Sie-Form, ein Satz, benennt den nächsten Schritt, keine
 * Technik, keine Ausrufezeichen, kein „Oops". Das sind System-Texte (kein
 * Fred-Marketing) – bewusst knapp gehalten. `notFound`, `error` und `platzhalter`
 * tragen seit Briefing 0022 die echten Seiten (`app/not-found.tsx`,
 * `app/(site)/error.tsx`, `components/site/PlatzhalterSeite.tsx`); der
 * `Empty`-Einsatz folgt mit dem Ratgeber-Filter in Phase 3.
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

  /**
   * Platzhalterseite für Routen, die es schon gibt, aber noch keinen Inhalt haben
   * (nur noch `/praxis` – Briefing 0022, gekürzt mit 0023 und 0025). Bewusst ohne
   * Zeitangabe und ohne Marketing-Zeile: die Seite sagt nur, dass hier noch nichts
   * steht, und zeigt den Weg zurück. Die `<h1>` ist das `label` der Route aus
   * `config/site-structure.ts` und steht deshalb nicht in diesem Katalog.
   */
  platzhalter: {
    eyebrow: "In Arbeit",
    body: "Dieser Bereich entsteht gerade. Sobald die Inhalte stehen, finden Sie sie hier.",
    actionHome: "Zur Startseite",
  },

  /** Segment-Fehlerseite, wenn Inhalte nicht geladen werden können (error.tsx, Phase 3). */
  error: {
    title: "Diese Inhalte lassen sich gerade nicht laden",
    body: "Bitte laden Sie die Seite in einem Moment noch einmal.",
    action: "Noch einmal versuchen",
  },

  /**
   * Praxis (Briefing 0027, Masterplan 3.4). Leerzustände der drei Sanity-Routen.
   * Beim Bauen ist das Dataset leer – der Leerzustand ist hier der Normalfall, nicht
   * der Ausnahmefall. Tonalität wie überall (docs/08 §4): Sie-Form, ein Satz, Ausweg
   * benannt, keine Technik, keine Ausrufezeichen – und **keine Ankündigung** („bald
   * mehr", „demnächst"): wann der erste Beitrag erscheint, weiß hier niemand.
   */
  praxis: {
    /** `/praxis` ohne einen einzigen veröffentlichten Artikel. */
    leer: {
      title: "Hier steht noch kein Beitrag",
      body: "Sehen Sie sich so lange die Plattform an oder sprechen Sie uns direkt an.",
      action: "Plattform ansehen",
    },
    /** `/praxis/thema/<slug>` – die Rubrik gibt es, sie ist nur noch leer. */
    leerRubrik: {
      title: "In dieser Rubrik steht noch kein Beitrag",
      body: "In der Übersicht finden Sie alle Rubriken, in denen schon etwas steht.",
      action: "Alle Beiträge ansehen",
    },
  },

  /** 404 – Seite nicht gefunden (not-found.tsx, Phase 3). */
  notFound: {
    title: "Diese Seite gibt es nicht",
    body: "Über die Startseite finden Sie zurück, oder Sie vereinbaren ein Erstgespräch.",
    actionHome: "Zur Startseite",
    actionContact: "Erstgespräch vereinbaren",
  },
} as const;
