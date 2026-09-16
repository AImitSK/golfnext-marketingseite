import type { Cta, PageContent } from "./types";

/**
 * Startseite · /  — Neufassung v01, gebaut aus Mock
 * `docs/design-system/mocks/3.1b-startseite-neufassung.html` (Briefing 0021),
 * textlich nachgezogen mit dem „Finalen Briefing Startseite" (Korrekturbriefing).
 * Sechs Abschnitte: Hero (Bleed-Demo + drei schwebende Karten), „Drei Bausteine"
 * (Bento), „So greift es ineinander" (4-Schritt-Zeitleiste), Pakete (ohne
 * Preise/Summen, Fassung 2), „Vier Zusagen" (Navy-Band + Fred-Zitat) und Ratgeber.
 * Vertrauensleiste und Rollen-Slider sind mit dem Korrekturbriefing ersatzlos
 * entfallen.
 *
 * Regeln (CLAUDE.md): Texte wortgleich aus dem Briefing; keine erfundenen Zahlen/
 * Versprechen; **kein Modulstatus** (Modul-Labels sind reine Namen); Preise
 * werden NIE addiert – der Paketblock zeigt nur Basis + Modulblöcke, die Summe
 * zieht der Leser auf `/pakete`. Beispiel-UI-Werte (Namen, „39 €", „65 €",
 * Artikel-Titel/-Daten) sind illustrativ 1:1 aus dem Mock übernommen und
 * `aria-hidden`; die Praxis-Artikel sind Platzhalter („Bild folgt" wortgleich).
 * „Rehburg-Loccum/Pilotclub"-Wortlaut bleibt erhalten. Wortlaut nur nach neuem
 * Fred-Briefing / Freigabe Stefan ändern.
 */

/* ────────────────────────── 1 · Hero ────────────────────────── */

/** Eine schwebende Karte über der Clubwebsite-Demo (illustrativ, aria-hidden). */
export interface HeroCard {
  kind: "anmeldung" | "concierge" | "toggle";
}

export interface HeroData {
  ctaPrimary: Cta;
  /** Optionale zweite Aktion auf dunkel; seit Briefing 0031 setzt sie keine Seite. */
  ctaSecondary?: Cta;
  trust: string[];
  /** Barrierefreies Label der gesamten Demo (die UI-Ausschnitte sind aria-hidden). */
  ariaLabel: string;
  demo: {
    url: string;
    brand: string;
    nav: string[];
    heroTitle: string;
    heroBadge: string;
    tiles: string[];
    platzstatus: {
      label: string;
      /** Ausgangszustand (ohne JS/Reduced-Motion ist bereits der Endzustand gesetzt). */
      valueStart: string;
      valueOpen: string;
    };
  };
  /** Karte 1: Anmeldung Anna Berger. */
  anmeldung: { av: string; name: string; sub: string; status: string };
  /** Karte 2: KI Chatbot-Chat. */
  concierge: { title: string; frage: string; antwort: string };
  /** Karte 3: Platzstatus-Toggle vom Greenkeeper. */
  toggle: { title: string; sub: string };
}

export const startseiteHero: HeroData = {
  ctaPrimary: {
    label: "Erstgespräch anfragen",
    target: "erstgespraech",
  },
  trust: ["Ihre Domain, Ihre Daten", "Klare Preise. Klare Leistungen.", "Ein Mensch am Telefon"],
  ariaLabel: "Beispiel einer Clubwebsite mit Anmeldung, KI Chatbot-Chat und Platzstatus",
  demo: {
    url: "golfclub-musterhausen.de",
    brand: "GC Musterhausen",
    nav: ["Club", "Platz", "Golf lernen", "Greenfee", "Mitglied werden"],
    heroTitle: "Golf beginnt hier.",
    heroBadge: "Schnuppergolf am Samstag",
    tiles: ["Greenfee & Gastspiel", "Aktuell im Club"],
    platzstatus: {
      label: "Platzstatus",
      valueStart: "Wintergrüns",
      valueOpen: "Platz bespielbar",
    },
  },
  anmeldung: {
    av: "AB",
    name: "Anna Berger",
    sub: "Schnuppergolf · Samstag 10 Uhr · über Instagram",
    status: "angemeldet",
  },
  concierge: {
    title: "KI Chatbot · Sonntag, 21:14 Uhr",
    frage: "Kann ich morgen als Gast spielen?",
    antwort:
      "Ja, gern. Montag ab 8 Uhr, Greenfee 18 Loch 65 €. Soll ich Ihnen den Zahlungslink schicken?",
  },
  toggle: { title: "Platz bespielbar", sub: "Greenkeeper · Handy · 06:40 Uhr" },
};

/* ────────────────────────── 2 · Drei Bausteine (Bento) ────────────────────────── */

/** Illustrative Mikrovisualisierung einer Bento-Box (aria-hidden). */
export type TeilViz =
  | {
      kind: "website";
      url: string;
      picTitle: string;
      rows: { left: string; right: string }[];
      own: string;
    }
  | {
      kind: "crm";
      rows: { av: string; name: string; sub: string; status: string; statusVariant?: "b" }[];
    }
  | {
      kind: "log";
      head: string;
      events: { time: string; text: string; sub: string }[];
      sum: string;
    };

export interface TeilBox {
  no: string;
  title: string;
  text: string;
  /** Interner Teaser-Link (Live-Gate über internalHref). */
  link: { label: string; path: string };
  viz: TeilViz;
}

export const startseiteTeile: TeilBox[] = [
  {
    no: "/ 01",
    title: "Ihre Clubwebsite.",
    text: "Die Website gehört Ihrem Club, läuft unter Ihrer Domain und macht Angebote sichtbar. Jede wichtige Leistung bekommt eine klare Seite mit einem klaren nächsten Schritt.",
    link: { label: "Plattform im Überblick", path: "/plattform" },
    viz: {
      kind: "website",
      url: "golfclub-musterhausen.de/schnuppergolf",
      picTitle: "Schnuppergolf am Samstag",
      rows: [
        { left: "Samstag, 10 Uhr", right: "noch 4 Plätze" },
        { left: "Zwei Stunden, alles gestellt", right: "39 €" },
      ],
      own: "Ihre Domain · Ihre Inhalte · Ihre Kontakte",
    },
  },
  {
    no: "/ 02",
    title: "Neue Golfer finden Ihren Club.",
    text: "Anzeigen bei Instagram, Facebook und Google. Jedes Angebot bekommt eine eigene Seite. Danach folgen automatisch die passenden Nachrichten zur passenden Zeit. So werden aus Interessenten Anmeldungen und aus Anmeldungen Mitglieder. Für Schnuppergolf, Platzreife, Mitgliedschaft, Greenfee und Firmen-Events.",
    link: { label: "Wachstum & Vertrieb", path: "/wachstum-vertrieb" },
    viz: {
      kind: "crm",
      rows: [
        { av: "AB", name: "Anna Berger", sub: "Schnuppergolf · über Instagram", status: "angemeldet" },
        {
          av: "JK",
          name: "Jens Kraft",
          sub: "Platzreife · über Google",
          status: "Erinnerung geplant",
          statusVariant: "b",
        },
        { av: "FM", name: "Familie Meier", sub: "Mitgliedschaft · Gespräch vereinbart", status: "Termin" },
        { av: "TS", name: "Tom Schulz", sub: "Greenfee · online bezahlt", status: "bezahlt" },
      ],
    },
  },
  {
    no: "/ 03",
    title: "Das Büro macht weniger Routine.",
    text: "Fragen beantwortet der KI Chatbot. Der Platzstatus kommt vom Greenkeeper. Gäste bezahlen ihr Greenfee selbst. Turnierberichte werden schneller zu aktuellen Meldungen. Mannschaften aktualisieren ihre eigene Seite. Das Clubbüro bleibt für die Aufgaben frei, bei denen Menschen gebraucht werden.",
    link: { label: "Clubprozesse", path: "/clubprozesse" },
    viz: {
      kind: "log",
      head: "Sonntag · ohne das Büro erledigt",
      events: [
        { time: "06:40", text: "Platz auf „bespielbar“", sub: "Greenkeeper · Platzstatus" },
        { time: "08:15", text: "Greenfee bezahlt und bestätigt", sub: "Gast · Greenfee" },
        { time: "09:02", text: "„Kann ich heute als Gast spielen?“", sub: "KI Chatbot · beantwortet" },
        { time: "17:50", text: "Turnierbericht veröffentlicht", sub: "Turnier News · 3 Kanäle" },
      ],
      sum: "4 Vorgänge · 0 Anrufe im Büro",
    },
  },
];

/* ────────────────────────── 3 · So greift es ineinander (Zeitleiste) ────────────────────────── */

/** Illustratives Geräte-Fenster eines Schritts (aria-hidden). */
export interface WegDevice {
  head: string;
  /** Bild-Platzhalter mit Titel (nur Schritt 1). */
  pic?: string;
  /** Fließtext im Fenster (Schritt 1/3). */
  body?: string[];
  /** Überschrift im Fenster (Schritt 2/3/4). */
  title?: string;
  /** Formularfelder (Schritt 2). */
  fields?: string[];
  /** Grüner Button (Schritt 1/2). */
  button?: string;
  /** Grüner Status-Tag (Schritt 3/4). */
  tag?: string;
}

export interface WegSchritt {
  n: string;
  zeit: string;
  title: string;
  text: string;
  device: WegDevice;
}

export interface WegData {
  schritte: WegSchritt[];
  links: Cta[];
}

export const startseiteWeg: WegData = {
  schritte: [
    {
      n: "01",
      zeit: "Sonntag, 20:14",
      title: "Die Anzeige",
      text: "Eine Anzeige auf Instagram erreicht Menschen im Umkreis von 30 Kilometern. Zum Beispiel mit einem Angebot für Schnuppergolf am Samstag.",
      device: {
        head: "Instagram",
        pic: "Schnuppergolf am Samstag",
        body: ["Zwei Stunden, alles gestellt. 39 €."],
        button: "Platz sichern",
      },
    },
    {
      n: "02",
      zeit: "Sonntag, 20:16",
      title: "Die Anmeldung",
      text: "Drei Felder genügen. Die Anmeldung landet im CRM und die Herkunft der Anzeige bleibt erhalten.",
      device: {
        head: "Landingpage",
        title: "Samstag, 10 Uhr – noch 4 Plätze",
        fields: ["Anna Berger", "anna@…"],
        button: "Anmelden",
      },
    },
    {
      n: "03",
      zeit: "Donnerstag",
      title: "Die Erinnerung",
      text: "Alle wichtigen Informationen für Samstag werden automatisch verschickt. Treffpunkt, Uhrzeit, Kleidung und Ausrüstung stehen rechtzeitig bereit.",
      device: {
        head: "E-Mail · automatisch",
        title: "Was Sie am Samstag erwartet",
        body: ["Bequeme Kleidung reicht. Schläger stellen wir. Treffpunkt Clubhaus, 9:45 Uhr."],
        tag: "Kein Anruf im Büro",
      },
    },
    {
      n: "04",
      zeit: "Vier Wochen später",
      title: "Der nächste Schritt",
      text: "Nach dem Schnupperkurs erhält Anna das passende Angebot zur Platzreife. Aus dem ersten Kontakt wird eine neue Mitgliedschaft.",
      device: {
        head: "Marketing CRM",
        title: "Anna Berger",
        body: ["Schnuppergolf · teilgenommen", "Platzreife · angemeldet"],
        tag: "Die nächsten Schritte laufen automatisch.",
      },
    },
  ],
  links: [
    {
      label: "So arbeitet GolfNext – alle Sequenzen im Detail",
      target: "intern",
      href: "/plattform/so-arbeitet-golfnext",
    },
  ],
};

/* ────────────────────────── 6 · Pakete (Fassung 2, ohne Preise) ────────────────────────── */

/**
 * Teaser eines Pakets auf der Startseite. **Ohne Preise/Summen** – die stehen
 * ausschließlich auf `/pakete`. `base` ist der navyfarbene Sockel mit „+"-Marke;
 * die übrigen Karten tragen Modul-Labels (kein Status).
 */
export interface PaketTeaser {
  base?: boolean;
  role: string;
  name: string;
  text: string;
  mods?: string[];
  /** Abschlusszeile am Fuß der Karte (Basis-Karte: „Ihre Domain, Ihre Inhalte, Ihre Kontakte"). */
  foot?: string;
}

export interface PaketeData {
  cards: PaketTeaser[];
  note: string;
  link: { label: string; path: string };
}

export const startseitePakete: PaketeData = {
  cards: [
    {
      base: true,
      role: "Basis in jedem Paket",
      name: "Ihre Clubwebsite",
      text: "Schnell, modern und unter Ihrer Domain. Technisch betreut und mit eigenen Landingpages für jedes Angebot. Auch einzeln buchbar.",
      foot: "Ihre Domain, Ihre Inhalte, Ihre Kontakte",
    },
    {
      role: "Marketing und Nachfrage",
      name: "Wachstum",
      text: "Anzeigen, Landingpages, passende Blogartikel und automatische Nachrichten. Das Marketing CRM verbindet die Schritte. So wird aus Sichtbarkeit Nachfrage.",
      mods: ["Reach", "Search", "Landingpages", "Marketing CRM", "Lifecycle", "Content"],
    },
    {
      role: "Digitale Clubzentrale",
      name: "Komplett",
      text: "Alles aus Wachstum plus KI Chatbot, Platzstatus, Greenfee, Turnierberichte, Firmenveranstaltungen und Captains App. Je nach Ziel Ihres Clubs entsteht daraus mehr Wachstum nach außen, mehr Entlastung nach innen oder beides zusammen.",
      mods: ["Wachstum", "+ alle Clubprozesse"],
    },
  ],
  note: "Alle Preise finden Sie offen auf der Paketseite. Sie müssen keine Anfrage stellen und kein Angebot anfordern. Das Werbebudget legen Sie selbst fest.",
  link: { label: "Pakete und Preise ansehen", path: "/pakete" },
};

/* ────────────────────────── 5 · Vier Zusagen + Fred ────────────────────────── */

export interface Zusage {
  n: string;
  title: string;
  text: string;
}

export interface ZusagenData {
  vows: Zusage[];
  zitat: { text: string; name: string; role: string };
}

export const startseiteZusagen: ZusagenData = {
  vows: [
    {
      n: "1",
      title: "Ihre Domain, Ihre Daten, Ihr Zugang.",
      text: "Website, Inhalte und Kontakte gehören Ihrem Club. Nicht uns.",
    },
    {
      n: "2",
      title: "Alles mitnehmen.",
      text: "Wenn Sie gehen, bekommen Sie alle Daten in offenen Formaten. Kein Lock-in durch Technik.",
    },
    {
      n: "3",
      title: "Faire Laufzeiten.",
      text: "Klare Vereinbarungen von Anfang an. Sie wissen, welche Leistungen enthalten sind und wie lange die Zusammenarbeit läuft. Wer bleibt, bleibt wegen der Qualität.",
    },
    {
      n: "4",
      title: "Ein Mensch am Telefon.",
      text: "Ihr Ansprechpartner ist Fred Hoffmann, Gründer GolfNext. Kein Ticketsystem.",
    },
  ],
  zitat: {
    text: "Ein gutes Gespräch lässt sich nicht automatisieren. Viele Schritte davor schon.",
    name: "Fred Hoffmann",
    role: "Gründer von GolfNext, PGA Golfprofessional, seit mehr als 30 Jahren im Golfmarkt",
  },
};

/* ────────────────────────── 6 · Ratgeber ────────────────────────── */

/**
 * Der Abschnitt „Ratgeber" zeigt seit Briefing 0029 die **drei neuesten Artikel aus
 * Sanity** (`NEUESTE_POSTS_QUERY`) und verlinkt auf `/praxis/<slug>`. Hier stehen
 * deshalb nur noch die Texte, die zur Seite gehören – keine Artikel mehr.
 *
 * Entfallen sind die drei ausformulierten Teaser aus dem Mock 3.1b: Sie beschrieben
 * Artikel, die es nicht gibt (Titel, Autoren, Daten, Lesezeiten). Erfundene Inhalte
 * bleiben nicht im Repo stehen, sobald es echte gibt (CLAUDE.md).
 */
export interface PraxisData {
  /**
   * Beschriftung der Bildfläche, solange ein Artikel im Studio kein Titelbild hat
   * (Mock 3.1b `.acard .ap span`) – wortgleich „Bild folgt".
   */
  bildPlatzhalter: string;
  link: { label: string; path: string };
}

export const startseitePraxis: PraxisData = {
  bildPlatzhalter: "Bild folgt",
  link: { label: "Zum Ratgeber", path: "/praxis" },
};

/* ────────────────────────── Seiten-Content + footerClose ────────────────────────── */

export const startseite: PageContent = {
  route: "/",
  // Kein Meta-Titel/-Text im Briefing → Root-Default belassen (Feinschliff Phase 6), nicht erfinden.
  sections: [
    {
      id: "hero",
      eyebrow: "Die Plattform für Golfclubs",
      headline: "Mehr Golfer auf dem Platz. Weniger Arbeit im Clubbüro.",
      text: [
        "Eine Clubwebsite sollte heute mehr können als informieren. GolfNext verbindet Website, Kampagnen, Marketing, Kommunikation und Clubprozesse in einem System. So werden aus Besuchern echte Interessenten, aus Interessenten neue Mitglieder und aus aufwendigen Routinen einfache digitale Abläufe.",
      ],
    },
    {
      id: "teile",
      eyebrow: "Was GolfNext ist",
      headline: "Drei Bausteine. Ein System.",
      text: [
        "Eine Website, die Ihrem Club gehört. Kampagnen, die neue Golfer erreichen. Und Abläufe, die ohne das Büro laufen. Jeder Baustein funktioniert für sich. Zusammen wird daraus die digitale Clubzentrale.",
      ],
    },
    {
      id: "weg",
      eyebrow: "So greift es ineinander",
      headline: "Ein Klick auf Instagram. Vier Wochen später ein neues Mitglied.",
      text: [
        "Eine Interessentin sieht eine Anzeige, meldet sich an und erhält automatisch die passenden Informationen. Vier Wochen später ist sie Mitglied. Das Clubbüro bleibt informiert und wird von wiederkehrenden Aufgaben entlastet.",
      ],
    },
    {
      id: "pakete",
      eyebrow: "Pakete",
      headline: "Eine Basis. Dazu genau das, was Ihr Club braucht.",
      text: [
        "Jeder Club startet mit derselben Basis: einer eigenen Clubwebsite, die technisch betreut wird. Darauf bauen die Bereiche auf, die zu Ihren Zielen passen. Wachstum nach außen, Entlastung nach innen oder beides zusammen.",
      ],
    },
    {
      id: "zusagen",
      eyebrow: "Woran Sie uns messen können",
      headline: "Vier Zusagen, die im Vertrag stehen.",
    },
    {
      id: "praxis",
      eyebrow: "Ratgeber",
      headline: "Wissen, das Golfclubs weiterbringt.",
      text: [
        "Praxisberichte, Fachartikel und Inspiration für Golfclubs, die digital besser arbeiten und wachsen wollen.",
      ],
    },
  ],
  footerClose: {
    eyebrow: "GolfNext persönlich kennenlernen",
    headline: "Was könnte GolfNext in Ihrem Club verändern?",
    text: [
      "Gemeinsam schauen wir auf Ihre Ziele und die größten Hebel für Ihren Club. Dabei klären wir, ob GolfNext zu Ihrem Club passt. Sie bekommen eine ehrliche Einschätzung, keine Verkaufsshow.",
    ],
    cta: {
      label: "Erstgespräch anfragen",
      target: "erstgespraech",
    },
    // Wortgleich aus Mock 3.1b `.f-person`: Name (fett) + Rolle, mit Porträt-Platzhalter.
    person: {
      name: "Fred Hoffmann",
      role: "Gründer von GolfNext, seit mehr als 30 Jahren im Golfmarkt",
    },
  },
};
