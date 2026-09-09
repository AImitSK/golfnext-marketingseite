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
| `body` | Portable Text | Blöcke: normal, h2, h3, blockquote, bullet/number, Marks: strong, em, link (mit `openInNewTab`), Objekte: `image` (mit alt, caption), `callout` (Ton: hinweis/tipp), `cta` (label, target: erstgespraech/pakete/url) |
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
Kein Startbestand im Code. Die sieben Pakete-FAQs (`topic: "pakete"`, `order` 1–7, feste IDs `faq-pakete-1` … `faq-pakete-7`) liegen seit dem 08.09.2026 veröffentlicht im Dataset, Wortlaut unverändert aus `3.7-pakete.html`. Seit Briefing 0030 sind sie die **einzige** Quelle des Textes – im Repo steht er nicht mehr. Seit dem Nachtrag vom 09.09.2026 sind **alle fünf `topic`-Werte verdrahtet** (siehe „FAQ auf fünf Seiten" unten); zu den vier übrigen liegt bisher keine Frage im Dataset, ihre Abschnitte sind deshalb unsichtbar. Vorschau: Frage + Thema.

### `siteSettings` – Singleton
`phone` (Pflicht), `email` (Pflicht, E-Mail-Format), `responseNote`, `bookingUrl`, `linkedin`, `instagram`, `defaultSeo {title, description ≤ 160, ogImage + Pflicht-alt}`.
**Nur `phone` und `email` sind Pflicht.** Die Adressen (Buchungslink, Social) stehen noch nicht fest und werden nicht erfunden; die Werte trägt Fred im Studio ein („0175 5951839", „info@golfnext.de", „Rückmeldung innerhalb eines Werktags" – nicht als `initialValue` im Code).
Im Studio als einzelnes Dokument in der Struktur (kein „Neu anlegen"), feste Dokument-ID `siteSettings`.

### Objekttypen

| Typ | Verwendung | Felder |
|---|---|---|
| `blockContent` | `post.body` | Blöcke normal/h2/h3/blockquote, Listen bullet/number, Marks strong/em, Annotation `link` (`href`, `openInNewTab`), Objekte `inlineImage`, `callout`, `cta`. **Kein h1** (kommt aus dem Titel), kein h4–h6. |
| `simpleBlockContent` | `faq.answer`, `callout.text` | nur Absätze, Marks strong/em, Annotation `link` |
| `inlineImage` | Bild im Fließtext | `alt` (Pflicht), `caption` |
| `callout` | Hinweiskasten | `tone` (hinweis/tipp, Vorbelegung „hinweis"), `text` |
| `cta` | Button im Fließtext | `label`, `target` (erstgespraech/pakete/url), `url` (nur bei `target = url`) |
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

Gebaut mit Briefing 0027 (Masterplan 3.4). Bausteine unter `components/pages/praxis/`,
Hilfsfunktionen unter `lib/praxis/`.

### Zwei Portable-Text-Renderer

| Renderer | Für | Wo |
|---|---|---|
| `PortableTextRenderer` | `blockContent` – Artikel-Fließtext mit Überschriften, Listen, Zitat, Bild, `callout`, `cta` | `components/pages/praxis/PortableTextRenderer.tsx` |
| `SimpleText` | `simpleBlockContent` – FAQ-Antworten und `callout.text`: nur Absätze, `strong`, `em`, `link` | `components/ui/SimpleText.tsx` |

Der große Renderer wird **nicht** für FAQ-Antworten benutzt (Briefing 0030): Er zieht `next/image`,
`urlForImage` und den `Button`-Baustein mit sich, die eine FAQ-Antwort nie braucht. Geteilt wird nur,
was wirklich dieselbe Regel ist – die `link`-Annotation samt `rel="noopener noreferrer"` bei externen
Zielen: `components/sanity/PortableLink.tsx`. `SimpleText` bringt kein Wrapper-Element mit; die Fläche
stellt die aufrufende Stelle (bei der FAQ `.answer` in `Faq.module.css`).

### FAQ auf fünf Seiten

Seit Briefing 0030 (Masterplan 3.6) und seinem Nachtrag vom 09.09.2026 trägt **jede der fünf
Hauptseiten** einen FAQ-Abschnitt, unmittelbar vor dem Abschluss-CTA. Gebaut ist er **einmal** als
`components/site/FaqSection.tsx`; die Seiten übergeben nur Thema, Sektionskopf und Flächenfarbe.

| Route | `topic` | Überschrift |
|---|---|---|
| `/pakete` | `pakete` | Häufige Fragen zu den Paketen. |
| `/plattform` | `plattform` | Häufige Fragen zur Plattform. |
| `/clubprozesse` | `clubprozesse` | Häufige Fragen zu den Clubprozessen. |
| `/wachstum-vertrieb` | `wachstum` | Häufige Fragen zu Wachstum und Vertrieb. |
| `/ueber-golfnext` | `allgemein` | Häufige Fragen zu GolfNext. |

Der Eyebrow lautet überall „Klarheit vor dem Gespräch". Eyebrow und Überschrift sind **Seitentext**
und stehen in der jeweiligen `content/<seite>.ts` (Abschnitt `id: "faq"`), nicht im JSX – aus Sanity
kommen nur die Fragen und Antworten. **Damit sind alle fünf `topic`-Werte verdrahtet:** Die
Themenlisten der Studio-Struktur führen nicht mehr ins Leere, jede dort angelegte Frage erscheint
auf ihrer Seite.

Der Baustein holt die Fragen über `FAQS_BY_TOPIC_QUERY` mit der Marke `faq`; die Reihenfolge kommt
aus `order` (GROQ: `order asc, question asc`). Das Akkordeon bleibt `<details>/<summary>` – ohne
JavaScript bedienbar, alle Antworten im Server-HTML. Das `topic` ist als Union aus
`FAQS_BY_TOPIC_QUERY_RESULT` typisiert; ein Tippfehler bricht den Typecheck, statt einen Abschnitt
stillschweigend für immer leer zu lassen.

**Kein Rückfall auf das Repo:** Liefert Sanity zu einem Thema nichts, entfällt der Abschnitt samt
Eyebrow und Überschrift, ohne Leerzustandsmeldung und ohne Layoutlücke. Zurzeit trägt nur `pakete`
Dokumente – die vier übrigen Abschnitte sind deshalb unsichtbar. Das ist der gewünschte Zustand.

`FAQPage`-JSON-LD gehört zu Masterplan 6.4 und ist noch nicht gebaut.

- **Listen** (`/praxis`, `/praxis/thema/<slug>`): `ArticleCard` (Bild 16/10 mit `aspect-ratio`,
  Rubrik-Chip, Titel, Excerpt, Datum, Autor mit Porträt). Die Kartenabfrage `KARTE` holt das
  Autorenbild seit dem 08.09.2026 mit; ohne gepflegtes Porträt tritt der Initialenkreis an
  seine Stelle. Ohne `mainImage` tritt der beschriftete
  `Shot`-Platzhalter „Bild folgt" an die Stelle des Bildes – nie Stock, nie KI, nie eine leere
  Fläche. `ArticleGrid` staffelt die Karten einmalig ein (`viewport={{ once: true }}`).
- **Artikel** (`/praxis/<slug>`): max **70ch**, 18 px, H2 `clamp(22px,2.2vw,28px)`, Titelbild mit
  Bildunterschrift (sonst `Shot` „Titelbild folgt"), `callout` als Kasten mit Fläche, `cta` als
  `Button` mit Ziel aus `lib/links.ts`. Die Abschnittsnummern „01, 02 …" kommen aus einem
  CSS-Zähler, nicht aus dem Text.
- **Lesezeit**: kein Schemafeld, sondern **berechnet** – Wörter des Portable Text ÷ 200,
  aufgerundet, mindestens 1 (`lib/praxis/lesezeit.ts`). Abgeleitete Größe, keine erfundene Zahl.
- **Inhaltsverzeichnis**: aus den `h2`-Blöcken (`lib/praxis/toc.ts`), reine Ankerlinks, ab drei
  Überschriften. Die Sprungmarken kommen aus dem Sanity-`_key`, nicht aus dem Überschriftentext –
  zwei gleich lautende Überschriften ergäben sonst dieselbe Marke.
- Autorenbox unter dem Artikel („Über den Autor", LinkedIn nur wenn gesetzt); „Weiterlesen /
  Passt dazu" aus `related`, ersatzweise bis zu drei weitere aus derselben Rubrik, sonst entfällt
  der Block; Abschluss-CTA zum Erstgespräch (**kein Newsletter**).
- **Seitenspalte:** nur das Inhaltsverzeichnis. Die Autorenzeile des Mocks entfällt (der Autor
  stand sonst dreimal auf einer Seite); gibt es kein Inhaltsverzeichnis, entfällt die Spalte ganz
  und der Fließtext nimmt die volle Breite.
- **„Passt dazu" unter 1000 px als Querscroller** – reines CSS (`overflow-x` + `scroll-snap`),
  kein Karussell in JavaScript, ohne JS bedienbar, Scroll im eigenen Container.
- **Rubrikseite**: H1 = Rubriktitel, darunter `category.description`, Filterleiste mit aktivem Chip.

### Abweichungen von der ursprünglichen Fassung dieses Abschnitts

- **Der Suchparameter `?rubrik=<slug>` entfällt.** Gefiltert wird über eigene Adressen
  `/praxis/thema/<slug>`. Zwei Wege auf dieselbe Liste wären doppelter Inhalt, und ein Link ist
  ohne JavaScript bedienbar. `POSTS_QUERY` nimmt den Slug weiterhin als Parameter `$rubrik`.
- **Blättern statt Nachladen**: mehr als neun Artikel ergeben einen echten Link `?seite=2`
  („Ältere Beiträge", `lib/praxis/blaettern.ts`), serverseitig ausgewertet.
- **Kein Newsletter-Block** „Praxis-Post" (Entscheidung Stefan, 07.09.2026).
- **Kein `loading.tsx`.** Eine Suspense-Grenze lässt Next die Seite streamen; ohne JavaScript
  bliebe dann dauerhaft das Skelett stehen statt des Inhalts (gemessen 08.09.2026, siehe
  `docs/entscheidungen.md`). `error.tsx` bleibt auf allen drei Routen.
- **Unbekannte Slugs** fängt `proxy.ts` ab und schreibt sie auf einen Pfad ohne Route um, damit
  Nexts eigener 404 greift – der einzige Weg, der Status 404 **und** vollständiges Server-HTML
  liefert. Die Slug-Listen hält `lib/sanity/slugs.ts` 60 Sekunden im Speicher (der Data-Cache
  greift im Proxy nicht). Ebenfalls in `docs/entscheidungen.md` gemessen und begründet.

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
- **08.09.2026 · Das Ziel „Live-Demo" und `siteSettings.liveDemoUrl` entfallen** (Briefing 0031,
  Masterplan 2.11). Grund: Es gibt keine Live-Demo und wird keine geben (Entscheidung Stefan,
  08.09.2026); der einzige Weg ist das Online-Erstgespräch. Entfernt: die Option `livedemo` aus
  `cta.target` und das Feld `liveDemoUrl` aus `siteSettings` (samt `SITE_SETTINGS_QUERY`).
  **Vorab gegen `production` geprüft:** kein Artikel enthält ein `cta`-Objekt, `target: "livedemo"`
  wird nirgends verwendet, ein `siteSettings`-Dokument existiert noch nicht – die Änderung bricht
  keinen Inhalt. `sanity/schema.json` und `sanity.types.ts` neu erzeugt; `sanity schema deploy`
  steht noch aus (macht der Orga-Chat beim Merge).
