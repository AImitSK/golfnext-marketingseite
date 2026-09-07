import { expect, test } from "@playwright/test";

/**
 * Header (Baustein 0004) auf der Vorschau /_bausteine. Läuft über alle
 * Breakpoint-Projekte (390–1440); Desktop-/Mobil-Erwartungen werden anhand der
 * Viewport-Breite gewählt (Breakpoint 1024 px).
 *
 * Struktur v2 (Briefing 0023, 07.09.2026): Plattform · Wachstum & Vertrieb ·
 * Clubprozesse · Pakete · Über GolfNext plus CTA. „Praxis" ist Unterpunkt von
 * „Über GolfNext" geworden, die zwölf Modulseiten sind entfallen.
 *
 * Die Navigation rendert NUR `live`-Routen (Briefing 0022): keine `href="#"`-
 * Platzhalter mehr. Seit Briefing 0024 ist „So arbeitet GolfNext" gebaut und `live` –
 * damit trägt „Plattform" ein Dropdown mit genau diesem einen Punkt. Seit Briefing
 * 0025 ist `/kontakt` gebaut und `live` – damit hat auch „Über GolfNext" ein
 * Dropdown, das bisher nur „Kontakt" enthält. Ratgeber (`/praxis`) bleibt außen vor,
 * bis der Blog in Phase 3 aus Sanity kommt.
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

/** Live geschaltete Dropdown-Punkte (0024: „So arbeitet GolfNext", 0025: „Kontakt"). */
const LIVE_KINDER = ["/plattform/so-arbeitet-golfnext", "/kontakt"];

test.describe("Header · Struktur und Daten", () => {
  test("Wortmarke ist Home-Link mit aria-label; nur live-Routen sind verlinkt", async ({
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

    // CSS-Locator, damit display:none Navigationen mitzählen.
    const hrefs = await page
      .locator("header nav a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const path of LIVE_HAUPT) {
      expect(hrefs, `${path} ist live und wird verlinkt`).toContain(path);
    }
    // Kein toter Bedienpunkt mehr: jeder Navigationslink zeigt auf eine live-Route.
    const erlaubt = [...LIVE_HAUPT, ...LIVE_KINDER];
    for (const href of hrefs) {
      expect(href, "nur live-Routen in der Navigation").not.toBe("#");
      expect(href !== null && erlaubt.includes(href), `unerwarteter Link ${href}`).toBe(true);
    }
  });

  test("Plattform und Über GolfNext tragen Dropdowns; Ratgeber fehlt weiter", async ({ page }) => {
    await page.goto("/_bausteine");

    const nav = page.locator("header nav");
    // `/praxis` (Menü-Label „Ratgeber") ist Kind von „Über GolfNext" und nicht live –
    // weder als Hauptpunkt noch im Dropdown.
    await expect(nav.locator('a:text-is("Praxis")')).toHaveCount(0);
    await expect(nav.locator('a:text-is("Ratgeber")')).toHaveCount(0);

    // Zwei Dropdown-Öffner: „Plattform" und „Über GolfNext" (Desktop; mobil klappt
    // <details> auf).
    if (desktopOnly(page)) {
      const oeffner = page.getByRole("button", { name: /Untermenü/ });
      await expect(oeffner).toHaveCount(2);
      await expect(oeffner.first()).toHaveAccessibleName(/Untermenü Plattform/);
      await expect(oeffner.last()).toHaveAccessibleName(/Untermenü Über GolfNext/);
    }
    // Beide Dropdown-Punkte stehen im Server-HTML und sind echt verlinkt.
    await expect(nav.locator('a[href="/plattform/so-arbeitet-golfnext"]').first()).toHaveAttribute(
      "href",
      "/plattform/so-arbeitet-golfnext",
    );
    // „Kontakt" erscheint mit Briefing 0025 zum ersten Mal im Menü.
    await expect(nav.locator('a[href="/kontakt"]').first()).toHaveAttribute("href", "/kontakt");

    // Die Modulseiten sind entfallen; ihre Namen stehen nur noch im Footer.
    for (const modul of ["Reach", "Gastfee", "Captains App"]) {
      await expect(nav.locator(`a:text-is("${modul}")`)).toHaveCount(0);
    }
  });

  test("Header und Mobilmenü führen keinen einzigen #-Link", async ({ page }) => {
    await page.goto("/_bausteine");

    // CSS-Locator, damit auch das per display:none verborgene Mobilmenü mitzählt.
    const hrefs = await page
      .locator("header a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs, 'Header und Mobilmenü ohne href="#"').not.toContain("#");

    // Kein interner Link zeigt auf eine entfernte Route.
    for (const href of hrefs) {
      expect(href ?? "", `entfernte Route verlinkt: ${href}`).not.toMatch(
        /^\/(team|ratgeber|module)(\/|$)/,
      );
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
      // Desktop: jeder Hauptpunkt bleibt ein echter Link; das Plattform-Dropdown
      // öffnet ohne JS über :hover/:focus-within (Briefing 0024).
      const nav = page.getByRole("navigation", { name: "Hauptnavigation", exact: true });
      const plattform = nav.getByRole("link", { name: "Plattform", exact: true });
      await expect(plattform).toBeVisible();
      await expect(plattform).toHaveAttribute("href", "/plattform");

      const unterpunkt = nav.getByRole("link", { name: "So arbeitet GolfNext", exact: true });
      await plattform.focus();
      await expect(unterpunkt).toBeVisible();
      await expect(unterpunkt).toHaveAttribute("href", "/plattform/so-arbeitet-golfnext");
    } else {
      // Mobil: <details>/<summary> öffnet nativ ohne JavaScript.
      const burger = page.locator('summary[aria-controls="mobile-menu"]');
      await burger.click();
      await expect(page.locator("#mobile-menu")).toBeVisible();
    }
  });
});
