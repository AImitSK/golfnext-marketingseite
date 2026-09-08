import Image from "next/image";
import Link from "next/link";
import { Shot } from "@/components/ui/Shot";
import { Wrap } from "@/components/ui/Wrap";
import { praxisLabels, praxisPlatzhalter } from "@/content/praxis";
import { urlForImage } from "@/lib/sanity/image";
import type { POST_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { ArticleMeta } from "./ArticleMeta";
import { CategoryChip } from "./CategoryChip";
import styles from "./Artikel.module.css";

type Artikel = NonNullable<POST_BY_SLUG_QUERY_RESULT>;

/** Breite des Titelbilds (voller Satzspiegel 1180 px minus Gutter). */
const COVER_BREITE = 1100;

/**
 * Artikelkopf (portiert aus 3.9b `.ahead` und `.cover`): Brotkrumen, Rubrik-Chip,
 * die einzige `<h1>`, der Anriss als Lead, Autor/Datum/Lesezeit und das Titelbild
 * mit Bildunterschrift.
 *
 * Die Brotkrumen sind hier nur Markup – strukturierte Daten (JSON-LD) kommen erst
 * mit Masterplan 6.4.
 *
 * Fehlt das Titelbild, steht der beschriftete `Shot` mit „Titelbild folgt" dort;
 * die Fläche hat in beiden Fällen dasselbe Seitenverhältnis (kein CLS).
 *
 * Das Titelbild lädt mit Vorrang – es ist das größte Element über der Falz.
 *
 * Reine Server-Komponente.
 */
export function ArticleHead({ artikel, lesezeit }: { artikel: Artikel; lesezeit: number }) {
  const bild = artikel.mainImage?.asset ? urlForImage(artikel.mainImage) : null;
  const lqip = artikel.mainImage?.asset?.metadata?.lqip ?? undefined;

  return (
    <>
      <section className={styles.ahead}>
        <Wrap>
          <nav className={styles.crumb} aria-label="Brotkrumen">
            <Link href="/praxis">{praxisLabels.brotkrumeStart}</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/praxis/thema/${artikel.category.slug}`}>{artikel.category.title}</Link>
            <span aria-hidden="true">/</span>
            <b aria-current="page">{artikel.title}</b>
          </nav>

          <CategoryChip className={styles.catZeile}>{artikel.category.title}</CategoryChip>
          <h1 className={styles.h1}>{artikel.title}</h1>
          <p className={styles.lead}>{artikel.excerpt}</p>
          <ArticleMeta
            className={styles.kopfMeta}
            autor={{
              name: artikel.author.name,
              rolle: artikel.author.role,
              bild: artikel.author.image,
            }}
            datum={artikel.publishedAt}
            lesezeit={lesezeit}
          />
        </Wrap>
      </section>

      <div className={styles.cover}>
        {bild ? (
          <div className={styles.coverFlaeche}>
            <Image
              src={bild.width(COVER_BREITE).url()}
              alt={artikel.mainImage?.alt ?? ""}
              width={COVER_BREITE}
              height={Math.round((COVER_BREITE * 7) / 16)}
              sizes={`(max-width: 1180px) 100vw, ${COVER_BREITE}px`}
              placeholder={lqip ? "blur" : undefined}
              blurDataURL={lqip}
              priority
            />
          </div>
        ) : (
          <Shot ratio="16/7" tagline={praxisPlatzhalter.titelbild} />
        )}
        {artikel.mainImage?.caption ? (
          <p className={styles.coverCaption}>{artikel.mainImage.caption}</p>
        ) : null}
      </div>
    </>
  );
}
