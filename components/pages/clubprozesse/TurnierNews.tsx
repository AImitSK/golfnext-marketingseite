import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import type { TurnierNewsData } from "@/content/clubprozesse";
import { Track } from "./Track";
import styles from "./TurnierNews.module.css";

/**
 * 3 · Turnier-News – portiert aus 3.5b (Sektion „mist" mit overflow:hidden). Die
 * Bericht-Strecke läuft rechts aus dem Raster; `overflowHidden` der Sektions-Schale
 * fängt den Bleed ab (kein Seiten-Overflow). Nutzt die geteilte Sektions-Schale der
 * Neufassung (Tokens Wrap 1180/H2 48). Modulstatus wird bewusst NICHT dargestellt
 * (Briefing 0018).
 */
export function TurnierNews({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: TurnierNewsData;
}) {
  return (
    <PlattformSection
      variant="mist"
      eyebrow={eyebrow}
      headline={headline}
      lead={lead}
      overflowHidden
    >
      <Track data={data} />
      <p className={styles.trackline}>{data.trackline}</p>
    </PlattformSection>
  );
}
