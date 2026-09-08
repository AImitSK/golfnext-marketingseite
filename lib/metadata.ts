import type { Metadata } from "next";
import { ROUTES } from "@/config/site-structure";

/**
 * Metadata einer Route aus der einen Wahrheit `config/site-structure.ts` –
 * nichts hier ist hart kodiert und nichts wird erfunden (Briefing 0022):
 *
 * - `title`: der Wert aus den „Technischen Seitenangaben" des Fred-Briefings;
 *   steht dort `null`, greift das Navigations-`label` (Template `%s | GolfNext`
 *   aus `app/layout.tsx`).
 * - `description`: nur, wenn sie im Briefing steht – sonst gar keine.
 * - `robots`: `noindex, nofollow`, sobald die Route in site-structure `noindex`
 *   trägt (Platzhalter-Routen, docs/07-seo.md).
 *
 * Gedacht für die Platzhalter-Routen; die gebauten Seiten setzen ihre Metadata
 * weiterhin selbst (dort steckt sie in `content/<seite>.ts`).
 */
/**
 * Trägt eine Route `noindex`? Eine Wahrheit für die Seiten, die ihre Metadata selbst
 * bauen (die Praxis-Routen aus Sanity, Briefing 0027): Sie fragen hier nach, statt
 * `noindex` zu wiederholen. So schaltet der Statuswechsel in
 * `config/site-structure.ts` die Indexierung wirklich mit einer Zeile frei.
 */
export function routeNoindex(path: string): boolean {
  const route = ROUTES.find((r) => r.path === path);
  if (!route) throw new Error(`Route "${path}" fehlt in config/site-structure.ts`);
  return route.noindex === true;
}

export function routeMetadata(path: string): Metadata {
  const route = ROUTES.find((r) => r.path === path);
  if (!route) throw new Error(`Route "${path}" fehlt in config/site-structure.ts`);

  return {
    title: route.title ?? route.label,
    ...(route.description ? { description: route.description } : {}),
    alternates: { canonical: route.path },
    ...(route.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
