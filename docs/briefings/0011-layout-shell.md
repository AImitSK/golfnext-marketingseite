# 0011 · Layout-Shell (Header site-weit)

Masterplan-Schritt: Phase-2-Vorbereitung (Einbindung aus 1.3/1.4) · Branch: `feat/layout-shell` · Phase: 2

Kleiner Vorbereitungsschritt für Phase 2: den in 1.3 gebauten `Header` **site-weit** ins Layout
einhängen (bisher nur auf `/_bausteine`). Der `Footer` bleibt **pro Seite** (weil `footerClose`
seitenspezifisch ist) und wird mit jeder echten Seite eingesetzt. Keine echten Seiteninhalte hier.

**Vorbedingung:** Phase 1 ist auf `main` (1.9 gemergt). `feat/layout-shell` zweigt vom aktuellen `main` ab.

## Kontext und Lesereihenfolge
1. `CLAUDE.md`; `docs/00-masterplan.md` – Phase-2-Einstieg; `docs/workflow.md`.
2. `docs/01-architektur.md` – Ordnerstruktur (`app/(site)/…` mit gemeinsamem Layout, Header/Footer).
3. `docs/10-launch-umfang.md` – **entschieden: Weg A mit Platzhaltern**, Domain `www.golfnext.de`.
4. Bestehende Teile: `app/layout.tsx` (Root: Fonts, Metadata, html/body), `app/page.tsx` (Phase-0-Platzhalter), `components/site/Header.tsx`, `components/site/Footer.tsx`.

## Harte Vorgaben
- **Header ins `(site)`-Layout:** `app/(site)/layout.tsx` rendert `<Header/>` über `{children}`. Das Root-`app/layout.tsx` (html/body, Fonts, Metadata) bleibt unverändert. Der Header ist damit auf allen `(site)`-Seiten sticky sichtbar; `/_bausteine` (in `app/(preview)/`) bleibt **außen vor** (hat seine eigene Header-Demo).
- **Footer bleibt pro Seite:** nicht ins Layout, weil `footerClose` je Seite unterschiedlich ist. Muster: jede Seite rendert am Ende `<Footer footerClose={…}/>`. In diesem Schritt **keine** erfundenen Footer-Texte – der Platzhalter-Home bekommt **noch keinen** Footer (kommt mit der echten Startseite 2.2).
- **Home bleibt Platzhalter:** `app/page.tsx` nach `app/(site)/page.tsx` verschieben (Route bleibt `/`), Inhalt minimal wie bisher (Wortmarke). **Keine** echte Startseite bauen (das ist 2.2). Genau eine `<h1>` auf der Seite.
- **Nur `live` verlinken:** Der Header nutzt bereits `isLinkable` (site-structure). Da noch keine Seite `live` ist, sind die Nav-Punkte `#`-Platzhalter – das ist erwartet und wird pro Seite in Phase 2 automatisch aktiv.
- Keine neuen Tokens, keine neuen Komponenten, keine Inhalte erfinden.

## Aufgaben
1. `app/(site)/layout.tsx` anlegen (Server-Komponente): `<Header/>` + `{children}`; ggf. ein `<main>`-Wrapper, falls die Seiten kein eigenes `<main>` mitbringen – Konvention festlegen und dokumentieren (Empfehlung: Seiten liefern ihr `<main>` selbst, Layout nur Header).
2. `app/page.tsx` → `app/(site)/page.tsx` verschieben (Route bleibt `/`); Platzhalterinhalt beibehalten.
3. Prüfen, dass der Header auf `/` site-weit erscheint (sticky, Dropdowns, Mobile-Menü), `/_bausteine` unverändert funktioniert.
4. `docs/entscheidungen.md`: „Phase 2 – Header ins `(site)`-Layout; Footer pro Seite; Home vorerst Platzhalter."

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`.
- Subagents: `design-system-guard`, `qa-runner` (Header auf `/` @390/768/1024/1180/1440, sticky, ohne-JS, Overflow, Konsole, axe), `seo-auditor` (genau eine H1 auf `/`, Nav-Links nur `live`/`#`), dann `pr-reviewer`.

## PR und Merge
- Branch `feat/layout-shell` vom aktuellen `main`; Briefing liegt mit im Branch. Commits deutsch, Imperativ.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün (Smoke auf `/` bleibt grün, jetzt mit Header).
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), Preview ansehen, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `app/(site)/layout.tsx` rendert den Header; Root-Layout unverändert; `/` zeigt den Header sticky.
- [ ] `app/(site)/page.tsx` ist die (Platzhalter-)Route `/` mit genau einer `<h1>`; `/_bausteine` unverändert.
- [ ] Footer **nicht** im Layout; keine erfundenen Footer-Texte auf `/`.
- [ ] Kein Overflow @390/768/1024/1180/1440; ohne JS bedienbar; keine Konsolenfehler; axe ohne AA-Verstoß.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; Subagents ohne FAIL; Eintrag in `entscheidungen.md`.

## Was du NICHT tust
- Keine echte Startseite/keine Sektionen (2.2), keinen Footer auf dem Platzhalter-Home, keine anderen Seiten.
- Keinen Footer ins Layout ziehen; keine Inhalte/Tokens erfinden; `config/site-structure.ts`/`content/*`/Mocks nicht ändern.

## Offene Fragen an Stefan/Fred
- Keine.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0011-layout-shell.md. Voraussetzung: Phase 1 ist auf main;
zweige feat/layout-shell vom aktuellen main ab. Setze das Briefing vollständig um. Baue über die Skills
golfnext-design-system und golfnext-qa. Lege app/(site)/layout.tsx an, das <Header/> über {children}
rendert (Root-app/layout.tsx unverändert), und verschiebe app/page.tsx nach app/(site)/page.tsx (Route
bleibt /, Platzhalterinhalt bleibt). Footer NICHT ins Layout und noch keinen Footer auf dem Platzhalter-
Home (kommt mit 2.2). /_bausteine bleibt unverändert. Genau eine h1 auf /. Trag die Entscheidung in
docs/entscheidungen.md ein. Rufe danach design-system-guard, qa-runner und seo-auditor auf und behebe
deren FAILs. PR nach dem Template, CI grün (beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
