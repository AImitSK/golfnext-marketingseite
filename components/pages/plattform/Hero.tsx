"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { resolveCta } from "@/lib/links";
import type { HeroData } from "@/content/plattform";
import styles from "./Hero.module.css";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 1 · Hero (portiert aus 3.2c-plattform-neufassung.html, .hero/.demo/.browser/.site/
 * .pstat/.phone/.tgl). Links: Eyebrow, die einzige `<h1>` der Seite, Lead, primärer
 * grüner CTA (Live-Demo) und sekundäre on-dark-Aktion (Erstgespräch), Trust-Zeile.
 * Rechts: die schematische Club-Website mit Platzstatus-Karte plus ein Greenkeeper-
 * Handy. Das Visual läuft rechts aus dem Raster (Bleed über `.demo{width:…%}`), der
 * Seiten-Overflow wird von `.hero{overflow:hidden}` abgefangen (kein horizontaler
 * Scroll). Illustrative Oberfläche, kein echter Screenshot.
 *
 * Mikro-Animation (Motion-Infra 1.7/0015, „einmal/dezent"): Der Greenkeeper stellt
 * den Platz auf „bespielbar", die Website-Platzstatus-Karte springt kurz darauf auf
 * grün/„Platz bespielbar". Der ENDZUSTAND steht im Server-HTML (Toggle an, Karte
 * offen, Bestätigung sichtbar) → ohne JS und bei `prefers-reduced-motion` sofort der
 * Endzustand. Nur mit JS und ohne reduzierte Bewegung wird nach Mount kurz der
 * Ausgangszustand gezeigt und die Meldung läuft einmalig. Bewegt nur Farbe/Transform
 * (kein CLS).
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
  const prefersReducedMotion = useReducedMotion();
  const { demo } = data;

  // phase 2 = Endzustand (SSR/No-JS/Reduced). phase 0 = Ausgangszustand,
  // phase 1 = Toggle an, phase 2 = Website aktualisiert.
  const [phase, setPhase] = useState<0 | 1 | 2>(2);
  const toggleOn = phase >= 1;
  const open = phase >= 2;

  // Vor dem Paint auf den Ausgangszustand setzen, sobald feststeht, dass animiert wird
  // (verhindert ein Aufblitzen des Endzustands vor dem Ablauf der Meldung).
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;
    setPhase(0);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t1 = window.setTimeout(() => setPhase(1), 1400);
    const t2 = window.setTimeout(() => setPhase(2), 1780);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [prefersReducedMotion]);

  return (
    <section className={styles.hero}>
      <div className={styles.in}>
        <div>
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
                {demo.siteNav.map((n, i) => (i === 0 ? <b key={n}>{n}</b> : <span key={n}>{n}</span>))}
              </div>
              <div className={styles.shero}>
                <span>{demo.siteHeroTitle}</span>
              </div>
              <div className={styles.sgrid}>
                <div className={`${styles.pstat} ${open ? styles.pstatOpen : ""}`}>
                  <div className={styles.pl}>{demo.platzstatus.label}</div>
                  <div className={styles.pv}>
                    <i />
                    <span>{open ? demo.platzstatus.valueAfter : demo.platzstatus.valueBefore}</span>
                  </div>
                  <div className={styles.pt}>
                    {open ? demo.platzstatus.timeAfter : demo.platzstatus.timeBefore}
                  </div>
                </div>
                <div className={styles.stext}>
                  {demo.siteText}
                  <i />
                  <i style={{ width: "72%" }} />
                  <i style={{ width: "48%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.phone} aria-hidden="true">
            <div className={styles.scr}>
              <div className={styles.ph1}>{demo.phone.role}</div>
              <div className={styles.ph2}>{demo.phone.title}</div>
              <div className={styles.row}>
                <span>{demo.phone.toggleLabel}</span>
                <span className={`${styles.tgl} ${toggleOn ? styles.tglOn : ""}`} />
              </div>
              <div className={`${styles.ok} ${open ? styles.okShow : ""}`}>{demo.phone.okText}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
