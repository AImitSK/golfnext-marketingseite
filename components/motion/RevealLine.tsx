"use client";

import { motion, type Variants } from "motion/react";
import { EASE, DURATION } from "@/lib/motion/variants";
import { useMountedReveal } from "./useMountedReveal";

const vertical: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: { scaleY: 1, opacity: 1, transition: { duration: DURATION, ease: EASE } },
};
const horizontal: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: DURATION, ease: EASE } },
};

/**
 * Zieht eine CSS-Linie (ein `<span>` mit Farbfläche) einmalig auf: vertikal von
 * oben, horizontal von links – über `scaleY`/`scaleX`, also reines `transform`
 * (kein Layout-Shift). Für die tragenden Verbindungslinien der Live-Seiten
 * (Hero-Strecke, Pakete-„Rückgrat"), die als CSS-Balken gebaut sind und nicht als
 * SVG-Pfad (dafür bleibt `Draw`).
 *
 * Gleiches SSR-/Reduced-Motion-Muster wie `Draw`/`Reveal`: der Endzustand (volle
 * Linie) steht im Server-HTML → ohne JS voll sichtbar; `initial` wird erst nach
 * Mount und nur ohne reduzierte Bewegung gesetzt, dann läuft der Aufbau einmalig.
 * Rein dekorativ (`aria-hidden`).
 */
export function RevealLine({
  className,
  orientation = "vertical",
}: {
  className?: string;
  orientation?: "vertical" | "horizontal";
}) {
  const animate = useMountedReveal();
  const isVertical = orientation === "vertical";
  const origin = isVertical ? "top center" : "left center";

  return (
    <motion.span
      className={className}
      aria-hidden="true"
      variants={isVertical ? vertical : horizontal}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, amount: 0.2 }}
      style={{ transformOrigin: origin }}
    />
  );
}
