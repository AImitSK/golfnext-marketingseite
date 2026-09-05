import { expect, test } from "@playwright/test";

/**
 * Zustände & Rückmeldungen (Baustein 0009, Schritt 1.8): Alert/Toast/Empty/Skeleton,
 * Button-Ladezustand und Formularzustände auf /_bausteine. Prüft die A11y-Vorgaben
 * aus docs/08 §5: Rollen je Alert-Variante, aria-invalid/aria-describedby, Pflichtstern
 * + required, Skeleton (aria-busy + sr-only + aria-hidden, Reduced-Motion still),
 * Button (aria-busy + sr-only), sowie die Bedienbarkeit ohne JavaScript.
 */

// Katalogtexte (Auszüge) – bewusst hier gespiegelt, um den Alias-Import zu sparen.
const infoAlert = "Dieses Modul ist noch in Entwicklung";
const okAlert = "Ihre Anfrage ist eingegangen";
const errAlert = "Die Verbindung wurde unterbrochen";
const loadingLabel = "Wird gesendet";
const loadingText = "Inhalte werden geladen";

test.describe("/_bausteine · Zustände", () => {
  test("Alerts tragen die richtige Rolle (err=alert, ok/info=status)", async ({ page }) => {
    await page.goto("/_bausteine");

    await expect(page.locator("[role=alert]").filter({ hasText: errAlert })).toBeVisible();
    await expect(page.locator("[role=status]").filter({ hasText: okAlert })).toBeVisible();
    await expect(page.locator("[role=status]").filter({ hasText: infoAlert })).toBeVisible();
  });

  test("Fehlerfeld: aria-invalid + aria-describedby verdrahtet, Pflichtstern + required", async ({
    page,
  }) => {
    await page.goto("/_bausteine");

    const mail = page.locator("#demo-mail");
    await expect(mail).toHaveJSProperty("required", true);
    await expect(mail).toHaveAttribute("aria-invalid", "true");

    // aria-describedby zeigt auf die Fehlermeldung, die den Ausweg nennt.
    const describedby = await mail.getAttribute("aria-describedby");
    expect(describedby).toBe("demo-mail-msg");
    await expect(page.locator(`#${describedby}`)).toContainText("E-Mail-Adresse");

    // Pflichtfeld trägt required UND einen sichtbaren Stern im Label.
    await expect(page.locator('label[for="demo-mail"]')).toContainText("*");
  });

  test("Skeleton: aria-busy am Container, sr-only-Ansage, Blöcke aria-hidden", async ({ page }) => {
    await page.goto("/_bausteine");

    const skel = page.locator("[aria-busy=true]").filter({ hasText: loadingText });
    await expect(skel).toBeAttached();
    await expect(skel.getByText(loadingText)).toBeAttached();
    expect(await skel.locator("[aria-hidden=true]").count()).toBeGreaterThanOrEqual(4);
  });

  test("Button-Ladezustand: aria-busy, sr-only-Ansage, Klicks aus", async ({ page }) => {
    await page.goto("/_bausteine");

    const loadingBtn = page.locator("button[aria-busy=true]").first();
    await expect(loadingBtn).toBeVisible();
    // sr-only-Text steht im DOM (visuell verborgen, aber vorlesbar).
    await expect(loadingBtn).toContainText(loadingLabel);
    // pointer-events:none verhindert den zweiten Klick.
    expect(await loadingBtn.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
  });

  test("Toast erscheint auf Klick mit role=status und verschwindet wieder", async ({ page }) => {
    await page.goto("/_bausteine");

    await page.getByRole("button", { name: "Toast auslösen" }).click();
    const toast = page.getByText("Cookie-Einstellungen sind gespeichert");
    await expect(toast).toBeVisible();
    await expect(page.locator("[role=status]").filter({ hasText: "Cookie" })).toBeVisible();
    // Blendet nach ~3 s wieder aus (kein Dauereinblendung).
    await expect(toast).toBeHidden({ timeout: 6000 });
  });

  test("Reduced Motion: Skeleton-Shimmer steht still (keine Animation)", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/_bausteine");

    const block = page
      .locator("[aria-busy=true]")
      .filter({ hasText: loadingText })
      .locator("[aria-hidden=true]")
      .first();
    expect(await block.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");

    await context.close();
  });

  test("ohne JavaScript sind die Formularfelder native und bedienbar", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/_bausteine");

    await expect(page.locator("input#demo-anlage")).toBeVisible();
    await expect(page.locator("select#demo-rolle")).toBeVisible();
    await expect(page.locator("textarea#demo-anliegen")).toBeVisible();
    expect(await page.locator("input[type=checkbox]").count()).toBeGreaterThanOrEqual(3);
    expect(await page.locator("input[type=radio]").count()).toBeGreaterThanOrEqual(3);

    await context.close();
  });
});
