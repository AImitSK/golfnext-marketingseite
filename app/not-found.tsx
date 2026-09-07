import { MeldungsSeite } from "@/components/site/PlatzhalterSeite";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/config/site-structure";
import type { Cta } from "@/content/types";
import { uiMessages } from "@/lib/ui/messages";

/**
 * 404 – Seite nicht gefunden (Masterplan 2.9, Briefing 0022). Texte wortgleich aus
 * `uiMessages.notFound`; zwei Aktionen wie in `docs/08-zustaende-und-feedback.md`
 * gefordert: zurück zur Startseite und das Erstgespräch.
 *
 * Diese Datei liegt bewusst im Wurzelverzeichnis und fängt damit JEDE nicht
 * getroffene URL ab. Bei einer unbekannten URL rendert sie unter `app/layout.tsx`,
 * NICHT unter `app/(site)/layout.tsx` – die Shell fehlt dort. Der Header wird deshalb
 * in der Seite selbst gerendert (den Footer bringt `MeldungsSeite` mit), so verlangt
 * es docs/08 („error.tsx und not-found.tsx rendern Header und Footer").
 *
 * Zweiter Fall: `notFound()` aus einer Segment-Route. Next 16 rendert dafür ebenfalls
 * diese Wurzel-404 – ein `not-found.tsx` in `(site)` oder im Slug-Segment wird nicht
 * herangezogen (nachgemessen, Briefing 0022) –, dann aber INNERHALB der Shell, deren
 * Header schon steht. Für diesen Fall trägt der Header hier `fallback`:
 * `app/globals.css` blendet ihn aus, wenn ihm bereits ein Header vorausgeht. So bleibt
 * es in beiden Fällen bei genau einer Kopfzeile.
 *
 * Dieser zweite Fall tritt seit Briefing 0023 nirgends mehr auf: `/module/[slug]` war
 * die einzige Route der Shell mit `notFound()` und ist gelöscht. Er kommt in Phase 3
 * mit `/praxis/[slug]` zurück – zusammen mit dem offenen Punkt, dass die Seite in
 * dieser Variante ohne JavaScript leer bleibt (docs/entscheidungen.md).
 *
 * Der Statuscode 404 kommt von Next selbst.
 */
export default function NotFound() {
  const { title, body, actionHome, actionContact } = uiMessages.notFound;

  // CTA-Ziel nie hart kodiert: Label aus site-structure, URL über resolveCta/bookingUrl.
  const cta: Cta = {
    label: actionContact,
    hint: CTA.erstgespraech.hint,
    target: "erstgespraech",
  };

  return (
    <>
      <Header fallback />
      {/* Ohne Eyebrow: `uiMessages.notFound` hat keinen, und es wird keiner erfunden. */}
      <MeldungsSeite titel={title} body={body}>
        <Button variant="ghost" href="/">
          {actionHome}
        </Button>
        <Button variant="cta" cta={cta}>
          {actionContact}
        </Button>
      </MeldungsSeite>
    </>
  );
}
