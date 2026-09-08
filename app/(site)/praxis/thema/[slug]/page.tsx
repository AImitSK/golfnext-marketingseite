import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleListSection } from "@/components/pages/praxis/ArticleListSection";
import { Hero } from "@/components/pages/praxis/Hero";
import { Footer } from "@/components/site/Footer";
import { praxis } from "@/content/praxis";
import { seiteAusParameter, SEITEN_PARAMETER } from "@/lib/praxis/blaettern";
import { sanityFetch } from "@/lib/sanity/client";
import { CATEGORIES_WITH_COUNT_QUERY, POSTS_QUERY, QUERY_TAGS } from "@/lib/sanity/queries";
import { uiMessages } from "@/lib/ui/messages";

/**
 * Rubrikseite `/praxis/thema/<slug>` (Briefing 0027, Aufgabe 4). Dieselbe Schale wie
 * die Übersicht, nur mit dem Rubriktitel als `<h1>` und der Rubrikbeschreibung als
 * Lead; die Filterleiste markiert den aktiven Chip.
 *
 * Der Themenfilter läuft über diese Adressen statt über `?rubrik=` (docs/04) – zwei
 * Wege auf dieselbe Liste wären doppelter Inhalt, und ein Link ist ohne JavaScript
 * bedienbar.
 *
 * **Unbekannter Rubrik-Slug:** Den fängt `proxy.ts` ab und schreibt ihn auf einen
 * Pfad ohne Route um – dann greift Nexts eigener 404 mit vollem Inhalt im HTML
 * (Briefing 0027 Aufgabe 0, gemessen, siehe docs/entscheidungen.md). Das `notFound()`
 * hier ist das Netz darunter: Es greift, wenn Sanity beim Proxy gerade nicht
 * erreichbar war oder die Rubrik zwischen beiden Abfragen verschwindet.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rubriken = await sanityFetch({
    query: CATEGORIES_WITH_COUNT_QUERY,
    tags: QUERY_TAGS.CATEGORIES_WITH_COUNT_QUERY,
  });
  const rubrik = rubriken.find((r) => r.slug === slug);
  if (!rubrik) return { robots: { index: false, follow: false } };

  return {
    title: { absolute: rubrik.title },
    description: rubrik.description,
    alternates: { canonical: `/praxis/thema/${rubrik.slug}` },
    // Solange `/praxis` auf `geplant`/`noindex` steht, gilt das auch für die Rubriken
    // (config/site-structure.ts, Briefing 0027 Frage 2).
    robots: { index: false, follow: false },
  };
}

export default async function RubrikPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, suche] = await Promise.all([params, searchParams]);
  const seite = seiteAusParameter(suche[SEITEN_PARAMETER]);

  const [artikel, rubriken] = await Promise.all([
    sanityFetch({ query: POSTS_QUERY, params: { rubrik: slug }, tags: QUERY_TAGS.POSTS_QUERY }),
    sanityFetch({
      query: CATEGORIES_WITH_COUNT_QUERY,
      tags: QUERY_TAGS.CATEGORIES_WITH_COUNT_QUERY,
    }),
  ]);

  const rubrik = rubriken.find((r) => r.slug === slug);
  if (!rubrik) notFound();

  const hero = praxis.sections[0]!;

  return (
    <main>
      <Hero eyebrow={hero.eyebrow!} headline={rubrik.title} lead={rubrik.description} />

      <ArticleListSection
        artikel={artikel}
        rubriken={rubriken}
        aktiveRubrik={rubrik.slug}
        pfad={`/praxis/thema/${rubrik.slug}`}
        seite={seite}
        leer={{ ...uiMessages.praxis.leerRubrik, href: "/praxis" }}
      />

      <Footer footerClose={praxis.footerClose} />
    </main>
  );
}
