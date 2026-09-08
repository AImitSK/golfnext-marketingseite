import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Die letzten Meldungs-Seiten ohne eigenen Mock. Die Platzhalterseite unter `/praxis`
 * ist mit Briefing 0027 durch die echte Praxis-Übersicht ersetzt (siehe
 * tests/a11y/praxis.spec.ts); geblieben ist die 404.
 */
test("die 404 hat keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/diese-seite-gibt-es-nicht");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
