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
 * Bewegung („Pakete Hero-Rückgrat", Briefing 0015): Die Linie baut sich von oben auf,
 * die vier Stufen staffeln sich daran entlang herein. Sie liegt vollständig im
 * Modul-CSS und läuft ab dem ersten gemalten Frame – der Hero steht immer im
 * Sichtfeld, ein erst nach der Hydration gesetzter Startzustand ließe ihn sichtbar
 * rückwärts wegblinken (gemessen am 10.09.2026). Ohne JS und bei
 * `prefers-reduced-motion` steht sofort der Endzustand; bewegt nur
 * `opacity`/`transform` (kein CLS), läuft einmal./ Die grüne CTA nutzt die `Button`-Primitive (Grün-Regel);
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
          <div className={styles.stack}>
            {/* Rückgrat-Linie: dekorativ, baut sich per CSS auf. */}
            <span className={styles.spine} aria-hidden="true" />
            {data.stack.map((row) => (
              <div
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
              </div>
            ))}
          </div>
          <p className={styles.stackfoot}>{data.stackFoot}</p>
        </div>
      </div>
    </section>
  );
}
