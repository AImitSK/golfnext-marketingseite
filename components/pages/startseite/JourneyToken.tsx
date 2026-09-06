"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
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
 * echter Server-Inhalt; der Token ist nur die Bewegungs-Zutat). Die Wanderung startet
 * erst, wenn der Journey-Abschnitt **in den sichtbaren Bereich scrollt** (`useInView`,
 * einmalig) – so bleibt sie nachvollziehbar. `prefers-reduced-motion`: der Token steht
 * sofort statisch am letzten Schritt, ohne Wanderung.
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
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [mounted, setMounted] = useState(false);
  const [offsets, setOffsets] = useState<number[] | null>(null);
  const [resting, setResting] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!mounted) return;
    const measure = () => {
      const jr = ref.current?.closest<HTMLElement>("[data-journey]");
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

  // Der Token wird ab Mount gerendert (der Ref muss hängen, damit gemessen und
  // `useInView` beobachtet werden kann). Ohne JS: gar kein Token, Journey statisch.
  if (!mounted) return null;

  const ready = !!offsets && offsets.length > 0;
  const steps = offsets ?? [];
  const last = ready ? steps[steps.length - 1] : 0;
  const times = ready ? steps.map((_, i) => (steps.length === 1 ? 0 : i / (steps.length - 1))) : [];
  const staticRest = prefersReducedMotion || resting;
  const traveling = ready && !staticRest && inView;

  let animateTo: { x?: number | number[]; opacity: number };
  if (!ready) animateTo = { opacity: 0 };
  else if (staticRest) animateTo = { x: last, opacity: 1 };
  else if (inView) animateTo = { x: steps, opacity: 1 };
  else animateTo = { x: steps[0], opacity: 0 }; // gemessen, aber noch nicht im Blick: verdeckt am Start

  return (
    <motion.div
      ref={ref}
      className={className}
      aria-hidden="true"
      initial={{ x: 0, opacity: 0 }}
      animate={animateTo}
      transition={
        traveling
          ? {
              x: { duration: Math.max(2.6, steps.length * 0.85), ease: "easeInOut", times, delay: 0.3 },
              opacity: { duration: 0.4, ease: EASE, delay: 0.3 },
            }
          : staticRest
            ? { duration: 0 }
            : { duration: 0.3 }
      }
      onAnimationComplete={() => {
        if (traveling) setResting(true);
      }}
    >
      <span className={dotClassName} aria-hidden="true" />
      {label}
    </motion.div>
  );
}
