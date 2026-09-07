import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { KONTAKT } from "../../config/site-structure";
import { kontakt, kontaktFormular, kontaktSeitenspalte, kontaktWege } from "../../content/kontakt";
import { formMessages } from "../../lib/forms/messages";

/**
 * `/kontakt` (Masterplan 4.3, Briefing 0025, Mock 3.10). Läuft über alle
 * Breakpoint-Projekte (390–1440).
 *
 * Schwerpunkt sind die Zustände des Formulars – vor allem der Fall **ohne
 * JavaScript**: Das Formular muss ein normales `<form>` mit Server Action bleiben.
 * Der Versand läuft im Mock-Transport (kein `SENDGRID_API_KEY` in Tests und CI) und
 * schreibt JSON nach `test-results/mail/`.
 *
 * Die Tests, die **wirklich senden**, laufen bewusst nur im breitesten Projekt: Das
 * Rate-Limit (5 Sendungen je IP und Stunde) ist eine echte Schutzregel und wird für
 * Tests nicht aufgeweicht – fünfmal derselbe Versand aus fünf Breakpoint-Projekten
 * würde sie auslösen. Das Aussehen des Formulars prüfen die übrigen Tests auf allen
 * Breiten.
 */

const MAIL_DIR = path.join(process.cwd(), "test-results", "mail");

/** Die Mails lesen, die der Mock-Transport seit `zeitpunkt` geschrieben hat. */
async function mailsSeit(zeitpunkt: number): Promise<Record<string, unknown>[]> {
  let dateien: string[];
  try {
    dateien = await readdir(MAIL_DIR);
  } catch {
    return [];
  }
  return Promise.all(
    dateien
      .filter((name) => name.endsWith(".json"))
      .filter((name) => Number(name.split("-")[0]) >= zeitpunkt)
      .map(async (name) => JSON.parse(await readFile(path.join(MAIL_DIR, name), "utf8"))),
  );
}

/** Zählt die Mails, deren Antwortadresse die Kennung dieses Tests trägt. */
async function mailsMit(kennung: string, seit: number): Promise<Record<string, unknown>[]> {
  const mails = await mailsSeit(seit);
  return mails.filter((m) => String(m.replyTo).includes(kennung));
}

async function ausfuellen(
  page: Page,
  werte: { vorname?: string; nachname?: string; email?: string; nachricht?: string } = {},
) {
  await page.fill("[name=vorname]", werte.vorname ?? "Anna");
  await page.fill("[name=nachname]", werte.nachname ?? "Berger");
  await page.fill("[name=email]", werte.email ?? "anna.berger@example.de");
  await page.fill(
    "[name=nachricht]",
    werte.nachricht ?? "Wir sind ein 18-Loch-Club und hätten eine Frage zu den Paketen.",
  );
  // Das native Kontrollkästchen ist visuell durch .box ersetzt (UI-Kit); ein Mensch
  // klickt das Label. `force` klickt das Bedienelement selbst – dasselbe Ergebnis.
  await page.locator("[name=einwilligung]").check({ force: true });
}

/**
 * Wartet die Mindestzeit der Zeitfalle ab (4 Sekunden zwischen Rendern und Senden,
 * Spam-Stufe A). Die Regel wird für Tests nicht gelockert – sie wird eingehalten.
 */
async function zeitfalleAbwarten(page: Page) {
  await page.waitForTimeout(4500);
}

const senden = (page: Page) => page.getByRole("button", { name: /Nachricht senden/ }).click();

test.describe("Kontakt · Aufbau und Texte", () => {
  test("zeigt genau eine H1 und die vier Abschnitte aus dem Mock", async ({ page }) => {
    const response = await page.goto("/kontakt");
    expect(response?.status()).toBe(200);

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(kontakt.sections[0]!.headline!);

    for (const id of ["formular", "wege", "anschrift"]) {
      const abschnitt = kontakt.sections.find((s) => s.id === id)!;
      await expect(
        page.getByRole("heading", { level: 2, name: abschnitt.headline!, exact: true }),
      ).toBeVisible();
    }

    for (const punkt of [
      "Rückmeldung innerhalb eines Werktags",
      "Kein Callcenter, keine Warteschleife",
      "Keine Anmeldung zu irgendeinem Newsletter",
    ]) {
      await expect(page.getByText(punkt, { exact: true }).first()).toBeVisible();
    }
  });

  test("führt genau die Felder aus dem Mock – kein Wunschzeit- und kein Newsletter-Feld", async ({
    page,
  }) => {
    await page.goto("/kontakt");
    const namen = await page
      .locator("form [name]")
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute("name") ?? "").filter((n) => !n.startsWith("$")),
      );
    expect(namen.sort()).toEqual([
      "club",
      "einwilligung",
      "email",
      "nachname",
      "nachricht",
      "rolle",
      "telefon",
      "thema",
      "ts",
      "vorname",
      "website",
    ]);
    // Weder Wunschzeit noch Newsletter – der Hero verspricht ausdrücklich das Gegenteil.
    await expect(page.locator('form [name*="wunsch" i], form [name*="newsletter" i]')).toHaveCount(
      0,
    );
  });

  test("verweist auf Buchung, Live-Demo und Telefon – nichts hart kodiert", async ({ page }) => {
    await page.goto("/kontakt");
    const telHref = `tel:${KONTAKT.telefon.replace(/\s+/g, "")}`;

    await expect(page.locator(`a[href="${telHref}"]`).first()).toBeVisible();
    for (const weg of kontaktWege) {
      await expect(page.getByText(weg.headline, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Termin aussuchen" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Demo öffnen" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: kontaktSeitenspalte.livedemo.cta.label }),
    ).toBeVisible();

    // cal.com wird nur verlinkt, nie eingebettet (sonst wäre eine Einwilligung nötig).
    await expect(page.locator('iframe, script[src*="cal.com"]')).toHaveCount(0);
  });

  test("kein Overflow, keine zu großen Icons, keine Konsolenfehler", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/kontakt");
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow, "horizontaler Overflow auf /kontakt").toBe(false);

    const zuGross = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("svg"))
          .filter((svg) => !svg.closest("[data-large-svg]"))
          .map((svg) => svg.getBoundingClientRect())
          .filter((r) => r.width > 90 || r.height > 90).length,
    );
    expect(zuGross, "zu großes SVG auf /kontakt").toBe(0);
    expect(consoleErrors, "Konsolenfehler").toEqual([]);
  });
});

test.describe("Kontakt · Feldzustände (mit JavaScript)", () => {
  test("meldet einen Feldfehler beim Verlassen des Feldes und nimmt ihn sofort zurück", async ({
    page,
  }) => {
    await page.goto("/kontakt");
    const email = page.locator("[name=email]");
    await email.fill("anna@");
    await email.blur();

    await expect(page.getByText(formMessages.field.email, { exact: true })).toBeVisible();
    await expect(email).toHaveAttribute("aria-invalid", "true");

    await email.fill("anna@example.de");
    await email.blur();
    await expect(page.getByText(formMessages.field.email, { exact: true })).toHaveCount(0);
    await expect(page.getByText(formMessages.field.emailOk, { exact: true })).toBeVisible();
  });

  test("setzt bei Serverfehlern den Fokus auf das erste fehlerhafte Feld", async ({ page }) => {
    await page.goto("/kontakt");
    // Absenden ohne Eingaben: Die Browser-Blasen sind aus (noValidate), also
    // antwortet der Server mit den Feldfehlern aus dem Katalog.
    await zeitfalleAbwarten(page);
    await senden(page);

    await expect(page.getByText(formMessages.form.invalid, { exact: true })).toBeVisible();
    await expect(page.locator("[name=vorname]")).toBeFocused();
    await expect(page.locator("[name=vorname]")).toHaveAttribute("aria-invalid", "true");
  });

  test("behält die Eingaben, wenn der Server einen Fehler meldet", async ({ page }) => {
    await page.goto("/kontakt");
    await ausfuellen(page, { email: "anna@" });
    await zeitfalleAbwarten(page);
    await senden(page);

    await expect(page.getByText(formMessages.form.invalid, { exact: true })).toBeVisible();
    await expect(page.locator("[name=vorname]")).toHaveValue("Anna");
    await expect(page.locator("[name=nachricht]")).not.toHaveValue("");
  });
});

test.describe("Kontakt · Versand über den Mock-Transport", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) !== 1440, "Versand nur einmal prüfen");

  test("sendet, ersetzt das Formular und setzt den Fokus auf den Erfolgsalert", async ({
    page,
  }) => {
    const seit = Date.now();
    const kennung = `erfolg${seit}`;
    await page.goto("/kontakt");
    await ausfuellen(page, { email: `${kennung}@example.de` });
    await zeitfalleAbwarten(page);
    await senden(page);

    await expect(page.getByText(formMessages.form.success.title, { exact: true })).toBeVisible();
    await expect(page.getByText(formMessages.form.success.text, { exact: true })).toBeVisible();
    // Das Formular ist weg – keine Weiterleitung, kein Toast.
    await expect(page.locator("form [name=email]")).toHaveCount(0);
    await expect(page.locator('main [tabindex="-1"]')).toBeFocused();

    const meine = await mailsMit(kennung, seit);
    expect(meine.length, "genau eine Mail im Mock-Transport").toBe(1);
    expect(String(meine[0]!.subject)).toContain("Anfrage von Anna Berger");
  });

  test("sendet bei zwei schnellen Klicks nur eine Mail", async ({ page }) => {
    const seit = Date.now();
    const kennung = `doppel${seit}`;
    await page.goto("/kontakt");
    await ausfuellen(page, { email: `${kennung}@example.de` });
    await zeitfalleAbwarten(page);

    const button = page.getByRole("button", { name: /Nachricht senden/ });
    await button.click();
    // Zweiter Klick sofort hinterher: Der Ladezustand blockt ihn, und was doch
    // durchkommt, fängt die Duplikat-Sperre ab.
    await button.click({ force: true, timeout: 2000 }).catch(() => {});

    await expect(page.getByText(formMessages.form.success.title, { exact: true })).toBeVisible();
    expect((await mailsMit(kennung, seit)).length, "kein Doppelversand").toBe(1);
  });

  test("verwirft eine Sendung mit gefülltem Honigtopf still – ohne Mail", async ({ page }) => {
    const seit = Date.now();
    const kennung = `honig${seit}`;
    await page.goto("/kontakt");
    await ausfuellen(page, { email: `${kennung}@example.de` });
    await page
      .locator("[name=website]")
      .evaluate((el) => ((el as HTMLInputElement).value = "https://spam.example"));
    await zeitfalleAbwarten(page);
    await senden(page);

    // Der Bot bekommt dieselbe Erfolgsmeldung – er soll nichts lernen.
    await expect(page.getByText(formMessages.form.success.title, { exact: true })).toBeVisible();
    expect((await mailsMit(kennung, seit)).length, "keine Mail aus dem Honigtopf").toBe(0);
  });
});

test.describe("Kontakt · Formular OHNE JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("ist ohne JS lesbar und zeigt die Feldfehler des Servers", async ({ page }) => {
    await page.goto("/kontakt");

    await expect(page.locator("h1")).toHaveText(kontakt.sections[0]!.headline!);
    await expect(page.locator("[name=email]")).toBeVisible();
    await expect(page.locator("[name=ts]")).toHaveCount(1);
    await expect(page.getByText(kontaktFormular.note, { exact: true })).toBeVisible();

    await ausfuellen(page, { email: "anna@" });
    await zeitfalleAbwarten(page);
    await senden(page);

    await expect(page.getByText(formMessages.form.invalid, { exact: true })).toBeVisible();
    await expect(page.getByText(formMessages.field.email, { exact: true })).toBeVisible();
    await expect(page.locator("[name=vorname]")).toHaveValue("Anna");
    expect(new URL(page.url()).pathname, "keine Weiterleitung").toBe("/kontakt");
  });

  test("ist ohne JS absendbar und meldet den Erfolg auf derselben Seite", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) !== 1440, "Versand nur einmal prüfen");
    const seit = Date.now();
    const kennung = `ohnejs${seit}`;
    await page.goto("/kontakt");
    await ausfuellen(page, { email: `${kennung}@example.de` });
    await zeitfalleAbwarten(page);
    await senden(page);

    await expect(page.getByText(formMessages.form.success.title, { exact: true })).toBeVisible();
    expect(new URL(page.url()).pathname, "keine Weiterleitung").toBe("/kontakt");
    expect((await mailsMit(kennung, seit)).length, "die Anfrage ist angekommen").toBe(1);
  });
});

test.describe("Kontakt bei prefers-reduced-motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("zeigt sofort den Endzustand", async ({ page }) => {
    await page.goto("/kontakt");
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const style = await h1.evaluate((el) => getComputedStyle(el));
    expect(style.opacity).toBe("1");
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(style.transform);
  });
});
