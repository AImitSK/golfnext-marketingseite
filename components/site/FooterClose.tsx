import Image from "next/image";
import { FRED } from "@/lib/people";
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
              {/* Echtes Porträt (seit 07.09.2026). `aria-hidden`, weil Name und
                  Rolle direkt daneben stehen. */}
              <span className={styles.personPh} aria-hidden="true">
                <Image
                  src={FRED.quadrat}
                  alt=""
                  width={46}
                  height={46}
                  className={styles.personFoto}
                />
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
