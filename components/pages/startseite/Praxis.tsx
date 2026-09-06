import { Rise, RiseItem } from "@/components/motion/Rise";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import type { PraxisArtikel, PraxisData } from "@/content/startseite";
import styles from "./Praxis.module.css";

/**
 * 8 · „Praxis" (portiert aus 3.1b .praxhead/.grid/.acard). Drei Artikel als
 * beschriftete Platzhalter („Bild folgt" wortgleich) mit Rubrik, Titel, Anriss und
 * Meta (Autor/Datum/Lesezeit) – illustrativ 1:1 aus dem Mock, keine erfundenen
 * Ergebnisse. Rechts im Kopf der Link „Alle Beiträge" (Ziel `/praxis`, per Live-Gate
 * `#`, solange nicht live). Die Karten sind `<article>` (keine toten Links) und
 * blenden über `Rise` gestaffelt auf; Endzustand im Server-HTML. Enthält keine `<h1>`.
 */
function catClass(variant: PraxisArtikel["catVariant"]) {
  if (variant === "pr") return `${styles.cat} ${styles.catPr}`;
  if (variant === "td") return `${styles.cat} ${styles.catTd}`;
  return styles.cat;
}

export function Praxis({
  eyebrow,
  headline,
  data,
}: {
  eyebrow: string;
  headline: string;
  data: PraxisData;
}) {
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
          {data.artikel.map((a) => (
            <RiseItem key={a.title} className={styles.acardWrap}>
              <article className={styles.acard}>
                <div className={styles.ap}>
                  <span>Bild folgt</span>
                </div>
                <div className={styles.ab}>
                  <span className={catClass(a.catVariant)}>{a.cat}</span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                  <div className={styles.meta}>
                    <span className={styles.au}>
                      <i aria-hidden="true">{a.autor.initialen}</i>
                      {a.autor.name}
                    </span>
                    <span>{a.datum}</span>
                    <span>{a.lesezeit}</span>
                  </div>
                </div>
              </article>
            </RiseItem>
          ))}
        </Rise>
      </div>
    </section>
  );
}
