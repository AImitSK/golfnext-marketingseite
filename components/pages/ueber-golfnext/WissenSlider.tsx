"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./Wissen.module.css";

/** Ab wie vielen Pixeln Mausbewegung ein Ziehen als Ziehen gilt (und nicht als Klick). */
const ZIEH_SCHWELLE = 5;

// Layout-Effekt setzt „mounted" vor dem Paint (clientseitig), serverseitig No-op.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 6 · Wissen (Slider) – portiert aus 3.8b .know/.rail/.kcard/.rnav. Horizontaler
 * Scroll-Snap-Slider mit bis zu vier Artikelkarten, der rechts aus dem Raster
 * läuft (Bleed über `margin-right:calc(50% - 50vw)`; der umgebende Abschnitt kappt mit
 * `overflow:hidden` → kein Seiten-Overflow).
 *
 * Ohne JS: Der Rail ist nativ horizontal scroll-/wischbar – alle Karten sind erreichbar.
 * Die Pfeil-Buttons und das Maus-Ziehen sind eine Erweiterung und werden erst nach
 * Mount gerendert (kein toter Button ohne JS). Der Rail ist per Tastatur fokussier- und
 * scrollbar (`tabIndex`, role/aria-label). Reduzierte Bewegung: Blättern ohne
 * Smooth-Scroll. Kein CLS.
 *
 * Die Karten selbst kommen als `children` von außen: Sie sind seit Briefing 0029
 * echte Artikel aus Sanity und werden **serverseitig** gerendert (`WissenCard`). Der
 * Slider kennt sie nicht – er bedient nur den Rail. Jede Karte ist ein Link auf
 * `/praxis/<slug>`; ein Ziehen mit der Maus löst deshalb keinen Klick aus (siehe
 * `onClickCapture`), sonst landete jeder Wischer versehentlich in einem Artikel.
 */
export function WissenSlider({ children }: { children: ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);

  const drag = useRef({ down: false, startX: 0, startLeft: 0, strecke: 0 });

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
    drag.current = {
      down: true,
      startX: e.clientX,
      startLeft: railRef.current?.scrollLeft ?? 0,
      strecke: 0,
    };
    setDragging(true);
    railRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.down || !railRef.current) return;
    const weg = e.clientX - drag.current.startX;
    drag.current.strecke = Math.abs(weg);
    railRef.current.scrollLeft = drag.current.startLeft - weg;
  };
  const endDrag = () => {
    drag.current.down = false;
    setDragging(false);
  };

  /**
   * Ein Ziehen endet über einer Karte – und die Karte ist ein Link. Ohne diese Sperre
   * würde jeder Wischer mit der Maus als Klick gewertet und einen Artikel öffnen.
   * `ZIEH_SCHWELLE` lässt das übliche Wackeln beim Klicken durch.
   */
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.strecke > ZIEH_SCHWELLE) {
      e.preventDefault();
      e.stopPropagation();
    }
    drag.current.strecke = 0;
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
        onClickCapture={onClickCapture}
      >
        {children}
      </div>
    </div>
  );
}
