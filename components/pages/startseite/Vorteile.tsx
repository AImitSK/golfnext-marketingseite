import { Rise, RiseItem } from "@/components/motion/Rise";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Wrap } from "@/components/ui/Wrap";
import { internalHref } from "@/lib/links";
import type { Vorteil, VorteileData } from "@/content/startseite";
import styles from "./Vorteile.module.css";

/**
 * 2 · Die konkreten Vorteile (portiert aus 3.1-startseite.html, .vg/.vc/.viz,
 * Z.105–148, 512–569). Vier Karten mit Titel, Text und einer **feststehenden**
 * Mikrovisualisierung (kein Hover-Trigger, kein Dauerlauf – Briefing). Die Visuals
 * sind dekorativ (`aria-hidden`) und wirken wie fertige Oberflächen.
 *
 * Bewegung nach 1.7 / 0015: `Rise`-Container blendet die Karten einmalig gestaffelt
 * auf; die Mikrovisualisierungen selbst stehen fest. Die Karten tragen den geteilten
 * Hover-Lift (`gn-card-lift`: Navy-Rahmen + Schatten + 2 px anheben). Endzustand im
 * Server-HTML.
 */

/** Fixe 26-px-Kopf-Icons je Karte (dekorativ, Icon-Regel: nie ohne Größe). */
function CardIcon({ viz }: { viz: Vorteil["viz"] }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };
  switch (viz) {
    case "funnel":
      return (
        <svg {...common}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "crm":
      return (
        <svg {...common}>
          <circle cx="9" cy="8.5" r="3.2" />
          <path d="M2.5 19c1.2-2.9 3.6-4.2 6.5-4.2s5.3 1.3 6.5 4.2" />
          <path d="M17 6.5l2 2 3.5-3.5" />
        </svg>
      );
    case "done":
      return (
        <svg {...common}>
          <path d="M4.5 12.5l5 5 10-11" />
          <path d="M3 20h18" />
        </svg>
      );
  }
}

/**
 * Feststehende Mikrovisualisierung je Karte. Rein dekorativ (`aria-hidden`) – die
 * kleinen Labels sind illustrativ (aus Mock 3.1) und tragen keine Zusagen; die
 * verbindlichen Aussagen stehen in Titel und Text der Karte.
 */
function Viz({ viz }: { viz: Vorteil["viz"] }) {
  switch (viz) {
    case "funnel":
      return (
        <div className={`${styles.viz} ${styles.funnel}`} aria-hidden="true">
          <div className={styles.vl}>Reichweite → Anfrage</div>
          <div className={styles.fbars}>
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className={styles.fout}>
            <span className={styles.qd} />1 qualifizierte Anfrage
          </div>
        </div>
      );
    case "book":
      return (
        <div className={`${styles.viz} ${styles.book}`} aria-hidden="true">
          <div className={styles.vl}>Nächster Schritt</div>
          <div className={styles.step}>
            <span className={styles.ic2}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            Kurstermin wählen
          </div>
          <div className={styles.arrowdown} />
          <div className={styles.conf}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 12.5l5 5 10-11" />
            </svg>
            Buchung bestätigt
          </div>
        </div>
      );
    case "crm":
      return (
        <div className={`${styles.viz} ${styles.crm}`} aria-hidden="true">
          <div className={styles.vl}>Marketing-CRM</div>
          <div className={styles.cols}>
            <div className={styles.col}>
              <div className={styles.cn}>Neu</div>
              <i />
              <i />
            </div>
            <div className={styles.col}>
              <div className={styles.cn}>Interessent</div>
              <i />
              <i />
              <i />
            </div>
            <div className={styles.col}>
              <div className={styles.cn}>Teilnehmer</div>
              <i />
            </div>
          </div>
        </div>
      );
    case "done":
      return (
        <div className={`${styles.viz} ${styles.done}`} aria-hidden="true">
          <div className={styles.vl}>Wiederkehrende Aufgaben</div>
          <div className={`${styles.tk} ${styles.ok}`}>
            <span className={styles.bx} />
            <span>Bestätigung versendet</span>
            <span className={styles.tag2}>erledigt</span>
          </div>
          <div className={`${styles.tk} ${styles.ok}`}>
            <span className={styles.bx} />
            <span>Erinnerung geplant</span>
            <span className={styles.tag2}>erledigt</span>
          </div>
          <div className={styles.tk}>
            <span className={styles.bx} />
            <span>Rückruf durch das Team</span>
          </div>
        </div>
      );
  }
}

export function Vorteile({
  eyebrow,
  headline,
  data,
}: {
  eyebrow: string;
  headline: string;
  data: VorteileData;
}) {
  return (
    <Section>
      <Wrap>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{headline}</h2>
        <Rise className={styles.vg}>
          {data.cards.map((card) => (
            <RiseItem key={card.title} className={`${styles.vc} gn-card-lift`}>
              <CardIcon viz={card.viz} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <Viz viz={card.viz} />
            </RiseItem>
          ))}
        </Rise>
        <div className={styles.seccta}>
          <TextLink href={internalHref(data.cta.href!)}>{data.cta.label}</TextLink>
        </div>
      </Wrap>
    </Section>
  );
}
