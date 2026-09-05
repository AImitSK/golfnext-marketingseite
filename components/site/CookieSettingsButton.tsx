"use client";

/**
 * Platzhalter für „Cookie-Einstellungen" in der Bodenleiste. Öffnet in Phase 5.3
 * den Consent-Dialog (vanilla-cookieconsent, Google Consent Mode v2). Bis dahin
 * bewusst ohne Aktion – ein echtes <button> statt eines toten Links.
 * Kleiner Client-Baustein, damit der übrige Footer Server-Komponente bleibt.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        // TODO(5.3): Consent-Dialog öffnen (Cookie-Einstellungen erneut anzeigen).
      }}
    >
      Cookie-Einstellungen
    </button>
  );
}
