import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./forms.module.css";

/**
 * Kontrollkästchen (portiert aus 2.5-ui-kit.html .check). Ein natives
 * `<input type="checkbox">` wird visuell durch `.box` ersetzt, bleibt aber
 * fokussierbar und ohne JavaScript bedienbar; der Klick kommt über das umgebende
 * `<label>`. Der Haken-Zustand läuft rein über CSS (`:checked`).
 *
 * Beschriftung als `children`; native Attribute (name, value, checked, required,
 * disabled, aria-*) werden durchgereicht. Reine Server-Komponente.
 */
export function Checkbox({
  children,
  className,
  ...rest
}: { children: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const classes = [styles.check, className].filter(Boolean).join(" ");
  return (
    <label className={classes}>
      <input type="checkbox" className={styles.nativeInput} {...rest} />
      <span className={styles.box} aria-hidden="true">
        {/* Haken, 12 px (2.5 Z.404). Sichtbar erst bei :checked (CSS). Größe fix am SVG. */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <path d="M5 13l5 5 9-11" />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}
