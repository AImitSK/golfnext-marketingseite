import { isLinkable } from "@/config/site-structure";
import type { Cta } from "@/content/types";

/**
 * CTA-Ziele werden nie hart kodiert (docs/01-architektur.md, Konventionen).
 *
 * **Der Buchungsweg ist am 10.09.2026 entfallen** (Entscheidung Stefan): Es gibt kein
 * cal.com und keine `NEXT_PUBLIC_BOOKING_URL` mehr. Wer ein Erstgespräch möchte,
 * kommt aufs Kontaktformular – ein Weg, den Fred ohne fremdes Werkzeug bedient.
 * `target: "erstgespraech"` bleibt in `content/*` als Absicht stehen und löst hier
 * auf `/kontakt` auf; die Beschriftungen der Schaltflächen ändern sich dadurch nicht.
 */
const FALLBACK = "/kontakt";

/**
 * Interner Teaser-Link mit Live-Gate: Zeigt auf `path`, solange die Ziel-Route
 * `live` ist (config/site-structure.ts), sonst auf `#`. So aktivieren sich CTAs
 * auf der Startseite (Plattform, Wachstum & Vertrieb, Clubprozesse, So arbeitet
 * GolfNext, Praxis) automatisch, sobald ihre Seite live geht – ohne Codeänderung.
 * Der Pfad muss dafür in ROUTES stehen; auf entfernte Routen zeigt nichts mehr
 * (`/team`, `/ratgeber`, `/module/<slug>` sind mit Briefing 0023 entfallen).
 */
export function internalHref(path: string): string {
  return isLinkable(path) ? path : "#";
}

/**
 * Props für einen CTA-Link: das aufgelöste Ziel plus die Markierung, an der das
 * Ereignis `cta_erstgespraech_click` hängt (docs/09-tracking-plan.md).
 *
 * Warum eine Markierung statt eines `onClick`: Der Erstgespräch-CTA steht in
 * Header, Heroes, Paketkarten und Footer – alles Server-Komponenten. Ein Handler
 * an jeder Stelle würde sie alle in den Browser ziehen. Stattdessen liest ein
 * einziger Zuhörer am Dokument die Markierung (`components/site/CtaTracking.tsx`).
 *
 * Auf die Seite kommt das Attribut nur bei `target: "erstgespraech"`; ohne
 * Einwilligung passiert beim Klick trotzdem nichts (`lib/tracking/events.ts`).
 */
export function ctaLinkProps(cta: Cta): { href: string; "data-gn-cta"?: string } {
  return {
    href: resolveCta(cta),
    ...(cta.target === "erstgespraech" ? { "data-gn-cta": "erstgespraech" } : {}),
  };
}

/** Löst das Ziel eines CTA aus content/<seite>.ts in eine URL auf. */
export function resolveCta(cta: Cta): string {
  switch (cta.target) {
    case "erstgespraech":
      return FALLBACK;
    case "pakete":
      return "/pakete";
    case "kontakt":
      return "/kontakt";
    case "intern":
      return cta.href?.trim() || "/";
    default:
      return FALLBACK;
  }
}
