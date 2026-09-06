import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import type { CaptainsAppData } from "@/content/clubprozesse";
import { CaptainsDemo } from "./CaptainsDemo";
import styles from "./CaptainsApp.module.css";

/**
 * 4 · Captains App – portiert aus 3.5b. Split aus App (Captain trägt den Spieltag ein)
 * und Mannschaftsseite (übernimmt den Beitrag). Nutzt die geteilte Sektions-Schale der
 * Neufassung (Tokens Wrap 1180/H2 48). Modulstatus wird bewusst NICHT dargestellt
 * (Briefing 0018) – die Captains App wird als verfügbar dargestellt.
 */
export function CaptainsApp({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: CaptainsAppData;
}) {
  return (
    <PlattformSection eyebrow={eyebrow} headline={headline} lead={lead}>
      <CaptainsDemo data={data} />
      <p className={styles.capnote}>{data.capnote}</p>
    </PlattformSection>
  );
}
