import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

/**
 * Konfiguration der Sanity-CLI (`pnpm sanity:typegen`, `pnpm sanity:deploy`).
 *
 * `typegen.enabled` bleibt aus: Das Studio ist eingebettet, es gibt kein
 * `sanity dev`, an das sich die automatische Erzeugung hängen könnte. Die Typen
 * entstehen über das Skript `sanity:typegen` (Extract + Generate) und sind
 * eingecheckt – so braucht die CI keinen Sanity-Zugriff zum Bauen.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    path: "./{app,components,lib,sanity}/**/*.{ts,tsx}",
    schema: "sanity/schema.json",
    generates: "./sanity.types.ts",
  },
});
