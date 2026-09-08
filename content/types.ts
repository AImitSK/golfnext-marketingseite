/** Websiteinhalte einer Seite – ausschließlich als „Websiteinhalt" freigegebene Texte aus Freds Briefing. */
export interface PageMeta {
  title: string | null;
  description: string | null;
}

export interface Cta {
  label: string;
  hint?: string;
  /** Zieltyp; die URL kommt aus lib/links.ts (.env), nie hart kodiert */
  target: "erstgespraech" | "pakete" | "kontakt" | "intern";
  href?: string; // nur bei target "intern"
}

export interface Section {
  id: string;
  eyebrow?: string;
  headline?: string;
  /** Desktop-Umbrüche aus dem Briefing als Array von Zeilen */
  headlineLines?: string[];
  text?: string[];
  cta?: Cta;
  /** Sektionsspezifische Inhalte, typisiert in der Seiten-Datei */
  data?: Record<string, unknown>;
}

export interface FooterClose {
  eyebrow: string;
  headline: string;
  text: string[];
  cta: Cta;
  secondary?: Cta;
  /**
   * Optionale persönliche Zeile (Fred als Ansprechpartner) für den Startseiten-
   * Abschluss (Abschnitt 7). Wird nur gerendert, wenn gesetzt – andere Seiten
   * (pakete, ueber-golfnext) bleiben unverändert.
   */
  persoenlicheZeile?: string;
  /**
   * Optionaler persönlicher Abschluss mit Porträt-Platzhalter (Name fett + Rolle),
   * wortgleich aus Mock 3.1b `.f-person`. Nur die Startseite setzt dies; andere Seiten
   * bleiben bei `persoenlicheZeile` bzw. ohne. Wird bevorzugt vor `persoenlicheZeile`
   * gerendert, wenn beide gesetzt sind.
   */
  person?: { name: string; role: string };
}

export interface PageContent {
  route: string;
  meta: PageMeta;
  sections: Section[];
  /**
   * Persönlicher Abschluss über dem Footer. Optional seit Briefing 0025: Mock
   * `3.10-kontakt.html` führt keinen `.f-close`-Block – die Kontaktseite endet mit
   * der Anschrift, danach beginnt der Footer mit der Modul-Landkarte. `Footer`
   * nimmt die Prop ohnehin optional entgegen.
   */
  footerClose?: FooterClose;
}
