import { Rise, RiseItem } from "@/components/motion/Rise";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { internalHref } from "@/lib/links";
import type { RegelnData } from "@/content/so-arbeitet-golfnext";
import styles from "./Regeln.module.css";

/**
 * 4 · „Drei Regeln für alles, was in Ihrem Namen rausgeht." – portiert aus 3.3b
 * .rules/.rgrid/.rule. Eigenes Navy-Band (Gradient + Sky-Schein) mit Eyebrow
 * (Signalgrün auf Navy), H2, Lead, drei Regelkarten (gestaffeltes Reveal über die
 * Motion-Infra) und einem on-dark-Link. Der Endzustand steht im Server-HTML (Rise setzt
 * `initial` erst nach Mount, ohne reduzierte Bewegung) → ohne JS sofort lesbar.
 * Texte wortgleich aus `content/so-arbeitet-golfnext.ts`.
 *
 * Der Link „Technik, Datenschutz und Schnittstellen" ist im Mock ein totes `<a>`; er
 * zeigt hier auf `/plattform` (dort stehen „Ihre Clubverwaltung bleibt, wo sie ist."
 * und „Vier Zusagen, die im Vertrag stehen.") – keine erfundene Route.
 */
export function Regeln({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: RegelnData;
}) {
  return (
    <section className={styles.rules}>
      <div className={styles.wrap}>
        <Eyebrow onDark className={styles.eyebrow}>
          {eyebrow}
        </Eyebrow>
        <h2 className={styles.h2}>{headline}</h2>
        <p className={styles.lead}>{lead}</p>

        <Rise className={styles.rgrid}>
          {data.regeln.map((r) => (
            <RiseItem key={r.n} className={styles.rule}>
              <div className={styles.rn}>{r.n}</div>
              <b>{r.title}</b>
              <p>{r.text}</p>
            </RiseItem>
          ))}
        </Rise>

        <a className={styles.b2} href={internalHref(data.link.href!)}>
          {data.link.label}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
