import { expect, test as setup } from "@playwright/test";
import { CONSENT_STATE } from "./state-path";

/**
 * Legt den Ausgangszustand für alle Prüfungen an, die **nicht** die Einwilligung
 * selbst prüfen (Briefing 0033).
 *
 * Seit der Einwilligungs-Dialog steht, liegt er beim ersten Besuch über jeder Seite.
 * Für die übrigen Specs ist er Beiwerk: `/pakete` soll auf Overflow, Kontrast und
 * Texttreue geprüft werden, nicht auf den Dialog. Schlimmer noch – axe misst den
 * Kontrast der Schaltflächen gelegentlich mitten im Einblenden und meldet dann einen
 * Fehler, den es im Endzustand nicht gibt.
 *
 * Deshalb starten alle Prüfungen als **wiederkehrender Besucher**, der schon
 * entschieden hat: „Nur notwendige" – die zurückhaltendste Wahl, bei der garantiert
 * kein Tracking läuft. Der Zustand entsteht hier einmal echt im Browser (nicht als
 * handgeschriebenes Cookie), damit er nicht veraltet, wenn die Bibliothek ihr
 * Cookie-Format ändert.
 *
 * Der Dialog selbst wird in `tests/e2e/consent.spec.ts` und
 * `tests/a11y/consent.spec.ts` geprüft – die setzen den Zustand bewusst zurück.
 *
 * Cookies unterscheiden keine Ports: Die Auswahl gilt damit auf allen drei
 * Testservern (3000, 3001, 3002).
 */

setup("Einwilligung „Nur notwendige“ vorab entscheiden", async ({ page }) => {
  await page.goto("/");

  const dialog = page.locator("#cc-main .cm");
  await expect(dialog).toBeVisible();

  await page.getByRole("button", { name: "Nur notwendige", exact: true }).click();
  await expect(dialog).toBeHidden();

  await page.context().storageState({ path: CONSENT_STATE });
});
