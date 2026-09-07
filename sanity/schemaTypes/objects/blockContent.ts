import { LinkIcon } from "@sanity/icons/Link";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Fließtext für post.body. Enthält nur, was die Website auch rendert
 * (docs/04-sanity-content-modell.md): kein H1 (kommt aus dem Artikeltitel)
 * und keine H4–H6.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Fließtext",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Überschrift 2", value: "h2" },
        { title: "Überschrift 3", value: "h3" },
        { title: "Zitat", value: "blockquote" },
      ],
      lists: [
        { title: "Aufzählung", value: "bullet" },
        { title: "Nummerierung", value: "number" },
      ],
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
    defineArrayMember({ type: "inlineImage" }),
    defineArrayMember({ type: "callout" }),
    defineArrayMember({ type: "cta" }),
  ],
});
