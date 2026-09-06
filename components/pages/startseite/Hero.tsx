import { RevealLine } from "@/components/motion/RevealLine";
import { Rise, RiseItem } from "@/components/motion/Rise";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { resolveCta } from "@/lib/links";
import type { HeroData } from "@/content/startseite";
import styles from "./Hero.module.css";

/**
 * 1 · Hero (portiert aus 3.1-startseite.html, .hero/.sysview, Z.62–103, 441–509).
 * Links: Eyebrow, die einzige `<h1>` der Seite (zweizeilig), Lead, primärer grüner
 * CTA (Erstgespräch) und sekundäre on-dark-Aktion (Live-Demo). Rechts: die
 * verbundene Vertriebs-/Kommunikationsstrecke (Concierge/Platzstatus wurden bewusst
 * entfernt) mit benannter E-Mail-Sequenz und eingebundenem Ratgeber-Inhalt.
 *
 * Bewegung nach 1.7 / 0015: Die Verbindungslinie (`.track`) baut sich beim Rein-
 * scrollen von oben auf (`RevealLine`, `scaleY`), die Stationen blenden als
 * `Rise`-Container mit `RiseItem`-Kindern gestaffelt ein und bleiben stehen.
 * Server-HTML zeigt den Endzustand → ohne JS voll sichtbar; `useReducedMotion`
 * zeigt sofort den Endzustand (Wrapper-Logik). Kein CLS (nur transform/opacity).
 */
export function Hero({
  eyebrow,
  headlineLines,
  lead,
  data,
}: {
  eyebrow: string;
  headlineLines: string[];
  lead: string;
  data: HeroData;
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.in}>
        <div>
          <Eyebrow onDark>{eyebrow}</Eyebrow>
          <h1 className={styles.h1}>
            <span className={styles.br}>{headlineLines[0]}</span> {headlineLines[1]}
          </h1>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.acts}>
            <Button variant="cta" cta={data.ctaPrimary} secondLine={data.ctaPrimary.hint}>
              {data.ctaPrimary.label}
            </Button>
            <a className={styles.b2} href={resolveCta(data.ctaSecondary)}>
              {data.ctaSecondary.label}
            </a>
          </div>
        </div>

        <div className={styles.sysview} aria-label={data.ariaLabel}>
          <RevealLine orientation="vertical" className={styles.track} />
          <Rise className={styles.stations}>
            {data.stations.map((stn) => (
              <RiseItem
                key={stn.label}
                className={stn.seq ? `${styles.stn} ${styles.seq}` : styles.stn}
              >
                <span className={styles.knot} aria-hidden="true" />
                <div className={styles.cardUi}>
                  <div className={styles.cl}>{stn.label}</div>
                  <div className={styles.ct}>{stn.title}</div>
                  {stn.sub ? (
                    <div className={styles.subcard}>
                      <div className={styles.sl}>{stn.sub.label}</div>
                      <div className={styles.stt}>{stn.sub.title}</div>
                    </div>
                  ) : (
                    <div className={styles.bars} aria-hidden="true">
                      <i />
                      <i />
                    </div>
                  )}
                </div>
              </RiseItem>
            ))}
          </Rise>
        </div>
      </div>
    </section>
  );
}
