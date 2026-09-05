import type { ReactNode } from "react";
import styles from "./TextLink.module.css";

/** Rechtsgerichteter Pfeil, fix 15 × 15 px (Icon-Regel: nie ohne Größe). */
function ArrowIcon() {
  return (
    <svg
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
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Text-Link mit Pfeil (portiert aus 2.5-ui-kit.html .tlink): blau, 600, mit
 * 15-px-Pfeil, der beim Hover 3 px nach rechts rückt. `onDark` schaltet die
 * Textfarbe für Navy-Flächen auf `--gn-on-dark-link`.
 *
 * Rendert immer `<a>` mit Pflicht-`href`. `arrow={false}` blendet den Pfeil aus.
 * Reine Server-Komponente; Fokus über den globalen `:focus-visible`-Ring.
 */
export function TextLink({
  href,
  onDark = false,
  arrow = true,
  className,
  children,
}: {
  href: string;
  onDark?: boolean;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = [styles.tlink, onDark ? styles.onDark : undefined, className]
    .filter(Boolean)
    .join(" ");
  return (
    <a href={href} className={classes}>
      {children}
      {arrow ? <ArrowIcon /> : null}
    </a>
  );
}
