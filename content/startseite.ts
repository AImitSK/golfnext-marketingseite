import type { RolleCard } from "./plattform";
import type { Cta, PageContent } from "./types";

/**
 * Startseite · /  — Neufassung v01, gebaut aus Mock
 * `docs/design-system/mocks/3.1b-startseite-neufassung.html` (Briefing 0021).
 * Ersetzt die alte Fassung (0013, aus 3.1/3.1a) vollständig. Acht Abschnitte:
 * Hero (Bleed-Demo + drei schwebende Karten), Vertrauensleiste, „Drei Teile"
 * (Bento), Rollen-Slider, „Ein Weg" (4-Schritt-Zeitleiste), Pakete (ohne
 * Preise/Summen, Fassung 2), „Vier Zusagen" (Navy-Band + Fred-Zitat) und Praxis.
 *
 * Regeln (CLAUDE.md): Texte wortgleich aus 3.1b; keine erfundenen Zahlen/
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
  /** Karte 2: Concierge-Chat. */
  concierge: { title: string; frage: string; antwort: string };
  /** Karte 3: Platzstatus-Toggle vom Greenkeeper. */
  toggle: { title: string; sub: string };
}

export const startseiteHero: HeroData = {
  ctaPrimary: {
    label: "Online-Erstgespräch vereinbaren",
    hint: "30 Minuten persönlich per Zoom oder Teams",
    target: "erstgespraech",
  },
  trust: ["Ihre Domain, Ihre Daten", "Keine Knebelverträge", "Ein Mensch am Telefon"],
  ariaLabel: "Beispiel einer Clubwebsite mit Anmeldung, Concierge-Chat und Platzstatus",
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
    title: "Concierge · Sonntag, 21:14 Uhr",
    frage: "Kann ich morgen als Gast spielen?",
    antwort:
      "Ja, gern. Montag ab 8 Uhr, Greenfee 18 Loch 65 €. Soll ich Ihnen den Zahlungslink schicken?",
  },
  toggle: { title: "Platz bespielbar", sub: "Greenkeeper · Handy · 06:40 Uhr" },
};

/* ────────────────────────── 2 · Vertrauensleiste ────────────────────────── */

export interface VertrauenData {
  label: string;
  clubs: string[];
  siegel: string[];
}

export const startseiteVertrauen: VertrauenData = {
  label: "Entwickelt mit",
  clubs: [
    "Golfclub Rehburg-Loccum",
    "GC Hainmühlen-Bremerhaven",
    "Golfclub Widukind-Land",
    "Golfclub Sittensen",
    "Münchner GC Eschenried",
  ],
  siegel: ["Hosting in Deutschland", "Ansprechpartner: PGA Golfprofessional"],
};

/* ────────────────────────── 3 · Drei Teile (Bento) ────────────────────────── */

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
    text: "Schnell, modern, unter Ihrer Domain. Jedes Angebot hat eine eigene Seite mit einer Frage und einer Handlung: anmelden, anfragen, bezahlen. Die Basis in jedem Paket – auch einzeln buchbar.",
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
    text: "Anzeigen bei Instagram, Facebook und Google – für Schnuppergolf, Platzreife, Mitgliedschaft, Greenfee und Firmen-Events. Danach die richtige Nachricht zur richtigen Zeit, automatisch.",
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
        { av: "TS", name: "Tom Schulz", sub: "Greenfee · Gastfee bezahlt", status: "bezahlt" },
      ],
    },
  },
  {
    no: "/ 03",
    title: "Das Büro macht weniger Routine.",
    text: "Fragen beantwortet der Concierge, der Platzstatus kommt vom Greenkeeper, die Gastfee bezahlt der Gast, der Turnierbericht schreibt sich aus der Ergebnisliste. Was bleibt, ist die Arbeit, für die man Menschen braucht.",
    link: { label: "Clubprozesse", path: "/clubprozesse" },
    viz: {
      kind: "log",
      head: "Sonntag · ohne das Büro erledigt",
      events: [
        { time: "06:40", text: "Platz auf „bespielbar“", sub: "Greenkeeper · Platzstatus" },
        { time: "08:15", text: "Gastfee bezahlt und bestätigt", sub: "Gast · Gastfee" },
        { time: "09:02", text: "„Kann ich heute als Gast spielen?“", sub: "Concierge · beantwortet" },
        { time: "17:50", text: "Turnierbericht veröffentlicht", sub: "Turnier-News · 3 Kanäle" },
      ],
      sum: "4 Vorgänge · 0 Anrufe im Büro",
    },
  },
];

/* ────────────────────────── 4 · Rollen-Slider ────────────────────────── */

/** Sechs Rollen (Typ `RolleCard` aus content/plattform – Modul-Tags sind Labels, kein Status). */
export const startseiteRollen: RolleCard[] = [
  {
    dir: "out",
    label: "Vorstand · Präsidium",
    name: "Vorstand",
    question: "„Rechnet sich das?“",
    text: "Mehr Mitglieder, nachvollziehbare Zahlen je Kampagne, überschaubare Kosten ohne Vertragsfalle. Ein Ansprechpartner, der die Branche kennt.",
    mods: ["Reach", "Marketing-CRM", "Pakete"],
  },
  {
    dir: "out",
    label: "Geschäftsführung · Clubmanager",
    name: "Clubmanager",
    question: "„Ich will ein System, nicht fünf Werkzeuge.“",
    text: "Ein Login für Website, Kampagnen, Kontakte und Kommunikation. Jeder Interessent hat eine Geschichte, die alle im Büro sehen.",
    mods: ["Marketing-CRM", "Lifecycle", "Landingpages"],
  },
  {
    dir: "in",
    label: "Sekretariat · Clubbüro",
    name: "Sekretariat",
    question: "„Endlich Zeit für Menschen.“",
    text: "Der Concierge nimmt die Routinefragen, die Gastfee läuft digital, der Platzstatus kommt vom Platz. Was bleibt, ist die Arbeit, für die man Sie braucht.",
    mods: ["Concierge", "Gastfee", "Platzstatus"],
  },
  {
    dir: "in",
    label: "Greenkeeping",
    name: "Greenkeeper",
    question: "„Melden, nicht erklären.“",
    text: "Ein Schalter auf dem Handy: bespielbar, Wintergrüns, gesperrt. Die Website ist in derselben Sekunde aktuell – ohne Anruf im Büro.",
    mods: ["Platzstatus"],
  },
  {
    dir: "out",
    label: "Pro · Golfschule",
    name: "Golflehrer",
    question: "„Volle Kurse, ohne Nachtelefonieren.“",
    text: "Schnuppergolf und Platzreife mit Anmeldung, Erinnerung und dem nächsten Angebot nach dem Kurs – automatisch.",
    mods: ["Landingpages", "Lifecycle", "Content"],
  },
  {
    dir: "in",
    label: "Mannschaft · Turnierleitung",
    name: "Captain",
    question: "„Unser Spieltag soll sichtbar sein.“",
    text: "Ergebnis per App eintragen, Bericht steht auf der Website und in den sozialen Kanälen – ohne dass jemand im Büro tippt.",
    mods: ["Captains App", "Turnier-News"],
  },
];

/* ────────────────────────── 5 · Ein Weg (Zeitleiste) ────────────────────────── */

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
      text: "Instagram, 30 Kilometer um den Club: „Schnuppergolf am Samstag.“",
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
      text: "Drei Felder, fertig. Landet im Marketing-CRM – mit Herkunft der Anzeige.",
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
      text: "Was mitbringen, wo Treffpunkt. Automatisch. Kein Anruf im Sekretariat.",
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
      text: "Nach dem Kurs kam das Angebot zur Platzreife. Anna hat sich angemeldet.",
      device: {
        head: "Marketing-CRM",
        title: "Anna Berger",
        body: ["Schnuppergolf · teilgenommen", "Platzreife · angemeldet"],
        tag: "Das Büro hat nichts getippt",
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
      text: "Schnell, modern, unter Ihrer Domain. Technisch betreut, mit Landingpages für jedes Angebot. Auch einzeln buchbar.",
    },
    {
      role: "Marketing und Nachfrage",
      name: "Wachstum",
      text: "Anzeigen, Landingpages, Marketing-CRM und automatische Nachrichten: Aus Sichtbarkeit werden Anmeldungen, die begleitet werden.",
      mods: ["Reach", "Search", "Landingpages", "Marketing-CRM", "Lifecycle", "Content"],
    },
    {
      role: "Digitale Clubzentrale",
      name: "Komplett",
      text: "Alles aus Wachstum plus Concierge, Platzstatus, Gastfee, Turnier-News, Firmen-Events und Captains App. Wachstum nach außen, Entlastung nach innen.",
      mods: ["Wachstum", "+ alle Clubprozesse"],
    },
  ],
  note: "Alle Preise stehen offen auf der Paketseite – ohne Anfrage, ohne Angebot anfordern. Das Werbebudget legen Sie selbst fest.",
  link: { label: "Pakete und Preise ansehen", path: "/pakete" },
};

/* ────────────────────────── 7 · Vier Zusagen + Fred ────────────────────────── */

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
      text: "Keine Knebelverträge. Wer bleibt, bleibt wegen der Qualität.",
    },
    {
      n: "4",
      title: "Ein Mensch am Telefon.",
      text: "Ihr Ansprechpartner ist Fred Hoffmann, PGA Golfprofessional. Kein Ticketsystem.",
    },
  ],
  zitat: {
    text: "Ein gutes Gespräch lässt sich nicht automatisieren. Die Arbeit davor oft schon.",
    name: "Fred Hoffmann",
    role: "Gründer von GolfNext, PGA Golfprofessional, seit mehr als 30 Jahren im Golfmarkt",
  },
};

/* ────────────────────────── 8 · Praxis ────────────────────────── */

/**
 * Der Abschnitt „Praxis" zeigt seit Briefing 0029 die **drei neuesten Artikel aus
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
  link: { label: "Alle Beiträge", path: "/praxis" },
};

/* ────────────────────────── Seiten-Content + footerClose ────────────────────────── */

export const startseite: PageContent = {
  route: "/",
  // Kein Meta-Titel/-Text im Briefing → Root-Default belassen (Feinschliff Phase 6), nicht erfinden.
  meta: { title: null, description: null },
  sections: [
    {
      id: "hero",
      eyebrow: "Die Plattform für Golfclubs",
      headline: "Mehr Golfer auf dem Platz. Weniger Arbeit im Clubbüro.",
      text: [
        "GolfNext ist eine Clubwebsite, die Anmeldungen annimmt. Kampagnen, die neue Golfer bringen. Und digitale Helfer, die dem Büro die Routine abnehmen. Ein System, das alles zusammenhält – entwickelt mit Golfclubs, betreut von einem PGA Golfprofessional.",
      ],
    },
    {
      id: "teile",
      eyebrow: "Was GolfNext ist",
      headline: "Drei Teile. Ein System.",
      text: [
        "Eine Website, die Ihrem Club gehört. Kampagnen, die neue Golfer bringen. Und Abläufe, die ohne das Büro laufen. Jedes Teil funktioniert allein – zusammen wird daraus die digitale Clubzentrale.",
      ],
    },
    {
      id: "rollen",
      eyebrow: "Für jede Rolle im Club",
      headline: "Jeder im Club hat eine andere Frage. GolfNext hat für jede eine Antwort.",
      text: ["Nach rechts wischen oder mit den Pfeilen blättern."],
    },
    {
      id: "weg",
      eyebrow: "So greift es ineinander",
      headline: "Ein Klick bei Instagram. Vier Wochen später ein Mitglied.",
      text: ["Ein Beispiel, wie es tatsächlich läuft – und wo das Clubbüro dabei nichts tippen muss."],
    },
    {
      id: "pakete",
      eyebrow: "Pakete",
      headline: "Eine Basis. Dazu genau das, was Ihr Club braucht.",
      text: [
        "Jeder Club startet mit derselben Basis: einer eigenen Clubwebsite, die technisch betreut wird. Darauf kommt der Modulblock, der zu Ihren Zielen passt – Wachstum nach außen oder beides zusammen.",
      ],
    },
    {
      id: "zusagen",
      eyebrow: "Woran Sie uns messen können",
      headline: "Vier Zusagen, die im Vertrag stehen.",
    },
    {
      id: "praxis",
      eyebrow: "Praxis",
      headline: "Was in Golfclubs wirklich funktioniert.",
    },
  ],
  footerClose: {
    eyebrow: "GolfNext persönlich kennenlernen",
    headline: "Was könnte GolfNext in Ihrem Club verändern?",
    text: [
      "In 30 Minuten schauen wir gemeinsam auf Ihre Ziele und Ihre größten Hebel – und darauf, ob GolfNext zu Ihrem Club passt. Sie bekommen eine ehrliche Einschätzung, keine Verkaufsshow.",
    ],
    cta: {
      label: "Online-Erstgespräch vereinbaren",
      hint: "30 Minuten persönlich per Zoom oder Teams",
      target: "erstgespraech",
    },
    // Wortgleich aus Mock 3.1b `.f-person`: Name (fett) + Rolle, mit Porträt-Platzhalter.
    person: {
      name: "Fred Hoffmann",
      role: "Gründer von GolfNext, seit mehr als 30 Jahren im Golfmarkt",
    },
  },
};
