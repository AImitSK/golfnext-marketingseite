import type { SlugIsUniqueValidator } from "sanity";

/**
 * Wandelt einen Titel in einen URL-Pfad um: Kleinbuchstaben, Umlaute zu
 * ae/oe/ue/ss, alles andere außer a-z0-9 wird zu einem Bindestrich.
 * Wird als `options.slugify` bei allen Slug-Feldern (post, category, author)
 * verwendet, damit deutsche Titel lesbare Adressen ergeben.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Prüft die Eindeutigkeit eines Slugs – **innerhalb desselben Dokumenttyps**.
 * Artikel, Rubriken und Autoren haben getrennte Adressräume (`/praxis/<slug>`,
 * `/praxis/thema/<slug>`); ein Artikel „Mitgliedschaft“ neben der Rubrik
 * „Mitgliedschaft“ ist deshalb erlaubt. Entwurfs- und veröffentlichte Fassung
 * des bearbeiteten Dokuments sind ausgenommen, sonst kollidierte es mit sich
 * selbst.
 */
export const isUniqueSlug: SlugIsUniqueValidator = async (slug, context) => {
  const { document, getClient } = context;
  if (!document?._type) return true;

  const client = getClient({ apiVersion: "2025-01-01" });
  const id = document._id.replace(/^drafts\./, "");
  const params = {
    draft: `drafts.${id}`,
    published: id,
    type: document._type,
    slug,
  };
  const query = `!defined(*[_type == $type && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;
  return client.fetch(query, params);
};

/** Erlaubt sind ausschließlich Kleinbuchstaben, Ziffern und Bindestriche (keine doppelten/rand­ständigen). */
const SLUG_FORMAT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const SLUG_FORMAT_ERROR =
  "Der Slug darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten.";

export function isValidSlugFormat(value: string): boolean {
  return SLUG_FORMAT.test(value);
}
