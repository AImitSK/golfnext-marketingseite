// @ts-check
import { spawnSync } from "node:child_process";
import { GTM_TEST_ID, META_PIXEL_TEST_ID } from "./gtm-test-id.mjs";

/**
 * Baut die drei Fassungen, gegen die Playwright prüft (Briefing 0029 und 0033).
 *
 * **Warum mehrere Builds?** Seit die Artikel-Teaser auf `/` und `/ueber-golfnext` aus
 * Sanity kommen, werden beide Seiten **beim Bauen** vorgerendert (statisch mit ISR –
 * genau so sollen sie in Produktion stehen). Der Testbestand aus
 * `lib/sanity/fixtures.ts` wirkt deshalb nicht mehr erst beim Aufruf, sondern schon
 * beim Bauen. Ein Server allein kann damit nicht beide Zustände zeigen, die das
 * Briefing verlangt: mit Artikeln und ohne.
 *
 * - `.next` (Port 3000): `SANITY_SOURCE=fixtures` – zwölf Beispielartikel.
 * - `.next-leer` (Port 3001): `SANITY_SOURCE=fixtures-leer` – kein einziger Artikel;
 *   dort muss der Praxis-Abschnitt der Startseite und der Wissen-Abschnitt auf
 *   `/ueber-golfnext` vollständig fehlen.
 * - `.next-gtm` (Port 3002): die Fassung „wie auf Vercel" (Briefing 0033) – mit
 *   gesetzter **Test**-GTM-ID und `VERCEL=1`. Beides muss beim Bauen dastehen: Next
 *   setzt `NEXT_PUBLIC_*` in das Browser-Bündel ein, und die Seiten werden beim
 *   Bauen vorgerendert. Nur so ist nachweisbar, dass nach „Alle akzeptieren"
 *   tatsächlich GTM und der Meta-Pixel geladen werden (und vorher nicht) und dass
 *   Vercel Web Analytics ohne Einwilligung läuft. Den Gegenfall „Einwilligung
 *   erteilt, aber keine ID gesetzt" zeigen die beiden anderen Fassungen, die gar
 *   keine Ids tragen. Die Ids sind Testwerte und gehören zu keinem echten Konto
 *   (`scripts/gtm-test-id.mjs`); die Requests werden im Test abgefangen und nie
 *   wirklich gesendet.
 *
 * Der Zielordner kommt über `NEXT_DIST_DIR` (siehe `next.config.ts`), damit sich die
 * Builds nicht gegenseitig überschreiben. Die Ports setzt `playwright.config.ts`.
 *
 * Aufruf: `pnpm build:e2e` – danach `pnpm test:e2e` / `test:a11y` / `test:visual`.
 * Der Produktionsbuild bleibt `pnpm build`: **ohne** `SANITY_SOURCE`, also mit den
 * echten Inhalten aus Sanity.
 */
const FASSUNGEN = [
  { name: "mit Artikeln", quelle: "fixtures", ziel: ".next", gtm: "", pixel: "", vercel: false },
  {
    name: "ohne Artikel",
    quelle: "fixtures-leer",
    ziel: ".next-leer",
    gtm: "",
    pixel: "",
    vercel: false,
  },
  {
    name: "wie auf Vercel (Test-Tracking-Ids)",
    quelle: "fixtures",
    ziel: ".next-gtm",
    gtm: GTM_TEST_ID,
    pixel: META_PIXEL_TEST_ID,
    vercel: true,
  },
];

for (const fassung of FASSUNGEN) {
  console.log(`\n▸ Testbuild „${fassung.name}“ → ${fassung.ziel}`);
  const ergebnis = spawnSync("next", ["build"], {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      SANITY_SOURCE: fassung.quelle,
      NEXT_DIST_DIR: fassung.ziel,
      NEXT_PUBLIC_GTM_ID: fassung.gtm,
      NEXT_PUBLIC_META_PIXEL_ID: fassung.pixel,
      // Nur die dritte Fassung stellt sich als „läuft auf Vercel" – dort bindet
      // `app/layout.tsx` Vercel Web Analytics ein. In den beiden anderen Fassungen
      // bliebe es beim 404 auf `/_vercel/insights/script.js`, den es außerhalb von
      // Vercel nun einmal gibt, und jede Seitenprüfung fiele über den
      // Konsolenfehler. Der Testlauf fängt den Request ab (siehe consent.spec.ts).
      ...(fassung.vercel ? { VERCEL: "1" } : {}),
    },
  });
  if (ergebnis.status !== 0) process.exit(ergebnis.status ?? 1);
}
