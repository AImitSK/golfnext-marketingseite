import type { ReactNode } from "react";
import styles from "./Wrap.module.css";

/**
 * Zentrierter Inhaltsrahmen (portiert aus `.pwrap`): max. 1140 px mit
 * responsivem Gutter (40 → 26 ≤960 px → 20 ≤620 px). Reine Server-Komponente.
 */
export function Wrap({ className, children }: { className?: string; children: ReactNode }) {
  const classes = [styles.wrap, className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}
