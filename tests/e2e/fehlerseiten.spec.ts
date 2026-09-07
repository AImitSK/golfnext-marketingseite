import { expect, test } from "@playwright/test";
import { uiMessages } from "../../lib/ui/messages";

/**
 * 404 und Fehlerseite (Masterplan 2.9, Briefing 0022). Läuft über alle
 * Breakpoint-Projekte (390–1440).
 *
 * Die Texte müssen wortgleich aus `lib/ui/messages.ts` kommen; das Fehlerobjekt darf
 * nirgends sichtbar werden.
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

  test("unbekannter Modul-Slug: 404 statt leerer Platzhalterseite, genau eine Kopfzeile", async ({
    page,
  }) => {
    const response = await page.goto("/module/gibt-es-nicht");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText(uiMessages.notFound.title);
    // Next rendert die Wurzel-404 hier innerhalb der (site)-Shell; der
    // Fallback-Header der 404 wird ausgeblendet (app/globals.css).
    await expect(page.locator("header:visible")).toHaveCount(1);
    // Der Platzhaltertext darf hier NICHT stehen – es ist keine Platzhalterseite.
    await expect(page.getByText(uiMessages.platzhalter.body, { exact: true })).toHaveCount(0);
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
