import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("/kontakt (Platzhalter) hat keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/kontakt");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("die 404 hat keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/diese-seite-gibt-es-nicht");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
