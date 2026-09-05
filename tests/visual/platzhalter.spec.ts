import { expect, test } from "@playwright/test";

// Platzhalter für die visuelle Regression (ab Phase 1 mit Screenshot-Vergleich gegen die Mocks).
// Läuft grün, damit `pnpm test:visual` in der CI vorhanden und lauffähig ist.
test("Platzhalter: Startseite ist erreichbar", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
});
