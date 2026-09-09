/**
 * Die Tracking-Ids, mit denen `scripts/build-e2e.mjs` die dritte Testfassung baut
 * und gegen die `tests/e2e/consent.spec.ts` prüft (Briefing 0033).
 *
 * **Keine echten Werte.** Sie gehören zu keinem Google- und keinem Meta-Konto und
 * dürfen in keiner Umgebungsvariable außerhalb der Tests stehen. Der Testlauf fängt
 * die Requests an googletagmanager.com und connect.facebook.net ab, bevor sie das
 * Gerät verlassen – geprüft wird, DASS sie ausgelöst würden, nicht was zurückkommt.
 *
 * Sie stehen in einer eigenen Datei, damit Buildskript und Playwright-Prüfungen
 * dieselben Werte lesen und sie nicht an zwei Stellen gepflegt werden müssen.
 */

/** Google-Tag-Manager-Container, Format `GTM-XXXXXXX`. */
export const GTM_TEST_ID = "GTM-E2EONLY";

/** Meta-Pixel, dort eine reine Ziffernfolge. */
export const META_PIXEL_TEST_ID = "000000000000000";
