# 0027 · Praxis-Seiten (der Blog aus Sanity)

Masterplan-Schritt: 3.4 · Branch: `feat/praxis-seiten` · Phase: 3

## Kontext und Lesereihenfolge

Das Sanity-Fundament steht (3.1–3.3, Briefing 0026): Studio unter `/studio`, Schema für `post`,
`category`, `author`, `faq`, `siteSettings`, Typen in `sanity.types.ts`, Client und **alle GROQ-Abfragen
in `lib/sanity/queries.ts`**. Was fehlt, ist die öffentliche Seite: bisher liegt unter `/praxis` noch die
Platzhalterseite aus Briefing 0022.

Dieser Schritt baut die drei Routen, die die Abfragen bereits bedienen – Liste, Themenseite, Artikel.
**Inhalte legt der Code nicht an** (Masterplan 3.5): Fred trägt Rubriken, Autoren und Artikel selbst im
Studio ein. Beim Bauen ist das Dataset also aller Voraussicht nach leer. Genau deshalb sind Leerzustand,
Skeleton und Fehlerzustand hier kein Beiwerk, sondern der Normalfall, den man beim Abnehmen sieht.

1. `CLAUDE.md`
2. `docs/00-masterplan.md`, Schritt **3.4** (und 3.5 zur Abgrenzung: kein Startbestand im Code)
3. `docs/04-sanity-content-modell.md` – Feldliste, Abschnitt **„Rendering"**, Abschnitt „Caching und Revalidierung"
4. `docs/design-system/mocks/3.9a-praxis-uebersicht.html` (Übersicht) und
   `docs/design-system/mocks/3.9b-praxis-artikel.html` (Artikel) – **verbindliche visuelle Vorlage**
5. `docs/08-zustaende-und-feedback.md` – Skeleton, Alert, Leerzustand
6. `docs/entscheidungen.md`, Eintrag vom **07.09.2026** zu `notFound()` ohne JavaScript (siehe Aufgabe 0)
7. `docs/03-seiten-und-routen.md` (Zeile `/praxis`), `config/site-structure.ts` (Route `/praxis`, Label „Ratgeber")
8. `lib/sanity/queries.ts`, `lib/sanity/client.ts`, `lib/sanity/image.ts`, `sanity.types.ts`
9. `content/README.md` und ein gebautes Muster, z. B. `content/clubprozesse.ts`

**Es gibt kein Fred-Briefing für diese Seite und es wird keines geben.** Textquelle für alles, was
nicht aus Sanity kommt (Hero, Filterleiste, Beschriftungen, Abschluss), ist **Mock 3.9a/3.9b**. Die neun
Beispielartikel in den Mocks sind **keine freigegebenen Texte** – sie werden nicht übernommen, weder als
Inhalt noch als Seed noch als Demo.

## Harte Vorgaben

- **Kein Artikelinhalt im Code.** Keine Beispielartikel, keine Beispielrubriken, keine Autoren, keine
  Seed-Skripte, keine „damit man was sieht"-Fixtures außerhalb von Tests.
- **Wortgleich aus 3.9a/3.9b** ist nur die Seitenschale: H1 „Praxis. Was in Golfclubs wirklich
  funktioniert.", der Hero-Absatz, „Themen", „Alle", „Ältere Beiträge", „Über den Autor", „Inhalt",
  „Weiterlesen" / „Passt dazu", „Kurz gesagt". Nichts glätten, nichts ergänzen.
- **Der Newsletter-Block „Praxis-Post" entfällt** (Entscheidung Stefan, 07.09.2026) – auch der Hero-CTA
  „Praxis-Post abonnieren". Kein E-Mail-Feld ohne Versandweg. Wird als eigener Masterplan-Schritt geplant.
- **Ohne JavaScript lesbar und bedienbar** – gilt hier ausdrücklich auch für unbekannte Artikel-Slugs
  (Aufgabe 0) und für den Themenfilter (echte Links, kein JS-Filter).
- **Kein CLS.** Bilder mit fester `aspect-ratio` (Karten 16/10), Skeletons in Inhaltsform, Höhen reserviert.
- **Keine erfundenen Zahlen.** Es gibt kein Feld für Reichweite, Aufrufe oder Beliebtheit – und es wird
  keins erfunden. Zur Lesezeit siehe Aufgabe 5.
- **Kein Modulstatus** (keine Badges „Im Einsatz / Pilot / In Entwicklung"), auch nicht im Footer-Bereich
  der Mocks. Die gebauten `Footer`/`FooterClose` sind bereits richtig – unverändert wiederverwenden.
- Grün-Regel, Radius 4 px (Pills 20 px), Tokens `--gn-…`, Sektions-CSS aus dem Mock als `*.module.css`
  **portieren**, nicht nach Tailwind neu schreiben.
- Bewegung: Scroll-Reveals einmal (`viewport={{ once: true }}`), `useReducedMotion()` → Endzustand,
  Server-HTML trägt den Endzustand. Bestehende Bausteine aus `components/motion/` nutzen, keine neuen
  Effekte erfinden.
- Genau eine `<h1>` je Seite. Artikeltypografie: max 70ch, 17–18 px, H2 `clamp(22px,2.2vw,28px)` (docs/04).

## Aufgaben

### 0 · Vorab klären: `notFound()` ohne JavaScript (blockiert Aufgabe 5)

Der Befund aus Briefing 0022 (`docs/entscheidungen.md`, 07.09.2026): `notFound()` aus einer
Segment-Route liefert den 404-Inhalt nur über den Client nach – ohne JavaScript bleibt die Seite leer.
Mit `/praxis/[slug]` trifft das erstmals eine echte, öffentliche Route (gelöschter Artikel, Tippfehler,
alter Link, Crawler). „Ohne JavaScript lesbar" ist nicht verhandelbar.

**Erst messen, dann bauen.** Reihenfolge der Versuche, jeweils gegen `pnpm build && pnpm start` geprüft
(Status **und** roher HTML-Rumpf, z. B. `curl -i http://localhost:3000/praxis/gibt-es-nicht`, plus ein
Playwright-Lauf mit `javaScriptEnabled: false`):

1. `notFound()` mit einer **mitliegenden** `app/(site)/praxis/[slug]/not-found.tsx`.
2. Wenn der Rumpf leer bleibt: alle veröffentlichten Slugs über `generateStaticParams()` vorrendern und
   `export const dynamicParams = false` setzen – dann ist ein unbekannter Slug schon zur Buildzeit ein 404.
   Achtung: neue Artikel dürfen dabei nicht bis zum nächsten Deploy unsichtbar werden – das Zusammenspiel
   mit `revalidateTag` (3.7) mitprüfen und, falls es bricht, verwerfen.
3. Wenn auch das nicht trägt: eine reguläre Seite im `(site)`-Layout ausliefern, die den 404-Inhalt aus
   `lib/ui/messages.ts` zeigt, und den Statuscode über den einzigen Weg setzen, der ihn tatsächlich setzt.
   Kommt hier nur ein 200 heraus, ist das **kein** akzeptables Ergebnis – dann abbrechen und Stefan fragen
   (Frage 1 unten), statt eine „Seite nicht gefunden" mit Status 200 zu bauen.

Das Ergebnis mit Datum, gewähltem Weg und Messung in `docs/entscheidungen.md` festhalten und den offenen
Punkt dort auflösen. Ein E2E-Fall in `tests/e2e/` sichert ihn ab (Status 404 **und** Text im HTML ohne JS).

### 1 · `content/praxis.ts`

Alle festen Texte der drei Routen als typisierte Konstante, Muster `content/clubprozesse.ts`, Typen aus
`content/types.ts`. Hinein gehören ausschließlich Texte aus 3.9a/3.9b:

- Hero: Eyebrow „Praxis", H1 „Praxis. Was in Golfclubs wirklich funktioniert.", Lead-Absatz.
- Filterleiste: Überschrift „Themen", Eintrag „Alle".
- Beschriftungen: „Ältere Beiträge", „Über den Autor", „Inhalt", „Weiterlesen", „Passt dazu",
  „Alle Beiträge von {Name}" – letzteres nur, wenn es ein Ziel gibt (siehe „Was du NICHT tust").
- Abschluss: der geteilte `FooterClose`-Block („GolfNext persönlich" / „Lieber direkt über Ihren Club
  sprechen?" …) wird **wiederverwendet**, nicht neu getextet.
- Leerzustands- und Fehlertexte gehören **nicht** hierher, sondern nach `lib/ui/messages.ts` (Aufgabe 6).

Der Hero von 3.9a ist bewusst einspaltig (`.hero.plain`); der HTML-Kommentar „HERO MIT TITELTHEMA" und die
CSS-Klasse `.feat` sind tote Reste im Mock. **Nicht „reparieren", kein Titelthema bauen.**

### 2 · Gemeinsame Bausteine

Unter `components/pages/praxis/`:

- `ArticleCard` – Bild 16/10 (`next/image` mit Sanity-Loader aus `lib/sanity/image.ts`, LQIP-Blur aus
  `metadata.lqip`), Rubrik-Chip, Titel, Excerpt, Datum, Autor-Initialen + Name. **Ohne `mainImage`** tritt
  der bestehende `Shot`-Baustein mit „Bild folgt" an die Stelle des Bildes – nie ein Stock- oder KI-Bild,
  nie eine leere Fläche ohne Beschriftung.
- `ArticleGrid` – Raster + gestaffelte Reveals, `once: true`.
- `TopicFilter` – die Rubriken mit Anzahl aus `CATEGORIES_WITH_COUNT_QUERY` als **Links** (Chips):
  „Alle" → `/praxis`, jede Rubrik → `/praxis/thema/<slug>`. Aktiver Zustand über `aria-current="page"`.
  Rubriken mit `anzahl === 0` werden nicht angezeigt.
- `PortableTextRenderer` – `@portabletext/react`, Zuordnung nach `docs/04`: `h2`/`h3` (mit `id` für die
  Sprungmarken), `blockquote`, Listen, `strong`/`em`, `link` (extern mit `rel="noopener noreferrer"`,
  `target` nur bei `openInNewTab`), `inlineImage` (Bild + `figcaption` aus `caption`), `callout` → die
  `Hint`-Variante mit Fläche, `cta` → `Button`/`TextLink` mit Ziel aus `lib/links.ts`
  (`erstgespraech`/`livedemo`/`pakete`/`url`).
- `ArticleToc` – „Inhalt" aus den `h2`-Blöcken des Fließtexts (reine Ankerlinks, ohne JS nutzbar).
  Bei weniger als drei `h2` entfällt der Kasten. Die Nummerierung „01, 02 …" aus dem Mock kommt per
  CSS-Zähler, nicht aus dem Text – im Studio schreibt niemand Nummern in die Überschrift.

Sektions-CSS aus 3.9a/3.9b als `*.module.css` portieren.

### 3 · `/praxis` (Liste)

`app/(site)/praxis/page.tsx` **ersetzt** die Platzhalterseite aus 0022 (`PlatzhalterSeite` dort entfernen,
den Baustein selbst behalten – er trägt noch andere Routen).

- Daten: `POSTS_QUERY` mit `$rubrik = null`, dazu `CATEGORIES_WITH_COUNT_QUERY`; Fetch über `sanityFetch`
  mit den Marken aus `QUERY_TAGS`.
- Aufbau nach 3.9a: Hero, Filterleiste, Raster, Abschluss (`FooterClose`), Footer. Ohne Newsletter-Block.
- **Blättern** statt Nachladen: bei mehr als 9 Artikeln ein echter Link `?seite=2` (serverseitig
  ausgewertet, funktioniert ohne JS), Beschriftung „Ältere Beiträge". Das „Laden" aus dem Mock entfällt
  bewusst – abweichend vom Mock, in `docs/03-seiten-und-routen.md` vermerken.
- Leerzustand (kein Artikel vorhanden): `Empty` mit Text aus `lib/ui/messages.ts`, plus dem Abschluss-CTA.
  Kein Fehler, keine leere Seite, keine erfundene Ankündigung („bald mehr").

### 4 · `/praxis/thema/[slug]` (Rubrikseite)

- Daten: `CATEGORIES_WITH_COUNT_QUERY` für die Rubrik selbst und die Filterleiste, `POSTS_QUERY` mit
  `$rubrik = slug`.
- H1 = Rubriktitel, darunter `category.description`. Filterleiste wie auf `/praxis`, aktiver Chip markiert.
- Unbekannter Rubrik-Slug: derselbe Weg wie in Aufgabe 0.
- Leerzustand für eine Rubrik ohne Artikel wie in Aufgabe 3.

### 5 · `/praxis/[slug]` (Artikel)

Daten: `POST_BY_SLUG_QUERY`. Aufbau nach 3.9b, von oben nach unten:

- Brotkrumen „Praxis / <Rubrik> / <Titel>" als Links (JSON-LD kommt erst mit 6.4, hier nur Markup).
- Rubrik-Chip, genau eine `<h1>` (Titel), Excerpt als Lead, Autorenzeile mit Porträt (oder
  `Portrait`-Platzhalter), Datum.
- Titelbild mit `caption`; fehlt es, der `Shot`-Platzhalter „Titelbild folgt".
- Fließtext über den `PortableTextRenderer`, max 70ch.
- Seitenspalte: `ArticleToc` (klebend ab 1024 px, darunter über dem Text ausgeklappt), Autorzeile.
- Nach dem Text: Autorenbox („Über den Autor", Bio aus `author.bio`, LinkedIn nur wenn gesetzt).
- „Weiterlesen / Passt dazu": die Artikel aus `related`; sind keine gepflegt, bis zu drei weitere aus
  derselben Rubrik (ohne den aktuellen). Gibt es keine, entfällt der Block ersatzlos.
- Abschluss-CTA zum Erstgespräch über `bookingUrl()` – **kein Newsletter**.
- `generateMetadata` aus `seo.title`/`seo.description` mit Rückfall auf `title`/`excerpt`;
  `seo.noindex === true` → `robots: { index: false, follow: false }`.

**Lesezeit:** Im Schema gibt es kein Feld dafür, und es wird keines ergänzt. Die Angabe „6 Min. Lesezeit"
wird aus dem Fließtext **berechnet** (Wörter des Portable Text ÷ 200, aufgerundet, mindestens 1) – eine
abgeleitete Größe, keine erfundene Zahl. Die Rechenregel als Kommentar in die Hilfsfunktion schreiben.
Die Schlagwort-Zeile aus dem Mock („Schnuppergolf · Platzreife · Instagram …") **entfällt** – dafür gibt es
kein Feld, und ein neues Feld ist nicht Teil dieses Schritts.

### 6 · Zustände

Je Route nach `docs/08`:

- `loading.tsx` mit Skeleton **in Inhaltsform** (Liste: Filterleiste + Kartenraster; Artikel: Kopf,
  Bildfläche, Textzeilen). Kein Vollbild-Spinner, kein globaler Balken. Bei Reduced Motion still.
- `error.tsx` mit `Alert` (Variante `err`) und „Noch einmal versuchen" (`reset()`); das Fehlerobjekt wird
  weder angezeigt noch geloggt.
- Leerzustände über `Empty`. Alle Texte neu in `lib/ui/messages.ts` (`praxis.*`) – Sie-Form, ein Satz,
  mit Ausweg, keine Technik. Keine freien Texte im JSX.

### 7 · Route freischalten

`config/site-structure.ts`, Eintrag `/praxis`:

- `status` bleibt vorerst **`geplant`** und `noindex: true` – siehe Frage 2. Der Wechsel auf `live` ist
  eine Zeile und passiert, sobald Fred den ersten Artikel veröffentlicht hat; Navigation und Footer ziehen
  automatisch nach. **Nicht eigenmächtig live schalten.**
- `title`/`description` stehen auf `null`. Vorschlag aus dem freigegebenen Hero von 3.9a eintragen
  (Titel „Praxis. Was in Golfclubs wirklich funktioniert.", Beschreibung aus dem Hero-Absatz, ≤ 160
  Zeichen gekürzt **ohne neue Formulierung**) – bei Zweifel `null` lassen und Frage 3 stellen, nichts erfinden.
- `mock` zeigt bereits auf 3.9a; für die beiden Unterrouten keine neuen Einträge erfinden, wenn die
  Struktur dafür kein Feld hat.

### 8 · Tests und Doku

- Unit: Lesezeit-Berechnung, TOC-Ableitung aus `h2`, Blätter-Logik (`?seite=`).
- E2E (`tests/e2e/praxis.spec.ts`): Liste ohne JS lesbar, Themenfilter ohne JS bedienbar, unbekannter
  Slug → 404 mit Inhalt ohne JS (Aufgabe 0), kein horizontaler Overflow bei 390/768/1024/1180/1440,
  keine Konsolenfehler, Reduced-Motion-Endzustand.
- Da das Dataset beim Bauen leer sein dürfte: die Tests, die Artikel brauchen, gegen **gemockte
  Sanity-Antworten** laufen lassen (Route-Interception oder ein Test-Fetch), **nicht** durch angelegte
  Inhalte im echten Dataset.
- `docs/03-seiten-und-routen.md` (Zeile `/praxis`) und `docs/04-sanity-content-modell.md` (Abschnitt
  „Rendering") auf den gebauten Stand ziehen, inklusive der beiden Abweichungen vom Mock/Doc:
  kein Newsletter-Block, Blättern per Link statt Nachladen, Themenfilter über `/praxis/thema/<slug>`
  statt `?rubrik=` (der Suchparameter aus `docs/04` entfällt – zwei Wege auf dieselbe Liste wären
  doppelter Inhalt). Diese drei Punkte auch in `docs/entscheidungen.md`.

## Skills und Subagents

- Skills: `sanity-content-model`, `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`
- Subagents nach dem Bauen: `design-system-guard`, `text-fidelity`, `seo-auditor`, `qa-runner`,
  danach `pr-reviewer`

## PR und Merge

Branch `feat/praxis-seiten`, Commits deutsch im Imperativ, PR nach `.github/pull_request_template.md`,
CI grün, Preview ansehen, `pr-reviewer`, dann Merge.

## Akzeptanzkriterien

- [ ] `/praxis`, `/praxis/thema/[slug]` und `/praxis/[slug]` sind gebaut; die Platzhalterseite aus 0022
      liegt nicht mehr unter `/praxis`.
- [ ] Im Repo steht **kein einziger** Artikel-, Rubrik- oder Autorentext als Inhalt – nur Seitenschale.
- [ ] Ein unbekannter Artikel-Slug liefert Status **404** und der 404-Inhalt steht **ohne JavaScript** im
      HTML; der Weg dorthin ist in `docs/entscheidungen.md` dokumentiert und durch einen E2E-Fall gesichert.
- [ ] Alle drei Routen sind ohne JavaScript vollständig lesbar; der Themenfilter ist ohne JS bedienbar.
- [ ] Leeres Dataset: `/praxis` zeigt den Leerzustand aus `lib/ui/messages.ts`, keine Fehlerseite,
      kein leerer Rumpf, keine erfundene Ankündigung.
- [ ] Je Route `loading.tsx` (Skeleton in Inhaltsform) und `error.tsx` (Alert + Retry).
- [ ] Artikel ohne `mainImage` zeigen den beschrifteten `Shot`-Platzhalter, kein Stock-/KI-Bild.
- [ ] Kein Newsletter-Block, kein E-Mail-Feld, kein „Praxis-Post"-CTA auf irgendeiner der Routen.
- [ ] Kein Modulstatus-Badge auf den neuen Seiten.
- [ ] Genau eine `<h1>` je Route; Artikelspalte max 70ch.
- [ ] Kein horizontaler Overflow bei 390/768/1024/1180/1440, keine Konsolenfehler, kein SVG > 90 px
      außer Logo und bewussten Grafiken.
- [ ] Reduced Motion zeigt sofort den Endzustand; kein CLS beim Laden der Karten und Bilder.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e` grün; Lighthouse mobil ≥ 95 in allen
      vier Kategorien auf `/praxis` (mit gemockten Inhalten gemessen, Messwerte im PR notieren).
- [ ] `/praxis` steht weiterhin auf `status: "geplant"` mit `noindex` – der Wechsel auf `live` ist
      **nicht** Teil dieses PRs.
- [ ] `docs/03`, `docs/04` und `docs/entscheidungen.md` sind nachgezogen.

## Was du NICHT tust

- Keine Inhalte anlegen – weder im Code, noch über den Sanity-MCP, noch im Studio. Auch nicht „nur zum
  Testen" im Dataset `production`.
- Die neun Beispielartikel aus 3.9a/3.9b **nicht** übernehmen, auch nicht gekürzt, auch nicht als Fixture
  mit echtem Wortlaut.
- Kein Schemafeld ergänzen (keine Lesezeit, keine Schlagwörter, kein Titelthema) – Schemaänderungen laufen
  über den Skill `sanity-content-model` und einen eigenen Schritt.
- Keine Autorenseite `/praxis/autor/<slug>` bauen. Die Abfrage dafür existiert, die Route steht nicht im
  Masterplan. Der Link „Alle Beiträge von …" aus 3.9b entfällt deshalb, statt ins Leere zu zeigen.
- Kein Newsletter, kein Abonnieren-Formular, kein Double-Opt-In.
- Keine Revalidierung (3.7), kein Draft-Mode (3.8), keine FAQ-Umstellung von `/pakete` (3.6).
- Keine anderen Seiten anfassen, keine bestehenden Texte ändern, keine neuen Farben, Radien oder
  Bewegungsmuster erfinden.
- `/praxis` nicht auf `live` setzen und `noindex` nicht entfernen.

## Offene Fragen an Stefan

1. **Falls in Aufgabe 0 alle drei Wege scheitern** (404-Inhalt bleibt ohne JS leer oder der Statuscode
   lässt sich nicht auf 404 setzen): Was gilt – Statuscode 404 mit leerem Rumpf, oder lesbarer Inhalt mit
   Status 200? Bis zur Antwort wird `/praxis/[slug]` nicht fertiggebaut.
2. **Wann geht `/praxis` live?** Vorschlag: erst wenn Fred den ersten Artikel veröffentlicht hat – ein
   Menüpunkt „Ratgeber", der auf eine leere Liste führt, schadet mehr als er nützt. Dieses Briefing lässt
   die Route deshalb auf `geplant`/`noindex`.
3. **Titel und Beschreibung für `/praxis`** stehen in `config/site-structure.ts` auf `null`, weil es kein
   Fred-Briefing mit „Technischen Seitenangaben" gibt. Ist der Hero-Wortlaut aus 3.9a als Quelle in
   Ordnung, oder liefert Fred eigene Angaben nach?
4. **Blättern statt Nachladen** („Ältere Beiträge" als Link mit `?seite=2`) weicht sichtbar vom Mock ab.
   Einverstanden? Alternative wäre, bis auf Weiteres alle Artikel auf einer Seite zu zeigen.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0027-praxis-seiten.md. Setze es vollständig um.
Fang mit Aufgabe 0 an (notFound() ohne JavaScript) und baue /praxis/[slug] erst, wenn das geklärt
und in docs/entscheidungen.md festgehalten ist.
Baue über die Skills sanity-content-model, golfnext-page-from-mock, golfnext-design-system und
golfnext-qa, rufe danach die Subagents design-system-guard, text-fidelity, seo-auditor und
qa-runner auf und behebe deren FAILs.
Lege keine Inhalte in Sanity an und übernimm keine Beispielartikel aus den Mocks.
Branch feat/praxis-seiten, PR nach .github/pull_request_template.md, CI grün, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
