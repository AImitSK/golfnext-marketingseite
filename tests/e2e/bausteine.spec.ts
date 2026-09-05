import { expect, test } from "@playwright/test";

/**
 * Interne Bausteine-Referenz /_bausteine (Abschluss Phase 1, Briefing 0010).
 * Läuft über alle Breakpoint-Projekte der playwright.config.ts (390–1440).
 */

/**
 * Abschnitts-Vollständigkeit (Briefing 0010 · Akzeptanzkriterium): jeder
 * Phase-1-Baustein ist als beschrifteter <h2>-Abschnitt vertreten, in der
 * Reihenfolge nach dem UI-Kit 2.5 (Kit-Gruppen) plus den GolfNext-eigenen
 * Bausteinen (Header, Layout, Platzhalter, Bewegung, Footer, onDark). Fällt ein
 * Abschnitt weg oder verrutscht die Reihenfolge, schlägt dieser Test an.
 */
const SECTIONS = [
  "Header",
  "Layout-Primitives",
  "Buttons & Links",
  "Badges & Chips",
  "Formularfelder",
  "FAQ-Akkordeon",
  "Rückmeldungen",
  "Platzhalter",
  "Bewegung",
  "Footer",
  "Bausteine auf Navy",
];

test.describe("/_bausteine · Abschnitts-Vollständigkeit", () => {
  test("alle Phase-1-Abschnitte sind als <h2> vorhanden und in 2.5-Reihenfolge", async ({
    page,
  }) => {
    await page.goto("/_bausteine");

    // Jeder erwartete Abschnitt existiert genau einmal als <h2>.
    for (const name of SECTIONS) {
      await expect(page.getByRole("heading", { level: 2, name, exact: true })).toHaveCount(1);
    }

    // Reihenfolge der Referenz-Abschnitte entspricht der 2.5-Ordnung.
    const allH2 = await page.getByRole("heading", { level: 2 }).allInnerTexts();
    const ordered = allH2.map((t) => t.trim()).filter((t) => SECTIONS.includes(t));
    expect(ordered).toEqual(SECTIONS);

    // Die Seitenrahmen-Bausteine sind als echte Landmarks gerendert.
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
});

test.describe("/_bausteine · Bausteine-Vorschau", () => {
  test("rendert ohne Overflow, mit genau einer H1, ohne zu große Icons, noindex, ohne Konsolenfehler", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/_bausteine");

    // Genau eine H1 (der Header enthält keine H1)
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    // Kein horizontaler Overflow (inkl. sticky Header und Dropdown-Layout)
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    // Icon-Guard: kein sichtbares SVG > 90 px, ausgenommen [data-large-svg] (Wortmarke).
    const svgSizes = await page.evaluate(() =>
      [...document.querySelectorAll("svg")].map((s) => {
        const r = s.getBoundingClientRect();
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          exempt: s.hasAttribute("data-large-svg"),
        };
      }),
    );
    expect(svgSizes.length).toBeGreaterThan(0);
    for (const { w, h, exempt } of svgSizes) {
      if (exempt) continue;
      expect(w, "Icon-Breite ≤ 90 px").toBeLessThanOrEqual(90);
      expect(h, "Icon-Höhe ≤ 90 px").toBeLessThanOrEqual(90);
    }

    // noindex für die interne Vorschau
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

    // Keine Konsolenfehler
    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });
});

/**
 * FAQ-Akkordeon (Baustein 0007, Schritt 1.6): native <details>/<summary>-Basis –
 * ohne JavaScript auf- und zuklappbar, erstes Item server-seitig offen, alle Antworten
 * im DOM, kein erzwungenes Single-Open, Marker wechselt per CSS über [open].
 */
test.describe("/_bausteine · FAQ-Akkordeon", () => {
  const q1 = "Funktioniert das Akkordeon auch ohne JavaScript?";
  const q2 = "Kann mehr als ein Eintrag gleichzeitig offen sein?";
  const a4 = "Es sind neutrale Demo-Texte für die Bausteine-Vorschau.";

  test("ist ohne JavaScript bedienbar: erstes Item offen, alle Antworten im DOM, kein Single-Open", async ({
    browser,
  }) => {
    // Kontext ohne JS – beweist die native <details>-Bedienbarkeit.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/_bausteine");

    const item1 = page.locator("details", { hasText: q1 });
    const item2 = page.locator("details", { hasText: q2 });

    // Erstes Item server-seitig offen, zweites geschlossen.
    expect(await item1.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);
    expect(await item2.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);

    // Alle Antworten stehen im DOM (auch die der geschlossenen Items) – No-JS/SEO.
    await expect(page.getByText(a4)).toBeAttached();

    // Nativer Klick auf die zweite Frage öffnet sie – ohne JS.
    await item2.locator("summary").click();
    expect(await item2.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);
    // Kein erzwungenes Single-Open: das erste Item bleibt offen.
    expect(await item1.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(true);

    await context.close();
  });

  test("Marker wechselt per CSS über [open] von Plus zu Minus; nativer Marker entfernt", async ({
    page,
  }) => {
    await page.goto("/_bausteine");

    const item1 = page.locator("details", { hasText: q1 });
    const item2 = page.locator("details", { hasText: q2 });

    // Nativer summary-Marker ist entfernt.
    const listStyle = await item1
      .locator("summary")
      .evaluate((el) => getComputedStyle(el).listStyleType);
    expect(listStyle).toBe("none");

    // Der senkrechte Strich (::after) ist offen eingeklappt (scaleY(0)) und
    // geschlossen sichtbar – rein per CSS über [open], ohne JS-Zutun.
    const afterTransform = (el: Element) =>
      getComputedStyle(el.querySelector("span")!, "::after").transform;
    const openAfter = await item1.locator("summary").evaluate(afterTransform);
    const closedAfter = await item2.locator("summary").evaluate(afterTransform);
    expect(openAfter).not.toBe(closedAfter);
  });
});
