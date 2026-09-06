import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import type { WegCard } from "@/content/wachstum-vertrieb";
import { WegeSlider } from "./WegeSlider";
import styles from "./Wege.module.css";

/**
 * 3 · Vier Wege – geteilte Sektions-Schale (mist, overflowHidden für den Slider-Bleed)
 * mit dem horizontalen Slider und der `waynote` darunter. Texte wortgleich aus
 * `content/wachstum-vertrieb.ts`.
 */
export function Wege({
  eyebrow,
  headline,
  lead,
  data,
  waynote,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: WegCard[];
  waynote: string;
}) {
  return (
    <PlattformSection variant="mist" overflowHidden eyebrow={eyebrow} headline={headline} lead={lead}>
      <WegeSlider data={data} />
      <p className={styles.waynote}>{waynote}</p>
    </PlattformSection>
  );
}
