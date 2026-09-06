# Seiten, Routen, Assets

Status pflegen, wenn eine Seite gebaut ist. Spalte „Bilder offen" listet die `Shot`-Platzhalter, die Fred mit echten Screenshots füllen muss.

| Route | Quelle | Status | Bilder offen (Fred) |
|---|---|---|---|
| `/` | 3.1 + Preislogik Fassung 2 | **live** (2.2) | Foto Fred (Zitat, Abschluss); Foto Golfclub Bad Wörishofen (Praxis) |
| `/plattform` | 3.2 | offen | Foto Fred |
| `/plattform/so-arbeitet-golfnext` | 3.3 | offen | Marketing-CRM-Board, E-Mail-Sequenz, Landingpage, Ratgeberartikel – Screenshots ohne personenbezogene Daten |
| `/wachstum-vertrieb` | 3.4 | offen | 15 Screenshots (Clubwebsite, Landingpages je Zielgruppe, Marketing-CRM, Analytics, Firmen-Event-Anfrage …) |
| `/clubprozesse` | 3.5 | offen | Concierge-Dialog, Platzstatus (mobil/Website), Gastfee mit Zahlung, Firmen-Event-Anfrage, Turnier-News (PDF-Upload, erkannte Ergebnisse, Rahmenbedingungen, Tonalität, Bildauswahl, Websitevorschau, Facebook-/Instagram-Beitrag), Captains App (Auswahl bis Veröffentlichung), Mannschaftsbeitrag auf der Website |
| `/pakete` | 3.7 | **live** (2.1) | – (Fassung 2 hat keine Screenshots) |
| `/ueber-golfnext` | 3.8 | offen | Porträts Fred und Stefan, Partnerlogos mit Freigabe |
| `/ratgeber`, `/ratgeber/[slug]`, `/ratgeber/rubrik/[slug]` | Sanity | offen | Artikelbilder aus Sanity |
| `/impressum`, `/datenschutz` | docs/legal | offen | – |
| `/praxis`, `/team`, `/kontakt`, `/module/[slug]` | kein Briefing | Platzhalter (noindex) | – |
| `/studio` | Sanity Studio | offen | – |

## Weiterleitungen (bestehende golfnext.de)

Bekannt: `/impressum/` → `/impressum`. Vollständige URL-Liste der alten Website erheben (Crawl oder Search Console) **[S]** und hier ergänzen.

## CTA-Ziele (aus `.env`)

- Online-Erstgespräch → `NEXT_PUBLIC_BOOKING_URL` (bestehender Buchungsweg **[F]**)
- Live-Demo → `NEXT_PUBLIC_LIVE_DEMO_URL` **[F]**
- Teamseite → `/team` (nach Briefing)
- Pakete vergleichen → `/pakete#vergleich`
