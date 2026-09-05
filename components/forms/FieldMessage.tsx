import type { ReactNode } from "react";
import styles from "./forms.module.css";

/**
 * Feldmeldung unter einem Formularfeld (portiert aus 2.5-ui-kit.html .fmsg).
 *
 * `variant`: `e` Fehler (rot, Warn-Icon), `s` bestätigt (grün, Haken), `h` Hinweis
 * (muted, ohne Icon – wie im Mock). Icon fix 14 px, damit ein Fehler nie nur über
 * Farbe erkennbar ist (docs/08 §4).
 *
 * `id` verbindet die Meldung über `aria-describedby` mit dem Feld (setzt `Field`).
 * Der Text kommt als `children` aus `lib/forms/messages.ts`. Reine Server-Komponente.
 */
type FieldMessageVariant = "e" | "s" | "h";

const VARIANT_CLASS: Record<FieldMessageVariant, string> = {
  e: styles.fmsgE,
  s: styles.fmsgS,
  h: styles.fmsgH,
};

/** Fehler: Kreis mit „!" (2.5 Z.365). Größe fix am SVG (nie ohne Größe, CLAUDE.md). */
function ErrIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.01" />
    </svg>
  );
}

/** Erfolg: Haken (2.5 Z.370). Größe fix am SVG. */
function OkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export function FieldMessage({
  variant,
  id,
  children,
}: {
  variant: FieldMessageVariant;
  id?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className={`${styles.fmsg} ${VARIANT_CLASS[variant]}`}>
      {variant === "e" ? <ErrIcon /> : null}
      {variant === "s" ? <OkIcon /> : null}
      <span>{children}</span>
    </div>
  );
}
