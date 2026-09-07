/**
 * Zugangsdaten des Sanity-Projekts an einer Stelle.
 *
 * Alle drei Werte sind öffentlich (`NEXT_PUBLIC_`): Sie erlauben nur das Lesen
 * veröffentlichter Inhalte, das Dataset ist `public`. Der `SANITY_API_TOKEN`
 * steht bewusst NICHT hier – er wird erst für Entwürfe und Draft-Mode gebraucht
 * (Masterplan 3.8) und darf ausschließlich serverseitig gelesen werden.
 *
 * Die Fallbacks entsprechen `.env.example` und `docs/04-sanity-content-modell.md`.
 * Sie halten Unit-Tests und die Sanity-CLI lauffähig, ohne dass eine `.env.local`
 * geladen sein muss – genauso wie `siteUrl` in `app/layout.tsx`.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "wsj8a3ho";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
