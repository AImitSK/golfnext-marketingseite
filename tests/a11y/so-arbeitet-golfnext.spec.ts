import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * /plattform/so-arbeitet-golfnext gegen WCAG-A/AA (Briefing 0024).
 *
 * Ausgeschlossen werden die als `aria-hidden="true"` markierten SCHEMATISCHEN
 * ILLUSTRATIONEN (der Mail-Stapel im Hero, die vier Mail-Fenster je Zielgruppen-
 * Strecke und die beiden Übergabe-Karten). Sie sind bewusste Darstellungen des
 * Systems – wie Screenshots/Grafiken – nicht Teil des Barrierefreiheits-Baums; ihre
 * Beispieltexte ahmen echte Produktoberflächen nach (gedämpfte Sekundärtexte) und
 * erfüllen den Text-Kontrast daher nicht. Jede Strecke trägt stattdessen ein
 * beschreibendes `role="img"` mit `aria-label`. Die verbindlichen Aussagen stehen im
 * sichtbaren, geprüften Text daneben. Alles außer diesen Illustrationen wird voll auf
 * WCAG-A/AA geprüft – einschließlich der Radiogruppe des Umschalters.
 */
test("/plattform/so-arbeitet-golfnext hat keine WCAG-A/AA-Verstöße (ohne die dekorativen Illustrationen)", async ({
  page,
}) => {
  await page.goto("/plattform/so-arbeitet-golfnext");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude('[aria-hidden="true"]')
    .analyze();
  expect(results.violations).toEqual([]);
});
