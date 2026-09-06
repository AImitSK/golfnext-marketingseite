import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * /plattform gegen WCAG-A/AA (Baustein 0016).
 *
 * Ausgeschlossen werden die als `aria-hidden="true"` markierten SCHEMATISCHEN
 * ILLUSTRATIONEN (Browser-/Handy-Demo im Hero, die Mikro-Visualisierungen der Bento-
 * Boxen, die Geräterahmen der Scroll-Geschichte). Sie sind bewusste Darstellungen des
 * Systems – wie Screenshots/Grafiken – nicht Teil des Barrierefreiheits-Baums; ihre
 * Beispieltexte ahmen echte Produktoberflächen nach (gedämpfte Sekundärtexte, ein
 * bewusst gedimmter „Werkzeuge"-Zustand) und erfüllen den Text-Kontrast daher nicht.
 * Die verbindlichen Aussagen stehen im sichtbaren, geprüften Text daneben. Alles außer
 * diesen Illustrationen wird voll auf WCAG-A/AA geprüft.
 */
test("/plattform hat keine WCAG-A/AA-Verstöße (ohne die dekorativen Illustrationen)", async ({
  page,
}) => {
  await page.goto("/plattform");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude('[aria-hidden="true"]')
    .analyze();
  expect(results.violations).toEqual([]);
});
