# SEO und Auffindbarkeit

## Metadaten je Route (aus den Briefings, Abschnitt „Technische Seitenangaben")

| Route | Title | Description |
|---|---|---|
| `/` | GolfNext – Marketing und Automation für Golfclubs | aus Startseiten-Briefing übernehmen |
| `/plattform` | Root-Default „GolfNext" (Phase 6) | Briefing 0016 liefert keinen Meta-Titel/-Text → aktuell Root-Default + Canonical (title/description in site-structure.ts = null). Endgültiger Titel/Beschreibung im Feinschliff festlegen **[S]** |
| `/plattform/so-arbeitet-golfnext` | So arbeitet GolfNext | aus Briefing |
| `/wachstum-vertrieb` | Wachstum & Vertrieb für Golfclubs | aus Briefing |
| `/clubprozesse` | Clubprozesse digital – GolfNext | aus Briefing |
| `/pakete` | GolfNext Pakete und Preise für Golfclubs | „GolfNext bietet drei Ausbaustufen für Golfclubs: digitale Grundlage, systematisches Wachstum und eine vollständige digitale Clubzentrale." – **an Fassung 2 anpassen** (Sockel + drei Stufen) **[S]** |
| `/ueber-golfnext` | Über GolfNext \| Wir hängen am Golf. Nicht am Gestern. | „Von imageGolf zur GolfNext-Plattform: unsere Geschichte, die Menschen dahinter und unser Antrieb für mehr Mitglieder und mehr Zeit fürs Clubleben." |
| `/ratgeber/*` | `<Artikeltitel> – GolfNext Ratgeber` | Excerpt |

Titel-Suffix „ – GolfNext" über `title.template` in `app/layout.tsx`, außer wo der Titel schon die Marke enthält. `metadataBase = NEXT_PUBLIC_SITE_URL`, `alternates.canonical` je Route, `openGraph.locale = 'de_DE'`.

## OG-Bilder

`app/opengraph-image.tsx` (und je Route bei Bedarf): 1200×630, Navy-Verlauf wie Hero, Wortmarke weiß oben links, Seitentitel Archivo 800 weiß, unten Domain in `on-dark-text`. Für Ratgeber: Artikeltitel + Rubrik. Fonts via `next/font` im Edge-Runtime laden (Archivo als Buffer).

## Sitemap, robots, Indexierung

- `app/sitemap.ts`: alle statischen Routen + Sanity-Artikel/Rubriken mit `lastModified`.
- `app/robots.ts`: `Disallow: /studio, /api, /_bausteine`, Sitemap-URL.
- Preview-Deployments: `X-Robots-Tag: noindex, nofollow`.
- Platzhalter-Routen (Praxis, Team, Kontakt, Module) mit `robots: { index: false }` bis Inhalte vorliegen.

## Strukturierte Daten (JSON-LD)

- `Organization` global: name GolfNext, url, logo (Signet 512), contactPoint (Telefon, E-Mail), founder Fred Hoffmann, address aus Impressum.
- `FAQPage` auf `/pakete` aus den Sanity-FAQs.
- `Article` auf Ratgeber-Artikeln (headline, datePublished, author, image, publisher).
- `BreadcrumbList` auf Unterseiten.

## Weiterleitungen

Alte Website golfnext.de: URL-Liste erheben **[S]** (Search Console → Seiten, oder Crawl mit Screaming Frog). Mindestens:
- `/impressum/` → `/impressum` (301)
- `/ueber-golfnext/` → `/ueber-golfnext` (Next ohne Trailing Slash; `trailingSlash: false`)
- Blogartikel der alten Seite → passende Ratgeberartikel oder `/ratgeber`

Eintragen in `next.config.ts` `redirects()`; nach Launch 404-Log in Vercel prüfen.

## Performance-Regeln

- LCP-Element ist Text (Hero-Headline) – keine großen Hero-Bilder.
- `next/image` mit `sizes`, Sanity-Loader mit `auto=format`, `priority` nur oberhalb des Falzes.
- Platzhalter und Bilder mit festem `aspect-ratio` gegen CLS.
- Keine Third-Party-Scripts vor Consent, keine externen Fonts, kein Google Maps.
- Ziel: Lighthouse mobil ≥ 95 in allen Kategorien, INP < 200 ms (Akkordeons und Tabs ohne schwere Effekte).
