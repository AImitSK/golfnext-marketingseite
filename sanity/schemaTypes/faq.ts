import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { defineField, defineType } from "sanity";

const TOPIC_OPTIONS = [
  { title: "Pakete", value: "pakete" },
  { title: "Plattform", value: "plattform" },
  { title: "Clubprozesse", value: "clubprozesse" },
  { title: "Wachstum", value: "wachstum" },
  { title: "Allgemein", value: "allgemein" },
];

/**
 * Frage und Antwort. Erscheint gruppiert nach `topic`, sortiert nach
 * `order` (siehe docs/04-sanity-content-modell.md).
 */
export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "question",
      title: "Frage",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Antwort",
      type: "simpleBlockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "topic",
      title: "Thema",
      type: "string",
      options: { list: TOPIC_OPTIONS },
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
    select: { title: "question", topic: "topic" },
    prepare({ title, topic }: { title?: string; topic?: string }) {
      const topicLabel = TOPIC_OPTIONS.find((option) => option.value === topic)?.title ?? topic;
      return { title: title ?? "(ohne Frage)", subtitle: topicLabel };
    },
  },
});
