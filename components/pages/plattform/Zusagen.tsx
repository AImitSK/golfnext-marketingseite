import { Rise, RiseItem } from "@/components/motion/Rise";
import { PlattformSection } from "./PlattformSection";
import type { ZusagenData } from "@/content/plattform";
import styles from "./Zusagen.module.css";

/**
 * 6 · „Vier Zusagen" (portiert aus 3.2c .vows/.vow + .vowline). Vier Karten
 * (Domain/Daten, Alles mitnehmen, Faire Laufzeiten, Ein Mensch am Telefon) und eine
 * Schlusszeile. „Freigabe Fred ausstehend" bleibt wortgleich stehen – nichts ergänzt.
 *
 * Bewegung (1.7/0015): `Rise` blendet die Karten einmalig gestaffelt auf. Der
 * Hover-Lift sitzt auf der inneren Karte (nicht auf dem `RiseItem`-Wrapper, weil
 * Motion dort nach dem Reveal einen Inline-`transform` setzt). Endzustand im
 * Server-HTML. Reine Server-Komponente (Rise-Wrapper ist der einzige Client-Anteil).
 */
export function Zusagen({
  eyebrow,
  headline,
  data,
}: {
  eyebrow: string;
  headline: string;
  data: ZusagenData;
}) {
  return (
    <PlattformSection eyebrow={eyebrow} headline={headline}>
      <Rise className={styles.vows}>
        {data.vows.map((v) => (
          <RiseItem key={v.n} className={styles.vowWrap}>
            <div className={styles.vow}>
              <div className={styles.vn}>{v.n}</div>
              <b>{v.title}</b>
              <p>{v.text}</p>
            </div>
          </RiseItem>
        ))}
      </Rise>
      <p className={styles.vowline}>{data.line}</p>
    </PlattformSection>
  );
}
