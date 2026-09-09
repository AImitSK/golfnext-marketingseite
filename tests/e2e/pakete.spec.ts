import { expect, test } from "@playwright/test";
import { OHNE_ARTIKEL_URL } from "../../playwright.config";
import {
  FIXTURE_FAQ_ANTWORTEN,
  FIXTURE_FAQ_ANTWORT_TEILE,
  FIXTURE_FAQ_FRAGEN,
} from "../../lib/sanity/fixtures";

/**
 * /pakete (Baustein 0012, Schritt 2.1). Prüft die harten Akzeptanzkriterien:
 * genau eine H1, kein horizontaler Overflow (auch mit der Vergleichstabelle,
 * deren Scroll INNERHALB des Containers liegt), keine Konsolenfehler; die
 * Karten-Leistungen und die FAQ sind OHNE JavaScript auf-/zuklappbar; der
 * Hero-Stapel steht bei reduzierter Bewegung sofort im Endzustand.
 *
 * Seit Briefing 0030 (Masterplan 3.6) kommt die FAQ **aus Sanity**, im Testlauf also
 * aus `lib/sanity/fixtures.ts`. Deshalb stehen hier keine echten Fragen mehr: Der
 * Wortlaut liegt in Sanity und nirgends sonst. Geprüft werden Reihenfolge (`order`),
 * Server-HTML, Bedienbarkeit ohne JS – und dass ohne FAQs der Abschnitt entfällt.
 */

test.describe("/pakete · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow, keine Konsolenfehler", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/pakete");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 1, name: /Drei Wege, sie arbeiten zu lassen/ }),
    ).toBeVisible();

    // Kein horizontaler Overflow – die Vergleichstabelle (min-width 720px) scrollt
    // innerhalb ihres Containers, nicht die Seite.
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("Vergleich ist eine semantische Tabelle mit Spalten- und Zeilenköpfen", async ({ page }) => {
    await page.goto("/pakete");
    const table = page.getByRole("table");
    await expect(table).toHaveCount(1);
    await expect(table.getByRole("columnheader", { name: "Komplett" })).toBeVisible();
    await expect(table.getByRole("rowheader", { name: "Gastfee" })).toBeVisible();
  });

  test('Vergleich enthält alle Zeilen und sichtbare „Enthalten"-Punkte (Regressionsschutz)', async ({
    page,
  }) => {
    await page.goto("/pakete");
    const table = page.getByRole("table");

    // 24 Leistungszeilen (6 + 10 + 5 + 3) mit je einem Zeilenkopf – schützt davor,
    // dass die Tabelle wieder auf „nur Kopf/Rahmen" zusammenfällt.
    await expect(table.locator('tbody th[scope="row"]')).toHaveCount(24);
    // Vier Gruppen-Zwischenüberschriften.
    await expect(table.locator("tbody th[colspan]")).toHaveCount(4);

    // „Enthalten"-Punkte müssen in ALLEN vier Spalten sichtbar sein (nicht 0 × 0 px).
    // Erste Datenzeile „Individuelle Clubwebsite" ist in allen vier Stufen enthalten.
    const ersteZeile = table.locator("tbody tr").filter({ hasText: "Individuelle Clubwebsite" });
    const punkte = ersteZeile.locator("td span[aria-hidden='true']");
    await expect(punkte).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const box = await punkte.nth(i).boundingBox();
      expect(box, `Punkt Spalte ${i} hat eine Größe`).not.toBeNull();
      expect(box!.width, `Punkt Spalte ${i} sichtbar`).toBeGreaterThan(0);
      expect(box!.height, `Punkt Spalte ${i} sichtbar`).toBeGreaterThan(0);
    }
    // Zugängliche Bedeutung bleibt vorhanden (sr-only „Enthalten").
    await expect(ersteZeile.getByText("Enthalten", { exact: true })).toHaveCount(4);
  });
});

test.describe("/pakete ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Karten-Leistungen und FAQ sind ohne JS bedienbar", async ({ page }) => {
    await page.goto("/pakete");

    // Karten-Leistungen: geschlossenes <details> verbirgt die Punkte, nativer Klick öffnet.
    const wachstumKarte = page.getByRole("group").filter({ hasText: "Zusätzlich enthalten" });
    const eintrag = wachstumKarte.getByRole("listitem").filter({ hasText: "Firmen-Events" });
    await expect(eintrag).toBeHidden();
    await wachstumKarte.locator("summary").click();
    await expect(eintrag).toBeVisible();

    // FAQ: erstes Item ist server-seitig offen; ein geschlossenes öffnet ohne JS.
    const ersteAntwort = page.getByText(FIXTURE_FAQ_ANTWORTEN[0]![0]!, { exact: true });
    await expect(ersteAntwort).toBeVisible();

    const zweiteFrage = page.getByRole("group").filter({ hasText: FIXTURE_FAQ_FRAGEN[1]! });
    const zweiteAntwort = page.getByText(FIXTURE_FAQ_ANTWORTEN[1]![1]!, { exact: true });
    await expect(zweiteAntwort).toBeHidden();
    await zweiteFrage.locator("summary").click();
    await expect(zweiteAntwort).toBeVisible();
  });
});

test.describe("/pakete · FAQ aus Sanity", () => {
  test("zeigt die Fragen in der Reihenfolge aus `order`", async ({ page }) => {
    await page.goto("/pakete");

    const fragen = page.locator("details summary").filter({ hasText: "Beispielfrage" });
    // Genau so viele Einträge, wie Sanity liefert. Fiele jemand auf eine Repo-Fassung
    // zurück, stünden hier andere (und mehr) Fragen – der Test fällt dann durch.
    await expect(fragen).toHaveCount(FIXTURE_FAQ_FRAGEN.length);

    for (const [i, frage] of FIXTURE_FAQ_FRAGEN.entries()) {
      await expect(fragen.nth(i)).toHaveText(frage);
    }
  });

  test("alle Antworten stehen im Server-HTML, auch die zugeklappten", async ({ request }) => {
    // Bewusst über die reine HTTP-Antwort statt über den gerenderten DOM: So ist
    // belegt, dass der Text schon vom Server kommt und nicht erst von React.
    const html = await (await request.get("/pakete")).text();

    for (const frage of FIXTURE_FAQ_FRAGEN) {
      expect(html, `Frage „${frage}" fehlt im Server-HTML`).toContain(frage);
    }
    for (const teil of FIXTURE_FAQ_ANTWORT_TEILE) {
      expect(html, `Antworttext „${teil}" fehlt im Server-HTML`).toContain(teil);
    }
  });

  test("Auszeichnungen der Antwort: strong, interner und externer Link", async ({ page }) => {
    await page.goto("/pakete");

    const zweite = page.getByRole("group").filter({ hasText: FIXTURE_FAQ_FRAGEN[1]! });
    await zweite.locator("summary").click();

    await expect(zweite.locator("strong")).toHaveText("Fett hervorgehoben.");

    // Interner Link ohne Zusatz, externer mit rel und – weil im Studio gesetzt – target.
    const intern = zweite.getByRole("link", { name: "internem Link" });
    await expect(intern).toHaveAttribute("href", "/pakete");
    await expect(intern).not.toHaveAttribute("rel", /.+/);

    const extern = zweite.getByRole("link", { name: "externem Link" });
    await expect(extern).toHaveAttribute("href", "https://example.org");
    await expect(extern).toHaveAttribute("rel", "noopener noreferrer");
    await expect(extern).toHaveAttribute("target", "_blank");
  });
});

test.describe("/pakete ohne FAQs in Sanity", () => {
  // Zweiter Testserver, leerer Bestand (siehe `playwright.config.ts`).
  test.use({ baseURL: OHNE_ARTIKEL_URL });

  test("der FAQ-Abschnitt entfällt vollständig, ohne Layoutlücke", async ({ page }) => {
    const konsolenFehler: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") konsolenFehler.push(msg.text());
    });

    await page.goto("/pakete");

    // Weder Überschrift noch Eyebrow noch ein Akkordeon – und keine Leerzustandsmeldung.
    await expect(page.getByRole("heading", { name: "Häufige Fragen zu den Paketen." })).toHaveCount(
      0,
    );
    await expect(page.getByText("Klarheit vor dem Gespräch", { exact: true })).toHaveCount(0);
    await expect(page.locator("#faq")).toHaveCount(0);
    await expect(page.locator("details summary").filter({ hasText: "Beispielfrage" })).toHaveCount(
      0,
    );

    // Keine doppelte Lücke: Der Vergleich schließt bündig an den Footer an.
    const letzte = page.locator("main > section").last();
    const footer = page.locator("main footer, footer").first();
    const a = (await letzte.boundingBox())!;
    const b = (await footer.boundingBox())!;
    expect(Math.abs(b.y - (a.y + a.height))).toBeLessThan(2);

    // Die Seite bleibt im Übrigen vollständig.
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("table")).toHaveCount(1);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow, "horizontaler Overflow").toBe(false);
    expect(konsolenFehler, "Konsolenfehler").toEqual([]);
  });
});

test.describe("/pakete · reduzierte Bewegung", () => {
  test("Hero-Stapel steht sofort im Endzustand (opacity 1)", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/pakete");

    // „+ Individuell" kommt nur im Hero-Stapel vor – eindeutig.
    const stufe = page.getByText("+ Individuell", { exact: true });
    await stufe.scrollIntoViewIfNeeded();
    expect(Number(await stufe.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    await context.close();
  });
});
