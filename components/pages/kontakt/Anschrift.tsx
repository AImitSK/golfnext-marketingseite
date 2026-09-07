import { Fragment } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { isLinkable, KONTAKT, ROUTES } from "@/config/site-structure";
import type { AnschriftData } from "@/content/kontakt";
import styles from "./Anschrift.module.css";

/**
 * 4 · „Wo wir zu finden sind" (portiert aus 3.10-kontakt.html, `.addr`).
 *
 * Drei Spalten: Anschrift, Erreichbarkeit, Rechtliches. Die Anschrift trägt die
 * beschrifteten Platzhalter aus dem Mock („Straße und Hausnummer folgt", „PLZ und
 * Ort folgt") – nichts wird erfunden, die echten Angaben kommen mit den Rechtstexten
 * (Masterplan 5.2).
 *
 * Impressum und Datenschutz laufen über `isLinkable`: Solange die Routen nicht `live`
 * sind, stehen sie als reiner Text da statt als `href="#"` – dasselbe Verhalten wie
 * in der Bodenleiste des Footers (Briefing 0022: kein toter Bedienpunkt für Tastatur
 * und Screenreader). Sie werden von selbst zu Links, sobald 5.2 gebaut ist.
 */

/** Beschriftung einer Rechtsroute aus der einen Wahrheit holen. */
function routeLabel(path: string): string {
  const route = ROUTES.find((r) => r.path === path);
  if (!route) throw new Error(`Route "${path}" fehlt in config/site-structure.ts`);
  return route.label;
}

function LegalEntry({ path }: { path: string }) {
  const label = routeLabel(path);
  return isLinkable(path) ? <TextLink href={path}>{label}</TextLink> : <span>{label}</span>;
}

export function Anschrift({
  eyebrow,
  headline,
  data,
}: {
  eyebrow: string;
  headline: string;
  data: AnschriftData;
}) {
  const telHref = `tel:${KONTAKT.telefon.replace(/\s+/g, "")}`;

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className={styles.h2}>{headline}</h2>

        <div className={styles.grid}>
          <div className={styles.col}>
            <p className={styles.label}>{data.anschrift.label}</p>
            <p className={styles.lines}>
              {data.anschrift.zeilen.map((zeile, index) => (
                <Fragment key={zeile.text}>
                  {index > 0 ? <br /> : null}
                  {zeile.muted ? <span className={styles.muted}>{zeile.text}</span> : zeile.text}
                </Fragment>
              ))}
            </p>
          </div>

          <div className={styles.col}>
            <p className={styles.label}>{data.erreichbarLabel}</p>
            <p className={styles.lines}>
              <a href={telHref}>{KONTAKT.telefon}</a>
              <br />
              <a href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>
              <br />
              <span className={styles.muted}>{KONTAKT.rueckmeldung}</span>
            </p>
          </div>

          <div className={styles.col}>
            <p className={styles.label}>{data.rechtlichesLabel}</p>
            <div className={styles.legal}>
              <LegalEntry path="/impressum" />
              <LegalEntry path="/datenschutz" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
