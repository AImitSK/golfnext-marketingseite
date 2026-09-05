import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Chip.module.css";

/**
 * Filter-/Auswahl-Chip (portiert aus 2.5-ui-kit.html .chip). Präsentational: die
 * Seite reicht Auswahl- und Entfernen-Logik später über Props hinein (z. B.
 * `onClick`, `pressed`). Rendert als `<button type="button">`.
 *
 * - `pressed`: aktiver Zustand (`.chip.on`, Navy-Fläche). Nur wenn gesetzt, wird
 *   `aria-pressed` ausgegeben (der Chip wird dann als Umschalter/Filter verwendet).
 * - `removable`: zeigt das Entfernen-Zeichen „×" (`.chip .x`).
 *
 * Alle weiteren `<button>`-Attribute werden durchgereicht. Reine
 * Server-Komponente; ein `onClick` einer Client-Seite funktioniert im Client-Baum.
 */
export function Chip({
  pressed,
  removable = false,
  className,
  children,
  ...rest
}: {
  pressed?: boolean;
  removable?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  const classes = [styles.chip, pressed ? styles.on : undefined, className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={classes} aria-pressed={pressed} {...rest}>
      {children}
      {removable ? (
        <span className={styles.x} aria-hidden="true">
          ×
        </span>
      ) : null}
    </button>
  );
}
