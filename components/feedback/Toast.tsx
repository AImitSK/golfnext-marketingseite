import type { ReactNode } from "react";
import styles from "./Toast.module.css";

/**
 * Toast (portiert aus 2.5-ui-kit.html .toast): flüchtige Bestätigung auf Navy,
 * Signalgrün nur als Haken-Icon (Grün-Regel). `role="status"`, damit ein
 * Screenreader die Meldung höflich vorliest, ohne zu unterbrechen (docs/08 §5).
 *
 * Auf der Website gibt es genau einen Toast: die gespeicherte Cookie-Einstellung
 * (docs/08 §3). Diese Komponente ist der reine Baustein; die echte Einbindung
 * (unten rechts, ~3 s, Auto-Ausblenden) folgt mit dem Consent-Dialog in Phase 5.
 *
 * Der Text kommt als `children` aus `lib/ui/messages.ts`. Reine Server-Komponente.
 */
export function Toast({ className, children }: { className?: string; children: ReactNode }) {
  const classes = [styles.toast, className].filter(Boolean).join(" ");
  return (
    <div className={classes} role="status">
      {/* Haken, 17 px (2.5 Z.575). Dekorativ – die Aussage trägt der Text. Größe fix am SVG. */}
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4.5 12.5l5 5 10-11" />
      </svg>
      <span>{children}</span>
    </div>
  );
}
