import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineArrayMember, defineField, defineType } from "sanity";
import { isUniqueSlug, isValidSlugFormat, slugify, SLUG_FORMAT_ERROR } from "./lib/slug";

/**
 * Ratgeber-Artikel. Der Dokumenttyp heißt technisch weiterhin `post`
 * (Struktur v2, Briefing 0023) – die öffentliche Adresse liegt unter
 * `/praxis`, der Studio-Bereich heißt „Ratgeber“.
 */
export const post = defineType({
  name: "post",
  title: "Ratgeber-Artikel",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: "slug",
      title: "URL-Pfad (Slug)",
      type: "slug",
      description: "Wird aus dem Titel erzeugt. Kleinbuchstaben, Ziffern, Bindestriche.",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) => slugify(input),
        isUnique: isUniqueSlug,
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value?.current) {
            return "Der Slug ist erforderlich.";
          }
          return isValidSlugFormat(value.current) || SLUG_FORMAT_ERROR;
        }),
    }),
    defineField({
      name: "excerpt",
      title: "Teaser",
      type: "text",
      rows: 3,
      description: "Dient als Anrisstext in der Artikelliste und als Meta-Description.",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "category",
      title: "Rubrik",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Veröffentlicht am",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Titelbild",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternativtext",
          type: "string",
          description:
            "Beschreibt das Bild für Screenreader und falls es nicht geladen werden kann.",
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as { asset?: { _ref?: string } } | undefined;
              if (parent?.asset?._ref && !value) {
                return "Alternativtext ist erforderlich, sobald ein Bild ausgewählt ist.";
              }
              return true;
            }),
        }),
        defineField({
          name: "caption",
          title: "Bildunterschrift",
          type: "string",
          description: "Optional, erscheint unter dem Titelbild.",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Inhalt",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "related",
      title: "Weiterführende Artikel",
      description: "Höchstens drei, ohne den Artikel selbst.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "post" }],
          options: {
            filter: ({ document }) => {
              const id = document._id.replace(/^drafts\./, "");
              return {
                filter: "_id != $publishedId && _id != $draftId",
                params: { publishedId: id, draftId: `drafts.${id}` },
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(3).unique(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "Optional. Fallback sind Titel und Teaser.",
    }),
  ],
  orderings: [
    {
      title: "Neueste zuerst",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Älteste zuerst",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      categoryTitle: "category.title",
      publishedAt: "publishedAt",
      media: "mainImage",
    },
    prepare({ title, categoryTitle, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : undefined;
      const subtitle = [categoryTitle, date].filter(Boolean).join(" · ");
      return {
        title: title ?? "(ohne Titel)",
        subtitle: subtitle || undefined,
        media,
      };
    },
  },
});
