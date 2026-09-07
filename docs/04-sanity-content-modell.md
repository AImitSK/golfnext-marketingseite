# Sanity · Content-Modell

Project `wsj8a3ho` · Dataset `production` · Organisation `oC2AvBZrV` · API-Version `2025-01-01`.
Studio eingebettet unter `/studio`. Zugang für Fred als Redakteur (Rolle Editor), Stefan als Administrator.

## Was in Sanity liegt – und was nicht

**In Sanity:** Praxis-Artikel, Rubriken, Autoren, FAQs, Site-Einstellungen (Kontakt, Links, Default-SEO).

> **Struktur v2 (07.09.2026, Briefing 0023):** Der Blog liegt unter `/praxis`; die Route `/ratgeber` gibt
> es nicht mehr. Der Dokumenttyp heißt weiterhin `post` – nur die öffentlichen Adressen ändern sich.

> **Keine Startinhalte im Code (07.09.2026, Entscheidung Stefan, Briefing 0026):** Rubriken und Autoren
> sind eigene Dokumenttypen, also Formulare im Studio. **Fred legt sie selbst an**, benennt um und löscht;
> beim Anlegen eines Artikels wählt er Rubrik und Autor aus Klapplisten. Der Code legt **keine** Inhalte an –
> keine Beispielrubriken, keine Autoren, keine Artikel, keine `initialValue` mit echten Werten. Ein leeres
> Studio nach dem Deploy ist das erwartete Ergebnis. Die fünf Zielgruppen leben als Auswahlliste im Feld
> `category.audience` und sind ein Vorschlag für Freds Rubriken, keine Vorgabe.
**Nicht in Sanity:** die statischen Marketingseiten (Startseite, Plattform, Pakete …). Ihre Texte sind von Fred
freigegeben und ändern sich selten; sie leben im Code, damit Layout und Text zusammenbleiben. Sollte Fred später
Texte selbst pflegen wollen, ist das eine eigene Entscheidung (dann Sektions-Dokumente pro Seite).

## Dokumenttypen

### `post` – Praxis-Artikel
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
`title` (Pflicht), `slug` (Pflicht), `description` (text, Pflicht, ≤ 200), `audience` (Pflicht, Liste: Einsteiger · Mitgliedschaft · Gäste · Unternehmen · Clubbetrieb), `order` (number, optional).
Die fünf Zielgruppen sind die **Auswahlliste des Feldes `audience`**, keine vorangelegten Rubriken – Fred legt Rubriken im Studio an (siehe Kasten oben). Vorschau: Titel + Reihenfolge.

### `author` – Autor
`name` (Pflicht), `slug` (Pflicht), `role` (Pflicht, z. B. „Gründer von GolfNext, PGA Golfprofessional"), `image` + Pflicht-`alt`, `bio` (text, Pflicht, ≤ 300), `linkedin` (url, optional).
Kein Startbestand im Code. Fred trägt Fred Hoffmann und Stefan Kühne selbst ein; keine weiteren Personen ohne Freigabe. Vorschau: Name + Rolle + Porträt.

### `faq` – Frage und Antwort
`question` (string, Pflicht), `answer` (Portable Text `simpleBlockContent`, Pflicht: nur Absätze, strong/em, Link), `topic` (Pflicht, Liste: pakete · plattform · clubprozesse · wachstum · allgemein), `order` (number, optional).
Kein Startbestand im Code. Die sieben Pakete-FAQs aus `design-system/mocks/3.7-pakete.html` legt Masterplan 3.6 an, Wortlaut unverändert. Vorschau: Frage + Thema.

### `siteSettings` – Singleton
`phone` (Pflicht), `email` (Pflicht, E-Mail-Format), `responseNote`, `bookingUrl`, `liveDemoUrl`, `linkedin`, `instagram`, `defaultSeo {title, description ≤ 160, ogImage + Pflicht-alt}`.
**Nur `phone` und `email` sind Pflicht.** Die Adressen (Buchungslink, Live-Demo, Social) stehen noch nicht fest und werden nicht erfunden; die Werte trägt Fred im Studio ein („0175 5951839", „info@golfnext.de", „Rückmeldung innerhalb eines Werktags" – nicht als `initialValue` im Code).
Im Studio als einzelnes Dokument in der Struktur (kein „Neu anlegen"), feste Dokument-ID `siteSettings`.

### Objekttypen

| Typ | Verwendung | Felder |
|---|---|---|
| `blockContent` | `post.body` | Blöcke normal/h2/h3/blockquote, Listen bullet/number, Marks strong/em, Annotation `link` (`href`, `openInNewTab`), Objekte `inlineImage`, `callout`, `cta`. **Kein h1** (kommt aus dem Titel), kein h4–h6. |
| `simpleBlockContent` | `faq.answer`, `callout.text` | nur Absätze, Marks strong/em, Annotation `link` |
| `inlineImage` | Bild im Fließtext | `alt` (Pflicht), `caption` |
| `callout` | Hinweiskasten | `tone` (hinweis/tipp, Vorbelegung „hinweis"), `text` |
| `cta` | Button im Fließtext | `label`, `target` (erstgespraech/livedemo/pakete/url), `url` (nur bei `target = url`) |
| `seo` | `post.seo` | `title`, `description`, `noindex` |

`link.href` und `cta.url` erlauben neben `http/https/mailto/tel` auch **relative Pfade** (`/pakete`), damit interne Links ohne absolute Adresse gesetzt werden können.

## Studio-Struktur

```
Ratgeber              ← die Artikel (Typ post), nach Datum absteigend
Ratgeber-Rubriken     ← Rubriken (Typ category)
Autoren               ← Autoren (Typ author)
FAQs                  ← „Alle Fragen" plus fünf Themenlisten
Einstellungen         ← das eine siteSettings-Dokument
```

Zur Benennung: Der Menüpunkt der Website heißt seit 07.09.2026 **„Ratgeber"**, die Adresse bleibt `/praxis`,
der Dokumenttyp heißt technisch weiterhin `post`. Im Studio steht „Ratgeber", weil Fred dort arbeitet.
Neue FAQs werden unter „Alle Fragen" angelegt; die Themenlisten darunter sind gefilterte Ansichten.

Deutsche Beschriftungen und Beschreibungen (`title`/`description` in `defineField`), Sie-Form.
**Abweichung:** Das Vision-Tool lässt sich in der Studio-Konfiguration nicht auf Administratoren beschränken –
Rollen sind dort nicht abfragbar. Vision führt nur lesende GROQ-Abfragen mit den Rechten der angemeldeten
Person aus; ein Editor sieht damit nichts, was er nicht ohnehin sehen darf.

## Umsetzung (Briefing 0026, 07.09.2026)

- Schema code-first in `sanity/schemaTypes/` (ein Dokumenttyp je Datei, Objekte unter `objects/`,
  geteilte Slug-Logik in `lib/slug.ts`). `sanity.config.ts` und `sanity.cli.ts` im Projektstamm,
  Studio-Struktur in `sanity/structure.ts`.
- `sanity.config.ts` trägt `"use client"` – ohne die Direktive zieht Next das `sanity`-Paket in den
  Server-Komponenten-Graphen und der Build bricht an `swr` ab.
- **Slug-Eindeutigkeit gilt je Dokumenttyp**, nicht global: Artikel, Rubriken und Autoren haben getrennte
  Adressräume, ein Artikel „Mitgliedschaft" neben der Rubrik „Mitgliedschaft" ist erlaubt.
- Typen: `pnpm sanity:typegen` (`sanity schema extract --force --enforce-required-fields --path sanity/schema.json`
  plus `sanity typegen generate`) erzeugt `sanity.types.ts`. Beide Dateien sind **eingecheckt** – so braucht die
  CI keinen Sanity-Zugriff. `--enforce-required-fields` ist vertretbar, weil der Client mit
  `perspective: "published"` liest; Entwürfe (3.8) brauchen später eine eigene, lockerere Betrachtung.
- CSP: `next.config.ts` führt eine **zweite, weitere Fassung nur für `/studio`**. Die öffentlichen Seiten
  behalten die strenge Fassung (negatives Lookahead im `source`). Zusätzlich erlaubt sind dort
  `core.sanity-cdn.com` (Skript `bridge.js`), Sanity-Bild- und Avatar-Hosts, `worker-src blob:`,
  `frame-src *.sanity.io` und **`font-src *.sanity.io`** – das Studio lädt seine Oberflächenschrift von
  `design-system-static.sanity.io`. Das betrifft nur die Redaktionsoberfläche hinter dem Login; die Website
  hostet ihre Schriften weiterhin selbst.

## Rendering

- Listen: `ArticleCard` (Bild 16/10, Rubrik-Chip, Titel, Excerpt, Datum, Autor).
- Artikel: max 70ch, 17–18 px, H2 `clamp(22px,2.2vw,28px)`, Bild mit Caption, `callout` als `Hint`-Variante mit Fläche, `cta` als `Button`/`TextLink`.
- Autorenbox unter dem Artikel; „Weitere Artikel aus <Rubrik>" (3 Karten); Abschluss-CTA zum Erstgespräch (kein Newsletter).
- Rubrikseite: Beschreibung + Liste; Filter auf `/praxis` per Searchparam `?rubrik=<slug>` (serverseitig).

## Caching und Revalidierung

- `fetch` mit `next: { tags: ['post'] }` etc., `revalidate: 3600` als Sicherheitsnetz.
- Webhook (Sanity → `POST https://www.golfnext.de/api/revalidate`), Secret in `SANITY_REVALIDATE_SECRET`, Signaturprüfung mit `@sanity/webhook` `isValidSignature`. Payload-Projektion: `{_type, "slug": slug.current}` → `revalidateTag(_type)` und bei `post` zusätzlich `revalidatePath('/praxis/'+slug)`.
- Draft-Mode: `/api/draft?secret=…&slug=…` setzt `draftMode().enable()`, Client liest mit Token und `perspective: 'previewDrafts'`.

## Zugriff und Sicherheit

- `NEXT_PUBLIC_SANITY_PROJECT_ID`/`DATASET` sind öffentlich (nur Lesen veröffentlichter Inhalte über CDN).
- `SANITY_API_TOKEN` nur serverseitig (Drafts, Typegen, MCP). Rolle **Viewer** genügt für die Website; Editor nur für Skripte, die schreiben.
- CORS-Origins im Sanity-Projekt: `http://localhost:3000`, Preview-Domain(s), `https://www.golfnext.de` – mit Credentials für Studio.
- Dataset bleibt `public` (Standard) – enthält keine personenbezogenen Daten außer den Autorenprofilen mit Freigabe.

## Änderungen am Schema

Ablauf im Skill `sanity-content-model`. Jede Änderung hier dokumentieren (Datum, Feld, Grund).

- **07.09.2026 · Erstfassung des Schemas** (Briefing 0026). Alle fünf Dokumenttypen plus die Objekttypen
  oben. Gegenüber dem ursprünglichen Text dieser Datei geändert: kein Startbestand im Code (Autoren, FAQs);
  `siteSettings` nur mit `phone`/`email` als Pflicht; Studio-Bereich heißt „Ratgeber" statt „Praxis";
  Slug-Eindeutigkeit je Dokumenttyp; relative Pfade in `link.href` und `cta.url` erlaubt;
  `simpleBlockContent` erlaubt neben `strong` auch `em`; Vision-Tool nicht auf Administratoren begrenzbar.
