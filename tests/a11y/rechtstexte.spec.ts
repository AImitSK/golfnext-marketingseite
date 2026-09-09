import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Barrierefreiheit der Rechtsseiten (Briefing 0028). Lange Fließtexte fallen
 * erfahrungsgemäß über Kontrast und Überschriften-Reihenfolge – beides prüft axe.
 *
 * Geprüft wird zusätzlich gegen `wcag21aa`, wie es der Skill `golfnext-qa` verlangt.
 * Die übrigen `tests/a11y/*.spec.ts` prüfen bislang nur `wcag2a`/`wcag2aa` – diese
 * site-weite Lücke gehört in einen eigenen Schritt und nicht in Briefing 0028.
 */
for (const pfad of ["/impressum", "/datenschutz"]) {
  test(`${pfad} hat keine WCAG-A/AA-Verstöße`, async ({ page }) => {
    await page.goto(pfad);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
