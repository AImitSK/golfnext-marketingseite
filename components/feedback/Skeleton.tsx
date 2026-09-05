import { uiMessages } from "@/lib/ui/messages";
import styles from "./Skeleton.module.css";

/**
 * Ladeplatzhalter in Inhaltsform (portiert aus 2.5-ui-kit.html .skel): statt eines
 * Spinners die spätere Karte als Silhouette, damit sich beim Nachladen nichts
 * verschiebt (docs/08 §1). Der Shimmer läuft 1,4 s; bei `prefers-reduced-motion`
 * steht er still (einfarbige Fläche, siehe Modul-CSS).
 *
 * Barrierefreiheit (docs/08 §5): die Platzhalter-Blöcke sind `aria-hidden`, der
 * Container trägt `aria-busy` und eine `sr-only`-Ansage aus `lib/ui/messages.ts`.
 * Reine Server-Komponente.
 */
export function Skeleton({ className }: { className?: string }) {
  const classes = [styles.skel, className].filter(Boolean).join(" ");
  return (
    <div className={classes} aria-busy="true" aria-live="polite">
      <span className="sr-only">{uiMessages.loading}</span>
      <div className={`${styles.b} ${styles.b1}`} aria-hidden="true" />
      <div className={`${styles.b} ${styles.b2}`} aria-hidden="true" />
      <div className={`${styles.b} ${styles.b3}`} aria-hidden="true" />
      <div className={`${styles.b} ${styles.b4}`} aria-hidden="true" />
    </div>
  );
}
