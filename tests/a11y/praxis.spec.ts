import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { FIXTURE_ARTIKEL_SLUG, FIXTURE_RUBRIKEN } from "../../lib/sanity/fixtures";

/**
 * Barrierefreiheit der drei Praxis-Routen (Masterplan 3.4, Briefing 0027).
 * Inhalte aus `lib/sanity/fixtures.ts` (`SANITY_SOURCE=fixtures`).
 */
const ROUTEN = [
  ["/praxis", "Übersicht"],
  [`/praxis/thema/${FIXTURE_RUBRIKEN[0].slug}`, "Rubrikseite"],
  [`/praxis/${FIXTURE_ARTIKEL_SLUG}`, "Artikel"],
] as const;

for (const [pfad, name] of ROUTEN) {
  test(`${pfad} (${name}) hat keine WCAG-A/AA-Verstöße`, async ({ page }) => {
    await page.goto(pfad);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("die leere Übersicht ist ebenfalls barrierefrei", async ({ page }) => {
  // Der Leerzustand ist beim Abnehmen der Normalfall (leeres Dataset). Die leere
  // Rubrik C zeigt ihn, ohne dass dafür Inhalte gelöscht werden müssten.
  await page.goto(`/praxis/thema/${FIXTURE_RUBRIKEN[2].slug}`);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
