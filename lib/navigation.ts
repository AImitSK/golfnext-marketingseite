import { NAV_HAUPT, ROUTES, isLinkable } from "@/config/site-structure";

/**
 * Navigationsmodell für Header und Footer – abgeleitet aus der einen Wahrheit
 * `config/site-structure.ts`. Hier werden KEINE Menüpunkte oder Labels hart
 * kodiert; alles stammt aus NAV_HAUPT und ROUTES.
 *
 * - Ein Hauptpunkt bekommt ein Dropdown, sobald es in ROUTES Kinder mit
 *   `parent === item.path` gibt (aktuell nur „Plattform" und „Clubprozesse").
 * - `href`: nur `live`-Routen werden verlinkt (isLinkable); nicht-live Punkte
 *   erhalten `"#"` als Platzhalter und werden in Phase 2 automatisch aktiv,
 *   sobald ihr Status in site-structure auf `live` wechselt.
 * - Der Modulstatus wird nicht mehr abgeleitet oder angezeigt (Briefing 0014);
 *   das Datenfeld MODULE[].status bleibt in site-structure ungenutzt bestehen.
 */

/** Platzhalter-Ziel für noch nicht `live` gesetzte Routen (wird in Phase 2 aktiv). */
const PLACEHOLDER_HREF = "#";

export interface NavChild {
  path: string;
  label: string;
  /** `path`, falls die Route `live` ist – sonst der Platzhalter `#`. */
  href: string;
  isLive: boolean;
}

export interface NavItem {
  path: string;
  label: string;
  href: string;
  isLive: boolean;
  /** Kinder für das Dropdown; leer = kein Dropdown. */
  children: NavChild[];
}

function toHref(path: string): string {
  return isLinkable(path) ? path : PLACEHOLDER_HREF;
}

function childrenOf(parentPath: string): NavChild[] {
  return ROUTES.filter((r) => r.parent === parentPath).map((r) => ({
    path: r.path,
    label: r.label,
    href: toHref(r.path),
    isLive: isLinkable(r.path),
  }));
}

/** Baut das Hauptnavigationsmodell aus der Datenquelle. */
export function getNavModel(): NavItem[] {
  return NAV_HAUPT.map((item) => ({
    path: item.path,
    label: item.label,
    href: toHref(item.path),
    isLive: isLinkable(item.path),
    children: childrenOf(item.path),
  }));
}
