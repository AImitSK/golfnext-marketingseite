"use client";

import { Rise, RiseItem } from "@/components/motion/Rise";
import { useStagedInView } from "@/components/motion/useStagedInView";
import type { WegData } from "@/content/ueber-golfnext";
import styles from "./Weg.module.css";

/**
 * 2 · „Unser Weg“ – Zeitleiste (portiert aus 3.8b .way/.wayline/.wgrid/.wst). Drei
 * Stationen (imageGolf 2016 → GolfNext Consulting → GolfNext 2026); die dritte ist
 * als weiße Karte hervorgehoben. Eine waagerechte Linie zieht über die drei Stufen
 * (dekorativ, `aria-hidden`), die Stationen blenden gestaffelt auf (`Rise`/`RiseItem`).
 *
 * Der ENDZUSTAND (Linie voll, alle Stationen sichtbar) steht im Server-HTML → ohne JS
 * und bei `prefers-reduced-motion` sofort lesbar. Die Jahres-Pills stehen dauerhaft im
 * Endzustand (Navy-Fläche, Signalgrün-Text) – bewusst NICHT animiert, damit sichtbarer
 * Text nie in einem kontrastschwachen Zwischenzustand liegt. Nur die (aria-hidden)
 * Linie und die `Rise`-Kinder bewegen sich; beide bewegen nur `opacity`/`transform`/
 * Linienbreite (kein CLS; die Linie liegt absolut).
 */
export function WegZeitleiste({ data }: { data: WegData }) {
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.3);
  const wayClass = `${styles.way}${showStart ? ` ${styles.start}` : ""}`;

  return (
    <div ref={ref} className={wayClass}>
      <div className={styles.wayline} aria-hidden="true">
        <i />
      </div>
      <Rise className={styles.wgrid}>
        {data.map((s) => (
          <RiseItem key={s.marke} className={s.now ? `${styles.wst} ${styles.now}` : styles.wst}>
            <div className={styles.yr}>
              <i>{s.jahr}</i>
              <b>{s.claim}</b>
            </div>
            <div className={styles.brand}>{s.marke}</div>
            <h3 className={styles.wh}>{s.titel}</h3>
            <p className={styles.wp}>{s.text}</p>
          </RiseItem>
        ))}
      </Rise>
    </div>
  );
}
