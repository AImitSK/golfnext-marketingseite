import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

/**
 * Bild innerhalb des Fließtexts (post.body). Eigener Typname, damit er sich
 * vom Titelbild (post.mainImage) unterscheidet, obwohl beide `image`-Felder
 * sind. `alt` ist Pflicht – ohne Alternativtext kein Bild (Barrierefreiheit).
 */
export const inlineImage = defineType({
  name: "inlineImage",
  title: "Bild",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternativtext",
      type: "string",
      description: "Beschreibt das Bild für Screenreader und falls es nicht geladen werden kann.",
      validation: (Rule) => Rule.required().error("Ohne Alternativtext kein Bild."),
    }),
    defineField({
      name: "caption",
      title: "Bildunterschrift",
      type: "string",
      description: "Optional, erscheint unter dem Bild.",
    }),
  ],
});
