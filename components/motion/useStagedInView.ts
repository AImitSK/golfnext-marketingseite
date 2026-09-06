"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { useMountedReveal } from "./useMountedReveal";

/**
 * „Zurücksetzen und beim Sichtbarwerden einmalig abspielen" – für sequenzierte
 * Mikro-Animationen, deren Endzustand im CSS steht (Bento-Boxen, Hero-Demo etc.).
 *
 * Muster (Briefing 0008/0015, wie `useMountedReveal`): Der Server rendert den
 * Endzustand → ohne JS bzw. bei `prefers-reduced-motion` ist sofort alles zu sehen
 * (`showStart === false`). Erst nach Mount und nur ohne reduzierte Bewegung wird der
 * Startzustand gesetzt (`showStart === true`), bis das Element einmalig in den
 * Viewport kommt – dann bleibt es dauerhaft im Endzustand. Die Übergänge liegen im
 * Modul-CSS und bewegen nur `opacity`/`transform` (kein CLS).
 *
 * Rückgabe: `ref` (auf das Container-Element setzen) und `showStart` (den vom
 * Modul-CSS definierten „Start"-Zusatz-Klassennamen nur dann anhängen).
 */
export function useStagedInView<T extends HTMLElement = HTMLDivElement>(amount = 0.3) {
  const animate = useMountedReveal();
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, showStart: animate && !inView };
}
