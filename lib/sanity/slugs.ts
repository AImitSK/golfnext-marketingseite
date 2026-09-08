import { defineQuery } from "next-sanity";
import { client } from "@/lib/sanity/client";
import { FIXTURE_SLUGS, fixturesAktiv } from "./fixtures";

/**
 * Die veröffentlichten Slugs von Artikeln und Rubriken – für den Proxy
 * (`proxy.ts`), der unbekannte `/praxis/…`-Adressen zu einem echten 404 macht.
 *
 * **Warum ein eigener Zwischenspeicher?** Der Data-Cache von Next greift im Proxy
 * nicht (gemessen am 08.09.2026, siehe docs/entscheidungen.md): ein `fetch` mit
 * `next: { revalidate, tags }` lief dort bei jedem Aufruf erneut durch. Ein
 * Sanity-Aufruf je Seitenaufruf ist nicht vertretbar, deshalb hält dieses Modul die
 * beiden Listen im Arbeitsspeicher des Prozesses.
 *
 * Folge für die Redaktion: Ein neu veröffentlichter Artikel ist nach spätestens
 * `TTL_MS` erreichbar. Das ist der Preis dafür, dass ein unbekannter Slug ohne
 * JavaScript lesbar 404 liefert – und deutlich besser als `dynamicParams = false`,
 * wo er bis zum nächsten Deploy unsichtbar bliebe.
 */

/** Haltbarkeit des Zwischenspeichers. Kurz genug, dass niemand darauf wartet. */
const TTL_MS = 60_000;

/** Nur die Slugs – die kleinstmögliche Abfrage für diesen Zweck. */
const SLUGS_QUERY = defineQuery(`{
  "artikel": *[_type == "post" && defined(slug.current)].slug.current,
  "rubriken": *[_type == "category" && defined(slug.current)].slug.current
}`);

export interface PraxisSlugs {
  artikel: string[];
  rubriken: string[];
}

let zwischenspeicher: { stand: number; slugs: PraxisSlugs } | null = null;
/** Parallele Anfragen teilen sich eine laufende Abfrage, statt sie zu vervielfachen. */
let laufend: Promise<PraxisSlugs> | null = null;

/**
 * Liefert die Slug-Listen. Wirft nicht: Ist Sanity nicht erreichbar, kommt `null`
 * zurück – der Proxy lässt die Anfrage dann durch, statt eine gültige Adresse
 * fälschlich auf 404 zu schicken.
 */
export async function praxisSlugs(): Promise<PraxisSlugs | null> {
  // Test-Fetch für Playwright (siehe lib/sanity/fixtures.ts) – auf Vercel nie aktiv.
  if (fixturesAktiv()) return FIXTURE_SLUGS;

  const jetzt = Date.now();
  if (zwischenspeicher && jetzt - zwischenspeicher.stand < TTL_MS) {
    return zwischenspeicher.slugs;
  }

  laufend ??= client
    .fetch(SLUGS_QUERY, {}, { useCdn: true, cache: "no-store" })
    .then((ergebnis) => {
      const slugs: PraxisSlugs = {
        artikel: ergebnis?.artikel ?? [],
        rubriken: ergebnis?.rubriken ?? [],
      };
      zwischenspeicher = { stand: Date.now(), slugs };
      return slugs;
    })
    .finally(() => {
      laufend = null;
    });

  try {
    return await laufend;
  } catch {
    // Kein Logging: keine Technik in Logs, keine personenbezogenen Daten (CLAUDE.md).
    // Ein alter Stand ist besser als gar keiner.
    return zwischenspeicher?.slugs ?? null;
  }
}

/** Nur für Tests: den Zwischenspeicher leeren. */
export function slugsZwischenspeicherLeeren(): void {
  zwischenspeicher = null;
  laufend = null;
}
