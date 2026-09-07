import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright-Prüfungen laufen gegen den Produktionsbuild (`pnpm start`).
 * Vor dem Lauf muss `pnpm build` gelaufen sein (CI baut separat, lokal via reuseExistingServer).
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
    reuseExistingServer: !isCI,
    timeout: 120_000,
    env: {
      // Riegel für den Formular-Test (Briefing 0025): Der Testserver verschickt
      // NIEMALS echte Mails und schreibt NIEMALS in die gemeinsame Redis-Datenbank –
      // auch dann nicht, wenn in `.env.local` gültige Schlüssel stehen. Ohne diese
      // beiden Werte würde ein Testlauf echte Anfragen an info@golfnext.de senden.
      MAIL_TRANSPORT: "mock",
      RATELIMIT_STORE: "memory",
      // Der Spam-Schutz wird nicht abgeschaltet, nur der Schlüssel festgelegt.
      FORM_SIGNING_SECRET:
        process.env.FORM_SIGNING_SECRET ?? "playwright-only-signing-secret-not-for-production",
    },
  },
});
