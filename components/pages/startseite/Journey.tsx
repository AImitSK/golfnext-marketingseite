import { Draw } from "@/components/motion/Draw";
import { Rise, RiseItem } from "@/components/motion/Rise";
import { JourneyToken } from "./JourneyToken";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lead } from "@/components/ui/Lead";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Wrap } from "@/components/ui/Wrap";
import { internalHref, resolveCta } from "@/lib/links";
import type { JourneyData } from "@/content/startseite";
import { Zitat } from "./Zitat";
import styles from "./Journey.module.css";

/**
 * 3 · Die GolfNext-Journey (portiert aus 3.1-startseite.html, .jr/.jsteps/.jband/
 * .quote, Z.150–221, 571–718). Obere Ebene: vier Journey-Stationen mit **unter-
 * schiedlich großen** Systemausschnitten (keine Reihe identischer Wireframe-Boxen).
 * Darunter: die zwei dauerhaften Plattformebenen Entlasten und Verbinden.
 *
 * Bewegung nach 1.7 / 0015: Die Verbindungslinie wird per `Draw` einmalig gezogen,
 * die vier Schritte blenden per `Rise` gestaffelt auf, und der „Kontakt"-Token
 * (`JourneyToken`) wandert **einmal** nachvollziehbar durch die vier Phasen und bleibt
 * dann am letzten Schritt stehen (Choreografie aus Mock 3.1 wieder aufgebaut). Der
 * Token ist rein dekorativ und wird nur mit JS gerendert – **ohne JS steht die Journey
 * vollständig und statisch** (Linie, Schritte, beide Plattformbänder sind Server-
 * Inhalt); `prefers-reduced-motion` zeigt den Token sofort am Endzustand. Die System-
 * ausschnitte sind dekorativ (`aria-hidden`); die Aussage steht in Titel und Text.
 */

/** Dekorativer Systemausschnitt je Schritt (aria-hidden, illustrativ aus Mock 3.1). */
function StepUi({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <div className={styles.jui} aria-hidden="true">
          <div className={`${styles.jbox} ${styles.chips}`}>
            <span>Kampagne</span>
            <span>Search</span>
            <span>Content</span>
          </div>
          <div className={styles.jbox}>
            <div className={styles.bl}>Suchergebnis</div>
            <div className={styles.bt}>Golf lernen in der Region</div>
            <div className={styles.brow} />
            <div className={`${styles.brow} ${styles.browS}`} />
          </div>
        </div>
      );
    case 1:
      return (
        <div className={styles.jui} aria-hidden="true">
          <div className={`${styles.jbox} ${styles.lp2}`}>
            <div className={styles.head}>
              <div className={styles.bl}>Landingpage</div>
              <div className={styles.bt}>Schnuppergolf im Frühjahr</div>
            </div>
            <div className={styles.body2}>
              <div className={styles.brow} />
              <div className={styles.brow} />
              <div className={`${styles.brow} ${styles.browS}`} />
              <span className={styles.cta3}>Kurs ansehen und anmelden</span>
            </div>
          </div>
        </div>
      );
    case 2:
      return (
        <div className={styles.jui} aria-hidden="true">
          <div className={styles.jbox}>
            <div className={styles.bl}>Anmeldung</div>
            <div className={styles.field}>Name</div>
            <div className={styles.field}>E-Mail</div>
          </div>
          <div className={styles.jbox}>
            <div className={styles.bl}>Buchung</div>
            <div className={styles.bt}>Platz im Kurs</div>
            <span className={styles.bchip}>bestätigt und bezahlt</span>
          </div>
        </div>
      );
    case 3:
      return (
        <div className={styles.jui} aria-hidden="true">
          <div className={styles.jbox}>
            <div className={styles.bl}>Marketing-CRM</div>
            <div className={styles.bt}>Zielgruppe: Einsteiger</div>
            <span className={styles.bchip}>Kontakt zugeordnet</span>
          </div>
          <div className={`${styles.jbox} ${styles.seqbox}`}>
            <div className={styles.bl}>Automatisierte E-Mail-Sequenz</div>
            <div className={styles.mailrow}>
              <i />
              Bestätigung
            </div>
            <div className={styles.mailrow}>
              <i />
              Orientierung
            </div>
            <div className={styles.mailrow}>
              <i />
              Erinnerung
            </div>
            <div className={styles.article2}>
              <div className={styles.al}>Eingebundener Inhalt</div>
              <div className={styles.at}>Ratgeber zum Schnuppergolf</div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function Journey({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: JourneyData;
}) {
  return (
    <Section variant="sand">
      <Wrap>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{headline}</h2>
        <Lead>{lead}</Lead>

        <div className={styles.jr} data-journey>
          <Draw className={styles.jrline} />
          <JourneyToken label="Kontakt" className={styles.jtoken} dotClassName={styles.jtokenDot} />
          <Rise className={styles.jsteps}>
            {data.steps.map((step, i) => (
              <RiseItem key={step.n} className={styles.js}>
                <span className={styles.knob} data-jstep aria-hidden="true" />
                <div className={styles.jn}>{step.n}</div>
                <div className={styles.jt}>{step.title}</div>
                <div className={styles.jd}>{step.text}</div>
                <StepUi index={i} />
              </RiseItem>
            ))}
          </Rise>

          <div className={styles.jbands}>
            {data.bands.map((band) => (
              <div key={band.name} className={styles.jband}>
                <div className={styles.bh}>
                  <i aria-hidden="true" />
                  <span>
                    <span className={styles.bn}>{band.name}</span>
                    <span className={styles.bd}>{band.text}</span>
                  </span>
                </div>
                <div className={styles.jacts2} aria-hidden="true">
                  {band.actions.map((action) => (
                    <span key={action}>{action}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Zitat quote={data.quote} />

        <div className={styles.jacts}>
          <Button variant="cta" href={internalHref(data.ctaPrimary.href!)}>
            {data.ctaPrimary.label}
          </Button>
          <TextLink href={resolveCta(data.ctaSecondary)}>{data.ctaSecondary.label}</TextLink>
        </div>
      </Wrap>
    </Section>
  );
}
