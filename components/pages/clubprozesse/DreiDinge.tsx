import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import type { DingBox as DingBoxData } from "@/content/clubprozesse";
import { DingBox } from "./DingBox";
import styles from "./DreiDinge.module.css";

/**
 * 2 · Drei Dinge (Bento) – portiert aus 3.5b .bento/.bx. Drei Boxen mit je einem
 * Mikroablauf: (01) Concierge-Chat, (02) Platzstatus-Toggle → Website, (03)
 * Gastfee-Zahlung. Die Box-Inhalte sind illustrativ (aria-hidden); die verbindlichen
 * Aussagen stehen im sichtbaren Box-Text daneben. Nutzt die geteilte Sektions-Schale
 * der Neufassung (`PlattformSection`, geteilte Tokens Wrap 1180/H2 48). Modulstatus
 * wird bewusst NICHT dargestellt (Briefing 0018); die Modul-Labels bleiben als Namen.
 */
export function DreiDinge({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: DingBoxData[];
}) {
  return (
    <PlattformSection eyebrow={eyebrow} headline={headline} lead={lead}>
      <div className={styles.bento}>
        {data.map((box) => (
          <DingBox key={box.no} box={box} />
        ))}
      </div>
    </PlattformSection>
  );
}
