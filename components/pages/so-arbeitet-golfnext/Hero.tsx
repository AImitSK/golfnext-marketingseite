"use client";

import { useStagedInView } from "@/components/motion/useStagedInView";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { resolveCta } from "@/lib/links";
import type { HeroData } from "@/content/so-arbeitet-golfnext";
import styles from "./Hero.module.css";

/**
 * 1 · Hero (portiert aus 3.3b-so-arbeitet-golfnext-neufassung.html, .hero/.stack/.mc).
 * Links: Eyebrow, die einzige `<h1>` der Seite, Lead, primärer grüner CTA
 * (Erstgespräch) und die drei Vertrauenspunkte. Rechts der
 * Mail-Stapel: die vier Nachrichten, die nach einer Anmeldung tatsächlich rausgehen.
 *
 * Der Stapel ist eine SCHEMATISCHE ILLUSTRATION (`aria-hidden`, Beschreibung über
 * `role="img"` + `aria-label`) – keine echte Oberfläche, keine Zusage. Er läuft rechts
 * aus dem Raster (Bleed über `.stack{width:128%}`); `.hero{overflow:hidden}` fängt den
 * Seiten-Overflow ab.
 *
 * Bewegung (Motion-Infra 0008/0015, „einmal/dezent"): Der ENDZUSTAND (alle vier Karten
 * sichtbar) steht im Server-HTML → ohne JS und bei `prefers-reduced-motion` sofort
 * vollständig lesbar. Nur mit JS und ohne reduzierte Bewegung wird nach Mount kurz der
 * Ausgangszustand (`.start`) gesetzt und beim Sichtbarwerden gestaffelt aufgelöst.
 * Bewegt nur `opacity`/`transform`; die Stapelhöhe ist fest reserviert (kein CLS).
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
  const stackClass = `${styles.stack}${showStart ? ` ${styles.start}` : ""}`;
  const position = [styles.m1, styles.m2, styles.m3, styles.m4];

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

        <div ref={ref} className={stackClass} role="img" aria-label={data.ariaLabel}>
          {data.stapel.map((karte, i) => (
            <div key={karte.betreff} className={`${styles.mc} ${position[i]}`} aria-hidden="true">
              <span className={styles.when}>{karte.when}</span>
              <b>{karte.betreff}</b>
              <p>{karte.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
