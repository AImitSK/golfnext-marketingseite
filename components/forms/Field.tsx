import { cloneElement, type ReactElement, type ReactNode } from "react";
import { FieldMessage } from "./FieldMessage";
import type { FieldState } from "./Input";
import styles from "./forms.module.css";

/** Die Props, die `Field` in das Bedienelement injiziert (Input/Select/Textarea). */
type ControlProps = {
  id?: string;
  required?: boolean;
  state?: FieldState;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

/**
 * Feld-Hülle (portiert aus 2.5-ui-kit.html .f): Label mit optionalem Pflichtstern,
 * das eigentliche Bedienelement und eine optionale `FieldMessage`.
 *
 * Verdrahtung (docs/08 §5): `Field` klont das Kind-Bedienelement und setzt darauf
 * `id` (Label `htmlFor`), `required`, `aria-invalid` (im Fehlerzustand) und
 * `aria-describedby` (auf die Meldung). Pflichtfelder tragen das native `required`
 * UND einen sichtbaren Stern. Reine Server-Komponente.
 *
 * - `state="err"` färbt Feld und Meldung als Fehler und setzt `aria-invalid`.
 * - `message` + `messageVariant` (`e|s|h`) rendern die `FieldMessage`; der Text
 *   kommt aus `lib/forms/messages.ts`.
 */
export function Field({
  id,
  label,
  required = false,
  state,
  message,
  messageVariant,
  wide = false,
  className,
  children,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  state?: FieldState;
  message?: string;
  messageVariant?: "e" | "s" | "h";
  /** Feld über die volle Breite (z. B. Textarea), wie im Mock. */
  wide?: boolean;
  className?: string;
  /** Genau ein Bedienelement (Input/Select/Textarea). */
  children: ReactElement<ControlProps>;
}) {
  const messageId = message ? `${id}-msg` : undefined;
  const classes = [styles.field, wide ? styles.wide : undefined, className]
    .filter(Boolean)
    .join(" ");

  // Das Bedienelement bekommt id/Zustand/ARIA von der Hülle – so bleibt die
  // Verdrahtung an einer Stelle und die Demo/Seite muss sie nicht wiederholen.
  const control = cloneElement(children, {
    id,
    required: required || undefined,
    state,
    "aria-invalid": state === "err" ? true : undefined,
    "aria-describedby": messageId,
  } satisfies ControlProps);

  return (
    <div className={classes}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? (
          <span className={styles.req} aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {control}
      {message && messageVariant ? (
        <FieldMessage variant={messageVariant} id={messageId}>
          {message}
        </FieldMessage>
      ) : null}
    </div>
  );
}
