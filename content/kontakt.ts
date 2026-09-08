import type { Cta, PageContent } from "./types";

/**
 * Kontakt · /kontakt
 * Quelle der Texte: docs/design-system/mocks/3.10-kontakt.html (v01, Stefan,
 * 07.09.2026) und Briefing docs/briefings/0025-kontakt.md.
 *
 * Regeln (CLAUDE.md / 0025): Texte wortgleich – Zeichensetzung, en-Dash „–",
 * Mittelpunkt „·", Auslassungspunkte „Ich bin …", Ziffernabstand („9 bis 18 Uhr").
 * KEINE erfundenen Zahlen, keine Zusagen über den Mock hinaus.
 *
 * Meldungstexte (Feldfehler, Alerts, Ladezustand) stehen NICHT hier, sondern in
 * `lib/forms/messages.ts` – eine Quelle für Server (zod) und Blur-Validierung.
 *
 * Kontaktdaten (Telefon, E-Mail, Name, Rolle) kommen aus `KONTAKT` in
 * `config/site-structure.ts`, CTA-Ziele aus `lib/links.ts` – hier steht nichts
 * hart kodiert. Die Rolle in der Seitenspalte ist der ausführlichere Mock-Wortlaut
 * („… seit mehr als 30 Jahren im Golfmarkt") und steht deshalb als eigener Text.
 *
 * Die Anschrift trägt bewusst beschriftete Platzhalter („Straße und Hausnummer
 * folgt", „PLZ und Ort folgt") – wortgleich aus dem Mock. Sie werden NICHT durch
 * erfundene Angaben ersetzt; die echte Anschrift kommt mit den Rechtstexten (5.2).
 */

/* ────────────────────────── Auswahlfelder ────────────────────────── */

/**
 * „Ich bin …" – die fünf Rollen aus Mock 3.10, in dieser Reihenfolge und
 * Schreibweise. Auch die Server-Validierung prüft gegen genau diese Liste.
 *
 * Der Mock führt keine leere Vorauswahl. Bewusste Abweichung (Entscheidung Stefan,
 * 07.09.2026): Beide Auswahlfelder sind optional – ohne neutralen ersten Eintrag
 * würde jede Anfrage 'Ehrenamtlicher Vorstand eines e.V.' bzw.
 * 'Erstgespräch vereinbaren' melden, auch wenn niemand das gewählt hat. Fred
 * bekäme also eine erfundene Angabe. Der Mock ist ein statisches Bild und kennt
 * diese Frage nicht.
 */
/** Neutrale Vorauswahl beider Auswahlfelder. Leerer Wert = keine Angabe. */
export const KONTAKT_AUSWAHL_LEER = "Bitte wählen";

export const KONTAKT_ROLLEN = [
  "Ehrenamtlicher Vorstand eines e.V.",
  "Betreiber einer Golfanlage",
  "Clubmanager",
  "Mitarbeiter Clubsekretariat",
  "etwas anderes",
] as const;

/** „Worum geht es?" – die sechs Anliegen aus Mock 3.10, in dieser Reihenfolge. */
export const KONTAKT_THEMEN = [
  "Erstgespräch vereinbaren",
  "Frage zu den Paketen und Preisen",
  "Frage zu einem einzelnen Modul",
  "Bestehende Website übernehmen",
  "Presse oder Kooperation",
  "Etwas anderes",
] as const;

export type KontaktRolle = (typeof KONTAKT_ROLLEN)[number];
export type KontaktThema = (typeof KONTAKT_THEMEN)[number];

/* ────────────────────────── 1 · Hero ────────────────────────── */

export interface HeroData {
  /** Die drei Vertrauenspunkte unter dem Lead (grüner Punkt + Text). */
  trust: string[];
}

export const kontaktHero: HeroData = {
  trust: [
    "Rückmeldung innerhalb eines Werktags",
    "Kein Callcenter, keine Warteschleife",
    "Keine Anmeldung zu irgendeinem Newsletter",
  ],
};

/* ────────────────────────── 2 · Formular und Seitenspalte ────────────────────────── */

/** Beschriftung, Zusatz („· optional") und Platzhalter eines Feldes – alles aus dem Mock. */
export interface FeldTexte {
  label: string;
  /** Zusatz hinter dem Label, im Mock `<span class="opt">` („· optional"). */
  optional?: string;
  placeholder?: string;
  /** Hilfetext unter dem Feld (`.fld .hint`). */
  hint?: string;
}

export interface FormularData {
  felder: {
    vorname: FeldTexte;
    nachname: FeldTexte;
    rolle: FeldTexte;
    club: FeldTexte;
    thema: FeldTexte;
    email: FeldTexte;
    telefon: FeldTexte;
    nachricht: FeldTexte;
  };
  /** Einwilligung: Der Satz ist dreigeteilt, weil „Datenschutzerklärung" verlinkt wird. */
  einwilligung: {
    vorLink: string;
    link: string;
    nachLink: string;
  };
  absenden: string;
  /** Zeile neben dem Button (`.fsub .note`). */
  note: string;
}

export const kontaktFormular: FormularData = {
  felder: {
    vorname: { label: "Vorname", placeholder: "Anna" },
    nachname: { label: "Nachname", placeholder: "Berger" },
    rolle: {
      label: "Ich bin …",
      hint: "Ein ehrenamtlicher Vorstand hat andere Fragen als ein Sekretariat. Wir stellen uns darauf ein, bevor wir antworten.",
    },
    club: {
      label: "Golfclub oder Anlage",
      optional: "· optional",
      placeholder: "Golfclub Musterhausen",
    },
    thema: { label: "Worum geht es?" },
    email: { label: "E-Mail", placeholder: "anna.berger@golfclub-musterhausen.de" },
    telefon: {
      label: "Telefon",
      optional: "· optional",
      placeholder: "0171 1234567",
      hint: "Wenn Sie lieber angerufen werden.",
    },
    nachricht: {
      label: "Ihre Nachricht",
      placeholder:
        "Wir sind ein 18-Loch-Club mit rund 600 Mitgliedern. Unsere Schnupperkurse füllen sich seit zwei Jahren nicht mehr – wie würden Sie da vorgehen?",
    },
  },
  einwilligung: {
    vorLink: "Ich habe die ",
    link: "Datenschutzerklärung",
    nachLink:
      " gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden. Die Einwilligung kann ich jederzeit widerrufen.",
  },
  absenden: "Nachricht senden",
  note: "Wir melden uns innerhalb eines Werktags. Ihre Daten gehen an niemanden sonst.",
};

/** Die klebende Seitenspalte: Fred und der Rollen-Hinweis. */
export interface SeitenspalteData {
  /** Ausführlicher Rollen-Wortlaut aus dem Mock (Kurzform steht in KONTAKT). */
  rolleLang: string;
  /** Erreichbarkeit unter den Kontaktzeilen (`.pers .when`). */
  erreichbar: string;
  rollenhinweis: { eyebrow: string; headline: string; text: string };
}

export const kontaktSeitenspalte: SeitenspalteData = {
  rolleLang: "Gründer von GolfNext · PGA Golfprofessional · seit mehr als 30 Jahren im Golfmarkt",
  erreichbar: "Montag bis Freitag, 9 bis 18 Uhr",
  rollenhinweis: {
    eyebrow: "Warum wir nach Ihrer Rolle fragen",
    headline: "Damit die Antwort zu Ihrem Alltag passt.",
    text: "Ein ehrenamtlicher Vorstand will wissen, ob sich das rechnet und wie er es der Versammlung erklärt. Ein Betreiber fragt nach Auslastung und Gästen. Ein Clubmanager will ein System statt fünf Werkzeugen. Und im Sekretariat geht es um das Telefon. Wir antworten nicht allen dasselbe.",
  },
};

/* ────────────────────────── 3 · Wege ────────────────────────── */

/** Ein Weg mit Icon-Kennung, Titel, Text und Verweis. */
export interface WegData {
  /** Wählt das Icon in der Komponente (Kalender · Hörer). */
  icon: "kalender" | "telefon";
  headline: string;
  text: string;
  /** `telefon` löst die Nummer aus KONTAKT als `tel:`-Link auf. */
  cta: Cta | { label: null; target: "telefon" };
}

export const kontaktWege: WegData[] = [
  {
    icon: "kalender",
    headline: "Online-Erstgespräch",
    text: "30 Minuten per Zoom oder Teams. Wir schauen auf Ihre Ziele, Ihre größten Hebel und ob GolfNext überhaupt zu Ihrem Club passt. Termin selbst wählen.",
    cta: { label: "Termin aussuchen", target: "erstgespraech" },
  },
  {
    icon: "telefon",
    headline: "Einfach anrufen",
    // Die Nummer steht im Mock im Fließtext – sie bleibt wortgleich stehen und wird
    // NICHT durch KONTAKT.telefon ersetzt, weil sie Teil des Satzes ist.
    text: "0175 5951839, Montag bis Freitag zwischen 9 und 18 Uhr. Wenn es klingelt und niemand rangeht, ist Fred gerade auf dem Platz – dann ruft er zurück.",
    // Beschriftung ist die Nummer selbst → kommt aus KONTAKT, nicht hart kodiert.
    cta: { label: null, target: "telefon" },
  },
];

/* ────────────────────────── 4 · Anschrift ────────────────────────── */

export interface AnschriftSpalte {
  /** Kleines Label über der Spalte (`.addr .al`). */
  label: string;
  /** Zeilen der Spalte; `muted` sind die im Mock kleiner gesetzten `<span>`-Zeilen. */
  zeilen: { text: string; muted?: boolean }[];
}

export interface AnschriftData {
  anschrift: AnschriftSpalte;
  /** Label der Spalte „Direkt erreichbar" – Inhalt kommt aus KONTAKT. */
  erreichbarLabel: string;
  /** Label der Spalte „Rechtliches" – die Ziele kommen aus site-structure. */
  rechtlichesLabel: string;
}

export const kontaktAnschrift: AnschriftData = {
  anschrift: {
    label: "Anschrift",
    zeilen: [
      { text: "GolfNext" },
      { text: "Fred Hoffmann" },
      // Beschriftete Platzhalter, wortgleich aus dem Mock – nichts erfinden.
      { text: "Straße und Hausnummer folgt", muted: true },
      { text: "PLZ und Ort folgt", muted: true },
    ],
  },
  erreichbarLabel: "Direkt erreichbar",
  rechtlichesLabel: "Rechtliches",
};

/* ────────────────────────── Seite ────────────────────────── */

export const kontakt: PageContent = {
  route: "/kontakt",
  // Mock 3.10 nennt keine technischen Seitenangaben (Titel/Beschreibung) → Root-Default
  // aus app/layout.tsx über das Navigations-Label, nur Canonical wird gesetzt. Nicht
  // erfinden (Feinschliff Phase 6), wie auf allen anderen Seiten der Neufassung.
  meta: { title: null, description: null },
  sections: [
    {
      id: "hero",
      eyebrow: "Kontakt",
      headline: "Schreiben Sie uns. Es antwortet ein Mensch.",
      text: [
        "Ob Sie nur eine Frage haben, GolfNext sehen wollen oder wissen möchten, was es für Ihren Club kostet: Ihre Nachricht landet direkt bei Fred Hoffmann – nicht in einem Ticketsystem.",
      ],
    },
    {
      id: "formular",
      headline: "Ihre Nachricht an GolfNext",
      text: [
        "Je konkreter, desto besser die Antwort. Pflichtfelder sind Name, E-Mail und Ihre Nachricht – alles andere hilft uns nur, gleich das Richtige zu sagen.",
      ],
    },
    {
      id: "wege",
      eyebrow: "Andere Wege zu uns",
      headline: "Nicht jeder schreibt gern ein Formular.",
      text: ["Drei weitere Möglichkeiten, mit uns ins Gespräch zu kommen – jede ohne Verpflichtung."],
    },
    {
      id: "anschrift",
      eyebrow: "Wo wir zu finden sind",
      headline: "GolfNext",
    },
  ],
  // Mock 3.10 führt KEINEN persönlichen Abschluss (`.f-close` ist im CSS vorhanden,
  // steht aber nicht im Markup) – der Footer beginnt hier mit der Modul-Landkarte.
  // Nicht dazuerfinden (Briefing 0025: „entscheidet der Mock").
};
