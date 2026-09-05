import type { ReactNode } from "react";
import styles from "./Alert.module.css";

/**
 * Inline-Alert (portiert aus 2.5-ui-kit.html .alert). Steht im Inhalt, z. B. über
 * einem Formular (Validierungs-/Serverfehler) oder als Erfolgsmeldung an dessen Stelle.
 *
 * Rolle je Variante (docs/08 §5): `err` unterbricht → `role="alert"`; `ok`/`info`
 * unterbrechen nicht → `role="status"`. Das Icon (18 px, fix) trägt die Aussage mit,
 * damit ein Fehler nie nur über Farbe erkennbar ist (Farbenblindheit).
 *
 * Der Text kommt als `children` aus den Katalogen (`lib/ui` bzw. `lib/forms`) – die
 * Komponente enthält keine eigenen Meldungstexte. Reine Server-Komponente.
 */
type AlertVariant = "info" | "ok" | "err";

const VARIANT_CLASS: Record<AlertVariant, string> = {
  info: styles.info,
  ok: styles.ok,
  err: styles.err,
};

/** Info: Kreis mit „i" (2.5 Z.565). Größe fix am SVG (nie ohne Größe, CLAUDE.md). */
function InfoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5v.01" />
    </svg>
  );
}

/** Erfolg: Haken (2.5 Z.566). Größe fix am SVG. */
function OkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

/** Fehler: Kreis mit „!" (2.5 Z.567). Größe fix am SVG. */
function ErrIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.01" />
    </svg>
  );
}

const VARIANT_ICON: Record<AlertVariant, ReactNode> = {
  info: <InfoIcon />,
  ok: <OkIcon />,
  err: <ErrIcon />,
};

export function Alert({
  variant,
  className,
  children,
}: {
  variant: AlertVariant;
  className?: string;
  children: ReactNode;
}) {
  const classes = [styles.alert, VARIANT_CLASS[variant], className].filter(Boolean).join(" ");
  // err unterbricht (assertive), ok/info sind höflich (polite) – docs/08 §5.
  const role = variant === "err" ? "alert" : "status";
  return (
    <div className={classes} role={role}>
      {VARIANT_ICON[variant]}
      <span>{children}</span>
    </div>
  );
}
