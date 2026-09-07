import { expect, test } from "@playwright/test";
import { uiMessages } from "../../lib/ui/messages";

/**
 * 404 und Fehlerseite (Masterplan 2.9, Briefing 0022). Läuft über alle
 * Breakpoint-Projekte (390–1440).
 *
 * Die Texte müssen wortgleich aus `lib/ui/messages.ts` kommen; das Fehlerobjekt darf
 * nirgends sichtbar werden.
 *
 * Der zweite Fall aus 0022 – `notFound()` aus einer Segment-Route, wo Next 16 die
 * Wurzel-404 innerhalb der Shell rendert und die Seite ohne JavaScript leer bleibt –
 * ist hier nicht mehr geprüft: `/module/[slug]` war die einzige Route, die
 * `notFound()` warf, und sie ist mit Briefing 0023 gelöscht. Dass die entfernten
 * Routen 404 liefern, sichert `tests/e2e/platzhalter.spec.ts`. Der Fall kommt in
 * Phase 3 mit `/praxis/[slug]` zurück – siehe docs/entscheidungen.md.
 */
test.describe("404", () => {
  test("erfundene URL: Statuscode 404, Texte wortgleich, Header, Footer, zwei Aktionen", async ({
    page,
  }) => {
    const response = await page.goto("/diese-seite-gibt-es-nicht");
    expect(response?.status()).toBe(404);

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(uiMessages.notFound.title);
    await expect(page.getByText(uiMessages.notFound.body, { exact: true })).toBeVisible();

    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);

    await expect(
      page.getByRole("link", { name: uiMessages.notFound.actionHome, exact: true }),
    ).toHaveAttribute("href", "/");
    await expect(
      page.locator("main").getByRole("link", { name: uiMessages.notFound.actionContact }),
    ).toHaveCount(1);
  });

  test("kein Overflow, keine Konsolenfehler", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      // Der Browser protokolliert die 404-Antwort des Dokuments selbst als
      // „Failed to load resource … 404". Das ist der gewollte Statuscode, kein
      // Anwendungsfehler – alles andere zählt.
      if (msg.type() === "error" && !msg.text().includes("status of 404")) {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/diese-seite-gibt-es-nicht");
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);
    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("zeigt keine Technik: kein Stacktrace, keine Fehlermeldung", async ({ page }) => {
    await page.goto("/diese-seite-gibt-es-nicht");
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const verboten of ["error", "stack", "exception", "404 |", "oops"]) {
      expect(text, `„${verboten}" darf nicht im Text stehen`).not.toContain(verboten);
    }
  });
});

test.describe("404 ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("erfundene URL ist ohne JS vollständig lesbar", async ({ page }) => {
    await page.goto("/diese-seite-gibt-es-nicht");
    await expect(page.locator("h1")).toHaveText(uiMessages.notFound.title);
    await expect(page.getByText(uiMessages.notFound.body, { exact: true })).toBeVisible();
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
  });
});
