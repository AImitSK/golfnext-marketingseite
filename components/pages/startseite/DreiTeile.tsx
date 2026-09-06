import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import type { TeilBox } from "@/content/startseite";
import { TeileBox } from "./TeileBox";
import styles from "./DreiTeile.module.css";

/**
 * 3 · „Drei Teile. Ein System." (portiert aus 3.1b .bento). Drei Boxen – Clubwebsite,
 * Wachstum, Clubprozesse – mit je einem Teaser-Link auf die live-Seite (`/plattform`,
 * `/wachstum-vertrieb`, `/clubprozesse`) und einer illustrativen Mikrovisualisierung.
 * Nutzt die geteilte Sektions-Schale der Neufassung (`PlattformSection`, Tokens
 * Wrap 1180 / H2 48). Die Boxen selbst sind Client-Teilkomponenten (Reveal).
 */
export function DreiTeile({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: TeilBox[];
}) {
  return (
    <PlattformSection eyebrow={eyebrow} headline={headline} lead={lead}>
      <div className={styles.bento}>
        {data.map((box) => (
          <TeileBox key={box.no} box={box} />
        ))}
      </div>
    </PlattformSection>
  );
}
