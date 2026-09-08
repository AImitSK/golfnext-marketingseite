// @ts-check
import { spawnSync } from "node:child_process";

/**
 * Baut die beiden Fassungen, gegen die Playwright prüft (Briefing 0029).
 *
 * **Warum zwei Builds?** Seit die Artikel-Teaser auf `/` und `/ueber-golfnext` aus
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
 *
 * Der Zielordner kommt über `NEXT_DIST_DIR` (siehe `next.config.ts`), damit sich die
 * beiden Builds nicht gegenseitig überschreiben. Die Ports setzt `playwright.config.ts`.
 *
 * Aufruf: `pnpm build:e2e` – danach `pnpm test:e2e` / `test:a11y` / `test:visual`.
 * Der Produktionsbuild bleibt `pnpm build`: **ohne** `SANITY_SOURCE`, also mit den
 * echten Inhalten aus Sanity.
 */
const FASSUNGEN = [
  { name: "mit Artikeln", quelle: "fixtures", ziel: ".next" },
  { name: "ohne Artikel", quelle: "fixtures-leer", ziel: ".next-leer" },
];

for (const fassung of FASSUNGEN) {
  console.log(`\n▸ Testbuild „${fassung.name}“ → ${fassung.ziel}`);
  const ergebnis = spawnSync("next", ["build"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, SANITY_SOURCE: fassung.quelle, NEXT_DIST_DIR: fassung.ziel },
  });
  if (ergebnis.status !== 0) process.exit(ergebnis.status ?? 1);
}
