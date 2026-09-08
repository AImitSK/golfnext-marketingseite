import { expect, test } from "@playwright/test";
import { MODULE } from "../../config/site-structure";

/**
 * Reste der Platzhalter-Phase (Masterplan 2.8, Briefing 0022) – **es gibt keine
 * Platzhalter-Route mehr**: `/kontakt` ist mit Briefing 0025 eine echte Seite
 * geworden, `/praxis` mit Briefing 0027 (siehe tests/e2e/praxis.spec.ts).
 * `/team` und die zwölf `/module/<slug>` sind mit Briefing 0023 ersatzlos entfallen.
 *
 * Geblieben sind die Gegenproben, die weiterhin site-weit gelten: entfernte Routen
 * liefern 404 ohne Weiterleitung, die Modulnamen stehen im Footer als Text ohne Link,
 * Header und Footer führen keine toten `#`-Links, und die Teaser der Startseite
 * zeigen nicht auf eine Route, die noch nicht `live` ist.
 *
 * Läuft über alle Breakpoint-Projekte (390–1440).
 */

/** Routen, die es seit Briefing 0023 nicht mehr gibt – ohne Weiterleitung. */
const ENTFERNT = ["/team", "/ratgeber", "/module/reach", "/module/turnier-news"];

test.describe("Entfernte Routen und site-weite Gegenproben", () => {
  test("entfernte Routen liefern 404, ohne Weiterleitung", async ({ page }) => {
    // Briefing 0023: /team, /ratgeber und die zwölf Modulseiten sind ersatzlos weg.
    // Die Website war nie unter www.golfnext.de erreichbar – keine Redirects.
    for (const path of ENTFERNT) {
      const response = await page.request.get(path);
      expect(response.status(), path).toBe(404);
      expect(new URL(response.url()).pathname, `${path} wurde weitergeleitet`).toBe(path);
    }
    for (const m of MODULE) {
      const response = await page.request.get(`/module/${m.slug}`);
      expect(response.status(), `/module/${m.slug}`).toBe(404);
    }
  });

  test("die zwölf Modulnamen stehen im Footer – als Text ohne Link", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    for (const m of MODULE) {
      await expect(footer.getByText(m.name, { exact: true }), m.name).toHaveCount(1);
    }
    const hrefs = await footer
      .locator("a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
    expect(
      hrefs.filter((h) => h.startsWith("/module/")),
      "kein Modul-Link im Footer",
    ).toEqual([]);
  });

  test("Header und Footer führen keine toten #-Links", async ({ page }) => {
    await page.goto("/");
    for (const bereich of ["header", "footer"]) {
      const hrefs = await page
        .locator(`${bereich} a`)
        .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
      expect(hrefs.length).toBeGreaterThan(0);
      expect(hrefs, `${bereich} ohne href="#"`).not.toContain("#");
    }
  });

  test("Der Praxis-Teaser auf / führt auf die live geschaltete Praxis", async ({ page }) => {
    // `/praxis` steht seit 08.09.2026 auf `live` (Entscheidung Stefan). Der Link
    // „Alle Beiträge" läuft über internalHref und zeigt damit auf die echte Adresse
    // statt auf `#`. Die Gegenprobe von vorher (kein Teaser auf /praxis) ist damit
    // überholt.
    await page.goto("/");
    const teaser = await page
      .locator("main a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(teaser, "Teaser führt auf /praxis").toContain("/praxis");
  });
});
