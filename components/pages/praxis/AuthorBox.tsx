import Image from "next/image";
import { Portrait } from "@/components/ui/Portrait";
import { praxisLabels } from "@/content/praxis";
import { urlForImage } from "@/lib/sanity/image";
import type { POST_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import styles from "./Artikel.module.css";

type Artikel = NonNullable<POST_BY_SLUG_QUERY_RESULT>;
export type Autor = Artikel["author"];

/** Breite des Autorenporträts im Kasten unter dem Text (Mock: 120 px Spalte). */
const PORTRAIT_BREITE = 120;

/**
 * Autorenbox unter dem Artikel (portiert aus 3.9b `.author`): „Über den Autor",
 * Porträt, Name, Rolle, Kurzbiografie – und LinkedIn nur, wenn im Studio gepflegt.
 *
 * Fehlt das Porträt, steht der `Portrait`-Platzhalter dort – kein Stock, kein
 * KI-Bild (CLAUDE.md). Der Link „Alle Beiträge von …" aus dem Mock entfällt: Es gibt
 * keine Autorenseite (Briefing 0027), und ein Link ins Leere ist schlimmer als keiner.
 *
 * Reine Server-Komponente.
 */
export function AuthorBox({ autor }: { autor: Autor }) {
  const foto = autor.image?.asset ? urlForImage(autor.image) : null;
  const lqip = autor.image?.asset?.metadata?.lqip ?? undefined;

  return (
    <section className={styles.author} aria-label={praxisLabels.ueberDenAutor}>
      {foto ? (
        <div className={styles.authorFoto}>
          <Image
            src={foto.width(PORTRAIT_BREITE * 2).url()}
            alt={autor.image?.alt ?? ""}
            width={PORTRAIT_BREITE}
            height={140}
            sizes={`${PORTRAIT_BREITE}px`}
            placeholder={lqip ? "blur" : undefined}
            blurDataURL={lqip}
          />
        </div>
      ) : (
        <Portrait size="large" />
      )}

      <div>
        <p className={styles.authorLabel}>{praxisLabels.ueberDenAutor}</p>
        <b className={styles.authorName}>{autor.name}</b>
        <p className={styles.authorBio}>{autor.bio}</p>
        {autor.linkedin ? (
          <a
            className={styles.authorLink}
            href={autor.linkedin}
            rel="noopener noreferrer"
            target="_blank"
          >
            {praxisLabels.linkedin}
          </a>
        ) : null}
      </div>
    </section>
  );
}
