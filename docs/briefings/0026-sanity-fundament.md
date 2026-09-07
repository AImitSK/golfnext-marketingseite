# 0026 · Sanity-Fundament: Studio unter /studio, Schema, Client

Masterplan-Schritte: **3.1, 3.2, 3.3** · Branch: `feat/sanity-fundament` · Phase: 3

Der Einstieg in Phase 3. Am Ende dieses Schritts kann Fred sich unter `golfnext.de/studio`
anmelden und **Rubriken, Autoren und Artikel selbst anlegen**. Öffentliche Seiten entstehen
noch nicht – `/praxis` bleibt die Platzhalterseite aus 0022, bis Briefing 0027 folgt.

**Vorbedingung:** `main` ist aktuell (letzter Stand `d15ca31`). Alle Zugänge stehen bereits:

| | Stand |
|---|---|
| Projekt `wsj8a3ho`, Dataset `production` | angelegt (05.09.2026), ACL public |
| `SANITY_API_TOKEN` | in `.env.local`, in Vercel und als GitHub-Secret |
| `SANITY_REVALIDATE_SECRET` | in `.env.local` und Vercel |
| CORS-Origins | von Stefan eingetragen |
| Sanity-Zugriff für Claude | über den OAuth-Connector, **nicht** über `.mcp.json` |

## Kontext und Lesereihenfolge

1. `CLAUDE.md` – besonders: Sanity **code-first**, der Connector inspiziert nur; nichts erfinden.
2. **Skill `sanity-content-model`** – zuerst laden.
3. **`docs/04-sanity-content-modell.md`** – die verbindliche Feldliste je Dokumenttyp. Diese Datei
   gewinnt bei Widersprüchen gegen den Masterplan.
4. `config/site-structure.ts` (`/studio` hat Status `system`), `docs/07-seo.md`, `docs/01-architektur.md`.
5. `next.config.ts` – die Sicherheits-Header aus Schritt 0.9, siehe CSP-Hinweis unten.

## Harte Vorgaben

**Rubriken und Autoren werden NICHT im Code festgelegt** (Entscheidung Stefan, 07.09.2026).
Sie sind eigene Dokumenttypen, also Formulare im Studio. Fred legt an, benennt um und löscht selbst;
beim Anlegen eines Artikels wählt er Rubrik und Autor aus Klapplisten. **Dieser Schritt erzeugt
keinerlei Inhalte** – keine fünf Beispielrubriken, keine Autoren, keine Artikel. Die Liste im
Masterplan 3.5 (Einsteiger · Mitgliedschaft · Gäste · Unternehmen · Clubbetrieb) ist ein Vorschlag
für Fred, keine Vorgabe für den Code. Ein leeres Studio nach dem Deploy ist das erwartete Ergebnis.

**Schema code-first.** Alle Typen liegen als TypeScript in `sanity/schemaTypes/`. Der Sanity-Connector
wird nur zum Nachsehen benutzt, er legt nichts an. `pnpm sanity:deploy` (Schema-Deploy) ist ein
bewusster, eigener Schritt.

**Deutsche Feldbeschriftungen im Studio.** Fred arbeitet dort, nicht wir: `title: "Titel"`,
`excerpt: "Teaser"`, `category: "Rubrik"`, `author: "Autor"` usw. Auch die Beschreibungen unter den
Feldern auf Deutsch und in der Sie-Form, wo sie den Redakteur ansprechen.

**Validierungen** nach `docs/04`: Pflichtfelder, Slug eindeutig und kleingeschrieben, `excerpt` ≤ 160
Zeichen, `title` ≤ 90, **`alt` ist Pflicht, sobald ein Bild gesetzt ist** (Barrierefreiheit – ohne
Alternativtext kein Bild).

**Die CSP wird das Studio zunächst blockieren.** `next.config.ts` trägt seit Schritt 0.9 eine
Content-Security-Policy. Das Studio braucht Sanity-Hosts (`*.sanity.io`, `*.api.sanity.io`,
`cdn.sanity.io`, WebSockets für Live-Updates) und je nach Sanity-Version `unsafe-eval`. **Die CSP
gezielt für den `/studio`-Pfad erweitern, nicht global aufweichen** – die öffentlichen Seiten behalten
ihre strenge Fassung. Was genau nötig ist, zeigt die Browser-Konsole beim ersten Aufruf; die
Erweiterung im PR begründen.

**`/studio` bleibt unsichtbar:** `noindex`, nicht in der Navigation, nicht in der Sitemap, nicht in
`robots.txt` erlaubt. Der Status `system` in `config/site-structure.ts` regelt das bereits – prüfen,
dass Sitemap und robots ihn respektieren, sobald sie in Phase 6 entstehen.

**Keine öffentlichen Seiten in diesem Schritt.** `/praxis` bleibt die Platzhalterseite. Keine
Artikelliste, keine Artikelroute, kein Filter – das ist Briefing 0027 aus den Mocks `3.9a`/`3.9b`.

## Aufgaben

### A · Einrichten (3.1)

1. `pnpm add next-sanity sanity @sanity/image-url @sanity/vision`.
2. `sanity.config.ts` im Projektstamm: Project `wsj8a3ho`, Dataset `production`, API-Version aus
   `NEXT_PUBLIC_SANITY_API_VERSION`, Plugins `structureTool` und `visionTool`, deutsche
   Studio-Struktur (siehe C). `sanity.cli.ts` für die CLI.
3. Studio einbetten unter `app/studio/[[...tool]]/page.tsx`. **Eigenes Layout ohne Header und Footer**
   der Website – das Studio bringt seine eigene Oberfläche mit; die Seiten-Shell würde stören.
   `export const dynamic = "force-static"` bzw. die von `next-sanity` empfohlene Konfiguration.
4. CSP für `/studio` erweitern (siehe oben).
5. Skript `sanity:deploy` in `package.json` prüfen bzw. ergänzen.

### B · Schema (3.2)

6. `sanity/schemaTypes/` mit **`post`, `category`, `author`, `faq`, `siteSettings`** exakt nach
   `docs/04-sanity-content-modell.md`. Portable-Text-Konfiguration für `body` inklusive der Objekte
   `image` (alt, caption), `callout` (hinweis/tipp) und `cta` (label, target).
7. `siteSettings` als **Singleton**: genau ein Dokument, im Studio ohne „Neu anlegen".
8. Dokument-Vorschauen im Studio (`preview`): Artikel mit Titel, Rubrik, Datum und Bild; Autor mit
   Name und Rolle; Rubrik mit Titel und Reihenfolge.

### C · Studio-Struktur

9. Die Navigation im Studio genau so, wie Stefan sie beschrieben hat:

```
Ratgeber              ← die Artikel, nach Datum absteigend
Ratgeber-Rubriken     ← Rubriken
Autoren               ← Autoren
FAQs                  ← nach Thema gruppiert
Einstellungen         ← das eine siteSettings-Dokument
```

**Beachte die Benennung:** Der Menüpunkt der Website heißt seit 07.09.2026 **„Ratgeber"**, die Adresse
bleibt `/praxis`, und der Dokumenttyp heißt technisch weiterhin `post`. Im Studio steht **„Ratgeber"**,
weil Fred dort arbeitet.

### D · Typegen und Client (3.3)

10. `sanity typegen` einrichten (Schema-Extract + generierte `sanity.types.ts`), Skript in
    `package.json`, generierte Datei aus dem Lint ausnehmen.
11. `lib/sanity/client.ts`, `lib/sanity/queries.ts`, `lib/sanity/image.ts`. Fetch mit Cache-Tags
    (`post`, `category`, `author`, `faq`, `settings`) – die Revalidierung in 3.7 baut darauf auf.
12. Queries schon anlegen, auch wenn sie noch niemand rendert: Artikelliste, Artikel nach Slug,
    Rubriken mit Artikelanzahl, Autor nach Slug, FAQs nach Thema.
13. Ein Unit-Test, der prüft, dass der Client ohne `SANITY_API_TOKEN` nicht abstürzt (öffentliche
    Lesezugriffe brauchen ihn nicht – das Dataset ist `public`).

### E · Doku

14. `docs/04-sanity-content-modell.md` an Abweichungen anpassen, falls welche nötig wurden.
    `docs/entscheidungen.md`: keine Startinhalte im Code, CSP-Erweiterung für `/studio`,
    Studio-Benennung „Ratgeber". Masterplan 3.1–3.3 abhaken, **3.5 umschreiben**: keine
    Startinhalte per Code, Fred legt Rubriken und Autoren im Studio an.

## Skills und Subagents

- **Skills:** `sanity-content-model` (zuerst), `golfnext-qa`.
- **Subagents:** **`sanity-schema-writer`** (schreibt das Schema code-first, trägt es in die Doku ein),
  `seo-auditor` (`/studio` noindex, nicht in Navigation/Sitemap, keine neuen öffentlichen Routen),
  `qa-runner` (Website unverändert: keine Konsolenfehler, kein Overflow, bestehende E2E grün; Studio
  lädt und die CSP blockiert nichts), dann `pr-reviewer`.
  `text-fidelity` wird hier nicht gebraucht – es entstehen keine Website-Texte.

## PR und Merge

Branch `feat/sanity-fundament`. Gates: `pnpm typecheck`, `lint`, `test`, `build`, `test:e2e`,
`test:a11y`. CI grün, Preview aufrufen und **im Studio testweise eine Rubrik und einen Autor anlegen**
(danach wieder löschen – oder stehen lassen, wenn sie stimmen; das entscheidet Stefan).
**Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien

- [ ] `/studio` lädt in Preview und Production, Anmeldung mit dem Sanity-Konto funktioniert,
      die Browser-Konsole zeigt **keine CSP-Verstöße**.
- [ ] Die Studio-Navigation zeigt genau: Ratgeber · Ratgeber-Rubriken · Autoren · FAQs · Einstellungen.
- [ ] Eine Rubrik und ein Autor lassen sich im Studio anlegen; beim Anlegen eines Artikels
      erscheinen beide in den Klapplisten **Rubrik** und **Autor**.
- [ ] Alle Feldbeschriftungen und -beschreibungen im Studio sind auf Deutsch.
- [ ] Validierungen greifen: Pflichtfelder, eindeutiger kleingeschriebener Slug, `excerpt` ≤ 160,
      `title` ≤ 90, `alt` Pflicht bei gesetztem Bild.
- [ ] **Es wurden keine Inhalte angelegt** – keine vorbelegten Rubriken, Autoren oder Artikel im Code.
- [ ] `sanity typegen` läuft und erzeugt `sanity.types.ts`; Queries und Client sind typisiert.
- [ ] `/praxis` ist unverändert die Platzhalterseite; keine neue öffentliche Route.
- [ ] Die CSP ist nur für `/studio` erweitert, die öffentlichen Seiten behalten die strenge Fassung.
- [ ] Gates und CI grün; alle vier Subagents ohne FAIL; Doku und Masterplan-Haken nachgezogen.

## Was du NICHT tust

- **Keine Inhalte anlegen** – weder die fünf Beispielrubriken aus dem Masterplan noch Autoren,
  noch einen Beispielartikel.
- **Keine öffentlichen Seiten bauen** – `/praxis`, `/praxis/[slug]`, `/praxis/thema/[slug]` sind
  Briefing 0027.
- **Die FAQs auf `/pakete` nicht umstellen** – das ist Schritt 3.6.
- **Keine Revalidierung, kein Webhook, kein Draft-Mode** – 3.7 und 3.8.
- Die CSP nicht global aufweichen; den Sanity-Connector nichts anlegen lassen; die Marketingseiten
  nicht nach Sanity überführen.

## Hinweis für den nächsten Schritt (nicht hier lösen)

Für `/praxis/[slug]` steht ein ungelöster Punkt aus der 0022-Auswertung an: Ein `notFound()` aus einer
Segment-Route liefert **ohne JavaScript eine leere Seite** (Statuscode 404 stimmt). Bei unbekannten
Artikel-Slugs – gelöschter Artikel, Tippfehler, Crawler – trifft das eine echte öffentliche Route, und
„ohne JS lesbar" ist nicht verhandelbar. Der Lösungsweg gehört ins Briefing 0027.

## Offene Fragen an Stefan

- Keine. Zugänge, Route, Benennung und der Verzicht auf Startinhalte sind entschieden.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0026-sanity-fundament.md. Setze es vollständig um.

Ziel: Fred kann sich unter /studio anmelden und Rubriken, Autoren und Artikel selbst anlegen.
Öffentliche Seiten entstehen NICHT – /praxis bleibt die Platzhalterseite aus Briefing 0022.

Lade ZUERST den Skill sanity-content-model und lies docs/04-sanity-content-modell.md. Diese Datei
ist die verbindliche Feldliste und gewinnt bei Widersprüchen gegen den Masterplan.

Besonders wichtig:
- ES WERDEN KEINE INHALTE ANGELEGT. Rubriken und Autoren sind eigene Dokumenttypen, die Fred im
  Studio selbst anlegt; im Artikel wählt er sie aus Klapplisten. Die fünf Rubriken im Masterplan
  3.5 sind ein Vorschlag für Fred, keine Vorgabe für den Code. Ein leeres Studio nach dem Deploy
  ist das erwartete Ergebnis.
- Schema code-first in sanity/schemaTypes/. Der Sanity-Connector wird nur zum Nachsehen benutzt,
  er legt nichts an.
- Deutsche Feldbeschriftungen und -beschreibungen im Studio – Fred arbeitet dort, nicht wir.
- Studio-Navigation genau: Ratgeber · Ratgeber-Rubriken · Autoren · FAQs · Einstellungen.
  Der Menüpunkt der Website heißt "Ratgeber", die Adresse bleibt /praxis, der Dokumenttyp
  technisch weiterhin "post".
- Die Content-Security-Policy aus next.config.ts (Schritt 0.9) wird das Studio zunächst blockieren.
  Sie gezielt NUR für den /studio-Pfad erweitern, nicht global aufweichen; die Erweiterung im PR
  begründen.
- Studio einbetten unter app/studio/[[...tool]]/page.tsx mit eigenem Layout OHNE Header und Footer
  der Website.
- alt-Text ist Pflicht, sobald ein Bild gesetzt ist.
- Alle Zugänge stehen bereits (Token in .env.local, Vercel und GitHub-Secret; CORS eingetragen).

Baue über die Skills sanity-content-model und golfnext-qa. Rufe den Subagent sanity-schema-writer
für das Schema, danach seo-auditor (/studio noindex, keine neuen öffentlichen Routen) und qa-runner
(Website unverändert, Studio lädt ohne CSP-Verstöße), dann pr-reviewer. text-fidelity wird nicht
gebraucht – es entstehen keine Website-Texte.

Branch feat/sanity-fundament, Gates (typecheck, lint, test, build, test:e2e, test:a11y) grün,
PR nach .github/pull_request_template.md, CI grün, Preview aufrufen und im Studio testweise eine
Rubrik und einen Autor anlegen. Merge macht der Orga-Chat.

Das Briefing liegt untracked im Ordner – mit dem Branch committen.

Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
