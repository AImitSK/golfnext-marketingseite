import type { TextareaHTMLAttributes } from "react";
import type { FieldState } from "./Input";
import styles from "./forms.module.css";

/**
 * Mehrzeiliges Textfeld (portiert aus 2.5-ui-kit.html textarea.inp). Natives
 * `<textarea>`, nur vertikal skalierbar; ohne JavaScript bedienbar. Fünf Zustände
 * wie `Input`. Reine Server-Komponente.
 */
const STATE_CLASS: Record<FieldState, string> = {
  err: styles.err,
  ok: styles.ok,
  focus: styles.focus,
};

export function Textarea({
  state,
  className,
  ...rest
}: { state?: FieldState } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const classes = [
    styles.control,
    styles.textarea,
    state ? STATE_CLASS[state] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <textarea className={classes} {...rest} />;
}
