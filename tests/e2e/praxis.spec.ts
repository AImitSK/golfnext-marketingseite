import { expect, test } from "@playwright/test";
import { praxisLabels } from "../../content/praxis";
import {
  FIXTURE_ARTIKEL_KURZ_SLUG,
  FIXTURE_ARTIKEL_SLUG,
  FIXTURE_RUBRIKEN,
} from "../../lib/sanity/fixtures";
import { uiMessages } from "../../lib/ui/messages";

/**
 * Praxis `/praxis`, `/praxis/thema/<slug>`, `/praxis/<slug>` (Masterplan 3.4,
 * Briefing 0027). Läuft über alle Breakpoint-Projekte (390–1440).
 *
 * Die Inhalte kommen aus `lib/sanity/fixtures.ts` – `playwright.config.ts` setzt
 * dafür `SANITY_SOURCE=fixtures`. Im echten Dataset werden für Tests keine Inhalte
 * angelegt (Briefing 0027, „Was du NICHT tust"), und serverseitige Abfragen ließen
 * sich im Browser ohnehin nicht abfangen.
 */

const LISTE = "/praxis";
const RUBRIK_MIT = `/praxis/thema/${FIXTURE_RUBRIKEN[0].slug}`;
const ARTIKEL = `/praxis/${FIXTURE_ARTIKEL_SLUG}`;
const ALLE_ROUTEN = [LISTE, RUBRIK_MIT, ARTIKEL];

test.describe("Praxis – Aufbau", () => {
  test("die Übersicht trägt genau eine H1 und den Hero aus dem Mock", async ({ page }) => {
    const response = await page.goto(LISTE);
    expect(response?.status()).toBe(200);

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Praxis. Was in Golfclubs wirklich funktioniert.");
    await expect(page.getByText("Zum Mitnehmen – auch ohne GolfNext.")).toBeVisible();
  });

  test("die Rubrikseite trägt den Rubriktitel als einzige H1", async ({ page }) => {
    await page.goto(RUBRIK_MIT);
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(FIXTURE_RUBRIKEN[0].title);
  });

  test("der Artikel trägt den Titel als einzige H1 und die Brotkrumen", async ({ page }) => {
    await page.goto(ARTIKEL);
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Beispielartikel 1");

    const crumb = page.getByRole("navigation", { name: "Brotkrumen" });
    await expect(crumb.getByRole("link", { name: praxisLabels.brotkrumeStart })).toHaveAttribute(
      "href",
      LISTE,
    );
  });

  test("der Fließtext bleibt bei höchstens 70ch", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "w1440", "Nur am breitesten Breakpoint aussagekräftig");
    await page.goto(ARTIKEL);
    // 70ch bei 18 px Inter liegt deutlich unter 800 px – die Spalte darf nicht
    // über den Satzspiegel laufen (docs/04 „Rendering").
    const breite = await page
      .locator("article > div")
      .first()
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(breite).toBeLessThanOrEqual(800);
  });

  test("das Inhaltsverzeichnis erscheint ab drei Überschriften – darunter nicht", async ({
    page,
  }) => {
    await page.goto(ARTIKEL);
    const toc = page.getByRole("navigation", { name: praxisLabels.inhalt });
    await expect(toc).toHaveCount(1);
    // Die Sprungmarken zeigen auf Überschriften, die es gibt.
    const ziele = await toc.locator("a").evaluateAll((els) =>
      els.map((el) => el.getAttribute("href") ?? ""),
    );
    expect(ziele.length).toBe(3);
    for (const ziel of ziele) {
      await expect(page.locator(ziel)).toHaveCount(1);
    }

    await page.goto(`/praxis/${FIXTURE_ARTIKEL_KURZ_SLUG}`);
    await expect(page.getByRole("navigation", { name: praxisLabels.inhalt })).toHaveCount(0);
  });

  test("Artikel ohne Titelbild zeigen den beschrifteten Platzhalter, kein Bild", async ({
    page,
  }) => {
    await page.goto(ARTIKEL);
    await expect(page.getByText("Titelbild folgt")).toBeVisible();
    // Kein Stock-, KI- oder erfundenes Bild an dieser Stelle (CLAUDE.md).
    await expect(page.locator("main img")).toHaveCount(0);
  });
});

test.describe("Praxis – Themenfilter und Blättern", () => {
  test("der Themenfilter besteht aus echten Links und markiert den aktiven Chip", async ({
    page,
  }) => {
    await page.goto(LISTE);
    const filter = page.getByRole("navigation", { name: praxisLabels.themen });

    // „Alle" ist auf der Übersicht der aktive Chip.
    const alle = filter.getByRole("link", { name: praxisLabels.alle, exact: true });
    await expect(alle).toHaveAttribute("href", LISTE);
    await expect(alle).toHaveAttribute("aria-current", "page");

    // Jede gefüllte Rubrik hat einen eigenen Link, die leere erscheint nicht.
    await expect(filter.getByRole("link", { name: new RegExp(FIXTURE_RUBRIKEN[0].title) })).toHaveAttribute(
      "href",
      RUBRIK_MIT,
    );
    await expect(
      filter.getByRole("link", { name: new RegExp(FIXTURE_RUBRIKEN[2].title) }),
    ).toHaveCount(0);

    // Auf der Rubrikseite wandert die Markierung mit.
    await page.goto(RUBRIK_MIT);
    const aktiv = page
      .getByRole("navigation", { name: praxisLabels.themen })
      .locator("[aria-current='page']");
    await expect(aktiv).toHaveCount(1);
    await expect(aktiv).toContainText(FIXTURE_RUBRIKEN[0].title);
  });

  test("„Ältere Beiträge“ blättert serverseitig über ?seite=", async ({ page }) => {
    await page.goto(LISTE);
    // Zwölf Artikel, neun je Seite: Seite 1 zeigt neun und verweist auf Seite 2.
    await expect(page.locator("main a[href^='/praxis/beispielartikel-']")).toHaveCount(9);
    const weiter = page.getByRole("link", { name: praxisLabels.aeltereBeitraege });
    await expect(weiter).toHaveAttribute("href", "/praxis?seite=2");

    await weiter.click();
    await expect(page).toHaveURL(/\?seite=2$/);
    await expect(page.locator("main a[href^='/praxis/beispielartikel-']")).toHaveCount(3);
    // Auf der letzten Seite gibt es keinen Weiter-Link mehr.
    await expect(page.getByRole("link", { name: praxisLabels.aeltereBeitraege })).toHaveCount(0);
  });

  test("die Rubrik mit einem Artikel blättert nicht", async ({ page }) => {
    await page.goto(`/praxis/thema/${FIXTURE_RUBRIKEN[1].slug}`);
    await expect(page.locator("main a[href^='/praxis/beispielartikel-']")).toHaveCount(1);
    await expect(page.getByRole("link", { name: praxisLabels.aeltereBeitraege })).toHaveCount(0);
  });
});

test.describe("Praxis – Leerzustand", () => {
  test("eine Rubrik ohne Artikel zeigt den Leerzustand aus lib/ui/messages.ts", async ({ page }) => {
    // Beim Abnehmen ist das der Normalfall: Fred hat noch nichts veröffentlicht.
    const response = await page.goto(`/praxis/thema/${FIXTURE_RUBRIKEN[2].slug}`);
    expect(response?.status(), "keine Fehlerseite, kein 404").toBe(200);

    await expect(page.getByText(uiMessages.praxis.leerRubrik.title)).toBeVisible();
    await expect(page.getByText(uiMessages.praxis.leerRubrik.body)).toBeVisible();
    await expect(
      page.getByRole("link", { name: uiMessages.praxis.leerRubrik.action, exact: true }),
    ).toHaveAttribute("href", LISTE);

    // Keine erfundene Ankündigung („bald mehr", „demnächst").
    await expect(page.getByText(/bald|demnächst|in Kürze/i)).toHaveCount(0);
    // Der Abschluss-CTA steht trotzdem da.
    await expect(page.getByText("Lieber direkt über Ihren Club sprechen?")).toBeVisible();
  });
});

test.describe("Praxis – unbekannte Adressen (Briefing 0027, Aufgabe 0)", () => {
  const UNBEKANNT = [
    "/praxis/gibt-es-nicht",
    `/praxis/thema/${FIXTURE_RUBRIKEN[2].slug}-gibt-es-nicht`,
    "/praxis/thema",
  ];

  test("liefern Status 404", async ({ page }) => {
    for (const pfad of UNBEKANNT) {
      const response = await page.request.get(pfad);
      expect(response.status(), pfad).toBe(404);
    }
  });

  test("zeigen die 404-Seite im Design mit genau einer Kopfzeile", async ({ page }) => {
    for (const pfad of UNBEKANNT) {
      await page.goto(pfad);
      await expect(page.locator("h1"), pfad).toHaveText(uiMessages.notFound.title);
      await expect(page.locator("header"), pfad).toHaveCount(1);
      await expect(page.locator("footer"), pfad).toHaveCount(1);
    }
  });
});

test.describe("Praxis ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("alle drei Routen sind vollständig lesbar", async ({ page }) => {
    await page.goto(LISTE);
    await expect(page.locator("h1")).toHaveText("Praxis. Was in Golfclubs wirklich funktioniert.");
    await expect(page.getByRole("heading", { name: "Beispielartikel 1" })).toBeVisible();

    await page.goto(RUBRIK_MIT);
    await expect(page.locator("h1")).toHaveText(FIXTURE_RUBRIKEN[0].title);

    await page.goto(ARTIKEL);
    await expect(page.locator("h1")).toHaveText("Beispielartikel 1");
    await expect(page.getByText("Platzhaltertext im ersten Abschnitt")).toBeVisible();
    await expect(page.getByText(praxisLabels.ueberDenAutor)).toBeVisible();
  });

  test("der Themenfilter ist ohne JavaScript bedienbar", async ({ page }) => {
    await page.goto(LISTE);
    await page
      .getByRole("navigation", { name: praxisLabels.themen })
      .getByRole("link", { name: new RegExp(FIXTURE_RUBRIKEN[0].title) })
      .click();
    await expect(page).toHaveURL(new RegExp(`${RUBRIK_MIT}$`));
    await expect(page.locator("h1")).toHaveText(FIXTURE_RUBRIKEN[0].title);
  });

  test("Blättern funktioniert ohne JavaScript", async ({ page }) => {
    await page.goto(LISTE);
    await page.getByRole("link", { name: praxisLabels.aeltereBeitraege }).click();
    await expect(page).toHaveURL(/\?seite=2$/);
    await expect(page.locator("main a[href^='/praxis/beispielartikel-']")).toHaveCount(3);
  });

  test("ein unbekannter Slug zeigt den 404-Inhalt im HTML", async ({ page }) => {
    // Der Kern von Aufgabe 0: Statuscode UND lesbarer Inhalt, ohne JavaScript.
    for (const pfad of ["/praxis/gibt-es-nicht", "/praxis/thema/gibt-es-nicht"]) {
      const response = await page.goto(pfad);
      expect(response?.status(), pfad).toBe(404);
      await expect(page.locator("h1"), pfad).toHaveText(uiMessages.notFound.title);
      await expect(page.getByText(uiMessages.notFound.body), pfad).toBeVisible();
    }
  });
});

test.describe("Praxis – Technik", () => {
  test("kein Overflow, keine zu großen Icons, keine Konsolenfehler", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    for (const pfad of ALLE_ROUTEN) {
      await page.goto(pfad);

      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(hasOverflow, `horizontaler Overflow auf ${pfad}`).toBe(false);

      // Icon-Guard: kein SVG über 90 px außer der Wortmarke ([data-large-svg]).
      const zuGross = await page.evaluate(
        () =>
          Array.from(document.querySelectorAll("svg"))
            .filter((svg) => !svg.closest("[data-large-svg]"))
            .map((svg) => svg.getBoundingClientRect())
            .filter((r) => r.width > 90 || r.height > 90).length,
      );
      expect(zuGross, `zu großes SVG auf ${pfad}`).toBe(0);
    }

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("kein Newsletter, kein Modulstatus, keine erfundene Ankündigung", async ({ page }) => {
    for (const pfad of ALLE_ROUTEN) {
      await page.goto(pfad);
      // Der Newsletter-Block „Praxis-Post" entfällt (Entscheidung Stefan, 07.09.2026).
      await expect(page.getByText("Praxis-Post"), pfad).toHaveCount(0);
      await expect(page.locator("input[type='email']"), pfad).toHaveCount(0);
      // Kein Modulstatus (Briefing 0014/0027).
      for (const verboten of ["Im Einsatz", "Pilot", "In Entwicklung"]) {
        await expect(page.getByText(verboten, { exact: true }), `${pfad}: ${verboten}`).toHaveCount(
          0,
        );
      }
    }
  });

  test("die Überschriften laufen von h1 über h2 ohne Sprung", async ({ page }) => {
    for (const pfad of ALLE_ROUTEN) {
      await page.goto(pfad);
      const ebenen = await page
        .locator("main h1, main h2, main h3, main h4")
        .evaluateAll((els) => els.map((el) => Number(el.tagName.slice(1))));
      expect(ebenen[0], `${pfad} beginnt mit h1`).toBe(1);
      for (let i = 1; i < ebenen.length; i += 1) {
        expect(ebenen[i]! - ebenen[i - 1]!, `${pfad}: Sprung bei Überschrift ${i}`).toBeLessThanOrEqual(1);
      }
    }
  });
});

test.describe("Praxis bei prefers-reduced-motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("die Artikelkarten stehen sofort im Endzustand", async ({ page }) => {
    await page.goto(LISTE);
    const karte = page.locator("main a[href^='/praxis/beispielartikel-']").first();
    await expect(karte).toBeVisible();
    const stil = await karte.evaluate((el) => {
      const s = getComputedStyle(el.parentElement!);
      return { opacity: s.opacity, transform: s.transform };
    });
    expect(stil.opacity).toBe("1");
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(stil.transform);
  });
});
