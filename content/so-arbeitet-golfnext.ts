import type { Cta, PageContent } from "./types";

/**
 * So arbeitet GolfNext · /plattform/so-arbeitet-golfnext
 * Quelle der Texte: docs/design-system/mocks/3.3b-so-arbeitet-golfnext-neufassung.html
 * (Neufassung v01, von Stefan freigegeben) und Briefing docs/briefings/0024-so-arbeitet-golfnext.md.
 *
 * WICHTIG: Die alte `3.3-so-arbeitet-golfnext.html` und das dazugehörige Fred-Briefing
 * `docs/design-system/briefings/3.3-so-arbeitet-golfnext-briefing.md` (Customer Journey,
 * Phasenkette „Unbekannt → Besucher → …", Marketing-CRM-Board) sind mit der Neufassung
 * ARCHIV. Sie sind KEINE Textquelle mehr und werden hier nicht eingemischt.
 *
 * Regeln (CLAUDE.md / 0024): Texte wortgleich (Zeichensetzung, en-Dash „–", Mittelpunkt
 * „·", Ziffernabstand „10 Uhr" / „9:30 Uhr"). KEINE erfundenen Zahlen: keine Öffnungs-
 * oder Klickraten, keine Fristen, keine Terminversprechen. Die Mail-Fenster, die
 * Zeitangaben, die Beispieladressen (`anna.berger@…`) und die Zeile „Ihr Trainer ist
 * Fred Hoffmann" stammen 1:1 aus dem Mock und sind ILLUSTRATIV – schematische
 * Beispieloberflächen, keine Zusagen (im Markup `aria-hidden`, wie auf /clubprozesse
 * und /plattform).
 *
 * Benennungen (bewusst nicht vereinheitlicht, so steht es im Mock): „Greenfee & Gäste"
 * und „Greenfee-Gast" als ZIELGRUPPE, „Gastfee" als Modul und Zahlung.
 *
 * Modulstatus wird NICHT angezeigt (Entscheidung 06.09., Briefing 0014).
 */

/* ────────────────────────── 1 · Hero (Mail-Stapel) ────────────────────────── */

export interface HeroTrust {
  text: string;
}

/** Eine Karte des Mail-Stapels im Hero (illustrativ, `aria-hidden`). */
export interface StapelKarte {
  /** Zeitangabe der Nachricht („Sofort", „Zwei Tage vorher", …). */
  when: string;
  betreff: string;
  text: string;
}

export interface HeroData {
  ctaPrimary: Cta;
  /** Optionale zweite Aktion auf dunkel; seit Briefing 0031 setzt sie keine Seite. */
  ctaSecondary?: Cta;
  trust: HeroTrust[];
  /** Barrierefreies Label des schematischen Mail-Stapels (Inhalt selbst ist aria-hidden). */
  ariaLabel: string;
  stapel: StapelKarte[];
}

export const soArbeitetHero: HeroData = {
  ctaPrimary: {
    label: "Online-Erstgespräch vereinbaren",
    hint: "30 Minuten persönlich per Zoom oder Teams",
    target: "erstgespraech",
  },
  trust: [
    { text: "Kein Newsletter an alle" },
    { text: "Sie geben jeden Text frei" },
    { text: "Abmeldung mit einem Klick" },
  ],
  ariaLabel:
    "Schematische Darstellung: die vier Nachrichten, die ein Club nach einer Anmeldung zum Schnuppergolf verschickt.",
  stapel: [
    {
      when: "Sofort",
      betreff: "Ihr Platz am Samstag ist reserviert",
      text: "Samstag, 10 Uhr, Treffpunkt Clubhaus. Schläger und Bälle stellen wir.",
    },
    {
      when: "Zwei Tage vorher",
      betreff: "Was Sie am Samstag erwartet",
      text: "Bequeme Kleidung reicht. Ihr Trainer ist Fred Hoffmann. Bei Regen verschieben wir.",
    },
    {
      when: "Am Abend danach",
      betreff: "Hat es Spaß gemacht?",
      text: "So geht es weiter: die Platzreife in vier Terminen. Nächster Start in zwei Wochen.",
    },
    {
      when: "Zwei Wochen später",
      betreff: "Noch zwei Plätze im nächsten Kurs",
      text: "Die Erinnerung, bevor der Kurs voll ist. Danach übernimmt ein Mensch.",
    },
  ],
};

/* ────────────────────────── 2 · Fünf Strecken (Umschalter) ────────────────────────── */

/**
 * Ein Mail-Fenster einer Strecke (illustrativ, `aria-hidden`). Der Fuß trägt
 * ENTWEDER einen grünen Knopf (`cta`) ODER einen Ratgeber-/Übersichts-Verweis
 * (`hinweis`) – nie beides, genau wie im Mock.
 */
export interface Mail {
  /** Laufnummer im Knoten der Zeitleiste („01"–„04"). */
  nr: string;
  /** Zeitangabe über dem Fenster („Sofort", „Zwei Tage vorher", …). */
  zeit: string;
  /** Kopfzeile links: Beispiel-Empfänger. */
  an: string;
  /** Kopfzeile rechts: Beispiel-Zeitpunkt. */
  gesendet: string;
  betreff: string;
  text: string;
  /** Grüner Knopf im Mail-Fuß (Beispiel-Aktion). */
  cta?: string;
  /** Verweis im Mail-Fuß (Ratgeber, Übersicht, persönliche Übergabe). */
  hinweis?: string;
}

/** Eine Zielgruppen-Strecke: Reiter-Beschriftung plus vier Nachrichten. */
export interface Strecke {
  /** Technische Kennung für Radio/Label/Panel des Umschalters. */
  id: "schnuppergolf" | "platzreife" | "mitgliedschaft" | "greenfee-gaeste" | "firmen-event";
  /** Beschriftung des Reiters. */
  label: string;
  /** Barrierefreies Label der schematischen Strecke (Inhalt selbst ist aria-hidden). */
  ariaLabel: string;
  mails: Mail[];
}

export interface StreckenData {
  /** Beschriftung der Radiogruppe (visuell versteckt, für Screenreader). */
  legende: string;
  strecken: Strecke[];
  /** Zwei Verweise unter den Strecken. */
  links: Cta[];
  /** Einordnung unter den Strecken – Beispielcharakter, keine Zusage. */
  fussnote: string;
}

export const soArbeitetStrecken: StreckenData = {
  legende: "Zielgruppe wählen",
  strecken: [
    {
      id: "schnuppergolf",
      label: "Schnuppergolf",
      ariaLabel: "Schematische Darstellung: die vier Nachrichten der Strecke Schnuppergolf.",
      mails: [
        {
          nr: "01",
          zeit: "Sofort",
          an: "An: anna.berger@…",
          gesendet: "Sa 20:16",
          betreff: "Ihr Platz am Samstag ist reserviert",
          text: "Samstag, 10 Uhr, Treffpunkt Clubhaus. Zwei Stunden auf Range und Kurzplatz. Schläger und Bälle stellen wir.",
          cta: "Termin im Kalender speichern",
        },
        {
          nr: "02",
          zeit: "Zwei Tage vorher",
          an: "An: anna.berger@…",
          gesendet: "Do 09:00",
          betreff: "Was Sie am Samstag erwartet",
          text: "Bequeme Kleidung und feste Schuhe reichen. Ihr Trainer ist Fred Hoffmann. Bei Regen verschieben wir – Sie bekommen rechtzeitig Bescheid.",
          hinweis: "Ratgeber: Der erste Golfversuch",
        },
        {
          nr: "03",
          zeit: "Am Abend danach",
          an: "An: anna.berger@…",
          gesendet: "Sa 18:00",
          betreff: "Hat es Spaß gemacht?",
          text: "Schön, dass Sie da waren. Wenn Sie weitermachen möchten: Die Platzreife dauert vier Termine, danach dürfen Sie auf den Platz.",
          cta: "Termine ansehen",
        },
        {
          nr: "04",
          zeit: "Zwei Wochen später",
          an: "An: anna.berger@…",
          gesendet: "Mo 10:00",
          betreff: "Noch zwei Plätze im nächsten Kurs",
          text: "Der Platzreifekurs startet am Samstag in zwei Wochen. Falls Sie Fragen haben: einfach auf diese Mail antworten.",
          hinweis: "Ratgeber: So läuft ein Platzreifekurs ab",
        },
      ],
    },
    {
      id: "platzreife",
      label: "Platzreife",
      ariaLabel: "Schematische Darstellung: die vier Nachrichten der Strecke Platzreife.",
      mails: [
        {
          nr: "01",
          zeit: "Sofort",
          an: "An: jens.kraft@…",
          gesendet: "Di 21:40",
          betreff: "Ihre Platzreife: vier Termine, alle Daten",
          text: "Samstags, jeweils 10 bis 12 Uhr. Was Sie mitbringen, was der Club stellt – und wer Sie unterrichtet.",
          cta: "Termine im Kalender speichern",
        },
        {
          nr: "02",
          zeit: "Vor dem ersten Termin",
          an: "An: jens.kraft@…",
          gesendet: "Do 09:00",
          betreff: "Was in den vier Terminen passiert",
          text: "Von den ersten Schlägen bis zur Platzerlaubnis: Ablauf, Regeln, Etikette. Kein Prüfungsstress – wir gehen das gemeinsam durch.",
          hinweis: "Ratgeber: Platzreife ohne Prüfungsangst",
        },
        {
          nr: "03",
          zeit: "Nach dem letzten Termin",
          an: "An: jens.kraft@…",
          gesendet: "Sa 17:30",
          betreff: "Glückwunsch – Sie dürfen auf den Platz",
          text: "Ihre Platzreife ist eingetragen. So kommen Sie an eine Startzeit, und das sind Ihre Möglichkeiten, bei uns zu spielen.",
          cta: "Startzeit reservieren",
        },
        {
          nr: "04",
          zeit: "Drei Wochen später",
          an: "An: jens.kraft@…",
          gesendet: "Mi 10:00",
          betreff: "Wie wäre es mit einer Saison bei uns?",
          text: "Was eine Mitgliedschaft kostet, was Spielrecht und Probemitgliedschaft bedeuten – und wann Sie mit dem Clubmanager sprechen können.",
          cta: "Gespräch vereinbaren",
        },
      ],
    },
    {
      id: "mitgliedschaft",
      label: "Mitgliedschaft",
      ariaLabel: "Schematische Darstellung: die vier Nachrichten der Strecke Mitgliedschaft.",
      mails: [
        {
          nr: "01",
          zeit: "Sofort",
          an: "An: familie.meier@…",
          gesendet: "Mi 19:12",
          betreff: "Ihr Termin steht: Donnerstag, 17 Uhr",
          text: "Wir treffen uns im Clubhaus. Wenn Sie mögen, gehen wir vorher eine Runde über die Anlage.",
          cta: "Termin bestätigen",
        },
        {
          nr: "02",
          zeit: "Am Tag davor",
          an: "An: familie.meier@…",
          gesendet: "Mi 09:00",
          betreff: "Damit Sie vorbereitet sind",
          text: "Beiträge, Spielrecht, Familientarife und die Probemitgliedschaft – in einer Übersicht, damit im Gespräch Zeit für Ihre Fragen bleibt.",
          hinweis: "Übersicht: Mitgliedschaften im Club",
        },
        {
          nr: "03",
          zeit: "Am Tag danach",
          an: "An: familie.meier@…",
          gesendet: "Fr 11:00",
          betreff: "Schön, dass Sie da waren",
          text: "Hier ist alles noch einmal schriftlich, so wie wir es besprochen haben. Der Aufnahmeantrag liegt bei – ohne Frist, ohne Druck.",
          cta: "Antrag ansehen",
        },
        {
          nr: "04",
          zeit: "Zehn Tage später",
          an: "An: familie.meier@…",
          gesendet: "Mo 10:00",
          betreff: "Noch Fragen offen?",
          text: "Falls etwas unklar geblieben ist, rufe ich Sie gern an. Antworten Sie einfach auf diese Mail.",
          hinweis: "Danach übernimmt der Clubmanager persönlich",
        },
      ],
    },
    {
      id: "greenfee-gaeste",
      label: "Greenfee & Gäste",
      ariaLabel: "Schematische Darstellung: die vier Nachrichten der Strecke Greenfee und Gäste.",
      mails: [
        {
          nr: "01",
          zeit: "Sofort",
          an: "An: tom.schulz@…",
          gesendet: "Do 21:03",
          betreff: "Ihre Startzeit am Samstag, 9:30 Uhr",
          text: "Gastfee bezahlt, Startzeit reserviert. Anfahrt, Parkplatz und wo Sie sich melden – alles in dieser Mail.",
          cta: "Zur Anfahrt",
        },
        {
          nr: "02",
          zeit: "Am Vortag",
          an: "An: tom.schulz@…",
          gesendet: "Fr 17:00",
          betreff: "Der Platz morgen: bespielbar, Sommergrüns",
          text: "Aktueller Platzstatus, Wetter und was das Clubhaus geöffnet hat. Falls sich etwas ändert, melden wir uns.",
          hinweis: "Platzstatus live auf der Website",
        },
        {
          nr: "03",
          zeit: "Am Abend danach",
          an: "An: tom.schulz@…",
          gesendet: "Sa 19:00",
          betreff: "Wie war die Runde?",
          text: "Danke für Ihren Besuch. Wenn etwas nicht gepasst hat, schreiben Sie uns – das liest ein Mensch, kein Formular.",
          cta: "Kurz Rückmeldung geben",
        },
        {
          nr: "04",
          zeit: "Vier Wochen später",
          an: "An: tom.schulz@…",
          gesendet: "Mi 10:00",
          betreff: "Wieder Lust auf eine Runde?",
          text: "Aktuelle Greenfee-Zeiten und, falls Sie öfter kommen: was eine Gästekarte oder Zweitmitgliedschaft kostet.",
          cta: "Startzeit reservieren",
        },
      ],
    },
    {
      id: "firmen-event",
      label: "Firmen-Event",
      ariaLabel: "Schematische Darstellung: die vier Nachrichten der Strecke Firmen-Event.",
      mails: [
        {
          nr: "01",
          zeit: "Sofort",
          an: "An: k.wagner@…",
          gesendet: "Di 14:22",
          betreff: "Ihre Anfrage ist angekommen",
          text: "28 Teilnehmer, Freitag im Juni. Fred Hoffmann meldet sich innerhalb eines Werktags persönlich bei Ihnen.",
          cta: "Termin für ein Gespräch wählen",
        },
        {
          nr: "02",
          zeit: "Am nächsten Tag",
          an: "An: k.wagner@…",
          gesendet: "Mi 09:30",
          betreff: "Wie ein Firmentag bei uns abläuft",
          text: "Drei Formate vom Schnuppertag bis zum Turnier, mit Zeitplan, Gastronomie und dem, was der Club übernimmt.",
          hinweis: "Beispiele: Firmentage im Club",
        },
        {
          nr: "03",
          zeit: "Nach dem Gespräch",
          an: "An: k.wagner@…",
          gesendet: "Fr 16:00",
          betreff: "Ihr Angebot für den 12. Juni",
          text: "Zusammengefasst, was wir besprochen haben: Ablauf, Leistungen, Preis pro Teilnehmer und die Option für schlechtes Wetter.",
          cta: "Angebot ansehen",
        },
        {
          nr: "04",
          zeit: "Nach dem Event",
          an: "An: k.wagner@…",
          gesendet: "Mo 10:00",
          betreff: "Danke für den Tag bei uns",
          text: "Die Bilder zum Herunterladen – und falls es Ihren Leuten gefallen hat: Für nächstes Jahr halten wir Ihnen einen Termin frei.",
          cta: "Termin 2027 vormerken",
        },
      ],
    },
  ],
  links: [
    {
      label: "Wachstum & Vertrieb: wie die Kontakte entstehen",
      target: "intern",
      href: "/wachstum-vertrieb",
    },
  ],
  fussnote:
    "Beispielstrecken. Texte, Zeitpunkte und Artikel werden für Ihren Club geschrieben und mit Ihnen abgestimmt – Anzahl und Abstände der Nachrichten bestimmen Sie.",
};

/* ────────────────────────── 3 · Übergabe an den Menschen ────────────────────────── */

/** Eine Zeile der illustrativen Kontakthistorie (Punkt, Text, Zeitangabe). */
export interface VerlaufZeile {
  text: string;
  zeit: string;
  /** Hervorgehobener Punkt („heißes" Signal). */
  hot?: boolean;
}

export interface UebergabeData {
  /** Barrierefreies Label der schematischen Übergabe (Inhalt selbst ist aria-hidden). */
  ariaLabel: string;
  /** Linke Karte: der Kontakt im Marketing-CRM. */
  kontakt: {
    kopf: string;
    /** Initialen im Avatar. */
    av: string;
    name: string;
    herkunft: string;
    verlauf: VerlaufZeile[];
  };
  /** Rechte Karte: die Aufgabe für das Clubteam. */
  aufgabe: {
    kopf: string;
    job: string;
    warum: string;
    /** Erste Aktion (grüne Fläche), zweite Aktion (ruhig). */
    aktionen: string[];
  };
  /** Satz unter der Übergabe. */
  note: string;
}

export const soArbeitetUebergabe: UebergabeData = {
  ariaLabel:
    "Schematische Darstellung: aus dem Kontaktverlauf im Marketing-CRM wird eine Aufgabe für das Clubteam.",
  kontakt: {
    kopf: "Marketing-CRM · Anna Berger",
    av: "AB",
    name: "Anna Berger",
    herkunft: "Über Instagram · Schnuppergolf · seit vier Wochen im Kontakt",
    verlauf: [
      { text: "Schnuppergolf besucht", zeit: "vor 4 Wochen" },
      { text: "Vier Nachrichten erhalten", zeit: "alle geöffnet" },
      { text: "Ratgeber Platzreife gelesen", zeit: "gestern", hot: true },
      { text: "Termine angeklickt", zeit: "heute, 20:14", hot: true },
    ],
  },
  aufgabe: {
    kopf: "Aufgabe für das Clubteam",
    job: "Anna Berger anrufen – sie sucht einen Platzreifetermin.",
    warum:
      "Zwei Signale an einem Tag. Der Anruf kommt jetzt nicht aus dem Nichts: Sie wissen, woher sie kommt, was sie bekommen hat und wofür sie sich interessiert.",
    aktionen: ["Anrufen", "Verlauf ansehen"],
  },
  note: "Ab hier läuft nichts mehr automatisch. Das Gespräch führt ein Mensch aus Ihrem Club – nur eben vorbereitet.",
};

/* ────────────────────────── 4 · Drei Regeln ────────────────────────── */

export interface Regel {
  /** Zählung wie im Mock („/ 01"). */
  n: string;
  title: string;
  text: string;
}

export interface RegelnData {
  regeln: Regel[];
  /** Verweis unter den Regeln. */
  link: Cta;
}

export const soArbeitetRegeln: RegelnData = {
  regeln: [
    {
      n: "/ 01",
      title: "Kein Newsletter an alle.",
      text: "Jede Nachricht geht an genau die Menschen, für die sie geschrieben wurde – ausgelöst von dem, was sie selbst getan haben. Niemand bekommt Post, weil gerade Dienstag ist.",
    },
    {
      n: "/ 02",
      title: "Sie geben jeden Text frei.",
      text: "Bevor eine Strecke zum ersten Mal läuft, lesen Sie jede Nachricht und ändern, was nicht nach Ihrem Club klingt. Später jederzeit anpassbar.",
    },
    {
      n: "/ 03",
      title: "Abmeldung mit einem Klick.",
      text: "In jeder Nachricht, ohne Rückfrage. Die Einwilligung wird dokumentiert, die Daten bleiben in Deutschland und gehören Ihrem Club.",
    },
  ],
  // Der Mock verlinkt hier nicht (toter <a>). Ziel ist die Plattformseite: dort stehen
  // „Ihre Clubverwaltung bleibt, wo sie ist." (Schnittstellen) und „Vier Zusagen, die im
  // Vertrag stehen." (Daten und Datenschutz). Keine erfundene Route.
  link: {
    label: "Technik, Datenschutz und Schnittstellen",
    target: "intern",
    href: "/plattform",
  },
};

/* ────────────────────────── Seiten-Content + footerClose ────────────────────────── */

export const soArbeitetGolfnext: PageContent = {
  route: "/plattform/so-arbeitet-golfnext",
  // Briefing 0024 liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx),
  // nur Canonical wird gesetzt (wie Plattform/Wachstum/Clubprozesse). Nicht erfinden.
  sections: [
    {
      id: "hero",
      eyebrow: "So arbeitet GolfNext",
      headline: "Nach der Anmeldung hört Ihr Club nicht auf zu reden.",
      text: [
        "Bei den meisten Clubs passiert nach der Anmeldung nichts mehr – bis zum Termin, und danach gar nichts. GolfNext schickt vier Nachrichten: die Bestätigung, die Vorbereitung, das Danke und das nächste Angebot. Geschrieben für Ihren Club, verschickt in seinem Namen, ohne dass jemand im Büro etwas tippt.",
      ],
    },
    {
      id: "strecken",
      eyebrow: "Was tatsächlich verschickt wird",
      headline: "Fünf Zielgruppen, fünf eigene Strecken.",
      text: [
        "Ein Anfänger hat andere Fragen als ein Greenfee-Gast oder ein Unternehmen. Deshalb bekommt jede Zielgruppe ihre eigenen vier Nachrichten – hier zum Nachlesen, so wie Ihre Interessenten sie bekommen.",
      ],
    },
    {
      id: "uebergabe",
      eyebrow: "Wenn es persönlich wird",
      headline: "Die letzte Nachricht schreibt kein System.",
      text: [
        "Automatische Nachrichten bringen einen Menschen bis vor die Tür. Hineingehen lassen ihn Sie. Sobald jemand echtes Interesse zeigt, hört GolfNext auf zu schicken und legt dem Clubteam eine Aufgabe hin – mit allem, was bis dahin passiert ist.",
      ],
    },
    {
      id: "regeln",
      eyebrow: "Ihre Kontrolle",
      headline: "Drei Regeln für alles, was in Ihrem Namen rausgeht.",
      text: ["Es sind Ihre Mitglieder, Ihre Gäste und Ihr Ruf. Deshalb behalten Sie die Hand darauf."],
    },
  ],
  footerClose: {
    eyebrow: "Die passende Strecke für Ihren Club",
    headline: "Welche Zielgruppe soll bei Ihnen als Erstes begleitet werden?",
    text: [
      "In 30 Minuten gehen wir Ihre wichtigsten Zielgruppen durch und schauen, wo heute nach der Anmeldung nichts mehr passiert. Sie bekommen eine ehrliche Einschätzung, keine Verkaufsshow.",
    ],
    cta: {
      label: "Online-Erstgespräch vereinbaren",
      hint: "30 Minuten persönlich per Zoom oder Teams",
      target: "erstgespraech",
    },
    // Persönlicher Abschluss mit Porträt-Platzhalter, wortgleich aus 3.3b `.f-person`.
    person: {
      name: "Fred Hoffmann",
      role: "Gründer von GolfNext, seit mehr als 30 Jahren im Golfmarkt",
    },
  },
};
