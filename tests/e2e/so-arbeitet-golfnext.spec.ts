import { expect, test } from "@playwright/test";

/**
 * /plattform/so-arbeitet-golfnext (Briefing 0024, Schritt 2.4), gebaut aus Mock
 * 3.3b-so-arbeitet-golfnext-neufassung.html. Prüft die harten Akzeptanzkriterien:
 * - genau eine H1 (im Hero), kein horizontaler Seiten-Overflow (auch der Mail-Stapel
 *   im Hero läuft aus dem Raster und darf keinen Scroll erzeugen), keine
 *   Konsolenfehler – über alle Breakpoints (390/768/1024/1180/1440);
 * - der Umschalter über die fünf Zielgruppen-Strecken ist eine native Radiogruppe:
 *   alle fünf Strecken stehen im Server-HTML, sind OHNE JavaScript umschaltbar und
 *   per Tastatur (Pfeiltasten) erreichbar;
 * - bei reduzierter Bewegung stehen die Animationen sofort im Endzustand;
 * - kein Modulstatus („Im Einsatz"/„Pilot"/„In Entwicklung"), keine erfundenen Zahlen.
 */

const H1 = "Nach der Anmeldung hört Ihr Club nicht auf zu reden.";

/** Reiter-Beschriftung → Betreff der ersten Nachricht der jeweiligen Strecke. */
const STRECKEN: { tab: string; betreff: string }[] = [
  { tab: "Schnuppergolf", betreff: "Ihr Platz am Samstag ist reserviert" },
  { tab: "Platzreife", betreff: "Ihre Platzreife: vier Termine, alle Daten" },
  { tab: "Mitgliedschaft", betreff: "Ihr Termin steht: Donnerstag, 17 Uhr" },
  { tab: "Greenfee & Gäste", betreff: "Ihre Startzeit am Samstag, 9:30 Uhr" },
  { tab: "Firmen-Event", betreff: "Ihre Anfrage ist angekommen" },
];

test.describe("/plattform/so-arbeitet-golfnext · Struktur und Overflow", () => {
  test("genau eine H1, kein Overflow (inkl. Mail-Stapel), keine Konsolenfehler", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/plattform/so-arbeitet-golfnext");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: H1 })).toBeVisible();

    // Der Mail-Stapel im Hero (width > 100%) wird vom overflow:hidden des Heros gekappt.
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow").toBe(false);

    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });

  test("kein Modulstatus und keine Status-Legende auf der Seite", async ({ page }) => {
    await page.goto("/plattform/so-arbeitet-golfnext");

    const main = page.locator("main");
    await expect(main.getByText("Im Einsatz")).toHaveCount(0);
    await expect(main.getByText("In Entwicklung")).toHaveCount(0);
    await expect(main.getByText("Pilot", { exact: true })).toHaveCount(0);
  });

  test("Benennungen wie im Mock: Greenfee als Zielgruppe, Gastfee als Zahlung", async ({
    page,
  }) => {
    await page.goto("/plattform/so-arbeitet-golfnext");

    // Zielgruppen-Reiter heißt „Greenfee & Gäste".
    await expect(page.getByText("Greenfee & Gäste", { exact: true })).toBeVisible();

    // In der Greenfee-Strecke heißt die Zahlung „Gastfee" (Modulbegriff).
    await page.getByText("Greenfee & Gäste", { exact: true }).click();
    await expect(
      page.getByText("Gastfee bezahlt, Startzeit reserviert.", { exact: false }),
    ).toBeVisible();
  });
});

test.describe("/plattform/so-arbeitet-golfnext ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("alle fünf Strecken stehen im Server-HTML und sind ohne JS umschaltbar", async ({
    page,
  }) => {
    await page.goto("/plattform/so-arbeitet-golfnext");

    // Verbindliche Texte sind ohne JS lesbar.
    await expect(page.getByRole("heading", { level: 1, name: H1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Fünf Zielgruppen, fünf eigene Strecken." }),
    ).toBeVisible();

    // Der Umschalter (zwei Betreffs stehen auch im Hero-Stapel – deshalb auf das
    // <fieldset> der Radiogruppe eingegrenzt).
    const umschalter = page.locator("fieldset");

    // Alle fünf Strecken sind im Server-HTML vorhanden (auch die ausgeblendeten).
    for (const { betreff } of STRECKEN) {
      await expect(umschalter.getByText(betreff, { exact: true })).toHaveCount(1);
    }

    // Umschalten allein über die Radiogruppe (CSS :checked) – ohne JavaScript.
    for (const { tab, betreff } of STRECKEN) {
      await umschalter.getByText(tab, { exact: true }).click();
      await expect(umschalter.getByText(betreff, { exact: true })).toBeVisible();
      // Genau eine Strecke ist sichtbar.
      for (const andere of STRECKEN) {
        if (andere.tab === tab) continue;
        await expect(umschalter.getByText(andere.betreff, { exact: true })).toBeHidden();
      }
    }

    // Beim Laden steht die erste Strecke offen.
    await page.goto("/plattform/so-arbeitet-golfnext");
    await expect(umschalter.getByText(STRECKEN[0]!.betreff, { exact: true })).toBeVisible();

    // Die Übergabe-Karten und die Regeln stehen ohne JS im Endzustand.
    await expect(
      page.getByText("Anna Berger anrufen – sie sucht einen Platzreifetermin."),
    ).toBeVisible();
    await expect(page.getByText("Kein Newsletter an alle.", { exact: true })).toBeVisible();
  });

  test("die Radiogruppe ist per Tastatur bedienbar (Pfeiltasten)", async ({ page }) => {
    await page.goto("/plattform/so-arbeitet-golfnext");

    // Fokus auf das erste (gewählte) Radio, dann mit der Pfeiltaste weiterschalten.
    await page.locator("#strecke-schnuppergolf").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#strecke-platzreife")).toBeChecked();
    await expect(page.getByText(STRECKEN[1]!.betreff, { exact: true })).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#strecke-mitgliedschaft")).toBeChecked();
    await expect(page.getByText(STRECKEN[2]!.betreff, { exact: true })).toBeVisible();
  });
});

test.describe("/plattform/so-arbeitet-golfnext · reduzierte Bewegung", () => {
  test("Mail-Stapel, Strecke und Regeln stehen sofort im Endzustand", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/plattform/so-arbeitet-golfnext");

    // Hero-Stapel: die letzte Karte ist sofort voll deckend sichtbar (der Betreff steht
    // auch in der Schnuppergolf-Strecke – deshalb auf den Hero eingegrenzt).
    const hero = page.locator("main > section").first();
    const letzte = hero
      .getByText("Noch zwei Plätze im nächsten Kurs", { exact: true })
      .locator("xpath=ancestor::div[1]");
    expect(Number(await letzte.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    // Erste Strecke: die vierte Nachricht ist sofort vollständig sichtbar.
    const mail = page.locator("fieldset").getByText("Noch zwei Plätze im nächsten Kurs", {
      exact: true,
    });
    await mail.scrollIntoViewIfNeeded();
    const mailKarte = mail.locator("xpath=ancestor::div[3]");
    expect(Number(await mailKarte.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);

    // Regeln: die dritte Karte ist sofort lesbar.
    const regel = page.getByText("Abmeldung mit einem Klick.", { exact: true });
    await regel.scrollIntoViewIfNeeded();
    await expect(regel).toBeVisible();

    await context.close();
  });
});
