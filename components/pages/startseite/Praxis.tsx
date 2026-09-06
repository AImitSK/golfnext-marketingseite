import { CountUp } from "@/components/motion/CountUp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lead } from "@/components/ui/Lead";
import { Section } from "@/components/ui/Section";
import { Shot } from "@/components/ui/Shot";
import { TextLink } from "@/components/ui/TextLink";
import { Wrap } from "@/components/ui/Wrap";
import { internalHref } from "@/lib/links";
import type { PraxisData } from "@/content/startseite";
import styles from "./Praxis.module.css";

/**
 * 5 · GolfNext in der Praxis (portiert aus 3.1-startseite.html, .anna/.chatbox/.nums/
 * .second, Z.246–305, 801–882).
 *
 * Links das ANNA-Chatfenster (illustrative Beispiel-Konversation aus Mock 3.1), rechts
 * die Textspalte mit den bestätigten Kennzahlen. Die Kennzahlen **zählen einmal hoch**
 * beim Sichtbarwerden (`CountUp`, Briefing 0015): der Endwert steht im Server-HTML –
 * ohne JS und bei `prefers-reduced-motion` sofort der fertige, **wortgleiche** Wert.
 * Alle Werte bleiben jederzeit lesbar; nichts wird erfunden. Zweites Beispiel (Bad
 * Wörishofen) mit `Shot`-Platzhalter für das noch fehlende Foto und dem geteilten
 * Karten-Hover-Lift. Reine Server-Komponente (die Client-Zutaten kapselt `CountUp`).
 */
export function Praxis({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: PraxisData;
}) {
  const { chat, anna, second } = data;

  return (
    <Section variant="mist">
      <Wrap>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{headline}</h2>
        <Lead>{lead}</Lead>

        <div className={styles.anna}>
          {/* ANNA-Chatfenster */}
          <div className={styles.chatbox}>
            <div className={styles.ch}>
              <span className={styles.av} aria-hidden="true">
                A
              </span>
              <span className={styles.who}>
                <b>{chat.name}</b>
                <em>{chat.role}</em>
              </span>
              <span className={styles.live}>
                <i aria-hidden="true" />
                {chat.liveLabel}
              </span>
            </div>
            <div className={styles.chatbody}>
              {chat.messages.map((m, i) => (
                <div
                  key={i}
                  className={m.from === "q" ? `${styles.msg} ${styles.q}` : `${styles.msg} ${styles.a}`}
                >
                  <span className={styles.bub}>{m.text}</span>
                  <span className={styles.mt}>{m.time}</span>
                </div>
              ))}
            </div>
            <div className={styles.chatfoot} aria-hidden="true">
              <span className={styles.fake}>{chat.placeholder}</span>
              <span className={styles.send}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M5 12h13M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Textspalte mit statischen Kennzahlen */}
          <div className={styles.annaside}>
            <span className={styles.tag}>{anna.tag}</span>
            <h3 className={styles.annaH}>{anna.title}</h3>
            <p className={styles.annaP}>{anna.text}</p>
            <div className={styles.nums}>
              {anna.kennzahlen.map((k) => (
                <div key={k.label} className={styles.num}>
                  <CountUp className={styles.n} value={k.value} />
                  <div className={styles.l}>{k.label}</div>
                </div>
              ))}
            </div>
            <span className={styles.statusline}>
              <i aria-hidden="true" />
              {anna.status}
            </span>
            <div className={styles.annaCta}>
              <TextLink href={internalHref(anna.cta.href!)}>{anna.cta.label}</TextLink>
            </div>
          </div>
        </div>

        {/* Zweites Praxisbeispiel */}
        <div className={`${styles.second} gn-card-lift`}>
          <Shot
            ratio="4/3"
            tagline={second.shot.tagline}
            title={second.shot.title}
            text={second.shot.text}
            className={styles.secondShot}
          />
          <div>
            <span className={styles.club}>{second.club}</span>
            <h3 className={styles.secondH}>{second.title}</h3>
            <p className={styles.secondP}>{second.text}</p>
            <span className={styles.meta}>{second.meta}</span>
            <div className={styles.secondCta}>
              <TextLink href={internalHref(second.cta.href!)}>{second.cta.label}</TextLink>
            </div>
          </div>
        </div>

        <div className={styles.seccta}>
          <TextLink href={internalHref(data.cta.href!)}>{data.cta.label}</TextLink>
        </div>
      </Wrap>
    </Section>
  );
}
