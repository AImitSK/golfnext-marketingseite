import type { Cta, PageContent } from "./types";

/**
 * Plattform · /plattform
 * Quelle der Texte: docs/design-system/mocks/3.2c-plattform-neufassung.html
 * (Neufassung v02, von Stefan freigegeben) und Briefing docs/briefings/0016-plattform.md.
 * Die alte 3.2-plattform.html ist Archiv und wird NICHT verwendet.
 *
 * Regeln (CLAUDE.md / 0016): Texte wortgleich (Zeichensetzung, „…"-Anführungen,
 * en-Dash „–", Ziffernabstand „39 €" / „68 %"). Keine erfundenen Zahlen/Versprechen.
 * Die Beispiel-Oberflächen (Browser-Demo, CRM-Liste, Concierge-Chat, Geräterahmen der
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
  ctaSecondary: Cta;
  trust: HeroTrust[];
  /** Barrierefreies Label der schematischen Demo (dekorative UI-Ausschnitte sind aria-hidden). */
  ariaLabel: string;
  demo: HeroDemo;
}

export const plattformHero: HeroData = {
  ctaPrimary: { label: "Live-Demo ansehen", hint: "ohne Anmeldung", target: "livedemo" },
  ctaSecondary: { label: "Online-Erstgespräch vereinbaren", target: "erstgespraech" },
  trust: [
    { text: "Entwickelt mit Golfclubs, nicht für sie" },
    { text: "Ihre Domain, Ihre Daten" },
    { text: "Ansprechpartner: ein PGA Golfprofessional" },
  ],
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

/** Eine Zeile der illustrativen Marketing-CRM-Liste (Box 01). */
export interface CrmRow {
  /** Initialen im Avatar. */
  av: string;
  name: string;
  sub: string;
  status: string;
  /** Status-Farbvariante (b = blau „in Sequenz", sonst grün). */
  statusVariant?: "b";
}

/** Eine Chat-Blase des Concierge-Beispiels (Box 02). */
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
    title: "Mehr Menschen auf dem Platz.",
    text: "Anzeigen, Landingpages und Erinnerungen laufen als ein System. Jeder Interessent bekommt die nächste passende Nachricht – und das Clubbüro sieht, wer wo steht.",
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
    title: "Weniger Telefon im Clubbüro.",
    text: "Öffnungszeiten, Greenfee, Platzreife, Gastspiel – die häufigsten Fragen beantwortet der Concierge. Auch sonntags um 21 Uhr.",
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
    text: "Website, Newsletter-Tool, Excel-Liste, Facebook-Postfach, Formulare – heute nebeneinander. Bei GolfNext ein Login, ein Kontakt, eine Geschichte.",
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

export const plattformRollen: RolleCard[] = [
  {
    dir: "out",
    label: "Vorstand · Präsidium",
    name: "Vorstand",
    question: "„Rechnet sich das?“",
    text: "Mehr Mitglieder, nachvollziehbare Zahlen je Kampagne, überschaubare Kosten ohne Vertragsfalle. Ein Ansprechpartner, der die Branche kennt.",
    mods: ["Reach", "Marketing-CRM", "Analytics"],
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

/* ────────────────────────── 4 · Scroll-Geschichte ────────────────────────── */

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

export const plattformStory: StoryStep[] = [
  {
    sn: "01 · SONNTAG, 20:14",
    title: "Die Anzeige",
    text: "Läuft dort, wo Anfänger abends scrollen: Instagram und Facebook, 30 Kilometer um den Club.",
    device: {
      kind: "ad",
      head: "Instagram",
      adTitle: "Schnuppergolf am Samstag",
      headline: "Zwei Stunden, alles gestellt. 39 €.",
      sub: "Golfclub Musterhausen · Gesponsert",
      button: "Platz sichern",
    },
  },
  {
    sn: "02 · SONNTAG, 20:16",
    title: "Die Anmeldung",
    text: "Drei Felder, fertig. Die Anmeldung landet im Marketing-CRM – mit Name, Termin und Herkunft der Anzeige.",
    device: {
      kind: "form",
      head: "Landingpage · golfclub-musterhausen.de/schnuppergolf",
      headline: "Samstag, 10 Uhr – noch 4 Plätze",
      sub: "Zwei Stunden auf der Range und dem Kurzplatz. Schläger und Bälle stellen wir.",
      fields: ["Anna Berger", "anna.berger@…", "0171 …"],
      button: "Anmelden",
      tag: "landet im Marketing-CRM",
    },
  },
  {
    sn: "03 · DONNERSTAG",
    title: "Vor dem Kurs",
    text: "Zwei Tage vorher: was mitbringen, wo Treffpunkt, was passiert. Kein Anruf im Sekretariat.",
    device: {
      kind: "mail",
      head: "E-Mail · Donnerstag · automatisch",
      mailHead: "An: anna.berger@… · Betreff: Was Sie am Samstag erwartet",
      headline: "Bequeme Kleidung reicht. Schläger stellen wir.",
      body: "Treffpunkt Clubhaus, 9:45 Uhr. Ihr Trainer ist Fred Hoffmann. Bei Regen verschieben wir – Sie bekommen rechtzeitig Bescheid.",
      tag: "Kein Anruf im Sekretariat",
    },
  },
  {
    sn: "04 · SAMSTAG, 18:00",
    title: "Nach dem Kurs",
    text: "Am selben Abend, mit dem passenden nächsten Angebot: die Platzreife in vier Terminen.",
    device: {
      kind: "mail",
      head: "E-Mail · Samstag, 18:00 · automatisch",
      mailHead: "An: anna.berger@… · Betreff: Hat es Spaß gemacht?",
      headline: "So geht es weiter: die Platzreife in vier Terminen.",
      body: "Nächster Start: Samstag in zwei Wochen, 10 Uhr. Vier Termine, danach dürfen Sie auf den Platz.",
      button: "Termine ansehen",
    },
  },
  {
    sn: "05 · VIER WOCHEN SPÄTER",
    title: "Der nächste Schritt",
    text: "Anmeldung zur Platzreife. Das Clubbüro hat bis hierher nichts getippt – und sieht trotzdem alles.",
    device: {
      kind: "crm",
      head: "Marketing-CRM",
      av: "AB",
      name: "Anna Berger",
      source: "Quelle: Instagram · Schnuppergolf-Kampagne",
      timeline: [
        { text: "Schnuppergolf · teilgenommen" },
        { text: "Erinnerung · geöffnet" },
        { text: "Platzreife · angemeldet" },
        { text: "Mitgliedschaft · nächster Schritt", open: true },
      ],
      tag: "Das Clubbüro hat nichts getippt",
    },
  },
];

/** Zwei Text-Links am Ende der Scroll-Geschichte (Live-Gate über internalHref). */
export interface StoryLink {
  label: string;
  /** Ziel-Route; erst verlinkt, wenn die Route `live` ist, sonst „#". */
  path: string;
}

export const plattformStoryLinks: StoryLink[] = [
  { label: "So arbeitet GolfNext – alle Sequenzen im Detail", path: "/plattform/so-arbeitet-golfnext" },
  { label: "Wie ein Club so seinen Schnupperkurs gefüllt hat", path: "/praxis" },
];

/* ────────────────────────── 5 · Klare Grenze ────────────────────────── */

export interface GrenzeData {
  paragraph: string;
  golfnext: { label: string; items: string[] };
  clubverwaltung: { label: string; items: string[] };
}

export const plattformGrenze: GrenzeData = {
  paragraph:
    "Mitglieder, Startzeiten, Turniere, Beiträge – das ist Sache Ihrer Clubverwaltungssoftware, und das bleibt so. GolfNext übernimmt alles davor: Sichtbarkeit, Anfragen, Anmeldungen, Kommunikation. Und verbindet sich mit Ihrer Verwaltung dort, wo es Ihnen Arbeit spart – zum Beispiel, wenn aus einem Interessenten ein Mitglied wird.",
  golfnext: {
    label: "GolfNext",
    items: [
      "Sichtbarkeit und Anzeigen",
      "Anfragen und Anmeldungen",
      "Kommunikation mit Interessenten und Gästen",
      "Concierge, Platzstatus, Gastfee, Turnier-News",
    ],
  },
  clubverwaltung: {
    label: "Ihre Clubverwaltung",
    items: ["Mitgliederstammdaten", "Startzeiten", "Turnierverwaltung", "Beiträge und Abrechnung"],
  },
};

/* ────────────────────────── 6 · Vier Zusagen ────────────────────────── */

export interface Vow {
  n: string;
  title: string;
  text: string;
}

export interface ZusagenData {
  vows: Vow[];
  /** Schlusszeile; „Freigabe Fred ausstehend" wortgleich aus dem Mock übernommen, nichts ergänzt. */
  line: string;
}

export const plattformZusagen: ZusagenData = {
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
  line: "Hosting in Frankfurt, DSGVO-konform, Zugriffsrechte je Rolle. Kündigungsfrist und angebundene Clubverwaltungen: Freigabe Fred ausstehend.",
};

/* ────────────────────────── Seiten-Content + footerClose ────────────────────────── */

export const plattform: PageContent = {
  route: "/plattform",
  // Briefing 0016 liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx),
  // nur Canonical wird gesetzt (wie Startseite). Nicht erfinden.
  meta: { title: null, description: null },
  sections: [
    {
      id: "hero",
      eyebrow: "Die GolfNext-Plattform",
      headline: "Ihre Website ist ein Schaufenster. Wir machen ein System daraus.",
      text: [
        "Ein System, das neue Golfer zu Ihrem Club führt, aus Interessenten Mitglieder macht – und dem Clubbüro die Routine abnimmt. Website, Kampagnen, Marketing-CRM und die digitalen Helfer für den Cluballtag arbeiten bei GolfNext zusammen, nicht nebeneinander.",
      ],
    },
    {
      id: "bento",
      eyebrow: "Was sich ändert",
      headline: "Drei Dinge, die Ihr Club nach dem Start anders macht.",
      text: [
        "Vorstände wollen Mitglieder. Das Clubbüro will weniger Telefon. Beides kommt aus denselben Bausteinen.",
      ],
    },
    {
      id: "rollen",
      eyebrow: "Für jede Rolle im Club",
      headline: "Jeder im Club hat eine andere Frage. GolfNext hat für jede eine Antwort.",
      text: ["Nach rechts wischen oder mit den Pfeilen blättern."],
    },
    {
      id: "story",
      eyebrow: "So greift es ineinander",
      headline: "Ein Klick bei Instagram. Vier Wochen später ein Mitglied.",
      text: [
        "Ein Beispiel, wie es tatsächlich läuft – vom Schnuppergolf bis zur Platzreife. Scrollen Sie mit.",
      ],
    },
    {
      id: "grenze",
      eyebrow: "Was GolfNext nicht ist",
      headline: "Ihre Clubverwaltung bleibt, wo sie ist.",
    },
    {
      id: "zusagen",
      eyebrow: "Woran Sie uns messen können",
      headline: "Vier Zusagen, die im Vertrag stehen.",
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
    secondary: { label: "Oder zuerst die Live-Demo ansehen", target: "livedemo" },
    // Persönliche Zeile: der Mock zeigt Fred als Ansprechpartner (Name + Rolle) im
    // Abschlussblock. Wortlaut aus dem Mock übernommen (Name + Rolle als eine Zeile).
    persoenlicheZeile: "Fred Hoffmann, Gründer von GolfNext, seit mehr als 30 Jahren im Golfmarkt",
  },
};
