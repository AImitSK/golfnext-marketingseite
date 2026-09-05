# 0010 · Bausteinseite (Abschluss Phase 1)

Masterplan-Schritt: 1.9 · Branch: `feat/bausteinseite` · Phase: 1

Der Abschluss der Komponenten-Phase: `/_bausteine` als vollständige, geordnete Referenz aller
Phase-1-Bausteine zum Abgleich mit dem UI-Kit `2.5`, **nur in Preview sichtbar** (in Produktion 404).
Überwiegend Finalisierung/Organisation – `/_bausteine` ist über 1.1–1.8 gewachsen.

**Vorbedingung:** 1.8 (`feat/zustaende`) ist auf `main`. `feat/bausteinseite` zweigt vom aktuellen `main` ab.

## Kontext und Lesereihenfolge
1. `CLAUDE.md`; `docs/00-masterplan.md` – Schritt 1.9; `docs/workflow.md`.
2. Skill `golfnext-design-system`, `golfnext-qa`.
3. Mock `docs/design-system/mocks/2.5-ui-kit.html` – die **Vergleichsvorlage** (Abschnitte/Reihenfolge des UI-Kits).
4. Die bestehende Route `app/(preview)/_bausteine/` (Ist-Stand aus 1.1–1.8).

## Harte Vorgaben
- **Nur in Preview sichtbar:** In Produktion (`process.env.VERCEL_ENV === "production"`) rendert die Route `notFound()`; in Entwicklung und Preview ist sie sichtbar. `noindex`-Metadata bleibt zusätzlich bestehen. Keine Verlinkung aus der Website, kein Sitemap-Eintrag.
- **Vollständigkeit gegen 2.5:** Alle in Phase 1 gebauten Bausteine sind vertreten — Layout-Primitives (Section/Wrap/Eyebrow/Lead/Statement/Hint), Buttons/Links/Chip/Badge, Header, Footer, Shot/Portrait, FAQ, Bewegung, Zustände/Formularfelder. Fehlt eine bereits gebaute Komponente oder ein Zustand, ergänzen. **Keine neuen, seiten-spezifischen Bausteine bauen** (Karten, Statuszeilen, Zahlenblöcke, Hero-Grafiken sind Phase 2).
- **Geordnet und beschriftet:** Abschnitte mit `<h2>` in der Reihenfolge des UI-Kits, genau **eine `<h1>`** („Bausteine"). Demo-Texte neutral (keine Fred-Marketingtexte); Katalogtexte aus `lib/*/messages.ts`.
- **Kein Eingriff ins Root-Layout, keine echten Seiten, keine neuen Tokens.** Zeichensetzung `–`/„…".

## Aufgaben
1. **Preview-Gating** der Route (`notFound()` in Produktion, sichtbar in dev/preview); `noindex` beibehalten.
2. **Ordnen/vervollständigen:** `/_bausteine` in klar beschriftete Abschnitte gliedern (Reihenfolge nach 2.5), jede Phase-1-Komponente in ihren relevanten Varianten/Zuständen zeigen; Lücken gegen 2.5 schließen.
3. **Visueller Abgleich** gegen `2.5-ui-kit.html` (qa-runner/visuelle Regression bzw. Screenshot-Vergleich). Bewusste Abweichungen (die dokumentierten aus 1.1–1.8) auflisten.
4. **Abschluss-QA Phase 1:** ein E2E, das die Existenz aller Abschnitte prüft; Overflow @390/768/1024/1180/1440; ohne JS lesbar; axe ohne AA-Verstoß; keine Konsolenfehler.
5. **`docs/entscheidungen.md`**: „1.9 — /_bausteine Preview-only (Produktion 404); vollständige Komponenten-Referenz; Phase 1 abgeschlossen." Masterplan-Haken 1.9.

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`.
- Subagents: `design-system-guard` (Gesamtabgleich Tokens/Grün-Regel/Icon-Größen/Zeichensetzung), `qa-runner` (voller Sweep über `/_bausteine`, visueller Abgleich gegen 2.5), `seo-auditor` (Preview-only + noindex, nicht in Sitemap, keine externen Links), dann `pr-reviewer`.
- `text-fidelity` nur, falls neue Texte hinzukommen (sonst nicht nötig) – im PR begründen.

## PR und Merge
- Branch `feat/bausteinseite` vom aktuellen `main`; Briefing liegt mit im Branch. Commits deutsch, Imperativ.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün.
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), Preview ansehen (jetzt besonders: Screenshot-Abgleich gegen 2.5), `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `/_bausteine` ist in Produktion **nicht** erreichbar (`notFound()`), in dev/preview vollständig sichtbar; `noindex`; nicht in Sitemap/Navigation.
- [ ] Alle Phase-1-Bausteine sind geordnet und beschriftet vertreten; genau eine `<h1>`; Abschnitte als `<h2>`.
- [ ] Visueller Abgleich gegen `2.5-ui-kit.html` durchgeführt; verbleibende Abweichungen sind die dokumentierten.
- [ ] Kein Overflow @390/768/1024/1180/1440; ohne JS lesbar; axe ohne AA-Verstoß; keine Konsolenfehler.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; `design-system-guard`, `qa-runner`, `seo-auditor` ohne FAIL; Eintrag in `entscheidungen.md`; Masterplan 1.9 abgehakt.

## Was du NICHT tust
- Keine neuen, seiten-spezifischen Komponenten (Karten/Statuszeilen/Zahlen/Hero-Grafiken → Phase 2), keine echten Seiten, keine Layout-Shell-Einbindung, kein Sanity/Formular/Consent.
- Keine neuen Tokens/Farben; `config/site-structure.ts`/`content/*`/Mocks nicht ändern; keine Fred-Marketingtexte in die Demo.

## Offene Fragen an Stefan/Fred (Phase-2-Gate, nach diesem Schritt)
- **Launch-Umfang v1 entscheiden** (`docs/10-launch-umfang.md`): Weg A (vollständig) oder **Weg B (schlank, empfohlen)** **[S][F]** – ohne diese Entscheidung startet Phase 2 nicht.
- Bei Weg B: ausgeblendete Sektionen je Seite als `flags` in `config/site-structure.ts` hinterlegen.
- Kanonische Domain (`www` vorgeschlagen) **[S]**; alte URLs erheben und in `03-seiten-und-routen.md` eintragen **[S]**.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0010-bausteinseite.md. Voraussetzung: 1.8 ist auf main;
zweige feat/bausteinseite vom aktuellen main ab. Setze das Briefing vollständig um. Baue über die Skills
golfnext-design-system und golfnext-qa. Gate die Route /_bausteine auf Preview: in Produktion
(process.env.VERCEL_ENV === "production") notFound(), in dev/preview sichtbar, noindex bleibt. Ordne und
vervollständige /_bausteine als beschriftete Referenz ALLER Phase-1-Bausteine in der Reihenfolge von
2.5-ui-kit.html (genau eine h1, Abschnitte als h2), ohne neue seiten-spezifische Komponenten zu bauen.
Führe den visuellen Abgleich gegen 2.5 durch und liste verbliebene (dokumentierte) Abweichungen.
Ergänze ein E2E für die Abschnitts-Vollständigkeit. Trag die Entscheidung in docs/entscheidungen.md ein
und hake Masterplan 1.9 ab. Rufe danach design-system-guard, qa-runner und seo-auditor auf und behebe
deren FAILs (text-fidelity nur bei neuen Texten). PR nach dem Template, CI grün (beide Jobs Pflicht),
Preview mit Screenshot-Abgleich gegen 2.5 ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
