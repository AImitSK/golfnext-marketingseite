"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { resolveCta } from "@/lib/links";
import type { WegCard } from "@/content/wachstum-vertrieb";
import styles from "./Wege.module.css";

// Layout-Effekt setzt „mounted" vor dem Paint (clientseitig), serverseitig No-op.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 3 · Vier Wege (Slider) – portiert aus 3.4b .ways/.rail/.wcard/.rnav. Horizontaler
 * Scroll-Snap-Slider mit vier Karten, der rechts aus dem Raster läuft (Bleed über
 * `margin-right:calc(50% - 50vw)`; der umgebende Abschnitt kappt mit `overflow:hidden`
 * → kein Seiten-Overflow).
 *
 * Ohne JS: Der Rail ist nativ horizontal scroll-/wischbar – alle Karten sind erreichbar.
 * Die Pfeil-Buttons und das Maus-Ziehen sind eine Erweiterung und werden erst nach
 * Mount gerendert (kein toter Button ohne JS). Der Rail ist per Tastatur fokussier- und
 * scrollbar (`tabIndex`, role/aria-label). Reduzierte Bewegung: Blättern ohne
 * Smooth-Scroll. Kein CLS.
 *
 * Die Modul-Tags sind bloße Namens-Labels (kein Modulstatus).
 */
export function WegeSlider({ data }: { data: WegCard[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);

  const drag = useRef({ down: false, startX: 0, startLeft: 0 });

  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 4);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
  }, []);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) update();
  }, [mounted, update]);

  const cardWidth = () => {
    const card = railRef.current?.querySelector<HTMLElement>(`.${styles.wcard}`);
    return card ? card.getBoundingClientRect().width + 22 : 462;
  };
  const page = (dir: -1 | 1) => {
    railRef.current?.scrollBy({
      left: dir * cardWidth(),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  // Maus-Ziehen (nur Maus; Touch scrollt nativ).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { down: true, startX: e.clientX, startLeft: railRef.current?.scrollLeft ?? 0 };
    setDragging(true);
    railRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.down || !railRef.current) return;
    railRef.current.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };
  const endDrag = () => {
    drag.current.down = false;
    setDragging(false);
  };

  return (
    <div className={styles.ways}>
      {mounted ? (
        <div className={styles.rnav} aria-label="Wege blättern">
          <button type="button" aria-label="Zurück" disabled={atStart} onClick={() => page(-1)}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" aria-label="Weiter" disabled={atEnd} onClick={() => page(1)}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      ) : null}

      <div
        ref={railRef}
        data-testid="wege-rail"
        tabIndex={0}
        role="group"
        aria-label="Vier Wege zum Wachstum – horizontal blätterbar"
        className={`${styles.rail}${dragging ? ` ${styles.drag}` : ""}`}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {data.map((w) => (
          <article key={w.title} className={styles.wcard}>
            <div className={styles.wv} aria-hidden="true">
              <div className={styles.mini}>
                <div className={styles.mb}>
                  <i />
                  <i />
                  <i />
                  <span>{w.miniUrl}</span>
                </div>
                <div className={styles.mh}>
                  <div>
                    <b>{w.miniTitle}</b>
                    <i />
                    <i style={{ width: "70%" }} />
                    <span className={styles.miniBtn}>{w.miniButton}</span>
                  </div>
                  <div className={styles.pic} />
                </div>
              </div>
            </div>
            <div className={styles.wb}>
              <span className={styles.wt}>
                <i aria-hidden="true" />
                {w.tag}
              </span>
              <h3 className={styles.wh}>{w.title}</h3>
              <p className={styles.wp}>{w.text}</p>
              <div className={styles.goal}>
                Ziel: <b>{w.goal}</b>
              </div>
              <div className={styles.mods}>
                {w.mods.map((m) => (
                  <span key={m}>{m}</span>
                ))}
                <a className={styles.tlink} href={resolveCta(w.cta)}>
                  {w.cta.label}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
