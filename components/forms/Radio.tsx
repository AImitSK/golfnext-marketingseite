import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./forms.module.css";

/**
 * Optionsfeld (portiert aus 2.5-ui-kit.html .radio). Ein natives
 * `<input type="radio">` wird visuell durch `.rb` ersetzt, bleibt aber
 * fokussierbar und ohne JavaScript bedienbar; der Klick kommt über das umgebende
 * `<label>`. Der Punkt-Zustand läuft rein über CSS (`:checked`).
 *
 * Optionen einer Gruppe teilen sich denselben `name`. Beschriftung als `children`;
 * native Attribute werden durchgereicht. Reine Server-Komponente.
 */
export function Radio({
  children,
  className,
  ...rest
}: { children: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const classes = [styles.radio, className].filter(Boolean).join(" ");
  return (
    <label className={classes}>
      <input type="radio" className={styles.nativeInput} {...rest} />
      {/* Punkt wird per CSS (.rb::after) bei :checked sichtbar. */}
      <span className={styles.rb} aria-hidden="true" />
      <span>{children}</span>
    </label>
  );
}
