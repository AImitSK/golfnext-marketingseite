"use client";

import { oeffneCookieEinstellungen } from "./ConsentBanner";

/**
 * „Cookie-Einstellungen" in der Bodenleiste – der Widerrufsweg, den Abschnitt 6 der
 * Datenschutzerklärung zusagt („Link ‚Cookie-Einstellungen‘ im Fußbereich jeder
 * Seite"). Öffnet die Einstellungen des Einwilligungs-Dialogs erneut, mit der schon
 * gespeicherten Auswahl (Briefing 0033, Masterplan 5.3).
 *
 * Ein echtes `<button>`, kein Link: Der Klick öffnet einen Dialog, er wechselt keine
 * Seite. Kleiner Client-Baustein, damit der übrige Footer Server-Komponente bleibt.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={oeffneCookieEinstellungen}>
      Cookie-Einstellungen
    </button>
  );
}
