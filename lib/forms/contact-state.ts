import type { FormMessageKey } from "./messages";
import type { FieldErrors, FieldValues } from "./schema";

/**
 * Der Zustand, den die Server Action `submitContact` zurückgibt.
 *
 * Steht bewusst NICHT in `app/actions/contact.ts`: Eine Datei mit `"use server"`
 * darf ausschließlich asynchrone Funktionen exportieren – ein Startwert als Objekt
 * bricht den Build (`A "use server" file can only export async functions`).
 *
 * Der Zustand trägt nur Meldungs-**Schlüssel**, nie fertigen Text; der Wortlaut
 * steht ausschließlich in `lib/forms/messages.ts`.
 */
export type ContactState =
  | { status: "idle" }
  | { status: "ok" }
  | {
      status: "error";
      formError: FormMessageKey;
      fieldErrors?: FieldErrors;
      /** Eingaben für das erneute Rendern – ohne JavaScript sonst alles verloren. */
      values?: FieldValues;
    };

export const initialContactState: ContactState = { status: "idle" };
