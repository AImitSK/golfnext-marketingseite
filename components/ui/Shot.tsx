import type { CSSProperties } from "react";
import styles from "./Shot.module.css";

/**
 * Beschrifteter Platzhalter für eine fehlende Produktoberfläche (portiert aus
 * `.shot`, docs/design-system/mocks/3.8-ueber-golfnext.html). Sand-Fläche mit
 * gestrichelter Innenlinie, Tagline oben links, Titel + Text unten.
 *
 * Bewusst KEIN echtes Bild: kein `<img>`, kein `next/image`, kein Stock/KI und
 * keine erfundene Oberfläche (CLAUDE.md). Fehlende Screenshots bleiben sichtbar
 * als beschrifteter Platzhalter, bis das echte Bild vorliegt.
 *
 * `ratio` (z. B. "16/10") setzt `aspect-ratio` inline und reserviert damit die
 * Höhe vorab – die Fläche springt beim Laden nicht (kein CLS).
 *
 * Preview-Regel: Eine interne „Benötigtes Bild: …"-Beschreibung (welcher echte
 * Screenshot hier später hin soll) ist KEIN Websiteinhalt und darf nur in der
 * internen Vorschau erscheinen, nie in Produktion (content/README.md). Diese
 * Komponente rendert nur die sichtbaren Props (`tagline`, `title`, `text`); die
 * preview-only-Steuerung je Verwendung entscheidet Phase 2.
 *
 * Reine Server-Komponente.
 */
export function Shot({
  ratio,
  tagline,
  title,
  text,
  dark = false,
  className,
}: {
  /** Seitenverhältnis als CSS-Wert, z. B. "16/10" – reserviert die Höhe. */
  ratio: string;
  tagline: string;
  title: string;
  text: string;
  dark?: boolean;
  className?: string;
}) {
  const classes = [styles.shot, dark ? styles.dark : undefined, className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} style={{ aspectRatio: ratio } as CSSProperties}>
      <span className={styles.tagline}>{tagline}</span>
      <div className={styles.desc}>
        <b>{title}</b>
        <span>{text}</span>
      </div>
    </div>
  );
}
