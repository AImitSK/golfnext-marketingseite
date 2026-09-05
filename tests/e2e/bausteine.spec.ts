import { expect, test } from "@playwright/test";

/**
 * Interne Vorschau /_bausteine (Bausteine 0002/0003 Primitives + 0004 Header).
 * Läuft über alle Breakpoint-Projekte der playwright.config.ts (390–1440).
 */
test.describe("/_bausteine · Bausteine-Vorschau", () => {
  test("rendert ohne Overflow, mit genau einer H1, ohne zu große Icons, noindex, ohne Konsolenfehler", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/_bausteine");

    // Genau eine H1 (der Header enthält keine H1)
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    // Kein horizontaler Overflow (inkl. sticky Header und Dropdown-Layout)
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    // Icon-Guard: kein sichtbares SVG > 90 px, ausgenommen [data-large-svg] (Wortmarke).
    const svgSizes = await page.evaluate(() =>
      [...document.querySelectorAll("svg")].map((s) => {
        const r = s.getBoundingClientRect();
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          exempt: s.hasAttribute("data-large-svg"),
        };
      }),
    );
    expect(svgSizes.length).toBeGreaterThan(0);
    for (const { w, h, exempt } of svgSizes) {
      if (exempt) continue;
      expect(w, "Icon-Breite ≤ 90 px").toBeLessThanOrEqual(90);
      expect(h, "Icon-Höhe ≤ 90 px").toBeLessThanOrEqual(90);
    }

    // noindex für die interne Vorschau
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

    // Keine Konsolenfehler
    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });
});
