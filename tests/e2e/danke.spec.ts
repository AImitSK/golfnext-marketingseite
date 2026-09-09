import { expect, test } from "@playwright/test";
import { formMessages } from "../../lib/forms/messages";
import { uiMessages } from "../../lib/ui/messages";

/**
 * `/danke` (Briefing 0033, Masterplan 5.4) – die Bestätigungsseite nach einer
 * erfolgreichen Formularanfrage und Zielpunkt der URL-basierten Conversion.
 *
 * Die Route bekommt hier die Pflichtchecks jeder Seite (Skill `golfnext-qa`):
 * Overflow über alle Breakpoints, Icon-Guard, Konsole, Überschriften, reduzierte
 * Bewegung, ohne JavaScript. Der Consent-Nachweis steht in `consent.spec.ts` –
 * hier geht es um die Seite selbst.
 *
 * Die Seite hat **keinen** eigenen freigegebenen Text: Sie besteht aus der
 * Erfolgsmeldung des Formulars (`lib/forms/messages.ts`) und dem Rückweg aus
 * `lib/ui/messages.ts`. Genau das wird geprüft – kein erfundener Satz.
 */

const PFAD = "/danke?quelle=kontakt";

test.describe("/danke · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow, keine zu großen Icons, keine Konsolenfehler", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto(PFAD);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow auf /danke").toBe(false);

    const zuGross = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("svg"))
          .filter((svg) => !svg.closest("[data-large-svg]"))
          .map((svg) => svg.getBoundingClientRect())
          .filter((r) => r.width > 90 || r.height > 90).length,
    );
    expect(zuGross, "zu großes SVG auf /danke").toBe(0);

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("zeigt nur bereits freigegebene Texte", async ({ page }) => {
    await page.goto(PFAD);

    // Überschrift und Bestätigungssatz sind die Erfolgsmeldung des Formulars.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      formMessages.form.success.title,
    );
    await expect(page.getByText(formMessages.form.success.text, { exact: true })).toBeVisible();

    // Der Rückweg zur Startseite – Wortlaut aus lib/ui/messages.ts.
    const zurueck = page.getByRole("link", {
      name: uiMessages.platzhalter.actionHome,
      exact: true,
    });
    await expect(zurueck).toBeVisible();
    await expect(zurueck).toHaveAttribute("href", "/");

    // Der Folge-Link zur Terminwahl erscheint nur mit echtem Buchungsweg. In den
    // Testfassungen ist NEXT_PUBLIC_BOOKING_URL nicht gesetzt, `bookingUrl()` fällt
    // deshalb auf `/kontakt` zurück – und dann darf der Link fehlen, statt auf das
    // gerade abgeschickte Formular zurückzuzeigen.
    await expect(page.getByRole("link", { name: formMessages.form.success.link })).toHaveCount(0);

    // Keine H2/H3 – die Seite hat bewusst keine weitere Gliederung, also auch
    // keine Sprünge in der Überschriftenfolge.
    await expect(page.locator("main h2, main h3")).toHaveCount(0);
  });

  test("ist noindex und trägt eine kanonische URL", async ({ page }) => {
    await page.goto(PFAD);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/danke$/);
  });
});

test.describe("/danke · reduzierte Bewegung", () => {
  test.use({ reducedMotion: "reduce" });

  test("steht sofort im Endzustand", async ({ page }) => {
    await page.goto(PFAD);
    const stapel = page.locator("main h1");
    await expect(stapel).toBeVisible();
    await expect(stapel).toHaveCSS("opacity", "1");
  });
});

test.describe("/danke · ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("bleibt vollständig lesbar und bedienbar", async ({ page }) => {
    await page.goto(PFAD);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      formMessages.form.success.title,
    );
    await expect(page.getByText(formMessages.form.success.text, { exact: true })).toBeVisible();
    await expect(
      page.getByRole("link", { name: uiMessages.platzhalter.actionHome, exact: true }),
    ).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });
});
