import { NAV_HAUPT, ROUTES, isLinkable } from "@/config/site-structure";

/**
 * Navigationsmodell für Header und Footer – abgeleitet aus der einen Wahrheit
 * `config/site-structure.ts`. Hier werden KEINE Menüpunkte oder Labels hart
 * kodiert; alles stammt aus NAV_HAUPT und ROUTES.
 *
 * - Es werden nur `live`-Routen aufgenommen: nicht-live Hauptpunkte und
 *   nicht-live Kinder erscheinen gar nicht mehr. Bis Briefing 0022 bekamen sie
 *   `href = "#"` – ein fokussierbarer Link, der nichts tut, also ein toter
 *   Bedienpunkt für Tastatur und Screenreader. `docs/10-launch-umfang.md` legt für
 *   „Navigation v1" ohnehin fest: Plattform · Wachstum & Vertrieb · Clubprozesse ·
 *   Pakete · Über GolfNext · CTA – Praxis entfällt, bis das Briefing da ist.
 * - Damit sind aktuell auch die beiden Modul-Dropdowns leer und werden nicht
 *   gerendert (ein Hauptpunkt ohne `live`-Kinder hat kein Dropdown). Sie kommen
 *   automatisch zurück, sobald eine Route in site-structure auf `live` geht.
 * - Die Platzhalterseiten (`/praxis`, `/team`, `/kontakt`, `/module/<slug>`) bleiben
 *   per direkter URL erreichbar – sie sind nur nicht verlinkt.
 * - Der Modulstatus wird nicht mehr abgeleitet oder angezeigt (Briefing 0014);
 *   das Datenfeld MODULE[].status bleibt in site-structure ungenutzt bestehen.
 */

export interface NavChild {
  path: string;
  label: string;
  /** Immer `path` – nicht-live Kinder stehen gar nicht erst im Modell. */
  href: string;
}

export interface NavItem {
  path: string;
  label: string;
  href: string;
  /** Kinder für das Dropdown; leer = kein Dropdown. */
  children: NavChild[];
}

function childrenOf(parentPath: string): NavChild[] {
  return ROUTES.filter((r) => r.parent === parentPath && isLinkable(r.path)).map((r) => ({
    path: r.path,
    label: r.label,
    href: r.path,
  }));
}

/** Baut das Hauptnavigationsmodell aus der Datenquelle – nur `live`-Routen. */
export function getNavModel(): NavItem[] {
  return NAV_HAUPT.filter((item) => isLinkable(item.path)).map((item) => ({
    path: item.path,
    label: item.label,
    href: item.path,
    children: childrenOf(item.path),
  }));
}
