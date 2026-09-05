import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lead } from "@/components/ui/Lead";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Wrap } from "@/components/ui/Wrap";
import type { PaketeData, PaketKarte, PriceField } from "@/content/pakete";
import { resolveCta } from "@/lib/links";
import styles from "./Pakete.module.css";

const VARIANT_CLASS: Record<PaketKarte["variant"], string> = {
  a: styles.a,
  b: styles.b,
  c: styles.c,
};

/** Chevron der Aufklapp-Zusammenfassung, fix 14 × 14 px (Icon-Regel: nie ohne Größe). */
function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Zweizeiliger Preisschlüssel (Mock nutzte <br> im Label). */
function KeyLines({ lines }: { lines: string[] }) {
  return (
    <span className={styles.mk}>
      {lines.map((line, i) => (
        <span key={line}>
          {i > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </span>
  );
}

function Karte({ card }: { card: PaketKarte }) {
  const classes = [styles.pkc, VARIANT_CLASS[card.variant], card.highlight ? styles.mid : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className={styles.stripe} />
      <div className={styles.pad}>
        <span className={styles.role}>{card.role}</span>
        <span className={styles.pname}>{card.name}</span>
        <span className={styles.pclaim}>{card.claim}</span>
      </div>

      {/* Sockel + Pluszeichen + Modulblock – nie addiert, keine Summenzeile. */}
      <div className={styles.stackprice}>
        <div className={styles.sock}>
          <b>{card.sock.label}</b>
          <span>{card.sock.value}</span>
        </div>
        <div className={styles.plus} aria-hidden="true">
          <i />
          <em>+</em>
          <i />
        </div>
        <div className={styles.mod}>
          <div className={styles.ml}>{card.modLabel}</div>
          {card.modRows.map((row: PriceField) => (
            <div key={row.value} className={styles.mr}>
              <span className={styles.mv}>{row.value}</span>
              <KeyLines lines={row.keyLines} />
            </div>
          ))}
        </div>
      </div>

      {/* Aufklappbare Leistungen ohne JS (<details>/<summary>). */}
      <details className={styles.details}>
        <summary className={styles.summary}>
          <span className={styles.sumLead}>{card.summaryLead}</span>
          <span className={styles.sumCount}>{card.summaryCount}</span>
          <ChevronIcon />
        </summary>
        <div className={styles.incbody}>
          <ul className={styles.list}>
            {card.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </details>

      <div className={styles.foot5}>
        <TextLink href={resolveCta(card.tlink)}>{card.tlink.label}</TextLink>
      </div>
    </div>
  );
}

/**
 * Abschnitt 3 „Die drei Pakete" (portiert aus 3.7-pakete.html, Z.518–645). Drei
 * Karten (Sockel + Pluszeichen + Modulblock + aufklappbare Leistungen) und darunter
 * die Werbebudget-Box mit gekennzeichneter Beispielrechnung. Reine Server-Komponente.
 */
export function Pakete({
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
  const { cards, adbox } = data;

  return (
    <Section variant="mist" id={id}>
      <Wrap>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{headline}</h2>
        <Lead>{lead}</Lead>

        <div className={styles.pk3}>
          {cards.map((card) => (
            <Karte key={card.name} card={card} />
          ))}
        </div>

        <div className={styles.adbox}>
          <div>
            <div className={styles.al}>{adbox.label}</div>
            <h3>{adbox.title}</h3>
            <p>{adbox.text}</p>
          </div>
          <div className={styles.adcalc}>
            <div className={styles.cl}>{adbox.calcLabel}</div>
            {adbox.rows.map((row) => (
              <div key={row.label} className={row.fee ? `${styles.cr} ${styles.fee}` : styles.cr}>
                <span>{row.label}</span>
                <b>{row.value}</b>
              </div>
            ))}
            <p className={styles.cn}>{adbox.note}</p>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
