"use client";

import type { ElementType, ReactNode } from "react";
import { motion } from "motion/react";
import { reveal, rise } from "@/lib/motion/variants";
import { useMountedReveal } from "./useMountedReveal";

/**
 * Container für gestaffeltes Aufblenden (Variante `rise`). Staffelt seine
 * `RiseItem`-Kinder dezent nacheinander. Gleiches SSR-/Reduced-Motion-Muster wie
 * `Reveal`: Endzustand im Server-HTML, `initial` erst nach Mount, einmalig.
 *
 * Die Kinder sollen `RiseItem` sein (tragen die `reveal`-Variante), bleiben aber
 * als `children` Server-Komponenten.
 */
export function Rise({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "ul" | "ol" | "section";
  className?: string;
  children: ReactNode;
}) {
  const animate = useMountedReveal();
  const MotionTag = motion[as] as ElementType;

  return (
    <MotionTag
      className={className}
      variants={rise}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Einzelnes Kind eines `Rise`-Containers. Trägt die `reveal`-Variante und erbt
 * `initial`/`whileInView` vom Container (Staffelung) – kein eigener `viewport`.
 * Ohne umgebenden `Rise`-Container würde es dauerhaft im Endzustand stehen (die
 * Variante wird nur über den Container ausgelöst) – so bleibt es ohne JS sichtbar.
 */
export function RiseItem({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "li" | "p" | "span";
  className?: string;
  children: ReactNode;
}) {
  const MotionTag = motion[as] as ElementType;
  return (
    <MotionTag className={className} variants={reveal}>
      {children}
    </MotionTag>
  );
}
