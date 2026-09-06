import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import type { WissenData } from "@/content/ueber-golfnext";
import { WissenSlider } from "./WissenSlider";
import styles from "./Wissen.module.css";

/**
 * 6 · „Wissen“ – geteilte Sektions-Schale (paper, overflowHidden für den Slider-Bleed)
 * mit dem horizontalen Artikel-Slider (Client-Teilkomponente) und dem „Alle
 * Artikel“-Link darunter (Ziel /ratgeber, solange live – sonst `#` via resolveCta/
 * intern). Texte wortgleich aus `content/ueber-golfnext.ts`.
 */
export function Wissen({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: WissenData;
}) {
  return (
    <PlattformSection variant="paper" overflowHidden eyebrow={eyebrow} headline={headline} lead={lead}>
      <WissenSlider data={data.cards} />
      <p className={styles.alle}>
        <TextLink href={internalHref(data.alleArtikel.path)}>{data.alleArtikel.label}</TextLink>
      </p>
    </PlattformSection>
  );
}
