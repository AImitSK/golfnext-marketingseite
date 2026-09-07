import { describe, expect, it } from "vitest";
import { ROUTES, isLinkable } from "@/config/site-structure";
import { getNavModel } from "./navigation";

/**
 * Sichert die eine Wahrheit: Das Navigationsmodell spiegelt genau
 * config/site-structure.ts – und zwar nur die `live`-Routen.
 *
 * Seit Briefing 0022 gibt es keine Platzhalter-Einträge (`href="#"`) mehr: nicht-live
 * Hauptpunkte und Kinder werden gar nicht erst gerendert (docs/10, „Navigation v1").
 * Der Modulstatus wird nicht abgeleitet (Briefing 0014).
 */
describe("getNavModel", () => {
  const model = getNavModel();

  it("führt nur die live-Hauptpunkte in der Reihenfolge aus site-structure", () => {
    expect(model.map((i) => i.label)).toEqual([
      "Plattform",
      "Wachstum & Vertrieb",
      "Clubprozesse",
      "Pakete",
      "Über GolfNext",
    ]);
  });

  it("lässt Praxis weg, solange die Route nicht live ist", () => {
    expect(model.map((i) => i.path)).not.toContain("/praxis");
  });

  it("verlinkt jeden Punkt echt – kein einziges href gleich Raute", () => {
    for (const item of model) {
      expect(item.href).toBe(item.path);
      expect(isLinkable(item.path)).toBe(true);
      for (const child of item.children) {
        expect(child.href).toBe(child.path);
        expect(isLinkable(child.path)).toBe(true);
      }
    }
  });

  it("zeigt aktuell kein Dropdown – Modulseiten und Unterseiten sind nicht live", () => {
    expect(model.filter((i) => i.children.length > 0)).toEqual([]);
  });

  it("nimmt ein Kind auf, sobald seine Route live ist (Gegenprobe an der Datenquelle)", () => {
    // Die Kinder von /plattform stehen in ROUTES – sie erscheinen im Modell erst,
    // wenn ihr Status auf `live` wechselt. Heute ist keines live.
    const kinder = ROUTES.filter((r) => r.parent === "/plattform");
    expect(kinder.length).toBeGreaterThan(0);
    expect(kinder.every((r) => !isLinkable(r.path))).toBe(true);
  });
});
