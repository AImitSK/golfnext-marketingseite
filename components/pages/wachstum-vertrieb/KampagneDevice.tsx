import type { KampagneDevice as KampagneDeviceData } from "@/content/wachstum-vertrieb";
import styles from "./Kampagne.module.css";

/** Grüner Haken, fix 16 × 16 px (Icon-Regel: nie ohne Größe). */
function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

/**
 * Schematischer Geräterahmen eines Kampagnen-Schritts (portiert aus 3.4b .dev/.db/
 * .adprev/.kv2/.ads2/.ad/.card/.tl/.rep/.cap/.crmlist). Illustrative Darstellung des
 * Systems – KEIN echter Screenshot. Wird sowohl im klebenden Desktop-Rahmen als auch in
 * der gestapelten Mobile-/No-JS-Fassung gerendert. Rein dekorativ, im umgebenden
 * Kontext `aria-hidden`. Der Wochenbericht zeigt KATEGORIEN, keine konkreten Werte
 * (Briefing 0017). Reine Server-/Präsentationskomponente.
 */
export function KampagneDevice({ device }: { device: KampagneDeviceData }) {
  return (
    <div className={styles.dev}>
      <div className={styles.dh}>
        <i />
        {device.head}
      </div>
      <div className={styles.db}>
        {device.kind === "freigabe" ? (
          <>
            <b className={styles.h}>{device.headline}</b>
            <p className={styles.dp}>{device.body}</p>
            <div className={styles.adprev}>
              <div className={styles.pic} />
              <div>
                <b>{device.preview.title}</b>
                <span>{device.preview.text}</span>
              </div>
            </div>
            <div className={styles.kv2}>
              {device.kv.map((k) => (
                <div key={k.label}>
                  {k.label}
                  <b>{k.value}</b>
                </div>
              ))}
            </div>
            <span className={styles.btn}>{device.button}</span>
            <span className={styles.tag}>{device.tag}</span>
          </>
        ) : null}

        {device.kind === "ads" ? (
          <>
            <b className={styles.h}>{device.headline}</b>
            <div className={styles.ads2}>
              {device.ads.map((ad) => (
                <div key={ad.label} className={styles.ad}>
                  <div className={styles.al}>{ad.label}</div>
                  {ad.style === "image" ? (
                    <>
                      <div className={styles.pic}>
                        <b>{ad.imageTitle}</b>
                      </div>
                      <div className={styles.gd}>{ad.desc}</div>
                    </>
                  ) : (
                    <>
                      <div className={styles.gt}>{ad.title}</div>
                      <div className={styles.gu}>{ad.url}</div>
                      <div className={styles.gd}>
                        <b>{ad.badge}</b>
                        {ad.desc}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <span className={styles.tag}>{device.tag}</span>
          </>
        ) : null}

        {device.kind === "crm-card" ? (
          <>
            <b className={styles.h}>{device.headline}</b>
            <p className={styles.dp}>{device.body}</p>
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
            <span className={styles.tag}>{device.tag}</span>
          </>
        ) : null}

        {device.kind === "crm-list" ? (
          <>
            <div className={styles.cap}>
              <b>{device.capTitle}</b>
              <span>{device.capNote}</span>
            </div>
            <div className={styles.crmlist}>
              {device.rows.map((r) => (
                <div key={r.name} className={styles.crmrow}>
                  <span className={styles.rav}>{r.av}</span>
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
            <span className={styles.tag}>{device.tag}</span>
          </>
        ) : null}

        {device.kind === "report" ? (
          <>
            <b className={styles.h}>{device.headline}</b>
            <p className={styles.dp}>{device.body}</p>
            <div className={styles.rep}>
              {device.items.map((item) => (
                <div key={item}>
                  <CheckIcon />
                  {item}
                </div>
              ))}
            </div>
            <span className={styles.tag}>{device.tag}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
