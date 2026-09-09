import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "../../config/site-structure";
import { OHNE_ARTIKEL_URL } from "../../playwright.config";

/**
 * Metadata, Sitemap, robots und strukturierte Daten (Briefing 0034,
 * Masterplan 6.1–6.4).
 *
 * SEO hängt nicht an der Fensterbreite: Der ganze Prüfblock läuft nur im Projekt
 * `w1440`. Fünfmal denselben Kopfbereich zu lesen kostet Zeit und findet nichts.
 *
 * Geprüft wird gegen `config/site-structure.ts` – dieselbe Wahrheit, aus der die
 * Seiten ihre Metadata ziehen. Eine Route, die dort dazukommt, wird hier von selbst
 * mitgeprüft; ein Titel, der dort verschwindet, fällt hier auf.
 */

/** Alle Routen, die in den Index gehören – Status `live` und kein `noindex`. */
const INDEXIERBAR = ROUTES.filter((r) => r.status === "live" && r.noindex !== true);

/** Aus dem Testbestand (`lib/sanity/fixtures.ts`), damit die Prüfung nicht vom Dataset abhängt. */
const ARTIKEL_PFAD = "/praxis/beispielartikel-1";
const RUBRIK_PFAD = "/praxis/thema/rubrik-a";

/** Inhalt eines Meta-Tags, oder `null` wenn es ihn nicht gibt. */
async function metaInhalt(page: Page, wahl: string): Promise<string | null> {
  const tag = page.locator(wahl);
  if ((await tag.count()) === 0) return null;
  return tag.first().getAttribute("content");
}

/**
 * Der Pfad einer Adresse aus dem Kopfbereich, zum Abrufen gegen den Testserver.
 *
 * `og:image` und `canonical` sind absolut und tragen die Adresse aus
 * `NEXT_PUBLIC_SITE_URL` – in der CI ist das `https://www.golfnext.de`, also die
 * echte Website. Wer sie unverändert abruft, prüft die Produktion statt den Build,
 * der hier gerade entstanden ist (genau das ist der CI am 09.09.2026 passiert).
 */
function pfadVon(adresse: string): string {
  const url = new URL(adresse);
  return url.pathname + url.search;
}

/** Alle JSON-LD-Blöcke einer Seite, geparst. Wirft, wenn einer kein gültiges JSON ist. */
async function strukturierteDaten(page: Page): Promise<Record<string, unknown>[]> {
  const roh = await page.locator('script[type="application/ld+json"]').allTextContents();
  return roh.map((text, i) => {
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      throw new Error(`JSON-LD-Block ${i + 1} ist kein gültiges JSON: ${text.slice(0, 120)}`);
    }
  });
}

test.describe("SEO · Metadata je Route", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) !== 1440, "SEO ist breitenunabhängig");

  for (const route of INDEXIERBAR) {
    test(`${route.path} · Titel, Canonical, genau eine H1`, async ({ page }) => {
      await page.goto(route.path);

      // Titel: der Wert aus site-structure, gegebenenfalls mit dem Marken-Suffix aus
      // dem Root-Layout. Kein leerer Tab, kein Rückfall auf „GolfNext".
      const erwartet = route.title ?? route.label;
      expect(await page.title(), `Titel von ${route.path}`).toContain(erwartet);

      // Genau ein Canonical, und zwar auf die eigene Adresse.
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical, `Canonical auf ${route.path}`).toHaveCount(1);
      const href = await canonical.getAttribute("href");
      expect(new URL(href!).pathname).toBe(route.path);

      // Genau eine H1 – JSON-LD ändert daran nichts.
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

      // Beschreibung: wo site-structure eine führt, steht genau diese. Wo nicht
      // (`/impressum`, `/datenschutz`), erbt die Seite die allgemeine Beschreibung
      // der Website aus dem Root-Layout – gewollt, und nichts Erfundenes. Leer darf
      // sie in keinem Fall sein.
      const beschreibung = await metaInhalt(page, 'meta[name="description"]');
      expect(beschreibung, `Beschreibung von ${route.path}`).toBeTruthy();
      if (route.description) {
        expect(beschreibung, `Beschreibung von ${route.path}`).toBe(route.description);
      }

      // Kein `noindex` auf einer Route, die in den Index gehört.
      expect(await metaInhalt(page, 'meta[name="robots"]')).toBeNull();
    });

    test(`${route.path} · Open Graph und Twitter`, async ({ page }) => {
      await page.goto(route.path);

      const ogTitel = await metaInhalt(page, 'meta[property="og:title"]');
      expect(ogTitel, `og:title auf ${route.path}`).toContain(route.title ?? route.label);
      expect(await metaInhalt(page, 'meta[property="og:site_name"]')).toBe("GolfNext");
      expect(await metaInhalt(page, 'meta[property="og:locale"]')).toBe("de_DE");
      expect(await metaInhalt(page, 'meta[name="twitter:card"]')).toBe("summary_large_image");

      const bild = await metaInhalt(page, 'meta[property="og:image"]');
      expect(bild, `og:image auf ${route.path}`).toBeTruthy();

      // Das Bild gibt es wirklich, es ist ein PNG und hat die OG-Maße.
      const antwort = await page.request.get(pfadVon(bild!));
      expect(antwort.status(), `OG-Bild von ${route.path}`).toBe(200);
      expect(antwort.headers()["content-type"]).toContain("image/png");
      expect(await metaInhalt(page, 'meta[property="og:image:width"]')).toBe("1200");
      expect(await metaInhalt(page, 'meta[property="og:image:height"]')).toBe("630");
    });
  }

  test("Sanity-Seiten tragen Canonical und ein eigenes OG-Bild", async ({ page }) => {
    for (const pfad of [ARTIKEL_PFAD, RUBRIK_PFAD]) {
      await page.goto(pfad);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical, `Canonical auf ${pfad}`).toHaveCount(1);
      expect(new URL((await canonical.getAttribute("href"))!).pathname).toBe(pfad);

      const bild = await metaInhalt(page, 'meta[property="og:image"]');
      expect(bild, `og:image auf ${pfad}`).toContain(pfad);
      expect((await page.request.get(pfadVon(bild!))).status()).toBe(200);
    }
  });

  test("/danke ist noindex", async ({ page }) => {
    await page.goto("/danke");
    expect(await metaInhalt(page, 'meta[name="robots"]')).toContain("noindex");
  });
});

test.describe("SEO · Sitemap und robots", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) !== 1440, "SEO ist breitenunabhängig");

  test("sitemap.xml führt alle live-Routen und keine noindex-Route", async ({ request }) => {
    const antwort = await request.get("/sitemap.xml");
    expect(antwort.status()).toBe(200);
    const xml = await antwort.text();

    const pfade = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);

    for (const route of INDEXIERBAR) {
      expect(pfade, `${route.path} fehlt in der Sitemap`).toContain(route.path);
    }

    // System- und noindex-Routen bleiben draußen, ebenso alles unter /api.
    for (const raus of ["/studio", "/danke", "/_bausteine"]) {
      expect(pfade, `${raus} steht in der Sitemap`).not.toContain(raus);
    }
    expect(
      pfade.some((p) => p.startsWith("/api")),
      "/api steht in der Sitemap",
    ).toBe(false);

    // Die Sanity-Inhalte sind da – mit Änderungsdatum.
    expect(pfade).toContain(ARTIKEL_PFAD);
    expect(pfade).toContain(RUBRIK_PFAD);
    expect(xml).toContain("<lastmod>");
  });

  test("robots.txt sperrt Studio, API und Bausteinvorschau und nennt die Sitemap", async ({
    request,
  }) => {
    const text = await (await request.get("/robots.txt")).text();

    for (const gesperrt of ["/studio", "/api", "/_bausteine"]) {
      expect(text).toContain(`Disallow: ${gesperrt}`);
    }
    expect(text).toContain("Sitemap:");
    expect(text).toContain("/sitemap.xml");
  });
});

test.describe("SEO · Strukturierte Daten", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) !== 1440, "SEO ist breitenunabhängig");

  // Das Markup sitzt im Layout der Gruppe `(site)` und muss deshalb auf jeder Seite
  // stehen – geprüft an drei verschiedenen Arten von Seite: der Startseite, einer
  // Rechtsseite und einer Seite aus Sanity.
  for (const pfad of ["/", "/impressum", "/praxis"]) {
    test(`Organization liegt als gültiges JSON-LD auf ${pfad}`, async ({ page }) => {
      await page.goto(pfad);
      const daten = await strukturierteDaten(page);
      const organisation = daten.find((d) => d["@type"] === "Organization");

      expect(organisation, `Organization fehlt auf ${pfad}`).toBeTruthy();
      expect(organisation!.name).toBe("GolfNext");
      expect(organisation!.founder).toMatchObject({ name: "Fred Hoffmann" });
      expect(organisation!.address).toMatchObject({ addressLocality: "Hannover" });

      // Nichts Erfundenes: keine Bewertungen, keine Preise, keine Öffnungszeiten.
      for (const verboten of ["aggregateRating", "review", "priceRange", "openingHours"]) {
        expect(organisation, `${verboten} im Organization-Markup`).not.toHaveProperty(verboten);
      }
    });
  }

  test("FAQPage auf /pakete kommt aus denselben Fragen wie der sichtbare Abschnitt", async ({
    page,
  }) => {
    await page.goto("/pakete");
    const daten = await strukturierteDaten(page);
    const faq = daten.find((d) => d["@type"] === "FAQPage") as
      | { mainEntity: { name: string }[] }
      | undefined;

    expect(faq, "FAQPage fehlt auf /pakete").toBeTruthy();

    // Jede Frage des Markups steht auch sichtbar auf der Seite.
    for (const frage of faq!.mainEntity) {
      await expect(page.getByText(frage.name, { exact: true }).first()).toBeVisible();
    }
  });

  test("Article und BreadcrumbList liegen auf einem Praxis-Artikel", async ({ page }) => {
    await page.goto(ARTIKEL_PFAD);
    const daten = await strukturierteDaten(page);

    const artikel = daten.find((d) => d["@type"] === "Article");
    expect(artikel, "Article fehlt").toBeTruthy();
    expect(artikel!.headline).toBeTruthy();
    expect(artikel!.datePublished).toBeTruthy();

    const brotkrumen = daten.find((d) => d["@type"] === "BreadcrumbList") as
      | { itemListElement: { position: number; name: string }[] }
      | undefined;
    expect(brotkrumen, "BreadcrumbList fehlt").toBeTruthy();
    expect(brotkrumen!.itemListElement[0]).toMatchObject({ position: 1 });
  });

  test("JSON-LD steht im Server-HTML – auch ohne JavaScript", async ({ request }) => {
    for (const [pfad, mindestens] of [
      ["/pakete", 2],
      ["/impressum", 1],
    ] as const) {
      const html = await (await request.get(pfad)).text();
      const bloecke = [
        ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
      ];

      expect(bloecke.length, `kein JSON-LD im Server-HTML von ${pfad}`).toBeGreaterThanOrEqual(
        mindestens,
      );
      for (const [, inhalt] of bloecke) {
        expect(() => JSON.parse(inhalt!)).not.toThrow();
      }
    }
  });
});

/**
 * Der Zustand, in dem die Website beim Abnehmen steht: ein Dataset, in dem Fred noch
 * nichts veröffentlicht hat (zweiter Testserver, `SANITY_SOURCE=fixtures-leer`).
 * Sitemap und OG-Bilder dürfen dann nicht fehlschlagen, sondern nur weniger führen.
 */
test.describe("SEO ohne veröffentlichte Artikel", () => {
  test.use({ baseURL: OHNE_ARTIKEL_URL });
  test.skip(({ viewport }) => (viewport?.width ?? 0) !== 1440, "SEO ist breitenunabhängig");

  test("die Sitemap führt die gebauten Seiten, aber keinen Artikel", async ({ request }) => {
    const antwort = await request.get("/sitemap.xml");
    expect(antwort.status()).toBe(200);

    const pfade = [...(await antwort.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]!).pathname,
    );

    for (const route of INDEXIERBAR) {
      expect(pfade, `${route.path} fehlt in der leeren Sitemap`).toContain(route.path);
    }
    expect(
      pfade.some((p) => p.startsWith("/praxis/") && !p.startsWith("/praxis/thema/")),
      "Artikel in der Sitemap, obwohl keiner veröffentlicht ist",
    ).toBe(false);
  });

  test("/praxis liefert weiterhin ein OG-Bild", async ({ page }) => {
    await page.goto("/praxis");
    const bild = await metaInhalt(page, 'meta[property="og:image"]');
    expect(bild, "og:image auf /praxis").toBeTruthy();
    expect((await page.request.get(pfadVon(bild!))).status()).toBe(200);
  });
});
