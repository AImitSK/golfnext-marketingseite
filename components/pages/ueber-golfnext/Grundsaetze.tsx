import { Rise, RiseItem } from "@/components/motion/Rise";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { GrundsaetzeData } from "@/content/ueber-golfnext";
import styles from "./Grundsaetze.module.css";

/**
 * 3 · Grundsätze (Navy-Band) – portiert aus 3.8b .rules/.rgrid/.rule. Eyebrow
 * (Signalgrün auf Navy), H2, Lead und die Grundsatz-Karten (gestaffeltes Reveal über
 * die Motion-Infra). Der Endzustand steht im Server-HTML (Rise setzt `initial` erst
 * nach Mount, ohne reduzierte Bewegung) → ohne JS sofort lesbar.
 *
 * WICHTIG (Entscheidung Stefan, Briefing 0019): KEIN Modulstatus. Der Mock-Grundsatz
 * /02 „Wir versprechen nur, was läuft.“ mit der Aufzählung „Im Einsatz/Pilot/In
 * Entwicklung“ und der Status-Legende wird NICHT gebaut. Es bleiben zwei Grundsätze
 * (Überschrift „Zwei Grundsätze …“), konsistent als „/ 01“ und „/ 02“ nummeriert.
 * Es wird kein Ersatz-Grundsatz erfunden; die `.st`-Status-Chips des Mocks entfallen.
 */
export function Grundsaetze({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: GrundsaetzeData;
}) {
  return (
    <section className={styles.rules}>
      <div className={styles.wrap}>
        <Eyebrow onDark className={styles.eyebrow}>
          {eyebrow}
        </Eyebrow>
        <h2 className={styles.h2}>{headline}</h2>
        <p className={styles.lead}>{lead}</p>

        <Rise className={styles.rgrid}>
          {data.map((g) => (
            <RiseItem key={g.nummer} className={styles.rule}>
              <div className={styles.rn}>{g.nummer}</div>
              <b>{g.titel}</b>
              <p>{g.text}</p>
            </RiseItem>
          ))}
        </Rise>
      </div>
    </section>
  );
}
