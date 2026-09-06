import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * /wachstum-vertrieb gegen WCAG-A/AA (Baustein 0017).
 *
 * Ausgeschlossen werden die als `aria-hidden="true"` markierten SCHEMATISCHEN
 * ILLUSTRATIONEN (Kampagnen-Cockpit + Instagram-Handy im Hero, die Mikro-
 * Visualisierungen der „Drei Momente", die Mini-Website-Visuals der „Vier Wege", die
 * Geräterahmen der Kampagnen-Geschichte, der Landingpage-Fächer im Fundament). Sie sind
 * bewusste Darstellungen des Systems – wie Screenshots/Grafiken – nicht Teil des
 * Barrierefreiheits-Baums; ihre Beispieltexte ahmen echte Produktoberflächen nach
 * (gedämpfte Sekundärtexte) und erfüllen den Text-Kontrast daher nicht. Die
 * verbindlichen Aussagen stehen im sichtbaren, geprüften Text daneben. Alles außer
 * diesen Illustrationen wird voll auf WCAG-A/AA geprüft.
 */
test("/wachstum-vertrieb hat keine WCAG-A/AA-Verstöße (ohne die dekorativen Illustrationen)", async ({
  page,
}) => {
  await page.goto("/wachstum-vertrieb");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude('[aria-hidden="true"]')
    .analyze();
  expect(results.violations).toEqual([]);
});
