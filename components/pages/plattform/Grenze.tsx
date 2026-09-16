import { PlattformSection } from "./PlattformSection";
import type { GrenzeData } from "@/content/plattform";
import styles from "./Grenze.module.css";

/**
 * 5 · „Klare Grenze" (portiert aus 3.2c .border5/.split). Fließtext plus ein Split
 * GolfNext ↔ Ihre Clubverwaltung. Macht sichtbar, was GolfNext übernimmt und was bei
 * der Clubverwaltungssoftware bleibt. Reine Server-Komponente.
 */
export function Grenze({
  eyebrow,
  headline,
  data,
}: {
  eyebrow: string;
  headline: string;
  data: GrenzeData;
}) {
  return (
    <PlattformSection variant="sand" eyebrow={eyebrow} headline={headline}>
      <div className={styles.border5}>
        <div className={styles.texts}>
          {data.paragraphs.map((p) => (
            <p key={p} className={styles.p}>
              {p}
            </p>
          ))}
        </div>
        <div className={styles.split}>
          <div className={`${styles.box} ${styles.gn}`}>
            <div className={styles.bl}>{data.golfnext.label}</div>
            <ul>
              {data.golfnext.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className={styles.verbindung}>{data.verbindung}</div>
          <div className={styles.box}>
            <div className={styles.bl}>{data.clubsoftware.label}</div>
            <ul>
              {data.clubsoftware.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className={styles.abschluss}>{data.abschluss}</p>
      </div>
    </PlattformSection>
  );
}
