import { expect, test, type Page } from "@playwright/test";
import { OHNE_ARTIKEL_URL } from "../../playwright.config";

/**
 * Artikel-Teaser aus Sanity (Masterplan 3.9, Briefing 0029).
 *
 * Geprüft werden die beiden Blöcke, die seit diesem Schritt echte Artikel zeigen:
 * Abschnitt 8 „Praxis" auf der Startseite (drei Karten) und der Wissen-Slider auf
 * `/ueber-golfnext` (vier Karten). Die Inhalte kommen aus `lib/sanity/fixtures.ts`.
 *
 * **Zwei Server** (siehe `playwright.config.ts`): Port 3000 mit Beispielartikeln,
 * Port 3001 ohne einen einzigen Artikel. Beide Seiten werden beim Bauen vorgerendert,
 * der Testbestand muss also schon beim Bauen wirken – deshalb `pnpm build:e2e`.
 */

const PRAXIS_EYEBROW = "Praxis";
const PRAXIS_H2 = "Was in Golfclubs wirklich funktioniert.";
const PRAXIS_LINK = "Alle Beiträge";

const WISSEN_EYEBROW = "Wissen";
const WISSEN_H2 = "Was wir über Golfclubs gelernt haben, schreiben wir auf.";
const WISSEN_LINK = "Alle Artikel";

/** Die drei Teaser, die mit Briefing 0029 ersatzlos aus dem Repo verschwunden sind. */
const ERFUNDENE_TEASER = [
  "Warum Ihr Schnupperkurs im Netz nicht gefunden wird",
  "Rehburg-Loccum: Ein Concierge zieht ins Clubbüro",
  "Wem gehören die Daten Ihres Clubs?",
  // Und die vier Platzhalterkarten des Wissen-Sliders samt ihrer „Quelle".
  "Titel folgt:",
  "golfmanager · Fachartikel",
  "GolfNext · Blog",
  "Lesezeit folgt",
];

/** Der Praxis-Abschnitt der Startseite. */
const praxisAbschnitt = (page: Page) =>
  page.locator("section").filter({ has: page.getByRole("heading", { name: PRAXIS_H2 }) });

/** Der Wissen-Abschnitt auf /ueber-golfnext. */
const wissenAbschnitt = (page: Page) =>
  page.locator("section").filter({ has: page.getByRole("heading", { name: WISSEN_H2 }) });

test.describe("Teaser mit Artikeln", () => {
  test("Startseite: drei echte Artikel, die auf /praxis/<slug> verlinken", async ({ page }) => {
    await page.goto("/");
    const abschnitt = praxisAbschnitt(page);

    // Freigegebene Texte – wortgleich.
    await expect(abschnitt.getByText(PRAXIS_EYEBROW, { exact: true })).toBeVisible();
    await expect(abschnitt.getByRole("heading", { level: 2, name: PRAXIS_H2 })).toBeVisible();
    await expect(abschnitt.getByRole("link", { name: PRAXIS_LINK })).toHaveAttribute(
      "href",
      "/praxis",
    );

    // Genau drei Karten, jede ein Link auf ihren Artikel.
    const karten = abschnitt.locator('a[href^="/praxis/"]');
    await expect(karten).toHaveCount(3);
    for (const href of await karten.evaluateAll((els) =>
      els.map((el) => el.getAttribute("href")),
    )) {
      expect(href).toMatch(/^\/praxis\/beispielartikel-\d+$/);
    }

    // Rubrik, Titel, Anriss und Autor stehen auf der Karte.
    const erste = karten.first();
    await expect(erste.getByRole("heading", { level: 3 })).toHaveText("Beispielartikel 1");
    await expect(erste.getByText("Rubrik A", { exact: true })).toBeVisible();
    // Der Autorenname steht als Text neben dem Initialenkreis in derselben Zeile.
    await expect(erste).toContainText("Zweite Person");
    await expect(erste.locator("time")).toBeVisible();

    // Kein Titelbild im Testbestand → beschrifteter Shot-Platzhalter, nie Stock/KI.
    await expect(abschnitt.getByText("Bild folgt")).toHaveCount(3);
  });

  test("Startseite: Karte führt beim Klick auf den Artikel", async ({ page }) => {
    await page.goto("/");
    const karte = praxisAbschnitt(page).locator('a[href^="/praxis/"]').first();
    await karte.scrollIntoViewIfNeeded();
    await karte.click();
    await expect(page).toHaveURL(/\/praxis\/beispielartikel-1$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Beispielartikel 1");
  });

  test("/ueber-golfnext: vier echte Artikel im Slider, Rubrik statt Quelle", async ({ page }) => {
    await page.goto("/ueber-golfnext");
    const abschnitt = wissenAbschnitt(page);

    await expect(abschnitt.getByText(WISSEN_EYEBROW, { exact: true })).toBeVisible();
    await expect(abschnitt.getByRole("heading", { level: 2, name: WISSEN_H2 })).toBeVisible();
    await expect(abschnitt.getByRole("link", { name: WISSEN_LINK })).toHaveAttribute(
      "href",
      "/praxis",
    );

    const karten = abschnitt.locator('a[href^="/praxis/"]');
    await expect(karten).toHaveCount(4);

    // Die vier neuesten – ohne Filter auf eine Rubrik. Im Testbestand liegen die
    // neuesten vier alle in Rubrik A; die Rubrik steht auf der Karte an Stelle der
    // früheren „Quelle".
    await expect(karten.first().getByText("Rubrik A", { exact: true })).toBeVisible();
    await expect(karten.first().getByText("Beispielartikel 1", { exact: true })).toBeVisible();
    await expect(abschnitt.getByText("Bild folgt")).toHaveCount(4);
  });

  test("keine erfundenen Artikel mehr auf beiden Seiten", async ({ page }) => {
    for (const pfad of ["/", "/ueber-golfnext"]) {
      await page.goto(pfad);
      const text = await page.locator("body").innerText();
      for (const teaser of ERFUNDENE_TEASER) {
        expect(text, `„${teaser}" darf auf ${pfad} nicht mehr stehen`).not.toContain(teaser);
      }
    }
  });
});

test.describe("Teaser ohne Artikel", () => {
  test.use({ baseURL: OHNE_ARTIKEL_URL });

  test("Startseite: der Praxis-Abschnitt entfällt vollständig, ohne Layoutlücke", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: PRAXIS_H2 })).toHaveCount(0);
    await expect(page.getByText(PRAXIS_EYEBROW, { exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: PRAXIS_LINK })).toHaveCount(0);
    // Auch keine Sprungmarke oder leere Fläche: Der letzte Abschnitt vor dem Footer
    // schließt bündig an ihn an.
    expect(await lueckeVorFooter(page)).toBeLessThan(2);

    // Die Seite bleibt im Übrigen vollständig.
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Vier Zusagen, die im Vertrag stehen." })).toBeVisible();
  });

  test("/ueber-golfnext: der Wissen-Abschnitt entfällt vollständig, ohne Layoutlücke", async ({
    page,
  }) => {
    await page.goto("/ueber-golfnext");

    await expect(page.getByRole("heading", { name: WISSEN_H2 })).toHaveCount(0);
    await expect(page.getByRole("link", { name: WISSEN_LINK })).toHaveCount(0);
    await expect(page.getByTestId("wissen-rail")).toHaveCount(0);
    expect(await lueckeVorFooter(page)).toBeLessThan(2);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "Zwei Grundsätze, an denen Sie uns messen können." }),
    ).toBeVisible();
  });

  test("kein horizontaler Overflow ohne Artikel", async ({ page }) => {
    for (const pfad of ["/", "/ueber-golfnext"]) {
      for (const width of [390, 768, 1024, 1180, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(pfad);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        );
        expect(overflow, `horizontaler Overflow auf ${pfad} bei ${width}px`).toBe(false);
      }
    }
  });
});

test.describe("Teaser ohne Artikel · ohne JavaScript", () => {
  test.use({ baseURL: OHNE_ARTIKEL_URL, javaScriptEnabled: false });

  test("beide Seiten bleiben ohne JS lesbar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: PRAXIS_H2 })).toHaveCount(0);

    await page.goto("/ueber-golfnext");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: WISSEN_H2 })).toHaveCount(0);
  });
});

test.describe("Teaser mit Artikeln · ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Karten stehen im Server-HTML und sind bedienbar", async ({ page }) => {
    await page.goto("/");
    const karten = praxisAbschnitt(page).locator('a[href^="/praxis/"]');
    await expect(karten).toHaveCount(3);
    await expect(karten.first()).toBeVisible();

    await page.goto("/ueber-golfnext");
    // Der Slider ist ohne JS nativ scrollbar; alle vier Karten stehen im HTML.
    await expect(wissenAbschnitt(page).locator('a[href^="/praxis/"]')).toHaveCount(4);
  });
});

/**
 * Abstand zwischen dem Ende des letzten Abschnitts in `<main>` und dem Beginn des
 * Footers. Bliebe eine leere Sektion stehen, klaffte hier ihre Sektionsluft.
 */
async function lueckeVorFooter(page: Page): Promise<number> {
  const letzte = page.locator("main > section").last();
  const footer = page.locator("main footer, footer").first();
  const a = await letzte.boundingBox();
  const b = await footer.boundingBox();
  if (!a || !b) throw new Error("Abschnitt oder Footer nicht gefunden");
  return Math.abs(b.y - (a.y + a.height));
}
