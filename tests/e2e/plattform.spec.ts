import { expect, test } from "@playwright/test";

/**
 * /plattform (Baustein 0016, Schritt 2.3), gebaut aus Mock 3.2c-plattform-neufassung.html.
 * Prüft die harten Akzeptanzkriterien:
 * - genau eine H1 (im Hero), kein horizontaler Seiten-Overflow (auch das Bleed-Visual
 *   im Hero und der Rollen-Slider erzeugen keinen Overflow), keine Konsolenfehler –
 *   über alle Breakpoints (playwright.config.ts: 390/768/1024/1180/1440);
 * - OHNE JavaScript ist alles lesbar: der Rollen-Slider ist nativ horizontal scrollbar
 *   (keine toten Pfeil-Buttons), die Scroll-Geschichte fällt auf die gestapelte Fassung
 *   zurück (jeder Schritt zeigt seinen Geräterahmen inline);
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

  test("Rollen-Slider hat blätterbare Pfeil-Buttons (mit JS)", async ({ page }) => {
    await page.goto("/plattform");
    const zurueck = page.getByRole("button", { name: "Zurück" });
    const weiter = page.getByRole("button", { name: "Weiter" });

    const width = page.viewportSize()?.width ?? 0;
    if (width > 620) {
      // Nach Mount erscheinen die Pfeil-Buttons; „Zurück" ist am Anfang deaktiviert.
      await expect(zurueck).toBeVisible();
      await expect(weiter).toBeVisible();
      await expect(zurueck).toBeDisabled();
    } else {
      // Unter 620px ist die Pfeil-Navigation bewusst ausgeblendet (display:none →
      // nicht im A11y-Baum); gewischt wird nativ.
      await expect(weiter).toHaveCount(0);
    }
  });
});

test.describe("/plattform ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Slider ist nativ scrollbar, keine toten Pfeil-Buttons, Story gestapelt lesbar", async ({
    page,
  }) => {
    await page.goto("/plattform");

    // Alle sechs Rollenkarten liegen im DOM und sind lesbar.
    await expect(page.getByRole("heading", { level: 3, name: "Greenkeeper" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Captain" })).toBeVisible();

    // Der Rail ist nativ horizontal scrollbar (Inhalt breiter als der sichtbare Bereich).
    const rail = page.getByTestId("rollen-rail");
    const scrollable = await rail.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(scrollable, "Rail nativ scrollbar").toBe(true);

    // Ohne JS keine (toten) Pfeil-Buttons.
    await expect(page.getByRole("button", { name: "Zurück" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Weiter" })).toHaveCount(0);

    // Scroll-Geschichte: alle fünf Schritt-Texte sind sichtbar (gestapelte Fassung).
    await expect(page.getByText(/Läuft dort, wo Anfänger abends scrollen/)).toBeVisible();
    await expect(
      page.getByText(/Anmeldung zur Platzreife\. Das Clubbüro hat bis hierher nichts getippt/),
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
