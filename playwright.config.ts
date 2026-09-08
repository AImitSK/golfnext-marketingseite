import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright-Prüfungen laufen gegen den Produktionsbuild (`pnpm start`).
 * Vor dem Lauf muss `pnpm build` gelaufen sein. Playwright startet den Server immer
 * selbst und legt dabei die Umgebung fest (siehe `webServer.env`); ein bereits
 * laufender Dev-Server wird NICHT wiederverwendet.
 * Breakpoints nach QA-Vorgabe: 390 / 768 / 1024 / 1180 / 1440.
 */
const BREAKPOINTS = [390, 768, 1024, 1180, 1440];
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: BREAKPOINTS.map((width) => ({
    name: `w${width}`,
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width, height: 900 },
    },
  })),
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    // **Playwright startet den Server IMMER selbst** – auch lokal (Briefing 0025).
    // Grund: Die `env` unten wirkt nur auf einen von Playwright gestarteten Prozess.
    // Mit `reuseExistingServer` hängte sich ein lokaler Lauf an einen bereits
    // laufenden `pnpm dev`/`pnpm start` – der lädt `.env.local` und verschickt mit
    // gültigem SendGrid-Schlüssel **echte Mails an info@golfnext.de**. Genau das ist
    // beim Bau von 4.3 passiert. Ist Port 3000 belegt, bricht der Lauf jetzt mit
    // einer klaren Meldung ab, statt still echte Anfragen zu senden – dann bitte den
    // Dev-Server beenden und erneut starten.
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      // Der Testserver verschickt NIEMALS echte Mails und schreibt NIEMALS in die
      // gemeinsame Redis-Datenbank – auch dann nicht, wenn in `.env.local` gültige
      // Schlüssel stehen.
      MAIL_TRANSPORT: "mock",
      // Die Praxis-Routen lesen Testdaten statt Sanity (Briefing 0027, Aufgabe 8):
      // serverseitige Abfragen lassen sich im Browser nicht abfangen, und im echten
      // Dataset dürfen für Tests keine Inhalte angelegt werden. Siehe
      // lib/sanity/fixtures.ts.
      SANITY_SOURCE: "fixtures",
      RATELIMIT_STORE: "memory",
      // Der Spam-Schutz wird nicht abgeschaltet, nur der Schlüssel festgelegt.
      FORM_SIGNING_SECRET:
        process.env.FORM_SIGNING_SECRET ?? "playwright-only-signing-secret-not-for-production",
    },
  },
});
