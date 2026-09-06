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
 * KONTAKT. Modul-/Impressum-/Datenschutz-Links laufen über isLinkable – nicht-live
 * Ziele bleiben `#` und werden automatisch aktiv, sobald ihr Status auf `live` geht.
 * Der Modulstatus (im-einsatz/pilot/in-entwicklung) wird bewusst NICHT mehr angezeigt
 * (Briefing 0014): keine Status-Punkte, keine Legende. Reine Server-Komponente; nur
 * „Cookie-Einstellungen" ist ein kleiner Client-Button. Enthält bewusst KEINE <h1>.
 */

/** Die zwei Modulgruppen aus MODULE.gruppe mit ihren freigegebenen Spaltenlabeln. */
const GRUPPEN = [
  { key: "wachstum", label: "Wachstum nach außen", ops: false },
  { key: "clubprozesse", label: "Entlastung nach innen", ops: true },
] as const;

function moduleHref(slug: string): string {
  const path = `/module/${slug}`;
  return isLinkable(path) ? path : "#";
}

function routeHref(path: string): string {
  return isLinkable(path) ? path : "#";
}

export function Footer({ footerClose }: { footerClose: FooterCloseType }) {
  const telHref = `tel:${KONTAKT.telefon.replace(/\s+/g, "")}`;

  return (
    <footer className={styles.footer}>
      <FooterClose footerClose={footerClose} />

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
                  {MODULE.filter((m) => m.gruppe === gruppe.key).map((m) => (
                    <a key={m.slug} href={moduleHref(m.slug)} className={styles.mod}>
                      <b>{m.name}</b>
                    </a>
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
        <a href={routeHref("/impressum")}>Impressum</a>
        <a href={routeHref("/datenschutz")}>Datenschutz</a>
        <CookieSettingsButton className={styles.cookieBtn} />
        <span className={styles.sp}>Ein Produkt von SK Online Marketing und Fred Hoffmann</span>
      </div>
    </footer>
  );
}
