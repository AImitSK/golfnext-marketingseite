import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Standard-Ignores von eslint-config-next
    ".next/**",
    // Zweiter und dritter Testbuild (Briefing 0029/0033, scripts/build-e2e.mjs) –
    // erzeugter Code
    ".next-leer/**",
    ".next-gtm/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Projektspezifisch: Doku, Mocks, Marken-Quellen und Test-Artefakte nicht linten
    "docs/**",
    "brand/**",
    "Template/**",
    "playwright-report/**",
    "test-results/**",
    // Vorentschiedener Einwilligungs-Zustand für Playwright (Briefing 0033)
    "tests/.state/**",
    // Agenten-Arbeitsbereich: `.claude/worktrees/<branch>` ist eine vollständige
    // zweite Kopie des Repos (git worktree). Sie hier mitzulinten meldet dieselben
    // Dateien doppelt und lässt `pnpm lint` an fremden Branches scheitern.
    ".claude/**",
    // Von `pnpm sanity:typegen` erzeugt (Briefing 0026) – kein Handcode, kein Lint
    "sanity.types.ts",
    "sanity/schema.json",
  ]),
]);

export default eslintConfig;
