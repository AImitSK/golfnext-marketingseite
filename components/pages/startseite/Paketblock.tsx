import { Fragment } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lead } from "@/components/ui/Lead";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Wrap } from "@/components/ui/Wrap";
import { resolveCta } from "@/lib/links";
import type { PaketeData, PricePair } from "@/content/startseite";
import styles from "./Paketblock.module.css";

/**
 * 6 · Pakete – Preislogik **Fassung 2** (portiert aus
 * docs/design-system/mocks/3.1a-startseite-paketblock-fassung2.html, Z.78–209).
 * NICHT die überholten Fassung-1-Preise aus Abschnitt 6 des Umsetzungsbriefings.
 *
 * Struktur: gemeinsames Sockband „Ihre Clubwebsite" (6.800 €/238 €, auch einzeln
 * buchbar), drei „+" und drei kompakte Karten (Wachstum · Komplett · Individuell).
 * **Preise werden nie addiert** – Sockel und Modulblock stehen durch das Pluszeichen
 * getrennt, der Leser zieht die Summe selbst. Keine Bestseller-Badge, keine Empfehlung
 * (die mittlere Karte trägt nur einen Navy-Rahmen). Haupt-Link auf die Vergleichsseite
 * `/pakete` (live). Reine Server-Komponente.
 */

/** Schlüsselzeilen eines Preisfelds mit weichem Umbruch rendern. */
function KeyLines({ lines }: { lines: PricePair["keyLines"] }) {
  return (
    <span>
      {lines.map((line, i) => (
        <Fragment key={line}>
          {i > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </span>
  );
}

export function Paketblock({
  id,
  eyebrow,
  headline,
  lead,
  data,
}: {
  id: string;
  eyebrow: string;
  headline: string;
  lead: string;
  data: PaketeData;
}) {
  const { sockband, cards, note, mainLink } = data;

  return (
    <Section id={id}>
      <Wrap>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{headline}</h2>
        <Lead>{lead}</Lead>

        {/* Sockband: Basis in jedem Paket – steht getrennt vom Modulblock (nie addiert). */}
        <div className={styles.sockband}>
          <div>
            <span className={styles.sl}>{sockband.label}</span>
            <span className={styles.sn}>{sockband.name}</span>
          </div>
          <div className={styles.sp}>
            {sockband.prices.map((p) => (
              <span key={p.value} className={styles.spitem}>
                <b>{p.value}</b>
                <span>{p.keyLines.join(" ")}</span>
              </span>
            ))}
          </div>
          <span className={styles.sb}>{sockband.badge}</span>
        </div>

        {/* Pluszeichen – dekorativ, trennt Sockel von den Modulblöcken. */}
        <div className={styles.plusrow} aria-hidden="true">
          <div className={styles.pl}>
            <i />
            <em>+</em>
            <i />
          </div>
          <div className={styles.pl}>
            <i />
            <em>+</em>
            <i />
          </div>
          <div className={styles.pl}>
            <i />
            <em>+</em>
            <i />
          </div>
        </div>

        <div className={styles.pk3}>
          {cards.map((card) => (
            <div
              key={card.name}
              className={`${styles.pkc} gn-card-lift ${styles[card.variant]} ${card.mid ? styles.mid : ""}`}
            >
              <div className={styles.stripe} aria-hidden="true" />
              <span className={styles.role}>{card.role}</span>
              <span className={styles.pn}>{card.name}</span>
              <p className={styles.pp}>{card.claim}</p>
              <div className={styles.ml}>{card.modLabel}</div>
              {card.modRows.map((row) => (
                <div key={row.value} className={styles.mv}>
                  <b>{row.value}</b>
                  <KeyLines lines={row.keyLines} />
                </div>
              ))}
              <div className={styles.plink}>
                <TextLink href={resolveCta(card.link)}>{card.link.label}</TextLink>
              </div>
            </div>
          ))}
        </div>

        <p className={styles.pknote}>{note}</p>
        <div className={styles.pkcta}>
          <TextLink href={resolveCta(mainLink)}>{mainLink.label}</TextLink>
        </div>
      </Wrap>
    </Section>
  );
}
