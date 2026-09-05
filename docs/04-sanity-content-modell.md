# Sanity · Content-Modell

Project `wsj8a3ho` · Dataset `production` · Organisation `oC2AvBZrV` · API-Version `2025-01-01`.
Studio eingebettet unter `/studio`. Zugang für Fred als Redakteur (Rolle Editor), Stefan als Administrator.

## Was in Sanity liegt – und was nicht

**In Sanity:** Ratgeberartikel, Rubriken, Autoren, FAQs, Site-Einstellungen (Kontakt, Links, Default-SEO).
**Nicht in Sanity:** die statischen Marketingseiten (Startseite, Plattform, Pakete …). Ihre Texte sind von Fred
freigegeben und ändern sich selten; sie leben im Code, damit Layout und Text zusammenbleiben. Sollte Fred später
Texte selbst pflegen wollen, ist das eine eigene Entscheidung (dann Sektions-Dokumente pro Seite).

## Dokumenttypen

### `post` – Ratgeberartikel
| Feld | Typ | Regeln |
|---|---|---|
| `title` | string | Pflicht, ≤ 90 Zeichen |
| `slug` | slug (aus title) | Pflicht, eindeutig, kleingeschrieben, `ae/oe/ue/ss` |
| `excerpt` | text | Pflicht, ≤ 160 Zeichen – dient als Teaser und Meta-Description |
| `category` | reference → category | Pflicht |
| `author` | reference → author | Pflicht |
| `publishedAt` | datetime | Pflicht |
| `mainImage` | image (hotspot) + `alt` string | `alt` Pflicht, wenn Bild gesetzt |
| `body` | Portable Text | Blöcke: normal, h2, h3, blockquote, bullet/number, Marks: strong, em, link (mit `openInNewTab`), Objekte: `image` (mit alt, caption), `callout` (Ton: hinweis/tipp), `cta` (label, target: erstgespraech/livedemo/pakete/url) |
| `related` | array<reference post> | optional, max 3 |
| `seo` | object {title, description, noindex} | optional; Fallback title/excerpt |

Vorschau im Studio: Titel, Rubrik, Datum, Bild.

### `category` – Rubrik
`title`, `slug`, `description` (≤ 200), `audience` (Liste: Einsteiger · Mitgliedschaft · Gäste · Unternehmen · Clubbetrieb), `order` (number).
Die fünf Rubriken entsprechen den Zielgruppen der Content-Basis aus dem Pakete-Briefing.

### `author` – Autor
`name`, `slug`, `role` (z. B. „Gründer von GolfNext, PGA Golfprofessional"), `image` + `alt`, `bio` (text ≤ 300), `linkedin` (url, optional).
Startbestand: Fred Hoffmann, Stefan Kühne. Keine weiteren Personen ohne Freigabe.

### `faq` – Frage und Antwort
`question` (string, Pflicht), `answer` (Portable Text, nur normal/strong/link), `topic` (Liste: pakete · plattform · clubprozesse · wachstum · allgemein), `order` (number).
Startbestand: die sieben Pakete-FAQs aus `design-system/mocks/3.7-pakete.html`, Wortlaut unverändert.

### `siteSettings` – Singleton
`phone` („0175 5951839"), `email` („info@golfnext.de"), `responseNote` („Rückmeldung innerhalb eines Werktags"), `bookingUrl`, `liveDemoUrl`, `linkedin`, `instagram`, `defaultSeo {title, description, ogImage}`.
Im Studio als einzelnes Dokument in der Struktur (kein „Neu anlegen").

## Studio-Struktur

```
Ratgeber
  Artikel (nach Datum)
  Rubriken
  Autoren
FAQs (gruppiert nach topic)
Einstellungen (Singleton)
```

Deutsche Beschriftungen (`title` in `defineField`). Vision-Tool nur für Administratoren.

## Rendering

- Listen: `ArticleCard` (Bild 16/10, Rubrik-Chip, Titel, Excerpt, Datum, Autor).
- Artikel: max 70ch, 17–18 px, H2 `clamp(22px,2.2vw,28px)`, Bild mit Caption, `callout` als `Hint`-Variante mit Fläche, `cta` als `Button`/`TextLink`.
- Autorenbox unter dem Artikel; „Weitere Artikel aus <Rubrik>" (3 Karten); Abschluss-CTA zum Erstgespräch (kein Newsletter).
- Rubrikseite: Beschreibung + Liste; Filter auf `/ratgeber` per Searchparam `?rubrik=<slug>` (serverseitig).

## Caching und Revalidierung

- `fetch` mit `next: { tags: ['post'] }` etc., `revalidate: 3600` als Sicherheitsnetz.
- Webhook (Sanity → `POST https://www.golfnext.de/api/revalidate`), Secret in `SANITY_REVALIDATE_SECRET`, Signaturprüfung mit `@sanity/webhook` `isValidSignature`. Payload-Projektion: `{_type, "slug": slug.current}` → `revalidateTag(_type)` und bei `post` zusätzlich `revalidatePath('/ratgeber/'+slug)`.
- Draft-Mode: `/api/draft?secret=…&slug=…` setzt `draftMode().enable()`, Client liest mit Token und `perspective: 'previewDrafts'`.

## Zugriff und Sicherheit

- `NEXT_PUBLIC_SANITY_PROJECT_ID`/`DATASET` sind öffentlich (nur Lesen veröffentlichter Inhalte über CDN).
- `SANITY_API_TOKEN` nur serverseitig (Drafts, Typegen, MCP). Rolle **Viewer** genügt für die Website; Editor nur für Skripte, die schreiben.
- CORS-Origins im Sanity-Projekt: `http://localhost:3000`, Preview-Domain(s), `https://www.golfnext.de` – mit Credentials für Studio.
- Dataset bleibt `public` (Standard) – enthält keine personenbezogenen Daten außer den Autorenprofilen mit Freigabe.

## Änderungen am Schema

Ablauf im Skill `sanity-content-model`. Jede Änderung hier dokumentieren (Datum, Feld, Grund).
