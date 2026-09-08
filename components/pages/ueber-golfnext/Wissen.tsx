import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import { sanityFetch } from "@/lib/sanity/client";
import { NEUESTE_POSTS_QUERY, QUERY_TAGS } from "@/lib/sanity/queries";
import type { WissenData } from "@/content/ueber-golfnext";
import { WissenCard } from "./WissenCard";
import { WissenSlider } from "./WissenSlider";
import styles from "./Wissen.module.css";

/**
 * 6 · „Wissen“ – geteilte Sektions-Schale (paper, overflowHidden für den Slider-Bleed)
 * mit dem horizontalen Artikel-Slider und dem „Alle Artikel“-Link darunter (Ziel
 * /praxis, solange live – sonst `#` via internalHref). Eyebrow, Überschrift, Lead und
 * Linktext kommen wortgleich aus `content/ueber-golfnext.ts`.
 *
 * Der Slider zeigt seit Briefing 0029 die **vier neuesten Artikel aus Sanity**, gleich
 * welcher Rubrik – **kein Filter**. Welche Artikel vorn stehen, entscheidet Fred über
 * das Veröffentlichungsdatum im Studio, nicht der Code (Entscheidung Stefan,
 * 08.09.2026). Gibt es weniger als vier, zeigt der Slider entsprechend weniger Karten.
 *
 * **Ohne Artikel entfällt der Abschnitt vollständig** (Briefing 0029, Aufgabe 4) –
 * seit die Karten aus Sanity kommen, bliebe sonst nur eine Überschrift über einer
 * leeren Fläche stehen.
 *
 * Die Karten werden hier **serverseitig** gerendert und als `children` in den Slider
 * gereicht. So bleibt der Client-Teil auf die Bedienung beschränkt: Kein Sanity-Bild-
 * Baustein und keine Artikeldaten wandern ins Browser-Bündel.
 */
export async function Wissen({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: WissenData;
}) {
  const artikel = await sanityFetch({
    query: NEUESTE_POSTS_QUERY,
    params: { anzahl: 4 },
    tags: QUERY_TAGS.NEUESTE_POSTS_QUERY,
  });

  if (artikel.length === 0) return null;

  return (
    <PlattformSection variant="paper" overflowHidden eyebrow={eyebrow} headline={headline} lead={lead}>
      <WissenSlider>
        {artikel.map((a) => (
          <WissenCard key={a._id} artikel={a} bildPlatzhalter={data.bildPlatzhalter} />
        ))}
      </WissenSlider>
      <p className={styles.alle}>
        <TextLink href={internalHref(data.alleArtikel.path)}>{data.alleArtikel.label}</TextLink>
      </p>
    </PlattformSection>
  );
}
