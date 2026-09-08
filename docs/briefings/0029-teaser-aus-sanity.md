# 0029 · Artikel-Teaser aus Sanity

Masterplan-Schritt: 3.9 · Branch: `feat/teaser-aus-sanity` · Phase: 3

## Kontext und Lesereihenfolge

Seit Masterplan 3.4 (Briefing 0027) kommt der Blog aus Sanity, `/praxis` ist seit dem 08.09.2026
`live`. Auf zwei älteren Seiten stehen die Artikel-Teaser aber weiterhin als **statische Daten im
Repo** – teils mit vollständigen Titeln, Autoren, Daten und Lesezeiten von Artikeln, die es nicht
gibt. Dieser Schritt schließt die Lücke: Die Teaser lesen dieselben Artikel wie `/praxis` und
verlinken auf sie.

1. `CLAUDE.md`
2. `docs/00-masterplan.md`, Schritt **3.9** (dieser Schritt) und **3.4** zur Vorgeschichte
3. `docs/briefings/0027-praxis-seiten.md` – dort stehen die Bausteine, die hier wiederverwendet werden
4. `lib/sanity/queries.ts` (`KARTE`, `POSTS_QUERY`), `lib/sanity/client.ts`, `lib/sanity/image.ts`
5. `components/pages/praxis/ArticleCard.tsx` und `ArticleGrid.module.css` – das gebaute Vorbild
6. `content/startseite.ts` (Abschnitt 8, `startseitePraxis`) und `components/pages/startseite/Praxis.tsx`
7. `content/ueber-golfnext.ts` (`ueberGolfnextWissen`) und `components/pages/ueber-golfnext/Wissen.tsx`,
   `WissenSlider.tsx`
8. Mocks `3.1b-startseite-neufassung.html` (Abschnitt Praxis) und `3.8b-ueber-golfnext-neufassung.html`
   (Wissen-Slider) – die Optik bleibt, nur die Datenquelle wechselt

## Harte Vorgaben

- **Die Optik der beiden Blöcke bleibt.** Es werden keine Karten neu gestaltet und keine Abschnitte
  umgebaut. Beide behalten ihr eigenes Kartenbild aus dem jeweiligen Mock – die Praxis-Karte aus 3.9a
  wird **nicht** hineinkopiert. Geteilt wird die Datenschicht, nicht das Aussehen.
- **Keine erfundenen Artikel mehr.** Die drei ausformulierten Teaser in `content/startseite.ts`
  („Warum Ihr Schnupperkurs im Netz nicht gefunden wird", „Rehburg-Loccum: Ein Concierge zieht ins
  Clubbüro", „Wem gehören die Daten Ihres Clubs?") verschwinden ersatzlos aus dem Repo, samt Typ
  `PraxisArtikel`, wenn er sonst niemand mehr braucht.
- **Umgebende Texte bleiben wortgleich.** Eyebrow, Überschrift und die Links „Alle Beiträge" bzw.
  „Alle Artikel" sind freigegebene Texte – kein Wort ändern.
- Fehlt einem Artikel das Titelbild, tritt der `Shot`-Platzhalter an seine Stelle – nie Stock, nie KI.
- Bewegung wie gehabt: `Rise`/`RiseItem` bleiben, `once: true`, Reduced-Motion zeigt den Endzustand,
  Server-HTML trägt den Endzustand, kein CLS (feste `aspect-ratio`).
- Ohne JavaScript vollständig lesbar und bedienbar – auch der Slider auf `/ueber-golfnext`.

## Aufgaben

### 1 · Abfrage für die neuesten Artikel

In `lib/sanity/queries.ts` eine Abfrage `NEUESTE_POSTS_QUERY` mit Parameter `$anzahl` ergänzen, die
die Felder aus `KARTE` liefert (Bild, Rubrik, Autor samt Porträt) und nach `publishedAt desc`
sortiert. Marken in `QUERY_TAGS` eintragen (`post`, `category`, `author`). Danach
`pnpm sanity:typegen` laufen lassen und `sanity.types.ts` neu einchecken.

`POSTS_QUERY` nicht dafür missbrauchen und im Code beschneiden – eine eigene Abfrage mit Limit
kostet weniger und sagt, was sie tut.

### 2 · Startseite, Abschnitt 8 „Praxis"

- `components/pages/startseite/Praxis.tsx` liest die **drei neuesten Artikel** über `sanityFetch`.
  Die Karten werden zu Links auf `/praxis/<slug>` (heute sind es `<article>` ohne Link).
- Angezeigt wie bisher: Rubrik, Titel, Anriss, Autor, Datum, Lesezeit. **Titelbild ergänzen**, wenn
  der Mock an dieser Stelle eine Bildfläche vorsieht – sonst bleibt die Karte, wie sie ist.
- Die Lesezeit kommt aus `lib/praxis/lesezeit.ts` (berechnet), nicht aus einem Feld. Steht der
  Fließtext in der Kartenabfrage nicht zur Verfügung, entfällt die Angabe – **keine Zahl schätzen**.
- Das Farbschema `catVariant` (`default`/`pr`/`td`) hat in Sanity keine Entsprechung und entfällt;
  die Rubrik wird wie auf `/praxis` einheitlich dargestellt.
- `startseitePraxis` in `content/startseite.ts` schrumpft auf das, was Text bleibt: Eyebrow,
  Überschrift, der Link „Alle Beiträge" und das Platzhalter-Label „Bild folgt".

### 3 · Über GolfNext, „Wissen"-Slider

**Achtung, der Block ist gemischt.** Von den vier Karten sind zwei mit `quelle: "golfmanager ·
Fachartikel"` gekennzeichnet – das sind **Freds Beiträge in einer Fachzeitschrift**, keine
Blogartikel. Sie kommen nicht aus Sanity und bleiben beschriftete Platzhalter, bis Fred Titel,
Teaser und Ausgabe liefert **[F]**.

- Die beiden Karten mit `quelle: "GolfNext · Blog"` werden durch die **zwei neuesten Artikel** aus
  Sanity ersetzt und verlinken auf `/praxis/<slug>`. Als Quelle steht dort künftig die Rubrik.
- Die Reihenfolge im Slider bleibt wie im Mock; die golfmanager-Karten behalten ihren Platz.
- Gibt es weniger als zwei Artikel, rücken die vorhandenen nach; der Slider zeigt dann entsprechend
  weniger Karten, ohne Lücke.

### 4 · Wenn es keine Artikel gibt

Beide Blöcke dürfen nicht als leeres Gerüst dastehen:

- **Startseite:** Sind keine Artikel vorhanden, entfällt der Abschnitt „Praxis" vollständig –
  Überschrift, Raster und Link. Keine Leerzustandsmeldung auf der Startseite, kein „bald mehr".
  Prüfen, dass dadurch kein Abstand doppelt steht und keine Sprungmarke ins Leere zeigt.
- **Über GolfNext:** Der Slider bleibt, weil die golfmanager-Karten unabhängig davon existieren.

### 5 · Tests und Doku

- E2E: Beide Seiten mit Artikeln (Testdaten aus `lib/sanity/fixtures.ts`, `SANITY_SOURCE=fixtures`)
  und **ohne** Artikel; Kartenlinks führen auf `/praxis/<slug>`; Startseite ohne Artikel zeigt den
  Abschnitt nicht; kein horizontaler Überlauf bei 390/768/1024/1180/1440; ohne JS lesbar.
- `docs/03-seiten-und-routen.md`: Die Spalte „Bilder offen" für `/` und `/ueber-golfnext` nachziehen –
  die Artikel-Platzhalter sind dort keine offenen Bilder mehr.
- `docs/entscheidungen.md`: Eintrag mit Datum, was ersetzt wurde und was bewusst Platzhalter bleibt
  (golfmanager-Karten).

## Skills und Subagents

- Skills: `sanity-content-model`, `golfnext-design-system`, `golfnext-qa`
- Subagents nach dem Bauen: `text-fidelity`, `design-system-guard`, `seo-auditor`, `qa-runner`,
  danach `pr-reviewer`

## PR und Merge

Branch `feat/teaser-aus-sanity`, Commits deutsch im Imperativ, PR nach
`.github/pull_request_template.md`, CI grün, Preview ansehen, `pr-reviewer`. Merge macht der Orga-Chat.

## Akzeptanzkriterien

- [ ] Auf der Startseite und auf `/ueber-golfnext` stehen keine erfundenen Artikeltitel, -autoren,
      -daten oder -lesezeiten mehr im Repo.
- [ ] Beide Blöcke zeigen echte Artikel aus Sanity und verlinken auf `/praxis/<slug>`.
- [ ] Die zwei golfmanager-Karten auf `/ueber-golfnext` sind unverändert Platzhalter.
- [ ] Ohne Artikel entfällt der Praxis-Abschnitt der Startseite vollständig, ohne Layoutlücke.
- [ ] Artikel ohne Titelbild zeigen den beschrifteten `Shot`-Platzhalter.
- [ ] Eyebrow, Überschriften und die Links „Alle Beiträge" / „Alle Artikel" sind wortgleich geblieben.
- [ ] Kein horizontaler Überlauf bei 390/768/1024/1180/1440, keine Konsolenfehler, ohne JS lesbar,
      Reduced Motion zeigt den Endzustand, kein CLS.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e` grün.
- [ ] `docs/03` und `docs/entscheidungen.md` sind nachgezogen.

## Was du NICHT tust

- Die Karten der beiden Blöcke neu gestalten oder durch die Praxis-Karte aus 3.9a ersetzen.
- Die golfmanager-Karten mit Blogartikeln füllen oder ihre Texte erfinden.
- Inhalte in Sanity anlegen – auch nicht zum Testen.
- Ein Schemafeld ergänzen (keine Lesezeit, keine Sortiergewichtung, kein „Auf Startseite zeigen").
- Andere Seiten, andere Abschnitte oder die Navigation anfassen.

## Offene Fragen an Stefan/Fred

- **[F]** Liefert Fred Titel, Teaser und Ausgabe für die beiden golfmanager-Karten? Bis dahin bleiben
  sie Platzhalter.
- Soll die Startseite künftig **immer** die drei neuesten Artikel zeigen, oder möchtest du dort
  auswählen können, welche erscheinen? Auswählen hieße ein neues Schemafeld und einen eigenen
  Schritt – dieses Briefing baut die einfache Fassung: die drei neuesten.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0029-teaser-aus-sanity.md. Setze es vollständig um.

Die Artikel-Teaser auf der Startseite (Abschnitt 8 „Praxis") und im Wissen-Slider auf
/ueber-golfnext lesen künftig echte Artikel aus Sanity und verlinken auf /praxis/<slug>.
Die Optik beider Blöcke bleibt unverändert – geteilt wird die Datenschicht, nicht das Aussehen.

Besonders wichtig:
- Die drei ausformulierten Teaser in content/startseite.ts sind erfundene Artikel und
  verschwinden ersatzlos aus dem Repo.
- Der Wissen-Slider ist gemischt: die zwei Karten mit quelle „golfmanager · Fachartikel"
  sind Freds Fachzeitschriften-Beiträge und bleiben Platzhalter, bis Fred sie liefert.
  Nur die zwei Karten mit quelle „GolfNext · Blog" kommen aus Sanity.
- Ohne Artikel entfällt der Praxis-Abschnitt der Startseite vollständig, ohne Layoutlücke.
- Eyebrow, Überschriften und die Links „Alle Beiträge" / „Alle Artikel" sind freigegebene
  Texte und bleiben wortgleich.
- Keine Inhalte in Sanity anlegen, kein Schemafeld ergänzen.

Baue über die Skills sanity-content-model, golfnext-design-system und golfnext-qa, rufe danach
die Subagents text-fidelity, design-system-guard, seo-auditor und qa-runner auf und behebe
deren FAILs.

Branch feat/teaser-aus-sanity, PR nach .github/pull_request_template.md, CI grün, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
