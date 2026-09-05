import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";

/**
 * Kleiner Über-Titel (portiert aus `.eyebrow`): Versalien, weites Tracking,
 * blau auf hellem Grund. `onDark` schaltet auf Signalgrün (Text auf Navy –
 * nach Grün-Regel erlaubt). Reine Server-Komponente.
 */
export function Eyebrow({
  as: As = "p",
  onDark = false,
  className,
  children,
}: {
  as?: "p" | "span";
  onDark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = [styles.eyebrow, onDark ? styles.onDark : undefined, className]
    .filter(Boolean)
    .join(" ");
  return <As className={classes}>{children}</As>;
}
