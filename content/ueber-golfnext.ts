import type { Cta, PageContent } from "./types";

/**
 * Über GolfNext · /ueber-golfnext
 * Quelle der Texte: docs/design-system/mocks/3.8b-ueber-golfnext-neufassung.html
 * (Neufassung v01, von Stefan freigegeben) und Briefing docs/briefings/0019-ueber-golfnext.md.
 * Die alte 3.8-ueber-golfnext.html ist Archiv und wird NICHT verwendet.
 *
 * Regeln (CLAUDE.md / 0019): Texte wortgleich (Zeichensetzung, „…“-Anführungen,
 * en-Dash „–“). Keine erfundenen Zahlen/Versprechen. Porträts, Club-„Logos“ und
 * Artikel-„Bild folgt“ bleiben beschriftete Platzhalter (kein Stock/KI); die
 * „…folgt“-Beschriftungen aus dem Mock bleiben wortgleich.
 *
 * WICHTIG (Entscheidung Stefan, Briefing 0019): KEIN Modulstatus.
 * - Der Grundsatz /02 „Wir versprechen nur, was läuft.“ mit der Aufzählung
 *   „Im Einsatz / Pilot / In Entwicklung“ und der Status-Legende wird NICHT gebaut.
 *   Gebaut werden nur die beiden übrigen Grundsätze; die Überschrift lautet daher
 *   „Zwei Grundsätze …“. Es wird KEIN Ersatz-Grundsatz erfunden. Die beiden Karten
 *   sind konsistent als „/ 01“ und „/ 02“ nummeriert (statt der Mock-Kennungen
 *   /01 und /03), damit „Zwei Grundsätze“ und die Nummerierung zusammenpassen.
 * - Der „Pilotclub“-/Entwicklungspartner-Wortlaut BLEIBT wortgleich (Grundsatz /01
 *   „entsteht in einem Pilotclub“, Abschnitt „Gemeinsame Projekte“ „im Pilot weiter“,
 *   Abschnitt „Wissen“ „aus der Arbeit mit Pilotclubs“). Er beschreibt
 *   Entwicklungspartnerschaften – kein Modul-Status – und steht so bereits live auf
 *   der Startseite.
 *
 * Bild-Platzhalter (kein Stock/KI): Porträts Fred/Stefan als `Portrait`-Platzhalter
 * („Porträt folgt“), Club-„Logos“ und Artikel-„Bild folgt“ als beschriftete
 * Kacheln. Die endgültige Club-Liste, Logos, Freigaben, Porträts sowie Artikel-Titel
 * und -Bilder liefert Fred.
 */

/* ────────────────────────── 1 · Hero (zwei Porträtkarten) ────────────────────────── */

/** Eine Porträtkarte im Hero (Fred/Stefan) – beschrifteter Platzhalter, kein Foto. */
export interface HeroPerson {
  name: string;
  role: string;
  /** Kurzcredit unter dem Namen (Signalgrün auf Navy). */
  credit: string;
}

export interface HeroData {
  ctaPrimary: Cta;
  ctaSecondary: Cta;
  /** Zitatzeile unter den Aktionen (Archivo, grüner linker Balken). */
  quote: string;
  people: HeroPerson[];
}

/* ────────────────────────── 2 · Unser Weg (Zeitleiste) ────────────────────────── */

/** Eine Station der Zeitleiste (imageGolf → Consulting → GolfNext). */
export interface WegStation {
  /** Kurzmarke im Jahres-Pill (z. B. „2016“, „dann“, „2026“). */
  jahr: string;
  /** Kurzclaim neben dem Jahr. */
  claim: string;
  /** Markenname der Stufe. */
  marke: string;
  titel: string;
  text: string;
  /** Die dritte (aktuelle) Station wird als weiße Karte hervorgehoben. */
  now?: boolean;
}

export type WegData = WegStation[];

/* ────────────────────────── 3 · Zwei Grundsätze (Navy-Band) ────────────────────────── */

/** Ein Grundsatz im Navy-Band (Nummer, Titel, Text) – ohne Modulstatus. */
export interface Grundsatz {
  nummer: string;
  titel: string;
  text: string;
}

export type GrundsaetzeData = Grundsatz[];

/* ────────────────────────── 4 · Die Menschen dahinter ────────────────────────── */

/** Eine Personenkarte (Fred/Stefan) mit Porträt-Platzhalter und Fakten-Chips. */
export interface TeamPerson {
  rolle: string;
  name: string;
  text: string;
  facts: string[];
}

export interface MenschenData {
  /** Beschriftung des Porträt-Platzhalters auf den Personenkarten (kein Foto). */
  personen: TeamPerson[];
  /** Partner-/Fachpartner-Zeile unter den Karten. */
  partner: string;
  /** Haltungssatz, zweiteilig: der zweite Teil ist hervorgehoben (blau). */
  haltungLead: string;
  haltungEm: string;
  haltungText: string;
}

/* ────────────────────────── 5 · Gemeinsame Projekte (Logos) ────────────────────────── */

/** Ein freigegebenes Clublogo im Raster „Gemeinsame Projekte“. */
export interface ClubLogo {
  /** Vollständiger Clubname – wird zum Alt-Text der Grafik. */
  name: string;
  /** Pfad der Datei unter `public/clubs`. */
  datei: string;
  /** Originalmaße der Datei – reservieren den Platz und verhindern CLS. */
  breite: number;
  hoehe: number;
  /**
   * Optischer Ausgleich: Höhe im Raster in Pixeln. Eine breite Wortmarke wirkt
   * bei gleicher Höhe viel größer als ein rundes Wappen, deshalb bekommt jedes
   * Logo seinen eigenen Wert statt einer gemeinsamen Deckelung.
   */
  rasterHoehe: number;
}

export interface ProjekteData {
  /** Clubs mit freigegebenem Logo. Keine Platzhalter-Kacheln mehr. */
  logos: ClubLogo[];
  /** Text-Link „…Praxis“ (Ziel /praxis, bis live → #). */
  praxisLink: string;
}

/* ────────────────────────── 6 · Wissen (Artikel-Slider) ────────────────────────── */

/**
 * Der Wissen-Slider zeigt seit Briefing 0029 die **vier neuesten Artikel aus Sanity**
 * (`NEUESTE_POSTS_QUERY`) und verlinkt auf `/praxis/<slug>`. Hier stehen deshalb nur
 * noch die Texte, die zur Seite gehören – keine Karten mehr.
 *
 * Entfallen sind die vier Platzhalterkarten („Titel folgt: …") **samt dem Feld
 * `quelle`**: Die Sonderrolle der beiden Karten „golfmanager · Fachartikel" ist mit
 * der Rubrik **„Fachartikel"** hinfällig, die Stefan am 08.09.2026 im Studio angelegt
 * hat. Freds Fachzeitschriften-Beiträge sind damit ganz normale Artikel; an Stelle der
 * Quelle steht auf der Karte die Rubrik. **Kein Rubrik-Filter** – Auswahl und
 * Reihenfolge steuert Fred über das Veröffentlichungsdatum.
 */
export interface WissenData {
  /**
   * Beschriftung der Bildfläche, solange ein Artikel im Studio kein Titelbild hat
   * (Mock 3.8b `.kcard .kp span`) – wortgleich „Bild folgt".
   */
  bildPlatzhalter: string;
  /** „Alle Artikel“-Link: zeigt auf `path`, solange die Route live ist (sonst `#`). */
  alleArtikel: { label: string; path: string };
}

/* ────────────────────────── Sektionsdaten ────────────────────────── */

export const ueberGolfnextHero: HeroData = {
  ctaPrimary: { label: "Live-Demo ansehen", hint: "ohne Anmeldung", target: "livedemo" },
  ctaSecondary: { label: "Online-Erstgespräch vereinbaren", target: "erstgespraech" },
  quote: "Wir machen digital. Damit mehr Zeit für das bleibt, was keinen Bildschirm braucht.",
  people: [
    {
      name: "Fred Hoffmann",
      role: "Gründer · PGA Golfprofessional",
      credit: "30 Jahre im Golfmarkt",
    },
    {
      name: "Stefan Kühne",
      role: "Online-Marketing und Entwicklung",
      credit: "Technologie",
    },
  ],
};

export const ueberGolfnextWeg: WegData = [
  {
    jahr: "2016",
    claim: "Erst mal ins Netz",
    marke: "imageGolf",
    titel: "Clubwebsites, Social Media, Kampagnen.",
    text: "Mit der Gründung von imageGolf ging es los. Golfclubs bekamen einen digitalen Auftritt. Ihre Angebote ein Publikum.",
  },
  {
    jahr: "dann",
    claim: "Klick gemacht. Fragen offen.",
    marke: "GolfNext Consulting",
    titel: "Zusammenhänge erklären, Clubteams schulen.",
    text: "Online-Marketing ist schnell beauftragt. Es wirklich zu verstehen, braucht mehr: Wie greifen Kanäle, Inhalte und Mitgliedergewinnung ineinander? Wir haben Clubbüros in Social Media, Suchmaschinen, Blogartikeln und später im Einsatz von KI geschult.",
  },
  {
    jahr: "2026",
    claim: "Aus „Man müsste mal“ wird Software",
    marke: "GolfNext",
    titel: "Eine Plattform für Website, Mitgliedergewinnung und Cluballtag.",
    text: "Seit 2026 nutzen wir KI-gestützte Entwicklung, um eigene Anwendungen wirtschaftlich umzusetzen – zu Budgets, die auch zu kleineren Golfclubs und Golfanlagen passen. Viele Clubprojekte, viele Erkenntnisse, heute eine Plattform.",
    now: true,
  },
];

// KEIN Grundsatz /02 „Wir versprechen nur, was läuft.“ (Modulstatus, Entscheidung
// Stefan). Die beiden übrigen Grundsätze sind konsistent /01 und /02 nummeriert.
export const ueberGolfnextGrundsaetze: GrundsaetzeData = [
  {
    nummer: "/ 01",
    titel: "Mit Clubs entwickelt, nicht für sie.",
    text: "Jedes Modul entsteht in einem Pilotclub und wird dort im Alltag getestet – vom Sekretariat, vom Greenkeeper, vom Captain. Erst dann bekommen es andere.",
  },
  {
    nummer: "/ 02",
    titel: "Ein Mensch am Telefon.",
    text: "Ihr Ansprechpartner ist Fred Hoffmann, PGA Golfprofessional. Kein Ticketsystem, keine Hotline. Rückmeldung innerhalb eines Werktags.",
  },
];

export const ueberGolfnextMenschen: MenschenData = {
  personen: [
    {
      rolle: "Gründer · Ihr Ansprechpartner",
      name: "Fred Hoffmann",
      text: "PGA Golfprofessional mit mehr als 30 Jahren Berufserfahrung im Golfmarkt. Kennt Vorstand, Sekretariat und Range aus eigenem Alltag – und spricht deshalb nicht wie ein Berater von außen.",
      facts: ["PGA Golfprofessional", "30 Jahre Golfmarkt", "Autor im golfmanager"],
    },
    {
      rolle: "Technologie · Online-Marketing",
      name: "Stefan Kühne",
      text: "Verbindet langjährige Erfahrung im Online-Marketing mit technischer Entwicklung. Baut die Plattform, auf der GolfNext läuft – und die Kampagnen, die darüber laufen.",
      facts: ["Online-Marketing", "Softwareentwicklung", "KI-gestützte Entwicklung"],
    },
  ],
  partner:
    "Bei Spezialfragen zu Datenschutz und KI-Regulierung unterstützen uns erfahrene Fachpartner. Technologiepartner von GolfNext ist SK Online Marketing, Bad Oeynhausen.",
  haltungLead: "Uns begeistert, was Technik möglich macht. Noch mehr begeistert uns,",
  haltungEm: "was Menschen mit der gewonnenen Zeit anfangen.",
  haltungText:
    "Ein gutes Gespräch lässt sich nicht automatisieren. Die Arbeit davor oft schon. Deshalb bauen wir Software, die dem Clubteam die Wiederholung abnimmt – nicht die Beziehung.",
};

/**
 * Freigegebene Clublogos (Stefan, 07.09.2026). Damit entfallen die fünf
 * „Logo folgt“-Platzhalter und der Vermerk „Logos und Freigaben: Fred liefert
 * die endgültige Liste.“. „Münchner GC Eschenried“ ist entfallen – für diesen
 * Club liegt kein Logo vor, und Platzhalter soll es hier nicht mehr geben.
 */
export const ueberGolfnextProjekte: ProjekteData = {
  logos: [
    // Breite Wortmarke – bleibt bewusst flacher, sonst dominiert sie die Reihe.
    {
      name: "Golfclub Rehburg-Loccum",
      datei: "/clubs/rehburg-loccum.svg",
      breite: 300,
      hoehe: 83,
      rasterHoehe: 46,
    },
    // Rundes Wappen – braucht Höhe, sonst wird die Umschrift unleserlich.
    {
      name: "GC Hainmühlen-Bremerhaven",
      datei: "/clubs/hainmuehlen-bremerhaven.svg",
      breite: 403,
      hoehe: 403,
      rasterHoehe: 62,
    },
    {
      name: "Golfclub Widukind-Land",
      datei: "/clubs/widukind-land.svg",
      breite: 335,
      hoehe: 210,
      rasterHoehe: 54,
    },
    // Wortmarke lautet vollständig „Golfclub Königshof Sittensen“ – der Alt-Text
    // benennt den Club so, wie er im Logo steht (die frühere Platzhalter-Kachel
    // sagte verkürzt „Golfclub Sittensen“).
    {
      name: "Golfclub Königshof Sittensen",
      datei: "/clubs/sittensen.svg",
      breite: 113,
      hoehe: 113,
      rasterHoehe: 62,
    },
    // Hochformat mit Schriftzug unter der Marke – der höchste Wert der Reihe.
    {
      name: "Golfpark Gut Häusern",
      datei: "/clubs/gut-haeusern.png",
      breite: 150,
      hoehe: 172,
      rasterHoehe: 68,
    },
  ],
  praxisLink: "Was diese Clubs mit GolfNext machen – Praxis",
};

export const ueberGolfnextWissen: WissenData = {
  bildPlatzhalter: "Bild folgt",
  // Ziel des „Alle Artikel"-Links: seit 07.09.2026 heißt der Blog `/praxis`;
  // `/ratgeber` gibt es nicht mehr (Briefing 0023). Nur der Pfad ändert sich,
  // das Label bleibt wortgleich. Der Link aktiviert sich über `internalHref`,
  // sobald `/praxis` live ist.
  alleArtikel: { label: "Alle Artikel", path: "/praxis" },
};

export const ueberGolfnext: PageContent = {
  route: "/ueber-golfnext",
  meta: {
    title: "Über GolfNext | Wir hängen am Golf. Nicht am Gestern.",
    description:
      "Von imageGolf zur GolfNext-Plattform: unsere Geschichte, die Menschen dahinter und unser Antrieb für mehr Mitglieder und mehr Zeit fürs Clubleben.",
  },
  sections: [
    {
      id: "hero",
      eyebrow: "Über GolfNext",
      headline: "Wir hängen am Golf. Nicht am Gestern.",
      text: [
        "Mehr Menschen auf den Platz bringen. Mehr Zeit fürs Clubleben schaffen. Dafür entwickeln wir die GolfNext-Plattform: Websites, die Lust auf Golf machen, Marketing, das Menschen erreicht, und digitale Helfer, die dem Clubbüro Arbeit abnehmen.",
      ],
    },
    {
      id: "weg",
      eyebrow: "Unser Weg",
      headline: "Wir wollten Websites bauen. Dann haben wir zugehört.",
      text: [
        "Aus zehn Jahren Arbeit mit Golfclubs wurde erst Beratung, dann Software. Jede Stufe hat die nächste nötig gemacht.",
      ],
    },
    {
      id: "grundsaetze",
      eyebrow: "Wie wir arbeiten",
      headline: "Zwei Grundsätze, an denen Sie uns messen können.",
      text: ["Wir sind ein kleines Team aus dem Golfmarkt, kein Konzern. Das hat Folgen – gute, finden wir."],
    },
    {
      id: "menschen",
      eyebrow: "Die Menschen dahinter",
      headline: "Künstliche Intelligenz. Echte Golfverrückte.",
      text: [
        "Zwei Leute, die den Golfmarkt seit Jahrzehnten von innen kennen – einer vom Platz, einer vom Bildschirm.",
      ],
    },
    {
      id: "projekte",
      eyebrow: "Gemeinsame Projekte",
      headline: "Diese Clubs haben mitgeschrieben.",
      text: [
        "An unserer Geschichte und an der Idee hinter GolfNext. Für sie haben wir Websites gestaltet, Kampagnen umgesetzt und Teams geschult – und mit einigen entwickeln wir die Plattform heute im Pilot weiter.",
      ],
    },
    {
      id: "wissen",
      eyebrow: "Wissen",
      headline: "Was wir über Golfclubs gelernt haben, schreiben wir auf.",
      text: [
        "Fachartikel aus dem golfmanager und Beiträge aus der Arbeit mit Clubs – zum Mitnehmen, auch ohne GolfNext.",
      ],
    },
  ],
  footerClose: {
    eyebrow: "GolfNext persönlich",
    headline: "Was müsste bei Ihnen endlich mal einfacher gehen?",
    text: ["Erzählen Sie es Fred Hoffmann. Vielleicht beginnt genau dort das nächste Kapitel für Ihren Club."],
    cta: {
      label: "Online-Erstgespräch vereinbaren",
      hint: "30 Minuten persönlich per Zoom oder Teams",
      target: "erstgespraech",
    },
    secondary: { label: "Oder zuerst die Live-Demo ansehen", target: "livedemo" },
    persoenlicheZeile: "Fred Hoffmann, Gründer von GolfNext, seit mehr als 30 Jahren im Golfmarkt",
  },
};
