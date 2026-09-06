"use client";

import { useStagedInView } from "@/components/motion/useStagedInView";
import type { DingBox as DingBoxData } from "@/content/clubprozesse";
import styles from "./DreiDinge.module.css";

/**
 * Eine „Drei Dinge"-Box (portiert aus 3.5b .bx/.viz + Mikroabläufe). Der ENDZUSTAND
 * steht im Server-HTML (Chat vollständig, Toggle an + Website aktuell, Zahlung
 * bestätigt) → ohne JS / bei reduzierter Bewegung sofort vollständig lesbar. Nur mit
 * JS und ohne reduzierte Bewegung wird nach Mount kurz der Ausgangszustand (`.start`)
 * gesetzt und beim Sichtbarwerden einmalig aufgelöst. Bewegt nur opacity/transform/
 * background (kein CLS). Kein Modulstatus-Badge (Briefing 0018); das Modul-Label
 * bleibt als Name.
 */
export function DingBox({ box }: { box: DingBoxData }) {
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.35);
  const cls = `${styles.bx}${showStart ? ` ${styles.start}` : ""}`;

  return (
    <div ref={ref} className={cls}>
      <div className={styles.no}>{box.no}</div>
      <h3 className={styles.h3}>{box.title}</h3>
      <p className={styles.p}>{box.text}</p>
      <div className={styles.mod}>
        {box.modPrefix} <b>{box.modName}</b>
      </div>

      <div className={styles.viz} aria-hidden="true">
        {box.viz.kind === "concierge" ? (
          <div className={styles.chat}>
            <div className={styles.t}>{box.viz.time}</div>
            {box.viz.bubbles.map((b) => (
              <div
                key={b.role}
                className={`${styles.bub} ${b.role === "q" ? styles.bubQ : styles.bubA}`}
              >
                {b.text}
              </div>
            ))}
            <div className={styles.t2}>{box.viz.confirm}</div>
            {/* Freigegebenes Praxisbeispiel (kein Modul-Status), bleibt wortgleich. */}
            <div className={`${styles.t} ${styles.tPraxis}`}>{box.viz.praxis}</div>
          </div>
        ) : null}

        {box.viz.kind === "platzstatus" ? (
          <div className={styles.ps2}>
            <div className={styles.row}>
              <div>
                {box.viz.rowTitle}
                <span>{box.viz.rowSub}</span>
              </div>
              <span className={styles.tgl} />
            </div>
            <div className={styles.arr}>{box.viz.arrow}</div>
            <div>
              <div className={styles.web}>{box.viz.webLabel}</div>
              <div className={styles.pstat}>
                <div className={styles.pl}>{box.viz.pstatLabel}</div>
                <div className={styles.pv}>
                  <i />
                  <span>{box.viz.pstatValue}</span>
                </div>
                <div className={styles.pt}>{box.viz.pstatTime}</div>
              </div>
            </div>
          </div>
        ) : null}

        {box.viz.kind === "gastfee" ? (
          <div className={styles.pay}>
            <div className={styles.payLabel}>{box.viz.payLabel}</div>
            {box.viz.rows.map((r) => (
              <div key={r.left} className={styles.payRow}>
                <span>{r.left}</span>
                <b>{r.right}</b>
              </div>
            ))}
            <span className={styles.pb}>{box.viz.button}</span>
            <div className={styles.ok}>
              <i>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M5 12l5 5L19 7" />
                </svg>
              </i>
              {box.viz.ok}
            </div>
            <div className={styles.sub}>{box.viz.sub}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
