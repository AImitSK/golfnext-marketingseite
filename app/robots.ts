import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * `robots.txt` (Masterplan 6.3, Briefing 0034).
 *
 * Gesperrt sind die drei Bereiche, die in keinem Suchergebnis etwas zu suchen haben:
 * das Studio, die API-Routen und die Bausteinvorschau. Alles andere ist erlaubt; ob
 * eine einzelne Seite indexiert wird, entscheidet ihr `robots`-Meta-Tag aus
 * `config/site-structure.ts` – nicht diese Datei. (Eine per robots.txt gesperrte
 * Seite kann ihr `noindex` nicht mehr mitteilen; deshalb steht `/danke` hier nicht.)
 *
 * Preview-Deployments sind zusätzlich über den Kopf `X-Robots-Tag: noindex, nofollow`
 * ausgenommen (`next.config.ts`).
 */
export default function robots(): MetadataRoute.Robots {
  const basis = siteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api", "/_bausteine"],
    },
    sitemap: new URL("/sitemap.xml", basis).toString(),
    host: basis,
  };
}
