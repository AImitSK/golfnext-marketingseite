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

  test("Vergleich enthält alle Zeilen und sichtbare „Enthalten\"-Punkte (Regressionsschutz)", async ({
    page,
  }) => {
    await page.goto("/pakete");
    const table = page.getByRole("table");

    // 24 Leistungszeilen (6 + 10 + 5 + 3) mit je einem Zeilenkopf – schützt davor,
    // dass die Tabelle wieder auf „nur Kopf/Rahmen" zusammenfällt.
    await expect(table.locator('tbody th[scope="row"]')).toHaveCount(24);
    // Vier Gruppen-Zwischenüberschriften.
    await expect(table.locator("tbody th[colspan]")).toHaveCount(4);

    // „Enthalten"-Punkte müssen in ALLEN vier Spalten sichtbar sein (nicht 0 × 0 px).
    // Erste Datenzeile „Individuelle Clubwebsite" ist in allen vier Stufen enthalten.
    const ersteZeile = table.locator("tbody tr").filter({ hasText: "Individuelle Clubwebsite" });
    const punkte = ersteZeile.locator("td span[aria-hidden='true']");
    await expect(punkte).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const box = await punkte.nth(i).boundingBox();
      expect(box, `Punkt Spalte ${i} hat eine Größe`).not.toBeNull();
      expect(box!.width, `Punkt Spalte ${i} sichtbar`).toBeGreaterThan(0);
      expect(box!.height, `Punkt Spalte ${i} sichtbar`).toBeGreaterThan(0);
    }
    // Zugängliche Bedeutung bleibt vorhanden (sr-only „Enthalten").
    await expect(ersteZeile.getByText("Enthalten", { exact: true })).toHaveCount(4);
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
