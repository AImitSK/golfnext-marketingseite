"use client";

import { motion } from "motion/react";
import { draw } from "@/lib/motion/variants";
import { useMountedReveal } from "./useMountedReveal";
import styles from "./Draw.module.css";

/**
 * Zeichnet eine einfache dekorative Linie (Variante `draw`, `pathLength`+`scaleX`
 * von links). Gleiches SSR-/Reduced-Motion-Muster: ohne JS bzw. bei reduzierter
 * Bewegung steht die Linie sofort vollständig, mit JS wird sie einmalig gezogen.
 *
 * Rein dekorativ (`aria-hidden`). Die Höhe ist über `viewBox`/CSS reserviert –
 * kein Layout-Shift. `transform-origin` links, damit `scaleX` von links wächst.
 */
export function Draw({
  className,
  label,
}: {
  className?: string;
  /** Optionales Zugänglichkeits-Label; ohne bleibt die Linie `aria-hidden`. */
  label?: string;
}) {
  const animate = useMountedReveal();

  return (
    <svg
      className={[styles.svg, className].filter(Boolean).join(" ")}
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      /* Bewusste dekorative Grafik (keine Ikone): darf breiter als 90 px sein –
         vom Icon-Guard ausgenommen wie die Wortmarke. */
      data-large-svg
    >
      <motion.line
        x1="1"
        y1="4"
        x2="199"
        y2="4"
        stroke="var(--gn-signal)"
        strokeWidth="4"
        strokeLinecap="round"
        variants={draw}
        initial={animate ? "hidden" : false}
        whileInView={animate ? "visible" : undefined}
        viewport={{ once: true, amount: 0.2 }}
        style={{ transformOrigin: "left center" }}
      />
    </svg>
  );
}
