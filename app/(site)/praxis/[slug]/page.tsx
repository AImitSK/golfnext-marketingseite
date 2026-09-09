import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleAside, hatSeitenspalte } from "@/components/pages/praxis/ArticleAside";
import { ArticleHead } from "@/components/pages/praxis/ArticleHead";
import { AuthorBox } from "@/components/pages/praxis/AuthorBox";
import { PortableTextRenderer } from "@/components/pages/praxis/PortableTextRenderer";
import { Related } from "@/components/pages/praxis/Related";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { Wrap } from "@/components/ui/Wrap";
import { praxis } from "@/content/praxis";
import { lesezeitMinuten } from "@/lib/praxis/lesezeit";
import { tocAusBody } from "@/lib/praxis/toc";
import { inhaltMetadata, routeNoindex } from "@/lib/metadata";
import { sanityFetch } from "@/lib/sanity/client";
import { POST_BY_SLUG_QUERY, POSTS_QUERY, QUERY_TAGS } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import { articleJsonLd, breadcrumbJsonLd, routeLabel } from "@/lib/seo/jsonld";
import styles from "@/components/pages/praxis/Artikel.module.css";

/**
 * Artikelseite `/praxis/<slug>` – gebaut aus Mock `3.9b-praxis-artikel.html`
 * (Briefing 0027, Aufgabe 5).
 *
 * Aufbau von oben nach unten: Brotkrumen, Rubrik-Chip, die einzige `<h1>`, Anriss als
 * Lead, Autorenzeile, Titelbild, Fließtext (max 70ch) mit klebender Seitenspalte,
 * Autorenbox, „Weiterlesen / Passt dazu" und der Abschluss zum Erstgespräch.
 * **Kein Newsletter, keine Schlagwortzeile, kein Lesefortschrittsbalken.**
 *
 * **Unbekannter Slug** (gelöschter Artikel, Tippfehler, alter Link, Crawler):
 * `proxy.ts` schreibt die Adresse auf einen Pfad ohne Route um, damit Nexts eigener
 * 404 greift – der einzige Weg, der Status 404 **und** vollständiges Server-HTML
 * liefert (gemessen, Briefing 0027 Aufgabe 0, docs/entscheidungen.md). Das
 * `notFound()` hier ist das Netz darunter: Es greift, wenn Sanity beim Proxy gerade
 * nicht erreichbar war oder der Artikel zwischen beiden Abfragen verschwindet – dann
 * stimmt wenigstens der Statuscode.
 *
 * Die Lesezeit wird aus dem Fließtext **berechnet** (`lib/praxis/lesezeit.ts`), sie
 * ist kein Schemafeld und keine erfundene Zahl.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artikel = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
    tags: QUERY_TAGS.POST_BY_SLUG_QUERY,
  });
  if (!artikel) return { robots: { index: false, follow: false } };

  return inhaltMetadata({
    titel: artikel.seo?.title ?? artikel.title,
    description: artikel.seo?.description ?? artikel.excerpt,
    pfad: `/praxis/${artikel.slug}`,
    typ: "article",
    // Zwei Gründe, einen Artikel auszuschließen: die Elternroute steht noch nicht live
    // (`config/site-structure.ts`, Briefing 0027 Frage 2) – oder die Redaktion hat für
    // diesen Artikel `seo.noindex` gesetzt. Sobald `/praxis` live geht, greift also
    // weiterhin die Einzelentscheidung aus dem Studio.
    noindex: routeNoindex("/praxis") || artikel.seo?.noindex === true,
  });
}

export default async function ArtikelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const artikel = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
    tags: QUERY_TAGS.POST_BY_SLUG_QUERY,
  });
  if (!artikel) notFound();

  const lesezeit = lesezeitMinuten(artikel.body);
  const toc = tocAusBody(artikel.body);
  // Ohne Inhaltsverzeichnis gibt es keine Seitenspalte – dann setzt der Text einspaltig
  // über die volle Breite, statt eine leere 300-px-Spalte offen zu lassen.
  const mitSpalte = hatSeitenspalte(toc);

  // Sind keine Empfehlungen gepflegt, kommen bis zu drei weitere aus derselben Rubrik
  // (ohne den aktuellen Artikel). Gibt es auch die nicht, entfällt der Block.
  const gepflegt = artikel.related ?? [];
  const weiterlesen =
    gepflegt.length > 0
      ? gepflegt
      : (
          await sanityFetch({
            query: POSTS_QUERY,
            params: { rubrik: artikel.category.slug },
            tags: QUERY_TAGS.POSTS_QUERY,
          })
        )
          .filter((a) => a.slug !== artikel.slug)
          .slice(0, 3);

  // `Article` und `BreadcrumbList` (Masterplan 6.4). Jedes Feld hat eine Quelle im
  // Sanity-Dokument; `image` steht nur, wenn es ein Titelbild gibt – ein
  // beschrifteter Platzhalter ist kein Artikelbild.
  const bild = urlForImage(artikel.mainImage)?.width(1200).url() ?? null;

  return (
    <main>
      <JsonLd
        daten={articleJsonLd({
          titel: artikel.title,
          beschreibung: artikel.excerpt,
          pfad: `/praxis/${artikel.slug}`,
          veroeffentlicht: artikel.publishedAt,
          autor: artikel.author?.name,
          bildUrl: bild,
        })}
      />
      <JsonLd
        daten={breadcrumbJsonLd([
          { name: routeLabel("/"), pfad: "/" },
          { name: routeLabel("/praxis"), pfad: "/praxis" },
          { name: artikel.category.title, pfad: `/praxis/thema/${artikel.category.slug}` },
          { name: artikel.title, pfad: `/praxis/${artikel.slug}` },
        ])}
      />

      <ArticleHead artikel={artikel} lesezeit={lesezeit} />

      <Wrap className={mitSpalte ? styles.art : `${styles.art} ${styles.artOhneSpalte}`}>
        <article>
          <PortableTextRenderer body={artikel.body} />
          <AuthorBox autor={artikel.author} />
        </article>

        <ArticleAside eintraege={toc} />
      </Wrap>

      <Related artikel={weiterlesen} />

      <Footer footerClose={praxis.footerClose} />
    </main>
  );
}
