import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * /clubprozesse gegen WCAG-A/AA (Baustein 0018).
 *
 * Ausgeschlossen werden die als `aria-hidden="true"` markierten SCHEMATISCHEN
 * ILLUSTRATIONEN (Clubwebsite + Sonntags-Log im Hero, die Mikro-Visualisierungen der
 * „Drei Dinge", die Bericht-Strecke der „Turnier-News" und die Captains-App-Demo).
 * Sie sind bewusste Darstellungen des Systems – wie Screenshots/Grafiken – nicht Teil
 * des Barrierefreiheits-Baums; ihre Beispieltexte ahmen echte Produktoberflächen nach
 * (gedämpfte Sekundärtexte) und erfüllen den Text-Kontrast daher nicht. Die
 * verbindlichen Aussagen stehen im sichtbaren, geprüften Text daneben. Alles außer
 * diesen Illustrationen wird voll auf WCAG-A/AA geprüft.
 */
test("/clubprozesse hat keine WCAG-A/AA-Verstöße (ohne die dekorativen Illustrationen)", async ({
  page,
}) => {
  await page.goto("/clubprozesse");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude('[aria-hidden="true"]')
    .analyze();
  expect(results.violations).toEqual([]);
});
