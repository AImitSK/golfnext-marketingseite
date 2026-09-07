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

/** Felder einer Artikelkarte – Liste, Rubrikseite, „Weitere Artikel“. */
const KARTE = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage{alt, asset->{_id, url, metadata{lqip, dimensions}}},
  category->{title, "slug": slug.current, audience},
  author->{name, "slug": slug.current}
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
 * Die Einstellungen (Singleton, feste Dokument-ID `siteSettings` – so legt die
 * Studio-Struktur sie an, siehe `sanity/structure.ts`).
 */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    phone,
    email,
    responseNote,
    bookingUrl,
    liveDemoUrl,
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
  POST_BY_SLUG_QUERY: ["post", "category", "author"],
  CATEGORIES_WITH_COUNT_QUERY: ["category", "post"],
  AUTHOR_BY_SLUG_QUERY: ["author", "post"],
  FAQS_BY_TOPIC_QUERY: ["faq"],
  SITE_SETTINGS_QUERY: ["settings"],
} as const satisfies Record<string, readonly SanityTag[]>;
