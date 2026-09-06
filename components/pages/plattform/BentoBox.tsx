"use client";

import { useStagedInView } from "@/components/motion/useStagedInView";
import type { BentoBox as BentoBoxData } from "@/content/plattform";
import styles from "./Bento.module.css";

/**
 * Eine Bento-Box (portiert aus 3.2c .bx/.viz + Mikroanimationen). Der ENDZUSTAND
 * steht im Server-HTML (Box sichtbar, CRM-Zeilen da, Chat komplett, Werkzeuge zu
 * „GolfNext" zusammengeführt) → ohne JS / bei reduzierter Bewegung sofort vollständig
 * lesbar. Nur mit JS und ohne reduzierte Bewegung wird nach Mount kurz der
 * Ausgangszustand (`.start`) gesetzt und beim Sichtbarwerden einmalig aufgelöst
 * (`useStagedInView`). Bewegt nur `opacity`/`transform` (kein CLS).
 */
export function BentoBox({ box }: { box: BentoBoxData }) {
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.35);
  const cls = `${styles.bx}${showStart ? ` ${styles.start}` : ""}`;

  return (
    <div ref={ref} className={cls}>
      <div className={styles.no}>{box.no}</div>
      <h3 className={styles.h3}>{box.title}</h3>
      <p className={styles.p}>{box.text}</p>
      <div className={styles.viz} aria-hidden="true">
        {box.viz.kind === "crm" ? (
          <div className={styles.crmlist}>
            {box.viz.rows.map((r) => (
              <div key={r.name} className={styles.crmrow}>
                <span className={styles.av}>{r.av}</span>
                <div>
                  <b>{r.name}</b>
                  <span>{r.sub}</span>
                </div>
                <span className={`${styles.st}${r.statusVariant === "b" ? ` ${styles.stB}` : ""}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {box.viz.kind === "chat" ? (
          <div className={styles.chat}>
            <div className={styles.t}>{box.viz.time}</div>
            {box.viz.bubbles.map((b) => (
              <div key={b.text} className={`${styles.bub} ${b.from === "q" ? styles.q : styles.a}`}>
                {b.text}
              </div>
            ))}
            <div className={styles.t2}>{box.viz.done}</div>
            <div className={styles.t} style={{ marginTop: "6px" }}>
              {box.viz.pilot}
            </div>
          </div>
        ) : null}

        {box.viz.kind === "merge" ? (
          <div className={styles.merge}>
            {box.viz.tools.map((tl) => (
              <span
                key={tl.label}
                className={styles.tool}
                style={
                  {
                    left: tl.pos.left,
                    right: tl.pos.right,
                    top: tl.pos.top,
                    "--tx": tl.tx,
                    "--ty": tl.ty,
                  } as React.CSSProperties
                }
              >
                {tl.label}
              </span>
            ))}
            <div className={styles.one}>
              <i />
              {box.viz.one}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
