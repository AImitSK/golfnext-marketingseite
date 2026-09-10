import { defineQuery } from "next-sanity";
import type { SanityTag } from "@/lib/sanity/client";

/**
 * Alle GROQ-Abfragen der Website an einer Stelle (Masterplan 3.3).
 *
 * Sie sind bereits vollständig, obwohl noch niemand sie rendert: Die
 * öffentlichen Seiten (`/praxis`, `/praxis/[slug]`, Rubrikseiten) entstehen erst
 * mit Briefing 0027. `defineQuery` sorgt dafür, dass `pnpm sanity:typegen` für
 * jede Abfrage einen Ergebnistyp in `sanity.types.ts` erzeugt.
 *
 * Namensregel: Jeder Abfrage-Name ist projektweit eindeutig – gleiche Namen
 * überschreiben sich in der Typerzeugung stillschweigend.
 */

/**
 * Felder einer Artikelkarte – Liste, Rubrikseite, „Weitere Artikel“.
 *
 * Das Autorenbild kommt mit (Briefing 0027, Nachbesserung 08.09.2026): Ohne es zeigte
 * die Meta-Zeile jeder Karte den Initialenkreis, obwohl im Studio ein Porträt liegt.
 * `dimensions` braucht es hier nicht – der Avatar ist quadratisch und fest 26 px.
 */
const KARTE = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage{alt, asset->{_id, url, metadata{lqip, dimensions}}},
  category->{title, "slug": slug.current, audience},
  author->{name, "slug": slug.current, image{alt, asset->{_id, url, metadata{lqip}}}}
`;

/**
 * Artikelliste, neueste zuerst. `$rubrik` ist der Slug einer Rubrik oder `null`
 * (dann kommt alles) – der Filter auf `/praxis` läuft serverseitig über den
 * Suchparameter `?rubrik=…`, es braucht keine Filterlogik im Browser.
 */
export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && (!defined($rubrik) || category->slug.current == $rubrik)]
    | order(publishedAt desc) {${KARTE}}
`);

/**
 * Die `$anzahl` neuesten Artikel, quer über alle Rubriken – für die Teaser auf der
 * Startseite (drei) und im Wissen-Slider auf `/ueber-golfnext` (vier), Briefing 0029.
 *
 * Bewusst eine eigene Abfrage statt `POSTS_QUERY` mit anschließendem Beschneiden im
 * Code: Das Limit steht in GROQ, es wandern also nur die Karten über die Leitung, die
 * auch gezeigt werden. **Kein Rubrik-Filter** – welche Artikel oben stehen, steuert
 * Fred über `publishedAt` im Studio, nicht der Code (Entscheidung Stefan, 08.09.2026).
 */
export const NEUESTE_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc) [0...$anzahl] {${KARTE}}
`);

/** Ein Artikel samt Rubrik, Autor, Fließtext und bis zu drei Empfehlungen. */
export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    body,
    mainImage{alt, caption, asset->{_id, url, metadata{lqip, dimensions}}},
    category->{title, "slug": slug.current, description, audience},
    author->{
      name,
      "slug": slug.current,
      role,
      bio,
      linkedin,
      image{alt, asset->{_id, url, metadata{lqip, dimensions}}}
    },
    related[]->{${KARTE}},
    seo{title, description, noindex}
  }
`);

/** Alle Rubriken mit der Anzahl veröffentlichter Artikel – für Filter und Übersicht. */
export const CATEGORIES_WITH_COUNT_QUERY = defineQuery(`
  *[_type == "category"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    audience,
    order,
    "anzahl": count(*[_type == "post" && defined(slug.current) && references(^._id)])
  }
`);

/** Ein Autor mit seinen Artikeln – für die Autorenbox und eine spätere Autorenseite. */
export const AUTHOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "author" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    role,
    bio,
    linkedin,
    image{alt, asset->{_id, url, metadata{lqip, dimensions}}},
    "artikel": *[_type == "post" && author._ref == ^._id && defined(slug.current)]
      | order(publishedAt desc) {${KARTE}}
  }
`);

/** FAQs eines Themas in der von Fred gesetzten Reihenfolge. */
export const FAQS_BY_TOPIC_QUERY = defineQuery(`
  *[_type == "faq" && topic == $topic] | order(order asc, question asc) {
    _id,
    question,
    answer,
    topic,
    order
  }
`);

/**
 * Slug und Änderungsdatum aller Artikel und Rubriken – für `app/sitemap.ts`
 * (Masterplan 6.3). Bewusst schmal: Die Sitemap braucht nur die Adresse und
 * `lastModified`; Titel, Anriss und Bilder wandern hier nicht über die Leitung.
 */
export const SITEMAP_QUERY = defineQuery(`{
  "artikel": *[_type == "post" && defined(slug.current)]{"slug": slug.current, _updatedAt},
  "rubriken": *[_type == "category" && defined(slug.current)]{"slug": slug.current, _updatedAt}
}`);

/**
 * Die Einstellungen (Singleton, feste Dokument-ID `siteSettings` – so legt die
 * Studio-Struktur sie an, siehe `sanity/structure.ts`).
 */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    phone,
    email,
    responseNote,
    linkedin,
    instagram,
    defaultSeo{title, description, ogImage{alt, asset->{_id, url}}}
  }
`);

/**
 * Welche Cache-Marken zu welcher Abfrage gehören. Eine Abfrage, die Rubrik und
 * Autor mitzieht, muss auch auf deren Änderungen reagieren – sonst steht nach
 * einer Umbenennung der alte Name in der Liste.
 */
export const QUERY_TAGS = {
  POSTS_QUERY: ["post", "category", "author"],
  NEUESTE_POSTS_QUERY: ["post", "category", "author"],
  POST_BY_SLUG_QUERY: ["post", "category", "author"],
  CATEGORIES_WITH_COUNT_QUERY: ["category", "post"],
  AUTHOR_BY_SLUG_QUERY: ["author", "post"],
  FAQS_BY_TOPIC_QUERY: ["faq"],
  SITEMAP_QUERY: ["post", "category"],
  SITE_SETTINGS_QUERY: ["settings"],
} as const satisfies Record<string, readonly SanityTag[]>;
