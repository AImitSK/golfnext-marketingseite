"use client";

import { RevealLine } from "@/components/motion/RevealLine";
import { useStagedInView } from "@/components/motion/useStagedInView";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref, resolveCta } from "@/lib/links";
import type { Mail, Strecke, StreckenData } from "@/content/so-arbeitet-golfnext";
import styles from "./Strecken.module.css";

/**
 * 2 · „Fünf Zielgruppen, fünf eigene Strecken." (portiert aus 3.3b .tabs/.tab/.seq/
 * .seqline/.mails/.mail/.env). Fünf Strecken – Schnuppergolf, Platzreife,
 * Mitgliedschaft, Greenfee & Gäste, Firmen-Event – mit je vier Nachrichten.
 *
 * Der Umschalter ist eine **echte Radiogruppe** (fünf versteckte, aber fokussierbare
 * `<input type="radio">` + `<label>`-Reiter): Alle fünf Strecken stehen im Server-HTML,
 * der Wechsel läuft rein über CSS (`:checked`) – **ohne JavaScript** voll bedienbar und
 * per Tastatur (Pfeiltasten der nativen Radiogruppe) erreichbar. Gleiches Muster wie der
 * frühere Startseiten-Umschalter (Briefing 0013). Der Mock schaltet per JavaScript; das
 * ist hier bewusst ersetzt.
 *
 * Die Mail-Fenster sind SCHEMATISCHE ILLUSTRATIONEN (`aria-hidden`, Beschreibung je
 * Strecke über `role="img"` + `aria-label`): Betreffs, Beispieladressen, Zeitangaben
 * und Ratgeber-Verweise stammen 1:1 aus dem Mock und illustrieren, wie eine Strecke
 * aussieht – keine Zusagen, keine Zahlen, keine Fristen.
 *
 * Bewegung: Der ENDZUSTAND (Zeitleiste voll, alle Nachrichten sichtbar) steht im
 * Server-HTML → ohne JS und bei `prefers-reduced-motion` sofort lesbar. Nur mit JS und
 * ohne reduzierte Bewegung setzt `useStagedInView` kurz `.start` und löst es beim
 * Sichtbarwerden gestaffelt auf; die Zeitleiste zieht einmalig über `RevealLine`
 * (scaleX). Nach dem Umschalten steht die neue Strecke sofort im Endzustand.
 * Bewegt nur `opacity`/`transform` (kein CLS). Die nummerierten Knoten stehen dauerhaft
 * im Endzustand, damit sichtbare Ziffern nie kontrastschwach liegen.
 */

/** Klassen-Tripel je Strecke (CSS-Modules braucht literale Namen für `:checked ~ …`). */
const SWITCH: Record<Strecke["id"], { radio: string; tab: string; panel: string }> = {
  schnuppergolf: { radio: styles.r1, tab: styles.t1, panel: styles.p1 },
  platzreife: { radio: styles.r2, tab: styles.t2, panel: styles.p2 },
  mitgliedschaft: { radio: styles.r3, tab: styles.t3, panel: styles.p3 },
  "greenfee-gaeste": { radio: styles.r4, tab: styles.t4, panel: styles.p4 },
  "firmen-event": { radio: styles.r5, tab: styles.t5, panel: styles.p5 },
};

/** Listen-Icon des Ratgeber-/Übersichts-Verweises, fix 13 × 13 px (Icon-Regel). */
function ListIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 5h16M4 12h16M4 19h10" />
    </svg>
  );
}

function MailFenster({ mail }: { mail: Mail }) {
  return (
    <div className={styles.mail} aria-hidden="true">
      <span className={styles.dot}>{mail.nr}</span>
      <div className={styles.tm}>{mail.zeit}</div>
      <div className={styles.env}>
        <div className={styles.eh}>
          <span>{mail.an}</span>
          <span>{mail.gesendet}</span>
        </div>
        <div className={styles.eb}>
          <b>{mail.betreff}</b>
          <p>{mail.text}</p>
          {mail.hinweis ? (
            <span className={styles.att}>
              <ListIcon />
              {mail.hinweis}
            </span>
          ) : null}
          {mail.cta ? <span className={styles.cta}>{mail.cta}</span> : null}
        </div>
      </div>
    </div>
  );
}

export function Strecken({ data }: { data: StreckenData }) {
  const { ref, showStart } = useStagedInView<HTMLDivElement>(0.2);
  const seqClass = `${styles.seq}${showStart ? ` ${styles.start}` : ""}`;

  return (
    <>
      <fieldset className={styles.switchWrap}>
        <legend className={styles.srOnly}>{data.legende}</legend>

        {/* Versteckte, aber fokussierbare Radios steuern die Ansicht ohne JS. */}
        {data.strecken.map((s, i) => (
          <input
            key={s.id}
            type="radio"
            name="strecke"
            id={`strecke-${s.id}`}
            defaultChecked={i === 0}
            className={`${styles.radio} ${SWITCH[s.id].radio}`}
          />
        ))}

        <div className={styles.tabs}>
          {data.strecken.map((s) => (
            <label
              key={s.id}
              htmlFor={`strecke-${s.id}`}
              className={`${styles.tab} ${SWITCH[s.id].tab}`}
            >
              {s.label}
            </label>
          ))}
        </div>

        <div ref={ref} className={seqClass}>
          <div className={styles.seqline} aria-hidden="true">
            <RevealLine className={styles.seqfill} orientation="horizontal" />
          </div>

          {data.strecken.map((s) => (
            <div
              key={s.id}
              className={`${styles.mails} ${SWITCH[s.id].panel}`}
              role="img"
              aria-label={s.ariaLabel}
            >
              {s.mails.map((mail) => (
                <MailFenster key={mail.nr} mail={mail} />
              ))}
            </div>
          ))}
        </div>
      </fieldset>

      <p className={styles.seqnote}>
        {data.links.map((l) => (
          <TextLink
            key={l.label}
            href={l.target === "intern" ? internalHref(l.href!) : resolveCta(l)}
          >
            {l.label}
          </TextLink>
        ))}
      </p>
      <p className={styles.seqfoot}>{data.fussnote}</p>
    </>
  );
}
