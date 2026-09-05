import { expect, test } from "@playwright/test";

test.describe("Startseite · Smoke", () => {
  test("lädt ohne Overflow, ohne Konsolenfehler, ohne externen Font-Request", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const externalFontRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (url.includes("fonts.googleapis.com") || url.includes("fonts.gstatic.com")) {
        externalFontRequests.push(url);
      }
    });

    await page.goto("/");

    // Genau eine sichtbare H1 mit der Wortmarke
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Kein horizontaler Overflow
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    // DSGVO: kein Request an Google Fonts (Fonts sind self-hosted)
    expect(externalFontRequests, "Requests an Google Fonts").toEqual([]);

    // Keine Konsolenfehler
    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });
});
