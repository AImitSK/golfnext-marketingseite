"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { resolveCta } from "@/lib/links";
import type { HeroData } from "@/content/startseite";
import styles from "./Hero.module.css";

// Layout-Effekt setzt Zustände vor dem Paint (clientseitig), serverseitig No-op.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 1 · Hero (portiert aus 3.1b .hero/.demo/.browser/.site/.pstat/.fl/.tgl). Links:
 * Eyebrow, die einzige `<h1>` der Seite, Lead, grüner CTA (Erstgespräch, zweite
 * Zeile „30 Minuten persönlich per Zoom oder Teams") und Trust-Zeile. Rechts: eine
 * illustrative Clubwebsite (Bleed) mit drei schwebenden Karten – Anmeldung Anna,
 * Concierge-Chat und Platzstatus-Toggle vom Greenkeeper. Kein echter Screenshot.
 *
 * Mikro-Animation (Motion-Infra, „einmal/dezent"): Der ENDZUSTAND (alle Karten
 * sichtbar, Toggle an, Platzstatus offen = „Platz bespielbar") steht im Server-HTML →
 * ohne JS und bei `prefers-reduced-motion` sofort vollständig lesbar. Nur mit JS und
 * ohne reduzierte Bewegung wird nach Mount kurz der Ausgangszustand gesetzt (Karten
 * laufen ein, Toggle springt um, der Platz geht auf „bespielbar"). Bewegt nur
 * `opacity`/`transform`/Farbe (kein CLS). Die Demo ist `role="img"` mit Label; die
 * UI-Ausschnitte selbst sind `aria-hidden`.
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
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const enhanced = mounted && !prefersReducedMotion;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Endzustand als Default (SSR/No-JS/Reduced-Motion): Toggle an, Platz bespielbar.
  const [toggled, setToggled] = useState(true);
  const [open, setOpen] = useState(true);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);
  useIsomorphicLayoutEffect(() => {
    if (enhanced) {
      setToggled(false);
      setOpen(false);
    }
  }, [enhanced]);

  useEffect(() => {
    if (!enhanced || !inView) return;
    const t1 = window.setTimeout(() => setToggled(true), 2000);
    const t2 = window.setTimeout(() => setOpen(true), 2380);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [enhanced, inView]);

  const showStart = enhanced && !inView;
  const demoClass = `${styles.demo}${showStart ? ` ${styles.start}` : ""}`;
  const { demo, anmeldung, concierge, toggle } = data;
  const platzValue = open ? demo.platzstatus.valueOpen : demo.platzstatus.valueStart;

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
              <span key={t}>
                <i aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div ref={ref} className={demoClass} role="img" aria-label={data.ariaLabel}>
          <div className={styles.browser} aria-hidden="true">
            <div className={styles.bar}>
              <i />
              <i />
              <i />
              <span>{demo.url}</span>
            </div>
            <div className={styles.site}>
              <div className={styles.snav}>
                <b>{demo.brand}</b>
                {demo.nav.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
              <div className={styles.shero}>
                <span className={styles.stitle}>{demo.heroTitle}</span>
                <span className={styles.sb}>{demo.heroBadge}</span>
              </div>
              <div className={styles.sgrid}>
                {demo.tiles.map((t) => (
                  <div key={t} className={styles.tile}>
                    <b>{t}</b>
                    <i />
                    <i />
                  </div>
                ))}
                <div className={`${styles.pstat}${open ? ` ${styles.open}` : ""}`}>
                  <div className={styles.pl}>{demo.platzstatus.label}</div>
                  <div className={styles.pv}>
                    <i />
                    <span>{platzValue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.fl} ${styles.f1}`} aria-hidden="true">
            <span className={styles.av}>{anmeldung.av}</span>
            <div>
              <b>{anmeldung.name}</b>
              <span>{anmeldung.sub}</span>
            </div>
            <span className={styles.stt}>{anmeldung.status}</span>
          </div>
          <div className={`${styles.fl} ${styles.f2}`} aria-hidden="true">
            <div className={styles.t}>{concierge.title}</div>
            <div className={styles.q}>{concierge.frage}</div>
            <div className={styles.a}>{concierge.antwort}</div>
          </div>
          <div className={`${styles.fl} ${styles.f3}`} aria-hidden="true">
            <div>
              {toggle.title}
              <span>{toggle.sub}</span>
            </div>
            <span className={`${styles.tgl}${toggled ? ` ${styles.on}` : ""}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
