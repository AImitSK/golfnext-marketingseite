import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { portableLink } from "@/components/sanity/PortableLink";
import type { SimpleBlockContent } from "@/sanity.types";

/**
 * Schlanker Renderer für `simpleBlockContent` (Briefing 0030, Aufgabe 1) – den
 * reduzierten Portable Text aus `faq.answer` und `callout.text`: **nur Absätze**,
 * `strong`, `em` und die Annotation `link`. Keine Überschriften, keine Listen, keine
 * Bilder, keine Kästen, kein CTA – das Schema lässt sie gar nicht erst zu
 * (`sanity/schemaTypes/objects/simpleBlockContent.ts`).
 *
 * Bewusst **nicht** der `PortableTextRenderer` der Praxis-Seiten: der ist auf
 * `blockContent` mit Bildern, Hinweiskästen und CTA-Buttons zugeschnitten und zieht
 * `next/image`, `urlForImage` und den `Button`-Baustein mit sich. Geteilt wird nur,
 * was wirklich dieselbe Regel ist: die Link-Behandlung (`components/sanity/PortableLink`).
 *
 * Absätze, `strong` und `em` rendert `@portabletext/react` von Haus aus als `<p>`,
 * `<strong>` und `<em>` – dafür braucht es keine Zuordnung. Es bleibt der Link.
 *
 * Ohne Wrapper-Element: Die umgebende Fläche bringt die Seite mit (bei der FAQ ist das
 * `.answer` in `Faq.module.css`). Reine Server-Komponente.
 */
export function SimpleText({ value }: { value: SimpleBlockContent }) {
  return <PortableText value={value} components={components} />;
}

const components: PortableTextComponents = {
  marks: { link: portableLink },
};
