import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

/**
 * Bild-URLs aus Sanity-Assets. Hotspot und Crop werden respektiert, sobald ein
 * Zuschnitt gesetzt ist; `auto("format")` liefert WebP/AVIF, wo der Browser es
 * unterstützt.
 *
 * Rendern erst ab Briefing 0027 – hier steht nur der Baustein.
 */
const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Gibt `null` zurück, wenn kein Asset gesetzt ist. Aufrufer entscheiden dann
 * selbst, was sie zeigen – ein leerer `<img>`-Tag entsteht so nie.
 */
export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!source) return null;
  return builder.image(source).auto("format").fit("max");
}
