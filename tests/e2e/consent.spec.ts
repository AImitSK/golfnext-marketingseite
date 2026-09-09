import { expect, test, type Page, type Request } from "@playwright/test";
import { MIT_GTM_URL } from "../../playwright.config";
import { GTM_TEST_ID } from "../../scripts/gtm-test-id.mjs";

/**
 * Einwilligung, Consent Mode v2 und Reichweitenmessung (Briefing 0033,
 * Masterplan 5.3–5.6).
 *
 * Der Kern des Nachweises ist eine einzige Zusage: **vor der Einwilligung geht kein
 * Byte an Dritte.** Sie wird nicht behauptet, sondern am Netzwerkverkehr gemessen –
 * beim Aufruf, nach „Nur notwendige" und ohne JavaScript. Erst der dritte Server
 * (`MIT_GTM_URL`, Testfassung mit gesetzter GTM-Id) zeigt die andere Hälfte: dass
 * nach „Alle akzeptieren" tatsächlich geladen wird. Der Request wird dort abgefangen
 * und verlässt das Gerät nicht.
 *
 * Alle übrigen Specs starten als wiederkehrender Besucher, der schon entschieden hat
 * (`tests/setup/consent.setup.ts`). Hier wird dieser Zustand zurückgesetzt: Geprüft
 * wird der **erste** Besuch.
 */
test.use({ storageState: { cookies: [], origins: [] } });

/**
 * Domains, an die vor einer Einwilligung nichts gehen darf (Briefing 0033).
 *
 * Bewusst breiter als die heute genutzten Dienste: Das Briefing schreibt „`google*`,
 * `googletagmanager*`, `facebook*`, `doubleclick*`, `fonts.g*`". Die Liste soll auch
 * anschlagen, wenn später jemand reCAPTCHA (`gstatic.com`), Google Maps
 * (`maps.googleapis.com`) oder ein Anzeigen-Script einbaut, ohne an die Einwilligung
 * zu denken. Verglichen wird als Teilzeichenkette – `facebook.net` deckt damit auch
 * `connect.facebook.net` ab.
 */
const VERBOTEN = [
  "google-analytics.com",
  "googletagmanager.com",
  "googleadservices.com",
  "googlesyndication.com",
  "googleapis.com",
  "gstatic.com",
  "google.com",
  "doubleclick.net",
  "facebook.com",
  "facebook.net",
  "fbcdn.net",
];

function istVerboten(url: string): boolean {
  return VERBOTEN.some((domain) => url.includes(domain));
}

/** Sammelt jeden Request an eine der verbotenen Domains – und lässt keinen durch. */
function beobachteDritte(page: Page): string[] {
  const treffer: string[] = [];
  page.on("request", (request: Request) => {
    if (istVerboten(request.url())) treffer.push(request.url());
  });
  return treffer;
}

/** Der Einwilligungs-Dialog (vanilla-cookieconsent hängt ihn an den <body>). */
function dialog(page: Page) {
  return page.locator("#cc-main .cm");
}

function einstellungen(page: Page) {
  return page.locator("#cc-main .pm");
}

test.describe("Einwilligung · vor jeder Interaktion", () => {
  test("zeigt den Dialog und lädt nichts von Google oder Meta", async ({ page }) => {
    const dritte = beobachteDritte(page);
    await page.goto("/");

    await expect(dialog(page)).toBeVisible();
    await expect(dialog(page)).toHaveAttribute("role", "dialog");

    // Freigegebene Texte (Briefing 0033) – wortgleich im Dialog.
    await expect(page.getByRole("heading", { name: "Cookies und Einwilligung" })).toBeVisible();
    await expect(dialog(page)).toContainText(
      "Notwendige Cookies sorgen dafür, dass die Website funktioniert und Ihre Auswahl gespeichert bleibt.",
    );

    // Die drei Wege stehen gleichberechtigt nebeneinander.
    for (const label of ["Alle akzeptieren", "Nur notwendige", "Einstellungen"]) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    }

    // Links auf die Rechtstexte (beide live).
    await expect(dialog(page).getByRole("link", { name: "Datenschutz" })).toHaveAttribute(
      "href",
      "/datenschutz",
    );
    await expect(dialog(page).getByRole("link", { name: "Impressum" })).toHaveAttribute(
      "href",
      "/impressum",
    );

    expect(dritte, "Request an Dritte vor der Einwilligung").toEqual([]);
  });

  test("setzt Consent Mode v2 auf „alles verweigert“, bevor irgendetwas läuft", async ({
    page,
  }) => {
    await page.goto("/");

    const standard = await page.evaluate(() => {
      const layer = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
      // `gtag()` schreibt ein `arguments`-Objekt in den dataLayer: [0]='consent',
      // [1]='default', [2]=die vier Signale.
      return layer
        .map((eintrag) => Object.values(eintrag as Record<string, unknown>))
        .find((werte) => werte[0] === "consent" && werte[1] === "default")?.[2] as
        Record<string, unknown> | undefined;
    });

    expect(standard, "gtag('consent','default') fehlt im <head>").toBeDefined();
    expect(standard).toMatchObject({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500,
    });
  });

  test("verschiebt das Layout nicht und erzeugt keinen Overflow", async ({ page }) => {
    await page.goto("/");
    await expect(dialog(page)).toBeVisible();

    // Der Dialog liegt fixiert über der Seite – er nimmt keinen Platz im Fluss ein.
    await expect(dialog(page)).toHaveCSS("position", "fixed");

    const messen = () =>
      page.evaluate(() => ({
        h1: document.querySelector("h1")?.getBoundingClientRect().top ?? null,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        bodyHoehe: document.body.scrollHeight,
      }));

    const mitDialog = await messen();
    expect(mitDialog.overflow, "horizontaler Overflow mit offenem Dialog").toBeLessThanOrEqual(0);

    await page.getByRole("button", { name: "Nur notwendige", exact: true }).click();
    await expect(dialog(page)).toBeHidden();

    const ohneDialog = await messen();
    expect(ohneDialog.h1, "die Seite ist beim Schließen gesprungen").toBe(mitDialog.h1);
    expect(ohneDialog.bodyHoehe).toBe(mitDialog.bodyHoehe);
  });
});

test.describe("Einwilligung · Entscheidungen", () => {
  test("„Nur notwendige“ speichert die Auswahl und lädt weiterhin nichts", async ({
    page,
    context,
  }) => {
    const dritte = beobachteDritte(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Nur notwendige", exact: true }).click();
    await expect(dialog(page)).toBeHidden();

    // Bestätigung: der einzige Toast der Website (docs/08 §3).
    await expect(page.getByRole("status")).toContainText(
      "Ihre Cookie-Einstellungen sind gespeichert.",
    );

    const cookie = (await context.cookies()).find((c) => c.name === "cc_cookie");
    expect(cookie, "cc_cookie wurde nicht gesetzt").toBeDefined();
    expect(cookie!.value, "Marketing darf nicht als erteilt gespeichert sein").not.toContain(
      '"marketing"',
    );

    // Nach dem Neuladen bleibt die Auswahl bestehen und der Dialog schweigt.
    await page.reload();
    await expect(dialog(page)).toBeHidden();
    expect(dritte, "Request an Dritte nach „Nur notwendige“").toEqual([]);
  });

  test("„Alle akzeptieren“ lädt ohne gesetzte ID trotzdem nichts", async ({ page }) => {
    const dritte = beobachteDritte(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Alle akzeptieren", exact: true }).click();
    await expect(dialog(page)).toBeHidden();
    await page.waitForTimeout(500);

    // Der aktuelle Stand der Website: keine GTM- und keine Pixel-ID gesetzt.
    // Die Einwilligung allein lädt deshalb nichts – weder Google noch Meta
    // (Briefing 0033, harte Vorgabe). Den Gegenfall zeigt die Fassung „wie auf
    // Vercel" weiter unten, in der beide Ids gesetzt sind.
    expect(dritte, "ohne ID darf auch mit Einwilligung nichts laden").toEqual([]);
  });

  test("der Footer-Button öffnet die Einstellungen erneut", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Nur notwendige", exact: true }).click();
    await expect(dialog(page)).toBeHidden();

    await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
    await expect(einstellungen(page)).toBeVisible();

    // „Notwendig" ist nicht abwählbar, sonst ist nichts vorausgewählt.
    const notwendig = einstellungen(page).locator("input[type=checkbox]").first();
    await expect(notwendig).toBeChecked();
    await expect(notwendig).toBeDisabled();

    const marketing = einstellungen(page).locator("input[type=checkbox]").nth(1);
    await expect(marketing).not.toBeChecked();
    await expect(marketing).toBeEnabled();
  });

  test("zeigt die Kategorien wortgleich aus der Datenschutzerklärung", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Einstellungen", exact: true }).click();
    await expect(einstellungen(page)).toBeVisible();

    // Wortlaut aus `docs/legal/datenschutz.md` Abschnitt 6 bzw. Briefing 0033.
    // Geprüft wird der Textinhalt des Dialogs – die Beschreibungen stecken hinter
    // den aufklappbaren Kategorien und sollen dort vollständig stehen.
    const text = (await einstellungen(page).textContent()) ?? "";
    const erwartet = [
      "Notwendig",
      "Auslieferung der Seite, Speicherung Ihrer Cookie-Auswahl, Schutz der Formulare vor Missbrauch.",
      "Statistik und Marketing (nur mit Einwilligung)",
      "Derzeit ist kein Dienst dieser Kategorie im Einsatz. Die Kategorie bleibt vorbereitet; sobald wir einen solchen Dienst einsetzen, wird er hier benannt und erst nach Ihrer Einwilligung geladen.",
      // Der Einleitungstext steht auch hier – wortgleich, inklusive der
      // Anführungszeichen der Quelle (unten „, oben gerade ").
      'Sie können Ihre Auswahl jederzeit im Fußbereich unter „Cookie-Einstellungen" ändern.',
    ];
    for (const satz of erwartet) {
      expect(text, `fehlt im Einstellungen-Dialog: ${satz}`).toContain(satz);
    }

    // Eine dritte einwilligungspflichtige Kategorie gibt es (noch) nicht – für sie
    // gäbe es keinen freigegebenen Text (docs/entscheidungen.md, 09.09.2026).
    await expect(einstellungen(page).locator("input[type=checkbox]")).toHaveCount(2);
  });
});

test.describe("Einwilligung · Tastatur", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "w1440",
      "Tastaturbedienung ist breitenunabhängig – einmal genügt",
    );
    await page.goto("/");
  });

  test("hält den Fokus im Dialog", async ({ page }) => {
    await expect(dialog(page)).toBeVisible();

    // Der Dialog holt den Fokus zu sich, sobald er eingeblendet ist. Erst danach
    // ist die Fokusfalle aussagekräftig – vorher steht der Fokus noch am Seitenkopf.
    await expect
      .poll(() => page.evaluate(() => !!document.activeElement?.closest("#cc-main")), {
        message: "der Dialog hat den Fokus nicht übernommen",
      })
      .toBe(true);

    // Zehn Tabs dürfen den Dialog nicht verlassen – vorwärts wie rückwärts.
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const drin = await page.evaluate(() => !!document.activeElement?.closest("#cc-main"));
      expect(drin, `Fokus hat den Dialog nach ${i + 1} Tabs verlassen`).toBe(true);
    }

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Shift+Tab");
      const drin = await page.evaluate(() => !!document.activeElement?.closest("#cc-main"));
      expect(drin, `Fokus hat den Dialog nach ${i + 1} Rückwärts-Tabs verlassen`).toBe(true);
    }
  });

  test("lässt sich ohne Maus entscheiden und schließt die Einstellungen mit Esc", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Einstellungen", exact: true }).press("Enter");
    await expect(einstellungen(page)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(einstellungen(page)).toBeHidden();

    // Der Dialog steht danach weiter da – Esc ist keine stille Zustimmung.
    await expect(dialog(page)).toBeVisible();

    await page.getByRole("button", { name: "Nur notwendige", exact: true }).press("Enter");
    await expect(dialog(page)).toBeHidden();
  });
});

test.describe("Einwilligung · Reduced Motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("zeigt den Dialog sofort im Endzustand", async ({ page }) => {
    await page.goto("/");
    const modal = dialog(page);
    await expect(modal).toBeVisible();
    await expect(modal).toHaveCSS("opacity", "1");
    const dauer = await modal.evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(dauer.split(",").every((wert) => parseFloat(wert) < 0.01)).toBe(true);
  });
});

test.describe("Einwilligung · ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  // Nicht nur die Startseite: Wer aus einer Anzeige kommt, landet direkt auf einer
  // Unterseite – genau der Fall, für den die Mechanik gebaut ist. Auch dort darf
  // ohne JavaScript nichts geladen werden.
  for (const pfad of ["/", "/pakete", "/kontakt"]) {
    test(`${pfad} bleibt lesbar und es wird nichts geladen`, async ({ page }) => {
      const dritte = beobachteDritte(page);
      await page.goto(pfad);

      // Kein Dialog – und damit auch keine erteilte Einwilligung: der sichere Zustand.
      await expect(page.locator("#cc-main")).toHaveCount(0);

      // Die Seite selbst steht vollständig da.
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();

      expect(dritte, `ohne JavaScript darf auf ${pfad} nichts an Dritte gehen`).toEqual([]);
    });
  }
});

/**
 * Der dritte Server (Port 3002) ist die Fassung „wie auf Vercel": gesetzte
 * Test-GTM-Id und `VERCEL=1`. Nur hier lässt sich zeigen, was mit gesetzter ID
 * passiert – Next setzt `NEXT_PUBLIC_*` beim Bauen in das Browser-Bündel ein.
 */
test.describe("Tracking · Fassung wie auf Vercel", () => {
  test.use({ baseURL: MIT_GTM_URL });

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "w1440",
      "Der Nachweis hängt nicht an der Fensterbreite – einmal genügt",
    );
    // Der Request wird beobachtet, aber nie durchgelassen: Es geht darum, DASS er
    // ausgelöst würde. Nichts verlässt das Gerät, auch nicht in der CI.
    await page.route("**://*.googletagmanager.com/**", (route) => route.abort());
    await page.route("**://connect.facebook.net/**", (route) => route.abort());
    // Den Messpunkt von Vercel gibt es nur auf Vercel. Hier wird er beantwortet,
    // damit der Browser keinen 404 meldet – geprüft wird, DASS die Seite ihn ohne
    // Einwilligung anfordert.
    await page.route("**/_vercel/insights/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
    );
  });

  test("Vercel Web Analytics läuft ohne Einwilligung", async ({ page }) => {
    const insights: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/_vercel/insights")) insights.push(request.url());
    });

    await page.goto("/");
    await expect(dialog(page)).toBeVisible();

    // Cookielos und first-party (`/_vercel/insights/…` auf derselben Domain) –
    // deshalb ohne Einwilligung zulässig (Datenschutzerklärung §7). Geprüft wird,
    // dass die Messung anläuft, ohne dass jemand etwas angeklickt hat.
    await expect
      .poll(() => insights.length, { message: "Vercel Web Analytics lief nicht an" })
      .toBeGreaterThan(0);

    // Und dass es dabei bleibt: kein Cookie, kein Dritter.
    expect(
      (await page.context().cookies()).map((c) => c.name),
      "Vercel Web Analytics darf kein Cookie setzen",
    ).toEqual([]);
  });

  test("lädt GTM erst nach „Alle akzeptieren“ – vorher und nach „Nur notwendige“ nicht", async ({
    page,
  }) => {
    const gtm: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("googletagmanager.com")) gtm.push(request.url());
    });

    await page.goto("/");
    await expect(dialog(page)).toBeVisible();
    await page.waitForTimeout(500);
    expect(gtm, "GTM vor der Einwilligung geladen").toEqual([]);

    await page.getByRole("button", { name: "Nur notwendige", exact: true }).click();
    await page.waitForTimeout(500);
    expect(gtm, "GTM nach „Nur notwendige“ geladen").toEqual([]);

    // Auswahl ändern: Footer-Button → alles akzeptieren.
    await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
    await expect(einstellungen(page)).toBeVisible();
    await einstellungen(page)
      .getByRole("button", { name: "Alle akzeptieren", exact: true })
      .click();

    await expect
      .poll(() => gtm.length, { message: "GTM wurde nach der Einwilligung nicht geladen" })
      .toBeGreaterThan(0);
    expect(gtm[0]).toContain(`id=${GTM_TEST_ID}`);
  });

  test("setzt Consent Mode nach der Einwilligung auf „granted“ und beim Widerruf zurück", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Alle akzeptieren", exact: true }).click();

    const letzterUpdate = () =>
      page.evaluate(() => {
        const layer = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
        const updates = layer
          .map((eintrag) => Object.values(eintrag as Record<string, unknown>))
          .filter((werte) => werte[0] === "consent" && werte[1] === "update");
        return updates.at(-1)?.[2] as Record<string, string> | undefined;
      });

    await expect.poll(letzterUpdate).toMatchObject({ ad_storage: "granted" });

    // Widerruf über den Footer-Button.
    await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
    await einstellungen(page).getByRole("button", { name: "Nur notwendige", exact: true }).click();

    await expect.poll(letzterUpdate).toMatchObject({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  });

  test("lädt den Meta-Pixel ebenfalls erst nach „Alle akzeptieren“", async ({ page }) => {
    const meta: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("facebook")) meta.push(request.url());
    });

    await page.goto("/");
    await expect(dialog(page)).toBeVisible();
    await page.waitForTimeout(500);
    expect(meta, "Meta-Pixel vor der Einwilligung geladen").toEqual([]);

    await page.getByRole("button", { name: "Nur notwendige", exact: true }).click();
    await page.waitForTimeout(500);
    expect(meta, "Meta-Pixel nach „Nur notwendige“ geladen").toEqual([]);

    await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
    await einstellungen(page)
      .getByRole("button", { name: "Alle akzeptieren", exact: true })
      .click();

    await expect
      .poll(() => meta.length, { message: "Meta-Pixel wurde nach der Einwilligung nicht geladen" })
      .toBeGreaterThan(0);
    expect(meta[0]).toContain("fbevents.js");
  });

  /**
   * Die zweite Hälfte der Prüfvorgabe aus `docs/09-tracking-plan.md`: Nach erteilter
   * Einwilligung müssen die beiden verdrahteten Ereignisse auch wirklich im
   * `dataLayer` landen. Der GTM-Container selbst wird abgefangen – der `dataLayer`
   * ist aber ein gewöhnliches Array und zeigt den Eintrag unabhängig davon.
   */
  async function ereignisse(page: import("@playwright/test").Page) {
    return page.evaluate(() => {
      const layer = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
      return layer
        .filter((e): e is Record<string, unknown> => typeof e === "object" && e !== null)
        .filter((e) => typeof e.event === "string");
    });
  }

  test("meldet `cta_erstgespraech_click` erst nach der Einwilligung", async ({ page }) => {
    // Der CTA ist ein echter Link. Würde der Klick die Seite wechseln, wäre der
    // `dataLayer` mit dem alten Dokument weg. Das Ziel antwortet deshalb mit 204:
    // Darauf bleibt der Browser stehen, wo er ist (ein `abort()` würde stattdessen
    // eine Fehlerseite laden und den `dataLayer` genauso mitnehmen). Der Klick und
    // damit der Zuhörer in `CtaTracking.tsx` laufen normal.
    await page.route("**/kontakt", (route) => route.fulfill({ status: 204 }));

    await page.goto("/");
    const cta = page.locator('[data-gn-cta="erstgespraech"]').first();

    // Vor der Entscheidung steht kein einziges Ereignis im dataLayer – nur der
    // `consent`-Standard, der kein `event`-Feld trägt.
    expect(await ereignisse(page), "Ereignis vor der Einwilligung").toEqual([]);

    await page.getByRole("button", { name: "Alle akzeptieren", exact: true }).click();
    await expect(dialog(page)).toBeHidden();

    await cta.click();
    await expect
      .poll(async () => (await ereignisse(page)).map((e) => e.event), {
        message: "cta_erstgespraech_click fehlt im dataLayer",
      })
      .toContain("cta_erstgespraech_click");

    const eintrag = (await ereignisse(page)).find((e) => e.event === "cta_erstgespraech_click")!;
    // `position` und `page` ohne Personenbezug (docs/09).
    expect(eintrag.position).toBe("header");
    expect(eintrag.page).toBe("/");
  });

  test("meldet `contact_submitted` und führt auf /danke", async ({ page }) => {
    await page.goto("/kontakt");
    await page.getByRole("button", { name: "Alle akzeptieren", exact: true }).click();
    await expect(dialog(page)).toBeHidden();

    await page.locator("[name=vorname]").fill("Anna");
    await page.locator("[name=nachname]").fill("Berger");
    await page.locator("[name=email]").fill("anna.berger@example.de");
    await page.locator("[name=nachricht]").fill("Bitte um einen Rückruf zur Plattform.");
    // Die Checkbox ist sichtbar versteckt (eigene Optik), deshalb `force`.
    await page.locator("[name=einwilligung]").check({ force: true });
    const thema = page.locator("[name=thema]");
    const gewaehlt = await thema.locator("option").nth(1).getAttribute("value");
    await thema.selectOption(gewaehlt!);

    // Die Zeitfalle des Spam-Schutzes verlangt mindestens 4 Sekunden (docs/06).
    await page.waitForTimeout(4500);
    await page.getByRole("button", { name: /Nachricht senden/ }).click();

    await expect
      .poll(async () => (await ereignisse(page)).map((e) => e.event), {
        message: "contact_submitted fehlt im dataLayer",
      })
      .toContain("contact_submitted");

    const eintrag = (await ereignisse(page)).find((e) => e.event === "contact_submitted")!;
    expect(eintrag.form).toBe("kontakt");
    // `interesse` ist ein Wert aus der festen Themenliste – kein Freitext.
    expect(eintrag.interesse).toBe(gewaehlt);

    // URL-basierte Conversion: Der Erfolg führt weiter auf /danke (docs/09).
    await expect(page).toHaveURL(/\/danke\?quelle=kontakt$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Vielen Dank – Ihre Anfrage ist eingegangen.",
    );
  });
});

/* `/danke` selbst – Pflichtchecks, Texte und `noindex` – steht in
   `tests/e2e/danke.spec.ts`. Hier oben ist nur der Weg dorthin geprüft: dass das
   erfolgreiche Formular bei erteilter Einwilligung darauf führt. */
