import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { Rise, RiseItem } from "@/components/motion/Rise";
import type { WasBleibtData } from "@/content/clubprozesse";
import styles from "./WasBleibt.module.css";

/**
 * 5 · Was bleibt – portiert aus 3.5b .split2/.sbox (Sektion „sand"). Zwei Spalten:
 * „Läuft von allein" (Navy-Box mit Modul-Namen als Labels) und „Bleibt beim Clubteam"
 * (helle Box). Die beiden Boxen blenden über die geteilte Motion-Infra (Rise/RiseItem)
 * einmalig gestaffelt auf; Endzustand steht im Server-HTML. Nutzt die geteilte
 * Sektions-Schale der Neufassung (Tokens Wrap 1180/H2 48).
 *
 * WICHTIG (Briefing 0018): Kein Modulstatus – die dev-Auszeichnung der Labels und die
 * Mock-Zeile „Stand je Modul wie im Footer: …" sind bewusst weggelassen. Module werden
 * als verfügbar dargestellt; die Modul-Namen bleiben als Labels.
 */
export function WasBleibt({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: WasBleibtData;
}) {
  const { allein, clubteam } = data;

  return (
    <PlattformSection variant="sand" eyebrow={eyebrow} headline={headline} lead={lead}>
      <Rise className={styles.split2}>
        <RiseItem className={`${styles.sbox} ${styles.gn}`}>
          <div className={styles.bl}>{allein.label}</div>
          <ul className={styles.list}>
            {allein.rows.map((r) => (
              <li key={r.mod} className={styles.li}>
                <span>{r.text}</span>
                <span className={styles.m}>{r.mod}</span>
              </li>
            ))}
          </ul>
        </RiseItem>

        <RiseItem className={styles.sbox}>
          <div className={styles.bl}>{clubteam.label}</div>
          <ul className={styles.list}>
            {clubteam.rows.map((r) => (
              <li key={r} className={styles.li}>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <p className={styles.foot}>{clubteam.foot}</p>
        </RiseItem>
      </Rise>
    </PlattformSection>
  );
}
