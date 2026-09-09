/**
 * Der Einwilligungsstand als winziger Speicher im Browser (Briefing 0033).
 *
 * Warum überhaupt: `components/site/Analytics.tsx` muss auf eine Änderung reagieren
 * (Scripts einbinden bzw. nichts mehr nachladen), und `lib/tracking/events.ts` muss
 * bei jedem Ereignis wissen, ob es überhaupt etwas senden darf. Beide sollen dafür
 * **nicht** selbst in vanilla-cookieconsent greifen: Der Dialog wird an genau einer
 * Stelle gestartet (`ConsentBanner`), und nur diese Stelle schreibt hier hinein.
 *
 * Vorgabewert ist `false`. Das ist der sichere Zustand und gilt auf dem Server, beim
 * ersten Rendern im Browser und für jeden Aufruf, der geschieht, bevor der Dialog
 * gelaufen ist. Ohne Einwilligung ist ein Ereignis wirkungslos, nicht fehlerhaft
 * (docs/09: Ereignisse vor der Einwilligung werden nicht gepuffert – das ist gewollt).
 */

type Listener = () => void;

let marketing = false;
const listeners = new Set<Listener>();

/** Nur `ConsentBanner` ruft das auf – aus `onConsent` und `onChange`. */
export function setMarketingConsent(next: boolean): void {
  if (next === marketing) return;
  marketing = next;
  for (const listener of listeners) listener();
}

/** „Statistik und Marketing" ist erteilt. */
export function getMarketingConsent(): boolean {
  return marketing;
}

/**
 * Serverseitiger Wert für `useSyncExternalStore`. Auf dem Server gibt es keine
 * Einwilligung – das gerenderte HTML enthält deshalb nie ein Tracking-Script.
 */
export function getMarketingConsentServer(): boolean {
  return false;
}

export function subscribeMarketingConsent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/* ── Zweites Signal: „der Besucher hat gerade gespeichert" ───────────────────
   Nur für den einen Toast der Website (docs/08 §3, `CookieToast`). Es feuert bei
   einer aktiven Entscheidung – erste Auswahl und jede spätere Änderung –, NICHT
   beim Seitenaufruf mit bereits gespeicherter Auswahl. Sonst stünde die
   Bestätigung auf jeder Seite erneut da. */

const savedListeners = new Set<Listener>();

/** Nur `ConsentBanner` ruft das auf. */
export function notifyConsentSaved(): void {
  for (const listener of savedListeners) listener();
}

export function subscribeConsentSaved(listener: Listener): () => void {
  savedListeners.add(listener);
  return () => {
    savedListeners.delete(listener);
  };
}
