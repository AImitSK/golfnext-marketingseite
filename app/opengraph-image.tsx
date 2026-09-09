import { ogBild, OG_CONTENT_TYPE, OG_GROESSE } from "@/lib/og/bild";
import { routeTitle } from "@/lib/metadata";

/**
 * OG-Bild für die Routen AUSSERHALB der Gruppe `(site)` (Masterplan 6.2,
 * Briefing 0034): die 404-Seite und `/studio`. Die Seiten der Gruppe bedient
 * `app/(site)/opengraph-image.tsx` – ein Bild in `app/` erreicht sie nicht.
 *
 * Der Titel kommt aus `config/site-structure.ts` (`/`) – dieselbe Wahrheit wie
 * `<title>` und `og:title`. Es gibt keinen zweiten, hier erfundenen Text.
 * Gezeichnet wird in `lib/og/bild.tsx`.
 */
export const size = OG_GROESSE;
export const contentType = OG_CONTENT_TYPE;
export const alt = routeTitle("/");

export default async function Bild() {
  return ogBild({ titel: routeTitle("/") });
}
