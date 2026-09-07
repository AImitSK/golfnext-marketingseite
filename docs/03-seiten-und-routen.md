# Seiten, Routen, Assets

Status pflegen, wenn eine Seite gebaut ist. Spalte „Bilder offen" listet die `Shot`-Platzhalter, die Fred mit echten Screenshots füllen muss.

> **Struktur v2 (Fred/Stefan, 07.09.2026 – Briefing 0023):** `/team`, `/ratgeber` (samt Unterrouten) und
> die zwölf `/module/<slug>` sind ersatzlos gestrichen; sie liefern 404, ohne Weiterleitung (die Seite
> war nie unter `www.golfnext.de` erreichbar). Der Blog heißt `/praxis`; die Adresse `/praxis` bleibt,
> obwohl der Menüpunkt unter „Über GolfNext" gewandert ist. Die zwölf Modulnamen stehen weiterhin in der
> Footer-Systemkarte, dort als Text ohne Link. Navigation siehe `docs/10-launch-umfang.md` § Navigation v2.

| Route | Quelle | Status | Bilder offen (Fred) |
|---|---|---|---|
| `/` | 3.1b (Neufassung v01) | **live** (2.2) · Rebuild aus 3.1b **gebaut** (0021) | Foto Fred (Zitat/Abschluss) als Porträt-Platzhalter; Artikelbilder Praxis („Bild folgt“); die übrigen Oberflächen (Clubwebsite-Demo mit schwebenden Karten, Bento-Visuals, Ein-Weg-Geräte) sind bewusst **schematische Illustrationen** (kein `Shot`, kein Foto nötig); **kein Modulstatus**; „Rehburg-Loccum/Pilotclub“-Wortlaut bleibt |
| `/plattform` | 3.2c (Neufassung v02) | **live** (2.3) | keine – die Oberflächen (Browser-Demo, Marketing-CRM-Liste, Concierge-Chat, Geräterahmen der Scroll-Geschichte) sind bewusst **schematische Illustrationen** (kein `Shot`, kein echter Screenshot, kein Foto nötig) |
| `/plattform/so-arbeitet-golfnext` | 3.3b (Neufassung v01) | **live** (2.4, Briefing 0024) | keine – die Mail-Fenster und Zielgruppen-Strecken sind **schematische Illustrationen** (kein `Shot`, kein Screenshot); Beispiel-Adressen und -Namen illustrativ aus dem Mock, `aria-hidden`. **Kein Modulstatus.** Die frühere 3.3-Anforderung (CRM-Board- und Sequenz-Screenshots) entfällt mit der Neufassung |
| `/wachstum-vertrieb` | 3.4b (Neufassung v01) | **live** (2.5) | keine – die Oberflächen (Kampagnen-Cockpit, Instagram-Anzeige, Such-/Feed-/Zeitleisten-Visuals, Geräterahmen der Kampagnen-Geschichte, Landingpage-Fächer) sind bewusst **schematische Illustrationen** (kein `Shot`, kein echter Screenshot, kein Foto nötig) |
| `/clubprozesse` | 3.5b (Neufassung v01) | **live** (2.6) | keine – die Oberflächen (Clubwebsite mit Platzstatus + News, Sonntags-Log, Concierge-Chat, Platzstatus-Toggle, Gastfee-Zahlung, Bericht-Strecke, Captains-App-Demo) sind bewusst **schematische Illustrationen** (kein `Shot`, kein echter Screenshot, kein Foto nötig); **kein Modulstatus** (Badges/Legende/„Stand je Modul"-Zeile weggelassen), Praxis-Zeile „68 % Rehburg-Loccum" bleibt |
| `/pakete` | 3.7 | **live** (2.1) | – (Fassung 2 hat keine Screenshots) |
| `/ueber-golfnext` | 3.8b (Neufassung v01) | **live** (2.7) | Porträts Fred und Stefan (Hero + „Menschen dahinter“) als beschriftete Platzhalter, Partnerlogos + Freigaben (Club-Kacheln „Logo folgt“), Artikelbilder/-titel im Wissen-Slider („Bild folgt“/„Titel folgt“) – Fred liefert; **kein Modulstatus**: Grundsatz /02 „Wir versprechen nur, was läuft.“ + Status-Aufzählung/-Legende **nicht gebaut** (Überschrift „Zwei Grundsätze“), „Pilotclub“-/Entwicklungspartner-Wortlaut bleibt wortgleich |
| `/impressum`, `/datenschutz` | docs/legal | offen | – |
| `/praxis` (Unterpunkt von `/ueber-golfnext`, Adresse bleibt), `/praxis/[slug]`, `/praxis/thema/[slug]` | 3.9a (Übersicht) + 3.9b (Artikel), Neufassung v01 + Sanity | **Platzhalter (noindex)** (2.8, Briefing 0022) – die neun Artikel der Mocks sind unfreigegebene Beispieltexte; der Blog entsteht in Phase 3 aus Sanity (er ersetzt das entfallene `/ratgeber`) | Artikelbilder/Porträts als Platzhalter; **kein Modulstatus** |
| `/kontakt` | kein Briefing nötig (docs/10 §40) | **Platzhalter (noindex)** (2.8, Briefing 0022) – Zwischenstand; die echte Seite mit dem UI-Kit-Formular entsteht in 4.3. Ziel des CTA-Fallbacks aus `lib/links.ts` | – |
| 404 (jede unbekannte URL) | kein Mock | **gebaut** (2.9, Briefing 0022) – `app/not-found.tsx` mit Header, Footer, Startseite + Erstgespräch; Texte aus `lib/ui/messages.ts` | – |
| Fehlerseiten | kein Mock | **gebaut** (2.9, Briefing 0022) – `app/(site)/error.tsx` (reset()) und `app/global-error.tsx` | – |
| `/studio` | Sanity Studio | offen | – |

## Weiterleitungen (bestehende golfnext.de)

Bekannt: `/impressum/` → `/impressum`. Vollständige URL-Liste der alten Website erheben (Crawl oder Search Console) **[S]** und hier ergänzen.

## CTA-Ziele (aus `.env`)

- Online-Erstgespräch → `NEXT_PUBLIC_BOOKING_URL` (bestehender Buchungsweg **[F]**)
- Live-Demo → `NEXT_PUBLIC_LIVE_DEMO_URL` **[F]**
- Pakete vergleichen → `/pakete#vergleich`
