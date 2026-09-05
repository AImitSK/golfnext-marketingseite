import type { ReactNode } from "react";
import { FaqItem } from "./FaqItem";
import styles from "./Faq.module.css";

/** Ein FAQ-Eintrag als Daten (Alternative zu einzelnen `FaqItem`-Kindern). */
export type FaqEntry = {
  question: ReactNode;
  answer: ReactNode;
  /** Server-seitig `open` rendern (erstes Item wie im Mock). */
  defaultOpen?: boolean;
};

/**
 * FAQ-Akkordeon (portiert aus `.faq`, Z.285–295 in 3.7-pakete.html): oberer Trenner,
 * darunter die Frage-Antwort-Paare. Nimmt entweder ein `items`-Array oder `FaqItem`-Kinder.
 *
 * Kein erzwungenes Single-Open: jedes `<details>` klappt unabhängig, mehrere dürfen offen
 * sein (der Mock erzwingt Single-Open ebenfalls nicht). Reine Server-Komponente.
 */
export function Faq({
  items,
  className,
  children,
}: {
  items?: FaqEntry[];
  className?: string;
  children?: ReactNode;
}) {
  const classes = [styles.faq, className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      {items?.map((item, i) => (
        <FaqItem
          key={i}
          question={item.question}
          answer={item.answer}
          defaultOpen={item.defaultOpen}
        />
      ))}
      {children}
    </div>
  );
}
