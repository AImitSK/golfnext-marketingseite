import { Rise, RiseItem } from "@/components/motion/Rise";
import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import type { ProjekteData } from "@/content/ueber-golfnext";
import styles from "./Projekte.module.css";

/**
 * 5 · „Gemeinsame Projekte“ – geteilte Sektions-Schale (mist) mit dem Club-Raster.
 * Die Clubnamen und „Logo folgt“-Kacheln sind beschriftete Platzhalter (kein
 * Stock/KI-Logo); die endgültige Liste, Logos und Freigaben liefert Fred. Der
 * Praxis-Link zeigt auf `/praxis`, solange die Route live ist (sonst `#`, via
 * `internalHref`). Die Kacheln blenden gestaffelt auf (Rise); Endzustand im
 * Server-HTML → ohne JS lesbar. Texte wortgleich aus `content/ueber-golfnext.ts`.
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
        {data.logos.map((label, i) => (
          <RiseItem key={`${label}-${i}`} className={styles.logo}>
            {label}
          </RiseItem>
        ))}
      </Rise>
      <p className={styles.logonote}>
        <TextLink href={internalHref("/praxis")}>{data.praxisLink}</TextLink>
        <span>{data.note}</span>
      </p>
    </PlattformSection>
  );
}
