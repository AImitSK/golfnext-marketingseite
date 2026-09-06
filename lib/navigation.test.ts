import { describe, expect, it } from "vitest";
import { getNavModel } from "./navigation";

/**
 * Sichert die eine Wahrheit: Das Navigationsmodell spiegelt genau
 * config/site-structure.ts (Hauptpunkte, Dropdown-Kinder, live/nicht-live).
 * Der Modulstatus wird nicht mehr abgeleitet (Briefing 0014).
 */
describe("getNavModel", () => {
  const model = getNavModel();

  it("führt die sechs Hauptpunkte in Reihenfolge", () => {
    expect(model.map((i) => i.label)).toEqual([
      "Plattform",
      "Wachstum & Vertrieb",
      "Clubprozesse",
      "Praxis",
      "Pakete",
      "Über GolfNext",
    ]);
  });

  it("gibt genau zwei Hauptpunkten ein Dropdown (Plattform, Clubprozesse)", () => {
    const withDropdown = model.filter((i) => i.children.length > 0).map((i) => i.label);
    expect(withDropdown).toEqual(["Plattform", "Clubprozesse"]);
  });

  it("listet unter Plattform die Unterseite und die Wachstums-Module", () => {
    const plattform = model.find((i) => i.path === "/plattform");
    expect(plattform?.children.map((c) => c.label)).toEqual([
      "So arbeitet GolfNext",
      "Reach",
      "Search",
      "Landingpages",
      "Marketing-CRM",
      "Lifecycle",
      "Content",
    ]);
  });

  it("leitet keinen Modulstatus mehr ab (Anzeige entfällt, Briefing 0014)", () => {
    const plattform = model.find((i) => i.path === "/plattform");
    const reach = plattform?.children.find((c) => c.path === "/module/reach");
    // Der Status ist kein Feld des Navigationsmodells mehr.
    expect(reach).toBeDefined();
    expect(reach && "status" in reach).toBe(false);
  });

  it("verlinkt live-Routen echt (Plattform, Wachstum & Vertrieb, Clubprozesse, Pakete) und nicht-live Punkte als Platzhalter (#)", () => {
    // Live-Hauptpunkte: /pakete (Schritt 2.1), /plattform (Schritt 2.3, Briefing 0016),
    // /wachstum-vertrieb (Schritt 2.5, Briefing 0017) und /clubprozesse (Schritt 2.6, Briefing 0018).
    const liveHaupt = new Set(["/pakete", "/plattform", "/wachstum-vertrieb", "/clubprozesse"]);
    for (const item of model) {
      if (liveHaupt.has(item.path)) {
        expect(item.href).toBe(item.path);
        expect(item.isLive).toBe(true);
      } else {
        expect(item.href).toBe("#");
        expect(item.isLive).toBe(false);
      }
      // Dropdown-Kinder (Module/Unterseiten) sind weiterhin nicht live.
      for (const child of item.children) {
        expect(child.href).toBe("#");
      }
    }
  });
});
