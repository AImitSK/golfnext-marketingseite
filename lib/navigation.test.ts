import { describe, expect, it } from "vitest";
import { getNavModel } from "./navigation";

/**
 * Sichert die eine Wahrheit: Das Navigationsmodell spiegelt genau
 * config/site-structure.ts (Hauptpunkte, Dropdown-Kinder, Status, live/nicht-live).
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

  it("versieht nur Modul-Kinder mit einem Status, nicht die Unterseite", () => {
    const plattform = model.find((i) => i.path === "/plattform");
    const soArbeitet = plattform?.children.find((c) => c.path === "/plattform/so-arbeitet-golfnext");
    const reach = plattform?.children.find((c) => c.path === "/module/reach");
    const crm = plattform?.children.find((c) => c.path === "/module/marketing-crm");
    expect(soArbeitet?.status).toBeUndefined();
    expect(reach?.status).toBe("im-einsatz");
    expect(crm?.status).toBe("pilot");
  });

  it("verlinkt live-Routen echt (Pakete) und nicht-live Punkte als Platzhalter (#)", () => {
    for (const item of model) {
      if (item.path === "/pakete") {
        // Seit Schritt 2.1 ist /pakete live und wird echt verlinkt.
        expect(item.href).toBe("/pakete");
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
