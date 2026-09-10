import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { resolveCta } from "@/lib/links";
import type { HeroData } from "@/content/clubprozesse";
import styles from "./Hero.module.css";

/**
 * 1 · Hero (portiert aus 3.5b-clubprozesse-neufassung.html, .hero/.demo/.browser/
 * .site/.pstat/.news/.phone/.log). Links: Eyebrow, die einzige `<h1>` der Seite, Lead,
 * primärer grüner CTA (Erstgespräch) und Trust-Zeile. Rechts: die Clubwebsite (Platzstatus + „Aktuell im Club") plus ein
 * Handy mit dem Sonntags-Log. Das Visual läuft rechts aus dem Raster (Bleed über
 * `.demo{width:…%}`); `.hero{overflow:hidden}` fängt den Seiten-Overflow ab (kein
 * horizontaler Scroll). Illustrative Oberfläche, kein echter Screenshot.
 *
 * Mikro-Animation (Briefing 0015): Der Sonntag „läuft ab" – der Platzstatus öffnet
 * sich (Farbe, Punkt und Text wechseln), die Turnier-News laufen ein, die Log-Zeilen
 * schieben sich herein, am Ende erscheint die Zusammenfassung.
 *
 * Sie liegt vollständig im Modul-CSS und läuft ab dem ersten gemalten Frame. Der Hero
 * steht immer im Sichtfeld; ein erst nach der Hydration gesetzter Startzustand ließe
 * ihn sichtbar rückwärts wegblinken (gemessen, siehe Kommentar in Hero.module.css).
 * Auch der Textwechsel läuft deshalb über CSS: Beide Fassungen stehen im HTML und
 * werden übergeblendet. Ohne JS und bei `prefers-reduced-motion` steht sofort der
 * Endzustand. Bewegt nur `opacity`/`transform`/Farbe (kein CLS), läuft einmal.
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
  const { site, log } = demo;

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
            <div className={styles.site}>
              <div className={styles.snav}>
                <b>{site.brand}</b>
                {site.nav.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
              <div className={styles.sgrid}>
                <div>
                  <div className={styles.sl}>{site.platzLabel}</div>
                  <div className={styles.pstat}>
                    <div className={styles.pl}>{site.pstatLabel}</div>
                    {/* Beide Fassungen liegen im selben Rasterfeld übereinander und
                        werden übergeblendet – der Text kann so mitlaufen, ohne dass
                        JavaScript ihn nach der Hydration austauscht (das ließe ihn
                        sichtbar umspringen) und ohne Layoutverschiebung: Das Feld ist
                        immer so breit wie die längere der beiden Zeilen. Ohne JS und
                        bei reduzierter Bewegung steht sofort der Endwert. */}
                    <div className={styles.pv}>
                      <i />
                      <span className={styles.wechsel}>
                        <span className={styles.vorher}>{site.pstatStartValue}</span>
                        <span className={styles.nachher}>{site.pstatValue}</span>
                      </span>
                    </div>
                    <div className={`${styles.pt} ${styles.wechsel}`}>
                      <span className={styles.vorher}>{site.pstatStartTime}</span>
                      <span className={styles.nachher}>{site.pstatTime}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.sl}>{site.newsLabel}</div>
                  <div className={styles.news}>
                    {site.news.map((n) => (
                      <div key={n.title} className={styles.nitem}>
                        <div className={styles.pic} />
                        <div>
                          <b>{n.title}</b>
                          <span>{n.meta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.phone} aria-hidden="true">
            <div className={styles.scr}>
              <span className={styles.lh}>{log.head}</span>
              <span className={styles.lt}>{log.title}</span>
              {log.events.map((ev) => (
                <div key={ev.time + ev.text} className={styles.ev2}>
                  <b>{ev.time}</b>
                  <div>
                    {ev.text}
                    <span>{ev.source}</span>
                  </div>
                </div>
              ))}
              <div className={styles.sum}>{log.sum}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
