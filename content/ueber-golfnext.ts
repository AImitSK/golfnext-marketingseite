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
 * - Mit dem finalen Korrekturbriefing (0035) ist der frühere „Pilotclub“-Wortlaut in
 *   Grundsatz /01 entfallen: Der Grundsatz heißt jetzt „Aus dem Cluballtag entwickelt.“
 *   Der Abschnitt „Aus unserer Arbeit im Golf“ (früher „Gemeinsame Projekte“) behauptet
 *   ausdrücklich KEINE aktuelle Plattformnutzung der gezeigten Clubs.
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
  /** Optionale zweite Aktion auf dunkel; seit Briefing 0031 setzt sie keine Seite. */
  ctaSecondary?: Cta;
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
  /**
   * Kachel mit dunklem Grund. Manche Marken liegen nur als helle Schrift auf
   * Dunkel vor (z. B. „enjoygolf“, „Rheingolf“); auf weißem Grund würden sie
   * verschwinden. Solche Kacheln bekommen Navy-Hintergrund und zeigen das Logo
   * ohne Graustufe in voller Farbe.
   */
  dunkel?: boolean;
}

export interface ProjekteData {
  /** Clubs mit freigegebenem Logo. Keine Platzhalter-Kacheln mehr. */
  logos: ClubLogo[];
  /** Zusatzzeile unter den Logos (Briefing 0035). */
  zusatz: string;
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
  ctaPrimary: {
    label: "Erstgespräch anfragen",
    target: "erstgespraech",
  },
  quote: "Wir machen digital. Damit mehr Zeit für das bleibt, was keinen Bildschirm braucht.",
  people: [
    {
      name: "Fred Hoffmann",
      role: "Gründer und PGA Golfprofessional",
      credit: "30 Jahre im Golfmarkt",
    },
    {
      name: "Stefan Kühne",
      role: "Gründer · Online Marketing und Entwicklung",
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
    text: "Online Marketing ist schnell beauftragt. Es wirklich zu verstehen, braucht mehr: Wie greifen Kanäle, Inhalte und Mitgliedergewinnung ineinander? Wir haben Clubbüros in Social Media, Suchmaschinen, Blogartikeln und später im Einsatz von KI geschult.",
  },
  {
    jahr: "2026",
    claim: "Aus „Man müsste mal“ wird Software",
    marke: "GolfNext",
    titel: "Eine Plattform für Website, Mitgliedergewinnung und Cluballtag.",
    text: "Seit 2026 nutzen wir Entwicklung mit KI, um eigene Anwendungen wirtschaftlich umzusetzen, zu Budgets, die auch zu kleineren Golfclubs und Golfanlagen passen. Viele Clubprojekte, viele Erkenntnisse, heute eine Plattform.",
    now: true,
  },
];

// KEIN Grundsatz /02 „Wir versprechen nur, was läuft.“ (Modulstatus, Entscheidung
// Stefan). Die beiden übrigen Grundsätze sind konsistent /01 und /02 nummeriert.
export const ueberGolfnextGrundsaetze: GrundsaetzeData = [
  {
    nummer: "/ 01",
    titel: "Aus dem Cluballtag entwickelt.",
    text: "Jedes Modul entsteht aus einer konkreten Aufgabe im Club. Wir prüfen es im echten Alltag, bevor es andere Clubs nutzen. So wird aus einer guten Idee ein Werkzeug, das wirklich Arbeit abnimmt.",
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
      rolle: "Gründer und PGA Golfprofessional",
      name: "Fred Hoffmann",
      text: "PGA Golfprofessional mit mehr als 30 Jahren Berufserfahrung im Golfmarkt. Kennt Vorstand, Sekretariat und Range aus eigenem Alltag und spricht deshalb nicht wie ein Berater von außen.",
      facts: ["PGA Golfprofessional", "30 Jahre Golfmarkt", "Autor im golfmanager"],
    },
    {
      rolle: "Gründer · Online Marketing und Entwicklung",
      name: "Stefan Kühne",
      text: "Verbindet langjährige Erfahrung im Online Marketing mit technischer Entwicklung. Baut die Plattform, auf der GolfNext läuft, und die Kampagnen, die darüber laufen.",
      facts: ["Online Marketing", "Softwareentwicklung", "Entwicklung mit KI"],
    },
  ],
  partner:
    "Bei Spezialfragen zu Datenschutz und zur Regulierung von KI unterstützen uns erfahrene Fachpartner. Technologiepartner von GolfNext ist SK Online Marketing, Bad Oeynhausen.",
  haltungLead: "Uns begeistert, was Technik möglich macht. Noch mehr begeistert uns,",
  haltungEm: "was Menschen mit der gewonnenen Zeit anfangen.",
  haltungText:
    "Ein gutes Gespräch lässt sich nicht automatisieren. Die Arbeit davor oft schon. Deshalb bauen wir Software, die dem Clubteam die Wiederholung abnimmt, nicht die Beziehung.",
};

/**
 * Freigegebene Club- und Partner-Logos. Erste Charge Stefan 07.09.2026 (die fünf
 * SVG/PNG), zweite Charge Stefan 16.09.2026 (acht weitere). „Münchner Golf
 * Eschenried“ ist mit der zweiten Charge zurück – jetzt liegt ein Logo vor.
 * Zwei Marken („enjoygolf“, „Rheingolf“) liegen als helle Schrift auf Dunkel vor
 * und tragen deshalb `dunkel: true` (Navy-Kachel). Angezeigt werden alle als
 * endloses Band (`LogoMarquee`).
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
    // Zweite Charge freigegebener Marken (Stefan, 16.09.2026). „Golf Club
    // Bremerhaven“ ist ein eigener Club neben „GC Hainmühlen-Bremerhaven“ –
    // beide bleiben nebeneinander.
    {
      name: "Golf Club Bremerhaven",
      datei: "/clubs/golf-club-bremerhaven.jpg",
      breite: 240,
      hoehe: 247,
      rasterHoehe: 62,
    },
    // Breite Illustration (Herrenhaus) ohne Schriftzug – bleibt flacher.
    {
      name: "Golf- und Land-Club Gut Kaden",
      datei: "/clubs/gut-kaden.webp",
      breite: 640,
      hoehe: 320,
      rasterHoehe: 48,
    },
    // Rundes Wappen – jetzt liegt ein Logo vor; der frühere Platzhalter-Verzicht
    // (kein Logo verfügbar) ist damit erledigt.
    {
      name: "Münchner Golf Eschenried",
      datei: "/clubs/muenchner-golf-eschenried.png",
      breite: 150,
      hoehe: 150,
      rasterHoehe: 60,
    },
    // Ovales Badge – braucht etwas Höhe, damit der Schriftzug lesbar bleibt.
    {
      name: "German Golf Academy",
      datei: "/clubs/german-golf-academy.png",
      breite: 161,
      hoehe: 90,
      rasterHoehe: 56,
    },
    {
      name: "Golfschule Stefan Quirmbach",
      datei: "/clubs/golfschule-quirmbach.gif",
      breite: 235,
      hoehe: 152,
      rasterHoehe: 54,
    },
    // Quadratisch mit gestapeltem Schriftzug – höherer Wert wie Gut Häusern.
    {
      name: "Golfplatz Werne a. d. Lippe",
      datei: "/clubs/golfplatz-werne.png",
      breite: 600,
      hoehe: 600,
      rasterHoehe: 66,
    },
    // Helle Wortmarke auf Dunkel – Kachel bekommt Navy-Grund (siehe `dunkel`).
    {
      name: "enjoygolf",
      datei: "/clubs/enjoygolf.png",
      breite: 496,
      hoehe: 128,
      rasterHoehe: 36,
      dunkel: true,
    },
    {
      name: "Rheingolf",
      datei: "/clubs/rheingolf.png",
      breite: 235,
      hoehe: 61,
      rasterHoehe: 30,
      dunkel: true,
    },
  ],
  zusatz: "Erfahrung aus der Golfpraxis. Für den Cluballtag.",
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
  sections: [
    {
      id: "hero",
      eyebrow: "Über GolfNext",
      headline: "Wir hängen am Golf. Nicht am Gestern.",
      text: [
        "Mehr Menschen auf den Platz bringen. Mehr Zeit fürs Clubleben schaffen. Dafür entwickeln wir die GolfNext Plattform: Websites, die Lust auf Golf machen, Marketing, das Menschen erreicht, und digitale Helfer, die dem Clubbüro Arbeit abnehmen.",
      ],
    },
    {
      id: "weg",
      eyebrow: "Unser Weg",
      headline: "Wir wollten Websites bauen. Dann haben wir zugehört.",
      text: [
        "Aus zehn Jahren Arbeit mit Golfclubs wurde erst Beratung, dann Software. Jeder Schritt hat uns näher an die Frage geführt: Was braucht ein Club wirklich?",
      ],
    },
    {
      id: "grundsaetze",
      eyebrow: "Wie wir arbeiten",
      headline: "Zwei Grundsätze, an denen Sie uns messen können.",
      text: ["Wir sind ein kleines Team aus dem Golfmarkt, kein Konzern. Das hat Folgen. Gute, finden wir."],
    },
    {
      id: "menschen",
      eyebrow: "Die Menschen dahinter",
      headline: "Künstliche Intelligenz. Echte Golfverrückte.",
      text: [
        "Zwei Leute, die den Golfmarkt seit Jahrzehnten von innen kennen, einer vom Platz, einer vom Bildschirm.",
      ],
    },
    {
      id: "projekte",
      eyebrow: "Aus unserer Arbeit im Golf",
      headline: "Mit diesen Clubs haben wir bereits zusammengearbeitet.",
      text: [
        "Die hier gezeigten Clubs und Partner kennen unsere Arbeit aus früheren Projekten in Beratung, Marketing und Kommunikation. Diese Erfahrungen fließen heute in GolfNext ein.",
      ],
    },
    {
      id: "wissen",
      eyebrow: "Wissen",
      headline: "Was Golfclubs heute wissen müssen.",
      text: [
        "Fachartikel aus dem golfmanager, Erfahrungen aus unserer Arbeit mit Clubs und klare Antworten auf Fragen zu KI, Digitalisierung, Online Marketing und Cluballtag. Damit jeder Golfclub bessere Entscheidungen treffen kann.",
      ],
    },
    {
      id: "faq",
      eyebrow: "Klarheit vor dem Gespräch",
      headline: "Häufige Fragen zu GolfNext.",
    },
  ],
  footerClose: {
    eyebrow: "GolfNext persönlich kennenlernen",
    headline: "Was könnte GolfNext in Ihrem Club verändern?",
    text: ["Gemeinsam schauen wir auf Ihre Ziele und die größten Hebel für Ihren Club. Dabei klären wir, ob GolfNext zu Ihrem Club passt. Sie bekommen eine ehrliche Einschätzung, keine Verkaufsshow."],
    cta: {
      label: "Erstgespräch anfragen",
      target: "erstgespraech",
    },
    persoenlicheZeile: "Fred Hoffmann, Gründer von GolfNext, seit mehr als 30 Jahren im Golfmarkt",
  },
};
