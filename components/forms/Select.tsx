import type { SelectHTMLAttributes } from "react";
import type { FieldState } from "./Input";
import styles from "./forms.module.css";

/**
 * Auswahlfeld (portiert aus 2.5-ui-kit.html select.inp). Natives `<select>` mit
 * eigenem Pfeil statt System-Chevron; ohne JavaScript bedienbar. Optionen kommen
 * als `children`. Fünf Zustände wie `Input`. Reine Server-Komponente.
 */
const STATE_CLASS: Record<FieldState, string> = {
  err: styles.err,
  ok: styles.ok,
  focus: styles.focus,
};

export function Select({
  state,
  className,
  children,
  ...rest
}: { state?: FieldState } & SelectHTMLAttributes<HTMLSelectElement>) {
  const classes = [styles.control, styles.select, state ? STATE_CLASS[state] : undefined, className]
    .filter(Boolean)
    .join(" ");
  return (
    <select className={classes} {...rest}>
      {children}
    </select>
  );
}
