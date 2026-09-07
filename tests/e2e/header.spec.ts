import { expect, test } from "@playwright/test";

/**
 * Header (Baustein 0004) auf der Vorschau /_bausteine. Läuft über alle
 * Breakpoint-Projekte (390–1440); Desktop-/Mobil-Erwartungen werden anhand der
 * Viewport-Breite gewählt (Breakpoint 1024 px).
 *
 * Seit Briefing 0022 rendert die Navigation NUR `live`-Routen: keine `href="#"`-
 * Platzhalter mehr, „Praxis" fehlt und die beiden Modul-Dropdowns erscheinen nicht,
 * solange keine Modulseite live ist (docs/10, „Navigation v1").
 */
function desktopOnly(page: import("@playwright/test").Page) {
  const vp = page.viewportSize();
  return !!vp && vp.width >= 1024;
}

/** Die aktuell live geschalteten Hauptpunkte, in Reihenfolge aus site-structure. */
const LIVE_HAUPT = [
  "/plattform",
  "/wachstum-vertrieb",
  "/clubprozesse",
  "/pakete",
  "/ueber-golfnext",
];

test.describe("Header · Struktur und Daten", () => {
  test("Wortmarke ist Home-Link mit aria-label; nur live-Routen sind verlinkt", async ({ page }) => {
    await page.goto("/_bausteine");

    // Wortmarke als Startseiten-Link. Auf die Kopfzeile begrenzt, da der Footer
    // (Baustein 0005) dieselbe Wortmarke ebenfalls als Home-Link führt.
    const home = page.locator("header").getByRole("link", { name: "GolfNext, zur Startseite" });
    await expect(home).toHaveAttribute("href", "/");

    // Header enthält keine H1 (die einzige H1 gehört der Seite)
    const headerH1 = page.locator("header h1");
    await expect(headerH1).toHaveCount(0);

    // CSS-Locator, damit display:none Navigationen mitzählen.
    const hrefs = await page
      .locator("header nav a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const path of LIVE_HAUPT) {
      expect(hrefs, `${path} ist live und wird verlinkt`).toContain(path);
    }
    // Kein toter Bedienpunkt mehr: jeder Navigationslink zeigt auf eine live-Route.
    for (const href of hrefs) {
      expect(href, "nur live-Routen in der Navigation").not.toBe("#");
      expect(href !== null && LIVE_HAUPT.includes(href), `unerwarteter Link ${href}`).toBe(true);
    }
  });

  test("nicht-live Punkte fehlen: kein Praxis, keine Modul-Dropdowns", async ({ page }) => {
    await page.goto("/_bausteine");

    const nav = page.locator("header nav");
    await expect(nav.locator('a:text-is("Praxis")')).toHaveCount(0);
    // Ohne live-Kinder gibt es keinen Dropdown-Öffner.
    await expect(page.getByRole("button", { name: /Untermenü/ })).toHaveCount(0);
    for (const modul of ["Reach", "Gastfee", "Captains App"]) {
      await expect(nav.locator(`a:text-is("${modul}")`)).toHaveCount(0);
    }
  });
});

test.describe("Header · CTA-Hover (hbtn)", () => {
  // Briefing 0014 Korrektur 3: Der Header-CTA dunkelt beim Hover auf #00CE04 ab
  // (rgb(0,206,4)), Navy-Text bleibt.
  test("Header-CTA wechselt beim Hover auf #00CE04", async ({ page }) => {
    await page.goto("/_bausteine");
    test.skip(!desktopOnly(page), "CTA nur ab 1024 px sichtbar");

    const cta = page
      .locator("header")
      .getByRole("link", { name: /Online-Erstgespräch vereinbaren/ });
    await expect(cta).toBeVisible();

    await cta.hover();
    await expect
      .poll(() => cta.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe("rgb(0, 206, 4)");
  });
});

test.describe("Header · Mobil-Menü (mit JS)", () => {
  test("Burger öffnet Vollbild-Menü, Escape schließt", async ({ page }) => {
    await page.goto("/_bausteine");
    test.skip(desktopOnly(page), "nur Mobil-Breakpoints");

    const burger = page.locator('summary[aria-controls="mobile-menu"]');
    const menu = page.locator("#mobile-menu");

    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Pakete", exact: true })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
  });
});

test.describe("Header ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Navigation und Menü sind ohne JS bedienbar", async ({ page }) => {
    await page.goto("/_bausteine");

    if (desktopOnly(page)) {
      // Desktop: die Hauptpunkte sind reine Links (aktuell ohne Dropdown).
      const nav = page.getByRole("navigation", { name: "Hauptnavigation", exact: true });
      const plattform = nav.getByRole("link", { name: "Plattform", exact: true });
      await expect(plattform).toBeVisible();
      await expect(plattform).toHaveAttribute("href", "/plattform");
    } else {
      // Mobil: <details>/<summary> öffnet nativ ohne JavaScript.
      const burger = page.locator('summary[aria-controls="mobile-menu"]');
      await burger.click();
      await expect(page.locator("#mobile-menu")).toBeVisible();
    }
  });
});
