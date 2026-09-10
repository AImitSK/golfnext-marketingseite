import { expect, test } from "@playwright/test";

/**
 * Die Hero-Choreografien der drei Seiten, die eine haben (Briefing 0015).
 *
 * **Warum es diese Prüfung gibt.** Die Choreografien waren gebaut, liefen aber nie
 * (gemeldet 10.09.2026, live nachgemessen). Sie hingen an `useStagedInView`: Der
 * Startzustand wurde nach dem Mount gesetzt und – weil ein Hero immer im Sichtfeld
 * steht – **17 ms später** wieder aufgelöst. Das Element ging vom End- in den
 * Endzustand, ein Übergang kam nie zustande. Keine Prüfung hat das bemerkt, weil
 * alle nur den Endzustand kontrollierten (reduzierte Bewegung, ohne JS) – und der
 * war ja die ganze Zeit da.
 *
 * Geprüft wird deshalb der Vertrag, nicht ein Zwischenbild (das wäre zeitabhängig
 * und flatterig): Die Elemente tragen eine CSS-Animation mit Dauer, sie läuft genau
 * einmal, und bei `prefers-reduced-motion` läuft sie gar nicht.
 *
 * Die Choreografie liegt im Modul-CSS statt in JavaScript, damit sie ab dem ersten
 * gemalten Frame läuft. Das Server-HTML zeigt den Endzustand; würde der Startzustand
 * erst nach der Hydration gesetzt, blinkte der Hero sichtbar rückwärts weg.
 */

/** Je Seite ein Element aus der Choreografie, gesucht über den Klassen-Stamm. */
const HEROES = [
  { pfad: "/wachstum-vertrieb", teil: "crmrow", was: "die Anmeldungen laufen ein" },
  { pfad: "/clubprozesse", teil: "nitem", was: "die Turnier-News laufen ein" },
  { pfad: "/pakete", teil: "srow", was: "die Ausbaustufen staffeln sich herein" },
  { pfad: "/pakete", teil: "spine", was: "das Rückgrat baut sich auf" },
];

/** Animationsdaten des ersten Elements, dessen Klasse `__<teil>` enthält. */
async function animation(page: import("@playwright/test").Page, teil: string) {
  return page.evaluate((teil) => {
    const el = [...document.querySelectorAll("main *")].find((k) =>
      (k.className || "").toString().includes("__" + teil),
    );
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      name: s.animationName,
      dauer: parseFloat(s.animationDuration),
      wiederholungen: s.animationIterationCount,
    };
  }, teil);
}

test.describe("Hero-Choreografien", () => {
  for (const { pfad, teil, was } of HEROES) {
    test(`${pfad}: ${was}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "w1440", "Die Choreografie hängt nicht an der Breite");

      await page.goto(pfad);
      const a = await animation(page, teil);

      expect(a, `kein Element mit „${teil}" auf ${pfad} gefunden`).not.toBeNull();
      expect(a!.name, `${teil} trägt keine CSS-Animation – läuft die Choreografie noch?`).not.toBe(
        "none",
      );
      expect(a!.dauer, `${teil} hat keine Animationsdauer`).toBeGreaterThan(0);
      // „Einmal, Endzustand bleibt" (CLAUDE.md) – kein Dauer-Effekt.
      expect(a!.wiederholungen, `${teil} läuft mehr als einmal`).toBe("1");
    });
  }

  test.describe("bei reduzierter Bewegung", () => {
    test.use({ reducedMotion: "reduce" });

    for (const { pfad, teil } of HEROES) {
      test(`${pfad}: ${teil} läuft gar nicht erst an`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "w1440", "Die Choreografie hängt nicht an der Breite");

        await page.goto(pfad);
        const a = await animation(page, teil);
        expect(a).not.toBeNull();
        expect(a!.name, `${teil} animiert trotz prefers-reduced-motion`).toBe("none");
      });
    }
  });
});
