import { expect, test } from "@playwright/test";

/**
 * Header (Baustein 0004) auf der Vorschau /_bausteine. Läuft über alle
 * Breakpoint-Projekte (390–1440); Desktop-/Mobil-Erwartungen werden anhand der
 * Viewport-Breite gewählt (Breakpoint 1024 px).
 */
function desktopOnly(page: import("@playwright/test").Page) {
  const vp = page.viewportSize();
  return !!vp && vp.width >= 1024;
}

test.describe("Header · Struktur und Daten", () => {
  test("Wortmarke ist Home-Link mit aria-label; nicht-live Nav-Punkte sind Platzhalter (#)", async ({
    page,
  }) => {
    await page.goto("/_bausteine");

    // Wortmarke als Startseiten-Link. Auf die Kopfzeile begrenzt, da der Footer
    // (Baustein 0005) dieselbe Wortmarke ebenfalls als Home-Link führt.
    const home = page.locator("header").getByRole("link", { name: "GolfNext, zur Startseite" });
    await expect(home).toHaveAttribute("href", "/");

    // Header enthält keine H1 (die einzige H1 gehört der Seite)
    const headerH1 = page.locator("header h1");
    await expect(headerH1).toHaveCount(0);

    // Live-Routen werden echt verlinkt: /pakete (Schritt 2.1), /plattform
    // (Schritt 2.3, Briefing 0016), /wachstum-vertrieb (Schritt 2.5, Briefing 0017)
    // und /clubprozesse (Schritt 2.6, Briefing 0018).
    // Alle übrigen (noch nicht live) Navigations-Links bleiben Platzhalter „#".
    // CSS-Locator, damit display:none Navigationen mitzählen.
    const live = ["/pakete", "/plattform", "/wachstum-vertrieb", "/clubprozesse"];
    const hrefs = await page
      .locator("header nav a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs, "Pakete ist live und wird verlinkt").toContain("/pakete");
    expect(hrefs, "Plattform ist live und wird verlinkt").toContain("/plattform");
    expect(hrefs, "Wachstum & Vertrieb ist live und wird verlinkt").toContain("/wachstum-vertrieb");
    expect(hrefs, "Clubprozesse ist live und wird verlinkt").toContain("/clubprozesse");
    for (const href of hrefs) {
      expect(
        href === "#" || (href !== null && live.includes(href)),
        "nur live-Routen echt verlinkt, sonst #",
      ).toBe(true);
    }
  });
});

test.describe("Header · Desktop-Dropdown (mit JS)", () => {
  test("öffnet per Klick, meldet aria-expanded, schließt mit Escape", async ({ page }) => {
    await page.goto("/_bausteine");
    test.skip(!desktopOnly(page), "nur Desktop-Breakpoints");

    const trigger = page.getByRole("button", { name: /Untermenü Plattform/ });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const nav = page.getByRole("navigation", { name: "Hauptnavigation", exact: true });
    await expect(nav.getByRole("link", { name: "Reach", exact: true })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // Briefing 0014: Der Modulstatus wird nicht mehr angezeigt – im Dropdown steht nur
  // Modulname + Link, kein Status-Badge.
  test("zeigt im Dropdown keinen Status-Badge (nur Modulname + Link)", async ({ page }) => {
    await page.goto("/_bausteine");
    test.skip(!desktopOnly(page), "nur Desktop-Breakpoints");

    const nav = page.getByRole("navigation", { name: "Hauptnavigation", exact: true });
    await page.getByRole("button", { name: /Untermenü Plattform/ }).click();
    await expect(nav.getByRole("link", { name: "Reach", exact: true })).toBeVisible();

    for (const label of ["Im Einsatz", "Pilot", "In Entwicklung"]) {
      await expect(nav.getByText(label, { exact: true })).toHaveCount(0);
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
      // Desktop: Dropdown erscheint über CSS :focus-within, wenn der Punkt fokussiert wird.
      const nav = page.getByRole("navigation", { name: "Hauptnavigation", exact: true });
      const plattform = nav.getByRole("link", { name: "Plattform", exact: true });
      await expect(plattform).toBeVisible();
      await plattform.focus();
      await expect(nav.getByRole("link", { name: "Reach", exact: true })).toBeVisible();
    } else {
      // Mobil: <details>/<summary> öffnet nativ ohne JavaScript.
      const burger = page.locator('summary[aria-controls="mobile-menu"]');
      await burger.click();
      await expect(page.locator("#mobile-menu")).toBeVisible();
    }
  });
});
