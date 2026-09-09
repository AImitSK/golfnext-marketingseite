import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Barrierefreiheit der Rechtsseiten (Briefing 0028). Lange Fließtexte fallen
 * erfahrungsgemäß über Kontrast und Überschriften-Reihenfolge – beides prüft axe.
 */
for (const pfad of ["/impressum", "/datenschutz"]) {
  test(`${pfad} hat keine WCAG-A/AA-Verstöße`, async ({ page }) => {
    await page.goto(pfad);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
}
