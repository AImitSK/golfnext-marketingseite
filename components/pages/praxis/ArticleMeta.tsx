import Image from "next/image";
import { praxisLabels } from "@/content/praxis";
import { formatDatum, initialen } from "@/lib/praxis/format";
import { urlForImage } from "@/lib/sanity/image";
import styles from "./Meta.module.css";

/** Kantenlänge des Avatars in CSS-Pixeln – muss zu `.foto`/`.initialen` im CSS passen. */
const AVATAR = 26;
/** Größerer Avatar im Artikelkopf (Mock 3.9b `.ahead .meta .au i`). */
const AVATAR_KOPF = 34;

/**
 * Meta-Zeile aus Autor, Datum und (nur im Artikelkopf) Lesezeit – portiert aus
 * 3.9a/3.9b `.meta`.
 *
 * **Autorenbild statt Initialen** (Nachbesserung 08.09.2026): Liegt im Studio ein
 * Porträt, steht es hier; der Initialenkreis ist nur noch der Rückfall für Autoren
 * ohne Bild. Vorher zeigte die Zeile immer Initialen, obwohl die Abfragen das Bild
 * längst mitbrachten. Das Bild ist **dekorativ** (`alt=""`, `aria-hidden`): Der Name
 * steht direkt daneben, Screenreader würden ihn sonst doppelt vorlesen.
 *
 * Beide Varianten haben dieselben festen Maße – der Wechsel zwischen Bild und
 * Initialen verschiebt nichts (kein CLS).
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
  autor: {
    name: string;
    rolle?: string;
    /** Porträt aus Sanity, wenn gepflegt – sonst treten die Initialen an seine Stelle. */
    bild?: { asset?: { metadata?: { lqip?: string | null } | null } | null } | null;
  };
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

  const kante = aufKarte ? AVATAR : AVATAR_KOPF;
  const avatar = [styles.avatar, aufKarte ? undefined : styles.avatarGross]
    .filter(Boolean)
    .join(" ");
  const foto = autor.bild?.asset ? urlForImage(autor.bild) : null;
  const lqip = autor.bild?.asset?.metadata?.lqip ?? undefined;

  return (
    <div className={classes}>
      <span className={styles.au}>
        {foto ? (
          <span className={`${avatar} ${styles.foto}`} aria-hidden="true">
            <Image
              src={foto
                .width(kante * 2)
                .height(kante * 2)
                .fit("crop")
                .url()}
              alt=""
              width={kante}
              height={kante}
              placeholder={lqip ? "blur" : undefined}
              blurDataURL={lqip}
            />
          </span>
        ) : (
          <i className={`${avatar} ${styles.initialen}`} aria-hidden="true">
            {initialen(autor.name)}
          </i>
        )}
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
      {lesezeit ? (
        <span>
          {lesezeit} {praxisLabels.lesezeitSuffix}
        </span>
      ) : null}
    </div>
  );
}
