"use client";

import { useStagedInView } from "@/components/motion/useStagedInView";
import type { FanCard } from "@/content/wachstum-vertrieb";
import styles from "./Fundament.module.css";

/**
 * Aufgefächerte Landingpages (portiert aus 3.4b .fan/.lp). Illustrativ, kein
 * Screenshot – daher `aria-hidden`. Der ENDZUSTAND (aufgefächert, sichtbar) steht im
 * Server-HTML → ohne JS / bei reduzierter Bewegung sofort sichtbar. Nur mit JS und ohne
 * reduzierte Bewegung wird nach Mount kurz der Ausgangszustand (`.start`, eingeklappt)
 * gesetzt und beim Sichtbarwerden einmalig aufgefächert. Bewegt nur `opacity`/`transform`
 * (kein CLS).
 */
export function FundamentFan({ cards }: { cards: FanCard[] }) {
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.3);
  const cls = `${styles.fan}${showStart ? ` ${styles.start}` : ""}`;
  const posClasses = [styles.l1, styles.l2, styles.l3];

  return (
    <div ref={ref} className={cls} aria-hidden="true">
      {cards.map((c, i) => (
        <div key={c.url} className={`${styles.lp} ${posClasses[i]}`}>
          <div className={styles.lb}>
            <i />
            <i />
            <i />
            <span>{c.url}</span>
          </div>
          <div className={styles.lc}>
            <div className={styles.pic}>
              <b>{c.title}</b>
            </div>
            <i />
            <i style={{ width: "60%" }} />
            <span className={styles.btn}>{c.button}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
