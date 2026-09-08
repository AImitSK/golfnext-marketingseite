import { expect, test } from "@playwright/test";

/**
 * /ueber-golfnext (Baustein 0019, Schritt 2.7), gebaut aus Mock
 * 3.8b-ueber-golfnext-neufassung.html. Prüft die harten Akzeptanzkriterien:
 * - genau eine H1 (im Hero), kein horizontaler Seiten-Overflow (auch das Bleed der
 *   Hero-Porträtkarten und der aus dem Raster laufende Wissen-Slider erzeugen keinen
 *   Overflow), keine Konsolenfehler – über alle Breakpoints (390/768/1024/1180/1440);
 * - KEIN Modulstatus (Entscheidung Stefan): Grundsatz /02 „Wir versprechen nur, was
 *   läuft.“ und die Status-Aufzählung „Im Einsatz/Pilot/In Entwicklung“ sind NICHT
 *   gebaut; die Überschrift lautet „Zwei Grundsätze …“;
 * - der „Pilotclub“-/Entwicklungspartner-Wortlaut bleibt wortgleich erhalten;
 * - OHNE JavaScript ist alles lesbar (Überschriften, Grundsätze, Zeitleiste, Club-
 *   Kacheln, Artikelkarten aus Sanity), keine toten Slider-Buttons;
 * - bei reduzierter Bewegung stehen die Reveals sofort im Endzustand.
 */

const H1 = "Wir hängen am Golf. Nicht am Gestern.";
const GRUNDSAETZE_H2 = "Zwei Grundsätze, an denen Sie uns messen können.";
const PILOT_RULE =
  "Jedes Modul entsteht in einem Pilotclub und wird dort im Alltag getestet – vom Sekretariat, vom Greenkeeper, vom Captain. Erst dann bekommen es andere.";
const PILOT_PROJEKTE =
  "An unserer Geschichte und an der Idee hinter GolfNext. Für sie haben wir Websites gestaltet, Kampagnen umgesetzt und Teams geschult – und mit einigen entwickeln wir die Plattform heute im Pilot weiter.";

test.describe("/ueber-golfnext · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow (inkl. Bleed/Slider), keine Konsolenfehler", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    for (const width of [390, 768, 1024, 1180, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/ueber-golfnext");

      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(hasOverflow, `horizontaler Overflow bei ${width}px`).toBe(false);
    }

    await expect(page.getByRole("heading", { level: 1, name: H1 })).toBeVisible();
    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("kein Modulstatus, aber Pilotclub-Wortlaut bleibt", async ({ page }) => {
    await page.goto("/ueber-golfnext");

    // Zwei Grundsätze – nicht drei; Grundsatz /02 (Modulstatus) fehlt.
    await expect(page.getByRole("heading", { level: 2, name: GRUNDSAETZE_H2 })).toBeVisible();
    await expect(page.getByText("Wir versprechen nur, was läuft.")).toHaveCount(0);

    // Keine Status-Labels/-Legende auf der Seite (der geteilte Footer zeigt sie auch nicht).
    await expect(page.getByText("Im Einsatz", { exact: true })).toHaveCount(0);
    await expect(page.getByText("In Entwicklung", { exact: true })).toHaveCount(0);

    // „Pilotclub“-/Entwicklungspartner-Wortlaut wortgleich erhalten.
    await expect(page.getByText(PILOT_RULE, { exact: true })).toBeVisible();
    await expect(page.getByText(PILOT_PROJEKTE, { exact: true })).toBeVisible();
  });
});

test.describe("/ueber-golfnext ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("verbindliche Texte lesbar, keine toten Slider-Buttons", async ({ page }) => {
    await page.goto("/ueber-golfnext");

    await expect(page.getByRole("heading", { level: 1, name: H1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: GRUNDSAETZE_H2 })).toBeVisible();

    // Zeitleiste (Server-HTML) lesbar.
    await expect(
      page.getByRole("heading", { level: 3, name: "Clubwebsites, Social Media, Kampagnen." }),
    ).toBeVisible();

    // Clublogos und Artikelkarten stehen im Server-HTML. Die Logos sind seit
    // 07.09.2026 echte Grafiken – der Clubname steht im Alt-Text, nicht mehr
    // als Text in einer Platzhalter-Kachel. Die Artikelkarten sind seit
    // Briefing 0029 echte Artikel aus Sanity (Testbestand: „Beispielartikel …").
    await expect(page.getByRole("img", { name: "Golfclub Rehburg-Loccum" })).toBeVisible();
    await expect(page.getByText("Beispielartikel 1", { exact: true })).toBeVisible();

    // Ohne JS keine toten Steuerelemente (Slider ist nativ scrollbar, Pfeile erst mit JS).
    await expect(page.getByRole("button", { name: "Zurück" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Weiter" })).toHaveCount(0);
  });
});

test.describe("/ueber-golfnext · reduzierte Bewegung", () => {
  test("Reveals stehen sofort im Endzustand", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/ueber-golfnext");

    // Die letzte Weg-Station ist sofort vollständig sichtbar (Endzustand, opacity 1).
    const station = page.getByRole("heading", {
      level: 3,
      name: "Eine Plattform für Website, Mitgliedergewinnung und Cluballtag.",
    });
    await station.scrollIntoViewIfNeeded();
    const stationCard = station.locator("xpath=ancestor::div[1]");
    expect(Number(await stationCard.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    await context.close();
  });
});
