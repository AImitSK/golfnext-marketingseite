import { expect, test, type Page } from "@playwright/test";
import { clubprozesse } from "../../content/clubprozesse";
import { plattform } from "../../content/plattform";
import { ueberGolfnext } from "../../content/ueber-golfnext";
import { wachstumVertrieb } from "../../content/wachstum-vertrieb";
import type { PageContent } from "../../content/types";

/**
 * FAQ-Abschnitt auf den vier Seiten neben `/pakete` (Briefing 0030, Nachtrag vom
 * 09.09.2026). Alle fünf benutzen denselben Baustein `components/site/FaqSection.tsx`.
 *
 * Zu den Themen `plattform`, `clubprozesse`, `wachstum` und `allgemein` liegt derzeit
 * **keine** Frage im Dataset – und auch nicht im Testbestand (`lib/sanity/fixtures.ts`
 * führt nur `pakete`). Diese Prüfung hält deshalb den Zustand fest, der gewollt ist:
 * **kein Abschnitt, keine Überschrift, keine Leerfläche.** Der Nachweis für
 * Reihenfolge, Server-HTML und Bedienbarkeit ohne JavaScript steht in
 * `tests/e2e/pakete.spec.ts`, wo es Fragen gibt.
 */

const SEITEN: { name: string; inhalt: PageContent }[] = [
  { name: "/plattform", inhalt: plattform },
  { name: "/clubprozesse", inhalt: clubprozesse },
  { name: "/wachstum-vertrieb", inhalt: wachstumVertrieb },
  { name: "/ueber-golfnext", inhalt: ueberGolfnext },
];

/** Eyebrow und Überschrift des FAQ-Abschnitts aus der Content-Datei der Seite. */
function faqKopf(inhalt: PageContent) {
  const abschnitt = inhalt.sections.find((s) => s.id === "faq");
  if (!abschnitt) throw new Error("Sektion „faq“ fehlt in der Content-Datei");
  return { eyebrow: abschnitt.eyebrow!, headline: abschnitt.headline! };
}

/** Abstand zwischen der letzten Sektion und dem Footer – deckt eine Layoutlücke auf. */
async function lueckeVorFooter(page: Page): Promise<number> {
  const letzte = page.locator("main > section").last();
  const footer = page.locator("main footer, footer").first();
  const a = await letzte.boundingBox();
  const b = await footer.boundingBox();
  if (!a || !b) throw new Error("Abschnitt oder Footer nicht gefunden");
  return Math.abs(b.y - (a.y + a.height));
}

for (const { name, inhalt } of SEITEN) {
  test.describe(`${name} · FAQ-Abschnitt ohne Fragen`, () => {
    test("entfällt vollständig, ohne Layoutlücke und ohne Konsolenfehler", async ({ page }) => {
      const konsolenFehler: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") konsolenFehler.push(msg.text());
      });

      await page.goto(inhalt.route);

      const { eyebrow, headline } = faqKopf(inhalt);
      await expect(page.getByRole("heading", { name: headline })).toHaveCount(0);
      await expect(page.getByText(eyebrow, { exact: true })).toHaveCount(0);
      await expect(page.locator("#faq")).toHaveCount(0);
      // Auch kein leeres Akkordeon: Die Seiten führen sonst keine <details>-Fragen.
      await expect(page.locator("#faq details")).toHaveCount(0);

      // Der letzte Abschnitt schließt bündig an den Abschluss-CTA an.
      expect(await lueckeVorFooter(page), "Lücke vor dem Footer").toBeLessThan(2);

      // Die Seite bleibt im Übrigen vollständig und ohne Überlauf.
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow, "horizontaler Overflow").toBe(false);

      expect(konsolenFehler, "Konsolenfehler").toEqual([]);
    });
  });
}
