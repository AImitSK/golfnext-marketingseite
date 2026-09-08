import { TOC_MINDESTZAHL, type TocEintrag } from "@/lib/praxis/toc";
import { ArticleToc } from "./ArticleToc";
import styles from "./Artikel.module.css";

/**
 * Seitenspalte des Artikels (portiert aus 3.9b `.aside`): das Inhaltsverzeichnis.
 * Ab 1024 px klebt sie mit (`position: sticky`), darunter steht sie ausgeklappt über
 * dem Text (Briefing 0027) – im Mock verschwand das Inhaltsverzeichnis dort ersatzlos.
 *
 * **Zwei Kästen des Mocks fehlen bewusst:**
 * - `.cta2` („Das für Ihren Club durchgehen?" …): Seine Texte stehen nicht auf der
 *   Liste der freigegebenen Schalen-Texte (Briefing 0027). Der Weg ins Erstgespräch
 *   steht unverändert im Abschluss unter dem Artikel (`FooterClose`).
 * - `.abox` (Autorenzeile): Der Autor stand damit **dreimal** auf einer Seite –
 *   in der Kopfzeile, hier und im Kasten „Über den Autor" unter dem Text
 *   (Entscheidung Stefan, 08.09.2026, siehe docs/entscheidungen.md).
 *
 * Damit trägt die Spalte nur noch das Inhaltsverzeichnis. Gibt es keines (weniger als
 * drei `h2`), gibt es auch keine Spalte: `hatSeitenspalte` sagt der Seite, dass sie
 * einspaltig setzen soll, statt eine leere 300-px-Spalte offen zu lassen.
 *
 * Reine Server-Komponente.
 */

/** Trägt dieser Artikel überhaupt eine Seitenspalte? */
export function hatSeitenspalte(eintraege: TocEintrag[]): boolean {
  return eintraege.length >= TOC_MINDESTZAHL;
}

export function ArticleAside({ eintraege }: { eintraege: TocEintrag[] }) {
  if (!hatSeitenspalte(eintraege)) return null;

  return (
    <aside className={styles.aside}>
      <ArticleToc eintraege={eintraege} />
    </aside>
  );
}
