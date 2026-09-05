import { MODULE, NAV_HAUPT, ROUTES, isLinkable } from "@/config/site-structure";

/** Die drei Modul-Reifegrade aus site-structure – zugleich gültige BadgeStatus-Werte. */
export type ModuleStatus = (typeof MODULE)[number]["status"];

/**
 * Navigationsmodell für Header (und später Footer) – abgeleitet aus der einen
 * Wahrheit `config/site-structure.ts`. Hier werden KEINE Menüpunkte, Labels oder
 * Status hart kodiert; alles stammt aus NAV_HAUPT, ROUTES und MODULE.
 *
 * - Ein Hauptpunkt bekommt ein Dropdown, sobald es in ROUTES Kinder mit
 *   `parent === item.path` gibt (aktuell nur „Plattform" und „Clubprozesse").
 * - `href`: nur `live`-Routen werden verlinkt (isLinkable); nicht-live Punkte
 *   erhalten `"#"` als Platzhalter und werden in Phase 2 automatisch aktiv,
 *   sobald ihr Status in site-structure auf `live` wechselt.
 * - `status`: nur Modul-Kinder tragen einen Status-Badge; er kommt aus MODULE
 *   (im-einsatz · pilot · in-entwicklung → BadgeStatus). Nicht-Module (z. B.
 *   „So arbeitet GolfNext") tragen bewusst keinen Badge (nichts erfinden).
 */

/** Platzhalter-Ziel für noch nicht `live` gesetzte Routen (wird in Phase 2 aktiv). */
const PLACEHOLDER_HREF = "#";

/** Modul-Status aus site-structure sind bereits die BadgeStatus-Werte. */
const MODULE_STATUS = new Map<string, ModuleStatus>(
  MODULE.map((m) => [`/module/${m.slug}`, m.status]),
);

/** Sichtbare Beschriftung der drei Modul-Status (wie Footer-Legende und Modulseiten). */
export const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  "im-einsatz": "Im Einsatz",
  pilot: "Pilot",
  "in-entwicklung": "In Entwicklung",
};

export interface NavChild {
  path: string;
  label: string;
  /** `path`, falls die Route `live` ist – sonst der Platzhalter `#`. */
  href: string;
  isLive: boolean;
  /** Nur für Modul-Kinder gesetzt (Status-Badge im Dropdown). */
  status?: ModuleStatus;
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
    status: MODULE_STATUS.get(r.path),
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
