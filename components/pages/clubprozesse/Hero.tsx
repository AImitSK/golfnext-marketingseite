"use client";

import { useStagedInView } from "@/components/motion/useStagedInView";
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
 * Mikro-Animation (Motion-Infra, „einmal/dezent"): Der Sonntag „läuft ab" – der
 * Platzstatus öffnet sich, die Log-Zeilen und News-Karten laufen nacheinander ein,
 * am Ende erscheint die Zusammenfassung. Der ENDZUSTAND (Platz bespielbar, alles
 * sichtbar) steht im Server-HTML → ohne JS und bei `prefers-reduced-motion` sofort
 * vollständig lesbar. Nur mit JS und ohne reduzierte Bewegung wird nach Mount kurz der
 * Ausgangszustand (`.start`) gesetzt und beim Sichtbarwerden einmalig aufgelöst; der
 * Platzstatus zeigt dann kurz den Ausgangswert. Bewegt nur `opacity`/`transform`/
 * `background` (kein CLS).
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
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.3);
  const { demo } = data;
  const { site, log } = demo;
  const demoClass = `${styles.demo}${showStart ? ` ${styles.start}` : ""}`;
  // Platzstatus-Text folgt demselben Signal wie die Bewegung: transient (mit JS, vor
  // dem Sichtbarwerden) der Ausgangswert, sonst der Endwert (SSR/ohne JS/reduziert).
  const pstatValue = showStart ? site.pstatStartValue : site.pstatValue;
  const pstatTime = showStart ? site.pstatStartTime : site.pstatTime;

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

        <div ref={ref} className={demoClass} aria-label={data.ariaLabel} role="img">
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
                    <div className={styles.pv}>
                      <i />
                      <span>{pstatValue}</span>
                    </div>
                    <div className={styles.pt}>{pstatTime}</div>
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
