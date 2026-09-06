"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { DURATION, EASE } from "@/lib/motion/variants";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Zerlegt einen Kennzahl-String in Präfix, Zahl und Suffix, ohne den Wortlaut zu
 * verändern. Beispiele: „Rund 1.600" → { prefix:"Rund ", n:1600, suffix:"" },
 * „68 Prozent" → { prefix:"", n:68, suffix:" Prozent" }. Der Punkt ist deutscher
 * Tausendertrenner und wird beim Hochzählen über `toLocaleString('de-DE')` wieder
 * gesetzt – so bleibt die Beschriftung wortgleich zum freigegebenen Content.
 */
function parse(value: string): { prefix: string; target: number; suffix: string } | null {
  const match = value.match(/[\d.]+/);
  if (!match) return null;
  const target = Number(match[0].replace(/\./g, ""));
  if (!Number.isFinite(target)) return null;
  const prefix = value.slice(0, match.index);
  const suffix = value.slice(match.index! + match[0].length);
  return { prefix, target, suffix };
}

/**
 * Zählt eine echte Kennzahl einmalig beim Sichtbarwerden hoch (Briefing 0015).
 * Der **Endwert steht im Server-HTML** (Kinder `{value}`) → ohne JS und bei
 * `prefers-reduced-motion` sofort der fertige Wert, wortgleich. Nur mit JS und
 * ohne reduzierte Bewegung wird von 0 auf den Zielwert gezählt – einmal, dann
 * bleibt der Wert lesbar. Höhe/Layout ändern sich nicht (nur der Textknoten,
 * `tabular-nums` in `.n` hält die Ziffernbreite ruhig) → kein CLS.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const parsed = useMemo(() => parse(value), [value]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  // Vor dem Paint auf den Startwert (0) setzen, sobald feststeht, dass animiert
  // wird – verhindert ein kurzes Aufblitzen des Endwerts vor dem Hochzählen.
  useIsomorphicLayoutEffect(() => {
    if (!parsed || prefersReducedMotion) return;
    setDisplay(`${parsed.prefix}0${parsed.suffix}`);
  }, [parsed, prefersReducedMotion]);

  useEffect(() => {
    if (!parsed || prefersReducedMotion || !inView || started.current) return;
    started.current = true;
    const controls = animate(0, parsed.target, {
      duration: DURATION * 2.4,
      ease: EASE,
      onUpdate: (latest) => {
        const n = Math.round(latest);
        setDisplay(`${parsed.prefix}${n.toLocaleString("de-DE")}${parsed.suffix}`);
      },
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
  }, [inView, parsed, prefersReducedMotion, value]);

  return (
    <div ref={ref} className={className}>
      {display}
    </div>
  );
}
