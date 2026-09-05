import { expect, test } from "@playwright/test";

/**
 * Interne Vorschau /_bausteine (Baustein 0002, Layout-Primitives).
 * Läuft über alle Breakpoint-Projekte der playwright.config.ts (390–1440).
 */
test.describe("/_bausteine · Layout-Primitives", () => {
  test("rendert ohne Overflow, mit genau einer H1, fixem Hint-Icon, noindex, ohne Konsolenfehler", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/_bausteine");

    // Genau eine H1
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    // Kein horizontaler Overflow
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    // Hint-Icon exakt 15 x 15 px (nicht skalierend); kein SVG > 90 px
    const svgSizes = await page.evaluate(() =>
      [...document.querySelectorAll("svg")].map((s) => {
        const r = s.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      }),
    );
    expect(svgSizes.length).toBeGreaterThan(0);
    for (const { w, h } of svgSizes) {
      expect(w, "Icon-Breite").toBe(15);
      expect(h, "Icon-Höhe").toBe(15);
    }

    // noindex für die interne Vorschau
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

    // Keine Konsolenfehler
    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });
});
