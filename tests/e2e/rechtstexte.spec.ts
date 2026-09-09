import { expect, test, type Page } from "@playwright/test";
import { readLegalDocument } from "../../lib/legal";

/**
 * /impressum und /datenschutz (Briefing 0028, Masterplan 5.1 und 5.2).
 * Geprüft werden die Akzeptanzkriterien des Briefings:
 * - beide Routen laden, genau eine `<h1>`, kein horizontaler Overflow;
 * - der Wortlaut aus `docs/legal/` steht auf der Seite – die internen `>`-Vermerke
 *   und offene `[[ … ]]`-Stellen dagegen **nicht**;
 * - kein `noindex`, Canonical gesetzt;
 * - `/impressum/` leitet auf `/impressum` um;
 * - die Fußleiste verlinkt beide Seiten – von jeder Seite aus;
 * - Zeilenlänge höchstens 70 Zeichen;
 * - ohne JavaScript vollständig lesbar.
 */

const SEITEN = [
  { pfad: "/impressum", datei: "impressum.md", h1: "Impressum" },
  { pfad: "/datenschutz", datei: "datenschutz.md", h1: "Datenschutzerklärung" },
] as const;

/** Sichtbarer Text der Seite, so wie ihn ein Leser (und eine Suchmaschine) sieht. */
async function seitentext(page: Page): Promise<string> {
  return (await page.locator("main").innerText()).replace(/\s+/g, " ");
}

for (const seite of SEITEN) {
  test.describe(`${seite.pfad} · Struktur, Wortlaut, Indexierung`, () => {
    test("genau eine H1, kein Overflow, keine Konsolenfehler", async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      await page.goto(seite.pfad);

      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1, name: seite.h1 })).toBeVisible();

      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(hasOverflow, `horizontaler Overflow auf ${seite.pfad}`).toBe(false);

      expect(consoleErrors, "Konsolenfehler").toEqual([]);
    });

    test("gibt den freigegebenen Wortlaut wieder – ohne interne Vermerke", async ({ page }) => {
      await page.goto(seite.pfad);
      const text = await seitentext(page);
      const dokument = readLegalDocument(seite.datei);

      // Jede Überschrift aus der Quelldatei steht auf der Seite.
      for (const block of dokument.blocks) {
        if (block.kind !== "h2") continue;
        await expect(page.getByRole("heading", { level: 2, name: block.text })).toBeVisible();
      }

      // Interne Vermerke und offene Stellen erscheinen nirgends im Text.
      expect(text).not.toContain("Interner Vermerk");
      expect(text).not.toContain("Interne Checkliste");
      expect(text).not.toContain("[[");
      // Auch nicht im ausgelieferten HTML (z. B. als Kommentar oder Attribut).
      // Die `<script>`-Blöcke bleiben außen vor: Darin steht Nexts eigene
      // Datenübergabe, die von Haus aus `[[` enthält (`self.__next_f.push([[…`).
      const html = (await page.content()).replace(/<script[\s\S]*?<\/script>/g, "");
      expect(html).not.toContain("nicht veröffentlichen");
      expect(html).not.toContain("Interner Vermerk");
      expect(html).not.toContain("[[");
    });

    test("ist indexierbar und trägt eine Canonical", async ({ page }) => {
      const antwort = await page.goto(seite.pfad);
      expect(antwort?.status()).toBe(200);

      // Weder als Meta-Tag noch als Header darf ein noindex stehen.
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
      const robotsHeader = antwort?.headers()["x-robots-tag"];
      expect(robotsHeader ?? "").not.toContain("noindex");

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`${seite.pfad}$`),
      );
    });

    test("hält die Zeilenlänge unter 70 Zeichen", async ({ page }) => {
      await page.goto(seite.pfad);

      // Gemessen wird die Breite von 70 Nullen in der Schrift des Absatzes – der
      // gängige Maßstab für „ch". Kein Absatz darf breiter sein.
      const zuBreit = await page.locator("main p").evaluateAll((absaetze) =>
        absaetze
          .map((p) => {
            const stil = getComputedStyle(p);
            const leinwand = document.createElement("canvas").getContext("2d")!;
            leinwand.font = `${stil.fontSize} ${stil.fontFamily}`;
            return {
              breite: p.getBoundingClientRect().width,
              max: leinwand.measureText("0".repeat(70)).width,
              text: p.textContent!.slice(0, 40),
            };
          })
          .filter((m) => m.breite > m.max + 1),
      );
      expect(zuBreit, "Absätze breiter als 70 Zeichen").toEqual([]);
    });
  });

  test.describe(`${seite.pfad} ohne JavaScript`, () => {
    test.use({ javaScriptEnabled: false });

    test("ist vollständig lesbar", async ({ page }) => {
      await page.goto(seite.pfad);
      const dokument = readLegalDocument(seite.datei);

      await expect(page.getByRole("heading", { level: 1, name: seite.h1 })).toBeVisible();
      for (const block of dokument.blocks) {
        if (block.kind !== "h2") continue;
        await expect(page.getByRole("heading", { level: 2, name: block.text })).toBeVisible();
      }

      // Der Reveal darf ohne JS nichts verstecken: Der Textblock ist voll sichtbar.
      const ersterAbsatz = page.locator("main p").first();
      await expect(ersterAbsatz).toBeVisible();
      await expect(ersterAbsatz).toHaveCSS("opacity", "1");
    });
  });
}

test.describe("Rechtstexte · reduzierte Bewegung", () => {
  test("der Reveal steht sofort im Endzustand", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();

    for (const seite of SEITEN) {
      await page.goto(seite.pfad);
      const block = page.locator("main h1");
      expect(Number(await block.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);
      // Der letzte Absatz weit unten ist ebenfalls sofort da – kein wartendes Fade.
      const letzter = page.locator("main p").last();
      expect(Number(await letzter.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);
      await expect(letzter).toBeVisible();
    }

    await context.close();
  });
});

test.describe("Rechtstexte · Weiterleitung und Fußleiste", () => {
  test("/impressum/ leitet auf /impressum um", async ({ page }) => {
    const antwort = await page.goto("/impressum/");
    expect(antwort?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/impressum");
  });

  test("die Fußleiste verlinkt beide Seiten – auf jeder Seite", async ({ page }) => {
    for (const start of ["/", "/pakete", "/kontakt"]) {
      await page.goto(start);
      const bar = page.locator("footer");
      await expect(
        bar.getByRole("link", { name: "Impressum", exact: true }),
        `Impressum-Link fehlt auf ${start}`,
      ).toHaveAttribute("href", "/impressum");
      await expect(
        bar.getByRole("link", { name: "Datenschutz", exact: true }),
        `Datenschutz-Link fehlt auf ${start}`,
      ).toHaveAttribute("href", "/datenschutz");
    }
  });

  test("der Fußleisten-Link führt wirklich auf die Seite", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Impressum", exact: true }).click();
    await expect(page).toHaveURL(/\/impressum$/);
    await expect(page.getByRole("heading", { level: 1, name: "Impressum" })).toBeVisible();
  });
});
