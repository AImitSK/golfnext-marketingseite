import { ogBild, OG_CONTENT_TYPE, OG_GROESSE } from "@/lib/og/bild";
import { routeTitle } from "@/lib/metadata";

/**
 * OG-Bild für `/praxis` (Masterplan 6.2). Der Titel kommt aus
 * `config/site-structure.ts` – dieselbe Wahrheit wie `<title>` und `og:title`.
 * Gezeichnet wird in `lib/og/bild.tsx`, hier steht nur die Route.
 */
export const size = OG_GROESSE;
export const contentType = OG_CONTENT_TYPE;
export const alt = routeTitle("/praxis");

export default async function Bild() {
  return ogBild({ titel: routeTitle("/praxis") });
}
