import { expect, test } from "@playwright/test";

/**
 * /wachstum-vertrieb (Baustein 0017, Schritt 2.5), gebaut aus Mock
 * 3.4b-wachstum-vertrieb-neufassung.html. Prüft die harten Akzeptanzkriterien:
 * - genau eine H1 (im Hero), kein horizontaler Seiten-Overflow (auch das Bleed-Cockpit
 *   im Hero, der „Vier Wege"-Slider und der links auslaufende Fundament-Fächer erzeugen
 *   keinen Overflow), keine Konsolenfehler – über alle Breakpoints (390/768/1024/1180/1440);
 * - OHNE JavaScript ist alles lesbar: der Slider ist nativ horizontal scrollbar (keine
 *   toten Pfeil-Buttons), die Scroll-Geschichte fällt auf die gestapelte Fassung zurück
 *   (jeder Schritt zeigt seinen Geräterahmen inline), die Such-Tippanimation zeigt den
 *   fertigen Zieltext;
 * - bei reduzierter Bewegung stehen die Animationen sofort im Endzustand (Anmeldungen im
 *   Cockpit sichtbar, alle Kampagnen-Schritte lesbar, Suchanfrage komplett).
 */

const H1 = "Neue Golfer finden Ihren Club. Bevor sie den Nachbarclub finden.";
const SEARCH_QUERY = "Platzreife-Kurs in der Nähe";

test.describe("/wachstum-vertrieb · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow (inkl. Bleed/Slider/Fächer), keine Konsolenfehler", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/wachstum-vertrieb");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: H1 })).toBeVisible();

    // Kein horizontaler Overflow – Hero-Cockpit (width > 100%), Slider
    // (margin-right:calc(50% - 50vw)) und Fundament-Fächer (left:-16%) werden vom
    // overflow:hidden ihrer Abschnitte gekappt.
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("Vier-Wege-Slider hat blätterbare Pfeil-Buttons (mit JS)", async ({ page }) => {
    await page.goto("/wachstum-vertrieb");
    const zurueck = page.getByRole("button", { name: "Zurück" });
    const weiter = page.getByRole("button", { name: "Weiter" });

    const width = page.viewportSize()?.width ?? 0;
    if (width > 620) {
      await expect(zurueck).toBeVisible();
      await expect(weiter).toBeVisible();
      await expect(zurueck).toBeDisabled();
    } else {
      // Unter 620px ist die Pfeil-Navigation bewusst ausgeblendet; gewischt wird nativ.
      await expect(weiter).toHaveCount(0);
    }
  });
});

test.describe("/wachstum-vertrieb ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Slider nativ scrollbar, keine toten Buttons, Story gestapelt, Tippanimation = Zieltext", async ({
    page,
  }) => {
    await page.goto("/wachstum-vertrieb");

    // Alle vier Wege-Karten liegen im DOM und sind lesbar.
    await expect(page.getByRole("heading", { level: 3, name: "Schnuppergolf & Platzreife" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Firmenkunden gewinnen" })).toBeVisible();

    // Der Rail ist nativ horizontal scrollbar (Inhalt breiter als der sichtbare Bereich).
    const rail = page.getByTestId("wege-rail");
    const scrollable = await rail.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(scrollable, "Rail nativ scrollbar").toBe(true);

    // Ohne JS keine (toten) Pfeil-Buttons.
    await expect(page.getByRole("button", { name: "Zurück" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Weiter" })).toHaveCount(0);

    // Scroll-Geschichte: erster und letzter Schritt-Text sind sichtbar (gestapelte Fassung).
    await expect(page.getByRole("heading", { level: 3, name: "Sie geben frei." })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Der Bericht." })).toBeVisible();

    // Such-Tippanimation zeigt ohne JS den fertigen Zieltext.
    await expect(page.getByText(SEARCH_QUERY, { exact: true })).toBeVisible();
  });
});

test.describe("/wachstum-vertrieb · reduzierte Bewegung", () => {
  test("Animationen stehen sofort im Endzustand", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/wachstum-vertrieb");

    // Hero-Cockpit: die letzte Anmeldung ist sofort sichtbar (Endzustand, opacity 1).
    const row = page.getByText("Tom Schulz").first();
    expect(Number(await row.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    // Such-Tippanimation: der Zieltext steht sofort vollständig.
    await expect(page.getByText(SEARCH_QUERY, { exact: true })).toBeVisible();

    // Kampagnen-Geschichte: der letzte Schritt ist lesbar (gestapelte Fassung, kein
    // klebender Rahmen bei reduzierter Bewegung).
    const last = page.getByRole("heading", { level: 3, name: "Der Bericht." });
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeVisible();

    await context.close();
  });
});
