import { isLinkable } from "@/config/site-structure";
import type { Cta } from "@/content/types";

/**
 * CTA-Ziele werden nie hart kodiert. Buchungs- und Live-Demo-Link kommen aus der
 * Umgebung (NEXT_PUBLIC_*). Fehlt ein Wert, rendert der Button den Fallback /kontakt –
 * nie einen leeren Link (docs/01-architektur.md, Konventionen).
 */
const FALLBACK = "/kontakt";

/** Buchungslink für das Online-Erstgespräch; Fallback Kontaktseite. */
export function bookingUrl(): string {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  return url ? url : FALLBACK;
}

/** Öffentliche Live-Demo; Fallback Kontaktseite. */
export function liveDemoUrl(): string {
  const url = process.env.NEXT_PUBLIC_LIVE_DEMO_URL?.trim();
  return url ? url : FALLBACK;
}

/**
 * Interner Teaser-Link mit Live-Gate: Zeigt auf `path`, solange die Ziel-Route
 * `live` ist (config/site-structure.ts), sonst auf `#`. So aktivieren sich CTAs
 * auf der Startseite (Plattform, Wachstum & Vertrieb, Clubprozesse, So arbeitet
 * GolfNext, Praxis) automatisch, sobald ihre Seite live geht – ohne Codeänderung.
 */
export function internalHref(path: string): string {
  return isLinkable(path) ? path : "#";
}

/** Löst das Ziel eines CTA aus content/<seite>.ts in eine URL auf. */
export function resolveCta(cta: Cta): string {
  switch (cta.target) {
    case "erstgespraech":
      return bookingUrl();
    case "livedemo":
      return liveDemoUrl();
    case "pakete":
      return "/pakete";
    case "team":
      return "/team";
    case "kontakt":
      return "/kontakt";
    case "intern":
      return cta.href?.trim() || "/";
    default:
      return FALLBACK;
  }
}
