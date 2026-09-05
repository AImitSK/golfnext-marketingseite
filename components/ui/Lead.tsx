import type { ReactNode } from "react";
import styles from "./Lead.module.css";

/**
 * Einleitender Fließtext unter der Headline (portiert aus `.psec .lead`):
 * fluide Größe, gedämpfte Farbe, max. 62ch. `onDark` hellt für Navy-Flächen auf.
 * Reine Server-Komponente.
 */
export function Lead({
  onDark = false,
  className,
  children,
}: {
  onDark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = [styles.lead, onDark ? styles.onDark : undefined, className]
    .filter(Boolean)
    .join(" ");
  return <p className={classes}>{children}</p>;
}
