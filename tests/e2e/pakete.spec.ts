import { expect, test } from "@playwright/test";

/**
 * /pakete (Baustein 0012, Schritt 2.1). Prüft die harten Akzeptanzkriterien:
 * genau eine H1, kein horizontaler Overflow (auch mit der Vergleichstabelle,
 * deren Scroll INNERHALB des Containers liegt), keine Konsolenfehler; die
 * Karten-Leistungen und die FAQ sind OHNE JavaScript auf-/zuklappbar; der
 * Hero-Stapel steht bei reduzierter Bewegung sofort im Endzustand.
 */

test.describe("/pakete · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow, keine Konsolenfehler", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/pakete");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 1, name: /Drei Wege, sie arbeiten zu lassen/ }),
    ).toBeVisible();

    // Kein horizontaler Overflow – die Vergleichstabelle (min-width 720px) scrollt
    // innerhalb ihres Containers, nicht die Seite.
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("Vergleich ist eine semantische Tabelle mit Spalten- und Zeilenköpfen", async ({ page }) => {
    await page.goto("/pakete");
    const table = page.getByRole("table");
    await expect(table).toHaveCount(1);
    await expect(table.getByRole("columnheader", { name: "Komplett" })).toBeVisible();
    await expect(table.getByRole("rowheader", { name: "Gastfee" })).toBeVisible();
  });
});

test.describe("/pakete ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Karten-Leistungen und FAQ sind ohne JS bedienbar", async ({ page }) => {
    await page.goto("/pakete");

    // Karten-Leistungen: geschlossenes <details> verbirgt die Punkte, nativer Klick öffnet.
    const wachstumKarte = page
      .getByRole("group")
      .filter({ hasText: "Zusätzlich enthalten" });
    const eintrag = wachstumKarte.getByRole("listitem").filter({ hasText: "Firmen-Events" });
    await expect(eintrag).toBeHidden();
    await wachstumKarte.locator("summary").click();
    await expect(eintrag).toBeVisible();

    // FAQ: erstes Item ist server-seitig offen; ein geschlossenes öffnet ohne JS.
    const ersteAntwort = page.getByText(/Die Clubwebsite ist einzeln buchbar/);
    await expect(ersteAntwort).toBeVisible();

    const zweiteFrage = page.getByRole("group").filter({
      hasText: "Können wir später in eine größere Ausbaustufe wechseln?",
    });
    const zweiteAntwort = page.getByText(/Alle Stufen laufen auf derselben GolfNext-Plattform/);
    await expect(zweiteAntwort).toBeHidden();
    await zweiteFrage.locator("summary").click();
    await expect(zweiteAntwort).toBeVisible();
  });
});

test.describe("/pakete · reduzierte Bewegung", () => {
  test("Hero-Stapel steht sofort im Endzustand (opacity 1)", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/pakete");

    // „+ Individuell" kommt nur im Hero-Stapel vor – eindeutig.
    const stufe = page.getByText("+ Individuell", { exact: true });
    await stufe.scrollIntoViewIfNeeded();
    expect(Number(await stufe.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    await context.close();
  });
});
