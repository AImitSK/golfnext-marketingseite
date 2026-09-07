"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { SINGLETONS, structure } from "./sanity/structure";

/**
 * Sanity Studio, eingebettet unter `/studio` (app/studio/[[...tool]]/page.tsx).
 *
 * Das Schema ist code-first: Alle Typen liegen in `sanity/schemaTypes/`.
 * Der Sanity-Connector wird nur zum Nachsehen benutzt, er legt nichts an.
 * Nach Schema-Änderungen `pnpm sanity:typegen` und `pnpm sanity:deploy` laufen lassen.
 *
 * `"use client"` oben ist Pflicht (Sanity-Doku „Embedding Sanity Studio in
 * Next.js“): Das Studio ist eine reine Client-Anwendung. Ohne die Direktive
 * zieht Next das `sanity`-Paket in den Server-Komponenten-Graphen, löst dort die
 * `react-server`-Variante von `swr` auf und der Build bricht ab
 * („Export default doesn't exist in target module“). Für die Sanity-CLI
 * (`schema extract`) ist die Zeile bedeutungslos.
 */
export default defineConfig({
  name: "default",
  title: "GolfNext",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons erscheinen nicht im globalen „Neu anlegen“ – sie sind über
    // „Einstellungen“ in der Struktur erreichbar und existieren genau einmal.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType as "siteSettings")),
  },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter(({ templateId }) => !SINGLETONS.includes(templateId as "siteSettings")),
    // Für das Singleton kein Löschen, kein Duplizieren, kein Depublizieren.
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType as "siteSettings")
        ? prev.filter(
            ({ action }) => action !== "delete" && action !== "duplicate" && action !== "unpublish",
          )
        : prev,
  },
  plugins: [
    structureTool({ structure }),
    // Vision führt GROQ-Abfragen gegen das Dataset aus – lesend, mit den Rechten
    // der angemeldeten Person. Eine Beschränkung auf Administratoren ist in der
    // Studio-Konfiguration nicht vorgesehen (siehe docs/04-sanity-content-modell.md).
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
