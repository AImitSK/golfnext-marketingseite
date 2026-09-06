# Seiten, Routen, Assets

Status pflegen, wenn eine Seite gebaut ist. Spalte „Bilder offen" listet die `Shot`-Platzhalter, die Fred mit echten Screenshots füllen muss.

| Route | Quelle | Status | Bilder offen (Fred) |
|---|---|---|---|
| `/` | 3.1b (Neufassung v01) | **live** (2.2) · Rebuild aus 3.1b geplant | Foto Fred (Zitat/Abschluss) als Platzhalter; **kein Modulstatus** |
| `/plattform` | 3.2c (Neufassung v02) | **live** (2.3) | keine – die Oberflächen (Browser-Demo, Marketing-CRM-Liste, Concierge-Chat, Geräterahmen der Scroll-Geschichte) sind bewusst **schematische Illustrationen** (kein `Shot`, kein echter Screenshot, kein Foto nötig) |
| `/plattform/so-arbeitet-golfnext` | 3.3 | offen | Marketing-CRM-Board, E-Mail-Sequenz, Landingpage, Ratgeberartikel – Screenshots ohne personenbezogene Daten |
| `/wachstum-vertrieb` | 3.4b (Neufassung v01) | **live** (2.5) | keine – die Oberflächen (Kampagnen-Cockpit, Instagram-Anzeige, Such-/Feed-/Zeitleisten-Visuals, Geräterahmen der Kampagnen-Geschichte, Landingpage-Fächer) sind bewusst **schematische Illustrationen** (kein `Shot`, kein echter Screenshot, kein Foto nötig) |
| `/clubprozesse` | 3.5b (Neufassung v01) | **live** (2.6) | keine – die Oberflächen (Clubwebsite mit Platzstatus + News, Sonntags-Log, Concierge-Chat, Platzstatus-Toggle, Gastfee-Zahlung, Bericht-Strecke, Captains-App-Demo) sind bewusst **schematische Illustrationen** (kein `Shot`, kein echter Screenshot, kein Foto nötig); **kein Modulstatus** (Badges/Legende/„Stand je Modul"-Zeile weggelassen), Praxis-Zeile „68 % Rehburg-Loccum" bleibt |
| `/pakete` | 3.7 | **live** (2.1) | – (Fassung 2 hat keine Screenshots) |
| `/ueber-golfnext` | 3.8b (Neufassung v01) | offen | Porträts Fred und Stefan, Partnerlogos mit Freigabe; **Modulstatus-Inhalte nicht übernehmen** |
| `/ratgeber`, `/ratgeber/[slug]`, `/ratgeber/rubrik/[slug]` | Sanity | offen | Artikelbilder aus Sanity |
| `/impressum`, `/datenschutz` | docs/legal | offen | – |
| `/praxis`, `/praxis/[slug]` | 3.9a (Übersicht) + 3.9b (Artikel), Neufassung v01 | offen | Artikelbilder/Porträts als Platzhalter; **kein Modulstatus** |
| `/team`, `/kontakt`, `/module/[slug]` | kein Briefing | Platzhalter (noindex) | – |
| `/studio` | Sanity Studio | offen | – |

## Weiterleitungen (bestehende golfnext.de)

Bekannt: `/impressum/` → `/impressum`. Vollständige URL-Liste der alten Website erheben (Crawl oder Search Console) **[S]** und hier ergänzen.

## CTA-Ziele (aus `.env`)

- Online-Erstgespräch → `NEXT_PUBLIC_BOOKING_URL` (bestehender Buchungsweg **[F]**)
- Live-Demo → `NEXT_PUBLIC_LIVE_DEMO_URL` **[F]**
- Teamseite → `/team` (nach Briefing)
- Pakete vergleichen → `/pakete#vergleich`
