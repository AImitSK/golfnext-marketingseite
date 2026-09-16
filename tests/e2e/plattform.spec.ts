import { expect, test } from "@playwright/test";

/**
 * /plattform – Struktur nach dem finalen Korrekturbriefing (0035): Hero, „Was sich
 * ändert" (Bento), „Plattform auf einen Blick", „Was GolfNext nicht ist", Abschluss.
 * Rollen-Slider und Scroll-Geschichte sind entfallen. Prüft die harten Akzeptanzkriterien:
 * - genau eine H1 (im Hero), kein horizontaler Seiten-Overflow (auch das Bleed-Visual
 *   im Hero erzeugt keinen Overflow), keine Konsolenfehler – über alle Breakpoints
 *   (playwright.config.ts: 390/768/1024/1180/1440);
 * - OHNE JavaScript ist alles lesbar (Modul-Übersicht und Abgrenzung stehen im
 *   Server-HTML);
 * - bei reduzierter Bewegung stehen die Animationen sofort im Endzustand (Hero-Meldung
 *   „Platz bespielbar" bestätigt, Bento-Inhalte vollständig sichtbar).
 */

const H1 = "Ihre Website ist ein Schaufenster. Wir machen ein System daraus.";

test.describe("/plattform · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow (inkl. Bleed/Slider), keine Konsolenfehler", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/plattform");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: H1 })).toBeVisible();

    // Kein horizontaler Overflow – das Hero-Bleed-Visual (width > 100%) und der
    // Rollen-Slider (margin-right:calc(50% - 50vw)) werden vom overflow:hidden ihrer
    // Abschnitte gekappt.
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });
});

test.describe("/plattform ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Modul-Übersicht und Abgrenzung stehen im Server-HTML", async ({ page }) => {
    await page.goto("/plattform");

    // „Plattform auf einen Blick": Überschrift und die Modulnamen sind ohne JS lesbar.
    await expect(
      page.getByRole("heading", { name: "Zwölf Module. Zwei Richtungen. Eine Plattform." }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: "Module im Überblick" })).toBeVisible();
    await expect(page.getByText("Captains App", { exact: true }).first()).toBeVisible();

    // Abgrenzung „Was GolfNext nicht ist": Überschrift, Verbindung und Abschluss lesbar.
    await expect(
      page.getByRole("heading", { name: "Ihre Clubverwaltung bleibt, wo sie ist." }),
    ).toBeVisible();
    await expect(
      page.getByText(
        /GolfNext begleitet bis zur Mitgliedschaft\. Ihre Clubsoftware verwaltet den Clubbetrieb\./,
      ),
    ).toBeVisible();
  });
});

test.describe("/plattform · reduzierte Bewegung", () => {
  test("Animationen stehen sofort im Endzustand", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/plattform");

    // Hero: die Platzstatus-Meldung ist bestätigt (Endzustand, nur dann sichtbar).
    const ok = page.getByText("Website aktualisiert · 06:40 Uhr");
    await expect(ok).toBeVisible();
    expect(Number(await ok.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    // Bento: die Pilot-Kennzahl (Ende des Chat-Beispiels) ist vollständig sichtbar.
    const pilot = page.getByText(/Im Pilot des Golfclubs Rehburg-Loccum kamen 68 %/);
    await pilot.scrollIntoViewIfNeeded();
    await expect(pilot).toBeVisible();

    // Bento: eine CRM-Zeile ist im Endzustand (opacity 1, nicht mehr eingeblendet).
    const crm = page.getByText("Familie Meier");
    expect(Number(await crm.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    await context.close();
  });
});
