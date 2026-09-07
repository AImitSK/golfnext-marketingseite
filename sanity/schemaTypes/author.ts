import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";
import { isUniqueSlug, isValidSlugFormat, slugify, SLUG_FORMAT_ERROR } from "./lib/slug";

/**
 * Autor eines Ratgeber-Artikels. Es werden keine Personen vorangelegt –
 * Fred legt Autorenprofile im Studio selbst an (Briefing 0026).
 */
export const author = defineType({
  name: "author",
  title: "Autor",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL-Pfad (Slug)",
      type: "slug",
      description: "Wird aus dem Namen erzeugt. Kleinbuchstaben, Ziffern, Bindestriche.",
      options: {
        source: "name",
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
      name: "role",
      title: "Rolle",
      type: "string",
      description: "Zum Beispiel: Gründer von GolfNext, PGA Golfprofessional.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Porträt",
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
      ],
    }),
    defineField({
      name: "bio",
      title: "Kurzprofil",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn-Profil",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
