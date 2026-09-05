import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./Empty.module.css";

/**
 * Leerzustand (portiert aus 2.5-ui-kit.html .empty): gestrichelter Rahmen, Icon
 * (38 px, fix), Überschrift, ein Satz, genau ein Ausweg-Button. Einsatz z. B. bei
 * einem Ratgeber-Filter ohne Treffer (docs/08 §3).
 *
 * Alle Texte (`title`, `body`, `actionLabel`) kommen als Props aus `lib/ui/messages.ts`
 * – die Komponente enthält keine eigenen Meldungstexte. Das Icon ist voreingestellt
 * (Lupe wie im Mock), kann aber über `icon` ersetzt werden. Reine Server-Komponente.
 */
export function Empty({
  title,
  body,
  actionLabel,
  actionHref,
  icon,
  className,
}: {
  title: string;
  body: string;
  actionLabel: string;
  actionHref?: string;
  icon?: ReactNode;
  className?: string;
}) {
  const classes = [styles.empty, className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      {icon ?? <SearchIcon />}
      {/* H4: Leerzustand steht unterhalb der Seiten-H2, daher eine Ebene tiefer. */}
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.body}>{body}</p>
      <Button variant="primary" size="sm" href={actionHref}>
        {actionLabel}
      </Button>
    </div>
  );
}

/** Lupe, 38 px (2.5 Z.579). Dekorativ – die Aussage trägt der Text. Größe fix am SVG. */
function SearchIcon() {
  return (
    <svg
      className={styles.icon}
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.5-4.5" />
    </svg>
  );
}
