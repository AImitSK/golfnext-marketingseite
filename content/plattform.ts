import type { Cta, PageContent } from "./types";

/**
 * Plattform · /plattform
 * Quelle der Texte: docs/design-system/mocks/3.2c-plattform-neufassung.html
 * (Neufassung v02, von Stefan freigegeben) und Briefing docs/briefings/0016-plattform.md.
 * Die alte 3.2-plattform.html ist Archiv und wird NICHT verwendet.
 *
 * Regeln (CLAUDE.md / 0016): Texte wortgleich (Zeichensetzung, „…"-Anführungen,
 * en-Dash „–", Ziffernabstand „39 €" / „68 %"). Keine erfundenen Zahlen/Versprechen.
 * Die Beispiel-Oberflächen (Browser-Demo, CRM-Liste, KI Chatbot-Chat, Geräterahmen der
 * Scroll-Geschichte) sind ILLUSTRATIV 1:1 aus dem Mock – schematische Darstellungen des
 * Systems, keine Zusagen und keine echten Screenshots. Die einzige echte Kennzahl ist
 * „68 % der Fragen außerhalb der Bürozeiten" (Pilot Golfclub Rehburg-Loccum), wortgleich
 * und als Pilot gekennzeichnet.
 *
 * Modulstatus wird NICHT angezeigt (geteilter Footer, Entscheidung 06.09.). Die Modul-Tags
 * auf den Rollenkarten sind bloße Namens-Labels (kein Status). „Analytics" dort ist ein
 * illustratives Label, kein eigenes Modul.
 */

/* ────────────────────────── 1 · Hero (Bleed-Demo + Platzstatus-Toggle) ────────────────────────── */

export interface HeroTrust {
  text: string;
}

export interface HeroDemo {
  /** Adresszeile der Browser-Demo. */
  url: string;
  /** Navigationslabels der schematischen Club-Website. */
  siteNav: string[];
  /** Titel im Website-Hero-Ausschnitt. */
  siteHeroTitle: string;
  /** Platzstatus-Karte: Vor- und Endzustand (Endzustand steht im Server-HTML). */
  platzstatus: {
    label: string;
    /** Wert vor der Meldung (nur mit JS/ohne Reduced-Motion kurz sichtbar). */
    valueBefore: string;
    /** Endzustand nach der Greenkeeper-Meldung. */
    valueAfter: string;
    timeBefore: string;
    timeAfter: string;
  };
  /** Nebentext-Kachel neben der Platzstatus-Karte. */
  siteText: string;
  /** Greenkeeper-Handy: Toggle „Platz bespielbar". */
  phone: {
    role: string;
    title: string;
    toggleLabel: string;
    okText: string;
  };
}

export interface HeroData {
  ctaPrimary: Cta;
  /** Optionale zweite Aktion auf dunkel; seit Briefing 0031 setzt sie keine Seite. */
  ctaSecondary?: Cta;
  trust: HeroTrust[];
  /** Barrierefreies Label der schematischen Demo (dekorative UI-Ausschnitte sind aria-hidden). */
  ariaLabel: string;
  demo: HeroDemo;
}

export const plattformHero: HeroData = {
  ctaPrimary: {
    label: "Erstgespräch anfragen",
    target: "erstgespraech",
  },
  // Die drei Trust-Aussagen unter dem CTA sind mit dem finalen Korrekturbriefing
  // (0035) ersatzlos entfallen.
  trust: [],
  ariaLabel: "Schematische Darstellung: Der Greenkeeper meldet den Platz als bespielbar, die Club-Website springt auf „Platz bespielbar“.",
  demo: {
    url: "golfclub-musterhausen.de",
    siteNav: ["GC Musterhausen", "Club", "Platz", "Golf lernen", "Greenfee", "Mitglied werden"],
    siteHeroTitle: "Golf beginnt hier.",
    platzstatus: {
      label: "Platzstatus",
      valueBefore: "Wintergrüns",
      valueAfter: "Platz bespielbar",
      timeBefore: "Stand: gestern 16:20 Uhr",
      timeAfter: "Stand: heute 06:40 Uhr",
    },
    siteText: "Schnuppergolf am Samstag – zwei Stunden, alles gestellt.",
    phone: {
      role: "Greenkeeper",
      title: "Platzstatus setzen",
      toggleLabel: "Platz bespielbar",
      okText: "Website aktualisiert · 06:40 Uhr",
    },
  },
};

/* ────────────────────────── 2 · Bento: Drei Dinge, die sich ändern ────────────────────────── */

/** Eine Zeile der illustrativen Marketing CRM-Liste (Box 01). */
export interface CrmRow {
  /** Initialen im Avatar. */
  av: string;
  name: string;
  sub: string;
  status: string;
  /** Status-Farbvariante (b = blau „in Sequenz", sonst grün). */
  statusVariant?: "b";
}

/** Eine Chat-Blase des KI Chatbot-Beispiels (Box 02). */
export interface ChatBubble {
  from: "q" | "a";
  text: string;
}

/** Ein Werkzeug-Label, das zu „GolfNext" zusammenfährt (Box 03). */
export interface MergeTool {
  label: string;
  /** Startposition (aus dem Mock) und Ziel-Translate (--tx/--ty). */
  pos: { left?: string; right?: string; top: string };
  tx: string;
  ty: string;
}

export interface BentoBox {
  no: string;
  title: string;
  text: string;
  viz:
    | { kind: "crm"; rows: CrmRow[] }
    | {
        kind: "chat";
        time: string;
        bubbles: ChatBubble[];
        done: string;
        /** Echte Pilot-Kennzahl, wortgleich, als Pilot gekennzeichnet. */
        pilot: string;
      }
    | { kind: "merge"; tools: MergeTool[]; one: string };
}

export const plattformBento: BentoBox[] = [
  {
    no: "/ 01",
    title: "Mehr Nachfrage für Ihren Club.",
    text: "Website, Kampagnen, Content und CRM arbeiten zusammen. Interessenten werden gezielt weitergeführt und Ihre Maßnahmen bleiben nachvollziehbar.",
    viz: {
      kind: "crm",
      rows: [
        { av: "AB", name: "Anna Berger", sub: "Schnuppergolf · Samstag 10 Uhr", status: "angemeldet" },
        { av: "JK", name: "Jens Kraft", sub: "Platzreife · Erinnerung gesendet", status: "in Sequenz", statusVariant: "b" },
        { av: "FM", name: "Familie Meier", sub: "Mitgliedschaft · Termin vereinbart", status: "Termin" },
        { av: "TS", name: "Tom Schulz", sub: "Greenfee · Gastspiel gebucht", status: "bezahlt" },
      ],
    },
  },
  {
    no: "/ 02",
    title: "Mehr Zeit für persönliche Betreuung.",
    text: "Der KI Chatbot beantwortet viele Routinefragen rund um Öffnungszeiten, Greenfee und Platzreife. Ihr Team gewinnt Zeit für persönliche Betreuung.",
    viz: {
      kind: "chat",
      time: "Sonntag, 21:14 Uhr",
      bubbles: [
        { from: "q", text: "Kann ich morgen als Gast spielen, und was kostet das?" },
        {
          from: "a",
          text: "Ja, gern. Montag ist der Platz ab 8 Uhr für Gäste offen, Greenfee 18 Loch 65 €. Ich reserviere Ihnen eine Startzeit – wann passt es?",
        },
      ],
      done: "Beantwortet, ohne dass jemand im Büro war.",
      pilot: "Im Pilot des Golfclubs Rehburg-Loccum kamen 68 % der Fragen außerhalb der Bürozeiten.",
    },
  },
  {
    no: "/ 03",
    title: "Ein System statt fünf Werkzeuge.",
    text: "Website, Formulare, Inhalte und Kontakte gehören zusammen. Bei GolfNext entsteht ein gemeinsamer Überblick. Ein Login, ein Kontakt, eine Geschichte.",
    viz: {
      kind: "merge",
      tools: [
        { label: "Website", pos: { left: "6%", top: "6%" }, tx: "120px", ty: "80px" },
        { label: "Newsletter-Tool", pos: { right: "8%", top: "4%" }, tx: "-110px", ty: "82px" },
        { label: "Excel-Liste", pos: { left: "10%", top: "44%" }, tx: "110px", ty: "36px" },
        { label: "Facebook-Postfach", pos: { right: "6%", top: "42%" }, tx: "-100px", ty: "38px" },
        { label: "Formulare", pos: { left: "34%", top: "24%" }, tx: "30px", ty: "60px" },
      ],
      one: "GolfNext",
    },
  },
];

/* ────────────────────────── 3 · Rollen-Slider ────────────────────────── */

export interface RolleCard {
  /** Ausrichtung: außen (Wachstum) oder innen (Entlastung) – nur Punkt-Farbe, kein Status. */
  dir: "out" | "in";
  /** Rollen-Label (uppercase), z. B. „Vorstand · Präsidium". */
  label: string;
  name: string;
  /** Frage der Rolle in „…". */
  question: string;
  text: string;
  /** Modul-Namens-Labels (kein Status). */
  mods: string[];
}

// `plattformRollen` (Rollen-Slider) ist mit dem finalen Korrekturbriefing (0035)
// von der Plattform-Seite entfernt worden. Das Interface `RolleCard` bleibt für die
// weiterhin vorhandene Slider-Komponente erhalten.

/* ────────────────────────── 4 · Scroll-Geschichte (entfällt, 0035) ────────────────────────── */

/**
 * Ein Schritt der Scroll-Geschichte. `sn/title/text` sind Websiteinhalt (wortgleich).
 * `device` ist die illustrative Geräte-Darstellung; sie wird sowohl im klebenden
 * Desktop-Rahmen als auch in der gestapelten Mobile-/No-JS-Fassung gezeigt. Die
 * Darstellung folgt der ausführlicheren Desktop-Fassung aus dem Mock (die Mobile-
 * Fassung des Mocks ist eine gekürzte Variante desselben Schritts).
 */
export interface StoryStep {
  sn: string;
  title: string;
  text: string;
  device: StoryDevice;
}

export type StoryDevice =
  | {
      kind: "ad";
      head: string;
      adTitle: string;
      headline: string;
      sub?: string;
      button: string;
    }
  | {
      kind: "form";
      head: string;
      headline: string;
      sub?: string;
      fields: string[];
      button: string;
      tag?: string;
    }
  | {
      kind: "mail";
      head: string;
      mailHead: string;
      headline: string;
      body: string;
      button?: string;
      tag?: string;
    }
  | {
      kind: "crm";
      head: string;
      av: string;
      name: string;
      source: string;
      timeline: { text: string; open?: boolean }[];
      tag?: string;
    };

// `plattformStory` (Scroll-Geschichte „So greift es ineinander") ist mit dem finalen
// Korrekturbriefing (0035) von der Plattform-Seite entfernt worden; die ausführliche
// Journey lebt ausschließlich auf `/plattform/so-arbeitet-golfnext`. Interfaces bleiben
// für die weiterhin vorhandene ScrollStory-Komponente erhalten.

/** Text-Link am Ende der Scroll-Geschichte (Live-Gate über internalHref). */
export interface StoryLink {
  label: string;
  /** Ziel-Route; erst verlinkt, wenn die Route `live` ist, sonst „#". */
  path: string;
}

/* ────────────────────────── 5 · Klare Grenze ────────────────────────── */

export interface GrenzeData {
  paragraphs: string[];
  golfnext: { label: string; items: string[] };
  /** Verbindungslabel zwischen den beiden Seiten (Signalgrün-Band). */
  verbindung: string;
  clubsoftware: { label: string; items: string[] };
  /** Abschlusszeile unter dem Split. */
  abschluss: string;
}

export const plattformGrenze: GrenzeData = {
  paragraphs: [
    "Mitglieder, Startzeiten, Turniere, Beiträge und Abrechnung. Das ist Sache Ihrer Clubsoftware. Und das bleibt so.",
    "GolfNext übernimmt alles davor: Sichtbarkeit, Content, Landingpages, Marketing CRM, Anfragen, Anmeldungen und Kommunikation. Dazu kommen digitale Helfer für den Cluballtag. Wenn aus einem Interessenten ein Mitglied wird, geht es in Ihrer Verwaltung weiter.",
  ],
  golfnext: {
    label: "GolfNext",
    items: [
      "Sichtbarkeit und Anzeigen",
      "Website und Landingpages",
      "Content und Marketing CRM",
      "Anfragen und Kommunikation",
      "KI Chatbot, Platzstatus und Greenfee",
      "Ausgewählte Clubprozesse",
    ],
  },
  verbindung: "Aus Interessent wird Mitglied",
  clubsoftware: {
    label: "Ihre Clubsoftware",
    items: ["Mitgliederverwaltung", "Startzeiten", "Turniere", "Beiträge und Abrechnung"],
  },
  abschluss: "GolfNext begleitet bis zur Mitgliedschaft. Ihre Clubsoftware verwaltet den Clubbetrieb.",
};

/* ────────────────────────── 6 · Plattform auf einen Blick ────────────────────────── */

/**
 * Modul-Übersicht „Plattform auf einen Blick". Mit dem finalen Korrekturbriefing (0035)
 * aus dem Footer in den Hauptinhalt der Plattform-Seite verschoben (direkt nach „Was sich
 * ändert") und erscheint auf der ganzen Website genau einmal – hier. Der Footer zeigt sie
 * nicht mehr. Die Modulnamen und ihre Reihenfolge stehen wortgleich im Briefing.
 */
export interface ModulGruppe {
  label: string;
  /** Signalgrün (Wachstum) oder Sky (Entlastung) – nur Label-Farbe, kein Status. */
  variant: "out" | "in";
  module: string[];
}

export const plattformModulGruppen: ModulGruppe[] = [
  {
    label: "Wachstum nach außen",
    variant: "out",
    module: ["Reach", "Search", "Landingpages", "Marketing CRM", "Lifecycle", "Content"],
  },
  {
    label: "Entlastung nach innen",
    variant: "in",
    module: ["KI Chatbot", "Platzstatus", "Greenfee", "Turnier News", "Firmen-Events", "Captains App"],
  },
];

/** Zentrierter Link unter der Modul-Übersicht auf die Detailseite. */
export const plattformModulLink: StoryLink = {
  label: "So arbeitet GolfNext",
  path: "/plattform/so-arbeitet-golfnext",
};

// Der Bereich „Vier Zusagen" ist mit dem finalen Korrekturbriefing (0035) von der
// Plattform-Seite entfernt worden. Interfaces `Vow`/`ZusagenData` bleiben für die
// weiterhin vorhandene Zusagen-Komponente erhalten.
export interface Vow {
  n: string;
  title: string;
  text: string;
}

export interface ZusagenData {
  vows: Vow[];
  line: string;
}

/* ────────────────────────── Seiten-Content + footerClose ────────────────────────── */

export const plattform: PageContent = {
  route: "/plattform",
  // Briefing 0016 liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx),
  // nur Canonical wird gesetzt (wie Startseite). Nicht erfinden.
  sections: [
    {
      id: "hero",
      eyebrow: "Die GolfNext Plattform",
      headline: "Ihre Website ist ein Schaufenster. Wir machen ein System daraus.",
      text: [
        "Website, Marketing, CRM, Content und ausgewählte Clubprozesse arbeiten bei GolfNext zusammen. Nicht nebeneinander, sondern als verbundenes System. So unterstützt GolfNext Wachstum nach außen und Entlastung nach innen.",
      ],
    },
    {
      id: "bento",
      eyebrow: "Was sich ändert",
      headline: "Drei Dinge, die Ihr Club nach dem Start anders macht.",
      text: [
        "Wachstum nach außen. Entlastung nach innen. Beides kommt aus denselben Bausteinen.",
      ],
    },
    {
      id: "modulblick",
      eyebrow: "Plattform auf einen Blick",
      headline: "Zwölf Module. Zwei Richtungen. Eine Plattform.",
    },
    {
      id: "grenze",
      eyebrow: "Was GolfNext nicht ist",
      headline: "Ihre Clubverwaltung bleibt, wo sie ist.",
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
    // Persönliche Zeile: der Mock zeigt Fred als Ansprechpartner (Name + Rolle) im
    // Abschlussblock. Wortlaut aus dem Mock übernommen (Name + Rolle als eine Zeile).
    persoenlicheZeile: "Fred Hoffmann, Gründer von GolfNext, seit mehr als 30 Jahren im Golfmarkt",
  },
};
