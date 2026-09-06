import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lead } from "@/components/ui/Lead";
import { Section } from "@/components/ui/Section";
import { Wrap } from "@/components/ui/Wrap";
import type { BasisData } from "@/content/pakete";
import styles from "./Basis.module.css";

/** Häkchen der Sockel-Leistungsliste, fix 16 × 16 px (Icon-Regel: nie ohne Größe). */
function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12.5l5.2 5.2L20 7" />
    </svg>
  );
}

/** Info-Icon der Fußnote, fix 15 × 15 px. */
function InfoIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.01" />
    </svg>
  );
}

/**
 * Abschnitt 2 „Die Basis" (portiert aus 3.7-pakete.html, Z.448–516). Der gemeinsame
 * Sockel (Preisband + Leistungsliste + Fußnote) und darunter die Zeitschiene
 * Einrichtung → Go-live → laufender Betrieb. Reine Server-Komponente.
 */
export function Basis({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: BasisData;
}) {
  const { sockband, socklist, sockfoot, rail } = data;

  return (
    <Section>
      <Wrap>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{headline}</h2>
        <Lead>{lead}</Lead>

        <div className={styles.sockel}>
          <div className={styles.sockband}>
            <div>
              <span className={styles.badge}>{sockband.badge}</span>
              <h3>{sockband.title}</h3>
              <p className={styles.sub}>{sockband.sub}</p>
            </div>
            <div className={styles.sockprice}>
              {sockband.prices.map((price) => (
                <div key={price.value} className={styles.sp}>
                  <span className={styles.v}>{price.value}</span>
                  <span className={styles.k}>
                    {price.keyLines.map((line, i) => (
                      <span key={line}>
                        {i > 0 ? <br /> : null}
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.socklist}>
            {socklist.map((item) => (
              <div key={item} className={styles.it}>
                <CheckIcon />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className={styles.sockfoot}>
            <InfoIcon />
            <span>{sockfoot}</span>
          </p>
        </div>

        <div className={styles.rail}>
          <span className={`${styles.rbar} ${styles.a}`} aria-hidden="true" />
          <span className={styles.rgo}>{rail.go}</span>
          <span className={`${styles.rbar} ${styles.b}`} aria-hidden="true" />

          <div className={styles.rcol}>
            <span className={styles.rw}>{rail.left.rw}</span>
            <b>{rail.left.title}</b>
            <p>{rail.left.text}</p>
            <div className={styles.rsteps}>
              {rail.left.steps.map((step) => (
                <span key={step.n}>
                  <i>{step.n}</i>
                  {step.label}
                </span>
              ))}
            </div>
          </div>

          <div />

          <div className={`${styles.rcol} ${styles.right}`}>
            <span className={styles.rw}>{rail.right.rw}</span>
            <b>{rail.right.title}</b>
            <p>{rail.right.text}</p>
            <div className={`${styles.rsteps} ${styles.live}`}>
              {rail.right.steps.map((step) => (
                <span key={step}>{step}</span>
              ))}
            </div>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
