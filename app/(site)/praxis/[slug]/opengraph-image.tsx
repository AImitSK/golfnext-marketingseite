import { notFound } from "next/navigation";
import { ogBild, OG_CONTENT_TYPE, OG_GROESSE } from "@/lib/og/bild";
import { sanityFetch } from "@/lib/sanity/client";
import { POST_BY_SLUG_QUERY, QUERY_TAGS } from "@/lib/sanity/queries";

/**
 * OG-Bild eines Praxis-Artikels (Masterplan 6.2): Artikeltitel statt Seitentitel,
 * darüber die Rubrik. Beides kommt aus Sanity – im Repo steht kein Artikeltext.
 *
 * Gibt es den Artikel nicht, gibt es auch kein Bild (404). Das Elternbild von
 * `/praxis` springt dann nicht ein: Eine gelöschte Adresse soll in keinem geteilten
 * Link so aussehen, als gäbe es sie noch.
 */
export const size = OG_GROESSE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "GolfNext Praxis";

export default async function Bild({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artikel = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
    tags: QUERY_TAGS.POST_BY_SLUG_QUERY,
  });
  if (!artikel) notFound();

  return ogBild({ titel: artikel.title, eyebrow: artikel.category.title });
}
