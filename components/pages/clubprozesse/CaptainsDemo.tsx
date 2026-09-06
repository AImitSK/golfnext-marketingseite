"use client";

import { useStagedInView } from "@/components/motion/useStagedInView";
import type { CaptainsAppData } from "@/content/clubprozesse";
import styles from "./CaptainsApp.module.css";

/**
 * Captains-App-Demo (portiert aus 3.5b .cap2): links der Captain, der den Spieltag
 * einträgt und veröffentlicht, rechts die Mannschaftsseite auf der Clubwebsite, die
 * den Beitrag übernimmt. Der ENDZUSTAND (Beitrag veröffentlicht, „neu"-Tag sichtbar)
 * steht im Server-HTML → ohne JS / bei reduzierter Bewegung sofort lesbar. Nur mit JS
 * und ohne reduzierte Bewegung setzt der Abschnitt kurz `.start` und löst es beim
 * Sichtbarwerden einmalig auf. Illustrative Oberfläche (aria-hidden).
 */
export function CaptainsDemo({ data }: { data: CaptainsAppData }) {
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.35);
  const cls = `${styles.cap2}${showStart ? ` ${styles.start}` : ""}`;
  const { phone, team } = data;

  return (
    <div ref={ref} className={cls} aria-hidden="true">
      <div className={styles.cphone}>
        <div className={styles.scr}>
          <div className={styles.ah}>{phone.head}</div>
          <div className={styles.at}>{phone.title}</div>
          {phone.fields.map((f, i) =>
            f.img ? (
              <div key={`img-${i}`} className={`${styles.f} ${styles.fImg}`} />
            ) : (
              <div key={f.label} className={styles.f}>
                {f.label}
                <span>{f.value}</span>
              </div>
            ),
          )}
          <span className={styles.pub}>{phone.button}</span>
          <div className={styles.done}>{phone.done}</div>
        </div>
      </div>

      <div className={styles.team}>
        <div className={styles.dh}>
          <i />
          <span className={styles.dbUrl}>{team.url}</span>
        </div>
        <div className={styles.db}>
          <div className={styles.th}>
            <b>{team.title}</b>
            <span>{team.season}</span>
          </div>
          <div className={styles.post}>
            <div className={styles.pic} />
            <div>
              <b>{team.post.title}</b>
              <div className={styles.sc}>{team.post.score}</div>
              <p>{team.post.text}</p>
              <div className={styles.by}>{team.post.by}</div>
            </div>
          </div>
          <div className={styles.tlist}>
            {team.rows.map((r) => (
              <div key={r.title} className={r.tag ? styles.new : undefined}>
                <b>{r.title}</b>
                {r.tag ? <em>{r.tag}</em> : <span>{r.value}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
