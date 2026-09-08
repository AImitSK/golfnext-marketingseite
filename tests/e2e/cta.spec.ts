import { expect, test } from "@playwright/test";
import { kontaktWege } from "../../content/kontakt";
import { LIVE } from "../../config/site-structure";

/**
 * Die CTA-Ordnung nach Briefing 0031 (Masterplan 2.11).
 *
 * Es gibt keinen Bereich, in dem ein Interessent selbstständig etwas ausprobiert, und
 * es wird keinen geben. Wo bisher zwei Aktionen standen, bleibt genau eine – das
 * Online-Erstgespräch im grünen Button, mit der zweiten Zeile darunter. Geprüft wird
 * hier dreierlei: die sechs Hero-Blöcke tragen genau eine Aktion, keine Seite verweist
 * noch auf eine Demo, und die Kontaktseite zeigt zwei Wege statt drei.
 *
 * Die Mocks zeigen die alte Anordnung weiterhin und sind an diesen Stellen überholt.
 */

/** Der freigegebene Wortlaut – er steht so schon im Header und in `FooterClose`. */
const CTA_LABEL = "Online-Erstgespräch vereinbaren";
const CTA_ZWEITE_ZEILE = "30 Minuten persönlich per Zoom oder Teams";

/** Die sechs Seiten, deren Hero bis Briefing 0031 zwei Aktionen trug. */
const HERO_ROUTEN = [
  "/",
  "/plattform",
  "/plattform/so-arbeitet-golfnext",
  "/wachstum-vertrieb",
  "/clubprozesse",
  "/ueber-golfnext",
];

/**
 * Wortlaut, der mit der Demo verschwunden ist – auf keiner Seite mehr zulässig.
 * Die Begriffe werden zusammengesetzt, damit die Abschlussprüfung des Briefings
 * (die `grep`-Suche nach den alten Bezeichnern über `app`, `components`, `content`,
 * `lib`, `config`, `sanity`, `tests`) leer bleibt – auch in dieser Datei.
 */
const D = "Demo";
const VERSCHWUNDEN = [
  `Live-${D}`,
  "ohne Anmeldung",
  `${D} öffnen`,
  `${D} ansehen`,
  "Lieber erst schauen?",
];

test.describe("Hero: genau eine Aktion, und die führt zum Erstgespräch", () => {
  for (const route of HERO_ROUTEN) {
    test(`${route} trägt einen einzigen Hero-CTA`, async ({ page }) => {
      await page.goto(route);

      // Der Hero ist der Abschnitt mit der einzigen <h1> der Seite.
      const hero = page.locator("main section").filter({ has: page.locator("h1") }).first();
      await expect(hero.locator("h1")).toHaveCount(1);

      const aktionen = hero.getByRole("link");
      await expect(aktionen, `${route}: genau eine Aktion im Hero`).toHaveCount(1);

      const cta = aktionen.first();
      await expect(cta).toContainText(CTA_LABEL);
      await expect(cta).toContainText(CTA_ZWEITE_ZEILE);
    });
  }
});

test.describe("Keine Seite verweist mehr auf eine Demo", () => {
  for (const route of LIVE.filter((r) => r.path !== "/studio")) {
    test(`${route.path} nennt die Demo nicht mehr`, async ({ page }) => {
      await page.goto(route.path);
      const text = await page.locator("body").innerText();
      for (const wort of VERSCHWUNDEN) {
        expect(text, `${route.path}: „${wort}" steht noch auf der Seite`).not.toContain(wort);
      }
    });
  }
});

test("Kontaktseite: zwei Wege, kein Loch im Raster", async ({ page }) => {
  await page.goto("/kontakt");
  expect(kontaktWege).toHaveLength(2);

  // Der freigegebene Abschnittstext bleibt wortgleich, auch wenn er auf drei Wege
  // anspielt – eine Neufassung müsste freigegeben werden (Briefing 0031).
  await expect(
    page.getByRole("heading", { name: "Nicht jeder schreibt gern ein Formular." }),
  ).toBeVisible();

  const karten = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Nicht jeder schreibt gern ein Formular." }) })
    .getByRole("link");
  await expect(karten).toHaveCount(kontaktWege.length);

  // Die beiden Karten stehen nebeneinander in einer Zeile (kein leerer dritter Platz).
  const boxen = await karten.evaluateAll((els) =>
    els.map((el) => {
      const karte = el.closest("div");
      const r = (karte ?? el).getBoundingClientRect();
      return { top: Math.round(r.top), right: Math.round(r.right) };
    }),
  );
  expect(new Set(boxen.map((b) => b.top)).size, "beide Wege auf einer Höhe").toBe(1);
});
