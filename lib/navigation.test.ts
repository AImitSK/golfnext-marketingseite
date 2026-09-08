import { describe, expect, it } from "vitest";
import { MODULE, ROUTES, isLinkable } from "@/config/site-structure";
import { getNavModel } from "./navigation";

/**
 * Sichert die eine Wahrheit: Das Navigationsmodell spiegelt genau
 * config/site-structure.ts – und zwar nur die `live`-Routen.
 *
 * Struktur v2 (Briefing 0023, 07.09.2026):
 *   Plattform ▾ (So arbeitet GolfNext) · Wachstum & Vertrieb · Clubprozesse ·
 *   Pakete · Über GolfNext ▾ (Praxis, Kontakt) · CTA
 *
 * Seit Briefing 0022 gibt es keine Platzhalter-Einträge (`href="#"`) mehr: nicht-live
 * Hauptpunkte und Kinder werden gar nicht erst gerendert. Der Modulstatus wird nicht
 * abgeleitet (Briefing 0014).
 *
 * Seit Briefing 0024 ist `/plattform/so-arbeitet-golfnext` gebaut und `live` – damit
 * trägt „Plattform" das erste Dropdown, mit genau diesem einen Punkt. Seit Briefing 0025
 * ist `/kontakt` gebaut und `live` – damit hat auch „Über GolfNext" ein Dropdown, das
 * bisher nur „Kontakt" enthält (`/praxis` bleibt Platzhalter bis Phase 3).
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

  it("führt Praxis nicht mehr als Hauptpunkt", () => {
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

  it("zeigt zwei Dropdowns: Plattform und Über GolfNext", () => {
    const mitDropdown = model.filter((i) => i.children.length > 0);
    expect(mitDropdown.map((i) => i.path)).toEqual(["/plattform", "/ueber-golfnext"]);
    expect(mitDropdown[0]!.children).toEqual([
      {
        path: "/plattform/so-arbeitet-golfnext",
        label: "So arbeitet GolfNext",
        href: "/plattform/so-arbeitet-golfnext",
      },
    ]);
  });

  it("führt „Ratgeber“ und „Kontakt“ im Über-GolfNext-Dropdown", () => {
    // Seit 08.09.2026 ist `/praxis` live (Masterplan 3.4); der Menüpunkt heißt
    // „Ratgeber", die Adresse bleibt `/praxis`. Reihenfolge wie in ROUTES.
    const ueber = model.find((i) => i.path === "/ueber-golfnext");
    expect(ueber?.children).toEqual([
      { path: "/praxis", label: "Ratgeber", href: "/praxis" },
      { path: "/kontakt", label: "Kontakt", href: "/kontakt" },
    ]);
  });
});

/**
 * Die Datenlage hinter der Navigation – unabhängig davon, was heute `live` ist.
 * Diese Tests halten die Struktur v2 fest; das Modell oben zieht automatisch nach,
 * sobald eine Route auf `live` wechselt.
 */
describe("Struktur v2 in site-structure", () => {
  const kinderVon = (parent: string) =>
    ROUTES.filter((r) => r.parent === parent).map((r) => r.path);

  it("hängt Praxis und Kontakt unter Über GolfNext – in dieser Reihenfolge", () => {
    expect(kinderVon("/ueber-golfnext")).toEqual(["/praxis", "/kontakt"]);
  });

  it("lässt /plattform genau ein Kind: So arbeitet GolfNext", () => {
    expect(kinderVon("/plattform")).toEqual(["/plattform/so-arbeitet-golfnext"]);
  });

  it("gibt Clubprozesse keine Kinder mehr", () => {
    expect(kinderVon("/clubprozesse")).toEqual([]);
  });

  it("kennt /team, /ratgeber und die Modulrouten nicht mehr", () => {
    const pfade = ROUTES.map((r) => r.path);
    expect(pfade).not.toContain("/team");
    expect(pfade).not.toContain("/ratgeber");
    expect(pfade.filter((p) => p.startsWith("/module/"))).toEqual([]);
  });

  it("liefert nicht-live Kinder gar nicht erst aus", () => {
    // Seit 08.09.2026 ist `/praxis` live (Masterplan 3.4) – damit ist derzeit jedes
    // Kind live, die Liste ist leer. Die Regel bleibt trotzdem festgehalten: Was
    // nicht `live` ist, taucht im Modell nicht auf.
    const nichtLiveKinder = ROUTES.filter((r) => r.parent && !isLinkable(r.path)).map(
      (r) => r.path,
    );
    expect(nichtLiveKinder).toEqual([]);

    const imModell = getNavModel().flatMap((i) => i.children.map((c) => c.path));
    expect(imModell).toEqual(["/plattform/so-arbeitet-golfnext", "/praxis", "/kontakt"]);
    for (const pfad of nichtLiveKinder) {
      expect(imModell).not.toContain(pfad);
    }
  });

  it("behält die zwölf Modulnamen als reine Datenliste", () => {
    expect(MODULE).toHaveLength(12);
    expect(MODULE.map((m) => m.name)).toContain("Turnier-News");
  });
});
