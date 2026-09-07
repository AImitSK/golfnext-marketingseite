import { NAV_HAUPT, ROUTES, isLinkable } from "@/config/site-structure";

/**
 * Navigationsmodell für Header und Footer – abgeleitet aus der einen Wahrheit
 * `config/site-structure.ts`. Hier werden KEINE Menüpunkte oder Labels hart
 * kodiert; alles stammt aus NAV_HAUPT und ROUTES.
 *
 * Struktur v2 (Briefing 0023, Entscheidung Fred/Stefan vom 07.09.2026):
 *   Plattform ▾ (So arbeitet GolfNext) · Wachstum & Vertrieb · Clubprozesse ·
 *   Pakete · Über GolfNext ▾ (Praxis, Kontakt) · CTA
 * Praxis ist Kind von „Über GolfNext" geworden, Clubprozesse hat keine Kinder mehr,
 * `/team`, `/ratgeber` und die zwölf Modulseiten sind entfallen.
 *
 * - Es werden nur `live`-Routen aufgenommen: nicht-live Hauptpunkte und
 *   nicht-live Kinder erscheinen gar nicht mehr. Bis Briefing 0022 bekamen sie
 *   `href = "#"` – ein fokussierbarer Link, der nichts tut, also ein toter
 *   Bedienpunkt für Tastatur und Screenreader.
 * - Deshalb ist heute KEIN Dropdown sichtbar: „So arbeitet GolfNext", Praxis und
 *   Kontakt sind noch nicht `live` (ein Hauptpunkt ohne `live`-Kinder hat kein
 *   Dropdown). Die Hauptnavigation zeigt vorerst fünf reine Links. Die Dropdowns
 *   erscheinen von selbst, sobald eine dieser Routen in site-structure auf `live`
 *   geht – ohne Codeänderung.
 * - Die Platzhalterseiten (`/praxis`, `/kontakt`) bleiben per direkter URL
 *   erreichbar – sie sind nur nicht verlinkt.
 * - Der Modulstatus wird nicht abgeleitet oder angezeigt (Briefing 0014);
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
