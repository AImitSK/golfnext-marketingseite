# Einwilligung und Datenschutz in der Technik

## Braucht die Seite ein Consent-Tool? Ja – sobald Tracking dazukommt.

Rechtsgrundlage in Deutschland: § 25 TDDDG (früher § 25 TTDSG) verlangt eine **Einwilligung vor dem Speichern
oder Auslesen von Informationen auf dem Endgerät**, sofern es nicht technisch unbedingt erforderlich ist. Dazu
kommt Art. 6 DSGVO für die anschließende Verarbeitung. Konkret für diese Website:

| Dienst | Consent nötig? | Grund |
|---|---|---|
| Vercel Hosting, Server-Logs | nein | erforderlich für den Betrieb (Art. 6 Abs. 1 f) |
| Vercel Web Analytics | nein | cookielos, keine geräteübergreifende Kennung; in der Datenschutzerklärung nennen |
| Sanity CDN (Bilder, Inhalte) | nein | erforderlich, keine Cookies |
| Fonts | nein – **weil self-hosted** | Laden von fonts.googleapis.com wäre ohne Einwilligung unzulässig (LG München I, 3 O 17493/20) |
| Consent-Tool selbst (speichert die Auswahl) | nein | technisch erforderlich, im Tool erklärt |
| Kontaktformular | nein (Vertragsanbahnung, Art. 6 Abs. 1 b) | aber Hinweis am Formular, Datenschutzerklärung |
| **Google Tag Manager / Google Ads Conversion / GA4** | **ja** | Cookies, Profiling |
| **Meta Pixel** | **ja** | Cookies, Datentransfer an Meta |
| YouTube/Vimeo-Embeds | ja, oder Zwei-Klick-Lösung mit Vorschaubild | Embeds setzen Cookies/laden Dritt-Scripts. **Aktuell gibt es kein Embed** – die Live-Demo ist mit Masterplan 2.11 ersatzlos entfallen (08.09.2026). Die Zeile bleibt als Regel für den Fall stehen, dass später ein Video dazukommt. |
| Buchungstool für das Erstgespräch (extern verlinkt) | nein, wenn nur verlinkt; ja, wenn eingebettet | Embed lädt Dritt-Script |

Da GolfNext selbst Reach (Meta + Google Ads) verkauft, wird die eigene Website mit hoher Wahrscheinlichkeit
Conversion-Tracking einsetzen. **Deshalb: Consent-Tool von Anfang an einplanen**, auch wenn zum Launch noch keine
Tracking-IDs gesetzt sind. Ohne IDs in `.env` lädt nichts, der Dialog erscheint trotzdem nur, wenn es mindestens
eine einwilligungspflichtige Kategorie gibt – also gesteuert über eine Konstante `TRACKING_ENABLED`.

## Empfehlung: schlankes Open-Source-Tool statt bezahlter CMP

**`vanilla-cookieconsent` v3** (MIT, orestbida), eingebunden als React-Wrapper:

- keine Fremd-Requests, kein eigenes Tracking, alles first-party
- vollständig im Design anpassbar (Navy/Paper, 4 px Radius, Archivo/Inter)
- Kategorien: `necessary` (immer an, nicht abwählbar), `analytics`, `marketing`
- Buttons gleichwertig: „Alle akzeptieren" · „Nur notwendige" · „Einstellungen" – **kein** Dark Pattern (Ablehnen so leicht wie Zustimmen; das ist Vorgabe der Datenschutzkonferenz und Rechtsprechung)
- Consent-Protokoll: Tool speichert Datum, Version der Datenschutzerklärung (`revision`), Auswahl in einem First-Party-Cookie `cc_cookie` (Laufzeit 6 Monate → dann erneut fragen)
- Footer-Link „Cookie-Einstellungen" öffnet den Dialog erneut (`CookieConsent.showPreferences()`)
- Bei Änderung der Datenschutzerklärung `revision` erhöhen → erneute Abfrage

**Google Consent Mode v2** (Pflicht für Google Ads in der EU seit März 2024):
```js
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', wait_for_update: 500
});
// nach Einwilligung:
gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
```
GTM wird erst nach `granted` in `marketing` geladen (kein „Advanced Consent Mode" mit cookielosen Pings ohne Einwilligung – das ist in Deutschland umstritten; konservativ bleiben).

**Wann eine bezahlte, zertifizierte CMP (Cookiebot, Usercentrics) nötig wird:** wenn IAB-TCF-Signale verlangt werden (Google Ad Manager/AdSense, programmatic) oder Fred eine juristisch abgesicherte Anbieterlösung mit Hosting-Vertrag will. Für eine B2B-Marketingseite mit eigenem Conversion-Tracking reicht die schlanke Lösung.

## Technische Umsetzung (Masterplan Phase 5)

1. `components/site/ConsentBanner.tsx` (Client): initialisiert `vanilla-cookieconsent` mit deutscher Konfiguration aus `lib/consent/config.ts`; rendert nichts Sichtbares selbst.
2. `components/site/Analytics.tsx`: liest Consent-Status, lädt GTM (`next/script`, `strategy="afterInteractive"`) nur bei `marketing`-Einwilligung und gesetzter `NEXT_PUBLIC_GTM_ID`; Meta-Pixel analog.
3. `gtag('consent','default')` als Inline-Script im `<head>` vor allem anderen.
4. Vercel Analytics (`@vercel/analytics`) immer geladen, in der Datenschutzerklärung als cookielose Reichweitenmessung genannt.
5. Embeds: eigene `<VideoEmbed />`-Komponente mit Vorschaubild und Zwei-Klick („Video laden – dabei werden Daten an YouTube übertragen"), oder per Consent-Kategorie `marketing` freischalten.
6. Texte im Dialog: kurz, deutsch, Link auf `/datenschutz` und `/impressum`. Kategorienbeschreibungen aus `docs/legal/datenschutz.md` Abschnitt „Cookies und Einwilligung".
7. Test (Playwright): vor Interaktion und nach „Nur notwendige" kein Request an `google*`, `facebook*`, `doubleclick*`, `googletagmanager*`; nach „Alle akzeptieren" ja. Kein Request an `fonts.g*`.

## Weitere Datenschutz-Pflichten in der Technik

- **Server-Logs:** Vercel speichert Request-Logs kurzzeitig; IP-Adressen nicht zusätzlich selbst loggen.
- **Formulare:** nur notwendige Felder, TLS, Honeypot statt reCAPTCHA (reCAPTCHA wäre einwilligungspflichtig und umstritten), keine Weitergabe außer an SendGrid (AV-Vertrag = Twilio DPA, in SendGrid akzeptieren **[S]**).
- **Auftragsverarbeitung:** DPAs abschließen/prüfen für Vercel, Sanity, SendGrid (Twilio); Drittlandtransfer USA über EU-US Data Privacy Framework (Vercel und Twilio sind zertifiziert – Stand prüfen **[S]**) bzw. Standardvertragsklauseln.
- **Verzeichnis von Verarbeitungstätigkeiten** für GolfNext ergänzen (Website, Formular, Tracking).
- **Betroffenenrechte:** Kontaktweg in der Datenschutzerklärung; Löschkonzept: Formularmails nach Erledigung, spätestens nach 12 Monaten löschen (Frist festlegen **[F]**).
- **Kein** Google Maps, keine Social-Plugins, keine externen Schriften, keine CDNs für JS-Bibliotheken.
