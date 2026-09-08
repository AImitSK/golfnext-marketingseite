import { praxisLabels } from "@/content/praxis";
import { formatDatum, initialen } from "@/lib/praxis/format";
import styles from "./Meta.module.css";

/**
 * Meta-Zeile aus Autor, Datum und (nur im Artikelkopf) Lesezeit – portiert aus
 * 3.9a/3.9b `.meta`.
 *
 * Der Initialenkreis ist dekorativ (`aria-hidden`): Der Name steht direkt daneben,
 * Screenreader würden sonst „F H Fred Hoffmann" lesen. Er hat feste Maße im CSS und
 * ist kein SVG – nichts, was auf Containerbreite skalieren könnte.
 *
 * Reine Server-Komponente.
 */
export function ArticleMeta({
  autor,
  datum,
  lesezeit,
  aufKarte = false,
  className,
}: {
  autor: { name: string; rolle?: string };
  datum: string;
  /** Berechnete Lesezeit in Minuten (lib/praxis/lesezeit.ts) – nur im Artikelkopf. */
  lesezeit?: number;
  /** Kompakte Fassung mit Trennlinie am Fuß der Artikelkarte. */
  aufKarte?: boolean;
  className?: string;
}) {
  const tag = formatDatum(datum);
  const classes = [styles.meta, aufKarte ? styles.aufKarte : undefined, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <span className={styles.au}>
        <i className={styles.initialen} aria-hidden="true">
          {initialen(autor.name)}
        </i>
        {autor.rolle ? (
          <span>
            {autor.name}
            <span className={styles.rolle}>{autor.rolle}</span>
          </span>
        ) : (
          autor.name
        )}
      </span>
      {tag ? <time dateTime={tag.iso}>{tag.text}</time> : null}
      {lesezeit ? <span>{lesezeit} {praxisLabels.lesezeitSuffix}</span> : null}
    </div>
  );
}
