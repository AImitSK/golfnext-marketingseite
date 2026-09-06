import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("/pakete hat keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/pakete");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
