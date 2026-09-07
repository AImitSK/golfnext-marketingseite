"use client";

import { MeldungsSeite } from "@/components/site/PlatzhalterSeite";
import { Button } from "@/components/ui/Button";
import { uiMessages } from "@/lib/ui/messages";

/**
 * Fehlerseite der Route-Gruppe `(site)` (Masterplan 2.9, Briefing 0022). Fängt
 * Fehler beim Rendern einer Website-Seite ab – ab Phase 3 vor allem, wenn Sanity
 * nicht erreichbar ist (docs/08-zustaende-und-feedback.md, Tabelle).
 *
 * Texte wortgleich aus `uiMessages.error`; „Noch einmal versuchen" ruft `reset()`.
 *
 * Header und Footer sind da, wie docs/08 verlangt: Der Header kommt aus
 * `app/(site)/layout.tsx` – eine Fehlergrenze rendert INNERHALB des Layouts ihres
 * Segments –, den Footer bringt `MeldungsSeite` mit. Deshalb wird der Header hier
 * nicht noch einmal gerendert (anders als in `app/not-found.tsx`, das unter dem
 * Root-Layout ohne Shell läuft).
 *
 * Das Fehlerobjekt wird bewusst WEDER angezeigt NOCH geloggt: kein Stacktrace, keine
 * Technik, keine personenbezogenen Daten (CLAUDE.md, docs/08 §4). Die `error`-Prop
 * wird deshalb gar nicht erst entgegengenommen.
 */
export default function SiteError({ reset }: { reset: () => void }) {
  const { title, body, action } = uiMessages.error;

  return (
    <MeldungsSeite titel={title} body={body}>
      <Button variant="ghost" type="button" onClick={reset}>
        {action}
      </Button>
    </MeldungsSeite>
  );
}
