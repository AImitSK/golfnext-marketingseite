import { PlattformSection } from "./PlattformSection";
import { BentoBox } from "./BentoBox";
import type { BentoBox as BentoBoxData } from "@/content/plattform";
import styles from "./Bento.module.css";

/**
 * 2 · Bento „Drei Dinge, die sich ändern" (portiert aus 3.2c .bento/.bx).
 * Drei Boxen mit je einer Mikroanimation (CRM-Zeilen laufen ein, Concierge-Chat
 * erscheint Blase für Blase, fünf Werkzeuge fahren zu „GolfNext" zusammen).
 * Die Box-Inhalte sind illustrativ; die einzige echte Kennzahl („68 %") steht als
 * Pilot-Hinweis in Box 02.
 */
export function Bento({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: BentoBoxData[];
}) {
  return (
    <PlattformSection eyebrow={eyebrow} headline={headline} lead={lead}>
      <div className={styles.bento}>
        {data.map((box) => (
          <BentoBox key={box.no} box={box} />
        ))}
      </div>
    </PlattformSection>
  );
}
