import Image from "next/image";
import Link from "next/link";
import { Shot } from "@/components/ui/Shot";
import { praxisPlatzhalter } from "@/content/praxis";
import { urlForImage } from "@/lib/sanity/image";
import type { POSTS_QUERY_RESULT } from "@/sanity.types";
import { ArticleMeta } from "./ArticleMeta";
import { CategoryChip } from "./CategoryChip";
import styles from "./ArticleGrid.module.css";

/** Ein Artikel in Kartenform – die Felder aus `KARTE` in lib/sanity/queries.ts. */
export type Artikel = POSTS_QUERY_RESULT[number];

/** Breite der Kartenbilder im 3-Spalten-Raster (1140 px / 3 – Gutter), gerundet. */
const KARTE_BREITE = 380;

/**
 * Artikelkarte (portiert aus 3.9a `.acard`). Bild 16/10, Rubrik-Chip, Titel,
 * Anrisstext und die Meta-Zeile aus Autor und Datum.
 *
 * **Ohne `mainImage`** tritt der beschriftete `Shot`-Platzhalter mit „Bild folgt" an
 * die Stelle des Bildes – nie ein Stock- oder KI-Bild, nie eine leere Fläche
 * (CLAUDE.md). Die Fläche hat in beiden Fällen dasselbe Seitenverhältnis, die Karte
 * springt also nicht (kein CLS).
 *
 * Das Bild kommt über `next/image` von cdn.sanity.io; `metadata.lqip` liefert die
 * Unschärfe für die Ladezeit. Fehlt der `alt`-Text, bleibt er leer statt geraten –
 * ein Kartenbild ist neben Titel und Anriss dekorativ.
 *
 * Reine Server-Komponente. Die ganze Karte ist ein Link (wie im Mock); der Rubrik-Chip
 * darin ist deshalb Text, kein zweiter Link.
 */
export function ArticleCard({
  artikel,
  ueberschrift: Ueberschrift = "h2",
  prioritaet = false,
}: {
  artikel: Artikel;
  /**
   * Ebene des Kartentitels. Auf der Liste ist die Karte der oberste Abschnitt unter
   * der Seitenüberschrift – dort `h2`. Im Block „Passt dazu" steht sie unter dessen
   * `h2` – dort `h3`. Die Optik hängt an `.titel` und bleibt in beiden Fällen gleich
   * (der Mock zeigt beide Male dieselbe Karte).
   */
  ueberschrift?: "h2" | "h3";
  prioritaet?: boolean;
}) {
  const bild = artikel.mainImage?.asset ? urlForImage(artikel.mainImage) : null;
  const lqip = artikel.mainImage?.asset?.metadata?.lqip ?? undefined;

  return (
    <Link href={`/praxis/${artikel.slug}`} className={styles.card}>
      {bild ? (
        <div className={styles.pic}>
          <Image
            src={bild.width(KARTE_BREITE * 2).url()}
            alt={artikel.mainImage?.alt ?? ""}
            width={KARTE_BREITE}
            height={Math.round((KARTE_BREITE * 10) / 16)}
            sizes={`(max-width: 620px) 100vw, (max-width: 1000px) 50vw, ${KARTE_BREITE}px`}
            placeholder={lqip ? "blur" : undefined}
            blurDataURL={lqip}
            priority={prioritaet}
          />
        </div>
      ) : (
        <Shot className={styles.shot} ratio="16/10" tagline={praxisPlatzhalter.kartenbild} />
      )}

      <div className={styles.body}>
        <CategoryChip>{artikel.category.title}</CategoryChip>
        <Ueberschrift className={styles.titel}>{artikel.title}</Ueberschrift>
        <p className={styles.excerpt}>{artikel.excerpt}</p>
        <ArticleMeta autor={{ name: artikel.author.name }} datum={artikel.publishedAt} aufKarte />
      </div>
    </Link>
  );
}
