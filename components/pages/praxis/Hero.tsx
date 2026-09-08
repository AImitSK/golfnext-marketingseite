import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Hero.module.css";

/**
 * Hero der Praxis-Routen (portiert aus 3.9a `.hero.plain`). Eyebrow, die einzige
 * `<h1>` der Seite und der Lead.
 *
 * Dieselbe Schale trägt die Übersicht (`/praxis`) und die Rubrikseite
 * (`/praxis/thema/<slug>`); dort sind Überschrift und Lead der Rubriktitel und die
 * Rubrikbeschreibung aus Sanity, der Eyebrow bleibt „Praxis".
 *
 * Reine Server-Komponente ohne Bewegung: Der Hero ist das Erste, was gelesen wird –
 * es gibt hier nichts einzublenden, und der Text ist zugleich das LCP-Element.
 */
export function Hero({
  eyebrow,
  headline,
  lead,
}: {
  eyebrow: string;
  headline: string;
  lead?: string;
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.in}>
        <div className={styles.txt}>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h1 className={styles.h1}>{headline}</h1>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
        </div>
      </div>
    </section>
  );
}
