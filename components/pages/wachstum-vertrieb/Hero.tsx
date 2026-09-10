import { Fragment } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { resolveCta } from "@/lib/links";
import type { HeroData } from "@/content/wachstum-vertrieb";
import styles from "./Hero.module.css";

/**
 * 1 · Hero (portiert aus 3.4b-wachstum-vertrieb-neufassung.html, .hero/.demo/.browser/
 * .cock/.crmlist/.phone/.ig). Links: Eyebrow, die einzige `<h1>` der Seite, Lead,
 * primärer grüner CTA (Erstgespräch) und Trust-Zeile. Rechts: das Kampagnen-Cockpit (laufende Kampagne + Anmeldungsliste)
 * plus ein Instagram-Handy mit der Anzeige. Das Visual läuft rechts aus dem Raster
 * (Bleed über `.demo{width:…%}`); `.hero{overflow:hidden}` fängt den Seiten-Overflow
 * ab (kein horizontaler Scroll). Illustrative Oberfläche, kein echter Screenshot.
 *
 * Mikro-Animation „Hero-Fill" (Briefing 0015): Die Anmeldungen laufen nacheinander in
 * die Liste ein. Sie liegt vollständig im Modul-CSS (`@keyframes einlaufen`) und läuft
 * ab dem ersten gemalten Frame – der Hero steht immer im Sichtfeld, ein erst nach der
 * Hydration gesetzter Startzustand ließe ihn sichtbar rückwärts wegblinken (gemessen,
 * siehe Kommentar in Hero.module.css). Ohne JS und bei `prefers-reduced-motion` steht
 * sofort der Endzustand. Bewegt nur `opacity`/`transform` (kein CLS), läuft einmal.
 *
 * Dadurch braucht der Hero **kein** JavaScript mehr: reine Server-Komponente.
 *
 * Seit Briefing 0031 trägt der Hero nur noch eine Aktion; die Prop `ctaSecondary`
 * bleibt optional erhalten und wird derzeit von keiner Seite gesetzt.
 */
export function Hero({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: HeroData;
}) {
  const { demo } = data;

  return (
    <section className={styles.hero}>
      <div className={styles.in}>
        <div className={styles.txt}>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h1 className={styles.h1}>{headline}</h1>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.acts}>
            <Button variant="cta" cta={data.ctaPrimary} secondLine={data.ctaPrimary.hint}>
              {data.ctaPrimary.label}
            </Button>
            {data.ctaSecondary ? (
              <a className={styles.b2} href={resolveCta(data.ctaSecondary)}>
                {data.ctaSecondary.label}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            ) : null}
          </div>
          <div className={styles.trust}>
            {data.trust.map((t) => (
              <span key={t.text}>
                <i aria-hidden="true" />
                {t.text}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.demo} aria-label={data.ariaLabel} role="img">
          <div className={styles.browser} aria-hidden="true">
            <div className={styles.bar}>
              <i />
              <i />
              <i />
              <span>{demo.url}</span>
            </div>
            <div className={styles.cock}>
              <div className={styles.ch}>
                <div>
                  <div className={styles.cl}>{demo.cockpit.label}</div>
                  <div className={styles.ct}>{demo.cockpit.title}</div>
                </div>
                <span className={styles.live}>
                  <i />
                  {demo.cockpit.live}
                </span>
              </div>
              <div className={styles.cg}>
                <div className={styles.kv}>
                  {demo.cockpit.kv.map((k) => (
                    <div key={k.label}>
                      {k.label} <b>{k.value}</b>
                    </div>
                  ))}
                </div>
                <div className={styles.crmlist}>
                  <div className={styles.cl}>{demo.cockpit.listLabel}</div>
                  {demo.cockpit.rows.map((r) => (
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
              </div>
            </div>
          </div>

          <div className={styles.phone} aria-hidden="true">
            <div className={styles.scr}>
              <div className={styles.ih}>
                <i />
                <div>
                  {demo.phone.handle}
                  <span>{demo.phone.sponsored}</span>
                </div>
              </div>
              <div className={styles.im}>
                <span>
                  {demo.phone.imageTitleLines.map((line, i) => (
                    <Fragment key={line}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </Fragment>
                  ))}
                </span>
              </div>
              <span className={styles.igcta}>{demo.phone.cta}</span>
              <div className={styles.cap}>{demo.phone.caption}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
