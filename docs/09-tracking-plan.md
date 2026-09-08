# Tracking-Plan

Was gemessen wird, wie es heißt und wann es feuern darf. Ohne diesen Plan baut niemand Tracking „nach Gefühl".
Technik und Einwilligung: `05-consent-dsgvo.md`. Alles hier feuert **nur** nach Einwilligung in „Statistik und Marketing" –
außer Vercel Web Analytics (cookielos, Seitenaufrufe, immer).

## Ziel

Reach verkauft Kampagnen mit Meta und Google. Die eigene Website muss zeigen, dass die Kette funktioniert: Anzeige → Seite →
Anfrage. Dafür braucht es wenige, saubere Ereignisse, die in Google Ads und Meta als Conversion nutzbar sind.

## Ereignisse (`dataLayer.push` / GTM, Namen in snake_case)

| Ereignis | Wann | Parameter | Conversion? |
|---|---|---|---|
| `cta_erstgespraech_click` | Klick auf „Online-Erstgespräch vereinbaren" (Header, Sektionen, Footer) | `position` (header · hero · footer · pakete · …), `page` | ja (Micro) |
| `contact_submitted` | Formular erfolgreich gesendet (Server-Antwort ok) | `form` (kontakt), `interesse` (Auswahl, keine Freitexte) | **ja (Haupt)** |
| `paket_details_open` | Leistungsliste in einer Paketkarte aufgeklappt | `paket` (wachstum · komplett · individuell) | nein |
| `paket_vergleich_view` | Vergleichstabelle im Viewport | – | nein |
| `faq_open` | FAQ-Frage geöffnet | `question_id`, `page` | nein |
| `ratgeber_read` | Artikel zu 75 % gescrollt | `slug`, `rubrik` | nein |
| `outbound_click` | Klick auf externe Links (Buchungstool, Social) | `href_domain` | nein |

> **Gestrichen am 08.09.2026 (Masterplan 2.11):** das Ereignis `cta_livedemo_click`. Die Live-Demo
> entfällt ersatzlos; es gibt nur noch das Online-Erstgespräch als CTA-Ziel.

Keine personenbezogenen Daten in Parametern (kein Name, keine E-Mail, kein Freitext, keine Club-Namen).

## Conversion-Definition

- **Hauptconversion:** `contact_submitted`. Zusätzlich löst der Erfolgszustand einen Aufruf von `/danke?quelle=kontakt` aus (noindex),
  damit Google Ads und Meta eine **URL-basierte Conversion** haben – robuster als reine Events, und die Seite trägt den Erfolgsalert plus
  Buchungslink. Entscheidung: Inline-Erfolg (`docs/08`) **und** anschließender `router.replace('/danke')` nur bei erteilter Einwilligung;
  ohne Einwilligung bleibt es beim Inline-Erfolg (kein Tracking, keine Weiterleitung nötig).
- **Micro-Conversion:** `cta_erstgespraech_click` (Absprung ins externe Buchungstool ist dort nicht mehr messbar; deshalb den Klick zählen).
  Sobald der Buchungsanbieter bekannt ist **[F]**: prüfen, ob er eine Bestätigungsseite mit eigener URL hat, auf die ein Tag gelegt werden kann.

## Google Consent Mode v2

Default alles `denied`. Nach Einwilligung `update` auf `granted`. GTM lädt erst dann. Kein „Advanced Mode" (cookielose Pings ohne Einwilligung).
Ereignisse werden vor Einwilligung **nicht** gepuffert – was vor dem Klick auf „Alle akzeptieren" passiert, ist weg. Das ist gewollt.

## Umsetzung

- `lib/tracking/events.ts`: typisierte Funktionen (`trackCtaClick(position)`, `trackContactSubmitted(interesse)` …), die nur pushen, wenn
  `consent.marketing === true` und `NEXT_PUBLIC_GTM_ID` gesetzt ist. Sonst no-op. Kein direkter `window.dataLayer`-Zugriff in Komponenten.
- GTM-Container von Stefan **[S]**: Tags für Google Ads Conversion (`contact_submitted`, `/danke`), GA4 optional, Meta-Pixel (PageView, Lead auf `contact_submitted`).
- Vercel Web Analytics läuft unabhängig; Custom Events dort nicht nötig.

## Prüfung

- Playwright: vor Einwilligung kein `dataLayer`-Eintrag außer `consent default`, kein Request an Google/Meta; nach „Nur notwendige" ebenso;
  nach „Alle akzeptieren" GTM geladen und `cta_erstgespraech_click` bei Klick vorhanden.
- GTM-Preview-Modus vor Launch mit Stefan.
