"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useMountedReveal } from "@/components/motion/useMountedReveal";
import type { MomentBox as MomentBoxData } from "@/content/wachstum-vertrieb";
import styles from "./Momente.module.css";

// Layout-Effekt setzt Zustände vor dem Paint (clientseitig), serverseitig No-op.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Eine „Moment"-Box (portiert aus 3.4b .bx/.viz + Mikroanimationen). Der ENDZUSTAND
 * steht im Server-HTML (Suchanfrage fertig getippt + Ergebnis sichtbar, Feed bei der
 * Anzeige, Zeitleiste gefüllt) → ohne JS / bei reduzierter Bewegung sofort vollständig
 * lesbar. Nur mit JS und ohne reduzierte Bewegung wird nach Mount kurz der
 * Ausgangszustand (`.start`) gesetzt und beim Sichtbarwerden einmalig aufgelöst; die
 * Such-Box tippt dabei die echte Suchanfrage. Bewegt nur `opacity`/`transform`/`height`
 * mit vorab reservierten Höhen (kein CLS).
 */
export function MomentBox({ box }: { box: MomentBoxData }) {
  const enhanced = useMountedReveal();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  const isSearch = box.viz.kind === "search";
  const query = box.viz.kind === "search" ? box.viz.query : "";
  // SSR / ohne JS / reduzierte Bewegung: fertig getippte Anfrage, Tippen abgeschlossen.
  const [typed, setTyped] = useState(query);
  const [typingDone, setTypingDone] = useState(true);

  useIsomorphicLayoutEffect(() => {
    if (!enhanced || !isSearch) return;
    setTyped("");
    setTypingDone(false);
  }, [enhanced, isSearch]);

  useEffect(() => {
    if (!enhanced || !isSearch || !inView) return;
    let i = 0;
    const iv = window.setInterval(() => {
      i += 1;
      setTyped(query.slice(0, i));
      if (i >= query.length) {
        window.clearInterval(iv);
        window.setTimeout(() => setTypingDone(true), 350);
      }
    }, 55);
    return () => window.clearInterval(iv);
  }, [enhanced, isSearch, inView, query]);

  const showStart = enhanced && !inView;
  const typing = enhanced && isSearch && inView && !typingDone;
  const cls = [styles.bx, showStart ? styles.start : "", typing ? styles.typing : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={cls}>
      <div className={styles.no}>{box.no}</div>
      <h3 className={styles.h3}>{box.title}</h3>
      <p className={styles.p}>{box.text}</p>
      <div className={styles.mod}>
        {box.modPrefix} <b>{box.modName}</b>
      </div>

      <div className={styles.viz} aria-hidden="true">
        {box.viz.kind === "search" ? (
          <>
            <div className={styles.srch}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <span>{typed}</span>
              <span className={styles.cur} />
            </div>
            <div className={styles.res}>
              <div className={styles.rl}>
                <b>{box.viz.result.labelBadge}</b>
                {box.viz.result.domain}
              </div>
              <div className={styles.rt}>{box.viz.result.title}</div>
              <div className={styles.rd}>{box.viz.result.desc}</div>
            </div>
          </>
        ) : null}

        {box.viz.kind === "feed" ? (
          <div className={styles.feed}>
            <div className={styles.fcol}>
              <div className={styles.fc}>
                <i />
                <div>
                  <span />
                  <span />
                </div>
                <div className={styles.pic} />
              </div>
              <div className={styles.fc}>
                <i />
                <div>
                  <span />
                  <span />
                </div>
              </div>
              <div className={styles.fc}>
                <i />
                <div>
                  <span />
                  <span />
                </div>
                <div className={styles.pic} />
              </div>
              <div className={styles.fad}>
                <div className={styles.fh}>
                  <i />
                  {box.viz.adHandle}
                  <span>{box.viz.adSponsored}</span>
                </div>
                <div className={styles.fim}>
                  <b>{box.viz.adTitle}</b>
                </div>
                <span className={styles.fb}>{box.viz.adButton}</span>
              </div>
              <div className={styles.fc}>
                <i />
                <div>
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {box.viz.kind === "after" ? (
          <div className={styles.after}>
            <span className={styles.fill} />
            {box.viz.events.map((ev) => (
              <div key={ev.text} className={styles.ev}>
                <b>{ev.day}</b>
                {ev.text}
                {ev.tag ? <span className={styles.tag}>{ev.tag}</span> : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
