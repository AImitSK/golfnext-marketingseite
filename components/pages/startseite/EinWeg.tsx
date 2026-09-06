"use client";

import { Fragment } from "react";
import { Rise, RiseItem } from "@/components/motion/Rise";
import { useStagedInView } from "@/components/motion/useStagedInView";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref, resolveCta } from "@/lib/links";
import type { WegData } from "@/content/startseite";
import styles from "./EinWeg.module.css";

/**
 * 5 · „Ein Weg" (portiert aus 3.1b .way/.wayline/.wgrid/.wst). Vier Schritte von der
 * Instagram-Anzeige bis zur Anmeldung zur Platzreife, jeder mit einem illustrativen
 * Geräte-Fenster (`aria-hidden`). Eine waagerechte Linie zieht über die Schritte
 * (dekorativ, `aria-hidden`), die Schritte blenden gestaffelt auf (`Rise`/`RiseItem`).
 *
 * Der ENDZUSTAND (Linie voll, alle Schritte sichtbar) steht im Server-HTML → ohne JS
 * und bei `prefers-reduced-motion` sofort lesbar. Die nummerierten Knoten stehen
 * dauerhaft im Endzustand (Navy + Signalgrün-Ziffer), damit sichtbarer Text nie
 * kontrastschwach liegt. Darunter zwei Links (So arbeitet GolfNext · Live-Demo).
 */
export function EinWeg({ data }: { data: WegData }) {
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.3);
  const wayClass = `${styles.way}${showStart ? ` ${styles.start}` : ""}`;

  return (
    <>
      <div ref={ref} className={wayClass}>
        <div className={styles.wayline} aria-hidden="true">
          <i />
        </div>
        <Rise className={styles.wgrid}>
          {data.schritte.map((s) => (
            <RiseItem key={s.n} className={styles.wst}>
              <div className={styles.yr}>
                <i>{s.n}</i>
                <b>{s.zeit}</b>
              </div>
              <h3 className={styles.wh}>{s.title}</h3>
              <p className={styles.wp}>{s.text}</p>
              <div className={styles.dev} aria-hidden="true">
                <div className={styles.dh}>
                  <i />
                  {s.device.head}
                </div>
                <div className={styles.db}>
                  {s.device.pic ? (
                    <div className={styles.pic}>
                      <b>{s.device.pic}</b>
                    </div>
                  ) : null}
                  {s.device.title ? <b className={styles.dhead}>{s.device.title}</b> : null}
                  {s.device.fields?.map((f) => (
                    <div key={f} className={styles.fld}>
                      {f}
                    </div>
                  ))}
                  {s.device.body?.map((line, i) => (
                    <Fragment key={line}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </Fragment>
                  ))}
                  {s.device.button ? <span className={styles.btn}>{s.device.button}</span> : null}
                  {s.device.tag ? <span className={styles.tag}>{s.device.tag}</span> : null}
                </div>
              </div>
            </RiseItem>
          ))}
        </Rise>
      </div>
      <div className={styles.waylinks}>
        {data.links.map((l) => (
          <TextLink
            key={l.label}
            href={l.target === "intern" ? internalHref(l.href!) : resolveCta(l)}
          >
            {l.label}
          </TextLink>
        ))}
      </div>
    </>
  );
}
