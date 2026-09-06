import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lead } from "@/components/ui/Lead";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Wrap } from "@/components/ui/Wrap";
import { internalHref } from "@/lib/links";
import type { UmschalterCard, UmschalterData } from "@/content/startseite";
import styles from "./Umschalter.module.css";

/**
 * 4 · Wachstum ↔ Clubprozesse (portiert aus 3.1-startseite.html, .switcher/.panes/
 * .pgrid/.pcard, Z.224–245, 720–799).
 *
 * Der Umschalter ist eine **echte Radiogruppe** (zwei versteckte, aber fokussierbare
 * `<input type="radio">` + `<label>`-Tabs): beide Ansichten sind gerendert, der Wechsel
 * läuft rein über CSS (`:checked`) – **ohne JavaScript** voll bedienbar und per Tastatur
 * (Pfeiltasten der nativen Radiogruppe) erreichbar. Kein „aus dem Sichtfeld fliegen":
 * die inaktive Ansicht ist einfach ausgeblendet, ein kurzer Übergang blendet die aktive
 * ein (unter `prefers-reduced-motion` sofort). Reine Server-Komponente.
 *
 * Modulstatus-Badges aus dem Mock werden bewusst NICHT gerendert (Benennungs-/Status-
 * Entscheidung: über Pilotkunden wird nicht gesprochen; die freigegebenen Texte tragen
 * ohnehin keinen Status). „Turnier-News" statt „Club News" (Benennungsregel).
 */

/** Dekorative 22-px-Icons je Karte (aria-hidden, Icon-Regel: nie ohne Größe). */
const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  className: styles.ic,
};

const WACHSTUM_ICONS: ReactNode[] = [
  <svg key="0" {...ICON_PROPS}>
    <path d="M3 19h18" />
    <path d="M7 19V6l9 3.2L7 12.5" />
  </svg>,
  <svg key="1" {...ICON_PROPS}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M2.5 19c1.2-2.9 3.6-4.2 6.5-4.2s5.3 1.3 6.5 4.2" />
    <path d="M17 6.5l2 2 3.5-3.5" />
  </svg>,
  <svg key="2" {...ICON_PROPS}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <path d="M2.5 10h19M6 14h4" />
  </svg>,
  <svg key="3" {...ICON_PROPS}>
    <path d="M4 20V8l6-3v15M14 20V11l6-3v12" />
    <path d="M2 20h20" />
  </svg>,
];

const PROZESSE_ICONS: ReactNode[] = [
  <svg key="0" {...ICON_PROPS}>
    <path d="M4 6h16v11H8l-4 4V6z" />
    <path d="M8 10h8M8 13h5" />
  </svg>,
  <svg key="1" {...ICON_PROPS}>
    <path d="M3 19h18" />
    <path d="M7 19V6l9 3.2L7 12.5" />
    <circle cx="17.5" cy="17" r="1.6" />
  </svg>,
  <svg key="2" {...ICON_PROPS}>
    <rect x="3" y="5" width="18" height="15" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>,
  <svg key="3" {...ICON_PROPS}>
    <path d="M4 19V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2z" />
    <path d="M8 7h7M8 11h7" />
  </svg>,
];

function Cards({ cards, icons }: { cards: UmschalterCard[]; icons: ReactNode[] }) {
  return (
    <div className={styles.pgrid}>
      {cards.map((card, i) => (
        <div key={card.title} className={styles.pcard}>
          {icons[i]}
          <h3 className={styles.pt}>{card.title}</h3>
          <p>{card.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Umschalter({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: UmschalterData;
}) {
  return (
    <Section>
      <Wrap>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{headline}</h2>
        <Lead>{lead}</Lead>

        <fieldset className={styles.switchWrap}>
          <legend className={styles.srOnly}>
            Ansicht wählen: Wachstum nach außen oder Entlastung nach innen
          </legend>
          {/* Versteckte, aber fokussierbare Radios steuern die Ansicht ohne JS. */}
          <input
            type="radio"
            name="startseite-umschalter"
            id="startseite-tab-wachstum"
            defaultChecked
            className={styles.inWachstum}
          />
          <input
            type="radio"
            name="startseite-umschalter"
            id="startseite-tab-prozesse"
            className={styles.inProzesse}
          />
          <div className={styles.switcher}>
            <label htmlFor="startseite-tab-wachstum" className={styles.tabWachstum}>
              Wachstum nach außen
            </label>
            <label htmlFor="startseite-tab-prozesse" className={styles.tabProzesse}>
              Entlastung nach innen
            </label>
          </div>

          <div className={styles.panes}>
            <div className={styles.paneWachstum}>
              <Cards cards={data.wachstum.cards} icons={WACHSTUM_ICONS} />
              <div className={styles.pcta}>
                <TextLink href={internalHref(data.wachstum.cta.href!)}>
                  {data.wachstum.cta.label}
                </TextLink>
              </div>
            </div>

            <div className={styles.paneProzesse}>
              <Cards cards={data.prozesse.cards} icons={PROZESSE_ICONS} />
              <p className={styles.extra}>
                <b>{data.prozesse.ergaenzungLabel}</b> {data.prozesse.ergaenzungValue}
              </p>
              <div className={styles.pcta}>
                <TextLink href={internalHref(data.prozesse.cta.href!)}>
                  {data.prozesse.cta.label}
                </TextLink>
              </div>
            </div>
          </div>
        </fieldset>
      </Wrap>
    </Section>
  );
}
