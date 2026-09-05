import type { ReactNode } from "react";
import styles from "./Statement.module.css";

/**
 * Betonte Kernaussage (portiert aus `.statement3`): Archivo 700 mit linkem
 * grünem Balken (`border-left` = Linie, nach Grün-Regel erlaubt). `onDark`
 * setzt die Textfarbe auf Weiß. Reine Server-Komponente.
 */
export function Statement({
  onDark = false,
  className,
  children,
}: {
  onDark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = [styles.statement, onDark ? styles.onDark : undefined, className]
    .filter(Boolean)
    .join(" ");
  return <p className={classes}>{children}</p>;
}
