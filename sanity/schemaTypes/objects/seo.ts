import { defineField, defineType } from "sanity";

/**
 * SEO-Override für einen Ratgeber-Artikel (post.seo). Ohne eigene Angabe
 * verwenden Titel-Tag und Meta-Description den Artikeltitel bzw. Teaser
 * (siehe docs/04-sanity-content-modell.md).
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  description: "Optional. Ohne Angabe verwendet die Website den Artikeltitel und den Teaser.",
  fields: [
    defineField({
      name: "title",
      title: "SEO-Titel",
      type: "string",
      description: "Fällt auf den Artikeltitel zurück, wenn Sie hier nichts eintragen.",
      validation: (Rule) => Rule.max(90).warning("Titel für Suchmaschinen möglichst kurz halten."),
    }),
    defineField({
      name: "description",
      title: "SEO-Beschreibung",
      type: "text",
      rows: 3,
      description: "Fällt auf den Teaser zurück, wenn Sie hier nichts eintragen.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "noindex",
      title: "Von Suchmaschinen ausschließen",
      type: "boolean",
      description: "Aktivieren, wenn dieser Artikel nicht in Suchmaschinen erscheinen soll.",
    }),
  ],
});
