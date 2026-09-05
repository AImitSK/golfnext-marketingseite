import type { ReactNode } from "react";
import type { Cta } from "@/content/types";
import { resolveCta } from "@/lib/links";
import styles from "./Button.module.css";

/** Rechtsgerichteter Pfeil, fix 15 × 15 px (Grün-Regel/Icon-Regel: nie ohne Größe). */
function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type ButtonVariant = "cta" | "primary" | "ghost" | "light" | "header" | "secondaryOnDark";

const VARIANT_CLASS: Record<"cta" | "primary" | "ghost" | "light", string> = {
  cta: styles.cta,
  primary: styles.primary,
  ghost: styles.ghost,
  light: styles.light,
};

/**
 * Button-Primitive (portiert aus 2.5-ui-kit.html .btn und 2.4 .hbtn/.f-cta .b2).
 *
 * Rendert `<a>` für Navigation (mit `href` oder `cta`) und `<button type=…>` für
 * Aktionen. CTA-Ziele kommen über `resolveCta`/lib/links.ts, nie hart kodiert.
 * Reine Server-Komponente; Fokus über den globalen `:focus-visible`-Ring.
 *
 * - `variant`: cta | primary | ghost | light | header (kompakte .hbtn) | secondaryOnDark.
 * - `secondLine`: optionale zweite Zeile – eigene Zeile unter dem Label (`.col`/`.hbtn`,
 *   `small` mit `display:block`), nie Inline-Zusatz auf Grün (Grün-Regel).
 * - `size="sm"`: kompakte Variante. `arrow`: 15-px-Pfeil rechts.
 *
 * Zustände (disabled-Optik, .loading/Spinner) folgen in Schritt 1.8. Ein
 * `disabled`-Attribut wird an `<button>` durchgereicht, ohne eigene Optik.
 */
export function Button({
  variant = "cta",
  size,
  secondLine,
  arrow = false,
  href,
  cta,
  type = "button",
  disabled,
  className,
  children,
}: {
  variant?: ButtonVariant;
  size?: "sm";
  secondLine?: string;
  arrow?: boolean;
  href?: string;
  cta?: Cta;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  let base: string;
  let variantClass: string | undefined;
  if (variant === "header") {
    base = styles.hbtn;
  } else if (variant === "secondaryOnDark") {
    base = styles.secondaryOnDark;
  } else {
    base = styles.btn;
    variantClass = VARIANT_CLASS[variant];
  }

  const isButtonShape = variant !== "header" && variant !== "secondaryOnDark";
  const classes = [
    base,
    variantClass,
    // Zweite Zeile bei .btn-basierten Varianten braucht die Spalten-Ausrichtung;
    // .hbtn ist bereits column, .secondaryOnDark ist einzeilig.
    secondLine && isButtonShape ? styles.col : undefined,
    size === "sm" ? styles.sm : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children}
      {secondLine ? <span className={styles.small}>{secondLine}</span> : null}
      {arrow ? <ArrowIcon /> : null}
    </>
  );

  const resolvedHref = cta ? resolveCta(cta) : href;
  if (resolvedHref !== undefined) {
    return (
      <a href={resolvedHref} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
