"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "./consent.css";
import { consentConfig, KATEGORIE_MARKETING } from "@/lib/consent/config";
import { updateConsentMode } from "@/lib/consent/consent-mode";
import { notifyConsentSaved, setMarketingConsent } from "@/lib/consent/state";

/**
 * Startet den Einwilligungs-Dialog (Briefing 0033, Masterplan 5.3).
 *
 * **Rendert nichts Sichtbares.** Die Oberfläche baut vanilla-cookieconsent selbst
 * und hängt sie als `#cc-main` an den `<body>`; gestaltet wird sie über
 * `./consent.css`. Der Baustein ist damit reine Mechanik – und der einzige Ort, an
 * dem die Bibliothek gestartet wird.
 *
 * Drei Wirkungen hat eine Entscheidung:
 *  1. `setMarketingConsent()` – daraus lesen `components/site/Analytics.tsx`
 *     (Scripts einbinden oder eben nicht) und `lib/tracking/events.ts`.
 *  2. `updateConsentMode()` – Google Consent Mode v2 von `denied` auf `granted`
 *     und beim Widerruf zurück auf `denied`.
 *  3. `notifyConsentSaved()` – der eine Toast der Website (docs/08 §3).
 *
 * `onConsent` läuft bei jedem Seitenaufruf mit gespeicherter Auswahl und bei der
 * ersten Entscheidung; `onChange` bei jeder späteren Änderung. Beide Wege setzen
 * denselben Zustand – der Widerruf ist deshalb kein Sonderfall.
 *
 * **Ohne JavaScript** läuft nichts davon: kein Dialog, keine Kategorie erteilt,
 * kein Script nachgeladen. Das ist der sichere Zustand, und die Seite bleibt
 * vollständig lesbar (Server-HTML).
 *
 * `/studio` bleibt außen vor: Das Sanity-Studio ist eine Systemroute (`status:
 * "system"`, noindex, unverlinkt) mit eigener Oberfläche, es lädt kein
 * Tracking-Script und braucht deshalb keine Einwilligung.
 */
export function ConsentBanner() {
  const pathname = usePathname();
  const imStudio = pathname?.startsWith("/studio") ?? false;

  useEffect(() => {
    if (imStudio) return;

    const uebernehmen = () => {
      const erlaubt = CookieConsent.acceptedCategory(KATEGORIE_MARKETING);
      setMarketingConsent(erlaubt);
      updateConsentMode(erlaubt);
    };

    void CookieConsent.run({
      ...consentConfig,
      onConsent: uebernehmen,
      onChange: () => {
        uebernehmen();
        notifyConsentSaved();
      },
      onFirstConsent: () => {
        notifyConsentSaved();
      },
    });
  }, [imStudio]);

  return null;
}

/**
 * Öffnet die Einstellungen erneut – der Weg des Footer-Buttons
 * „Cookie-Einstellungen" (`CookieSettingsButton`).
 */
export function oeffneCookieEinstellungen(): void {
  CookieConsent.showPreferences();
}
