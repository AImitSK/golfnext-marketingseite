import type { Metadata } from "next";
import { MeldungsSeite } from "@/components/site/PlatzhalterSeite";
import { Button } from "@/components/ui/Button";
import { formMessages } from "@/lib/forms/messages";
import { routeMetadata } from "@/lib/metadata";
import { uiMessages } from "@/lib/ui/messages";

/**
 * `/danke` – die Bestätigungsseite nach einer erfolgreichen Formularanfrage
 * (Briefing 0033, Masterplan 5.4; Conversion-Definition in
 * `docs/09-tracking-plan.md`).
 *
 * **Wozu die Seite:** Google Ads und Meta brauchen für eine belastbare Conversion
 * eine eigene URL – robuster als ein reines Ereignis. Das Kontaktformular ruft sie
 * nach dem Erfolg als `/danke?quelle=kontakt` auf, aber **nur bei erteilter
 * Einwilligung**; ohne Einwilligung bleibt es beim Inline-Erfolg auf `/kontakt`
 * (docs/09). Der Parameter `quelle` wird hier nicht gelesen – er ist allein für den
 * Tag-Manager da.
 *
 * **`noindex`:** Die Seite gehört in keinen Suchindex; sie ist nur der Zielpunkt
 * eines abgeschlossenen Formulars. Der Wert kommt aus `config/site-structure.ts`
 * (Status `system`, `noindex: true`) über `routeMetadata` – nicht hier wiederholt.
 *
 * **Texte:** Es gibt für diese Seite keinen freigegebenen Seitentext. Sie besteht
 * deshalb aus dem, was schon freigegeben ist: der Erfolgsmeldung des Formulars aus
 * `lib/forms/messages.ts` (Titel, Bestätigungssatz, Folge-Link zur Terminwahl) und
 * dem Weg zurück zur Startseite aus `lib/ui/messages.ts`. Nichts erfunden, keine
 * zusätzliche Zeile (Briefing 0033, Aufgabe 5 – im PR vermerkt).
 */
export const metadata: Metadata = routeMetadata("/danke");

export default function DankePage() {
  const { title, text } = formMessages.form.success;

  return (
    <MeldungsSeite titel={title} body={text}>
      {/* „Zur Startseite" bleibt Ghost – die grüne Fläche gehört site-weit dem
          Erstgespräch-CTA im Header (Grün-Regel), wie auf 404 und Platzhalter. */}
      <Button variant="ghost" href="/">
        {uiMessages.platzhalter.actionHome}
      </Button>
    </MeldungsSeite>
  );
}
