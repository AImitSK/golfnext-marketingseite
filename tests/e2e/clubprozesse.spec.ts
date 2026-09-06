import { expect, test } from "@playwright/test";

/**
 * /clubprozesse (Baustein 0018, Schritt 2.6), gebaut aus Mock
 * 3.5b-clubprozesse-neufassung.html. Prüft die harten Akzeptanzkriterien:
 * - genau eine H1 (im Hero), kein horizontaler Seiten-Overflow (auch das Bleed-Visual
 *   im Hero und die aus dem Raster laufende Turnier-News-Bericht-Strecke erzeugen keinen
 *   Overflow), keine Konsolenfehler – über alle Breakpoints (390/768/1024/1180/1440);
 * - OHNE JavaScript ist alles lesbar: die verbindlichen Texte (Überschriften, Leads,
 *   Box-Titel, Track-Line, Captains-Note, „Was bleibt"-Listen) stehen im Server-HTML,
 *   und die Beispieloberflächen zeigen ihren Endzustand (Platz bespielbar, alle
 *   Log-/News-Zeilen, alle drei Turnier-News-Ausgaben, der Mannschaftsbeitrag);
 * - bei reduzierter Bewegung stehen die Animationen sofort im Endzustand;
 * - der Modulstatus wird NICHT dargestellt (keine „Pilot"/„Im Einsatz"/„In
 *   Entwicklung"-Badges, nicht die Zeile „Stand je Modul wie im Footer"), die
 *   Praxis-Zeile „68 % Rehburg-Loccum" bleibt erhalten.
 */

const H1 = "Mehr Clubleben. Weniger Arbeit im Clubbüro.";
const LOG_SUM = "5 Vorgänge · 0 Anrufe im Büro";
const OUT_WEBSITE = "Monatsbecher September: Petra Lange gewinnt";
const POST_TEXT =
  "Starker Tag von Michael Weber, der sein Einzel auf der 17 entschied. Damit bleibt die Mannschaft ungeschlagen.";
const PRAXIS = "Im Pilot des Golfclubs Rehburg-Loccum kamen 68 % der Fragen außerhalb der Bürozeiten.";

test.describe("/clubprozesse · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow (inkl. Bleed/Track), keine Konsolenfehler", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/clubprozesse");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: H1 })).toBeVisible();

    // Kein horizontaler Overflow – Hero-Demo (width > 100%) und die Turnier-News-
    // Bericht-Strecke (läuft rechts aus dem Raster) werden vom overflow:hidden ihrer
    // Abschnitte gekappt.
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("kein Modulstatus-Badge, keine Modulstatus-Zeile; Praxis-Zeile bleibt", async ({ page }) => {
    await page.goto("/clubprozesse");

    // Die freigegebene Praxis-Zeile bleibt wortgleich erhalten.
    await expect(page.getByText(PRAXIS, { exact: true })).toBeVisible();

    // Keine Status-Badges und keine Modulstatus-Legende/-Zeile auf der Seite.
    await expect(page.getByText("In Entwicklung")).toHaveCount(0);
    await expect(page.getByText("Im Einsatz")).toHaveCount(0);
    await expect(page.getByText(/Stand je Modul wie im Footer/)).toHaveCount(0);
  });
});

test.describe("/clubprozesse ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("verbindliche Texte lesbar, Beispieloberflächen im Endzustand", async ({ page }) => {
    await page.goto("/clubprozesse");

    // Die Box-Titel (verbindlicher Text) sind echte Überschriften und lesbar.
    await expect(page.getByRole("heading", { level: 3, name: "Fragen beantwortet der Concierge." })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Die Gastfee bezahlt der Gast selbst." })).toBeVisible();

    // Track-Line und Captains-Note stehen im Server-HTML.
    await expect(page.getByText("Nichts geht ohne Freigabe raus.")).toBeVisible();
    await expect(
      page.getByText("Es sieht nur, dass die Seite aktuell ist.", { exact: false }),
    ).toBeVisible();

    // „Was bleibt": beide Spaltenüberschriften lesbar.
    await expect(page.getByText("Läuft von allein", { exact: true })).toBeVisible();
    await expect(page.getByText("Bleibt beim Clubteam", { exact: true })).toBeVisible();

    // Beispieloberflächen zeigen ohne JS ihren Endzustand.
    await expect(page.getByText(LOG_SUM, { exact: true })).toBeVisible();
    await expect(page.getByText(OUT_WEBSITE, { exact: true })).toBeVisible();
    await expect(page.getByText(POST_TEXT, { exact: true })).toBeVisible();

    // Ohne JS keine toten Steuerelemente (die CTAs sind Links).
    await expect(page.getByRole("button", { name: "Zurück" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Weiter" })).toHaveCount(0);
  });
});

test.describe("/clubprozesse · reduzierte Bewegung", () => {
  test("Animationen stehen sofort im Endzustand", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/clubprozesse");

    // Hero-Log: die Zusammenfassung ist sofort sichtbar (Endzustand, opacity 1).
    const sum = page.getByText(LOG_SUM, { exact: true });
    expect(Number(await sum.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    // Turnier-News: die letzte Ausgabe (Instagram) ist sofort vollständig sichtbar.
    const out = page.getByText("Kurz, bildgeführt, quadratisch.", { exact: true });
    await out.scrollIntoViewIfNeeded();
    const outCard = out.locator("xpath=ancestor::*[contains(@class,'out')][1]");
    expect(Number(await outCard.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    // Captains App: der Mannschaftsbeitrag ist sofort lesbar.
    const post = page.getByText(POST_TEXT, { exact: true });
    await post.scrollIntoViewIfNeeded();
    await expect(post).toBeVisible();

    await context.close();
  });
});
