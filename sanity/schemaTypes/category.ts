import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";
import { isUniqueSlug, isValidSlugFormat, slugify, SLUG_FORMAT_ERROR } from "./lib/slug";

/**
 * Ratgeber-Rubrik. Die Zielgruppen sind eine feste Auswahlliste im Feld
 * `audience` – es werden hier keine Rubrik-Dokumente vorangelegt, Fred legt
 * sie im Studio selbst an (Briefing 0026, Entscheidung Stefan 07.09.2026).
 */
export const category = defineType({
  name: "category",
  title: "Ratgeber-Rubrik",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      name: "description",
      title: "Beschreibung",
      type: "text",
      rows: 3,
      description: "Erscheint auf der Rubrikseite.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "audience",
      title: "Zielgruppe",
      type: "string",
      options: {
        list: [
          { title: "Einsteiger", value: "einsteiger" },
          { title: "Mitgliedschaft", value: "mitgliedschaft" },
          { title: "Gäste", value: "gaeste" },
          { title: "Unternehmen", value: "unternehmen" },
          { title: "Clubbetrieb", value: "clubbetrieb" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
      description: "Kleinere Zahl steht weiter vorn.",
    }),
  ],
  preview: {
    select: { title: "title", order: "order" },
    prepare({ title, order }: { title?: string; order?: number }) {
      return {
        title: title ?? "(ohne Titel)",
        subtitle: typeof order === "number" ? `Reihenfolge ${order}` : undefined,
      };
    },
  },
});
