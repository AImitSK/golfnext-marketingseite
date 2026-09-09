import type { MetadataRoute } from "next";
import { ROUTES } from "@/config/site-structure";
import { siteUrl } from "@/lib/site-url";
import { sanityFetch } from "@/lib/sanity/client";
import { QUERY_TAGS, SITEMAP_QUERY } from "@/lib/sanity/queries";

/**
 * `sitemap.xml` (Masterplan 6.3, Briefing 0034).
 *
 * Drin steht ausschließlich, was auch in den Index gehört: jede Route mit Status
 * `live` und ohne `noindex` aus `config/site-structure.ts`, dazu die Artikel und
 * Rubriken aus Sanity. Damit fallen `/studio` und `/danke` (Status `system`),
 * `/_bausteine` (gar keine Route in site-structure) und alles unter `/api`
 * automatisch heraus – es gibt keine zweite Liste, die man vergessen könnte.
 *
 * `lastModified` steht nur dort, wo es ein belegtes Datum gibt: `_updatedAt` der
 * Sanity-Dokumente. Für die gebauten Seiten wird **kein** Datum erfunden; ein
 * täglich mitwanderndes „heute" wäre eine Angabe, die nicht stimmt.
 *
 * Ist Sanity nicht erreichbar, bleibt die Sitemap bestehen und führt nur die
 * gebauten Seiten – besser eine kurze Sitemap als gar keine.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const basis = siteUrl();

  const seiten: MetadataRoute.Sitemap = ROUTES.filter(
    (route) => route.status === "live" && route.noindex !== true,
  ).map((route) => ({
    url: new URL(route.path, basis).toString(),
  }));

  const inhalte = await sanityInhalte(basis);

  return [...seiten, ...inhalte];
}

/**
 * Die Sanity-Inhalte der Sitemap. Sie hängen am Indexierungs-Status ihrer
 * Elternroute `/praxis`: Steht die auf `noindex`, gehören weder Artikel noch
 * Rubriken in die Sitemap (Briefing 0027, Frage 2).
 */
async function sanityInhalte(basis: string): Promise<MetadataRoute.Sitemap> {
  const praxis = ROUTES.find((r) => r.path === "/praxis");
  if (!praxis || praxis.status !== "live" || praxis.noindex === true) return [];

  try {
    const daten = await sanityFetch({ query: SITEMAP_QUERY, tags: QUERY_TAGS.SITEMAP_QUERY });

    return [
      ...(daten?.artikel ?? []).map((a) => ({
        url: new URL(`/praxis/${a.slug}`, basis).toString(),
        lastModified: new Date(a._updatedAt),
      })),
      ...(daten?.rubriken ?? []).map((r) => ({
        url: new URL(`/praxis/thema/${r.slug}`, basis).toString(),
        lastModified: new Date(r._updatedAt),
      })),
    ];
  } catch {
    // Kein Logging (CLAUDE.md): keine Technik in Logs. Die Sitemap erscheint dann
    // ohne die Sanity-Inhalte, statt dass die Route einen Fehler wirft.
    return [];
  }
}
