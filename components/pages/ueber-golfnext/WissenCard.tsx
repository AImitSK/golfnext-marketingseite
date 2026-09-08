import Image from "next/image";
import Link from "next/link";
import { Shot } from "@/components/ui/Shot";
import { formatDatum } from "@/lib/praxis/format";
import { urlForImage } from "@/lib/sanity/image";
import type { NEUESTE_POSTS_QUERY_RESULT } from "@/sanity.types";
import styles from "./Wissen.module.css";

/**
 * Eine Karte im Wissen-Slider (portiert aus 3.8b `.kcard/.kp/.kb/.kt/.km`). Seit
 * Briefing 0029 ein echter Artikel aus Sanity, der auf `/praxis/<slug>` verlinkt;
 * vorher standen hier vier Platzhalterkarten („Titel folgt: …") im Repo.
 *
 * An Stelle des früheren Feldes `quelle` („golfmanager · Fachartikel" / „GolfNext ·
 * Blog") steht die **Rubrik** des Artikels. Die Sonderrolle der golfmanager-Karten
 * ist entfallen, seit Stefan am 08.09.2026 im Studio die Rubrik „Fachartikel"
 * angelegt hat: Freds Fachzeitschriften-Beiträge sind damit ganz normale Artikel.
 *
 * Fehlt das Titelbild, tritt der beschriftete `Shot`-Platzhalter an seine Stelle –
 * nie Stock, nie KI (CLAUDE.md). Beide Fassungen sind gleich hoch (kein CLS).
 *
 * An Stelle der Lesezeit steht das Veröffentlichungsdatum: Die Lesezeit wird aus dem
 * Fließtext berechnet (`lib/praxis/lesezeit.ts`), den die Kartenabfrage nicht mitbringt
 * – und eine Zahl wird nicht geschätzt (Briefing 0029, Aufgabe 2).
 *
 * Reine Server-Komponente; der Slider drumherum ist der einzige Client-Teil.
 */

/** Breite einer Karte im Slider (`.kcard` flex-basis 380 px). */
const KARTE_BREITE = 380;
/** Höhe der Bildfläche aus dem Mock (`.kp`). */
const KARTE_HOEHE = 170;

export function WissenCard({
  artikel,
  bildPlatzhalter,
}: {
  artikel: NEUESTE_POSTS_QUERY_RESULT[number];
  bildPlatzhalter: string;
}) {
  const bild = artikel.mainImage?.asset ? urlForImage(artikel.mainImage) : null;
  const lqip = artikel.mainImage?.asset?.metadata?.lqip ?? undefined;
  const tag = formatDatum(artikel.publishedAt);

  return (
    <Link href={`/praxis/${artikel.slug}`} className={styles.kcard}>
      {bild ? (
        <div className={styles.kp}>
          <Image
            src={bild.width(KARTE_BREITE * 2).url()}
            // Neben Titel und Anriss ist das Kartenbild dekorativ; fehlt der
            // Alternativtext im Studio, bleibt er leer statt geraten.
            alt={artikel.mainImage?.alt ?? ""}
            width={KARTE_BREITE}
            height={KARTE_HOEHE}
            sizes={`${KARTE_BREITE}px`}
            placeholder={lqip ? "blur" : undefined}
            blurDataURL={lqip}
          />
        </div>
      ) : (
        <Shot ratio="16/10" tagline={bildPlatzhalter} className={styles.shot} />
      )}

      <div className={styles.kb}>
        <div className={styles.kt}>{artikel.category.title}</div>
        <b>{artikel.title}</b>
        <p>{artikel.excerpt}</p>
        <div className={styles.km}>
          <span>{artikel.author.name}</span>
          {tag ? <time dateTime={tag.iso}>{tag.text}</time> : null}
        </div>
      </div>
    </Link>
  );
}
