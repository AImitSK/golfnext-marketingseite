import { LinkIcon } from "@sanity/icons/Link";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Reduzierter Portable Text für faq.answer und callout.text: nur Absätze,
 * keine Überschriften, keine Bilder – Antworten und Hinweise bleiben kurz.
 */
export const simpleBlockContent = defineType({
  name: "simpleBlockContent",
  title: "Einfacher Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Fett", value: "strong" },
          { title: "Kursiv", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            icon: LinkIcon,
            fields: [
              defineField({
                name: "href",
                title: "Adresse",
                type: "url",
                description:
                  "Externe Adresse (https://…) oder ein Pfad auf dieser Website (z. B. /pakete).",
                validation: (Rule) =>
                  Rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
              defineField({
                name: "openInNewTab",
                title: "In neuem Tab öffnen",
                type: "boolean",
              }),
            ],
          }),
        ],
      },
    }),
  ],
});
