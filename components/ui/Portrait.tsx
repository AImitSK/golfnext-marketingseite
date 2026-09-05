import styles from "./Portrait.module.css";

/** Dekoratives Personen-Icon (Silhouette). Rein grafisch, daher aria-hidden;
    Größe kommt aus dem CSS-Modul (44 px groß, 22 px klein). */
function PersonIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6Z" />
    </svg>
  );
}

/**
 * Porträt-Platzhalter für ein fehlendes Foto (portiert aus `.portrait/.pf`,
 * docs/design-system/mocks/3.8-ueber-golfnext.html).
 *
 * Bewusst KEIN echtes Foto: kein `<img>`, kein `next/image`, kein Stock/KI
 * (CLAUDE.md). Fehlende Porträts bleiben sichtbar als beschrifteter Platzhalter.
 *
 * - `size="large"`: 4/5-Fläche mit Personen-Icon (44 px), optionalem `tag` oben
 *   links, darunter `name` (pn) und `role` (pr).
 * - `size="small"`: 46 px runder Platzhalter in derselben Bildsprache
 *   (Personen-Icon, Sand→Mist-Verlauf, feine gestrichelte Kontur). Kompakter
 *   Avatar ohne Beschriftung – `name/role/tag` werden hier nicht gerendert.
 *
 * Das Personen-Icon ist ein Inline-SVG mit fixer Größe (aria-hidden, dekorativ)
 * und täuscht keinen `alt`-Text / kein `<img>` vor.
 *
 * Reine Server-Komponente.
 */
export function Portrait({
  size,
  name,
  role,
  tag,
  className,
}: {
  size: "large" | "small";
  name?: string;
  role?: string;
  tag?: string;
  className?: string;
}) {
  if (size === "small") {
    return (
      <span className={[styles.small, className].filter(Boolean).join(" ")}>
        <PersonIcon className={styles.icon} />
      </span>
    );
  }

  return (
    <div className={[styles.portrait, className].filter(Boolean).join(" ")}>
      <div className={styles.pf}>
        {tag ? <span className={styles.tag}>{tag}</span> : null}
        <PersonIcon className={styles.icon} />
      </div>
      {name ? <span className={styles.pn}>{name}</span> : null}
      {role ? <span className={styles.pr}>{role}</span> : null}
    </div>
  );
}
