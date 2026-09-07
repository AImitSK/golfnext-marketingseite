import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/config/site-structure";
import type { Cta } from "@/content/types";
import { getNavModel } from "@/lib/navigation";
import { DesktopNav } from "./Nav";
import { MobileNav } from "./MobileNav";
import { Wortmarke } from "./Wortmarke";
import styles from "./Header.module.css";

/**
 * Sticky-Header aller Seiten (portiert aus 2.4-navigation-footer.html, .hdr).
 * Server-Shell: Wortmarke-Link links, Desktop-Navigation, ein grüner CTA rechts.
 * Die Interaktion (Dropdowns, Mobil-Menü) liegt in den Client-Teilen DesktopNav
 * und MobileNav. Der Header enthält bewusst KEINE <h1> (die Wortmarke ist ein Link).
 *
 * Navigation, Dropdown-Einträge und Status stammen ausschließlich aus
 * config/site-structure.ts (über getNavModel) – nur `live`-Routen, keine hart
 * kodierten Menüpunkte, keine Platzhalter-Links (Briefing 0022).
 *
 * `fallback`: markiert einen Header, den eine Seite selbst mitbringt, weil sie ohne
 * Shell laufen kann (`app/not-found.tsx`). Fällt dieselbe Seite doch einmal INNERHALB
 * der Shell an, blendet `app/globals.css` den zweiten Header aus – siehe dort.
 */
export function Header({ fallback = false }: { fallback?: boolean } = {}) {
  const items = getNavModel();

  // CTA-Ziel nie hart kodiert: Label/Hint aus site-structure, URL über resolveCta.
  const cta: Cta = {
    label: CTA.erstgespraech.label,
    hint: CTA.erstgespraech.hint,
    target: "erstgespraech",
  };

  return (
    <header className={styles.header} data-gn-fallback-header={fallback || undefined}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="GolfNext, zur Startseite">
          <Wortmarke className={styles.logoMark} />
        </Link>

        <DesktopNav items={items} />

        <div className={styles.cta}>
          <Button variant="header" cta={cta} secondLine={cta.hint}>
            {cta.label}
          </Button>
        </div>

        <MobileNav items={items} cta={cta} />
      </div>
    </header>
  );
}
