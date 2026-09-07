import { expect, test } from "@playwright/test";
import { MODULE } from "../../config/site-structure";
import { uiMessages } from "../../lib/ui/messages";

/**
 * Platzhalter-Routen (Masterplan 2.8, Briefing 0022): noch `/praxis` und `/kontakt`.
 * `/team` und die zwölf `/module/<slug>` sind mit Briefing 0023 ersatzlos entfallen
 * und liefern jetzt 404. Läuft über alle Breakpoint-Projekte (390–1440).
 *
 * Geprüft wird vor allem, was NICHT da sein darf: erfundene Inhalte, Modulstatus,
 * Praxis-Artikel aus den Mocks 3.9a/3.9b, tote `#`-Links.
 */
const PLATZHALTER = [
  { path: "/praxis", titel: "Praxis", zurueck: "/ueber-golfnext" },
  { path: "/kontakt", titel: "Kontakt", zurueck: null },
];

/** Routen, die es seit Briefing 0023 nicht mehr gibt – ohne Weiterleitung. */
const ENTFERNT = ["/team", "/ratgeber", "/module/reach", "/module/turnier-news"];

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

  test("kein Overflow, keine zu großen Icons, keine Konsolenfehler", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    for (const seite of PLATZHALTER) {
      await page.goto(seite.path);

      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(hasOverflow, `horizontaler Overflow auf ${seite.path}`).toBe(false);

      // Icon-Guard: kein SVG über 90 px außer der Wortmarke ([data-large-svg]).
      const zuGross = await page.evaluate(() =>
        Array.from(document.querySelectorAll("svg"))
          .filter((svg) => !svg.closest("[data-large-svg]"))
          .map((svg) => svg.getBoundingClientRect())
          .filter((r) => r.width > 90 || r.height > 90).length,
      );
      expect(zuGross, `zu großes SVG auf ${seite.path}`).toBe(0);
    }

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("kein Modulstatus und kein Text aus den Praxis-Mocks", async ({ page }) => {
    for (const seite of PLATZHALTER) {
      await page.goto(seite.path);
      for (const verboten of ["Im Einsatz", "Pilot", "In Entwicklung"]) {
        await expect(page.getByText(verboten, { exact: true })).toHaveCount(0);
      }
      // Der Katalogtext für „In Entwicklung" darf ebenfalls nirgends auftauchen.
      await expect(page.getByText(uiMessages.moduleInDevelopment)).toHaveCount(0);
      // Keine Artikel-Vorschau, keine Themenfilter (3.9a/3.9b sind unfreigegeben).
      await expect(page.locator("article")).toHaveCount(0);
    }
  });

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
    await page.goto("/kontakt");
    const footer = page.locator("footer");
    for (const m of MODULE) {
      await expect(footer.getByText(m.name, { exact: true }), m.name).toHaveCount(1);
    }
    const hrefs = await footer
      .locator("a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
    expect(hrefs.filter((h) => h.startsWith("/module/")), "kein Modul-Link im Footer").toEqual([]);
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
    // internalHref und dürfen NICHT auf die neue leere Seite zeigen.
    await page.goto("/");
    const teaser = await page
      .locator("main a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(teaser, "kein Teaser auf /praxis").not.toContain("/praxis");
  });
});

test.describe("Platzhalter ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("/praxis ist ohne JS vollständig lesbar", async ({ page }) => {
    await page.goto("/praxis");
    await expect(page.locator("h1")).toHaveText("Praxis");
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
