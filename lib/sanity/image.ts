import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import { fixturesAktiv } from "./fixtures";

/**
 * Bild-URLs aus Sanity-Assets. Hotspot und Crop werden respektiert, sobald ein
 * Zuschnitt gesetzt ist; `auto("format")` liefert WebP/AVIF, wo der Browser es
 * unterstützt.
 *
 * Rendern erst ab Briefing 0027 – hier steht nur der Baustein.
 */
const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Test-Fetch (Playwright, siehe `lib/sanity/fixtures.ts`): Steht `SANITY_SOURCE=fixtures`,
 * zeigt jedes Bild auf eine Datei aus `public/` statt auf `cdn.sanity.io`.
 *
 * Warum: Die Testdaten tragen erfundene Asset-Kennungen. Ohne diesen Zweig liefe jedes
 * Bild in einen 404 – der Testlauf hätte Konsolenfehler, und genau darauf prüft
 * `tests/e2e/praxis.spec.ts`. Ein echtes Asset aus dem Dataset zu verwenden wäre die
 * Alternative, macht die Tests aber von Inhalten abhängig, die Fred jederzeit löschen
 * darf. Bewusst das App-Icon und **kein** Porträt: Welches Bild kommt, prüft niemand –
 * geprüft wird nur, dass überhaupt ein Bild statt der Initialen steht.
 */
const FIXTURE_BILD = "/icon-512.png";

/** Kettenbare Attrappe mit derselben Aufrufform wie der echte Builder. */
function fixtureBuilder() {
  const stub = {
    width: () => stub,
    height: () => stub,
    fit: () => stub,
    auto: () => stub,
    url: () => FIXTURE_BILD,
  };
  return stub as unknown as ReturnType<typeof builder.image>;
}

/**
 * Gibt `null` zurück, wenn kein Asset gesetzt ist. Aufrufer entscheiden dann
 * selbst, was sie zeigen – ein leerer `<img>`-Tag entsteht so nie.
 */
export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!source) return null;
  if (fixturesAktiv()) return fixtureBuilder();
  return builder.image(source).auto("format").fit("max");
}
