import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";

/**
 * Site-Einstellungen (Kontakt, Links, Default-SEO). Singleton: Studio-Struktur
 * erzwingt genau ein Dokument ohne „Neu anlegen" (baut der Haupt-Chat in
 * sanity/structure.ts). Nur `phone` und `email` sind Pflicht – die übrigen
 * Adressen stehen noch nicht fest und werden nicht erfunden.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Einstellungen",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-Mail-Adresse",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "responseNote",
      title: "Rückmeldehinweis",
      type: "string",
      description: "Zum Beispiel ein Hinweis zur üblichen Reaktionszeit.",
    }),
    defineField({
      name: "bookingUrl",
      title: "Buchungslink (Online-Erstgespräch)",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn-Profil",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "instagram",
      title: "Instagram-Profil",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "defaultSeo",
      title: "Standard-SEO",
      type: "object",
      description: "Fallback für Seiten ohne eigene SEO-Angaben.",
      fields: [
        defineField({
          name: "title",
          title: "SEO-Titel",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "SEO-Beschreibung",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: "ogImage",
          title: "Vorschaubild (Social Media)",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternativtext",
              type: "string",
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
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Einstellungen" };
    },
  },
});
