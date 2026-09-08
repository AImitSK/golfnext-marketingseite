import { Rise, RiseItem } from "@/components/motion/Rise";
import { ArticleCard, type Artikel } from "./ArticleCard";
import styles from "./ArticleGrid.module.css";

/**
 * Artikelraster (portiert aus 3.9a `.grid`) mit gestaffelten Reveals.
 *
 * Bewegung nach den Regeln aus CLAUDE.md: `Rise`/`RiseItem` blenden die Karten
 * einmalig und nacheinander ein (`viewport={{ once: true }}`), der Endzustand steht
 * im Server-HTML. Ohne JavaScript und bei `prefers-reduced-motion` ist sofort alles
 * zu sehen. Bewegt werden nur `opacity`/`transform` – das Raster steht schon, die
 * Bildflächen haben ihr Seitenverhältnis, es verschiebt sich nichts.
 *
 * Die erste Karte lädt ihr Bild mit Vorrang: sie ist auf der Übersicht das größte
 * Bild über der Falz.
 */
export function ArticleGrid({
  artikel,
  ueberschrift = "h2",
  scrollerMobil = false,
}: {
  artikel: Artikel[];
  /** Ebene der Kartentitel – siehe ArticleCard. */
  ueberschrift?: "h2" | "h3";
  /**
   * Unter 1000 px als Querscroller statt gestapelt – nur für „Passt dazu"
   * (Entscheidung Stefan, 08.09.2026). Reines CSS: kein Karussell, keine Automatik,
   * ohne JavaScript bedienbar.
   */
  scrollerMobil?: boolean;
}) {
  const klassen = [styles.grid, scrollerMobil ? styles.scroller : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <Rise className={klassen}>
      {artikel.map((a, i) => (
        <RiseItem key={a._id}>
          <ArticleCard artikel={a} ueberschrift={ueberschrift} prioritaet={i === 0} />
        </RiseItem>
      ))}
    </Rise>
  );
}
