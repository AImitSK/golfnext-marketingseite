import { Rise, RiseItem } from "@/components/motion/Rise";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { ZusagenData } from "@/content/startseite";
import styles from "./Zusagen.module.css";

/**
 * 7 · „Vier Zusagen" (portiert aus 3.1b .vband/.vgrid/.vow/.fredq). Navy-Band mit
 * vier Zusagen (Domain/Daten, Alles mitnehmen, Faire Laufzeiten, Ein Mensch am
 * Telefon) und dem Fred-Zitat samt Porträt-Platzhalter. Texte wortgleich; keine
 * erfundenen Zahlen. Die Karten blenden über `Rise` gestaffelt auf (Hover-Lift auf
 * der inneren `.vow`); Endzustand im Server-HTML. Enthält bewusst KEINE `<h1>` (H2).
 */
export function Zusagen({
  eyebrow,
  headline,
  data,
}: {
  eyebrow: string;
  headline: string;
  data: ZusagenData;
}) {
  return (
    <section className={styles.vband}>
      <div className={styles.wrap}>
        <Eyebrow onDark className={styles.eyebrow}>
          {eyebrow}
        </Eyebrow>
        <h2 className={styles.h2}>{headline}</h2>

        <Rise className={styles.vgrid}>
          {data.vows.map((v) => (
            <RiseItem key={v.n} className={styles.vowWrap}>
              <div className={styles.vow}>
                <div className={styles.vn}>{v.n}</div>
                <b>{v.title}</b>
                <p>{v.text}</p>
              </div>
            </RiseItem>
          ))}
        </Rise>

        <figure className={styles.fredq}>
          <span className={styles.ph} aria-hidden="true">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="12" cy="9" r="3.4" />
              <path d="M4.8 20c1.5-3.4 4.2-5.1 7.2-5.1s5.7 1.7 7.2 5.1" />
            </svg>
          </span>
          <div>
            <blockquote className={styles.q}>{`„${data.zitat.text}“`}</blockquote>
            <figcaption className={styles.who}>
              <b>{data.zitat.name}</b> · {data.zitat.role}
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
