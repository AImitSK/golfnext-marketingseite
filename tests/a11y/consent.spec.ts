import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Barrierefreiheit des Einwilligungs-Dialogs (Briefing 0033, Masterplan 5.6).
 *
 * Der Dialog ist das erste, was ein Besucher sieht, und er liegt über allem – ein
 * Kontrast- oder Beschriftungsfehler trifft hier jeden. Geprüft werden beide
 * Zustände: die Abfrage beim ersten Besuch und die geöffneten Einstellungen.
 */

/**
 * `reducedMotion: "reduce"` ist hier kein Nebenschauplatz, sondern Voraussetzung:
 * Der Dialog blendet sich sonst ein, und axe misst den Kontrast mitten im Übergang
 * gegen eine halbdurchsichtige Fläche – ein Fehlalarm, der mit der echten Optik
 * nichts zu tun hat. Ohne Übergang steht sofort der Endzustand da, und genau der
 * soll geprüft werden.
 */
test.use({
  reducedMotion: "reduce",
  // Ohne gespeicherte Auswahl – hier soll der Dialog ja erscheinen
  // (die übrigen Specs starten als wiederkehrender Besucher, siehe tests/setup).
  storageState: { cookies: [], origins: [] },
});

/** Wartet, bis der Dialog wirklich fertig eingeblendet ist. */
async function warteAufEndzustand(page: import("@playwright/test").Page, selektor: string) {
  await expect(page.locator(selektor)).toBeVisible();
  await expect(page.locator(selektor)).toHaveCSS("opacity", "1");
}

test("Einwilligungs-Dialog hat keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/");
  await warteAufEndzustand(page, "#cc-main .cm");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("Cookie-Einstellungen haben keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
  await warteAufEndzustand(page, "#cc-main .pm");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("/danke hat keine WCAG-A/AA-Verstöße", async ({ page }) => {
  await page.goto("/danke?quelle=kontakt");
  // Auch hier steht der Dialog über der Seite – er wird mitgeprüft.
  await warteAufEndzustand(page, "#cc-main .cm");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
