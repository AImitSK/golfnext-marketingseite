import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit-Tests (lib/*). E2E/a11y/visuell laufen über Playwright, daher hier ausgeschlossen.
export default defineConfig({
  resolve: {
    // Gleicher „@/"-Alias wie tsconfig.json, damit Tests Laufzeit-Importe auflösen.
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "config/**/*.test.ts", "content/**/*.test.ts"],
    exclude: ["node_modules", ".next", "tests/**", "Template/**"],
  },
});
