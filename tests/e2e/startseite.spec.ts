import { expect, test } from "@playwright/test";

/**
 * Startseite `/` – Neufassung v01 (Rebuild aus Mock 3.1b, Briefing 0021, Schritt 2.2).
 * Prüft die harten Akzeptanzkriterien: genau eine H1, kein horizontaler Overflow über
 * die Projektmatrix (auch mit dem Hero-Bleed), keine Konsolenfehler; die „Drei
 * Teile"-Boxen verlinken echt auf die live-Seiten; der Paketblock zeigt keine Preise/
 * Summen und verlinkt auf `/pakete`; die Hero-Demo steht ohne JS und bei reduzierter
 * Bewegung sofort im Endzustand („Platz bespielbar"); die Seite ist ohne JavaScript
 * vollständig lesbar und der Rollen-Slider nativ scrollbar.
 */

const BREAKPOINTS = [390, 768, 1024, 1180, 1440];

test.describe("/ · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow (alle Breakpoints), keine Konsolenfehler", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Mehr Golfer auf dem Platz. Weniger Arbeit im Clubbüro.",
      }),
    ).toBeVisible();

    for (const width of BREAKPOINTS) {
      await page.setViewportSize({ width, height: 900 });
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(hasOverflow, `horizontaler Overflow bei ${width}px`).toBe(false);
    }

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("Drei-Teile-Links zeigen auf die live-Seiten", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Plattform im Überblick" })).toHaveAttribute(
      "href",
      "/plattform",
    );
    await expect(page.getByRole("link", { name: "Wachstum & Vertrieb" })).toHaveAttribute(
      "href",
      "/wachstum-vertrieb",
    );
    // „Clubprozesse" steht auch in der Kopfnavigation – beide zeigen live auf /clubprozesse.
    const clubprozesse = page.getByRole("link", { name: "Clubprozesse", exact: true });
    for (const link of await clubprozesse.all()) {
      await expect(link).toHaveAttribute("href", "/clubprozesse");
    }
  });

  test("Paketblock ohne Preise/Summen, Link auf /pakete", async ({ page }) => {
    await page.goto("/");
    const pakete = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Eine Basis. Dazu genau das, was Ihr Club braucht." }) });
    const text = (await pakete.innerText()) ?? "";
    // Keine Preiszahlen (Fassung-2-Werte) und kein „€" im Paketblock.
    expect(text).not.toMatch(/\d[\d.]*\s*€/);
    for (const price of ["6.800", "238", "5.200", "312", "7.200", "462"]) {
      expect(text, `Preis ${price} darf nicht im Paketblock stehen`).not.toContain(price);
    }
    await expect(pakete.getByRole("link", { name: "Pakete und Preise ansehen" })).toHaveAttribute(
      "href",
      "/pakete",
    );
  });

  test("Karten-Hover-Lift ist spürbar (translateY)", async ({ page }) => {
    await page.goto("/");
    // Erste Praxis-Artikelkarte: Hover hebt die Karte an (transform ≠ none). Die
    // Karten sind seit Briefing 0029 echte Artikel aus Sanity und damit Links.
    const praxis = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Was in Golfclubs wirklich funktioniert." }) });
    const card = praxis.locator('a[href^="/praxis/"]').first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await expect
      .poll(async () => card.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe("none");
  });
});

test.describe("/ ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Seite ist ohne JS vollständig lesbar (Kernabschnitte sichtbar)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Drei Teile. Ein System." })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Ein Klick bei Instagram. Vier Wochen später ein Mitglied." }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Vier Zusagen, die im Vertrag stehen." })).toBeVisible();
    // Fred-Zitat und Paketblock-Link ohne JS sichtbar.
    await expect(page.getByText(/Ein gutes Gespräch lässt sich nicht automatisieren/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Pakete und Preise ansehen" })).toBeVisible();
  });

  test("Hero-Demo steht ohne JS im Endzustand (Platz bespielbar)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Platz bespielbar", { exact: true }).first()).toBeVisible();
  });

  test("Rollen-Slider ist ohne JS nativ scrollbar", async ({ page }) => {
    await page.goto("/");
    const rail = page.getByTestId("rollen-rail");
    await expect(rail).toBeVisible();
    // Der Rail ist ein overflow-x-Scrollbereich (mehr Inhalt als Breite).
    const scrollable = await rail.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(scrollable, "Rollen-Rail ist horizontal scrollbar").toBe(true);
  });
});

test.describe("/ · reduzierte Bewegung", () => {
  test("Hero-Demo steht sofort im Endzustand (Platz bespielbar, Toggle an)", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    const value = page.getByText("Platz bespielbar", { exact: true }).first();
    await value.scrollIntoViewIfNeeded();
    await expect(value).toBeVisible();

    await context.close();
  });
});
