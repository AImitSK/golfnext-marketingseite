import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineField, defineType } from "sanity";

/** Auswahlliste für den Ton des Hinweiskastens – reine Optik, kein Inhalt. */
const TONE_OPTIONS = [
  { title: "Hinweis", value: "hinweis" },
  { title: "Tipp", value: "tipp" },
];

/**
 * Hinweiskasten im Fließtext (post.body). Rendert auf der Website als
 * `Hint`-Baustein mit Fläche (siehe docs/04-sanity-content-modell.md).
 */
export const callout = defineType({
  name: "callout",
  title: "Hinweiskasten",
  type: "object",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "tone",
      title: "Ton",
      type: "string",
      options: { list: TONE_OPTIONS, layout: "radio" },
      // Reine Formatvorgabe, keine Inhaltsvorgabe – Redakteur kann jederzeit umstellen.
      initialValue: "hinweis",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "simpleBlockContent",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { tone: "tone" },
    prepare({ tone }: { tone?: string }) {
      const label = TONE_OPTIONS.find((option) => option.value === tone)?.title ?? "Hinweis";
      return { title: `Hinweiskasten (${label})` };
    },
  },
});
