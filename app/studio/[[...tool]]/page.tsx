import type { Metadata } from "next";
import { NextStudio, metadata as studioMetadata, viewport } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Sanity Studio, eingebettet unter `/studio` (Masterplan 3.1).
 *
 * Der Catch-all `[[...tool]]` fängt alle Unterpfade des Studios ab
 * (`/studio/structure/...`, `/studio/vision`, …). Die Seite selbst ist statisch;
 * das Studio ist eine Client-Anwendung und holt seine Daten im Browser.
 *
 * `metadata` von next-sanity setzt `robots: noindex` und `referrer: same-origin`.
 */
export const dynamic = "force-static";

export const metadata: Metadata = {
  ...studioMetadata,
  title: { absolute: "GolfNext Studio" },
};

export { viewport };

export default function StudioPage() {
  return <NextStudio config={config} />;
}
