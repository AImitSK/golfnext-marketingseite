import type { InputHTMLAttributes } from "react";
import styles from "./forms.module.css";

/**
 * Textfeld (portiert aus 2.5-ui-kit.html .inp). Natives `<input>`, damit es ohne
 * JavaScript bedienbar ist; alle nativen Attribute (id, name, type, placeholder,
 * value, required, aria-*) werden durchgereicht.
 *
 * Fünf Zustände: default, Fokus (nativ), `state="err"`, `state="ok"`, `disabled`
 * (natives Attribut). Reine Server-Komponente.
 */
/** Feldzustand über Klassen: `err`/`ok` semantisch, `focus` nur zur statischen
    Anzeige des Fokuszustands in der Bausteine-Vorschau (spiegelt :focus). */
export type FieldState = "err" | "ok" | "focus";

const STATE_CLASS: Record<FieldState, string> = {
  err: styles.err,
  ok: styles.ok,
  focus: styles.focus,
};

export function Input({
  state,
  className,
  ...rest
}: { state?: FieldState } & InputHTMLAttributes<HTMLInputElement>) {
  const classes = [styles.control, state ? STATE_CLASS[state] : undefined, className]
    .filter(Boolean)
    .join(" ");
  return <input className={classes} {...rest} />;
}
