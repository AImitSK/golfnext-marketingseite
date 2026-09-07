import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { KONTAKT } from "@/config/site-structure";
import type { WegData } from "@/content/kontakt";
import { resolveCta } from "@/lib/links";
import styles from "./Wege.module.css";

/**
 * 3 · „Nicht jeder schreibt gern ein Formular." (portiert aus 3.10-kontakt.html,
 * `.ways3`/`.way3`). Drei gleichwertige Wege nebeneinander.
 *
 * Die Ziele stehen **nirgends hart kodiert**: „Termin aussuchen" löst über
 * `resolveCta` auf `bookingUrl()` auf (künftig cal.com), „Demo öffnen" auf
 * `liveDemoUrl()`, und der dritte Weg baut aus `KONTAKT.telefon` einen `tel:`-Link.
 * cal.com wird **nur verlinkt, nie eingebettet** – ein eingebettetes Skript bräuchte
 * vorher eine Einwilligung (Briefing 0025).
 *
 * Reine Server-Komponente; die einzige Bewegung ist der Hover-Lift aus dem Mock.
 */

/** Kalender, fix 20 px (Icon-Regel: nie ohne Größe). */
function KalenderIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

/** Bildschirm, fix 20 px. */
function BildschirmIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 18v3" />
    </svg>
  );
}

/** Hörer, fix 20 px. */
function TelefonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z" />
    </svg>
  );
}

const ICONS = {
  kalender: <KalenderIcon />,
  bildschirm: <BildschirmIcon />,
  telefon: <TelefonIcon />,
} as const;

export function Wege({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: WegData[];
}) {
  const telHref = `tel:${KONTAKT.telefon.replace(/\s+/g, "")}`;

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className={styles.h2}>{headline}</h2>
        <p className={styles.lead}>{lead}</p>

        <div className={styles.grid}>
          {data.map((weg) => {
            const cta = weg.cta;
            const href = cta.target === "telefon" ? telHref : resolveCta(cta);
            const label = cta.target === "telefon" ? KONTAKT.telefon : cta.label;
            return (
              <div key={weg.headline} className={styles.card}>
                <span className={styles.icon}>{ICONS[weg.icon]}</span>
                <b className={styles.cardHeadline}>{weg.headline}</b>
                <p>{weg.text}</p>
                <TextLink href={href}>{label}</TextLink>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
