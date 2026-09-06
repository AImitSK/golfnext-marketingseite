import { Portrait } from "@/components/ui/Portrait";
import type { JourneyData } from "@/content/startseite";
import styles from "./Zitat.module.css";

/**
 * Zitatblock (portiert aus 3.1-startseite.html, .quote, Z.206–221, 696–709).
 * Ersetzt den früheren blauen Zwischenblock durch ein echtes, persönliches Zitat
 * von Fred Hoffmann: großes typografisches Anführungszeichen, Zitat, Namenszeile
 * und ein kleines Porträt (Platzhalter, da das Foto noch fehlt). Bewusst **kein**
 * CTA – der Block darf nicht wie eine weitere Handlungsaufforderung wirken.
 */
export function Zitat({ quote }: { quote: JourneyData["quote"] }) {
  return (
    <figure className={styles.quote}>
      <Portrait size="large" tag="Foto folgt" className={styles.portrait} />
      <div className={styles.body}>
        <span className={styles.qmark} aria-hidden="true">
          &#8220;
        </span>
        <blockquote className={styles.bq}>{quote.text}</blockquote>
        <figcaption className={styles.name}>
          <b>{quote.name}</b>
          <span>{quote.role}</span>
        </figcaption>
      </div>
    </figure>
  );
}
