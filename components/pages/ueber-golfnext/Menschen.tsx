import { Rise, RiseItem } from "@/components/motion/Rise";
import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import type { MenschenData } from "@/content/ueber-golfnext";
import styles from "./Menschen.module.css";

/**
 * 4 · „Die Menschen dahinter“ – geteilte Sektions-Schale (paper) mit den beiden
 * Personenkarten (Fred, Stefan) samt Porträt-Platzhalter („Porträt folgt“, kein
 * Foto/Stock/KI), Fakten-Chips, der Fachpartner-/Technologiepartner-Zeile und dem
 * Haltungs-Block (zweiteiliges Zitat + erläuternder Text). Karten blenden gestaffelt
 * auf (Rise); Endzustand im Server-HTML → ohne JS lesbar. Texte wortgleich aus
 * `content/ueber-golfnext.ts`.
 */
export function Menschen({
  eyebrow,
  headline,
  lead,
  data,
}: {
  eyebrow: string;
  headline: string;
  lead: string;
  data: MenschenData;
}) {
  return (
    <PlattformSection eyebrow={eyebrow} headline={headline} lead={lead}>
      <Rise className={styles.team}>
        {data.personen.map((p) => (
          <RiseItem key={p.name} className={styles.tcard}>
            <div className={styles.pt} aria-hidden="true">
              <span className={styles.tag}>{data.portraitTag}</span>
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                focusable="false"
              >
                <circle cx="12" cy="9" r="4" />
                <path d="M4 21c1.6-4 4.6-6 8-6s6.4 2 8 6" />
              </svg>
            </div>
            <div className={styles.tb}>
              <div className={styles.rl}>{p.rolle}</div>
              <b>{p.name}</b>
              <p>{p.text}</p>
              <div className={styles.facts}>
                {p.facts.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            </div>
          </RiseItem>
        ))}
      </Rise>

      <p className={styles.partners}>{data.partner}</p>

      <div className={styles.haltung}>
        <p className={styles.hq}>
          {data.haltungLead} <em>{data.haltungEm}</em>
        </p>
        <p className={styles.ht}>{data.haltungText}</p>
      </div>
    </PlattformSection>
  );
}
