import { Rise, RiseItem } from "@/components/motion/Rise";
import type { UebergabeData } from "@/content/so-arbeitet-golfnext";
import styles from "./Uebergabe.module.css";

/**
 * 3 · „Die letzte Nachricht schreibt kein System." (portiert aus 3.3b .hand/.hcard/
 * .harrow/.handnote). Links der Kontakt im Marketing-CRM mit seinem Verlauf, rechts die
 * daraus entstandene Aufgabe für das Clubteam, dazwischen ein Pfeil.
 *
 * Beide Karten sind SCHEMATISCHE ILLUSTRATIONEN (`aria-hidden`, Beschreibung über
 * `role="img"` + `aria-label`) – keine echte Oberfläche, keine Zusage. Die Zeile
 * darunter (`handnote`) ist verbindlicher Websitetext und bleibt sichtbar im
 * Barrierefreiheits-Baum.
 *
 * Bewegung: Die beiden Karten blenden gestaffelt auf (`Rise`/`RiseItem`); der
 * Endzustand steht im Server-HTML (`initial` erst nach Mount, ohne reduzierte
 * Bewegung) → ohne JS und bei `prefers-reduced-motion` sofort lesbar, kein CLS.
 */
export function Uebergabe({ data }: { data: UebergabeData }) {
  const { kontakt, aufgabe } = data;

  return (
    <>
      <div role="img" aria-label={data.ariaLabel}>
        <Rise className={styles.hand}>
          <RiseItem className={styles.hcard}>
            <div className={styles.hh} aria-hidden="true">
              <i />
              {kontakt.kopf}
            </div>
            <div className={styles.hb} aria-hidden="true">
              <div className={styles.prof}>
                <span className={styles.av}>{kontakt.av}</span>
                <div>
                  <b>{kontakt.name}</b>
                  <span>{kontakt.herkunft}</span>
                </div>
              </div>
              <div className={styles.tl}>
                {kontakt.verlauf.map((z) => (
                  <div key={z.text}>
                    <i className={z.hot ? styles.hot : undefined} />
                    {z.text}
                    <span>{z.zeit}</span>
                  </div>
                ))}
              </div>
            </div>
          </RiseItem>

          <div className={styles.harrow} aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 12h16M14 6l6 6-6 6" />
            </svg>
          </div>

          <RiseItem className={`${styles.hcard} ${styles.task}`}>
            <div className={styles.hh} aria-hidden="true">
              <i />
              {aufgabe.kopf}
            </div>
            <div className={styles.hb} aria-hidden="true">
              <div className={styles.job}>{aufgabe.job}</div>
              <p className={styles.why}>{aufgabe.warum}</p>
              <div className={styles.act}>
                {aufgabe.aktionen.map((a, i) => (
                  <span key={a} className={i > 0 ? styles.g : undefined}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </RiseItem>
        </Rise>
      </div>

      <p className={styles.handnote}>{data.note}</p>
    </>
  );
}
