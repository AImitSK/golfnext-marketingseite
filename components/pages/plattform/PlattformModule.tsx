import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import type { ModulGruppe, StoryLink } from "@/content/plattform";
import styles from "./PlattformModule.module.css";

/**
 * „Plattform auf einen Blick" (Briefing 0035): die Modul-Übersicht, die früher im
 * Footer stand, jetzt im Hauptinhalt der Plattform-Seite direkt nach „Was sich ändert".
 * Sie erscheint auf der ganzen Website genau einmal – hier. Dunkle Navy-Karte im
 * bestehenden visuellen Stil der Footer-Landkarte (zwei Richtungen, Modulnamen als
 * Labels, kein Status). Darunter ein einzelner, zentrierter Link auf die Detailseite.
 * Reine Server-Komponente; enthält keine `<h1>`.
 */
export function PlattformModule({
  eyebrow,
  headline,
  gruppen,
  link,
}: {
  eyebrow: string;
  headline: string;
  gruppen: ModulGruppe[];
  link: StoryLink;
}) {
  return (
    <section className={styles.section} aria-label="Module im Überblick">
      <div className={styles.card}>
        <div className={styles.head}>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h2 className={styles.h2}>{headline}</h2>
        </div>
        <div className={styles.cols}>
          {gruppen.map((gruppe) => (
            <div
              key={gruppe.label}
              className={gruppe.variant === "in" ? `${styles.col} ${styles.colIn}` : styles.col}
            >
              <b className={styles.colLabel}>{gruppe.label}</b>
              <div className={styles.mods}>
                {gruppe.module.map((m) => (
                  <span key={m} className={styles.mod}>
                    <b>{m}</b>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.linkRow}>
        <TextLink href={internalHref(link.path)}>{link.label}</TextLink>
      </div>
    </section>
  );
}
