# 0034 · Metadata, OG-Bilder, Sitemap, strukturierte Daten

Masterplan-Schritte: 6.1 · 6.2 · 6.3 · 6.4 · Branch: `feat/seo` · Phase: 6

## Kontext und Lesereihenfolge

Die Seiten stehen, die Inhalte stimmen – aber die Website sagt Suchmaschinen und geteilten
Links noch zu wenig über sich. Dieser Schritt schließt das: Titel und Beschreibungen je
Route, ein OG-Bild im Design, Sitemap und robots, strukturierte Daten.

Zwei Punkte der Phase gehören **nicht** hierher: **6.5 Weiterleitungen** wartet auf die
URL-Liste der alten golfnext.de, **6.6 Performance** ist Messarbeit und wird einzeln
angegangen.

1. `CLAUDE.md`
2. `docs/07-seo.md` – die verbindliche Fassung für alle vier Punkte
3. `config/site-structure.ts` – **eine Wahrheit** für Pfade, Status, Titel, Beschreibung,
   `noindex`; die Metadata jeder Route zieht von hier
4. `docs/09-tracking-plan.md` – `/danke` bleibt `noindex`
5. `docs/legal/impressum.md` – Anschrift für `Organization`
6. `lib/sanity/queries.ts` – `SITE_SETTINGS_QUERY` (Telefon, E-Mail) und die Artikel-Query

## Harte Vorgaben

- **Nichts erfinden.** Keine Bewertungen, keine `aggregateRating`, keine Preisangaben in
  JSON-LD, keine Kundenzahlen. `Organization` enthält nur, was belegt in `docs/legal/` oder
  in den Sanity-Einstellungen steht.
- **`config/site-structure.ts` bleibt die einzige Wahrheit.** Titel und Beschreibungen
  stehen dort, nicht in den Seiten. Eine Route ohne Angabe bekommt keine erfundene – sie
  fällt auf und wird gemeldet.
- **Nur `live`-Routen in die Sitemap.** `system`- und `noindex`-Routen (`/studio`,
  `/danke`, `/_bausteine`) sind ausgeschlossen, ebenso alles unter `/api`.
- **Genau eine `<h1>` je Seite** bleibt bestehen; JSON-LD ändert daran nichts.
- **Keine externe Schrift, kein externer Dienst** – auch nicht für die OG-Bilder. Archivo
  wird lokal als Datei geladen, nichts von `fonts.googleapis.com`.
- **`FAQPage` nur aus den echten Sanity-FAQs** zum Thema `pakete`. Gibt es keine, entfällt
  das Markup – wie der sichtbare Abschnitt auch.
- **Kein Layoutsprung und kein zusätzliches Client-Bundle**: JSON-LD ist ein
  `<script type="application/ld+json">` im Server-HTML, keine Bibliothek.

## Aufgaben

1. **Titel und Beschreibungen** (6.1): Die sechs Routen ohne Angabe bekommen die unten
   unter „Freigegebene Angaben" stehenden Werte – wortgleich – in
   `config/site-structure.ts`. Alle übrigen Routen behalten ihre bestehenden Werte.
2. **Metadata je Route** (6.1): `metadataBase` aus `NEXT_PUBLIC_SITE_URL`, kanonische URL
   je Route, `lang="de"`, `openGraph` und `twitter` aus denselben Feldern. Wo eine Route
   heute ihre Metadata anders zusammenbaut, wird sie auf den gemeinsamen Weg gezogen –
   ohne die Texte zu ändern.
3. **OG-Bilder** (6.2): `app/opengraph-image.tsx` mit `next/og`: 1200×630, Navy-Fläche wie
   im Hero, Wortmarke oben links, Seitentitel in Archivo 800 weiß, unten die Domain.
   Für Praxis-Artikel eine eigene Fassung mit Artikeltitel und Rubrik. Archivo als lokale
   Schriftdatei laden.
4. **Sitemap und robots** (6.3): `app/sitemap.ts` mit allen `live`-Routen plus den
   Sanity-Artikeln und -Rubriken (`lastModified` aus `_updatedAt`); `app/robots.ts` mit
   `Disallow: /studio, /api, /_bausteine` und der Sitemap-URL. Preview-Deployments dürfen
   nicht indexiert werden (`X-Robots-Tag: noindex, nofollow`, wenn `VERCEL_ENV` nicht
   `production` ist).
5. **Strukturierte Daten** (6.4): `Organization` global (Name, URL, Logo, Gründer Fred
   Hoffmann, Anschrift aus dem Impressum, Telefon und E-Mail aus den Sanity-Einstellungen);
   `FAQPage` auf `/pakete` aus den Sanity-FAQs; `Article` auf Praxis-Artikeln (headline,
   datePublished, author, image, publisher); `BreadcrumbList` auf Unterseiten.
6. **Prüfung**: `seo-auditor` über alle Routen. Playwright: jede `live`-Route hat genau
   einen Canonical, genau eine `<h1>`, Titel und Beschreibung sind nicht leer; die Sitemap
   enthält keine `noindex`-Route; das JSON-LD ist gültiges JSON und liegt im Server-HTML.
7. **Doku**: `docs/07-seo.md` auf den gebauten Stand, Eintrag in `docs/entscheidungen.md`,
   Masterplan 6.1–6.4 abhaken. 6.5 und 6.6 bleiben offen und werden dort nicht angefasst.

## Freigegebene Angaben (Stefan, 09.09.2026)

Abgeleitet aus den bereits freigegebenen Überschriften und Vorspann-Texten der Seiten,
wortgleich zu übernehmen:

| Route | `title` | `description` |
|---|---|---|
| `/` | GolfNext \| Mehr Golfer auf dem Platz. Weniger Arbeit im Clubbüro. | Die Plattform für Golfclubs: Website, Kampagnen, Marketing-CRM und die Werkzeuge fürs Clubbüro – als ein System statt vieler Einzellösungen. |
| `/plattform` | Die GolfNext-Plattform für Golfclubs | Ihre Website ist ein Schaufenster. Wir machen ein System daraus: neue Golfer finden, aus Interessenten Mitglieder machen, dem Clubbüro Routine abnehmen. |
| `/plattform/so-arbeitet-golfnext` | So arbeitet GolfNext \| Vom Klick bis zum Mitglied | Nach der Anmeldung hört Ihr Club nicht auf zu reden: Bestätigung, Vorbereitung, Erinnerung, Nachfassen – vier Nachrichten, automatisch zur richtigen Zeit. |
| `/wachstum-vertrieb` | Wachstum und Vertrieb für Golfclubs | Neue Golfer finden Ihren Club, bevor sie den Nachbarclub finden: Anzeigen bei Instagram, Facebook und Google, eine Seite je Angebot, danach die richtige Nachricht. |
| `/clubprozesse` | Clubprozesse \| Mehr Clubleben, weniger Arbeit im Clubbüro | Greenfee-Anfragen, Platzstatus, Gastfee, Turnierbericht, Mannschaftsergebnis: fünf Dinge, die heute Zeit kosten – und künftig von selbst laufen. |
| `/kontakt` | Kontakt zu GolfNext | Schreiben Sie uns – es antwortet ein Mensch. Ihre Nachricht landet direkt bei Fred Hoffmann, nicht in einem Ticketsystem. |

## Skills und Subagents

- Skills: `golfnext-qa`, `sanity-content-model` (für Artikel- und FAQ-Daten)
- Subagents nach dem Bauen: `seo-auditor`, `qa-runner`, `design-system-guard` (nur für die
  OG-Bilder), danach `pr-reviewer`

## PR und Merge

Branch `feat/seo`, PR nach `.github/pull_request_template.md`, CI grün, `pr-reviewer`.
Merge macht der Orga-Chat, sobald die CI grün ist.

## Akzeptanzkriterien

- [ ] Jede `live`-Route hat Titel, Beschreibung und genau einen Canonical; keine Route
      trägt eine erfundene Angabe.
- [ ] Die sechs oben genannten Routen tragen exakt die freigegebenen Werte.
- [ ] `app/opengraph-image.tsx` liefert ein Bild im Design; Praxis-Artikel bekommen
      Artikeltitel und Rubrik. Keine externe Schriftquelle.
- [ ] `app/sitemap.ts` enthält alle `live`-Routen plus Sanity-Inhalte, keine `noindex`- und
      keine `system`-Route; `app/robots.ts` sperrt `/studio`, `/api`, `/_bausteine`.
- [ ] Preview-Deployments antworten mit `X-Robots-Tag: noindex, nofollow`.
- [ ] `Organization`, `FAQPage` (nur bei vorhandenen FAQs), `Article` und `BreadcrumbList`
      liegen als gültiges JSON-LD im Server-HTML.
- [ ] `seo-auditor` ohne FAIL.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e` grün.
- [ ] Doku und Masterplan-Haken (6.1–6.4) nachgezogen.

## Was du NICHT tust

- Weiterleitungen eintragen (6.5 wartet auf die URL-Liste der alten Website).
- An der Performance schrauben (6.6 ist ein eigener Schritt).
- Titel oder Beschreibungen erfinden, die oben nicht stehen.
- Bewertungen, Preise, Kundenzahlen oder Öffnungszeiten ins JSON-LD schreiben.
- Eine JSON-LD-Bibliothek oder ein zusätzliches Client-Bundle einführen.
- Sichtbaren Seitentext ändern.

## Offene Fragen an Stefan/Fred

- Keine. Stefan entscheidet alles; Fred wird nicht gefragt.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0034-seo-grundlagen.md. Setze es vollständig
um. Es deckt die Masterplan-Schritte 6.1, 6.2, 6.3 und 6.4 ab – NICHT 6.5 (Weiterleitungen,
wartet auf die URL-Liste) und NICHT 6.6 (Performance, eigener Schritt).

Gebaut wird: Titel und Beschreibungen je Route, Metadata mit metadataBase und Canonical,
dynamische OG-Bilder im Design, Sitemap und robots, strukturierte Daten.

Besonders wichtig:
- config/site-structure.ts bleibt die einzige Wahrheit für Pfad, Status, Titel,
  Beschreibung und noindex. Die Metadata der Seiten zieht von dort.
- Die sechs Routen ohne Angabe (/, /plattform, /plattform/so-arbeitet-golfnext,
  /wachstum-vertrieb, /clubprozesse, /kontakt) bekommen exakt die im Briefing unter
  „Freigegebene Angaben" stehenden Werte – wortgleich, nichts umformulieren.
- Nichts erfinden: keine Bewertungen, keine aggregateRating, keine Preise oder
  Kundenzahlen im JSON-LD. Organization nur aus docs/legal/impressum.md und den
  Sanity-Einstellungen.
- Nur live-Routen in die Sitemap; /studio, /danke, /_bausteine und /api bleiben draußen.
  Preview-Deployments antworten mit X-Robots-Tag: noindex, nofollow.
- FAQPage nur aus den echten Sanity-FAQs zu topic „pakete" – keine FAQs, kein Markup.
- Keine externe Schriftquelle, auch nicht für die OG-Bilder: Archivo lokal laden.
- JSON-LD ist ein Script-Tag im Server-HTML, keine Bibliothek, kein Client-Bundle.
- Sichtbaren Seitentext nicht ändern.

Baue über die Skills golfnext-qa und sanity-content-model, rufe danach seo-auditor,
qa-runner und design-system-guard (nur für die OG-Bilder) auf und behebe deren FAILs.

Tempo: während der Iteration nur die betroffene Spec laufen lassen
(pnpm exec playwright test e2e/<name>), die Vollsuite genau einmal am Ende.
Nicht auf die CI warten – Stand melden, sobald lokal alles grün ist.

Branch feat/seo, PR nach .github/pull_request_template.md, CI grün, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
