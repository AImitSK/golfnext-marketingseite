import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { fixturesAktiv, fixtureFuer } from "./fixtures";

/**
 * Lesender Sanity-Client für die Website.
 *
 * Bewusst OHNE Token: Das Dataset `production` ist `public`, veröffentlichte
 * Inhalte lassen sich ohne Anmeldung lesen. Der `SANITY_API_TOKEN` wird erst für
 * Entwürfe und den Draft-Mode gebraucht (Masterplan 3.8) und kommt dann in einem
 * eigenen, serverseitigen Client dazu. So kann hier kein Geheimnis in ein
 * Client-Bundle geraten.
 *
 * `perspective: "published"` blendet Entwürfe aus, `stega: false` hält die
 * unsichtbaren Visual-Editing-Zeichen aus Texten und Metadaten heraus.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: false,
});

/**
 * Cache-Marken je Dokumenttyp. Der Webhook in Masterplan 3.7 ruft
 * `revalidateTag(...)` mit genau diesen Namen; jeder Fetch muss deshalb seine
 * Marken mitgeben.
 */
export const SANITY_TAGS = ["post", "category", "author", "faq", "settings"] as const;
export type SanityTag = (typeof SANITY_TAGS)[number];

/** Sicherheitsnetz, falls ein Webhook einmal ausbleibt (docs/04). */
const DEFAULT_REVALIDATE = 3600;

/**
 * Fetch mit Cache-Marken. `query` kommt aus `lib/sanity/queries.ts` und ist mit
 * `defineQuery` geschrieben – dadurch kennt TypeScript das Ergebnis aus
 * `sanity.types.ts`, ohne dass hier ein Typ von Hand steht.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params,
  tags,
  revalidate = DEFAULT_REVALIDATE,
}: {
  query: QueryString;
  params?: QueryParams;
  tags: readonly SanityTag[];
  revalidate?: number | false;
}) {
  const ausSanity = () =>
    client.fetch(query, params ?? {}, {
      next: { revalidate, tags: [...tags] },
    });

  // Test-Fetch für Playwright (Briefing 0027, Aufgabe 8): Serverseitige Abfragen
  // lassen sich im Browser nicht abfangen, und im echten Dataset dürfen für Tests
  // keine Inhalte angelegt werden. `SANITY_SOURCE=fixtures` setzt ausschließlich
  // `playwright.config.ts`; auf Vercel greift der Zweig nie (siehe `fixturesAktiv`).
  if (fixturesAktiv()) {
    return fixtureFuer(query, params) as Awaited<ReturnType<typeof ausSanity>>;
  }

  return ausSanity();
}
