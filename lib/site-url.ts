/**
 * Die öffentliche Adresse der Website – eine Wahrheit für `metadataBase`, die
 * Sitemap, `robots.txt` und die Domain im OG-Bild.
 *
 * Quelle ist `NEXT_PUBLIC_SITE_URL`. Der Rückfall ist die Produktionsadresse aus
 * `.env.example`; ohne ihn stünden in einer lokal gebauten Sitemap relative Adressen,
 * und `new URL()` würde werfen.
 */
export const SITE_URL_FALLBACK = "https://www.golfnext.de";

export function siteUrl(): string {
  const roh = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!roh) return SITE_URL_FALLBACK;

  try {
    // Ohne abschließenden Schrägstrich, damit `new URL(pfad, basis)` überall
    // dasselbe Ergebnis liefert.
    return new URL(roh).origin;
  } catch {
    return SITE_URL_FALLBACK;
  }
}
