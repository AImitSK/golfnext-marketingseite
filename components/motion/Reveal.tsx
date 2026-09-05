"use client";

import type { ElementType, ReactNode } from "react";
import { motion } from "motion/react";
import { reveal } from "@/lib/motion/variants";
import { useMountedReveal } from "./useMountedReveal";

/**
 * Wrapper für einmaliges Aufblenden (Variante `reveal`). Die `children` bleiben
 * Server-Komponenten (reine RSC), nur dieser Wrapper ist `'use client'`.
 *
 * Muster (Briefing 0008): Der Endzustand steht im Server-HTML; `initial="hidden"`
 * wird erst nach Mount und nur ohne reduzierte Bewegung gesetzt (siehe
 * `useMountedReveal`). Ohne JS und bei `prefers-reduced-motion` bleibt der Inhalt
 * sofort im Endzustand. Einmalig via `viewport={{ once: true, amount: .2 }}`.
 */
export function Reveal({
  as = "div",
  className,
  children,
}: {
  /** Semantisches Element (Standard `div`). */
  as?: "div" | "section" | "p" | "li" | "span";
  className?: string;
  children: ReactNode;
}) {
  const animate = useMountedReveal();
  const MotionTag = motion[as] as ElementType;

  return (
    <MotionTag
      className={className}
      variants={reveal}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </MotionTag>
  );
}
