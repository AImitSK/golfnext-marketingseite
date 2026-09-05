"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * `useLayoutEffect` läuft synchron vor dem Paint, warnt aber im SSR. Clientseitig
 * nehmen wir die Layout-Variante (setzt den Startzustand vor dem ersten Paint,
 * verhindert das Aufblitzen „Endzustand → versteckt"); serverseitig fällt sie auf
 * den No-op `useEffect` zurück.
 */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Das dokumentierte SSR-/Reduced-Motion-Muster in einem Hook (Briefing 0008):
 *
 * - Server-HTML und erster Client-Render zeigen den **Endzustand** (`animate === false`)
 *   → ohne JavaScript bleibt der Inhalt vollständig sichtbar.
 * - Erst **nach Mount** (per Layout-Effekt, vor dem Paint) und nur, wenn keine
 *   reduzierte Bewegung gewünscht ist, wird `animate === true`. Dann setzen die
 *   Wrapper `initial="hidden"` und lassen `whileInView` einmalig laufen.
 * - `prefers-reduced-motion: reduce` → `animate` bleibt `false` → sofort Endzustand,
 *   keine Übergänge.
 *
 * Rückgabe: `true`, sobald (und nur solange) animiert werden darf.
 */
export function useMountedReveal(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  return mounted && !prefersReducedMotion;
}
