import { expect, test } from "@playwright/test";

/**
 * Startseite `/` (Baustein 0013, Schritt 2.2). Prüft die harten Akzeptanzkriterien:
 * genau eine H1, kein horizontaler Overflow (über alle Breakpoints der Projektmatrix),
 * keine Konsolenfehler; der Wachstum/Clubprozesse-Umschalter ist OHNE JavaScript
 * bedienbar (native Radiogruppe + CSS); die Praxis-Kennzahlen zählen mit JS einmal hoch
 * und stehen ohne JS bzw. bei reduzierter Bewegung sofort im wortgleichen Endwert; die
 * Hero-Strecke steht bei reduzierter Bewegung sofort im Endzustand.
 */

test.describe("/ · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow, keine Konsolenfehler", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 1, name: /Mehr Menschen für Ihren Club/ }),
    ).toBeVisible();

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("Praxis-Kennzahlen zählen mit JS einmal hoch bis zum wortgleichen Endwert", async ({
    page,
  }) => {
    await page.goto("/");
    // Beim Sichtbarwerden zählt der Wert einmal hoch und bleibt beim exakten Endwert
    // stehen (wortgleich zum Content). Kein Layout-Shift: nur der Textknoten ändert sich.
    await page.getByText("geführte Dialoge", { exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByText("Rund 1.600", { exact: true })).toBeVisible();
    await expect(page.getByText("72 Prozent", { exact: true })).toBeVisible();
  });

  test("Karten-Hover-Lift ist spürbar (translateY)", async ({ page }) => {
    await page.goto("/");
    // Erste .gn-card-lift auf der Startseite ist eine Vorteils-Karte (statisches
    // inneres Element, nicht das motion-RiseItem) – der Hover hebt sie an.
    const card = page.locator(".gn-card-lift").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await expect
      .poll(async () => card.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe("none");
  });
});

test.describe("/ ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Umschalter Wachstum/Clubprozesse ist ohne JS bedienbar", async ({ page }) => {
    await page.goto("/");

    const wachstumKarte = page.getByRole("heading", { name: "Schnuppergolf und Platzreife" });
    // exact, sonst matcht auch die Praxis-Überschrift „Der digitale Concierge ANNA".
    const prozesseKarte = page.getByRole("heading", { name: "Concierge", exact: true });

    // Startzustand: Wachstum-Ansicht sichtbar, Clubprozesse-Ansicht verborgen.
    await expect(wachstumKarte).toBeVisible();
    await expect(prozesseKarte).toBeHidden();

    // Nativer Label-Klick schaltet die Radiogruppe – ohne JavaScript.
    await page.locator('label[for="startseite-tab-prozesse"]').click();
    await expect(prozesseKarte).toBeVisible();
    await expect(wachstumKarte).toBeHidden();
  });

  test("Seite ist ohne JS vollständig lesbar (Kernabschnitte sichtbar)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Vier Schritte. Zwei Wirkungen. Ein verbundenes System." }),
    ).toBeVisible();
    // Fred-Zitat und Paketblock-Hauptlink ohne JS sichtbar.
    await expect(page.getByText(/Aus Aufmerksamkeit muss Interesse werden/)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Pakete und Leistungen vergleichen/ }),
    ).toBeVisible();
  });

  test("Praxis-Kennzahlen stehen ohne JS sofort im wortgleichen Endwert", async ({ page }) => {
    await page.goto("/");
    // Der Endwert kommt aus dem Server-HTML (CountUp rendert children = Endwert).
    await expect(page.getByText("Rund 1.600", { exact: true })).toBeVisible();
    await expect(page.getByText("72 Prozent", { exact: true })).toBeVisible();
  });
});

test.describe("/ · reduzierte Bewegung", () => {
  test("Hero-Strecke steht sofort im Endzustand (opacity 1)", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    // „Automatisierte Begleitung gestartet" kommt nur in der Hero-Strecke vor.
    const station = page.getByText("Automatisierte Begleitung gestartet", { exact: true });
    await station.scrollIntoViewIfNeeded();
    expect(Number(await station.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    await context.close();
  });

  test("Praxis-Kennzahlen zeigen bei reduzierter Bewegung sofort den Endwert", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    // Kein Hochzählen von 0: der Endwert steht sofort und bleibt (wortgleich).
    const value = page.getByText("Rund 1.600", { exact: true });
    await value.scrollIntoViewIfNeeded();
    await expect(value).toBeVisible();
    await expect(page.getByText("72 Prozent", { exact: true })).toBeVisible();

    await context.close();
  });
});
