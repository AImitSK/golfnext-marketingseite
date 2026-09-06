import type { Cta, PageContent } from "./types";

/**
 * Startseite · /
 * Quelle der Texte: docs/design-system/briefings/3.1-startseite-umsetzungsbriefing.md
 * (finale, von Fred freigegebene Fassungen) für die Abschnitte 1–5 und 7.
 * Abschnitt 6 (Pakete) ist verbindlich die Preislogik Fassung 2 aus
 * docs/design-system/mocks/3.1a-startseite-paketblock-fassung2.html – NICHT die
 * überholten Fassung-1-Preise (8.500/250 …) aus Abschnitt 6 des Umsetzungsbriefings.
 *
 * Regeln (CLAUDE.md): Texte wortgleich, keine erfundenen Zahlen/Modulstatus/Versprechen.
 * Preise werden NIE addiert (Sockel + Modulblock stehen getrennt, keine Summe).
 * Praxis-Kennzahlen zählen beim Sichtbarwerden EINMAL hoch (CountUp, Briefing 0015);
 * der Endwert steht wortgleich im HTML, Reduced-Motion/No-JS zeigt ihn sofort – die
 * Werte hier bleiben also die Wahrheit. Benennung „Turnier-News" (nicht „Club News", auch wenn
 * das Briefing an der Stelle noch „Club News" schreibt – Benennungsregel geht vor).
 * Wortlaut nur nach neuem Fred-Briefing / Freigabe Stefan ändern.
 */

/* ────────────────────────── 1 · Hero ────────────────────────── */

/** Eine Station der Hero-Systemansicht (Kampagne … Buchung). */
export interface HeroStation {
  /** Kleines Label (uppercase), z. B. „Kampagne". */
  label: string;
  /** Titelzeile der Karte, z. B. „Schnuppergolf im Frühjahr". */
  title: string;
  /** Marketing-CRM und E-Mail-Sequenz: Signalgrün-Rahmen (Teil der Sequenz). */
  seq?: boolean;
  /** Eingebundener Inhalt unter der Sequenz – kein eigener Hauptschritt. */
  sub?: { label: string; title: string };
}

export interface HeroData {
  ctaPrimary: Cta;
  ctaSecondary: Cta;
  /** Barrierefreies Label der Systemansicht (dekorative UI-Ausschnitte sind aria-hidden). */
  ariaLabel: string;
  stations: HeroStation[];
}

export const startseiteHero: HeroData = {
  ctaPrimary: {
    label: "Online-Erstgespräch vereinbaren",
    hint: "30 Minuten persönlich per Zoom oder Teams",
    target: "erstgespraech",
  },
  ctaSecondary: { label: "GolfNext selbst ansehen", target: "livedemo" },
  ariaLabel: "Systemansicht: von der Kampagne bis zur bestätigten Buchung",
  stations: [
    { label: "Kampagne", title: "Schnuppergolf im Frühjahr" },
    { label: "Landingpage", title: "Kurs ansehen und anmelden" },
    { label: "Anfrage", title: "Anmeldung eingegangen" },
    { label: "Marketing-CRM", title: "Kontakt und Interesse erkannt", seq: true },
    {
      label: "E-Mail-Sequenz",
      title: "Automatisierte Begleitung gestartet",
      seq: true,
      sub: { label: "Eingebundener Inhalt", title: "Ratgeber zum Schnuppergolf" },
    },
    { label: "Buchung", title: "Platz im Kurs bestätigt" },
  ],
};

/* ────────────────────────── 2 · Vorteile ────────────────────────── */

/** Eine Vorteilskarte mit feststehender Mikrovisualisierung (viz = Illustrations-Id). */
export interface Vorteil {
  title: string;
  text: string;
  /** Welche feststehende, aria-hidden Mikrovisualisierung die Karte zeigt. */
  viz: "funnel" | "book" | "crm" | "done";
}

export interface VorteileData {
  cards: Vorteil[];
  cta: Cta;
}

export const startseiteVorteile: VorteileData = {
  cards: [
    {
      title: "Mehr qualifizierte Anfragen",
      text: "Ihre Angebote erreichen Menschen, für die sie im richtigen Moment relevant sind.",
      viz: "funnel",
    },
    {
      title: "Mehr Abschlüsse",
      text: "Klare Wege führen Interessenten gezielt zur Anfrage, Buchung oder Mitgliedschaft.",
      viz: "book",
    },
    {
      title: "Mehr Überblick",
      text: "Kontakte, Reaktionen und nächste Schritte bleiben strukturiert und steuerbar.",
      viz: "crm",
    },
    {
      title: "Weniger Routine",
      text: "Wiederkehrende Kommunikation und Aufgaben laufen einfacher und zunehmend digital.",
      viz: "done",
    },
  ],
  cta: { label: "GolfNext im Überblick", target: "intern", href: "/plattform" },
};

/* ────────────────────────── 3 · Journey + Zitat ────────────────────────── */

/** Ein Journey-Schritt (obere Ebene). Die UI-Ausschnitte je Schritt sind dekorativ. */
export interface JourneyStep {
  /** „Schritt 1" … „Schritt 4". */
  n: string;
  title: string;
  text: string;
}

/** Eine der zwei dauerhaften Plattformebenen (Entlasten / Verbinden). */
export interface JourneyBand {
  name: string;
  text: string;
  /** Dauerhaft sichtbare Aktionen entlang der Strecke (Endzustand: alle aktiv). */
  actions: string[];
}

export interface JourneyData {
  steps: JourneyStep[];
  bands: JourneyBand[];
  quote: { text: string; name: string; role: string };
  ctaPrimary: Cta;
  ctaSecondary: Cta;
}

export const startseiteJourney: JourneyData = {
  steps: [
    {
      n: "Schritt 1",
      title: "Gefunden werden",
      text: "Kampagnen, Search und relevanter Content schaffen Aufmerksamkeit.",
    },
    {
      n: "Schritt 2",
      title: "Führen",
      text: "Landingpages und klare Angebote geben Orientierung.",
    },
    {
      n: "Schritt 3",
      title: "Konvertieren",
      text: "Anfragen, Buchungen und Bezahlung werden einfach.",
    },
    {
      n: "Schritt 4",
      title: "Entwickeln",
      text: "Marketing-CRM, automatisierte E-Mail-Sequenzen und passende Inhalte begleiten den Kontakt weiter.",
    },
  ],
  bands: [
    {
      name: "Entlasten",
      text: "Wiederkehrende Kommunikation und Abläufe laufen digital.",
      actions: [
        "Häufige Frage beantwortet",
        "Bestätigung versendet",
        "E-Mail-Sequenz gestartet",
        "Inhalt bereitgestellt",
      ],
    },
    {
      name: "Verbinden",
      text: "Kontakte, Inhalte, Reaktionen und nächste Schritte bleiben in einem System.",
      actions: [
        "Herkunft erfasst",
        "Kontakt angelegt",
        "Zielgruppe zugeordnet",
        "Nächster Schritt vorbereitet",
      ],
    },
  ],
  quote: {
    text: "Aus Aufmerksamkeit muss Interesse werden. Aus Interesse eine konkrete Handlung. Und aus dieser Handlung kann eine langfristige Beziehung zum Club entstehen.",
    name: "Fred Hoffmann",
    role: "Gründer von GolfNext · PGA Golfprofessional",
  },
  ctaPrimary: {
    label: "So arbeitet GolfNext",
    target: "intern",
    href: "/plattform/so-arbeitet-golfnext",
  },
  ctaSecondary: { label: "Live-Demo ansehen", target: "livedemo" },
};

/* ────────────────────────── 4 · Wachstum ↔ Clubprozesse ────────────────────────── */

export interface UmschalterCard {
  title: string;
  text: string;
}

export interface UmschalterData {
  wachstum: { cards: UmschalterCard[]; cta: Cta };
  prozesse: {
    cards: UmschalterCard[];
    ergaenzungLabel: string;
    ergaenzungValue: string;
    cta: Cta;
  };
}

export const startseiteUmschalter: UmschalterData = {
  wachstum: {
    cards: [
      {
        title: "Schnuppergolf und Platzreife",
        text: "Aus erster Neugier wird eine konkrete Anmeldung.",
      },
      {
        title: "Mitgliedschaft und Clubwechsel",
        text: "Aus Interesse entsteht ein persönliches Mitgliedschaftsgespräch.",
      },
      {
        title: "Greenfee und Gäste",
        text: "Von der Suche führt ein klarer Weg zur passenden Spielmöglichkeit.",
      },
      {
        title: "Firmenkunden",
        text: "Aus vorhandenen Leistungen werden professionelle Eventangebote.",
      },
    ],
    cta: { label: "Wachstum und Vertrieb ansehen", target: "intern", href: "/wachstum-vertrieb" },
  },
  prozesse: {
    cards: [
      {
        title: "Concierge",
        text: "Beantwortet häufige Fragen auch außerhalb der Bürozeiten.",
      },
      {
        title: "Platzstatus",
        text: "Bringt aktuelle Platzinformationen in wenigen Schritten online.",
      },
      {
        title: "Firmen-Events",
        text: "Erfasst Anfragen vollständig und leitet sie gezielt weiter.",
      },
      {
        // Benennungsregel: „Turnier-News" statt „Club News" (Briefing schreibt hier noch „Club News").
        title: "Turnier-News",
        text: "Macht aus vorhandenen Informationen schnell aktuelle Meldungen.",
      },
    ],
    ergaenzungLabel: "Weitere Clubprozesse auf der Plattform:",
    ergaenzungValue: "Gastfee und Captains App",
    cta: { label: "Clubprozesse ansehen", target: "intern", href: "/clubprozesse" },
  },
};

/* ────────────────────────── 5 · Praxis ────────────────────────── */

export interface PraxisKennzahl {
  /** Wert, wortgleich – z. B. „Rund 1.600" oder „68 Prozent". Wird per CountUp einmal
   * hochgezählt; der Endwert ist exakt dieser String (Reduced-Motion/No-JS = Endwert). */
  value: string;
  label: string;
}

export interface PraxisData {
  chat: {
    name: string;
    role: string;
    liveLabel: string;
    messages: { from: "q" | "a"; text: string; time: string }[];
    placeholder: string;
  };
  anna: {
    tag: string;
    title: string;
    text: string;
    kennzahlen: PraxisKennzahl[];
    status: string;
    cta: Cta;
  };
  second: {
    club: string;
    title: string;
    text: string;
    meta: string;
    cta: Cta;
    shot: { tagline: string; title: string; text: string };
  };
  cta: Cta;
}

export const startseitePraxis: PraxisData = {
  chat: {
    name: "ANNA",
    role: "Digitaler Concierge des Clubs",
    liveLabel: "antwortet rund um die Uhr",
    messages: [
      { from: "q", text: "Wann startet der nächste Schnupperkurs?", time: "22:38 Uhr" },
      {
        from: "a",
        text: "Der nächste Schnupperkurs beginnt am Samstag, 14. März, um 10 Uhr. Es sind noch vier Plätze frei – soll ich Ihnen den Anmeldelink schicken?",
        time: "ANNA · 22:38 Uhr",
      },
      { from: "q", text: "Was kostet ein Greenfee unter der Woche?", time: "22:39 Uhr" },
      {
        from: "a",
        text: "Werktags 55 Euro, mit DGV-Ausweis 45 Euro. Startzeiten können Sie direkt online reservieren.",
        time: "ANNA · 22:39 Uhr",
      },
    ],
    placeholder: "Frage an den Club stellen …",
  },
  anna: {
    tag: "Hauptbeispiel · Golfclub Rehburg-Loccum",
    title: "Der digitale Concierge ANNA",
    text: "ANNA beantwortet Fragen zu Schnuppergolf, Platzreife, Greenfee, Mitgliedschaft und Clubbetrieb. Auch dann, wenn das Clubteam nicht erreichbar ist.",
    // STATISCH – kein Hochzähler (CLAUDE.md-Tabu). Werte bestätigt, nichts erfinden.
    kennzahlen: [
      { value: "Rund 1.600", label: "geführte Dialoge" },
      { value: "Rund 600", label: "Nutzerinnen und Nutzer" },
      { value: "68 Prozent", label: "Nutzung außerhalb regulärer Bürozeiten" },
      { value: "72 Prozent", label: "vollständig geführte Dialoge" },
    ],
    status: "Pilotprojekt im Clubbetrieb",
    cta: { label: "Praxisbeispiel ansehen", target: "intern", href: "/praxis" },
  },
  second: {
    club: "Golfclub Bad Wörishofen",
    title: "Aus Leistungen werden Angebote, die sich verkaufen lassen.",
    text: "Sponsoring und Firmen-Events wurden klar strukturiert und professionell vermarktbar gemacht.",
    meta: "Kommunikations- und Vermarktungsprojekt",
    cta: { label: "Praxisbeispiel ansehen", target: "intern", href: "/praxis" },
    shot: {
      tagline: "Foto folgt",
      title: "Golfclub Bad Wörishofen",
      text: "Ein Eindruck aus dem Projekt folgt an dieser Stelle.",
    },
  },
  cta: { label: "GolfNext in der Praxis", target: "intern", href: "/praxis" },
};

/* ────────────────────────── 6 · Pakete (Fassung 2, aus 3.1a) ────────────────────────── */

/** Ein Preisfeld: großer Wert + zweizeiliger Schlüssel (nie mit anderen addiert). */
export interface PricePair {
  value: string;
  keyLines: string[];
}

export interface StartPaketKarte {
  /** Stufenklasse a|b|c (Stripe-Farbe). b ist die mittige Karte (Navy-Rahmen, KEINE Bestseller-Badge). */
  variant: "a" | "b" | "c";
  mid?: boolean;
  role: string;
  name: string;
  claim: string;
  modLabel: string;
  /** Modul-Preisfelder der Stufe (Einrichtung + monatlich) – stehen getrennt vom Sockel. */
  modRows: PricePair[];
  link: Cta;
}

export interface PaketeData {
  sockband: {
    label: string;
    name: string;
    prices: PricePair[];
    badge: string;
  };
  cards: StartPaketKarte[];
  note: string;
  mainLink: Cta;
}

export const startseitePakete: PaketeData = {
  sockband: {
    label: "Basis in jedem Paket",
    name: "Ihre Clubwebsite",
    prices: [
      { value: "6.800 €", keyLines: ["einmalige Einrichtung"] },
      { value: "238 €", keyLines: ["monatlich für Betrieb und Support"] },
    ],
    badge: "Auch einzeln buchbar",
  },
  cards: [
    {
      variant: "a",
      role: "Marketing und Nachfrage",
      name: "Wachstum",
      claim: "Aus digitaler Sichtbarkeit werden Anfragen, die begleitet werden.",
      modLabel: "Wachstumsmodule",
      modRows: [
        { value: "5.200 €", keyLines: ["einmalige", "Einrichtung"] },
        { value: "312 €", keyLines: ["monatlich"] },
      ],
      link: { label: "Paket ansehen", target: "pakete" },
    },
    {
      variant: "b",
      mid: true,
      role: "Digitale Clubzentrale",
      name: "Komplett",
      claim: "Wachstum nach außen und Entlastung nach innen in einem System.",
      modLabel: "Komplettmodule",
      modRows: [
        { value: "7.200 €", keyLines: ["einmalige", "Einrichtung"] },
        { value: "462 €", keyLines: ["monatlich"] },
      ],
      link: { label: "Paket ansehen", target: "pakete" },
    },
    {
      variant: "c",
      role: "Clubspezifisch",
      name: "Individuell",
      claim: "Für Anlagen mit eigenen Systemen oder mehreren Standorten.",
      modLabel: "Individuelle Module",
      modRows: [
        { value: "auf Anfrage", keyLines: ["einmalige", "Einrichtung"] },
        { value: "ab 662 €", keyLines: ["monatlich"] },
      ],
      link: { label: "Anforderungen besprechen", target: "pakete" },
    },
  ],
  note: "Alle Preise netto zuzüglich Umsatzsteuer. Das Werbebudget legen Sie selbst fest; darauf berechnen wir 10 % Verwaltungshonorar. Stand September 2026.",
  mainLink: { label: "Pakete und Leistungen vergleichen", target: "pakete" },
};

/* ────────────────────────── Seiten-Content + footerClose ────────────────────────── */

export const startseite: PageContent = {
  route: "/",
  // Kein Meta-Titel/-Text im Briefing → Root-Default belassen (Feinschliff Phase 6), nicht erfinden.
  meta: { title: null, description: null },
  sections: [
    {
      id: "hero",
      eyebrow: "Die aktive digitale Clubzentrale für Golfclubs",
      headlineLines: ["Mehr Menschen für Ihren Club.", "Weniger Aufwand für Ihr Team."],
      text: [
        "GolfNext verbindet Website, Kampagnen, Landingpages, Marketing-CRM, automatisierte E-Mail-Sequenzen und ausgewählte Clubprozesse. So gewinnt Ihr Club mehr qualifizierte Kontakte und Ihr Team mehr Zeit.",
      ],
    },
    {
      id: "vorteile",
      eyebrow: "Was sich für Ihren Club verbessert",
      headline: "Mehr Nachfrage. Mehr Abschlüsse. Weniger Aufwand.",
    },
    {
      id: "journey",
      eyebrow: "So arbeitet GolfNext",
      headline: "Vier Schritte. Zwei Wirkungen. Ein verbundenes System.",
      text: [
        "GolfNext begleitet Menschen vom ersten digitalen Kontakt bis zum nächsten wichtigen Schritt mit Ihrem Club.",
      ],
    },
    {
      id: "umschalter",
      eyebrow: "Zwei Seiten derselben Plattform",
      headline: "Wachstum nach außen. Entlastung nach innen.",
      text: ["GolfNext gewinnt neue Kontakte und erleichtert gleichzeitig den Cluballtag."],
    },
    {
      id: "praxis",
      eyebrow: "GolfNext im Cluballtag",
      headline: "Was im Cluballtag zählt, muss dort funktionieren.",
      text: [
        "GolfNext entsteht nicht am Reißbrett, sondern in realen Projekten und Abläufen mit Golfclubs.",
      ],
    },
    {
      id: "pakete",
      eyebrow: "Drei Ausbaustufen",
      headline: "GolfNext wächst mit den Zielen Ihres Clubs.",
      text: [
        "Jeder Club startet mit derselben Basis: einer individuellen Clubwebsite, die technisch betreut wird. Darauf kommt genau das, was Ihr Club zusätzlich braucht.",
      ],
    },
  ],
  footerClose: {
    eyebrow: "GolfNext persönlich kennenlernen",
    headline: "Was könnte GolfNext in Ihrem Club verändern?",
    text: [
      "In 30 Minuten schauen wir gemeinsam auf Ihre Ziele, Ihre größten Hebel und die Frage, ob GolfNext grundsätzlich zu Ihrem Club passt.",
      "Sie erhalten eine ehrliche erste Einschätzung, welche Lösungen und welche Ausbaustufe für Sie sinnvoll sein könnten.",
    ],
    cta: {
      label: "Online-Erstgespräch vereinbaren",
      hint: "30 Minuten persönlich per Zoom oder Teams",
      target: "erstgespraech",
    },
    secondary: { label: "Oder zuerst die Live-Demo ansehen", target: "livedemo" },
    persoenlicheZeile:
      "Ihr Ansprechpartner ist Fred Hoffmann, Gründer von GolfNext und seit mehr als 30 Jahren professionell im Golfmarkt tätig.",
  },
};
