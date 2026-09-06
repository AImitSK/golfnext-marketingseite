# 0021 · Startseite-Rebuild (/) · Neufassung v01

Masterplan-Schritt: 2.2 (Rebuild) · Branch: `feat/startseite-neufassung` · Phase: 2

Die **bestehende Startseite wird durch die Neufassung `3.1b` ersetzt** (modernes Layout wie die anderen
Seiten, Paketblock Fassung 2). Die alte Fassung (0013, aus 3.1/3.1a) wird abgelöst. Acht Abschnitte:
Hero mit Bleed-Demo, Vertrauensleiste, „Drei Teile", Rollen-Slider, „Ein Weg", Pakete, „Vier Zusagen", „Praxis".

**Vorbedingung:** Plattform/Wachstum/Clubprozesse/Über GolfNext sind auf `main` (moderne Layout-Tokens +
Motion-Infra + Slider stehen; die verlinkten Seiten sind live). Vorher `git fetch` + `main` nachziehen,
dann `feat/startseite-neufassung` abzweigen. **Dieses Briefing liegt untracked im Ordner – mit committen.**

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Texte wortgleich; Preise nie addieren; keine erfundenen Zahlen; Benennungen; **kein Modulstatus**; Bewegung gelockert; A11y-Grenzen hart).
2. Skill `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`; `docs/02-preislogik.md` (Fassung 2).
3. **Mock (verbindlich): `docs/design-system/mocks/3.1b-startseite-neufassung.html`** – ersetzt 3.1/3.1a (Archiv).
4. Die gebauten Seiten (Plattform/Wachstum/Clubprozesse) als Referenzmuster (Tokens, Slider, Reveal, Bento, Bleed-Demo).
5. Bestehende Startseite (`content/startseite.ts`, `components/pages/startseite/`, `app/(site)/page.tsx`) – **wird durch 3.1b ersetzt**.

## Seitenstruktur (aus 3.1b)
1. **Hero** (1.75/1, Bleed): Eyebrow „Die Plattform für Golfclubs", H1 „Mehr Golfer auf dem Platz. Weniger Arbeit im Clubbüro.", Lead, CTAs (Live-Demo / Erstgespräch), Trust-Zeile. Rechts: Browser-Demo (Clubwebsite) + drei schwebende Karten (Anmeldung Anna, Concierge-Chat, Platzstatus-Toggle). Mikro-Animation: Karten laufen ein, Toggle schaltet.
2. **Vertrauensleiste**: „Entwickelt mit" + Club-Namen (Rehburg-Loccum etc.), „Hosting in Deutschland", „Ansprechpartner: PGA Golfprofessional".
3. **„Drei Teile. Ein System."** (`.bento`, 3 Boxen): (01) Ihre Clubwebsite → Link `/plattform`; (02) Neue Golfer finden → `/wachstum-vertrieb`; (03) Büro macht weniger Routine → `/clubprozesse`. Je Box ein Viz.
4. **„Für jede Rolle im Club"** (Rollen-Slider, 6 Karten – wie Plattform).
5. **„Ein Weg"** „Ein Klick bei Instagram. Vier Wochen später ein Mitglied." – 4-Schritt-Zeitleiste. Links: „So arbeitet GolfNext" + „Live-Demo".
6. **„Pakete"** „Eine Basis. Dazu genau das, was Ihr Club braucht." – drei Karten (Basis „Ihre Clubwebsite" + „+", Wachstum, Komplett) mit Modul-Labels; **Fassung 2, keine Summen/Preise auf der Startseite**; `pkline` + Link „Pakete und Preise ansehen" → `/pakete`.
7. **„Vier Zusagen"** (4 Vows + Fred-Zitatblock mit Porträt-Platzhalter).
8. **„Praxis"** „Was in Golfclubs wirklich funktioniert." – drei Artikel-Karten mit **Platzhaltern** („Bild folgt" wortgleich); „Alle Beiträge" → `/praxis`.
9. **Persönlicher Abschluss (FooterClose)** „Was könnte GolfNext in Ihrem Club verändern?" + geteilter **Footer**.

## Harte Vorgaben
- **Rebuild, nicht additiv:** `content/startseite.ts` und `components/pages/startseite/` werden **auf 3.1b umgestellt** (alte Sektionen/Struktur ersetzt); `app/(site)/page.tsx` setzt die neuen Abschnitte zusammen. Alte, nur für 0013 gebaute Startseiten-Sektionen entfernen, die nichts mehr rendern. Geteilte Bausteine/Motion-Infra bleiben.
- **Texte als Daten, wortgleich** aus 3.1b (Zeichensetzung, „…", Umbrüche). Komponenten ohne freie Texte. Sektions-CSS aus 3.1b als co-lokierte Module (`--gn-*`).
- **Preise nie addieren:** Der Paketblock zeigt Basis + Module als Teaser **ohne** Preise/Summen; Preise stehen nur auf `/pakete` (Link). Keine Bestseller-Optik.
- **Kein Modulstatus:** Modul-Namen auf Rollen-/Paketkarten sind Labels (kein Status); geteilter Footer ohne Status. Kein „Pilot/Im Einsatz/In Entwicklung"-Badge. Die Praxis-Karte „Rehburg-Loccum … Pilotclub" bleibt **wortgleich** (Entwicklungspartner/Fallbeispiel, wie live).
- **Keine erfundenen Zahlen/Versprechen:** Beispiel-UI-Werte (Namen, „39 €", „65 €", Artikel-Daten) illustrativ 1:1 aus dem Mock; Praxis-Artikel sind Platzhalter („Bild folgt", Titel/Datum aus Mock). Keine Ergebnis-/Reichweiten-Zahlen ergänzen.
- **Layout-Tokens der Neufassung wiederverwenden** (Wrap 1180, Radius 12, Sektion 120, H2 48). **Damit ist die Startseite jetzt in der modernen Sprache** – konsistent mit den übrigen Seiten (die site-weite Standardisierung ist damit faktisch vollzogen; Pakete-Seite folgt separat, falls gewünscht).
- **Animationen (volle Freigabe, A11y hart):** Hero-Karten/Toggle, Bento-Mikroanimationen, Rollen-Slider, „Ein Weg"-Aufbau, Reveals – einmal/dezent; **Reduced-Motion → Endzustand**; **ohne JS** alles lesbar (Slider scrollbar); **kein CLS**; Bleed ohne Seiten-Overflow.
- **Route & SEO:** `app/(site)/page.tsx`; `/` bleibt `live`; `mock`/`briefing` in site-structure sind bereits auf 3.1b/0021 gesetzt. Genau **eine `<h1>`**; Canonical. CTA-Ziele über `resolveCta`/`internalHref`: Live-Demo/Erstgespräch aus `.env`; `/plattform`, `/wachstum-vertrieb`, `/clubprozesse`, `/pakete` sind **live** (echte Links); „Praxis"/„Alle Beiträge" → `/praxis` und „So arbeitet GolfNext" → `/plattform/so-arbeitet-golfnext` (noch nicht live → `#`).

## Aufgaben
1. `content/startseite.ts` auf 3.1b umstellen – alle Texte wortgleich; Sektionsdaten typisiert.
2. `components/pages/startseite/` auf 3.1b umbauen – CSS portiert; Bleed-Demo/Bento/Slider/Zeitleiste analog zu den anderen Seiten; alte 0013-Sektionen entfernen.
3. `app/(site)/page.tsx`: neue Abschnitte + `<Footer footerClose={…}/>`, Metadata/Canonical, eine H1.
4. `docs/03` + `docs/entscheidungen.md` aktualisieren (Startseite-Rebuild auf 3.1b, moderne Layout-Sprache jetzt site-weit außer Pakete).

## Skills und Subagents
- Skills: `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
- Subagents: **`text-fidelity`** (wortgleich; Preise nie addieren; keine erfundenen Zahlen; kein Modulstatus; Benennungen), `design-system-guard`, `qa-runner` (Reduced-Motion, ohne JS, kein CLS, Bleed ohne Overflow, kein Overflow @390–1440, axe, Lighthouse mobil ≥95), `seo-auditor` (eine H1, Canonical, interne Links nur `live`/`#`), dann `pr-reviewer`.

## PR und Merge
- Branch `feat/startseite-neufassung`; Briefing mit committen. Gates + CI grün; **Preview gegen 3.1b abgleichen (Desktop + Mobile)**. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `/` entspricht 3.1b in Struktur/Wortlaut/Interaktion; alte Startseite vollständig ersetzt; Texte in `content/startseite.ts`.
- [ ] Paketblock ohne Preise/Summen, Link auf `/pakete`; kein Modulstatus; „Rehburg-Loccum/Pilotclub"-Wortlaut erhalten; keine erfundenen Zahlen.
- [ ] Drei-Teile-Links zeigen echt auf `/plattform` `/wachstum-vertrieb` `/clubprozesse` (live); `/praxis`/`so-arbeitet` als `#`.
- [ ] Animationen laufen; Reduced-Motion → Endzustand; ohne JS lesbar; kein CLS; kein Overflow @390/768/1024/1180/1440 (auch Bleed); eine H1; Canonical.
- [ ] Gates + CI grün; alle vier Subagents ohne FAIL; `docs/03` + `entscheidungen.md` aktualisiert.

## Was du NICHT tust
- Keine Preise/Summen auf der Startseite; kein Modulstatus; die alte 3.1/3.1a nicht verwenden; keine erfundenen Zahlen/Artikel; keine andere Seite; Pakete-Seite nicht anfassen (separater Angleich, falls gewünscht).

## Offene Fragen an Stefan/Fred
- Foto Fred (Zitat/Abschluss), Partner-/Club-Namen final, Praxis-Artikel liefert Fred **[F]**; Live-Demo-URL **[F]**.
- Site-weite Layout-Sprache ist mit dieser Seite faktisch Standard; ob die **Pakete-Seite** noch angeglichen wird, entscheidest du **[S]**.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md, docs/02-preislogik.md und das Briefing docs/briefings/0021-startseite-neufassung.md (liegt
untracked im Ordner – committe es mit deinem Branch). Hol den aktuellen main (git fetch + checkout main +
reset --hard origin/main) und zweige feat/startseite-neufassung ab. REBUILD: Ersetze die bestehende
Startseite durch die Neufassung aus docs/design-system/mocks/3.1b-startseite-neufassung.html (alte 3.1/3.1a
sind Archiv) über die Skills golfnext-page-from-mock, golfnext-design-system, golfnext-qa. Stelle
content/startseite.ts und components/pages/startseite/ komplett auf 3.1b um (alte 0013-Sektionen entfernen),
Texte wortgleich. Baue die acht Abschnitte (Hero mit Bleed-Demo + schwebenden Karten/Platzstatus-Toggle,
Vertrauensleiste, Drei Teile mit Links auf /plattform,/wachstum-vertrieb,/clubprozesse (live), Rollen-Slider,
Ein-Weg-Zeitleiste, Pakete OHNE Preise/Summen mit Link auf /pakete, Vier Zusagen + Fred-Zitat, Praxis mit
Artikel-Platzhaltern) mit der Motion-Infra (einmal/dezent, prefers-reduced-motion -> Endzustand, ohne JS
lesbar, kein CLS, Bleed ohne Overflow). KEIN Modulstatus; „Rehburg-Loccum/Pilotclub"-Wortlaut wortgleich
behalten; keine erfundenen Zahlen (UI-Werte illustrativ aus Mock). Verwende die geteilten modernen Layout-
Tokens (Wrap 1180, Radius 12, Sektion 120, H2 48); Pakete-Seite NICHT anfassen. app/(site)/page.tsx mit
Footer(footerClose), Metadata/Canonical, eine h1; / bleibt live. Aktualisiere docs/03 und
docs/entscheidungen.md. Rufe danach text-fidelity, design-system-guard, qa-runner und seo-auditor auf und
behebe deren FAILs. E2E für / anpassen/erweitern. PR nach dem Template, CI grün (beide Jobs Pflicht),
Preview gegen 3.1b abgleichen (Desktop+Mobile), dann pr-reviewer. Schließe mit der dreisätzigen
Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
