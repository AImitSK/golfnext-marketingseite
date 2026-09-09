import { defineConfig, devices } from "@playwright/test";
import { CONSENT_STATE } from "./tests/setup/state-path";

/**
 * Playwright-Prüfungen laufen gegen einen Produktionsbuild.
 * **Vor dem Lauf muss `pnpm build:e2e` gelaufen sein** – nicht `pnpm build`: Seit die
 * Artikel-Teaser auf `/` und `/ueber-golfnext` aus Sanity kommen, werden beide Seiten
 * beim Bauen vorgerendert; der Testbestand muss also schon beim Bauen wirken
 * (siehe `scripts/build-e2e.mjs`).
 *
 * Daraus folgen **drei Server**:
 * - **3000** (Vorgabe): Testbestand `fixtures` – zwölf Beispielartikel.
 * - **3001**: Testbestand `fixtures-leer` – kein einziger Artikel. Prüfungen, die den
 *   Zustand „noch nichts veröffentlicht" brauchen, setzen `baseURL` auf
 *   `OHNE_ARTIKEL_URL`.
 * - **3002**: wie 3000, aber mit gesetzter Test-GTM-Id (Briefing 0033) – nur dort
 *   lässt sich zeigen, dass nach „Alle akzeptieren" wirklich geladen wird
 *   (`MIT_GTM_URL`).
 *
 * Playwright startet alle Server immer selbst und legt dabei die Umgebung fest (siehe
 * `webServer.env`); ein bereits laufender Dev-Server wird NICHT wiederverwendet.
 * Breakpoints nach QA-Vorgabe: 390 / 768 / 1024 / 1180 / 1440.
 *
 * **Ausgangszustand (Briefing 0033):** Vor allen Prüfungen läuft das Projekt `setup`
 * und entscheidet den Einwilligungs-Dialog einmal mit „Nur notwendige"; alle
 * Breitenprojekte starten mit diesem Zustand. Sonst läge der Dialog über jeder
 * geprüften Seite und axe würde seinen Kontrast mitten im Einblenden messen. Die
 * beiden Consent-Specs setzen den Zustand für sich zurück.
 */

/** Adresse des zweiten Servers – Testbestand ohne einen einzigen Artikel. */
export const OHNE_ARTIKEL_URL = "http://localhost:3001";

/**
 * Adresse des dritten Servers – wie der erste, aber mit gesetzter Test-GTM-ID
 * (Briefing 0033). Nur hier lässt sich prüfen, dass nach „Alle akzeptieren"
 * tatsächlich GTM geladen wird: Next setzt `NEXT_PUBLIC_*` beim Bauen in das
 * Browser-Bündel ein, der Fall braucht deshalb eine eigene Fassung.
 */
export const MIT_GTM_URL = "http://localhost:3002";
const BREAKPOINTS = [390, 768, 1024, 1180, 1440];
const isCI = !!process.env.CI;

/**
 * Umgebung beider Testserver. Sie verschicken **niemals** echte Mails und schreiben
 * **niemals** in die gemeinsame Redis-Datenbank – auch dann nicht, wenn in
 * `.env.local` gültige Schlüssel stehen. Was sich zwischen den Servern unterscheidet,
 * ist allein der Testbestand (`SANITY_SOURCE`) und sein Build-Ordner.
 */
const TEST_ENV = {
  MAIL_TRANSPORT: "mock",
  RATELIMIT_STORE: "memory",
  // Der Spam-Schutz wird nicht abgeschaltet, nur der Schlüssel festgelegt.
  FORM_SIGNING_SECRET:
    process.env.FORM_SIGNING_SECRET ?? "playwright-only-signing-secret-not-for-production",
};

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
  projects: [
    {
      // Läuft einmal vor allen anderen: entscheidet den Einwilligungs-Dialog mit
      // „Nur notwendige" und legt den Zustand in `tests/.state/consent.json` ab
      // (Briefing 0033, siehe `tests/setup/consent.setup.ts`).
      name: "setup",
      testMatch: /setup\/.*\.setup\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    ...BREAKPOINTS.map((width) => ({
      name: `w${width}`,
      dependencies: ["setup"],
      // Die Setup-Datei ist kein Prüffall – sie läuft nur im Projekt „setup".
      testIgnore: /\.setup\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width, height: 900 },
        // Alle Prüfungen starten als wiederkehrender Besucher, der schon
        // entschieden hat – sonst läge der Dialog über jeder geprüften Seite. Die
        // beiden Consent-Specs setzen den Zustand selbst zurück (`test.use`).
        storageState: CONSENT_STATE,
      },
    })),
  ],
  webServer: [
    {
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
      env: { ...TEST_ENV, SANITY_SOURCE: "fixtures" },
    },
    {
      // Zweiter Server für den leeren Bestand (Briefing 0029): Aus ihm liest der
      // Testlauf, was Besucher sehen, solange Fred noch keinen Artikel veröffentlicht
      // hat. Eigener Build-Ordner, weil die beiden Zustände beim Bauen entstehen.
      command: "pnpm start",
      url: OHNE_ARTIKEL_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...TEST_ENV,
        SANITY_SOURCE: "fixtures-leer",
        NEXT_DIST_DIR: ".next-leer",
        PORT: "3001",
      },
    },
    {
      // Dritter Server für den Fall „Tracking-ID ist gesetzt" (Briefing 0033).
      // Ohne ihn ließe sich nur die eine Hälfte des Nachweises führen (dass ohne
      // ID nichts lädt); geprüft werden muss aber auch, dass nach „Alle
      // akzeptieren" wirklich GTM angefordert wird. Die Id ist ein Testwert
      // (scripts/gtm-test-id.mjs) und gehört zu keinem echten Konto; der Test
      // fängt den Request ab, er verlässt das Gerät nie.
      command: "pnpm start",
      url: MIT_GTM_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...TEST_ENV,
        SANITY_SOURCE: "fixtures",
        NEXT_DIST_DIR: ".next-gtm",
        PORT: "3002",
      },
    },
  ],
});
