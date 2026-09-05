import { Button } from "@/components/ui/Button";
import type { FooterClose as FooterCloseType } from "@/content/types";
import styles from "./FooterClose.module.css";

/**
 * Abschluss-CTA des Footers (portiert aus 2.4 .f-cta). Prop-getrieben pro Seite:
 * Eyebrow (Signalgrün auf Navy), Headline (<h2>), Text[], grüner CTA (zweizeilig,
 * cta.hint als eigene Zeile) und optionaler sekundärer Link auf dunkel
 * (`secondaryOnDark`, unterstrichen). CTA-Ziele löst der Button über resolveCta.
 * Reine Server-Komponente; kein FooterClose-Text wird hier erfunden.
 */
export function FooterClose({ footerClose }: { footerClose: FooterCloseType }) {
  const { eyebrow, headline, text, cta, secondary } = footerClose;

  return (
    <section className={styles.close} aria-label="Gespräch und Demo">
      <div className={styles.inner}>
        <div>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 className={styles.headline}>{headline}</h2>
          {text.map((line) => (
            <p key={line} className={styles.text}>
              {line}
            </p>
          ))}
        </div>
        <div className={styles.acts}>
          <Button variant="cta" cta={cta} secondLine={cta.hint}>
            {cta.label}
          </Button>
          {secondary ? (
            <Button variant="secondaryOnDark" cta={secondary}>
              {secondary.label}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
