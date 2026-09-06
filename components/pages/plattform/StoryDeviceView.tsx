import type { StoryDevice } from "@/content/plattform";
import styles from "./Story.module.css";

/**
 * Schematischer Geräterahmen eines Story-Schritts (portiert aus 3.2c .dev/.db/.ad/
 * .fld/.mail/.card/.tl). Illustrative Darstellung des Systems – KEIN echter
 * Screenshot. Wird sowohl im klebenden Desktop-Rahmen (`#stage .panel`) als auch in
 * der gestapelten Mobile-/No-JS-Fassung (`.stp .mob`) gerendert. Rein dekorativ, im
 * umgebenden Kontext `aria-hidden`. Reine Server-/Präsentationskomponente.
 */
export function StoryDeviceView({ device }: { device: StoryDevice }) {
  return (
    <div className={styles.dev}>
      <div className={styles.dh}>
        <i />
        {device.head}
      </div>
      <div className={styles.db}>
        {device.kind === "ad" ? (
          <>
            <div className={styles.ad}>
              <span>{device.adTitle}</span>
            </div>
            <b className={styles.h}>{device.headline}</b>
            {device.sub ? <p className={styles.dp}>{device.sub}</p> : null}
            <span className={styles.btn}>{device.button}</span>
          </>
        ) : null}

        {device.kind === "form" ? (
          <>
            <b className={styles.h}>{device.headline}</b>
            {device.sub ? <p className={styles.dp}>{device.sub}</p> : null}
            {device.fields.map((f) => (
              <div key={f} className={styles.fld}>
                {f}
              </div>
            ))}
            <span className={styles.btn}>{device.button}</span>
            {device.tag ? <span className={styles.tag}>{device.tag}</span> : null}
          </>
        ) : null}

        {device.kind === "mail" ? (
          <>
            <div className={styles.mail}>
              <div className={styles.mh}>{device.mailHead}</div>
              <b className={styles.h}>{device.headline}</b>
              <p className={styles.dp}>{device.body}</p>
              {device.button ? <span className={styles.btn}>{device.button}</span> : null}
            </div>
            {device.tag ? <span className={styles.tag}>{device.tag}</span> : null}
          </>
        ) : null}

        {device.kind === "crm" ? (
          <>
            <div className={styles.card}>
              <span className={styles.cav}>{device.av}</span>
              <div>
                <b>{device.name}</b>
                <span>{device.source}</span>
              </div>
            </div>
            <div className={styles.tl}>
              {device.timeline.map((t) => (
                <div key={t.text}>
                  <i className={t.open ? styles.o : undefined} />
                  {t.text}
                </div>
              ))}
            </div>
            {device.tag ? <span className={styles.tag}>{device.tag}</span> : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
