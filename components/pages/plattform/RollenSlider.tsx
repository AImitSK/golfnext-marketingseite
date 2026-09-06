"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { RolleCard } from "@/content/plattform";
import styles from "./Rollen.module.css";

// Wie in components/motion/useMountedReveal.ts: Layout-Effekt setzt „mounted" vor dem
// Paint (clientseitig), serverseitig No-op – ohne synchrones setState im useEffect-Body.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 3 · Rollen-Slider „Für jede Rolle im Club" (portiert aus 3.2c .roles/.rail/.rcard).
 * Horizontaler Scroll-Snap-Slider mit sechs Karten, der rechts aus dem Raster läuft
 * (Bleed über `margin-right:calc(50% - 50vw)`; der umgebende Abschnitt kappt mit
 * `overflow:hidden` → kein Seiten-Overflow).
 *
 * Ohne JS: Der Rail ist nativ horizontal scroll-/wischbar (touch, Trackpad) – die
 * Karten sind vollständig erreichbar. Die Pfeil-Buttons und das Maus-Ziehen sind
 * eine Erweiterung und werden erst nach Mount gerendert (kein toter Button ohne JS).
 * `aria-label` an den Blätter-Buttons; die Karten liegen im Tab-/Lesefluss.
 * Reduzierte Bewegung: Blättern ohne Smooth-Scroll. Kein CLS.
 *
 * Die Modul-Tags sind bloße Namens-Labels (kein Modulstatus). Der farbige Punkt
 * unterscheidet nur die Richtung (außen/innen), er ist kein Status.
 */
export function RollenSlider({ data }: { data: RolleCard[] }) {
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
    const card = railRef.current?.querySelector<HTMLElement>(`.${styles.rcard}`);
    return card ? card.getBoundingClientRect().width + 20 : 360;
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
    <div className={styles.roles}>
      {mounted ? (
        <div className={styles.rnav} aria-label="Rollen blättern">
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
        data-testid="rollen-rail"
        // Fokussierbarer Scroll-Bereich: per Tastatur (Pfeiltasten) scrollbar, auch
        // ohne JS – erfüllt „scrollable-region-focusable" (axe) und die Slider-A11y
        // aus Briefing 0016. role/aria-label geben dem Bereich einen Namen.
        tabIndex={0}
        role="group"
        aria-label="Rollen im Club – horizontal blätterbar"
        className={`${styles.rail}${dragging ? ` ${styles.drag}` : ""}`}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {data.map((r) => (
          <article key={r.name} className={`${styles.rcard} ${r.dir === "in" ? styles.in : styles.out}`}>
            <span className={styles.rt}>
              <i aria-hidden="true" />
              {r.label}
            </span>
            <h3 className={styles.rh}>{r.name}</h3>
            <div className={styles.q}>{r.question}</div>
            <p className={styles.rp}>{r.text}</p>
            <div className={styles.mods}>
              {r.mods.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
