import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Interne Vorschau /_bausteine (Briefing 0003): prüft die interaktiven Primitives
// Button, TextLink, Chip und Badge auf WCAG-A/AA. Der Kontrast von Badge-Status
// und zweiter Button-Zeile wurde bewusst AA-fest justiert (docs/entscheidungen.md).
test("/_bausteine hat keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/_bausteine");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
