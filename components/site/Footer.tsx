import Link from "next/link";
import { isLinkable, KONTAKT, MODULE } from "@/config/site-structure";
import type { FooterClose as FooterCloseType } from "@/content/types";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { FooterClose } from "./FooterClose";
import { Wortmarke } from "./Wortmarke";
import styles from "./Footer.module.css";

/**
 * Dunkle Systemkarte am Fuß jeder Seite (portiert aus 2.4-navigation-footer.html,
 * .fx). Vier Zonen: Abschluss-CTA (FooterClose, prop-getrieben), Modul-Landkarte,
 * persönlicher Kontakt und Rechtszeile.
 *
 * Datengetrieben aus config/site-structure.ts: Modulnamen aus MODULE, Kontakt aus
 * KONTAKT. Impressum und Datenschutz laufen über isLinkable: nicht-live Ziele stehen
 * als reiner Text da statt als `href="#"` (Briefing 0022 – ein Link, der nichts tut,
 * ist für Tastatur und Screenreader ein toter Bedienpunkt). Sie werden automatisch zu
 * Links, sobald ihr Status in site-structure auf `live` geht. Die zwölf Modulnamen
 * sind seit Briefing 0023 dauerhaft Text: Modulseiten gibt es nicht mehr.
 * `footerClose` ist optional: fehlt es, entfällt der Abschluss-CTA und der Footer
 * beginnt mit der Modul-Landkarte (leere Seiten, Briefing 0022).
 * Der Modulstatus (im-einsatz/pilot/in-entwicklung) wird bewusst NICHT mehr angezeigt
 * (Briefing 0014): keine Status-Punkte, keine Legende. Reine Server-Komponente; nur
 * „Cookie-Einstellungen" ist ein kleiner Client-Button. Enthält bewusst KEINE <h1>.
 */

/** Die zwei Modulgruppen aus MODULE.gruppe mit ihren freigegebenen Spaltenlabeln. */
const GRUPPEN = [
  { key: "wachstum", label: "Wachstum nach außen", ops: false },
  { key: "clubprozesse", label: "Entlastung nach innen", ops: true },
] as const;

/**
 * Eintrag der Bodenleiste: Link, solange die Route `live` ist – sonst derselbe Text
 * ohne Link (kein `href="#"`, kein toter Fokuspunkt).
 */
function BarEntry({ path, label }: { path: string; label: string }) {
  return isLinkable(path) ? <a href={path}>{label}</a> : <span>{label}</span>;
}

export function Footer({ footerClose }: { footerClose?: FooterCloseType }) {
  const telHref = `tel:${KONTAKT.telefon.replace(/\s+/g, "")}`;

  return (
    <footer className={styles.footer}>
      {/* Ohne `footerClose` bleibt der Abschluss-CTA weg – über einer leeren Seite
          (Platzhalter, 404, Fehlerseite) steht kein Verkaufsblock (Briefing 0022). */}
      {footerClose ? <FooterClose footerClose={footerClose} /> : null}

      {/* Zone 2 · Modul-Landkarte aus MODULE */}
      <section className={styles.map} aria-label="Module im Überblick">
        <div className={styles.mapInner}>
          <div className={styles.mh}>
            <b>Plattform auf einen Blick</b>
            <span>Zwölf Module, zwei Richtungen, ein Vertrag</span>
          </div>
          <div className={styles.cols}>
            {GRUPPEN.map((gruppe) => (
              <div
                key={gruppe.key}
                className={gruppe.ops ? `${styles.col} ${styles.colOps}` : styles.col}
              >
                <b>{gruppe.label}</b>
                <div className={styles.mods}>
                  {/* Die Landkarte nennt alle zwölf Module – als Namen, nicht als
                      Links: Modulseiten gibt es seit Briefing 0023 nicht mehr. */}
                  {MODULE.filter((m) => m.gruppe === gruppe.key).map((m) => (
                    <span key={m.slug} className={styles.mod}>
                      <b>{m.name}</b>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone 3 · Persönlicher Kontakt aus KONTAKT */}
      <section className={styles.contact} aria-label="Kontakt">
        <div className={styles.contactInner}>
          <div>
            <span className={styles.cl}>Persönlicher Kontakt</span>
            <div className={styles.big}>{KONTAKT.name}</div>
          </div>
          <div>
            <span className={styles.cl}>Ansprechpartner</span>
            <p className={styles.line}>{KONTAKT.rolle}</p>
          </div>
          <div>
            <span className={styles.cl}>Direkt erreichbar</span>
            <p className={styles.line}>
              <a href={telHref}>{KONTAKT.telefon}</a>
            </p>
            <p className={styles.line}>
              <a href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>
            </p>
            <p className={styles.sm}>{KONTAKT.rueckmeldung}</p>
          </div>
        </div>
      </section>

      {/* Zone 4 · Rechtszeile */}
      <div className={styles.bar}>
        <Link href="/" className={styles.barLogo} aria-label="GolfNext, zur Startseite">
          <Wortmarke />
        </Link>
        <span>© 2026 GolfNext</span>
        <BarEntry path="/impressum" label="Impressum" />
        <BarEntry path="/datenschutz" label="Datenschutz" />
        <CookieSettingsButton className={styles.cookieBtn} />
        {/* Die Zeile „Ein Produkt von SK Online Marketing und Fred Hoffmann" gehört laut
            Umsetzungsbriefing 3.1 (Tabelle 6) nicht in den sichtbaren Footer, sondern ins
            Impressum – hier bewusst entfernt (matcht Mock 3.1). */}
      </div>
    </footer>
  );
}
