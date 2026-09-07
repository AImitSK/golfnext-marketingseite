import { expect, test } from "@playwright/test";
import { MODULE } from "../../config/site-structure";
import { uiMessages } from "../../lib/ui/messages";

/**
 * Platzhalter-Routen (Masterplan 2.8, Briefing 0022): `/praxis`, `/team`, `/kontakt`
 * und die zwölf `/module/<slug>`. Läuft über alle Breakpoint-Projekte (390–1440).
 *
 * Geprüft wird vor allem, was NICHT da sein darf: erfundene Inhalte, Modulstatus,
 * Praxis-Artikel aus den Mocks 3.9a/3.9b, tote `#`-Links.
 */
const PLATZHALTER = [
  { path: "/praxis", titel: "Praxis", zurueck: "/ueber-golfnext" },
  { path: "/team", titel: "Team", zurueck: "/ueber-golfnext" },
  { path: "/kontakt", titel: "Kontakt", zurueck: null },
  { path: "/module/reach", titel: "Reach", zurueck: "/plattform" },
  { path: "/module/turnier-news", titel: "Turnier-News", zurueck: "/clubprozesse" },
];

test.describe("Platzhalter-Routen", () => {
  for (const seite of PLATZHALTER) {
    test(`${seite.path} zeigt die Platzhalterseite mit genau einer H1`, async ({ page }) => {
      const response = await page.goto(seite.path);
      expect(response?.status()).toBe(200);

      const h1 = page.locator("h1");
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(seite.titel);

      // Sichtbare Sätze wortgleich aus lib/ui/messages.ts.
      await expect(page.getByText(uiMessages.platzhalter.eyebrow, { exact: true })).toBeVisible();
      await expect(page.getByText(uiMessages.platzhalter.body, { exact: true })).toBeVisible();
      await expect(
        page.getByRole("link", { name: uiMessages.platzhalter.actionHome, exact: true }),
      ).toHaveAttribute("href", "/");

      // Header und Footer wie überall.
      await expect(page.locator("header")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);

      // Rücklink in den passenden, bereits gebauten Bereich – oder gar keiner.
      const main = page.locator("main");
      if (seite.zurueck) {
        await expect(main.locator(`a[href="${seite.zurueck}"]`)).toHaveCount(1);
      } else {
        await expect(
          page.getByText(uiMessages.platzhalter.kontaktHinweis, { exact: true }),
        ).toBeVisible();
      }
    });
  }

  test("kein Modulstatus und kein Text aus den Praxis-Mocks", async ({ page }) => {
    for (const path of ["/module/gastfee", "/module/captains-app", "/praxis"]) {
      await page.goto(path);
      for (const verboten of ["Im Einsatz", "Pilot", "In Entwicklung"]) {
        await expect(page.getByText(verboten, { exact: true })).toHaveCount(0);
      }
      // Der Katalogtext für „In Entwicklung" darf ebenfalls nirgends auftauchen.
      await expect(page.getByText(uiMessages.moduleInDevelopment)).toHaveCount(0);
      // Keine Artikel-Vorschau, keine Themenfilter (3.9a/3.9b sind unfreigegeben).
      await expect(page.locator("article")).toHaveCount(0);
    }
  });

  test("alle zwölf Modul-Slugs existieren, ein unbekannter nicht", async ({ page }) => {
    for (const m of MODULE) {
      const response = await page.request.get(`/module/${m.slug}`);
      expect(response.status(), `/module/${m.slug}`).toBe(200);
    }
    const unbekannt = await page.request.get("/module/gibt-es-nicht");
    expect(unbekannt.status()).toBe(404);
  });

  test("Header und Footer führen keine toten #-Links mehr", async ({ page }) => {
    await page.goto("/kontakt");
    for (const bereich of ["header", "footer"]) {
      const hrefs = await page
        .locator(`${bereich} a`)
        .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
      expect(hrefs.length).toBeGreaterThan(0);
      expect(hrefs, `${bereich} ohne href="#"`).not.toContain("#");
    }
  });

  test("Teaser-Links auf / bleiben unverändert Platzhalter", async ({ page }) => {
    // Gegenprobe zur Navigations-Änderung: die Seiten-Teaser laufen über
    // internalHref und dürfen NICHT auf die neuen leeren Seiten zeigen.
    await page.goto("/");
    const teaser = await page
      .locator("main a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    for (const path of ["/praxis", "/team"]) {
      expect(teaser, `kein Teaser auf ${path}`).not.toContain(path);
    }
  });
});

test.describe("Platzhalter ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("/team ist ohne JS vollständig lesbar", async ({ page }) => {
    await page.goto("/team");
    await expect(page.locator("h1")).toHaveText("Team");
    await expect(page.getByText(uiMessages.platzhalter.body, { exact: true })).toBeVisible();
    await expect(
      page.getByRole("link", { name: uiMessages.platzhalter.actionHome, exact: true }),
    ).toBeVisible();
  });
});

test.describe("Platzhalter bei prefers-reduced-motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("/praxis zeigt sofort den Endzustand", async ({ page }) => {
    await page.goto("/praxis");
    const stack = page.locator("main h1");
    await expect(stack).toBeVisible();
    // Kein Rest-Versatz aus der Reveal-Variante (opacity 1, kein translate).
    const style = await page
      .locator("main h1")
      .evaluate((el) => getComputedStyle(el.parentElement!));
    expect(style.opacity).toBe("1");
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(style.transform);
  });
});
