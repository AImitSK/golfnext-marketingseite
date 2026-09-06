import type { VertrauenData } from "@/content/startseite";
import styles from "./Vertrauensleiste.module.css";

/**
 * 2 · Vertrauensleiste (portiert aus 3.1b .trustbar): „Entwickelt mit" + die
 * Namen der Entwicklungspartner-Clubs, rechts „Hosting in Deutschland" und
 * „Ansprechpartner: PGA Golfprofessional". Reine Server-Komponente, kein
 * Modulstatus, keine erfundenen Zahlen. Der Rehburg-Loccum-Wortlaut bleibt erhalten.
 */
export function Vertrauensleiste({ data }: { data: VertrauenData }) {
  return (
    <section className={styles.trustbar} aria-label="Entwickelt mit Golfclubs">
      <div className={styles.inner}>
        <span className={styles.lab}>{data.label}</span>
        <div className={styles.clubs}>
          {data.clubs.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        <div className={styles.sp}>
          {data.siegel.map((s) => (
            <span key={s}>
              <i aria-hidden="true" />
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
