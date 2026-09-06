import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import type { MomentBox as MomentBoxData } from "@/content/wachstum-vertrieb";
import { MomentBox } from "./MomentBox";
import styles from "./Momente.module.css";

/**
 * 2 · Drei Momente (Bento) – portiert aus 3.4b .bento/.bx. Drei Boxen mit je einer
 * Mikroanimation: (01) Such-Tippanimation, (02) Instagram-Feed scrollt zur Anzeige,
 * (03) Zeitleiste „danach" füllt sich. Die Box-Inhalte sind illustrativ (aria-hidden);
 * die verbindlichen Aussagen stehen im sichtbaren Box-Text daneben. Nutzt die geteilte
 * Sektions-Schale der Neufassung (`PlattformSection`, geteilte Tokens Wrap 1180/H2 48).
 */
export function Momente({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: MomentBoxData[];
}) {
  return (
    <PlattformSection eyebrow={eyebrow} headline={headline} lead={lead}>
      <div className={styles.bento}>
        {data.map((box) => (
          <MomentBox key={box.no} box={box} />
        ))}
      </div>
    </PlattformSection>
  );
}
