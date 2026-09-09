/**
 * Google Consent Mode v2 (Briefing 0033, Masterplan 5.4; Vorgabe aus
 * `docs/05-consent-dsgvo.md` und `docs/09-tracking-plan.md`).
 *
 * Zwei Teile:
 *  1. `CONSENT_DEFAULT_SNIPPET` – steht als Inline-Script **vor allem anderen** im
 *     `<head>` (`app/layout.tsx`). Es setzt alle vier Signale auf `denied` und legt
 *     `dataLayer` und `gtag` an. Das Script kontaktiert **niemanden**: Es schreibt
 *     nur in ein Array im Browser. Ohne es dürfte ein später geladener Google-Tag
 *     davon ausgehen, dass eingewilligt wurde – deshalb muss es zuerst dastehen.
 *  2. `updateConsentMode()` – schaltet nach einer Entscheidung auf `granted` bzw.
 *     zurück auf `denied` (Widerruf).
 *
 * **Kein „Advanced Consent Mode".** Ohne Einwilligung werden auch keine cookielosen
 * Pings gesendet; GTM wird gar nicht erst geladen (`components/site/Analytics.tsx`).
 * In Deutschland ist der Advanced Mode umstritten – docs/05 bleibt konservativ.
 */

/** `wait_for_update` in ms – so lange wartet ein Google-Tag auf die Entscheidung. */
const WAIT_FOR_UPDATE = 500;

/**
 * Inline-Script für den `<head>`. Bewusst als String und ohne Zeilenumbrüche in der
 * Ausgabe: Es wird über `dangerouslySetInnerHTML` gesetzt und soll klein bleiben.
 * `function gtag()` ist eine klassische Funktionsdeklaration – dadurch liegt sie als
 * `window.gtag` vor und ist von `updateConsentMode()` aus erreichbar.
 */
export const CONSENT_DEFAULT_SNIPPET =
  "window.dataLayer=window.dataLayer||[];" +
  "function gtag(){window.dataLayer.push(arguments)}" +
  "gtag('consent','default',{" +
  "ad_storage:'denied'," +
  "ad_user_data:'denied'," +
  "ad_personalization:'denied'," +
  "analytics_storage:'denied'," +
  `wait_for_update:${WAIT_FOR_UPDATE}` +
  "});";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Überträgt die Entscheidung in den Consent Mode. Wird bei jeder Änderung und beim
 * Seitenaufruf mit gespeicherter Auswahl gerufen – auch mit `false`, damit ein
 * Widerruf den Status nachweislich auf `denied` zurücksetzt.
 */
export function updateConsentMode(granted: boolean): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const wert = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: wert,
    ad_user_data: wert,
    ad_personalization: wert,
    analytics_storage: wert,
  });
}
