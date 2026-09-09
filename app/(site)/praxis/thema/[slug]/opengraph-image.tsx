import { notFound } from "next/navigation";
import { ogBild, OG_CONTENT_TYPE, OG_GROESSE } from "@/lib/og/bild";
import { sanityFetch } from "@/lib/sanity/client";
import { CATEGORIES_WITH_COUNT_QUERY, QUERY_TAGS } from "@/lib/sanity/queries";

/**
 * OG-Bild einer Rubrikseite (Masterplan 6.2): der Rubriktitel, darüber „Praxis" als
 * Herkunft. Beides kommt aus Sanity bzw. aus dem Menü-Label der Elternroute.
 */
export const size = OG_GROESSE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "GolfNext Praxis";

export default async function Bild({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rubriken = await sanityFetch({
    query: CATEGORIES_WITH_COUNT_QUERY,
    tags: QUERY_TAGS.CATEGORIES_WITH_COUNT_QUERY,
  });
  const rubrik = rubriken.find((r) => r.slug === slug);
  if (!rubrik) notFound();

  return ogBild({ titel: rubrik.title, eyebrow: "Praxis" });
}
