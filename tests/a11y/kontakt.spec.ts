import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { formMessages } from "../../lib/forms/messages";

/**
 * Barrierefreiheit von `/kontakt` (Briefing 0025) – die Seite mit dem einzigen
 * Formular der Website. Geprüft werden drei Zustände, weil ein Formular erst im
 * Fehlerfall zeigt, ob es barrierefrei ist: Ausgangszustand, Feldfehler nach dem
 * Absenden und der Erfolgsalert.
 */
test("/kontakt hat keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/kontakt");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("/kontakt bleibt im Fehlerzustand barrierefrei", async ({ page }) => {
  await page.goto("/kontakt");
  // Die Zeitfalle des Spam-Schutzes verlangt mindestens 4 Sekunden (docs/06).
  await page.waitForTimeout(4500);
  await page.getByRole("button", { name: /Nachricht senden/ }).click();
  await expect(page.getByText(formMessages.form.invalid, { exact: true })).toBeVisible();

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
