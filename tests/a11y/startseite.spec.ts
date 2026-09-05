import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Startseite hat keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
