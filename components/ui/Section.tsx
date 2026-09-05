import type { ElementType, ReactNode } from "react";
import styles from "./Section.module.css";

type SectionVariant = "paper" | "sand" | "mist";

/**
 * Sektions-Fläche (portiert aus `.psec` der Mocks). Vertikales Padding und
 * Flächenfarbe kommen aus dem Design-System; eine `<h2>` darin erhält die
 * Mock-Optik (`.psec h2`) automatisch. Reine Server-Komponente.
 */
export function Section({
  variant = "paper",
  as: As = "section",
  className,
  children,
}: {
  variant?: SectionVariant;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const variantClass =
    variant === "sand" ? styles.sand : variant === "mist" ? styles.mist : undefined;
  const classes = [styles.section, variantClass, className].filter(Boolean).join(" ");
  return <As className={classes}>{children}</As>;
}
