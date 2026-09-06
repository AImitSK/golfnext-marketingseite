import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { Rise, RiseItem } from "@/components/motion/Rise";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import type { PaketeData } from "@/content/startseite";
import styles from "./Pakete.module.css";

/**
 * 6 · „Pakete" (portiert aus 3.1b .pkgrid/.pkx/.pkline). Der navyfarbene Sockel
 * „Ihre Clubwebsite" mit „+"-Marke, dazu die zwei Modulblöcke Wachstum und Komplett
 * als Teaser – **ohne Preise/Summen** (die stehen ausschließlich auf `/pakete`).
 * Modul-Tags sind reine Namens-Labels (kein Status). Die `.pkline` trägt den Hinweis
 * auf die offenen Preise und den Link zur Paketseite (live). Karten blenden über
 * `Rise` gestaffelt auf; Endzustand im Server-HTML.
 */
export function Pakete({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: PaketeData;
}) {
  return (
    <PlattformSection variant="sand" eyebrow={eyebrow} headline={headline} lead={lead}>
      <Rise className={styles.pkgrid}>
        {data.cards.map((card) => (
          <RiseItem key={card.name} className={styles.pkxWrap}>
            <div className={card.base ? `${styles.pkx} ${styles.base}` : styles.pkx}>
              <span className={styles.role}>{card.role}</span>
              <span className={styles.name}>{card.name}</span>
              <p>{card.text}</p>
              {card.mods ? (
                <span className={styles.mods}>
                  {card.mods.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </span>
              ) : null}
              {card.base ? (
                <span className={styles.plus} aria-hidden="true">
                  +
                </span>
              ) : null}
            </div>
          </RiseItem>
        ))}
      </Rise>
      <div className={styles.pkline}>
        <span>{data.note}</span>
        <TextLink href={internalHref(data.link.path)}>{data.link.label}</TextLink>
      </div>
    </PlattformSection>
  );
}
