import type { CSSProperties } from "react";
import type { ClubLogo } from "@/content/ueber-golfnext";
import styles from "./LogoMarquee.module.css";

/**
 * Endlos laufendes Logo-Band für Abschnitt 5. Reine CSS-Bewegung (siehe
 * LogoMarquee.module.css) – deshalb eine Server-Komponente ohne `"use client"`:
 * kein JavaScript nötig, ohne JS lesbar, `prefers-reduced-motion` zeigt sofort
 * das statische Raster.
 *
 * Für den nahtlosen Lauf liegt die Logo-Liste zweimal im Band: die zweite Gruppe
 * ist eine reine Kopie und `aria-hidden`, damit Screenreader jedes Logo nur
 * einmal vorlesen. Bei Reduced Motion wird die Kopie ausgeblendet.
 *
 * Die Logos kommen als `<img>` (nicht `next/image`): SVG bräuchte sonst
 * `dangerouslyAllowSVG` und an den kleinen Vektor-/Rasterdateien gibt es nichts
 * zu optimieren. `width`/`height` stehen an jedem Bild → kein CLS.
 */
function LogoTile({ club }: { club: ClubLogo }) {
  const klasse = club.dunkel ? `${styles.logo} ${styles.logoDunkel}` : styles.logo;
  return (
    <li className={klasse}>
      {/* eslint-disable-next-line @next/next/no-img-element -- siehe Kopfkommentar: Logos ohne Optimierer */}
      <img
        className={styles.logoBild}
        style={{ "--gn-logo-h": `${club.rasterHoehe}px` } as CSSProperties}
        src={club.datei}
        alt={club.name}
        width={club.breite}
        height={club.hoehe}
        loading="lazy"
        decoding="async"
      />
    </li>
  );
}

export function LogoMarquee({ logos }: { logos: ClubLogo[] }) {
  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        <ul className={styles.group}>
          {logos.map((club) => (
            <LogoTile key={club.datei} club={club} />
          ))}
        </ul>
        <ul className={`${styles.group} ${styles.groupCopy}`} aria-hidden="true">
          {logos.map((club) => (
            <LogoTile key={`copy-${club.datei}`} club={club} />
          ))}
        </ul>
      </div>
    </div>
  );
}
