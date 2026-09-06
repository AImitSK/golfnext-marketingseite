"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { WissenCard } from "@/content/ueber-golfnext";
import styles from "./Wissen.module.css";

// Layout-Effekt setzt „mounted" vor dem Paint (clientseitig), serverseitig No-op.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 6 · Wissen (Slider) – portiert aus 3.8b .know/.rail/.kcard/.rnav. Horizontaler
 * Scroll-Snap-Slider mit vier Artikel-Platzhalterkarten, der rechts aus dem Raster
 * läuft (Bleed über `margin-right:calc(50% - 50vw)`; der umgebende Abschnitt kappt mit
 * `overflow:hidden` → kein Seiten-Overflow).
 *
 * Ohne JS: Der Rail ist nativ horizontal scroll-/wischbar – alle Karten sind erreichbar.
 * Die Pfeil-Buttons und das Maus-Ziehen sind eine Erweiterung und werden erst nach
 * Mount gerendert (kein toter Button ohne JS). Der Rail ist per Tastatur fokussier- und
 * scrollbar (`tabIndex`, role/aria-label). Reduzierte Bewegung: Blättern ohne
 * Smooth-Scroll. Kein CLS.
 *
 * Die Karten sind beschriftete Platzhalter („Bild folgt“, „Titel folgt: …“, „Lesezeit
 * folgt“) – kein Stock/KI-Bild, keine erfundenen Titel. Fred liefert Titel/Bilder.
 */
export function WissenSlider({ data }: { data: WissenCard[] }) {
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
    const card = railRef.current?.querySelector<HTMLElement>(`.${styles.kcard}`);
    return card ? card.getBoundingClientRect().width + 22 : 402;
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
    <div className={styles.know}>
      {mounted ? (
        <div className={styles.rnav} aria-label="Artikel blättern">
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
        data-testid="wissen-rail"
        tabIndex={0}
        role="group"
        aria-label="Artikel – horizontal blätterbar"
        className={`${styles.rail}${dragging ? ` ${styles.drag}` : ""}`}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {data.map((c) => (
          <article key={c.titel} className={styles.kcard}>
            <div className={styles.kp} aria-hidden="true">
              <span>{c.bild}</span>
            </div>
            <div className={styles.kb}>
              <div className={styles.kt}>{c.quelle}</div>
              <b>{c.titel}</b>
              <p>{c.text}</p>
              <div className={styles.km}>
                <span>{c.autor}</span>
                <span>{c.lesezeit}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
