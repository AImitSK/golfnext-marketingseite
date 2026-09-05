import type { ReactNode } from "react";
import styles from "./Badge.module.css";

/**
 * Status-Badge (portiert aus 2.5-ui-kit.html .badge). Der Beschriftungstext kommt
 * als `children`, der Punkt (`.dot`, 7 px, currentColor) zeigt den Status farbig an.
 *
 * `status` bildet die drei Modul-Status aus config/site-structure.ts ab
 * (im-einsatz → live · pilot → gold · in-entwicklung → hell) und zusätzlich die
 * Kennzeichnungen `addon`, `inklusive` und `onnavy` (grüne Fläche auf Navy).
 *
 * Der Punkt entfällt bei `onnavy` (reines Flächen-Label wie im Mock).
 * Reine Server-Komponente.
 */
export type BadgeStatus =
  | "im-einsatz"
  | "pilot"
  | "in-entwicklung"
  | "addon"
  | "inklusive"
  | "onnavy";

const STATUS_CLASS: Record<BadgeStatus, string> = {
  "im-einsatz": styles.live,
  pilot: styles.pilot,
  "in-entwicklung": styles.dev,
  addon: styles.addon,
  inklusive: styles.inklusive,
  onnavy: styles.onnavy,
};

export function Badge({
  status,
  className,
  children,
}: {
  status: BadgeStatus;
  className?: string;
  children: ReactNode;
}) {
  const classes = [styles.badge, STATUS_CLASS[status], className].filter(Boolean).join(" ");
  const showDot = status !== "onnavy";
  return (
    <span className={classes}>
      {showDot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
