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
  },
});
