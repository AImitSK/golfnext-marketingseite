import Image from "next/image";
import Link from "next/link";
import { Rise, RiseItem } from "@/components/motion/Rise";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Shot } from "@/components/ui/Shot";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import { formatDatum, initialen } from "@/lib/praxis/format";
import { sanityFetch } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { NEUESTE_POSTS_QUERY, QUERY_TAGS } from "@/lib/sanity/queries";
import type { PraxisData } from "@/content/startseite";
import styles from "./Praxis.module.css";

/**
 * 8 · „Praxis" (portiert aus 3.1b .praxhead/.grid/.acard). Zeigt seit Briefing 0029
 * die **drei neuesten Artikel aus Sanity** und verlinkt sie auf `/praxis/<slug>` –
 * wie im Mock, wo die Karte selbst der Link ist (`<a class="acard">`). Vorher standen
 * hier drei ausformulierte Teaser im Repo, die keinen Artikel hinter sich hatten.
 *
 * Geteilt wird mit `/praxis` nur die **Datenschicht** (`NEUESTE_POSTS_QUERY`,
 * `lib/praxis/format.ts`), nicht das Aussehen: Die Karte bleibt die aus 3.1b, die
 * Praxis-Karte aus 3.9a wird nicht hineinkopiert.
 *
 * Kein Titelbild im Studio → beschrifteter `Shot`-Platzhalter mit „Bild folgt"
 * (CLAUDE.md), nie Stock oder KI. Beide Fassungen sind gleich hoch, die Karte springt
 * also nicht (kein CLS).
 *
 * **Ohne Artikel entfällt der Abschnitt vollständig** (Briefing 0029, Aufgabe 4):
 * kein Kopf, kein Raster, kein Link – und damit auch kein doppelter Abstand vor dem
 * Footer, weil die `<section>` samt ihrer Sektionsluft gar nicht erst entsteht.
 *
 * Die **Lesezeit entfällt**: Sie wird aus dem Fließtext berechnet
 * (`lib/praxis/lesezeit.ts`), und die Kartenabfrage trägt keinen Fließtext. Eine Zahl
 * zu schätzen wäre eine erfundene Zahl (CLAUDE.md, Briefing 0029, Aufgabe 2).
 *
 * Rechts im Kopf der Link „Alle Beiträge" (Ziel `/praxis`, per Live-Gate `#`, solange
 * die Route nicht live ist). Die Karten blenden über `Rise` gestaffelt auf; der
 * Endzustand steht im Server-HTML. Enthält keine `<h1>`.
 */

/** Breite einer Karte im 3-Spalten-Raster (Wrap 1180 − Gutter), gerundet. */
const KARTE_BREITE = 360;
/** Höhe der Bildfläche aus dem Mock (`.ap`) – für das Seitenverhältnis des Bildes. */
const KARTE_HOEHE = 190;

export async function Praxis({
  eyebrow,
  headline,
  data,
}: {
  eyebrow: string;
  headline: string;
  data: PraxisData;
}) {
  const artikel = await sanityFetch({
    query: NEUESTE_POSTS_QUERY,
    params: { anzahl: 3 },
    tags: QUERY_TAGS.NEUESTE_POSTS_QUERY,
  });

  if (artikel.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.praxhead}>
          <div>
            <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow>
            <h2>{headline}</h2>
          </div>
          <TextLink href={internalHref(data.link.path)}>{data.link.label}</TextLink>
        </div>

        <Rise className={styles.grid}>
          {artikel.map((a) => {
            const bild = a.mainImage?.asset ? urlForImage(a.mainImage) : null;
            const lqip = a.mainImage?.asset?.metadata?.lqip ?? undefined;
            const tag = formatDatum(a.publishedAt);
            const portraet = a.author.image?.asset ? urlForImage(a.author.image) : null;

            return (
              <RiseItem key={a._id} className={styles.acardWrap}>
                <Link href={`/praxis/${a.slug}`} className={styles.acard}>
                  {bild ? (
                    <div className={styles.ap}>
                      <Image
                        src={bild.width(KARTE_BREITE * 2).url()}
                        // Neben Titel und Anriss ist das Kartenbild dekorativ; fehlt der
                        // Alternativtext im Studio, bleibt er leer statt geraten.
                        alt={a.mainImage?.alt ?? ""}
                        width={KARTE_BREITE}
                        height={KARTE_HOEHE}
                        sizes={`(max-width: 620px) 100vw, (max-width: 1000px) 50vw, ${KARTE_BREITE}px`}
                        placeholder={lqip ? "blur" : undefined}
                        blurDataURL={lqip}
                      />
                    </div>
                  ) : (
                    <Shot ratio="16/10" tagline={data.bildPlatzhalter} className={styles.shot} />
                  )}

                  <div className={styles.ab}>
                    <span className={styles.cat}>{a.category.title}</span>
                    <h3>{a.title}</h3>
                    <p>{a.excerpt}</p>
                    <div className={styles.meta}>
                      <span className={styles.au}>
                        {portraet ? (
                          <span className={styles.foto} aria-hidden="true">
                            <Image
                              src={portraet.width(52).height(52).fit("crop").url()}
                              alt=""
                              width={26}
                              height={26}
                            />
                          </span>
                        ) : (
                          <i aria-hidden="true">{initialen(a.author.name)}</i>
                        )}
                        {a.author.name}
                      </span>
                      {tag ? <time dateTime={tag.iso}>{tag.text}</time> : null}
                    </div>
                  </div>
                </Link>
              </RiseItem>
            );
          })}
        </Rise>
      </div>
    </section>
  );
}
