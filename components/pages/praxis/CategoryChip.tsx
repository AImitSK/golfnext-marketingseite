import styles from "./CategoryChip.module.css";

/**
 * Rubrik-Chip (portiert aus 3.9a/3.9b `.cat`). Reine Beschriftung, kein Link – auf
 * der Karte ist die ganze Karte der Link, im Artikelkopf steht die Rubrik zusätzlich
 * in den Brotkrumen.
 *
 * Reine Server-Komponente.
 */
export function CategoryChip({ children, className }: { children: string; className?: string }) {
  return <span className={[styles.cat, className].filter(Boolean).join(" ")}>{children}</span>;
}
