import { expect, test } from "@playwright/test";

/**
 * Kürzel (Initialen) in den Avatarkreisen der schematischen Geräte-Illustrationen.
 *
 * **Warum es diese Prüfung gibt.** Die Kreise stehen in Containern mit
 * `aria-hidden="true"` (bewusste Darstellungen des Systems, keine Screenshots). Die
 * a11y-Specs schließen genau diese Container aus – `.exclude('[aria-hidden="true"]')`,
 * siehe `tests/a11y/wachstum-vertrieb.spec.ts` –, weil ihre gedämpften Sekundärtexte
 * absichtlich unter dem Kontrastwert liegen. Damit ist der Kontrast der Kürzel für axe
 * unsichtbar, und ein Fehler dort fällt keiner Prüfung auf.
 *
 * **Der Fehler, den sie fängt.** Beim Portieren aus den Mocks verliert der Selektor
 * leicht seinen Elternteil: Der Mock schreibt `.crmrow .av`, portiert wurde `.av`.
 * Die spätere Regel `.crmrow span { color: var(--gn-muted) }` hat dann die höhere
 * Spezifität und überstimmt die weiße Kürzelfarbe – graue Kürzel auf Navy, Kontrast
 * rund 1,7:1. Das ist zweimal passiert (Startseite, danach fünf weitere Stellen).
 *
 * Geprüft wird deshalb nicht der Selektor, sondern das Ergebnis: Jeder Kreis mit
 * zwei Großbuchstaben muss gegen seinen eigenen Hintergrund mindestens 4,5:1 haben.
 */

/** Routen, auf denen Geräte-Illustrationen mit Kürzel-Kreisen stehen. */
const ROUTEN = ["/", "/plattform", "/plattform/so-arbeitet-golfnext", "/wachstum-vertrieb"];

type Kreis = { text: string; color: string; bg: string };

/** Relative Leuchtdichte nach WCAG 2.1. */
function leuchtdichte(farbe: number[]): number {
  const [r, g, b] = farbe.map((wert) => {
    const v = wert / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier `rgb(...)`-Angaben. */
function kontrast(vorne: string, hinten: string): number {
  const werte = (s: string) => (s.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  const [hell, dunkel] = [leuchtdichte(werte(vorne)), leuchtdichte(werte(hinten))].sort(
    (a, b) => b - a,
  );
  return (hell + 0.05) / (dunkel + 0.05);
}

for (const route of ROUTEN) {
  test(`${route}: die Kürzel in den Avatarkreisen sind lesbar`, async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "w1440",
      "Farben hängen nicht an der Breite – eine Breite genügt",
    );

    await page.goto(route);

    const kreise: Kreis[] = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("span, div")]
        .filter((el) => /^[A-ZÄÖÜ]{2}$/.test((el.textContent ?? "").trim()))
        .filter((el) => {
          const s = getComputedStyle(el);
          // runder Kreis mit eigener Füllung – nicht jedes zufällige Kürzel im Text
          const rund = s.borderRadius === "50%" || parseFloat(s.borderRadius) >= 16;
          const gefuellt = s.backgroundColor !== "rgba(0, 0, 0, 0)";
          return rund && gefuellt;
        })
        .map((el) => {
          const s = getComputedStyle(el);
          return { text: el.textContent!.trim(), color: s.color, bg: s.backgroundColor };
        }),
    );

    // Findet die Prüfung nichts, stimmt die Annahme nicht mehr – dann ist sie blind.
    expect(kreise.length, `keine Kürzel-Kreise auf ${route} gefunden`).toBeGreaterThan(0);

    const unlesbar = kreise
      .map((k) => ({ ...k, wert: kontrast(k.color, k.bg) }))
      .filter((k) => k.wert < 4.5)
      .map((k) => `${k.text}: ${k.color} auf ${k.bg} = ${k.wert.toFixed(2)}:1`);

    expect(unlesbar, `Kürzel unter 4,5:1 auf ${route}`).toEqual([]);
  });
}
