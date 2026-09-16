import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import type { ProjekteData } from "@/content/ueber-golfnext";
import { LogoMarquee } from "./LogoMarquee";
import styles from "./Projekte.module.css";

/**
 * 5 · „Aus unserer Arbeit im Golf“ – geteilte Sektions-Schale (mist) mit dem
 * Logo-Band. Dort stehen die echten, freigegebenen Club- und Partner-Logos aus
 * `public/clubs` – keine Platzhalter und kein Vermerk mehr.
 *
 * Seit 16.09.2026 laufen die Logos als endloser Slider (`LogoMarquee`) statt im
 * festen Raster – bei 13 Marken die ruhigere „Trusted-by“-Optik. Die Bewegung
 * ist reines CSS: ohne JS lesbar, `prefers-reduced-motion` zeigt sofort ein
 * statisches Raster, kein CLS. Der frühere Praxis-Link ist laut Master-Briefing
 * entfallen. Daten aus `content/ueber-golfnext.ts`.
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
    <PlattformSection variant="mist" eyebrow={eyebrow} headline={headline} lead={lead} overflowHidden>
      <LogoMarquee logos={data.logos} />
      <p className={styles.zusatz}>{data.zusatz}</p>
    </PlattformSection>
  );
}
