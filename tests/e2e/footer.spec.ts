import { expect, test } from "@playwright/test";

/**
 * Footer (Baustein 0005) auf der Vorschau /_bausteine. Läuft über alle
 * Breakpoint-Projekte (390–1440). Prüft die Korrekturen aus Briefing 0014:
 * Modulstatus (Punkte/Legende) entfällt, der Inhalt spannt über die volle Breite.
 */
test.describe("Footer · Modulkarte ohne Status (Briefing 0014)", () => {
  test("listet Modulnamen als Links, ohne Status-Punkte und ohne Legende", async ({ page }) => {
    await page.goto("/_bausteine");

    const footer = page.locator("footer");
    const map = footer.getByRole("region", { name: "Module im Überblick" });

    // Module erscheinen weiterhin als Links (Beispiele aus beiden Gruppen).
    await expect(map.getByRole("link", { name: "Reach", exact: true })).toBeVisible();
    await expect(map.getByRole("link", { name: "Platzstatus", exact: true })).toBeVisible();

    // Nicht-live Module bleiben Platzhalter (#).
    const hrefs = await map
      .locator("a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toBe("#");
    }

    // Keine Status-Legende mehr im Footer.
    for (const label of ["Im Einsatz", "Pilot", "In Entwicklung"]) {
      await expect(footer.getByText(label, { exact: true })).toHaveCount(0);
    }
  });
});

test.describe("Footer · volle Breite (Briefing 0014)", () => {
  test("Inhalt ist nicht mehr auf 1140 px begrenzt", async ({ page }) => {
    await page.goto("/_bausteine");
    const vp = page.viewportSize();
    test.skip(!vp || vp.width <= 1200, "nur oberhalb der Wrap-Breite aussagekräftig");

    // Die Modulkarte-Innenzone nutzt die volle Breite (kein max-width:1140 mehr):
    // ihre Breite liegt nahe an der Viewport-Breite (minus Gutter), deutlich über 1140.
    const inner = page.locator("footer section[aria-label='Module im Überblick'] > div").first();
    const box = await inner.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(1140);
  });
});
