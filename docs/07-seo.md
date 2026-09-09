# SEO und Auffindbarkeit

Stand 09.09.2026: 6.1 bis 6.4 sind gebaut (Briefing 0034). 6.5 (Weiterleitungen) wartet auf
die URL-Liste der alten golfnext.de, 6.6 (Performance) ist ein eigener Schritt.

## Eine Wahrheit: `config/site-structure.ts`

Pfad, Status, Titel, Beschreibung und `noindex` einer Route stehen dort und **nur** dort.
Jede gebaute Seite ruft `routeMetadata(route)` aus `lib/metadata.ts` und bekommt daraus:

- `title` – der Wert aus site-structure; steht dort `null`, greift das Navigations-`label`.
- `description` – die aus site-structure, wo eine steht. Eine Route ohne Angabe bekommt
  **keine erfundene**; sie erbt die allgemeine Beschreibung der Website aus
  `app/layout.tsx`. Das ist gewollt: Ein leeres `content=""` wäre schlechter als ein wahrer,
  allgemeiner Satz.
- `alternates.canonical` – der eigene Pfad; `metadataBase` steht im Root-Layout und kommt aus
  `NEXT_PUBLIC_SITE_URL` (`lib/site-url.ts`).
- `openGraph` und `twitter` – aus **denselben** Feldern, damit ein geteilter Link nichts
  anderes behauptet als das Suchergebnis. `og:locale = de_DE`, `og:site_name = GolfNext`,
  `twitter:card = summary_large_image`.
- `robots: noindex, nofollow`, sobald die Route `noindex` trägt.

Das frühere zweite Feld `meta` in `content/<seite>.ts` ist entfallen (Briefing 0034).

Die Praxis-Routen holen Titel und Beschreibung aus Sanity und nutzen dafür `inhaltMetadata`
mit denselben Feldern – der Titel bleibt dort **absolut**, also ohne Marken-Suffix: Ein
Artikeltitel darf bis zu 90 Zeichen lang sein, ein angehängtes „ | GolfNext“ würde ihn in der
Suche regelmäßig abschneiden.

## Metadaten je Route

| Route | Title | Description |
|---|---|---|
| `/` | GolfNext \| Mehr Golfer auf dem Platz. Weniger Arbeit im Clubbüro. | freigegeben (Stefan, 09.09.2026) |
| `/plattform` | Die GolfNext-Plattform für Golfclubs | freigegeben (Stefan, 09.09.2026) |
| `/plattform/so-arbeitet-golfnext` | So arbeitet GolfNext \| Vom Klick bis zum Mitglied | freigegeben (Stefan, 09.09.2026) |
| `/wachstum-vertrieb` | Wachstum und Vertrieb für Golfclubs | freigegeben (Stefan, 09.09.2026) |
| `/clubprozesse` | Clubprozesse \| Mehr Clubleben, weniger Arbeit im Clubbüro | freigegeben (Stefan, 09.09.2026) |
| `/pakete` | GolfNext Pakete und Preise für Golfclubs | aus Briefing 0012 |
| `/ueber-golfnext` | Über GolfNext \| Wir hängen am Golf. Nicht am Gestern. | aus Briefing 0019 |
| `/kontakt` | Kontakt zu GolfNext | freigegeben (Stefan, 09.09.2026) |
| `/praxis` | Praxis. Was in Golfclubs wirklich funktioniert. | erster Satz des Hero-Absatzes aus Mock 3.9a |
| `/impressum` | Impressum – GolfNext | **offen** – keine eigene; erbt die Website-Beschreibung **[S]** |
| `/datenschutz` | Datenschutzerklärung – GolfNext | **offen** – keine eigene; erbt die Website-Beschreibung **[S]** |
| `/praxis/thema/*` | Rubriktitel aus Sanity | `category.description` |
| `/praxis/*` | `seo.title`, sonst der Artikeltitel | `seo.description`, sonst der Teaser |

Titel-Suffix „ | GolfNext“ über `title.template` in `app/layout.tsx` – **außer** wo der Titel
die Marke schon trägt; dann steht er absolut (sonst stünde sie zweimal im Tab).

Zwei Routen haben bewusst **keine eigene** Beschreibung: Für `/impressum` und
`/datenschutz` gibt es keine freigegebene, und erfunden wird keine. Sie erben die allgemeine
Beschreibung der Website; Suchmaschinen bilden für Rechtstexte ohnehin eigene Auszüge.
Liefert Stefan später Text, gehört er nach `config/site-structure.ts`.

Offen für `/praxis`: wohin die Canonical der Blätterseiten `?seite=n` zeigt – derzeit auf
Seite 1 **[S]**.

## OG-Bilder

`lib/og/bild.tsx` zeichnet **ein** Bild für alle: 1200 × 630, Navy-Verlauf wie im Hero
(`linear-gradient(160deg, #012B3D, #01415B 58%, #065877)`), Wortmarke weiß oben links,
Signalgrün als Linie, Seitentitel in Archivo 800 weiß, unten die Domain in
`--gn-on-dark-text`. Praxis-Artikel bekommen zusätzlich die Rubrik als Eyebrow (Signalgrün
auf Navy – die einzige Stelle, an der Grün als Text erlaubt ist).

Je Route liegt eine fünfzeilige `opengraph-image.tsx`, die den Titel aus site-structure liest
und diese Vorlage aufruft. **Nicht vererbt:** Ein Bild in `app/` erreicht die Seiten der
Route-Gruppe `(site)` nicht (gemessen am 09.09.2026) – deshalb `app/opengraph-image.tsx` für
die Routen außerhalb der Gruppe (404, `/studio`) und `app/(site)/opengraph-image.tsx` für die
Gruppe. `/danke` bekommt bewusst kein Bild: `noindex`, nicht zum Teilen gedacht.

**Keine externe Schriftquelle.** Archivo liegt als statische TTF (700 und 800) samt
OFL-Lizenz unter `assets/fonts/` und wird zur Laufzeit aus dem Dateisystem gelesen;
`outputFileTracingIncludes` in `next.config.ts` nimmt die Dateien in die Vercel-Funktion mit.
`next/font` hilft hier nicht – es liefert WOFF2, Satori liest TTF/OTF/WOFF.

## Sitemap, robots, Indexierung

- `app/sitemap.ts`: alle Routen mit Status `live` und ohne `noindex`, dazu Artikel und
  Rubriken aus Sanity mit `lastModified` aus `_updatedAt`. `/studio` und `/danke` (Status
  `system`), `/_bausteine` (keine Route in site-structure) und alles unter `/api` fallen
  damit von selbst heraus – es gibt keine zweite Liste. Für die gebauten Seiten wird **kein**
  Datum erfunden. Ist Sanity nicht erreichbar, bleibt die Sitemap ohne die Inhalte bestehen.
- `app/robots.ts`: `Disallow: /studio, /api, /_bausteine`, Sitemap-URL, Host. `/danke` steht
  dort **nicht**: Eine per robots.txt gesperrte Seite kann ihr `noindex` nicht mehr mitteilen.
- Preview-Deployments: `X-Robots-Tag: noindex, nofollow` in `next.config.ts`, sobald
  `VERCEL_ENV` gesetzt und nicht `production` ist. Lokale Builds und der Playwright-Lauf
  bleiben unberührt – deshalb liegt die Entscheidung als prüfbare Funktion in
  `lib/seo/indexierung.ts` und hat einen eigenen Unit-Test; Playwright kann den Fall
  „Preview" nicht herstellen.
- Entfallene Routen (`/team`, `/ratgeber`, `/module/<slug>` – Briefing 0023) liefern 404
  **ohne Weiterleitung**: sie waren nie öffentlich erreichbar.

## Strukturierte Daten (JSON-LD)

Ein `<script type="application/ld+json">` im Server-HTML (`components/site/JsonLd.tsx`),
keine Bibliothek, kein zusätzliches Client-Bündel, kein Layout. Gebaut wird in
`lib/seo/jsonld.ts`.

- **`Organization`** im Layout der Gruppe `(site)`, also auf jeder öffentlichen Seite: Name,
  URL, Logo (`/icon-512.png`), Gründer Fred Hoffmann, Anschrift aus `docs/legal/impressum.md`
  (`lib/seo/organisation.ts`), Telefon und E-Mail aus den Sanity-Einstellungen, sonst
  ebenfalls aus dem Impressum. **Nichts darüber hinaus** – keine Bewertungen, keine
  `aggregateRating`, keine Preise, keine Kundenzahlen, keine Öffnungszeiten.
- **`FAQPage`** auf `/pakete`, aus denselben Sanity-Fragen wie der sichtbare Abschnitt
  (`FaqSection` mit `strukturierteDaten`). Antworten als Klartext (`lib/seo/klartext.ts`).
  Keine FAQs, kein Markup – wie der Abschnitt selbst auch.
- **`Article`** auf Praxis-Artikeln: headline, description, datePublished, author, image (nur
  bei echtem Titelbild), publisher als Verweis auf die Organisation.
- **`BreadcrumbList`** auf den Unterseiten, die wirklich unter einer anderen Adresse liegen:
  `/plattform/so-arbeitet-golfnext`, `/praxis/<slug>`, `/praxis/thema/<slug>`. Die Namen
  kommen aus dem Navigations-`label` bzw. aus Sanity.

## Prüfung

`tests/e2e/seo.spec.ts` (läuft nur im Projekt `w1440` – SEO hängt nicht an der Fensterbreite):
je `live`-Route Titel, genau ein Canonical auf die eigene Adresse, genau eine `<h1>`,
Beschreibung wo vorhanden, kein `noindex`; Open-Graph- und Twitter-Felder samt erreichbarem
OG-Bild (200, `image/png`, 1200 × 630); Sitemap vollständig und ohne `noindex`-Routen;
robots.txt; `Organization` auf drei verschiedenen Arten von Seite, `FAQPage`, `Article` und
`BreadcrumbList` als gültiges JSON im Server-HTML. Dazu der Zustand „noch kein Artikel
veröffentlicht" gegen den zweiten Testserver. Den `X-Robots-Tag` für Preview-Umgebungen
prüft `lib/seo/indexierung.test.ts`.

## Weiterleitungen (6.5, offen)

Alte Website golfnext.de: URL-Liste erheben **[S]** (Search Console → Seiten, oder Crawl mit
Screaming Frog). Mindestens:

- `/impressum/` → `/impressum` (301)
- `/ueber-golfnext/` → `/ueber-golfnext` (Next ohne Trailing Slash; `trailingSlash: false`)
- Blogartikel der alten Seite → passende Praxis-Artikel oder `/praxis`

Eintragen in `next.config.ts` `redirects()`; nach Launch 404-Log in Vercel prüfen.

## Performance-Regeln (6.6, offen)

- LCP-Element ist Text (Hero-Headline) – keine großen Hero-Bilder.
- `next/image` mit `sizes`, Sanity-Loader mit `auto=format`, `priority` nur oberhalb des Falzes.
- Platzhalter und Bilder mit festem `aspect-ratio` gegen CLS.
- Keine Third-Party-Scripts vor Consent, keine externen Fonts, kein Google Maps.
- Ziel: Lighthouse mobil ≥ 95 in allen Kategorien, INP < 200 ms.
