import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { portableLink } from "@/components/sanity/PortableLink";
import { Button } from "@/components/ui/Button";
import { praxisCalloutLabels } from "@/content/praxis";
import { ueberschriftId } from "@/lib/praxis/toc";
import { urlForImage } from "@/lib/sanity/image";
import type { BlockContent } from "@/sanity.types";
import styles from "./Artikel.module.css";

/** Breite der Fließtextspalte in Pixeln (70ch bei 18 px), aufgerundet. */
const TEXT_BREITE = 720;

/**
 * Zieladresse eines `cta`-Blocks aus dem Fließtext. Die festen Ziele löst die
 * Website selbst auf (nie hart kodiert, `lib/links.ts`); nur „Eigene Adresse" trägt
 * eine URL aus dem Studio.
 */
function ctaHref(target: string, url: string | undefined): string {
  switch (target) {
    // Der Buchungsweg ist entfallen (10.09.2026) – das Erstgespräch läuft übers Formular.
    case "erstgespraech":
      return "/kontakt";
    case "pakete":
      return "/pakete";
    default:
      return url?.trim() || "/kontakt";
  }
}

/**
 * Fließtext eines Artikels (Portable Text aus Sanity), gerendert nach
 * docs/04-sanity-content-modell.md, Abschnitt „Rendering".
 *
 * Zuordnung:
 * - `h2`/`h3` mit `id` als Sprungmarke (dieselbe Regel wie `lib/praxis/toc.ts`,
 *   damit Inhaltsverzeichnis und Überschriften zueinander passen). Die Nummerierung
 *   „01, 02 …" kommt aus einem CSS-Zähler, nicht aus dem Text.
 * - `blockquote` als Zitat mit grünem Balken (`.pull`).
 * - Listen mit Punkt bzw. Nummer, `strong`/`em` als solche.
 * - `link`: extern immer mit `rel="noopener noreferrer"`, `target="_blank"` nur bei
 *   gesetztem `openInNewTab` – ein neues Fenster ohne Ansage ist eine Zumutung.
 * - `inlineImage`: Bild mit `figcaption` aus `caption`, Höhe vorab reserviert.
 * - `callout`: der Kasten mit Fläche (Mock `.box`), Beschriftung je Ton.
 * - `cta`: der `Button`-Baustein mit Ziel aus `lib/links.ts`.
 *
 * Reine Server-Komponente.
 */
export function PortableTextRenderer({ body }: { body: BlockContent }) {
  return (
    <div className={styles.body}>
      <PortableText value={body} components={components} />
    </div>
  );
}

const components: PortableTextComponents = {
  block: {
    // `_key` setzt Sanity für jeden Block; der Rückfall hält nur den Typ sauber.
    h2: ({ value, children }) => <h2 id={ueberschriftId(value._key ?? "")}>{children}</h2>,
    h3: ({ value, children }) => <h3 id={ueberschriftId(value._key ?? "")}>{children}</h3>,
    blockquote: ({ children }) => <blockquote className={styles.pull}>{children}</blockquote>,
  },

  // Link-Behandlung geteilt mit dem FAQ-Renderer (`components/sanity/PortableLink`),
  // damit die `rel`-Regel nicht in zwei Fassungen auseinanderläuft (Briefing 0030).
  marks: { link: portableLink },

  types: {
    inlineImage: ({ value }) => {
      const bild = urlForImage(value);
      if (!bild) return null;
      const lqip: string | undefined = value?.asset?.metadata?.lqip ?? undefined;
      return (
        <figure className={styles.fig}>
          <div className={styles.figFlaeche}>
            <Image
              src={bild.width(TEXT_BREITE * 2).url()}
              alt={value?.alt ?? ""}
              width={TEXT_BREITE}
              height={Math.round((TEXT_BREITE * 9) / 16)}
              sizes={`(max-width: 1000px) 100vw, ${TEXT_BREITE}px`}
              placeholder={lqip ? "blur" : undefined}
              blurDataURL={lqip}
            />
          </div>
          {value?.caption ? <figcaption>{value.caption}</figcaption> : null}
        </figure>
      );
    },

    callout: ({ value }) => {
      const ton: "hinweis" | "tipp" = value?.tone === "tipp" ? "tipp" : "hinweis";
      return (
        <aside className={styles.box}>
          <b className={styles.boxLabel}>{praxisCalloutLabels[ton]}</b>
          <PortableText value={value?.text ?? []} components={components} />
        </aside>
      );
    },

    cta: ({ value }) => (
      <div className={styles.ctaBlock}>
        <Button variant="cta" href={ctaHref(value?.target ?? "", value?.url)}>
          {value?.label ?? ""}
        </Button>
      </div>
    ),
  },
};
