import { Eyebrow } from "@/components/ui/Eyebrow";
import { Wrap } from "@/components/ui/Wrap";
import { praxisLabels } from "@/content/praxis";
import { ArticleGrid } from "./ArticleGrid";
import type { Artikel } from "./ArticleCard";
import styles from "./Artikel.module.css";

/**
 * „Weiterlesen / Passt dazu" (portiert aus 3.9b `.related`).
 *
 * Gezeigt werden die im Studio gepflegten `related`-Artikel; sind keine gepflegt,
 * reicht die Seite bis zu drei weitere aus derselben Rubrik nach (ohne den aktuellen).
 * Gibt es auch die nicht, entfällt der Block **ersatzlos** – ein leerer Kasten mit
 * Überschrift wäre schlechter als keiner (Briefing 0027).
 *
 * Reine Server-Komponente.
 */
export function Related({ artikel }: { artikel: Artikel[] }) {
  if (artikel.length === 0) return null;

  return (
    <section className={styles.related}>
      <Wrap>
        <Eyebrow>{praxisLabels.weiterlesen}</Eyebrow>
        <h2 className={styles.relatedH2}>{praxisLabels.passtDazu}</h2>
        <ArticleGrid artikel={artikel} ueberschrift="h3" scrollerMobil />
      </Wrap>
    </section>
  );
}
