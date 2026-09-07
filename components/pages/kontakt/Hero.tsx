import { Eyebrow } from "@/components/ui/Eyebrow";
import type { HeroData } from "@/content/kontakt";
import styles from "./Hero.module.css";

/**
 * 1 · Hero (portiert aus 3.10-kontakt.html, `.hero.plain`). Eyebrow, die einzige
 * `<h1>` der Seite, Lead und die drei Vertrauenspunkte. Kein CTA und kein Visual –
 * der Mock hat keines, und das Formular steht direkt darunter.
 *
 * Reine Server-Komponente ohne Bewegung: Es gibt hier nichts einzublenden, was nicht
 * sofort lesbar sein müsste.
 */
export function Hero({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: HeroData;
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.in}>
        <div className={styles.txt}>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h1 className={styles.h1}>{headline}</h1>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.trust}>
            {data.trust.map((text) => (
              <span key={text}>
                <i aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
