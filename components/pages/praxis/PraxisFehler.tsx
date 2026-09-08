"use client";

import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Wrap } from "@/components/ui/Wrap";
import { uiMessages } from "@/lib/ui/messages";
import styles from "./PraxisFehler.module.css";

/**
 * Fehlergrenze der Praxis-Routen (docs/08, Briefing 0027 Aufgabe 6): ein `Alert` in
 * der Variante `err` und „Noch einmal versuchen" (`reset()`).
 *
 * Das Fehlerobjekt wird **weder angezeigt noch geloggt** – kein Stacktrace, keine
 * Technik, keine personenbezogenen Daten (CLAUDE.md, docs/08 §4). Die `error`-Prop
 * wird deshalb gar nicht erst entgegengenommen.
 *
 * Header und Footer stehen: Der Header kommt aus `app/(site)/layout.tsx` (eine
 * Fehlergrenze rendert innerhalb des Layouts ihres Segments), der Footer aus der
 * Seite darüber – hier bleibt nur der Inhaltsbereich.
 *
 * Die drei `error.tsx` der Praxis-Routen sind identisch und rufen alle diesen
 * Baustein auf; Next verlangt je Segment eine eigene Datei.
 *
 * Ein `loading.tsx` gibt es hier bewusst NICHT (Messung vom 08.09.2026, siehe
 * docs/entscheidungen.md): Eine Suspense-Grenze lässt Next die Seite streamen, und
 * ohne JavaScript bliebe dann dauerhaft das Skelett stehen statt des Inhalts. Eine
 * Fehlergrenze streamt nicht – `error.tsx` bleibt deshalb.
 */
export function PraxisFehler({ reset }: { reset: () => void }) {
  const { title, body, action } = uiMessages.error;

  return (
    <Section>
      <Wrap>
        <Alert variant="err">
          {title} {body}
        </Alert>
        <div className={styles.aktion}>
          <Button variant="ghost" type="button" onClick={reset}>
            {action}
          </Button>
        </div>
      </Wrap>
    </Section>
  );
}
