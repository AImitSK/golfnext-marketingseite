import { RevealLine } from "@/components/motion/RevealLine";
import { Rise, RiseItem } from "@/components/motion/Rise";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { resolveCta } from "@/lib/links";
import type { HeroData } from "@/content/pakete";
import styles from "./Hero.module.css";

/**
 * Hero der Pakete-Seite (portiert aus 3.7-pakete.html, Z.410–446). Links Eyebrow,
 * die einzige `<h1>` der Seite, Lead und zwei CTAs; rechts der „Rückgrat"-Stapel
 * der vier Ausbaustufen.
 *
 * Bewegung nach 1.7: Der Stapel ist ein `Rise`-Container, die Stufen sind
 * `RiseItem`-Kinder – einmaliges, gestaffeltes Aufblenden. Der Endzustand steht im
 * Server-HTML (ohne JS voll sichtbar); `useReducedMotion` zeigt sofort den
 * Endzustand (Wrapper-Logik). Die grüne CTA nutzt die `Button`-Primitive (Grün-Regel);
 * der sekundäre Link ist die on-dark-Textaktion `.b2` mit zweiter Zeile.
 */
export function Hero({
  eyebrow,
  headlineLines,
  lead,
  data,
}: {
  eyebrow: string;
  headlineLines: string[];
  lead: string;
  data: HeroData;
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.in}>
        <div>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h1 className={styles.h1}>
            <span className={styles.br}>{headlineLines[0]}</span> {headlineLines[1]}
          </h1>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.acts}>
            <Button variant="cta" cta={data.ctaPrimary}>
              {data.ctaPrimary.label}
            </Button>
            <a className={styles.b2} href={resolveCta(data.ctaSecondary)}>
              {data.ctaSecondary.label}
              {data.ctaSecondary.hint ? <small>{data.ctaSecondary.hint}</small> : null}
            </a>
          </div>
        </div>

        <div className={styles.stackwrap}>
          <Rise className={styles.stack}>
            {/* Rückgrat-Linie: baut sich per RevealLine (scaleY) einmalig auf, dann
                Endzustand; dekorativ, kein Stagger-Kind. */}
            <RevealLine orientation="vertical" className={styles.spine} />
            {data.stack.map((row) => (
              <RiseItem
                key={row.name}
                className={row.base ? `${styles.srow} ${styles.base}` : styles.srow}
              >
                <div className={styles.sh}>
                  <span className={styles.sn}>{row.name}</span>
                  <span className={styles.sr}>{row.role}</span>
                </div>
                <div className={styles.sm}>
                  {row.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </RiseItem>
            ))}
          </Rise>
          <p className={styles.stackfoot}>{data.stackFoot}</p>
        </div>
      </div>
    </section>
  );
}
