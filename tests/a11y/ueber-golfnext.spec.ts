import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * /ueber-golfnext gegen WCAG-A/AA (Baustein 0019).
 *
 * Ausgeschlossen werden die als `aria-hidden="true"` markierten dekorativen
 * PORTRÄT-PLATZHALTER (Hero-Karten Fred/Stefan, die Personen-Platzhalter der
 * „Menschen dahinter“-Karten) und die Bild-Platzhalter des Wissen-Sliders. Sie sind
 * beschriftete Platzhalter (kein Foto/Stock/KI), nicht Teil des Barrierefreiheits-
 * Baums; ihre gedämpften Beschriftungen erfüllen den Text-Kontrast nicht. Die
 * verbindlichen Aussagen (Namen, Rollen, Fakten, Titel) stehen im sichtbaren,
 * geprüften Text daneben. Alles außer diesen Platzhaltern wird voll auf WCAG-A/AA
 * geprüft.
 */
test("/ueber-golfnext hat keine WCAG-A/AA-Verstöße (ohne die dekorativen Platzhalter)", async ({
  page,
}) => {
  await page.goto("/ueber-golfnext");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude('[aria-hidden="true"]')
    .analyze();
  expect(results.violations).toEqual([]);
});
