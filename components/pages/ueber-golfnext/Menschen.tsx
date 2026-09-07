import Image from "next/image";
import { PERSONEN } from "@/lib/people";
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
        {data.personen.map((p, i) => (
          <RiseItem key={p.name} className={styles.tcard}>
            {/* Echtes Porträt (seit 07.09.2026). `aria-hidden`, weil Name und Rolle
                direkt daneben stehen – das Bild trägt keine eigene Information. */}
            <div className={styles.pt} aria-hidden="true">
              <Image
                src={PERSONEN[i].hoch}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 380px"
                className={styles.foto}
              />
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
