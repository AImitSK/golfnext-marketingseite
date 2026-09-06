"use client";

import { useStagedInView } from "@/components/motion/useStagedInView";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import type { TeilBox } from "@/content/startseite";
import styles from "./DreiTeile.module.css";

/**
 * Eine „Drei-Teile"-Box (portiert aus 3.1b .bx/.viz + Mikroanimationen). Sichtbarer
 * Text (Nummer, Titel, Absatz, Teaser-Link) plus eine illustrative Mikrovisualisierung
 * (`aria-hidden`): Mini-Website (01), CRM-Liste (02) oder Logbuch (03).
 *
 * Bewegung: Der ENDZUSTAND steht im Server-HTML → ohne JS / reduzierte Bewegung sofort
 * vollständig lesbar. Nur mit JS und ohne reduzierte Bewegung setzt `useStagedInView`
 * kurz `.start` (Ausgangszustand) und löst es beim Sichtbarwerden gestaffelt auf. Der
 * Teaser-Link wird über `internalHref` live-gegated (alle drei Ziele sind live).
 */
export function TeileBox({ box }: { box: TeilBox }) {
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.35);
  const cls = `${styles.bx}${showStart ? ` ${styles.start}` : ""}`;

  return (
    <div ref={ref} className={cls}>
      <div className={styles.no}>{box.no}</div>
      <h3 className={styles.h3}>{box.title}</h3>
      <p className={styles.p}>{box.text}</p>
      <div className={styles.go}>
        <TextLink href={internalHref(box.link.path)}>{box.link.label}</TextLink>
      </div>

      <div className={styles.viz} aria-hidden="true">
        {box.viz.kind === "website" ? (
          <div className={styles.mini}>
            <div className={styles.mb}>
              <i />
              <i />
              <i />
              <span>{box.viz.url}</span>
            </div>
            <div className={styles.mc}>
              <div className={styles.pic}>
                <b>{box.viz.picTitle}</b>
              </div>
              {box.viz.rows.map((r) => (
                <div key={r.left} className={styles.mrow}>
                  <span>{r.left}</span>
                  <b>{r.right}</b>
                </div>
              ))}
              <span className={styles.own}>{box.viz.own}</span>
            </div>
          </div>
        ) : null}

        {box.viz.kind === "crm" ? (
          <div className={styles.crmlist}>
            {box.viz.rows.map((r) => (
              <div key={r.name} className={styles.crmrow}>
                <span className={styles.av}>{r.av}</span>
                <div>
                  <b>{r.name}</b>
                  <span>{r.sub}</span>
                </div>
                <span
                  className={`${styles.st}${r.statusVariant === "b" ? ` ${styles.stB}` : ""}`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {box.viz.kind === "log" ? (
          <div className={styles.log}>
            <div className={styles.lh}>{box.viz.head}</div>
            {box.viz.events.map((ev) => (
              <div key={ev.time} className={styles.ev}>
                <b>{ev.time}</b>
                <div>
                  {ev.text}
                  <span>{ev.sub}</span>
                </div>
              </div>
            ))}
            <div className={styles.sum}>{box.viz.sum}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
