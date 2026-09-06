"use client";

import { useStagedInView } from "@/components/motion/useStagedInView";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { resolveCta } from "@/lib/links";
import type { HeroData } from "@/content/ueber-golfnext";
import styles from "./Hero.module.css";

/**
 * 1 · Hero (portiert aus 3.8b-ueber-golfnext-neufassung.html, .hero/.people/.pcard).
 * Links: Eyebrow (Signalgrün auf Navy), die einzige `<h1>` der Seite, Lead, primärer
 * grüner CTA (Live-Demo) + sekundäre on-dark-Aktion (Erstgespräch) und die Zitatzeile.
 * Rechts: zwei Porträt-Platzhalterkarten (Fred, Stefan) mit „Porträt folgt“-Tag und
 * dekorativem Personen-Icon – kein Foto/Stock/KI. Die Karten laufen rechts aus dem
 * Raster (`.people{width:150%}`); `.hero{overflow:hidden}` fängt den Bleed ab (kein
 * horizontaler Seiten-Overflow).
 *
 * Mikro-Animation (Motion-Infra, „einmal/dezent“): Die Porträtkarten blenden gestaffelt
 * auf. Der ENDZUSTAND (beide Karten sichtbar) steht im Server-HTML → ohne JS und bei
 * `prefers-reduced-motion` sofort vollständig sichtbar. Nur mit JS und ohne reduzierte
 * Bewegung wird nach Mount kurz der Ausgangszustand (`.start`) gesetzt und beim
 * Sichtbarwerden einmalig aufgelöst. Bewegt nur `opacity`/`transform` (kein CLS; die
 * Höhe der `.people`-Fläche ist fest reserviert).
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
  const peopleClass = `${styles.people}${showStart ? ` ${styles.start}` : ""}`;

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
          </div>
          <p className={styles.quote}>{data.quote}</p>
        </div>

        <div ref={ref} className={peopleClass} aria-hidden="true">
          {data.people.map((p, i) => (
            <div key={p.name} className={`${styles.pcard} ${i === 0 ? styles.fred : styles.stefan}`}>
              <div className={styles.ph}>
                <span className={styles.tag}>{p.tag}</span>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="12" cy="9" r="4" />
                  <path d="M4 21c1.6-4 4.6-6 8-6s6.4 2 8 6" />
                </svg>
              </div>
              <div className={styles.cap}>
                <b>{p.name}</b>
                <span>{p.role}</span>
                <em>{p.credit}</em>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
