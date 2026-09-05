import type { ReactNode } from "react";
import styles from "./Faq.module.css";

/**
 * Ein Frage-Antwort-Paar des FAQ-Akkordeons (portiert aus `.faqitem/.faqq/.faqa`).
 *
 * Semantische Basis ist `<details>/<summary>` statt Button+JS (Masterplan-Vorgabe 1.6):
 * ohne JavaScript auf- und zuklappbar, der Aufklapp-Zustand kommt nativ vom `<summary>`
 * (kein manuelles `aria-expanded` nötig). `defaultOpen` rendert das Item server-seitig
 * `open`; der Plus/Minus-Marker wechselt per CSS über `[open]` (siehe Faq.module.css).
 * Reine Server-Komponente.
 */
export function FaqItem({
  question,
  answer,
  defaultOpen = false,
  children,
}: {
  question: ReactNode;
  /** Antworttext oder -markup. Alternativ als `children`. */
  answer?: ReactNode;
  defaultOpen?: boolean;
  children?: ReactNode;
}) {
  return (
    <details className={styles.item} open={defaultOpen}>
      <summary className={styles.question}>
        {question}
        {/* Marker ist rein dekorativ – Zustand liefert das <summary> nativ. */}
        <span className={styles.pm} aria-hidden="true" />
      </summary>
      <div className={styles.answer}>{answer ?? children}</div>
    </details>
  );
}
