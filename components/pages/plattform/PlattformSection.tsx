import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./PlattformSection.module.css";

/**
 * Sektions-Schale der Plattform-Neufassung (portiert aus `.psec`/`.pwrap` von
 * 3.2c). Trägt die Layout-Erweiterungen der Neufassung (breiter Satzspiegel
 * --gn-wrap-wide, Sektionsluft --gn-section-y-lg, größere H2 --gn-h2-lg) – bewusst
 * NUR auf dieser Seite. Reihenfolge Eyebrow → H2 → Lead wie im Design-System.
 * Genau eine `<h1>` liegt im Hero; hier immer `<h2>`. Reine Server-Komponente.
 */
export function PlattformSection({
  variant = "paper",
  id,
  eyebrow,
  headline,
  lead,
  overflowHidden = false,
  children,
}: {
  variant?: "paper" | "sand" | "mist";
  id?: string;
  eyebrow: string;
  headline: string;
  lead?: string;
  /** Für Sektionen mit Bleed-Inhalt (Rollen-Slider), damit der Bleed keinen Seiten-Overflow erzeugt. */
  overflowHidden?: boolean;
  children: ReactNode;
}) {
  const variantClass = variant === "sand" ? styles.sand : variant === "mist" ? styles.mist : undefined;
  const classes = [styles.psec, variantClass, overflowHidden ? styles.clip : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={classes}>
      <div className={styles.pwrap}>
        <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow>
        <h2 className={styles.h2}>{headline}</h2>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}
