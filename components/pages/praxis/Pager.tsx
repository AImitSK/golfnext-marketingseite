import Link from "next/link";
import { praxisLabels } from "@/content/praxis";
import { seitenHref } from "@/lib/praxis/blaettern";
import styles from "./ArticleGrid.module.css";

/**
 * „Ältere Beiträge" (portiert aus 3.9a `.more`).
 *
 * **Abweichung vom Mock, bewusst:** Der Mock lädt nach („Ältere Beiträge laden"),
 * hier steht ein echter Link auf `?seite=n`, den der Server auswertet. Grund: ohne
 * JavaScript bedienbar. Vermerkt in docs/03-seiten-und-routen.md und
 * docs/entscheidungen.md.
 *
 * Reine Server-Komponente; ohne nächste Seite rendert sie nichts.
 */
export function Pager({ pfad, naechsteSeite }: { pfad: string; naechsteSeite: number | null }) {
  if (naechsteSeite === null) return null;

  return (
    <div className={styles.more}>
      <Link href={seitenHref(pfad, naechsteSeite)} className={styles.moreLink} rel="next">
        {praxisLabels.aeltereBeitraege}
      </Link>
    </div>
  );
}
