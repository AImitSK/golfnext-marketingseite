import type { Cta, PageContent } from "./types";

/**
 * Wachstum & Vertrieb · /wachstum-vertrieb
 * Quelle der Texte: docs/design-system/mocks/3.4b-wachstum-vertrieb-neufassung.html
 * (Neufassung v01, von Stefan freigegeben) und Briefing docs/briefings/0017-wachstum-vertrieb.md.
 * Die alte 3.4-wachstum-vertrieb.html ist Archiv und wird NICHT verwendet.
 *
 * Regeln (CLAUDE.md / 0017): Texte wortgleich (Zeichensetzung, „…"-Anführungen,
 * en-Dash „–", Ziffernabstand „30 km" / „09:10 Uhr"). Keine erfundenen
 * Zahlen/Versprechen. Die Beispiel-Oberflächen (Browser-Cockpit, Anmeldungsliste,
 * Instagram-Anzeige, Geräterahmen der Kampagnen-Geschichte, aufgefächerte
 * Landingpages) sind ILLUSTRATIV 1:1 aus dem Mock – schematische Darstellungen des
 * Systems, keine Zusagen und keine echten Screenshots. Beispielwerte (Namen,
 * Uhrzeiten, „30 km", „6 Wochen", Kanäle) sind Beispieloberfläche, keine Zusage.
 * Der Wochenbericht nennt bewusst KATEGORIEN, keine konkreten Werte.
 *
 * Modulstatus wird NICHT angezeigt (geteilter Footer, Entscheidung 06.09.). Die
 * Modul-Tags auf den Karten/Boxen sind bloße Namens-Labels (kein Status).
 */

/* ────────────────────────── 1 · Hero (Kampagnen-Cockpit + Instagram-Handy) ────────────────────────── */

export interface HeroTrust {
  text: string;
}

/** Eine Schlüssel-Wert-Kachel im Cockpit-Kopf (Label + hervorgehobener Wert). */
export interface CockpitKv {
  label: string;
  value: string;
}

/** Eine Zeile der illustrativen Anmeldungsliste im Cockpit. */
export interface AnmeldungRow {
  /** Initialen im Avatar. */
  av: string;
  name: string;
  sub: string;
  status: string;
  /** Status-Farbvariante (b = blau „Erinnerung geplant", sonst grün „angemeldet"). */
  statusVariant?: "b";
}

export interface HeroDemo {
  /** Adresszeile der Browser-Demo. */
  url: string;
  cockpit: {
    label: string;
    title: string;
    live: string;
    kv: CockpitKv[];
    listLabel: string;
    rows: AnmeldungRow[];
  };
  /** Instagram-Handy neben dem Cockpit. */
  phone: {
    handle: string;
    sponsored: string;
    /** Bildtitel; Umbruch aus dem Mock als zwei Zeilen. */
    imageTitleLines: string[];
    cta: string;
    caption: string;
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

export const wachstumHero: HeroData = {
  ctaPrimary: {
    label: "Online-Erstgespräch vereinbaren",
    hint: "30 Minuten persönlich per Zoom oder Teams",
    target: "erstgespraech",
  },
  trust: [
    { text: "Das Budget bestimmen Sie" },
    { text: "Keine Anzeige ohne Freigabe" },
    { text: "Jede Kampagne mit Zahlen" },
  ],
  ariaLabel:
    "Schematische Darstellung: Eine laufende Schnuppergolf-Kampagne im Kampagnen-Cockpit, aus der Instagram-Anzeige laufen neue Anmeldungen in die Liste ein.",
  demo: {
    url: "app.golfnext.de/kampagnen",
    cockpit: {
      label: "Kampagne",
      title: "Schnuppergolf Frühjahr",
      live: "läuft",
      kv: [
        { label: "Kanäle:", value: "Instagram · Facebook · Google" },
        { label: "Zielgebiet:", value: "30 km um den Club" },
        { label: "Freigegeben:", value: "Montag, 09:10 Uhr" },
      ],
      listLabel: "Neue Anmeldungen",
      rows: [
        { av: "AB", name: "Anna Berger", sub: "Samstag 10 Uhr · über Instagram", status: "angemeldet" },
        { av: "JK", name: "Jens Kraft", sub: "Samstag 10 Uhr · über Google", status: "angemeldet" },
        { av: "LM", name: "Lena Meier", sub: "Samstag 14 Uhr · über Facebook", status: "angemeldet" },
        { av: "TS", name: "Tom Schulz", sub: "Samstag 14 Uhr · über Instagram", status: "Erinnerung geplant", statusVariant: "b" },
      ],
    },
    phone: {
      handle: "golfclub_musterhausen",
      sponsored: "Gesponsert",
      imageTitleLines: ["Schnuppergolf", "am Samstag"],
      cta: "Platz sichern",
      caption: "Zwei Stunden, alles gestellt. Für alle, die es einmal ausprobieren wollen.",
    },
  },
};

/* ────────────────────────── 2 · Drei Momente (Bento) ────────────────────────── */

/** Ergebniskarte der Such-Box (Box 01). */
export interface SearchResult {
  /** „Anzeige"-Label. */
  labelBadge: string;
  /** Domain neben dem Label. */
  domain: string;
  title: string;
  desc: string;
}

/** Ein Ereignis der „Danach"-Zeitleiste (Box 03). */
export interface AfterEvent {
  day: string;
  text: string;
  /** Optionaler grüner Tag am Ende der letzten Zeile. */
  tag?: string;
}

export interface MomentBox {
  no: string;
  title: string;
  text: string;
  /** Präfix vor den Modul-Labels („Modul" bzw. „Module"). */
  modPrefix: string;
  /** Modul-Namens-Label(s), fett (kein Status). */
  modName: string;
  viz:
    | { kind: "search"; query: string; result: SearchResult }
    | { kind: "feed"; adHandle: string; adSponsored: string; adTitle: string; adButton: string }
    | { kind: "after"; events: AfterEvent[] };
}

export const wachstumMomente: MomentBox[] = [
  {
    no: "/ 01",
    title: "Wer sucht, soll Sie finden.",
    text: "„Platzreife-Kurs in der Nähe“, „Greenfee Samstag“: Wer so sucht, will jetzt etwas. Google-Anzeigen bringen Ihren Club in genau diesem Moment nach oben – nicht ein Portal.",
    modPrefix: "Modul",
    modName: "Search",
    viz: {
      kind: "search",
      query: "Platzreife-Kurs in der Nähe",
      result: {
        labelBadge: "Anzeige",
        domain: "golfclub-musterhausen.de",
        title: "Platzreife in vier Terminen – Golfclub Musterhausen",
        desc: "Nächster Start Samstag, 10 Uhr. Schläger stellen wir. Jetzt Platz sichern.",
      },
    },
  },
  {
    no: "/ 02",
    title: "Wer nicht sucht, soll Sie sehen.",
    text: "Die meisten künftigen Golfer suchen nie nach Golf. Sie scrollen abends durch Instagram. Dort taucht Ihr Schnuppergolf auf – bei Menschen, die 30 Kilometer um Ihren Club wohnen.",
    modPrefix: "Modul",
    modName: "Reach",
    viz: {
      kind: "feed",
      adHandle: "golfclub_musterhausen",
      adSponsored: "Gesponsert",
      adTitle: "Schnuppergolf am Samstag",
      adButton: "Platz sichern",
    },
  },
  {
    no: "/ 03",
    title: "Wer da war, soll wiederkommen.",
    text: "Nach dem Schnupperkurs, nach dem Gastspiel, nach dem Gespräch: Die nächste Nachricht kommt von allein – mit dem Angebot, das jetzt passt. Das Clubbüro sieht, wer wo steht.",
    modPrefix: "Module",
    modName: "Marketing-CRM · Lifecycle",
    viz: {
      kind: "after",
      events: [
        { day: "Tag 0", text: "Schnuppergolf, Samstag 10 Uhr" },
        { day: "Tag 0", text: "Abends: „Hat es Spaß gemacht?“" },
        { day: "Tag 7", text: "Angebot: Platzreife in vier Terminen" },
        { day: "Tag 21", text: "Erinnerung: nächster Start Samstag" },
        { day: "Tag 24", text: "Anmeldung Platzreife", tag: "ohne Anruf" },
      ],
    },
  },
];

/* ────────────────────────── 3 · Vier Wege (Slider) ────────────────────────── */

export interface WegCard {
  /** Adresszeile im Mini-Website-Visual. */
  miniUrl: string;
  /** Titel im Mini-Website-Visual. */
  miniTitle: string;
  /** Button-Label im Mini-Website-Visual. */
  miniButton: string;
  /** Zielgruppen-Label (uppercase) über der Überschrift. */
  tag: string;
  title: string;
  text: string;
  /** Ziel-Zeile (fett) hinter „Ziel: ". */
  goal: string;
  /** Modul-Namens-Labels (kein Status). */
  mods: string[];
  /** „Darüber sprechen"-Link je Weg → Erstgespräch. */
  cta: Cta;
}

export const wachstumWege: WegCard[] = [
  {
    miniUrl: "golfclub-musterhausen.de/schnuppergolf",
    miniTitle: "Schnuppergolf am Samstag",
    miniButton: "Platz sichern",
    tag: "Einsteiger",
    title: "Schnuppergolf & Platzreife",
    text: "Anzeigen bei Instagram und Facebook für Menschen, die noch nie einen Schläger in der Hand hatten. Eine Seite, die Termin, Preis und Ablauf erklärt. Nach dem Kurs kommt das Angebot zur Platzreife – von allein.",
    goal: "Anmeldung zum Schnuppergolf, danach zur Platzreife.",
    mods: ["Reach", "Landingpages", "Lifecycle"],
    cta: { label: "Darüber sprechen", target: "erstgespraech" },
  },
  {
    miniUrl: "golfclub-musterhausen.de/mitglied-werden",
    miniTitle: "Mitglied werden – so geht's",
    miniButton: "Gespräch vereinbaren",
    tag: "Mitgliedschaft",
    title: "Mitglieder gewinnen & Clubwechsel",
    text: "Wer mit seinem Club unzufrieden ist, sucht leise – bei Google. Eine Seite, die Beiträge, Spielrecht und Probemitgliedschaft klar erklärt. Und ein Termin für das Gespräch: mit Ihnen, nicht mit einem Formular.",
    goal: "Ein Gespräch mit dem Clubmanager.",
    mods: ["Search", "Landingpages", "Marketing-CRM"],
    cta: { label: "Darüber sprechen", target: "erstgespraech" },
  },
  {
    miniUrl: "golfclub-musterhausen.de/greenfee",
    miniTitle: "Greenfee & Gastspiel",
    miniButton: "Gastfee bezahlen",
    tag: "Gäste",
    title: "Greenfee & Gäste",
    text: "Wer am Donnerstag „Greenfee in der Nähe“ sucht, will am Samstag spielen. Google zeigt Ihren Club, die Seite zeigt Platzstatus und Preis, die Gastfee wird online bezahlt. Gefunden, gebucht, gespielt.",
    goal: "Gastspiel angefragt oder Gastfee bezahlt.",
    mods: ["Search", "Platzstatus", "Gastfee"],
    cta: { label: "Darüber sprechen", target: "erstgespraech" },
  },
  {
    miniUrl: "golfclub-musterhausen.de/firmen-events",
    miniTitle: "Ihr Firmen-Event auf dem Platz",
    miniButton: "Angebot anfragen",
    tag: "Unternehmen",
    title: "Firmenkunden gewinnen",
    text: "Aus Ihrem Platz, Ihrer Gastronomie und Ihrem Pro wird ein Angebot mit Ablauf, Preis und Anfrageformular. Google-Anzeigen für Unternehmen im Umkreis. Firmen-Events, die sich verkaufen lassen.",
    goal: "Eine Anfrage mit Termin und Teilnehmerzahl.",
    mods: ["Search", "Firmen-Events", "Marketing-CRM"],
    cta: { label: "Darüber sprechen", target: "erstgespraech" },
  },
];

export const wachstumWaynote =
  "Jeder Weg führt in dasselbe Erstgespräch – mit Ihrer Zielgruppe als Thema, damit wir dort anfangen, wo Ihr Club wachsen will.";

/* ────────────────────────── 4 · Eine Kampagne, eine Woche (Scroll-Geschichte) ────────────────────────── */

/**
 * Ein Schritt der Kampagnen-Geschichte. `sn/title/text` sind Websiteinhalt (wortgleich).
 * `device` ist die illustrative Geräte-Darstellung; sie wird sowohl im klebenden
 * Desktop-Rahmen als auch in der gestapelten Mobile-/No-JS-Fassung gezeigt. Die
 * Darstellung folgt der ausführlicheren Desktop-Fassung (Panel) aus dem Mock; die
 * Mobile-Fassung des Mocks ist eine gekürzte Variante desselben Schritts.
 */
export interface KampagneStep {
  sn: string;
  title: string;
  text: string;
  device: KampagneDevice;
}

/** Ein Schlüssel-Wert-Paar im Geräterahmen (zweispaltig, Label über fettem Wert). */
export interface DeviceKv {
  label: string;
  value: string;
}

/** Eine Anzeigen-Kachel im „Anzeigen · live"-Rahmen. */
export type DeviceAd =
  | { style: "image"; label: string; imageTitle: string; desc: string }
  | { style: "google"; label: string; title: string; url: string; badge: string; desc: string };

/** Eine Zeile der Mini-Zeitleiste im CRM-Rahmen. */
export interface DeviceTl {
  text: string;
  /** offener (noch ausstehender) Schritt – grauer statt grüner Punkt. */
  open?: boolean;
}

export type KampagneDevice =
  | {
      kind: "freigabe";
      head: string;
      headline: string;
      body: string;
      preview: { title: string; text: string };
      kv: DeviceKv[];
      button: string;
      tag: string;
    }
  | {
      kind: "ads";
      head: string;
      headline: string;
      ads: DeviceAd[];
      tag: string;
    }
  | {
      kind: "crm-card";
      head: string;
      headline: string;
      body: string;
      av: string;
      name: string;
      source: string;
      timeline: DeviceTl[];
      tag: string;
    }
  | {
      kind: "crm-list";
      head: string;
      capTitle: string;
      capNote: string;
      rows: AnmeldungRow[];
      tag: string;
    }
  | {
      kind: "report";
      head: string;
      headline: string;
      body: string;
      /** KATEGORIEN, keine konkreten Werte (Briefing 0017). */
      items: string[];
      tag: string;
    };

export const wachstumKampagne: KampagneStep[] = [
  {
    sn: "01 · MONTAG, 09:10",
    title: "Sie geben frei.",
    text: "Wir legen Ihnen die fertige Kampagne vor: Motive, Texte, Zielgebiet, Budget. Ein Klick von Ihnen – vorher passiert nichts.",
    device: {
      kind: "freigabe",
      head: "GolfNext · Kampagne zur Freigabe",
      headline: "Schnuppergolf Frühjahr",
      body: "Motive, Texte, Zielgebiet und Budget liegen Ihnen vor. Erst mit Ihrer Freigabe geht die Kampagne live.",
      preview: {
        title: "Schnuppergolf am Samstag",
        text: "Zwei Stunden, alles gestellt. Für alle, die es einmal ausprobieren wollen.",
      },
      kv: [
        { label: "Kanäle", value: "Instagram · Facebook · Google" },
        { label: "Zielgebiet", value: "30 km um den Club" },
        { label: "Laufzeit", value: "6 Wochen" },
        { label: "Budget", value: "wie von Ihnen festgelegt" },
      ],
      button: "Freigeben",
      tag: "Ohne Freigabe fließt kein Euro",
    },
  },
  {
    sn: "02 · MONTAG, 09:12",
    title: "Die Anzeigen laufen.",
    text: "Bei Instagram und Facebook für Menschen, die noch nicht suchen. Bei Google für die, die es gerade tun. 30 Kilometer um den Club.",
    device: {
      kind: "ads",
      head: "Anzeigen · live",
      headline: "Zwei Minuten später laufen die Anzeigen.",
      ads: [
        {
          style: "image",
          label: "Instagram · Facebook",
          imageTitle: "Schnuppergolf am Samstag",
          desc: "Zwei Stunden, alles gestellt. 30 km um den Club.",
        },
        {
          style: "google",
          label: "Google",
          title: "Schnuppergolf am Samstag – Golfclub Musterhausen",
          url: "golfclub-musterhausen.de/schnuppergolf",
          badge: "Anzeige",
          desc: "Zwei Stunden, alles gestellt. Nächster Termin Samstag, 10 Uhr. Jetzt Platz sichern.",
        },
      ],
      tag: "Für Sie: nichts zu tun",
    },
  },
  {
    sn: "03 · DIENSTAG, 21:40",
    title: "Die erste Anmeldung.",
    text: "Abends, vom Sofa aus. Die Anmeldung landet im Marketing-CRM, die Bestätigung geht sofort raus. Im Büro klingelt nichts.",
    device: {
      kind: "crm-card",
      head: "Marketing-CRM · Dienstag, 21:40",
      headline: "Die erste Anmeldung.",
      body: "Anna hat die Anzeige abends gesehen, die Seite gelesen und sich angemeldet. Das Büro bekommt eine Notiz – keinen Anruf.",
      av: "AB",
      name: "Anna Berger",
      source: "Schnuppergolf · Samstag 10 Uhr · Quelle: Instagram",
      timeline: [
        { text: "Anmeldung eingegangen · 21:40" },
        { text: "Bestätigung gesendet · 21:40" },
        { text: "Erinnerung · Donnerstag", open: true },
      ],
      tag: "Für Sie: nichts zu tun",
    },
  },
  {
    sn: "04 · FREITAG",
    title: "Der Kurs füllt sich.",
    text: "Jeder Angemeldete hat die Erinnerung bekommen. Sie sehen, wer kommt, wer noch offen ist und woher jeder Einzelne kam.",
    device: {
      kind: "crm-list",
      head: "Marketing-CRM · Freitag",
      capTitle: "Schnuppergolf · Samstag 10 Uhr",
      capNote: "noch 2 Plätze",
      rows: [
        { av: "AB", name: "Anna Berger", sub: "über Instagram · Erinnerung geöffnet", status: "kommt" },
        { av: "JK", name: "Jens Kraft", sub: "über Google · Erinnerung geöffnet", status: "kommt" },
        { av: "LM", name: "Lena Meier", sub: "über Facebook · Erinnerung gesendet", status: "offen", statusVariant: "b" },
        { av: "TS", name: "Tom Schulz", sub: "über Instagram · Erinnerung gesendet", status: "offen", statusVariant: "b" },
      ],
      tag: "Sie sehen jederzeit, wer wo steht",
    },
  },
  {
    sn: "05 · SONNTAG, 18:00",
    title: "Der Bericht.",
    text: "Eine Seite für den Vorstand: Anmeldungen, Kosten je Anmeldung, Budgetstand und was wir nächste Woche ändern. Jede Woche.",
    device: {
      kind: "report",
      head: "E-Mail · Sonntag, 18:00 · Ihr Wochenbericht",
      headline: "Was die Woche gebracht hat.",
      body: "Eine Seite, jede Woche. Keine Reichweiten-Folien, sondern das, was zählt:",
      items: [
        "Wie viele sich angemeldet haben",
        "Was eine Anmeldung gekostet hat",
        "Wie viel vom Budget ausgegeben ist",
        "Was wir nächste Woche ändern",
      ],
      tag: "Zahlen aus Ihrer Kampagne, nicht aus einer Broschüre",
    },
  },
];

/** Zwei Text-Links am Ende der Kampagnen-Geschichte (Live-Gate über internalHref). */
export interface KampagneLink {
  label: string;
  /** Ziel-Route; erst verlinkt, wenn die Route `live` ist, sonst „#". */
  path: string;
}

export const wachstumKampagneLinks: KampagneLink[] = [
  { label: "So arbeitet GolfNext – alle Sequenzen im Detail", path: "/plattform/so-arbeitet-golfnext" },
  { label: "Wie ein Club so seinen Schnupperkurs gefüllt hat", path: "/praxis" },
];

/* ────────────────────────── 5 · Drei Regeln (Werbebudget, Navy-Band) ────────────────────────── */

export interface Regel {
  n: string;
  title: string;
  text: string;
}

export interface RegelnData {
  regeln: Regel[];
  /** Link auf die Paketseite (on-dark). */
  link: { label: string; path: string };
}

export const wachstumRegeln: RegelnData = {
  regeln: [
    {
      n: "/ 01",
      title: "Sie bestimmen das Budget.",
      text: "Wie viel im Monat in Anzeigen geht, legen Sie fest. Erhöhen, senken, pausieren – jederzeit, ohne Diskussion.",
    },
    {
      n: "/ 02",
      title: "Keine Anzeige ohne Ihre Freigabe.",
      text: "Jede Kampagne wird Ihnen vorgelegt: Motive, Texte, Zielgebiet, Budget. Erst wenn Sie freigeben, geht sie live. Ohne Freigabe fließt kein Euro.",
    },
    {
      n: "/ 03",
      title: "Jede Kampagne mit Zahlen.",
      text: "Sie sehen, was die Anzeigen gekostet und was sie gebracht haben – bis zur einzelnen Anmeldung. Jede Woche, auf einer Seite.",
    },
  ],
  link: { label: "Was GolfNext selbst kostet, steht offen auf der Paketseite", path: "/pakete" },
};

/* ────────────────────────── 6 · Fundament (aufgefächerte Landingpages) ────────────────────────── */

/** Eine aufgefächerte Landingpage im Fundament-Visual (illustrativ). */
export interface FanCard {
  url: string;
  title: string;
  button: string;
}

export interface FundamentData {
  paragraphs: string[];
  /** Link auf die Paketseite (blau auf hell). */
  link: { label: string; path: string };
  /** Aufgefächerte Landingpages (dekorativ, aria-hidden). */
  cards: FanCard[];
}

export const wachstumFundament: FundamentData = {
  paragraphs: [
    "Anzeigen bringen Menschen. Ankommen müssen sie bei Ihnen: auf einer Seite unter Ihrer Domain, die genau ein Angebot erklärt und genau eine Handlung anbietet – anmelden, anfragen, bezahlen.",
    "Diese Seiten baut GolfNext auf Ihrer Clubwebsite. Sie gehören Ihrem Club, genau wie die Kontakte, die darüber entstehen.",
  ],
  link: { label: "Ihre Clubwebsite ist Teil jedes Pakets", path: "/pakete" },
  cards: [
    { url: "…/greenfee", title: "Greenfee & Gastspiel", button: "Gastfee bezahlen" },
    { url: "golfclub-musterhausen.de/schnuppergolf", title: "Schnuppergolf am Samstag", button: "Platz sichern" },
    { url: "…/mitglied-werden", title: "Mitglied werden", button: "Gespräch vereinbaren" },
  ],
};

/* ────────────────────────── Seiten-Content + footerClose ────────────────────────── */

export const wachstumVertrieb: PageContent = {
  route: "/wachstum-vertrieb",
  // Briefing 0017 liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx),
  // nur Canonical wird gesetzt (wie Plattform/Startseite). Nicht erfinden.
  meta: { title: null, description: null },
  sections: [
    {
      id: "hero",
      eyebrow: "Wachstum & Vertrieb",
      headline: "Neue Golfer finden Ihren Club. Bevor sie den Nachbarclub finden.",
      text: [
        "Anzeigen bei Instagram, Facebook und Google. Eine Seite je Angebot. Und danach die richtige Nachricht zur richtigen Zeit – automatisch. So werden aus Interessenten Anmeldungen und aus Anmeldungen Mitglieder. Für Schnuppergolf, Platzreife, Mitgliedschaft, Greenfee und Firmen-Events.",
      ],
    },
    {
      id: "momente",
      eyebrow: "Warum das nicht von allein passiert",
      headline: "Drei Momente, in denen ein Club neue Golfer gewinnt – oder verliert.",
      text: [
        "Wer „Golf lernen“ googelt, landet bei Portalen. Wer abends bei Instagram scrollt, hat noch gar nicht gesucht. Und wer einmal da war, hört meist nie wieder etwas. GolfNext ist in allen drei Momenten da.",
      ],
    },
    {
      id: "wege",
      eyebrow: "Wo soll Ihr Club wachsen?",
      headline: "Vier Wege. Für jeden ein eigener Plan.",
      text: [
        "Ein Anfänger sucht anders als ein Golfer, der den Club wechseln will. Deshalb bekommt jede Zielgruppe eigene Anzeigen, eine eigene Seite und eigene Nachrichten danach.",
      ],
    },
    {
      id: "kampagne",
      eyebrow: "Was das Clubbüro davon merkt",
      headline: "Eine Kampagne, eine Woche. Aus Sicht Ihres Clubs.",
      text: [
        "Was Sie tun und was von allein läuft – am Beispiel einer Schnuppergolf-Kampagne. Scrollen Sie mit.",
      ],
    },
    {
      id: "regeln",
      eyebrow: "Ihr Werbebudget",
      headline: "Drei Regeln, die für jede Kampagne gelten.",
      text: [
        "Anzeigen kosten Geld. Deshalb gibt es bei GolfNext keine Überraschungen – weder beim Budget noch beim Ergebnis.",
      ],
    },
    {
      id: "fundament",
      eyebrow: "Das Fundament",
      headline: "Jede Anzeige führt auf Ihre Website. Nicht auf ein Portal.",
    },
  ],
  footerClose: {
    eyebrow: "Wachstum für Ihren Club",
    headline: "Wo soll Ihr Club als Nächstes wachsen?",
    text: [
      "In 30 Minuten schauen wir gemeinsam auf Ihre Zielgruppen, Ihre Angebote und die größte ungenutzte Chance. Sie bekommen eine ehrliche Einschätzung, welcher Weg zuerst den größten Hebel hat – keine Verkaufsshow.",
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
