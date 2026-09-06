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
  const { eyebrow, headline, text, cta, secondary, persoenlicheZeile, person } = footerClose;

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
          {/* Persönlicher Abschluss mit Porträt-Platzhalter (Name fett + Rolle),
              wortgleich aus Mock 3.1b `.f-person` – nur auf der Startseite gesetzt.
              Fallback auf die einzeilige `persoenlicheZeile` (Legacy). */}
          {person ? (
            <div className={styles.person}>
              <span className={styles.personPh} aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="12" cy="9" r="3.4" />
                  <path d="M4.8 20c1.5-3.4 4.2-5.1 7.2-5.1s5.7 1.7 7.2 5.1" />
                </svg>
              </span>
              <span className={styles.personText}>
                <b>{person.name}</b>
                {person.role}
              </span>
            </div>
          ) : persoenlicheZeile ? (
            <p className={styles.personline}>{persoenlicheZeile}</p>
          ) : null}
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
