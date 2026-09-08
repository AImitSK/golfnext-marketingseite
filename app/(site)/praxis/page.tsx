import type { Metadata } from "next";
import { Hero } from "@/components/pages/praxis/Hero";
import { ArticleListSection } from "@/components/pages/praxis/ArticleListSection";
import { Footer } from "@/components/site/Footer";
import { praxis } from "@/content/praxis";
import { seiteAusParameter, SEITEN_PARAMETER } from "@/lib/praxis/blaettern";
import { routeNoindex } from "@/lib/metadata";
import { sanityFetch } from "@/lib/sanity/client";
import {
  CATEGORIES_WITH_COUNT_QUERY,
  POSTS_QUERY,
  QUERY_TAGS,
} from "@/lib/sanity/queries";
import { uiMessages } from "@/lib/ui/messages";

/**
 * Praxis-Übersicht `/praxis` – gebaut aus Mock `3.9a-praxis-uebersicht.html`
 * (Briefing 0027, Masterplan 3.4). Ersetzt die Platzhalterseite aus Briefing 0022;
 * der Baustein `PlatzhalterSeite` bleibt, er trägt noch `app/not-found.tsx` und
 * `app/(site)/error.tsx`.
 *
 * Aufbau nach 3.9a: Hero, Filterleiste, Raster, Abschluss, Footer. **Ohne den
 * Newsletter-Block „Praxis-Post"** (Entscheidung Stefan, 07.09.2026): kein E-Mail-Feld
 * ohne Versandweg.
 *
 * Inhalte kommen ausschließlich aus Sanity – im Repo steht kein Artikeltext. Beim
 * Bauen ist das Dataset leer; dann zeigt die Seite den Leerzustand aus
 * `lib/ui/messages.ts`, nicht eine Fehlerseite und keine leere Fläche.
 *
 * Geblättert wird über `?seite=n` (serverseitig, echter Link) statt über „Ältere
 * Beiträge laden" – bewusste Abweichung vom Mock, damit die Liste ohne JavaScript
 * bedienbar bleibt (docs/03-seiten-und-routen.md, docs/entscheidungen.md).
 */
export const metadata: Metadata = {
  ...(praxis.meta.title ? { title: { absolute: praxis.meta.title } } : {}),
  ...(praxis.meta.description ? { description: praxis.meta.description } : {}),
  alternates: { canonical: praxis.route },
  // `noindex` kommt aus `config/site-structure.ts`: `/praxis` steht bis zum ersten
  // veröffentlichten Artikel auf `geplant`/`noindex` (Briefing 0027, Frage 2).
  // Fällt das Flag dort weg, indexiert die Seite – ohne Änderung an dieser Datei.
  ...(routeNoindex(praxis.route) ? { robots: { index: false, follow: false } } : {}),
};

export default async function PraxisPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const seite = seiteAusParameter(params[SEITEN_PARAMETER]);

  const [artikel, rubriken] = await Promise.all([
    sanityFetch({
      query: POSTS_QUERY,
      params: { rubrik: null },
      tags: QUERY_TAGS.POSTS_QUERY,
    }),
    sanityFetch({
      query: CATEGORIES_WITH_COUNT_QUERY,
      tags: QUERY_TAGS.CATEGORIES_WITH_COUNT_QUERY,
    }),
  ]);

  const hero = praxis.sections[0]!;

  return (
    <main>
      <Hero eyebrow={hero.eyebrow!} headline={hero.headline!} lead={hero.text![0]!} />

      <ArticleListSection
        artikel={artikel}
        rubriken={rubriken}
        aktiveRubrik={null}
        pfad={praxis.route}
        seite={seite}
        leer={{ ...uiMessages.praxis.leer, href: "/plattform" }}
      />

      <Footer footerClose={praxis.footerClose} />
    </main>
  );
}
