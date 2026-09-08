import Image from "next/image";
import { Portrait } from "@/components/ui/Portrait";
import { praxisLabels } from "@/content/praxis";
import type { TocEintrag } from "@/lib/praxis/toc";
import { urlForImage } from "@/lib/sanity/image";
import { ArticleToc } from "./ArticleToc";
import type { Autor } from "./AuthorBox";
import styles from "./Artikel.module.css";

/**
 * Seitenspalte des Artikels (portiert aus 3.9b `.aside`): Inhaltsverzeichnis und die
 * kompakte Autorenzeile. Ab 1024 px klebt sie mit (`position: sticky`), darunter
 * steht sie ausgeklappt über dem Text (Briefing 0027) – im Mock verschwand das
 * Inhaltsverzeichnis dort ersatzlos.
 *
 * **Der Kasten `.cta2` des Mocks fehlt bewusst.** Seine Texte („Das für Ihren Club
 * durchgehen?" …) stehen nicht auf der Liste der freigegebenen Schalen-Texte
 * (Briefing 0027) und wären hier neu erfundenes Marketing. Der Weg ins Erstgespräch
 * steht unverändert im Abschluss unter dem Artikel (`FooterClose`).
 *
 * Reine Server-Komponente.
 */
export function ArticleAside({
  eintraege,
  autor,
  lesezeit,
}: {
  eintraege: TocEintrag[];
  autor: Autor;
  lesezeit: number;
}) {
  const foto = autor.image?.asset ? urlForImage(autor.image) : null;

  return (
    <aside className={styles.aside}>
      <ArticleToc eintraege={eintraege} />

      <div className={styles.abox}>
        {foto ? (
          <span className={styles.aboxFoto}>
            {/* aria-hidden: Name und Rolle stehen direkt daneben. */}
            <Image
              src={foto.width(104).height(104).fit("crop").url()}
              alt=""
              width={52}
              height={52}
              aria-hidden="true"
            />
          </span>
        ) : (
          <Portrait size="small" />
        )}
        <div>
          <b className={styles.aboxName}>{autor.name}</b>
          <span className={styles.aboxRolle}>
            {autor.role} · {lesezeit} {praxisLabels.lesezeitSuffix}
          </span>
        </div>
      </div>
    </aside>
  );
}
