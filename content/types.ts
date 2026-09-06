/** Websiteinhalte einer Seite – ausschließlich als „Websiteinhalt" freigegebene Texte aus Freds Briefing. */
export interface PageMeta {
  title: string | null;
  description: string | null;
}

export interface Cta {
  label: string;
  hint?: string;
  /** Zieltyp; die URL kommt aus lib/links.ts (.env), nie hart kodiert */
  target: "erstgespraech" | "livedemo" | "pakete" | "team" | "kontakt" | "intern";
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
}

export interface PageContent {
  route: string;
  meta: PageMeta;
  sections: Section[];
  footerClose: FooterClose;
}
