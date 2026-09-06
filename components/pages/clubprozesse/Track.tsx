"use client";

import { useStagedInView } from "@/components/motion/useStagedInView";
import type { TurnierNewsData } from "@/content/clubprozesse";
import styles from "./TurnierNews.module.css";

/**
 * Bericht-Strecke der Turnier-News (portiert aus 3.5b .track). Ergebnisliste (PDF) →
 * drei Angaben + Tonalität → drei Ausgaben (Website · Facebook · Instagram, laufen
 * rechts gestaffelt aus). Der ENDZUSTAND (Verbindungslinien voll, alle Ausgaben
 * sichtbar) steht im Server-HTML → ohne JS / bei reduzierter Bewegung sofort lesbar.
 * Nur mit JS und ohne reduzierte Bewegung setzt der Track kurz `.start` und löst es
 * beim Sichtbarwerden einmalig auf. Illustrative Oberfläche (aria-hidden).
 */
export function Track({ data }: { data: TurnierNewsData }) {
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.3);
  const cls = `${styles.track}${showStart ? ` ${styles.start}` : ""}`;
  const { step1, step2, outs } = data;

  return (
    <div ref={ref} className={cls} aria-hidden="true">
      <div className={styles.tstep}>
        <div className={styles.tl}>
          {step1.label} <span>{step1.sub}</span>
        </div>
        <div className={styles.tframe}>
          <div className={styles.dh}>
            <i />
            {step1.frameHead}
          </div>
          <div className={styles.db}>
            <div className={styles.pdf}>
              <div className={styles.ic}>PDF</div>
              <div>
                <b>{step1.pdfName}</b>
                <span>{step1.pdfSource}</span>
              </div>
            </div>
            <div className={styles.rows}>
              {step1.rows.map((r) => (
                <div key={r.klasse}>
                  {r.klasse}
                  <span>{r.name}</span>
                  <em>{r.tag}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
        <span className={styles.link}>
          <i />
        </span>
      </div>

      <div className={styles.tstep}>
        <div className={styles.tl}>
          {step2.label} <span>{step2.sub}</span>
        </div>
        <div className={styles.tframe}>
          <div className={styles.dh}>
            <i />
            {step2.frameHead}
          </div>
          <div className={styles.db}>
            <div className={styles.fld2}>
              {step2.fields.map((f) => (
                <div key={f.label}>
                  {f.label}
                  <span>{f.value}</span>
                </div>
              ))}
            </div>
            <div className={styles.tone}>
              {step2.tone.map((t) => (
                <span key={t.label} className={t.sel ? styles.sel : undefined}>
                  {t.label}
                </span>
              ))}
            </div>
            <span className={styles.gen}>{step2.button}</span>
          </div>
        </div>
        <span className={styles.link}>
          <i />
        </span>
      </div>

      <div className={styles.outs}>
        {outs.map((o, i) => (
          <div key={o.channel} className={`${styles.out} ${styles[`o${i + 1}`]}`}>
            <div className={styles.oh}>
              {o.channel}
              <em>{o.tag}</em>
            </div>
            <div className={styles.ob}>
              {o.pic ? (
                <div className={`${styles.pic}${i === 2 ? ` ${styles.picSm}` : ""}`} />
              ) : null}
              <b>{o.title}</b>
              <p>{o.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
