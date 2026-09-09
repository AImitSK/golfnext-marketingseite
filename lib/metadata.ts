import type { Metadata } from "next";
import { ROUTES, type Route } from "@/config/site-structure";

/**
 * Metadata einer Route aus der einen Wahrheit `config/site-structure.ts` –
 * nichts hier ist hart kodiert und nichts wird erfunden (Briefing 0022, erweitert
 * durch Briefing 0034 / Masterplan 6.1):
 *
 * - `title`: der Wert aus den „Technischen Seitenangaben" des Briefings; steht dort
 *   `null`, greift das Navigations-`label` (Template `%s | GolfNext` aus
 *   `app/layout.tsx`).
 * - `description`: nur, wenn sie in site-structure steht – sonst gar keine. Eine
 *   Route ohne Angabe bekommt hier keine erfundene.
 * - `alternates.canonical`: der Pfad der Route; `metadataBase` steht im Root-Layout.
 * - `openGraph`/`twitter`: aus **denselben** Feldern, damit ein geteilter Link
 *   nichts anderes behauptet als das Suchergebnis.
 * - `robots`: `noindex, nofollow`, sobald die Route in site-structure `noindex`
 *   trägt (docs/07-seo.md).
 *
 * Seit Briefing 0034 zieht **jede** gebaute Seite ihre Metadata hierdurch; die
 * frühere zweite Quelle `meta` in `content/<seite>.ts` ist entfallen.
 */

/** Die Marke, wie sie im Titel und als `og:site_name` steht. */
const MARKE = "GolfNext";

function routeOderFehler(path: string): Route {
  const route = ROUTES.find((r) => r.path === path);
  if (!route) throw new Error(`Route "${path}" fehlt in config/site-structure.ts`);
  return route;
}

/**
 * Trägt eine Route `noindex`? Eine Wahrheit für die Seiten, die ihre Metadata selbst
 * bauen (die Praxis-Routen aus Sanity, Briefing 0027): Sie fragen hier nach, statt
 * `noindex` zu wiederholen. So schaltet der Statuswechsel in
 * `config/site-structure.ts` die Indexierung wirklich mit einer Zeile frei.
 */
export function routeNoindex(path: string): boolean {
  return routeOderFehler(path).noindex === true;
}

/**
 * Der Titel einer Route, wie er in site-structure steht – ohne Marken-Suffix.
 * Fehlt er, steht dort das Navigations-`label`. Auch die OG-Bilder lesen hier
 * (`lib/og/bild.tsx`), damit im Bild derselbe Titel steht wie im Tab.
 */
export function routeTitle(path: string): string {
  const route = routeOderFehler(path);
  return route.title ?? route.label;
}

/**
 * Der vollständige Titel inklusive Marke. docs/07-seo.md: Das Suffix „ | GolfNext"
 * entfällt, wo der Titel die Marke schon trägt („Impressum – GolfNext") – sonst
 * stünde sie zweimal im Tab und im Suchergebnis.
 */
export function vollerTitel(titel: string): string {
  return titel.includes(MARKE) ? titel : `${titel} | ${MARKE}`;
}

export function routeMetadata(path: string): Metadata {
  const route = routeOderFehler(path);
  const titel = routeTitle(path);
  const description = route.description ?? undefined;

  return {
    title: titel.includes(MARKE) ? { absolute: titel } : titel,
    ...(description ? { description } : {}),
    alternates: { canonical: route.path },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: MARKE,
      url: route.path,
      // Absolut gesetzt: `og:title` soll den Titel tragen, den auch das
      // Suchergebnis zeigt – nicht den Rohwert ohne Marke.
      title: { absolute: vollerTitel(titel) },
      ...(description ? { description } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: { absolute: vollerTitel(titel) },
      ...(description ? { description } : {}),
    },
    ...(route.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * Metadata einer Seite, deren Titel und Beschreibung aus Sanity kommen – die
 * Praxis-Artikel und die Rubrikseiten (Briefing 0027). Sie stehen nicht in
 * site-structure, sollen aber dieselben Felder tragen wie jede andere Seite:
 * Canonical, `openGraph`, `twitter`.
 *
 * Der Titel bleibt **absolut**, also ohne Marken-Suffix: Ein Artikeltitel darf bis zu
 * 90 Zeichen lang sein (Schema-Validierung), ein angehängtes „ | GolfNext" würde ihn
 * in der Suche regelmäßig abschneiden (docs/07-seo.md).
 */
export function inhaltMetadata({
  titel,
  description,
  pfad,
  noindex = false,
  typ = "website",
}: {
  titel: string;
  description?: string | null;
  pfad: string;
  noindex?: boolean;
  typ?: "website" | "article";
}): Metadata {
  const text = description ?? undefined;

  return {
    title: { absolute: titel },
    ...(text ? { description: text } : {}),
    alternates: { canonical: pfad },
    openGraph: {
      type: typ,
      locale: "de_DE",
      siteName: MARKE,
      url: pfad,
      title: { absolute: titel },
      ...(text ? { description: text } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: { absolute: titel },
      ...(text ? { description: text } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
