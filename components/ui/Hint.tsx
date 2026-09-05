import type { ReactNode } from "react";
import styles from "./Hint.module.css";

/**
 * Hinweiszeile (portiert aus `.hint`): fixes 15-px-Info-Icon + gedämpfter Text,
 * max. 72ch. Das Icon hat feste Breite/Höhe (nicht skalierend) und ist
 * `aria-hidden`. `onDark` hellt Text und Icon für Navy-Flächen auf.
 * Reine Server-Komponente. Icon-Quelle: `.hint`-Verwendung in den Mocks.
 */
export function Hint({
  onDark = false,
  className,
  children,
}: {
  onDark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = [styles.hint, onDark ? styles.onDark : undefined, className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes}>
      <svg
        className={styles.icon}
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
      <span>{children}</span>
    </div>
  );
}
