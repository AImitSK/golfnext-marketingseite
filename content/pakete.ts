import type { Cta, PageContent } from "./types";

/**
 * Pakete · /pakete
 * Quelle: docs/design-system/mocks/3.7-pakete.html (Fassung 2, „gültiger" Mock),
 * Preise verbindlich aus docs/02-preislogik.md (Fassung 2).
 * Wortlaut NICHT ändern. Preise werden auf der Seite NIE addiert – Sockel und
 * Modulblock stehen durch ein Pluszeichen getrennt untereinander (keine Summe).
 * Änderungen nur nach neuem Briefing von Fred / Freigabe Stefan.
 */

/** Eine Ausbaustufe im Hero-„Rückgrat"-Stapel. */
export interface StackRow {
  /** Name der Stufe, z. B. „Ihre Clubwebsite" oder „+ Wachstum". */
  name: string;
  /** Kurzrolle rechts, z. B. „In jedem Paket". */
  role: string;
  /** Modul-/Leistungs-Chips der Stufe. */
  tags: string[];
  /** Der Sockel (unterste, grün markierte Zeile). */
  base?: boolean;
}

export interface HeroData {
  ctaPrimary: Cta;
  ctaSecondary: Cta;
  stack: StackRow[];
  stackFoot: string;
}

/** Ein Preisfeld: großer Wert + zweizeiliger Schlüssel. */
export interface PriceField {
  value: string;
  /** Schlüsseltext, im Mock mit Umbruch – hier als Zeilen-Array. */
  keyLines: string[];
}

export interface BasisData {
  sockband: {
    badge: string;
    title: string;
    sub: string;
    prices: PriceField[];
  };
  socklist: string[];
  sockfoot: string;
  rail: {
    left: { rw: string; title: string; text: string; steps: { n: string; label: string }[] };
    go: string;
    right: { rw: string; title: string; text: string; steps: string[] };
  };
}

export interface PaketKarte {
  /** Stufenklasse a|b|c (Stripe-/Punktfarbe); b ist die hervorgehobene Mitte. */
  variant: "a" | "b" | "c";
  highlight?: boolean;
  role: string;
  name: string;
  claim: string;
  /** Sockelzeile: Label + Wert (nie mit dem Modulblock addiert). */
  sock: { label: string; value: string };
  modLabel: string;
  modRows: PriceField[];
  /** Aufklapp-Zusammenfassung: zwei Labels wie im Mock (.it / .ic). */
  summaryLead: string;
  summaryCount: string;
  items: string[];
  tlink: Cta;
}

export interface AdBox {
  label: string;
  title: string;
  text: string;
}

export interface PaketeData {
  cards: PaketKarte[];
  adbox: AdBox;
}

/** Eine Zelle der Vergleichstabelle. */
export type CmpCell =
  | { kind: "yes" }
  | { kind: "no" }
  | { kind: "text"; text: string }
  | { kind: "money"; sock?: string; mod: string };

export interface CmpRow {
  label: string;
  money?: boolean;
  cells: CmpCell[];
}

export interface CmpGroup {
  title: string;
  rows: CmpRow[];
}

export interface VergleichData {
  columns: string[];
  groups: CmpGroup[];
  note: string;
}

export interface FaqEntryData {
  question: string;
  answer: string;
}

// ---------------------------------------------------------------------------
// Sektionsdaten (typisiert, damit die Komponenten sie ohne Casts importieren).
// ---------------------------------------------------------------------------

export const paketeHero: HeroData = {
  ctaPrimary: { label: "Pakete ansehen", target: "intern", href: "#pakete" },
  ctaSecondary: {
    label: "Online-Erstgespräch vereinbaren",
    hint: "30 Minuten persönlich per Zoom oder Teams",
    target: "erstgespraech",
  },
  stack: [
    {
      base: true,
      name: "Ihre Clubwebsite",
      role: "In jedem Paket",
      tags: ["Website", "Texte", "Hosting", "Support"],
    },
    {
      name: "+ Wachstum",
      role: "Neue Kontakte",
      tags: ["Reach", "Search", "Landingpages", "Marketing-CRM", "Lifecycle", "Analytics"],
    },
    {
      name: "+ Komplett",
      role: "Auch der Cluballtag",
      tags: ["Concierge", "Platzstatus", "Gastfee", "Captains App", "Turnier-News"],
    },
    {
      name: "+ Individuell",
      role: "Clubspezifisch",
      tags: ["Mehrere Anlagen", "Eigene Schnittstellen"],
    },
  ],
  stackFoot: "Sie können bei der Website bleiben oder jederzeit erweitern. Nichts wird ersetzt.",
};

export const paketeBasis: BasisData = {
  sockband: {
    badge: "In jedem Paket enthalten · einzeln buchbar",
    title: "Ihre Clubwebsite",
    sub: "Individuell aufgebaut, technisch betreut und jederzeit erweiterbar. Der Sockel bleibt derselbe, egal welche Ausbaustufe darauf kommt.",
    prices: [
      { value: "6.800 €", keyLines: ["einmalige", "Einrichtung"] },
      { value: "238 €", keyLines: ["monatlich für", "Betrieb und Support"] },
    ],
  },
  socklist: [
    "Individuelle Clubwebsite im GolfNext-Design",
    "Responsive Darstellung für Desktop, Tablet und Smartphone",
    "Website- und Angebotstexte",
    "Technischer Plattformbetrieb",
    "Hosting, Systempflege und Sicherheitsupdates",
    "Support im vereinbarten Umfang",
  ],
  sockfoot:
    "Alle Preise netto zuzüglich der gesetzlichen Umsatzsteuer. Dieser Sockel steckt unverändert in allen drei Paketen – er wird nicht zusätzlich berechnet.",
  rail: {
    left: {
      rw: "Einmalig",
      title: "Die Einrichtung",
      text: "Jeder Club erhält einen individuell aufgebauten Auftritt statt einer freigeschalteten Vorlage.",
      steps: [
        { n: "1", label: "Strategie" },
        { n: "2", label: "Design" },
        { n: "3", label: "Website" },
        { n: "4", label: "Inhalte" },
        { n: "5", label: "Module" },
        { n: "6", label: "Prüfung" },
        { n: "7", label: "Einführung" },
      ],
    },
    go: "Go-live",
    right: {
      rw: "Monatlich · dauerhaft",
      title: "Der laufende Betrieb",
      text: "Nach dem Go-live bleibt das System ganzjährig verfügbar – auch außerhalb einzelner Kampagnen.",
      steps: ["Hosting", "Systempflege", "Updates", "Weiterentwicklung", "Support"],
    },
  },
};

const SOCK = { label: "Ihre Clubwebsite", value: "6.800 € · 238 €/Monat" } as const;

export const paketePakete: PaketeData = {
  cards: [
    {
      variant: "a",
      role: "Marketing und Nachfrage",
      name: "Wachstum",
      claim: "Aus digitaler Sichtbarkeit werden Anfragen, die begleitet werden.",
      sock: { ...SOCK },
      modLabel: "Wachstumsmodule",
      modRows: [
        { value: "5.200 €", keyLines: ["einmalige", "Einrichtung"] },
        { value: "312 €", keyLines: ["monatlich"] },
      ],
      summaryLead: "Zusätzlich enthalten",
      summaryCount: "9 Leistungen anzeigen",
      items: [
        "Reach · Werbung über Social und Google",
        "Search",
        "Landingpages",
        "Marketing-CRM",
        "Lifecycle und automatisierte E-Mail-Sequenzen",
        "Blog- und Ratgeberartikel",
        "Analytics",
        "Firmen-Events",
        "Zwei Kampagnen-Slots",
      ],
      tlink: { label: "Wachstum im Erstgespräch besprechen", target: "erstgespraech" },
    },
    {
      variant: "b",
      highlight: true,
      role: "Digitale Clubzentrale",
      name: "Komplett",
      claim: "Wachstum nach außen und Entlastung nach innen in einem System.",
      sock: { ...SOCK },
      modLabel: "Komplettmodule",
      modRows: [
        { value: "7.200 €", keyLines: ["einmalige", "Einrichtung"] },
        { value: "462 €", keyLines: ["monatlich"] },
      ],
      summaryLead: "Alles aus Wachstum",
      summaryCount: "7 weitere anzeigen",
      items: [
        "Concierge",
        "Platzstatus",
        "Gastfee",
        "Captains App",
        "Turnier-News",
        "Jahres-Kampagnen-Planung",
        "Vier Kampagnen-Slots",
      ],
      tlink: { label: "Komplett im Erstgespräch besprechen", target: "erstgespraech" },
    },
    {
      variant: "c",
      role: "Clubspezifisch",
      name: "Individuell",
      claim: "Für Anlagen mit eigenen Systemen oder mehreren Standorten.",
      sock: { ...SOCK },
      modLabel: "Individuelle Module",
      modRows: [
        { value: "auf Anfrage", keyLines: ["einmalige", "Einrichtung"] },
        { value: "ab 662 €", keyLines: ["monatlich"] },
      ],
      summaryLead: "Alles aus Komplett",
      summaryCount: "4 weitere anzeigen",
      items: [
        "Mehrere Anlagen oder Standorte",
        "Schnittstellen zu vorhandenen Systemen",
        "Zusätzliche Kampagnen-Slots",
        "Eigene Inhalte und Sonderprozesse",
      ],
      tlink: { label: "Anforderungen gemeinsam prüfen", target: "erstgespraech" },
    },
  ],
  adbox: {
    label: "Nicht in den Paketpreisen enthalten",
    title: "Das Werbebudget legen Sie selbst fest.",
    text: "Das Reach-Modul spielt Werbung über Social Media und Google aus. Das Mediabudget geht direkt an die Werbekanäle, und Ihr Club bestimmt seine Höhe. GolfNext berechnet darauf 10 % Verwaltungshonorar für Einrichtung, Steuerung und Auswertung der Kampagnen.",
  },
};

// Zellen-Kurzschreibweisen für die Vergleichstabelle.
const YES: CmpCell = { kind: "yes" };
const NO: CmpCell = { kind: "no" };
const txt = (text: string): CmpCell => ({ kind: "text", text });

export const paketeVergleich: VergleichData = {
  columns: ["Leistung", "Nur Website", "Wachstum", "Komplett", "Individuell"],
  groups: [
    {
      title: "Website und Betrieb",
      rows: [
        { label: "Individuelle Clubwebsite", cells: [YES, YES, YES, YES] },
        { label: "Responsive Darstellung", cells: [YES, YES, YES, YES] },
        { label: "Website- und Angebotstexte", cells: [YES, YES, YES, YES] },
        { label: "Technischer Plattformbetrieb", cells: [YES, YES, YES, YES] },
        { label: "Hosting, Systempflege und Updates", cells: [YES, YES, YES, YES] },
        { label: "Support im vereinbarten Umfang", cells: [YES, YES, YES, YES] },
      ],
    },
    {
      title: "Wachstum und Vertrieb",
      rows: [
        { label: "Reach · Werbung über Social und Google", cells: [NO, YES, YES, YES] },
        { label: "Search", cells: [NO, YES, YES, YES] },
        { label: "Landingpages", cells: [NO, YES, YES, YES] },
        { label: "Marketing-CRM", cells: [NO, YES, YES, YES] },
        { label: "Lifecycle und E-Mail-Sequenzen", cells: [NO, YES, YES, YES] },
        { label: "Blog- und Ratgeberartikel", cells: [NO, YES, YES, YES] },
        { label: "Analytics", cells: [NO, YES, YES, YES] },
        { label: "Firmen-Events", cells: [NO, YES, YES, YES] },
        { label: "Kampagnen-Slots", cells: [NO, txt("2"), txt("4"), txt("individuell")] },
        { label: "Jahres-Kampagnen-Planung", cells: [NO, NO, YES, YES] },
      ],
    },
    {
      title: "Cluballtag",
      rows: [
        { label: "Concierge", cells: [NO, NO, YES, YES] },
        { label: "Platzstatus", cells: [NO, NO, YES, YES] },
        { label: "Gastfee", cells: [NO, NO, YES, YES] },
        { label: "Captains App", cells: [NO, NO, YES, YES] },
        { label: "Turnier-News", cells: [NO, NO, YES, YES] },
      ],
    },
    {
      title: "Investition",
      rows: [
        {
          label: "Einmalige Einrichtung",
          money: true,
          cells: [
            { kind: "money", mod: "6.800 €" },
            { kind: "money", sock: "Website 6.800 €", mod: "+ 5.200 €" },
            { kind: "money", sock: "Website 6.800 €", mod: "+ 7.200 €" },
            { kind: "money", sock: "Website 6.800 €", mod: "+ auf Anfrage" },
          ],
        },
        {
          label: "Monatlich",
          money: true,
          cells: [
            { kind: "money", mod: "238 €" },
            { kind: "money", sock: "Website 238 €", mod: "+ 312 €" },
            { kind: "money", sock: "Website 238 €", mod: "+ 462 €" },
            { kind: "money", sock: "Website 238 €", mod: "+ ab 662 €" },
          ],
        },
        {
          label: "Werbebudget",
          cells: [NO, txt("selbst festgelegt"), txt("selbst festgelegt"), txt("selbst festgelegt")],
        },
      ],
    },
  ],
  note: "Alle Preise netto zuzüglich der gesetzlichen Umsatzsteuer. Das Werbebudget wird separat vom Club festgelegt; darauf fallen 10 % Verwaltungshonorar an.",
};

export const paketeFaq: FaqEntryData[] = [
  {
    question: "Können wir nur die Website buchen?",
    answer:
      "Ja. Die Clubwebsite ist einzeln buchbar – für 6.800 € einmalig und 238 € monatlich für Betrieb und Support. Module lassen sich später jederzeit ergänzen, ohne dass die Website neu gebaut werden muss.",
  },
  {
    question: "Können wir später in eine größere Ausbaustufe wechseln?",
    answer:
      "Ja. Alle Stufen laufen auf derselben GolfNext-Plattform. Es kommt jeweils nur der zusätzliche Modulblock hinzu, der bestehende Auftritt bleibt bestehen.",
  },
  {
    question: "Warum gibt es eine einmalige Einrichtung und eine monatliche Gebühr?",
    answer:
      "Die Einrichtung deckt den individuellen Aufbau ab: Strategie, Design, Website, Inhalte, Module und Go-live. Die monatliche Gebühr deckt den laufenden Betrieb: Hosting, Systempflege, Updates, Weiterentwicklung und Support.",
  },
  {
    question: "Warum läuft die monatliche Gebühr ganzjährig?",
    answer:
      "Website, Concierge, Marketing-CRM, Lifecycle und Clubprozesse bleiben ganzjährig aktiv. Auch saisonale Kampagnen brauchen ein System, das dauerhaft verfügbar ist und in das neue Kontakte geführt werden können.",
  },
  {
    question: "Ist das Werbebudget in den Preisen enthalten?",
    answer:
      "Nein. Das Mediabudget legt Ihr Club selbst fest und es fließt direkt in die Werbekanäle. GolfNext berechnet darauf 10 % Verwaltungshonorar für Einrichtung, Steuerung und Auswertung der Kampagnen. Dadurch bleibt transparent, welcher Betrag in die Plattform und welcher in die Medienausspielung geht.",
  },
  {
    question: "Was bedeutet ein Kampagnen-Slot?",
    answer:
      "Ein Kampagnen-Slot ist ein vereinbarter, aktiv betreuter Kampagnenschwerpunkt – etwa Schnuppergolf, Platzreife, Mitgliedschaft, Greenfee oder Firmen-Events. Laufzeit, Kanal und Werbebudget werden passend zum jeweiligen Ziel geplant.",
  },
  {
    question: "Ersetzt GolfNext unsere Clubverwaltungssoftware?",
    answer:
      "Nein. GolfNext ergänzt bestehende Systeme dort, wo digitales Marketing, Interessentenführung, Kommunikation und ausgewählte Clubprozesse verbunden werden sollen.",
  },
];

/**
 * Zusammengesetzter Seiteninhalt nach PageContent. Die Sektionsdaten hängen an
 * `section.data` und sind zusätzlich einzeln typisiert exportiert (oben), damit
 * die Sektionskomponenten sie ohne Cast importieren können.
 */
export const pakete: PageContent = {
  route: "/pakete",
  meta: {
    title: "GolfNext Pakete und Preise für Golfclubs",
    description:
      "GolfNext bietet drei Ausbaustufen für Golfclubs: digitale Grundlage, systematisches Wachstum und eine vollständige digitale Clubzentrale.",
  },
  sections: [
    {
      id: "hero",
      eyebrow: "GolfNext Pakete",
      headlineLines: ["Eine Clubwebsite.", "Drei Wege, sie arbeiten zu lassen."],
      text: [
        "Jeder Club startet mit derselben Basis: einer individuellen Clubwebsite, die technisch betreut wird. Darauf kommt genau das, was Ihr Club zusätzlich braucht – Marketing, Cluballtag oder beides.",
      ],
    },
    {
      id: "basis",
      eyebrow: "Der gemeinsame Sockel",
      headline: "Zuerst die Website. Alles Weitere baut darauf auf.",
      text: [
        "Die Clubwebsite ist in jedem Paket gleich enthalten – und sie ist auch allein buchbar. Ein Club, der zunächst nur einen modernen, verlässlich betreuten Auftritt möchte, bekommt genau das. Der Ausbau bleibt jederzeit möglich, ohne dass etwas neu gebaut werden muss.",
      ],
    },
    {
      id: "pakete",
      eyebrow: "Was auf die Website kommt",
      headline: "Drei Ausbaustufen auf derselben Basis.",
      text: [
        "Die Preise stehen getrennt: unten der Sockel für Website und Betrieb, darüber der Aufpreis für die Module. So bleibt sichtbar, wofür Sie tatsächlich zahlen.",
      ],
    },
    {
      id: "vergleich",
      eyebrow: "Leistungen auf einen Blick",
      headline: "Was in welcher Stufe enthalten ist.",
      text: ["Jede Stufe enthält alles aus der vorherigen. Nichts wird ersetzt, es kommt nur hinzu."],
    },
    {
      id: "faq",
      eyebrow: "Klarheit vor dem Gespräch",
      headline: "Häufige Fragen zu den Paketen.",
    },
  ],
  footerClose: {
    eyebrow: "Die passende Ausbaustufe für Ihren Club",
    headline: "Wo liegt für Ihren Club der größte digitale Hebel?",
    text: [
      "Im Online-Erstgespräch schauen wir uns Ihre Ziele und Ihre vorhandenen Systeme an. Sie erhalten eine ehrliche Einschätzung, welche Ausbaustufe zu Ihrer Situation passt.",
    ],
    cta: {
      label: "Online-Erstgespräch vereinbaren",
      hint: "30 Minuten persönlich per Zoom oder Teams",
      target: "erstgespraech",
    },
  },
};
