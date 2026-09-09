import type { PortableTextMarkComponent } from "@portabletext/react";

/**
 * Die `link`-Annotation aus Sanity – **einmal** für alle Portable-Text-Renderer
 * (Briefing 0030, Aufgabe 1): Sie steckt sowohl in `blockContent` (Artikel-Fließtext,
 * `components/pages/praxis/PortableTextRenderer.tsx`) als auch in `simpleBlockContent`
 * (FAQ-Antworten, `components/ui/SimpleText.tsx`). Zwei Fassungen derselben Regel
 * würden früher oder später auseinanderlaufen – gerade beim `rel`.
 *
 * Regeln (docs/04-sanity-content-modell.md):
 * - Extern (`http(s)://…`) immer mit `rel="noopener noreferrer"`.
 * - `target="_blank"` nur, wenn im Studio `openInNewTab` gesetzt ist – ein neues
 *   Fenster ohne Ansage ist eine Zumutung.
 * - Interne Ziele (`/pakete`, `mailto:`, `tel:`) bleiben ohne Zusatz.
 *
 * Reine Server-Komponente.
 */
export const portableLink: PortableTextMarkComponent<{
  _type: "link";
  href?: string;
  openInNewTab?: boolean;
}> = ({ value, children }) => {
  const href = value?.href ?? "";
  const extern = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      {...(extern ? { rel: "noopener noreferrer" } : {})}
      {...(value?.openInNewTab ? { target: "_blank" } : {})}
    >
      {children}
    </a>
  );
};
