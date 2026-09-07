import type { CSSProperties } from "react";
import { Rise, RiseItem } from "@/components/motion/Rise";
import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import type { ProjekteData } from "@/content/ueber-golfnext";
import styles from "./Projekte.module.css";

/**
 * 5 · „Gemeinsame Projekte“ – geteilte Sektions-Schale (mist) mit dem Club-Raster.
 * Seit 07.09.2026 stehen dort die echten, freigegebenen Clublogos aus
 * `public/clubs` – keine beschrifteten Platzhalter und kein Vermerk mehr.
 * Der Praxis-Link zeigt auf `/praxis`, solange die Route live ist (sonst `#`,
 * via `internalHref`). Die Kacheln blenden gestaffelt auf (Rise); Endzustand im
 * Server-HTML → ohne JS lesbar. Daten aus `content/ueber-golfnext.ts`.
 *
 * Die Logos liegen als SVG bzw. PNG in Originalgröße vor und werden bewusst mit
 * `<img>` statt `next/image` ausgeliefert: SVG müsste sonst über
 * `dangerouslyAllowSVG` durch den Bild-Optimierer, und optimieren gibt es an
 * einer 10-KB-Vektordatei nichts. `width`/`height` stehen an jedem Bild, damit
 * der Platz vorab reserviert ist (kein CLS).
 */
export function Projekte({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: ProjekteData;
}) {
  return (
    <PlattformSection variant="mist" eyebrow={eyebrow} headline={headline} lead={lead}>
      <Rise className={styles.logos}>
        {data.logos.map((club) => (
          <RiseItem key={club.datei} className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element -- siehe Kopfkommentar: SVG-Logos ohne Optimierer */}
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
          </RiseItem>
        ))}
      </Rise>
      <p className={styles.logonote}>
        <TextLink href={internalHref("/praxis")}>{data.praxisLink}</TextLink>
      </p>
    </PlattformSection>
  );
}
