import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import type { FundamentData } from "@/content/wachstum-vertrieb";
import { FundamentFan } from "./FundamentFan";
import styles from "./Fundament.module.css";

/**
 * 6 · Fundament (aufgefächerte Landingpages) – portiert aus 3.4b .found/.fan/.lp.
 * Eigener Sand-Abschnitt (overflow:hidden für den links auslaufenden Fächer) mit dem
 * Landingpage-Fächer (links, animiert) und dem Text (rechts): Eyebrow, H2, zwei Absätze
 * und ein Link auf die Paketseite. Texte wortgleich aus `content/wachstum-vertrieb.ts`.
 */
export function Fundament({
  eyebrow,
  headline,
  data,
}: {
  eyebrow: string;
  headline: string;
  data: FundamentData;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.found}>
          <FundamentFan cards={data.cards} />
          <div className={styles.txt}>
            <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow>
            <h2 className={styles.h2}>{headline}</h2>
            {data.paragraphs.map((p) => (
              <p key={p} className={styles.p}>
                {p}
              </p>
            ))}
            <TextLink href={internalHref(data.link.path)}>{data.link.label}</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
