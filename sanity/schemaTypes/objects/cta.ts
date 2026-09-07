import { LaunchIcon } from "@sanity/icons/Launch";
import { defineField, defineType } from "sanity";

/** Feste Zielauswahl für den Button – „Eigene Adresse“ schaltet das URL-Feld frei. */
const TARGET_OPTIONS = [
  { title: "Online-Erstgespräch", value: "erstgespraech" },
  { title: "Live-Demo", value: "livedemo" },
  { title: "Pakete", value: "pakete" },
  { title: "Eigene Adresse", value: "url" },
];

/**
 * Call-to-Action-Button im Fließtext (post.body). Bei den festen Zielen
 * entscheidet die Website selbst, wohin der Button führt; nur bei
 * „Eigene Adresse“ trägt die Redaktion eine URL ein.
 */
export const cta = defineType({
  name: "cta",
  title: "Call-to-Action-Button",
  type: "object",
  icon: LaunchIcon,
  fields: [
    defineField({
      name: "label",
      title: "Beschriftung",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "target",
      title: "Ziel",
      type: "string",
      options: { list: TARGET_OPTIONS, layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Adresse",
      type: "url",
      description: "Nur bei Ziel „Eigene Adresse“ sichtbar und erforderlich.",
      hidden: ({ parent }) => (parent as { target?: string } | undefined)?.target !== "url",
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }).custom(
          (value, context) => {
            const parent = context.parent as { target?: string } | undefined;
            if (parent?.target === "url" && !value) {
              return "Bei Ziel „Eigene Adresse“ ist eine Adresse erforderlich.";
            }
            return true;
          },
        ),
    }),
  ],
  preview: {
    select: { label: "label", target: "target" },
    prepare({ label, target }: { label?: string; target?: string }) {
      const targetLabel = TARGET_OPTIONS.find((option) => option.value === target)?.title ?? target;
      return { title: label ?? "Call-to-Action-Button", subtitle: targetLabel };
    },
  },
});
