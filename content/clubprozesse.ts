import type { Cta, PageContent } from "./types";

/**
 * Clubprozesse · /clubprozesse
 * Quelle der Texte: docs/design-system/mocks/3.5b-clubprozesse-neufassung.html
 * (Neufassung v01, von Stefan freigegeben) und Briefing docs/briefings/0018-clubprozesse.md.
 * Die alte 3.5-clubprozesse.html ist Archiv und wird NICHT verwendet.
 *
 * Regeln (CLAUDE.md / 0018): Texte wortgleich (Zeichensetzung, „…"-Anführungen,
 * en-Dash „–", Ziffernabstand „06:40 Uhr" / „65 €" / „24 °C"). Keine erfundenen
 * Zahlen/Versprechen/Funktionen. Die Beispiel-Oberflächen (Clubwebsite mit
 * Platzstatus + News, Sonntags-Log, Concierge-Chat, Platzstatus-Toggle,
 * Gastfee-Zahlung, Bericht-Strecke, Captains-App-Demo) sind ILLUSTRATIV 1:1 aus
 * dem Mock – schematische Darstellungen des Systems, keine Zusagen und keine echten
 * Screenshots. Beispielwerte (Namen, Uhrzeiten, „65 €", „5 : 3", „38 Pkt.",
 * Ortsnamen) sind Beispieloberfläche, keine Zusage.
 *
 * WICHTIG (Entscheidung Stefan, Briefing 0018): Der MODULSTATUS wird NICHT angezeigt.
 * Die Status-Badges des Mocks (`.stat pilot/dev` „Pilot/Im Einsatz/In Entwicklung"),
 * die dev-Auszeichnung der `.m`-Tags in „Was bleibt" und die Zeile „Stand je Modul
 * wie im Footer: …" sind hier bewusst NICHT enthalten. Module werden als verfügbar
 * dargestellt (konsistent mit Navi/Footer). Die Modul-Namen bleiben als Labels.
 * AUSNAHME: Die freigegebene Praxis-Zeile „Im Pilot des Golfclubs Rehburg-Loccum
 * kamen 68 % der Fragen außerhalb der Bürozeiten." bleibt wortgleich – das ist ein
 * Fallbeispiel, kein Modul-Status.
 */

/* ────────────────────────── 1 · Hero (Clubwebsite + Sonntags-Log) ────────────────────────── */

export interface HeroTrust {
  text: string;
}

/** Eine „Aktuell im Club"-News-Karte in der Browser-Demo. */
export interface NewsItem {
  title: string;
  meta: string;
}

/** Eine Zeile des Sonntags-Logs auf dem Handy (Uhrzeit + Vorgang + Quelle). */
export interface LogEvent {
  time: string;
  text: string;
  source: string;
}

export interface HeroDemo {
  /** Adresszeile der Browser-Demo. */
  url: string;
  site: {
    /** Clubname im Website-Kopf. */
    brand: string;
    /** Navigationspunkte der Clubwebsite. */
    nav: string[];
    platzLabel: string;
    pstatLabel: string;
    /** Ausgangswert (nur transient mit JS sichtbar). */
    pstatStartValue: string;
    pstatStartTime: string;
    /** Endzustand (Server-HTML, ohne JS / reduzierte Bewegung sofort sichtbar). */
    pstatValue: string;
    pstatTime: string;
    newsLabel: string;
    news: NewsItem[];
  };
  /** Sonntags-Log auf dem Handy. */
  log: {
    head: string;
    title: string;
    events: LogEvent[];
    sum: string;
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

export const clubprozesseHero: HeroData = {
  ctaPrimary: {
    label: "Online-Erstgespräch vereinbaren",
    hint: "30 Minuten persönlich per Zoom oder Teams",
    target: "erstgespraech",
  },
  trust: [
    { text: "Das Clubteam behält die Kontrolle" },
    { text: "Persönliches bleibt persönlich" },
    { text: "Nichts ersetzt Ihre Clubverwaltung" },
  ],
  ariaLabel:
    "Schematische Darstellung: Auf der Clubwebsite werden Platzstatus und „Aktuell im Club“ aktuell, während das Clubbüro-Handy die Sonntagsvorgänge protokolliert – fünf Vorgänge, null Anrufe im Büro.",
  demo: {
    url: "golfclub-musterhausen.de/aktuell",
    site: {
      brand: "GC Musterhausen",
      nav: ["Club", "Platz", "Aktuell", "Greenfee", "Mannschaften"],
      platzLabel: "Platz",
      pstatLabel: "Platzstatus",
      pstatStartValue: "Wintergrüns",
      pstatStartTime: "Stand: gestern 16:20 Uhr",
      pstatValue: "Platz bespielbar",
      pstatTime: "Stand: heute 06:40 Uhr",
      newsLabel: "Aktuell im Club",
      news: [
        { title: "Monatsbecher September: Sieg für Petra Lange", meta: "Turnier-News · Samstag, 17:50 Uhr" },
        { title: "Herren AK 50 gewinnen 5:3 in Sittensen", meta: "Mannschaften · Samstag, 18:30 Uhr" },
        { title: "Greenfee-Sonntag: Platz für Gäste geöffnet", meta: "Club · Sonntag, 06:40 Uhr" },
      ],
    },
    log: {
      head: "Clubbüro · Sonntag",
      title: "Heute ohne das Büro erledigt",
      events: [
        { time: "06:40", text: "Platz auf „bespielbar“", source: "Greenkeeper · Platzstatus" },
        { time: "08:15", text: "Gastfee bezahlt und bestätigt", source: "T. Schulz · Gastfee" },
        { time: "09:02", text: "„Kann ich heute als Gast spielen?“", source: "Concierge · beantwortet" },
        { time: "17:50", text: "Turnierbericht veröffentlicht", source: "Turnier-News · 3 Kanäle" },
        { time: "18:30", text: "Spieltag Herren AK 50 online", source: "Captain · Captains App" },
      ],
      sum: "5 Vorgänge · 0 Anrufe im Büro",
    },
  },
};

/* ────────────────────────── 2 · Drei Dinge (Bento) ────────────────────────── */

/** Eine Chatblase im Concierge-Visual (Frage/Antwort). */
export interface ChatBubble {
  role: "q" | "a";
  text: string;
}

export interface DingBox {
  no: string;
  title: string;
  text: string;
  /** Präfix vor dem Modul-Label („Modul"). */
  modPrefix: string;
  /** Modul-Namens-Label, fett (kein Status). */
  modName: string;
  viz:
    | {
        kind: "concierge";
        time: string;
        bubbles: ChatBubble[];
        confirm: string;
        /** Freigegebenes Praxisbeispiel (kein Modul-Status), bleibt wortgleich. */
        praxis: string;
      }
    | {
        kind: "platzstatus";
        rowTitle: string;
        rowSub: string;
        arrow: string;
        webLabel: string;
        pstatLabel: string;
        pstatValue: string;
        pstatTime: string;
      }
    | {
        kind: "gastfee";
        payLabel: string;
        rows: { left: string; right: string }[];
        button: string;
        ok: string;
        sub: string;
      };
}

export const clubprozesseDinge: DingBox[] = [
  {
    no: "/ 01",
    title: "Fragen beantwortet der Concierge.",
    text: "Öffnungszeiten, Greenfee, Platzreife, Gastspiel, Mitgliedschaft: Die häufigsten Fragen bekommen sofort eine Antwort und den passenden nächsten Schritt – auch sonntags um 21 Uhr. Was persönlich ist, geht ans Clubteam.",
    modPrefix: "Modul",
    modName: "Concierge",
    viz: {
      kind: "concierge",
      time: "Sonntag, 21:14 Uhr",
      bubbles: [
        { role: "q", text: "Kann ich morgen als Gast spielen, und was kostet das?" },
        {
          role: "a",
          text: "Ja, gern. Montag ist der Platz ab 8 Uhr für Gäste offen, Greenfee 18 Loch 65 €. Die Gastfee können Sie direkt hier bezahlen – soll ich Ihnen den Link schicken?",
        },
      ],
      confirm: "Beantwortet, ohne dass jemand im Büro war.",
      praxis: "Im Pilot des Golfclubs Rehburg-Loccum kamen 68 % der Fragen außerhalb der Bürozeiten.",
    },
  },
  {
    no: "/ 02",
    title: "Der Platzstatus kommt vom Platz.",
    text: "Der Greenkeeper stellt morgens um halb sieben den Platz vom Handy auf bespielbar, Wintergrüns oder gesperrt. Die Website ist in derselben Sekunde aktuell. Kein Anruf, keine Rückfrage, kein Zettel im Büro.",
    modPrefix: "Modul",
    modName: "Platzstatus",
    viz: {
      kind: "platzstatus",
      rowTitle: "Platz bespielbar",
      rowSub: "Greenkeeper · Handy · 06:40 Uhr",
      arrow: "↓ derselbe Augenblick",
      webLabel: "Clubwebsite",
      pstatLabel: "Platzstatus",
      pstatValue: "Platz bespielbar",
      pstatTime: "Stand: heute 06:40 Uhr · Sommergrüns, Trolleys erlaubt",
    },
  },
  {
    no: "/ 03",
    title: "Die Gastfee bezahlt der Gast selbst.",
    text: "Gäste sehen, ob und wann sie spielen können, bezahlen online und bekommen sofort die Bestätigung – unabhängig davon, ob das Büro besetzt ist. Im Büro bleibt nichts liegen, was abgetippt werden müsste.",
    modPrefix: "Modul",
    modName: "Gastfee",
    viz: {
      kind: "gastfee",
      payLabel: "Gastfee · Golfclub Musterhausen",
      rows: [
        { left: "Montag, 09:30 Uhr · 18 Loch", right: "65 €" },
        { left: "Tom Schulz · HCP 18,4", right: "DGV-Ausweis geprüft" },
      ],
      button: "Jetzt bezahlen",
      ok: "Bezahlt · Bestätigung per E-Mail unterwegs",
      sub: "Für das Clubbüro: ein Eintrag in der Liste, nichts zu tun.",
    },
  },
];

/* ────────────────────────── 3 · Turnier-News (Bericht-Strecke) ────────────────────────── */

/** Eine erkannte Ergebniszeile im PDF-Eingang. */
export interface ResultRow {
  klasse: string;
  name: string;
  /** Grüner „erkannt"-Tag. */
  tag: string;
}

/** Ein Angaben-Feld (Label + Beispielwert). */
export interface AngabeField {
  label: string;
  value: string;
}

/** Eine der drei Ausgaben (Website · Facebook · Instagram). */
export interface TrackOut {
  channel: string;
  /** Grüner „veröffentlicht"-Tag. */
  tag: string;
  /** Bild-Platzhalter vorhanden? (Website/Instagram ja, Facebook nein). */
  pic: boolean;
  title: string;
  text: string;
}

export interface TurnierNewsData {
  step1: {
    label: string;
    sub: string;
    frameHead: string;
    pdfName: string;
    pdfSource: string;
    rows: ResultRow[];
  };
  step2: {
    label: string;
    sub: string;
    frameHead: string;
    fields: AngabeField[];
    /** Tonalitäts-Chips; genau eine ist ausgewählt (`sel`). */
    tone: { label: string; sel?: boolean }[];
    button: string;
  };
  outs: TrackOut[];
  trackline: string;
}

export const clubprozesseTurnierNews: TurnierNewsData = {
  step1: {
    label: "01",
    sub: "Ergebnisliste hochladen",
    frameHead: "Eingang",
    pdfName: "Monatsbecher_September.pdf",
    pdfSource: "aus der Turniersoftware",
    rows: [
      { klasse: "Netto Klasse A", name: "P. Lange · 38 Pkt.", tag: "erkannt" },
      { klasse: "Netto Klasse B", name: "J. Kraft · 36 Pkt.", tag: "erkannt" },
      { klasse: "Brutto", name: "M. Weber · 31 Pkt.", tag: "erkannt" },
    ],
  },
  step2: {
    label: "02",
    sub: "Drei Angaben ergänzen",
    frameHead: "Angaben",
    fields: [
      { label: "Wetter", value: "sonnig, 24 °C" },
      { label: "Platz", value: "schnelle Grüns" },
      { label: "Sponsor", value: "Autohaus Meier" },
    ],
    tone: [{ label: "sachlich" }, { label: "lebendig", sel: true }, { label: "persönlich" }],
    button: "Bericht erstellen",
  },
  outs: [
    {
      channel: "Website",
      tag: "veröffentlicht",
      pic: true,
      title: "Monatsbecher September: Petra Lange gewinnt",
      text: "Vollständiger Bericht mit allen Klassen und Bildergalerie.",
    },
    {
      channel: "Facebook",
      tag: "veröffentlicht",
      pic: false,
      title: "Was für ein Samstag auf dem Platz! Petra Lange holt sich den Monatsbecher …",
      text: "Eigene Fassung mit Hauptbild und den Siegern.",
    },
    {
      channel: "Instagram",
      tag: "veröffentlicht",
      pic: true,
      title: "Monatsbecher ⛳ Glückwunsch Petra!",
      text: "Kurz, bildgeführt, quadratisch.",
    },
  ],
  trackline:
    "Vor der Veröffentlichung sieht der Club jeden Text in der Vorschau und kann ihn ändern. Was nicht eindeutig erkannt wurde, ist markiert. Nichts geht ohne Freigabe raus.",
};

/* ────────────────────────── 4 · Captains App (Spieltag → Website) ────────────────────────── */

/** Ein Formularfeld in der Captains-App-Demo. */
export interface CapField {
  label: string;
  value: string;
  /** Reiner Bild-Platzhalter (ohne Label/Wert). */
  img?: boolean;
}

/** Eine Zeile der Spieltagsliste auf der Mannschaftsseite. */
export interface TeamRow {
  title: string;
  /** Ergebnis oder Datum; entfällt bei der neuen (getaggten) Zeile. */
  value?: string;
  /** Grüner „neu"-Tag für die frisch veröffentlichte Zeile. */
  tag?: string;
}

export interface CaptainsAppData {
  phone: {
    head: string;
    title: string;
    fields: CapField[];
    button: string;
    done: string;
  };
  team: {
    url: string;
    title: string;
    season: string;
    post: {
      title: string;
      score: string;
      text: string;
      by: string;
    };
    rows: TeamRow[];
  };
  capnote: string;
}

export const clubprozesseCaptainsApp: CaptainsAppData = {
  phone: {
    head: "Captain · Herren AK 50",
    title: "Spieltag 3 · Auswärts",
    fields: [
      { label: "Gegner", value: "GC Sittensen" },
      { label: "Ergebnis", value: "5 : 3 Sieg" },
      { label: "", value: "", img: true },
      { label: "„Starker Tag von Michael Weber …“", value: "Bericht" },
    ],
    button: "Veröffentlichen",
    done: "Auf der Website · 18:30 Uhr",
  },
  team: {
    url: "golfclub-musterhausen.de/mannschaften/herren-ak-50",
    title: "Herren AK 50",
    season: "Saison 2026 · 3 von 5 Spieltagen",
    post: {
      title: "Spieltag 3 · Auswärts beim GC Sittensen",
      score: "5 : 3",
      text: "Starker Tag von Michael Weber, der sein Einzel auf der 17 entschied. Damit bleibt die Mannschaft ungeschlagen.",
      by: "Captain Thomas Brandt · Samstag, 18:30 Uhr",
    },
    rows: [
      { title: "Spieltag 3 · Sittensen", tag: "neu" },
      { title: "Spieltag 2 · Heim", value: "4 : 4" },
      { title: "Spieltag 1 · Bremerhaven", value: "6 : 2" },
      { title: "Spieltag 4 · Heim", value: "12. Oktober" },
    ],
  },
  capnote:
    "Das Clubbüro schreibt nichts, fordert nichts an, überträgt nichts. Es sieht nur, dass die Seite aktuell ist.",
};

/* ────────────────────────── 5 · Was bleibt (split2) ────────────────────────── */

/** Eine Zeile in „Läuft von allein" (Aussage + Modul-Namens-Label, kein Status). */
export interface AllainRow {
  text: string;
  /** Modul-Namens-Label (kein Status; die dev-Auszeichnung des Mocks entfällt). */
  mod: string;
}

export interface WasBleibtData {
  allein: {
    label: string;
    rows: AllainRow[];
    // Die Mock-Zeile „Stand je Modul wie im Footer: …" wird bewusst weggelassen
    // (Modulstatus nicht anzeigen, Entscheidung Stefan / Briefing 0018).
  };
  clubteam: {
    label: string;
    rows: string[];
    foot: string;
  };
}

export const clubprozesseWasBleibt: WasBleibtData = {
  allein: {
    label: "Läuft von allein",
    rows: [
      { text: "Häufige Fragen, rund um die Uhr beantwortet", mod: "Concierge" },
      { text: "Platzinformationen, dort erfasst, wo sie entstehen", mod: "Platzstatus" },
      { text: "Gastfee: Information, Zahlung, Bestätigung", mod: "Gastfee" },
      { text: "Turnierergebnisse, aus der Liste zum Bericht auf drei Kanälen", mod: "Turnier-News" },
      { text: "Mannschaftsberichte, direkt vom Spieltag", mod: "Captains App" },
      { text: "Eventanfragen von Firmen, strukturiert statt als lose E-Mail", mod: "Firmen-Events" },
    ],
  },
  clubteam: {
    label: "Bleibt beim Clubteam",
    rows: [
      "Das persönliche Gespräch mit Interessenten und Mitgliedern",
      "Die Entscheidung, was veröffentlicht wird",
      "Besondere Anliegen, die keine Standardantwort haben",
      "Mitglieder, Startzeiten, Turniere, Beiträge – in Ihrer Clubverwaltung, wie bisher",
    ],
    foot: "Weniger Zeit für Wiederholung. Mehr Zeit für Mitglieder, Gäste und den Club.",
  },
};

/* ────────────────────────── Seiten-Content + footerClose ────────────────────────── */

export const clubprozesse: PageContent = {
  route: "/clubprozesse",
  // Briefing 0018 liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx),
  // nur Canonical wird gesetzt (wie Plattform/Wachstum/Startseite). Nicht erfinden.
  sections: [
    {
      id: "hero",
      eyebrow: "Clubprozesse",
      headline: "Mehr Clubleben. Weniger Arbeit im Clubbüro.",
      text: [
        "Die Frage nach dem Greenfee. Der Platzstatus vom Greenkeeper. Die Gastfee. Der Turnierbericht nach der Siegerehrung. Das Ergebnis der Mannschaft. Fünf Dinge, die heute jemanden im Büro binden – mit GolfNext laufen sie dort, wo sie entstehen, und landen von allein auf der Website.",
      ],
    },
    {
      id: "dinge",
      eyebrow: "Jeden Tag, jede Saison",
      headline: "Drei Dinge, die das Clubbüro ab morgen nicht mehr macht.",
      text: [
        "Nicht die einzelne Aufgabe kostet die Zeit. Es ist die Wiederholung: dieselbe Frage, derselbe Anruf, dieselbe Überweisung – jeden Tag, die ganze Saison. Genau da setzt GolfNext an.",
      ],
    },
    {
      id: "turnier-news",
      eyebrow: "Turnier-News",
      headline: "Der letzte Putt fällt. Noch am selben Abend ist der Bericht online.",
      text: [
        "Drei Turniere in der Woche, und nach jeder Siegerehrung dieselbe Arbeit: Ergebnisse abtippen, Text schreiben, Bilder verkleinern, Website, Facebook, Instagram. Mit GolfNext wird daraus ein Vorgang, den jeder im Club in ein paar Minuten erledigt.",
      ],
    },
    {
      id: "captains-app",
      eyebrow: "Captains App",
      headline: "Jede Mannschaft sichtbar. Ohne Umweg über das Clubbüro.",
      text: [
        "Zehn Mannschaften, fünf Spieltage – und im Büro fehlt die Zeit, jeden zu dokumentieren. Also erscheint fast nichts. Mit der Captains App trägt der Captain Aufstellung, Ergebnis, Bild und zwei Sätze direkt vom Spieltag ein. Die Mannschaftsseite auf der Website ist aktuell, bevor der Bus zurück ist.",
      ],
    },
    {
      id: "was-bleibt",
      eyebrow: "Das Prinzip",
      headline: "Digital, wo es entlastet. Persönlich, wo es zählt.",
      text: [
        "GolfNext nimmt dem Clubbüro die Routine ab, nicht die Verantwortung. Alles, was rausgeht, kann der Club vorher sehen. Und alles, was ein Gespräch braucht, bekommt eins.",
      ],
    },
    {
      id: "faq",
      eyebrow: "Klarheit vor dem Gespräch",
      headline: "Häufige Fragen zu den Clubprozessen.",
    },
  ],
  footerClose: {
    eyebrow: "Entlastung für Ihr Clubbüro",
    headline: "Wo verliert Ihr Clubbüro heute die meiste Zeit?",
    text: [
      "In 30 Minuten gehen wir Ihren Cluballtag durch – Telefon, Platz, Gäste, Turniere, Mannschaften – und schauen, welche Vorgänge GolfNext Ihnen zuerst abnehmen kann. Ehrlich, auch wenn die Antwort „noch nicht“ heißt.",
    ],
    cta: {
      label: "Online-Erstgespräch vereinbaren",
      hint: "30 Minuten persönlich per Zoom oder Teams",
      target: "erstgespraech",
    },
    // Persönliche Zeile: der Mock zeigt Fred als Ansprechpartner (Name + Rolle) im
    // Abschlussblock. Wortlaut aus dem Mock übernommen (Name + Rolle als eine Zeile).
    persoenlicheZeile: "Fred Hoffmann, Gründer von GolfNext, seit mehr als 30 Jahren im Golfmarkt",
  },
};
