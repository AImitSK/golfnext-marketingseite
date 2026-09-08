import { praxisLabels } from "@/content/praxis";
import { TOC_MINDESTZAHL, type TocEintrag } from "@/lib/praxis/toc";
import styles from "./Artikel.module.css";

/**
 * Inhaltsverzeichnis der Seitenspalte (portiert aus 3.9b `.toc`): „Inhalt" und die
 * `h2`-Überschriften des Fließtexts als reine Ankerlinks – ohne JavaScript nutzbar.
 *
 * Bei weniger als drei `h2` entfällt der Kasten (Briefing 0027): Für zwei Abschnitte
 * ist er mehr Rahmen als Inhalt.
 *
 * Der aktive Zustand des Mocks (`.toc a.on`, wandert beim Scrollen mit) fehlt
 * bewusst: Er braucht einen ScrollSpy in JavaScript und wäre ohne JS ein toter
 * Zustand. Die Sprungmarken selbst funktionieren immer.
 *
 * Reine Server-Komponente.
 */
export function ArticleToc({ eintraege }: { eintraege: TocEintrag[] }) {
  if (eintraege.length < TOC_MINDESTZAHL) return null;

  return (
    <nav className={styles.toc} aria-label={praxisLabels.inhalt}>
      <b className={styles.tocLabel}>{praxisLabels.inhalt}</b>
      {eintraege.map((eintrag) => (
        <a key={eintrag.id} href={`#${eintrag.id}`}>
          {eintrag.text}
        </a>
      ))}
    </nav>
  );
}
