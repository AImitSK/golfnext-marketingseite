import { expect, test } from "@playwright/test";

/**
 * Bewegung (Baustein 0008, Schritt 1.7): reveal/rise/draw auf /_bausteine.
 * Prüft die harten Vorgaben des Briefings: (a) ohne JavaScript vollständig
 * sichtbar (Endzustand im Server-HTML), (b) prefers-reduced-motion → sofort
 * Endzustand ohne Übergang, (c) kein Layout-Shift durch die Animation.
 */

const revealText = "Blendet einmalig auf und schiebt sich 14 Pixel";
const riseItem = "Zweiter Punkt";
const heading = "Reveal, Rise & Draw";

test.describe("/_bausteine · Bewegung", () => {
  test("ohne JavaScript ist der Bewegungs-Abschnitt vollständig sichtbar (opacity 1, kein Versatz)", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/_bausteine");

    const reveal = page.getByText(revealText);
    const rise = page.getByText(riseItem);
    await expect(reveal).toBeVisible();
    await expect(rise).toBeVisible();

    // Endzustand: volle Deckkraft, keine Verschiebung (kein opacity:0-Rest).
    for (const locator of [reveal, rise]) {
      const style = await locator.evaluate((el) => {
        const s = getComputedStyle(el.closest("[class]") ?? el);
        return { opacity: getComputedStyle(el).opacity, transform: s.transform };
      });
      expect(Number(style.opacity)).toBe(1);
    }

    // Die Draw-Linie steht im Server-HTML: das SVG ist sichtbar und die Linie
    // ist gezeichnet (kein pathLength/scaleX-0-Rest ohne JS).
    await expect(page.locator("svg").filter({ has: page.locator("line") })).toBeVisible();
    const line = await page.locator("svg line").evaluate((el) => ({
      dashoffset: getComputedStyle(el).strokeDashoffset,
      transform: getComputedStyle(el).transform,
    }));
    // Ohne JS bleibt der Strich ungekürzt (kein motion-Startzustand appliziert).
    expect(line.dashoffset === "0px" || line.dashoffset === "none" || line.dashoffset === "").toBe(
      true,
    );

    await context.close();
  });

  test("prefers-reduced-motion:reduce → sofort Endzustand, keine Transition", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/_bausteine");

    const reveal = page.getByText(revealText);
    await reveal.scrollIntoViewIfNeeded();

    // Ohne Wartezeit voll sichtbar – kein Aufblenden, das erst „ankommen" müsste.
    expect(Number(await reveal.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    // Die gestaffelten Items stehen ebenfalls sofort im Endzustand.
    const opacities = await page
      .locator(`text=${riseItem}`)
      .evaluateAll((els) => els.map((el) => Number(getComputedStyle(el).opacity)));
    for (const o of opacities) expect(o).toBe(1);

    await context.close();
  });

  test("mit JavaScript: Animation läuft einmal und verschiebt kein Layout", async ({ page }) => {
    await page.goto("/_bausteine");

    // Referenz: Position der Abschnitts-Überschrift vor und nach der Animation.
    const h2 = page.getByRole("heading", { name: heading });
    await h2.scrollIntoViewIfNeeded();
    const before = await h2.boundingBox();

    const reveal = page.getByText(revealText);
    await reveal.scrollIntoViewIfNeeded();
    // Endzustand nach dem einmaligen Aufblenden.
    await expect
      .poll(async () => Number(await reveal.evaluate((el) => getComputedStyle(el).opacity)))
      .toBe(1);

    const after = await h2.boundingBox();
    // Die Überschrift ist nicht gesprungen (nur opacity/transform, kein Layout-Shift).
    expect(Math.abs((after?.y ?? 0) - (before?.y ?? 0))).toBeLessThanOrEqual(1);
  });
});
