import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import type { WegData } from "@/content/ueber-golfnext";
import { WegZeitleiste } from "./WegZeitleiste";

/**
 * 2 · „Unser Weg“ – geteilte Sektions-Schale (paper) mit Eyebrow/H2/Lead und der
 * Zeitleiste (Client-Teilkomponente für die einmalige Reveal-Bewegung). Texte
 * wortgleich aus `content/ueber-golfnext.ts`.
 */
export function Weg({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: WegData;
}) {
  return (
    <PlattformSection eyebrow={eyebrow} headline={headline} lead={lead}>
      <WegZeitleiste data={data} />
    </PlattformSection>
  );
}
