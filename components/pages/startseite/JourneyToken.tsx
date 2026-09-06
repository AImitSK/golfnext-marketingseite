"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion/variants";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Wandernder „Kontakt"-Token der Journey (Choreografie aus Mock 3.1, Briefing 0015).
 * Der Token zieht **einmal** nachvollziehbar durch die vier Schritte und bleibt dann
 * am letzten Schritt stehen (Endzustand). Rein dekorativ (`aria-hidden`) und über
 * `transform: translateX` bewegt (nur Transform → kein Layout-Shift; der Token liegt
 * zudem absolut, außerhalb des Flusses).
 *
 * SSR/No-JS: Der Token wird **erst nach Mount** gerendert (vorher `null`) – ohne
 * JavaScript steht die Journey vollständig und statisch (Linie, Schritte, Bänder sind
 * echter Server-Inhalt; der Token ist nur die Bewegungs-Zutat). `prefers-reduced-
 * motion`: der Token steht sofort statisch am letzten Schritt, ohne Wanderung.
 *
 * Die Schritt-Positionen werden aus dem umgebenden `[data-journey]`-Container und
 * seinen `[data-jstep]`-Kindern gemessen (responsiv, ohne feste Pixel).
 */
export function JourneyToken({
  label,
  className,
  dotClassName,
}: {
  label: string;
  className?: string;
  dotClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [offsets, setOffsets] = useState<number[] | null>(null);
  const [resting, setResting] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!mounted) return;
    const measure = () => {
      const el = ref.current;
      const jr = el?.closest<HTMLElement>("[data-journey]");
      if (!jr) return;
      const steps = jr.querySelectorAll<HTMLElement>("[data-jstep]");
      if (steps.length === 0) {
        setOffsets(null);
        return;
      }
      const base = jr.getBoundingClientRect().left;
      setOffsets(Array.from(steps, (s) => Math.round(s.getBoundingClientRect().left - base)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mounted]);

  if (!mounted || !offsets || offsets.length === 0) return null;

  const last = offsets[offsets.length - 1];
  const times = offsets.map((_, i) => (offsets.length === 1 ? 0 : i / (offsets.length - 1)));
  const staticRest = prefersReducedMotion || resting;

  return (
    <motion.div
      ref={ref}
      className={className}
      aria-hidden="true"
      initial={staticRest ? false : { x: offsets[0], opacity: 0 }}
      animate={staticRest ? { x: last, opacity: 1 } : { x: offsets, opacity: 1 }}
      transition={
        staticRest
          ? { duration: 0 }
          : {
              x: {
                duration: Math.max(2.6, offsets.length * 0.85),
                ease: "easeInOut",
                times,
                delay: 0.5,
              },
              opacity: { duration: 0.4, ease: EASE, delay: 0.5 },
            }
      }
      onAnimationComplete={() => setResting(true)}
    >
      <span className={dotClassName} aria-hidden="true" />
      {label}
    </motion.div>
  );
}
