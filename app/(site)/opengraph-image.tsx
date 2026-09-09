import { ogBild, OG_CONTENT_TYPE, OG_GROESSE } from "@/lib/og/bild";
import { routeTitle } from "@/lib/metadata";

/**
 * OG-Bild der Startseite – und Rückfall für jede Seite der Gruppe `(site)` ohne
 * eigenes Bild (heute nur `/danke`).
 *
 * **Warum zweimal** (hier und in `app/opengraph-image.tsx`): Ein Bild in `app/`
 * erreicht die Seiten in der Route-Gruppe `(site)` nicht – gemessen am 09.09.2026,
 * `/` und `/danke` blieben ohne `og:image`. Das Bild in `app/` deckt daher die
 * Routen außerhalb der Gruppe ab (404, `/studio`), dieses die Gruppe selbst. Beide
 * zeichnen dieselbe Datei, es gibt keine zweite Vorlage.
 */
export const size = OG_GROESSE;
export const contentType = OG_CONTENT_TYPE;
export const alt = routeTitle("/");

export default async function Bild() {
  return ogBild({ titel: routeTitle("/") });
}
