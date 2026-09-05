# Workflow

Arbeitsmodell für die Umsetzung mit Claude Code, übernommen aus Stefans Projekten und auf GolfNext angepasst.

## Build-Sequenz

Die Reihenfolge steht in `docs/00-masterplan.md` (Phasen 0 bis 7). Kurzform:

1. Fundament (dieses Paket): Tokens, Config, Struktur, Doku, Skills, Agents.
2. Grundgerüst: Next.js, Fonts, Marke, Vercel, Playwright, CI, `site-structure.ts`, `content/`-Muster.
3. Layout-Shell und UI-Kit: Header, Footer-Systemkarte, Primitives, Zustände.
4. Seiten aus den Mocks, Reihenfolge nach Verkaufsrelevanz: Pakete → Startseite → Plattform → So arbeitet GolfNext → Wachstum & Vertrieb → Clubprozesse → Über GolfNext.
5. Sanity-Content-Modell, Studio unter `/studio`, Ratgeber, FAQ.
6. Formulare (SendGrid), Zustände, Danke-Signal.
7. Recht und Einwilligung, Tracking-Plan.
8. SEO-Layer, Sitemap, JSON-LD, Weiterleitungen.
9. Abnahme und Launch nach `docs/10-launch-umfang.md`.

## Branches, PR, CI

`main` ist deploybar. Feature-Branch je Baustein oder Seite (`feat/<baustein>`) → PR mit `.github/pull_request_template.md` →
CI (`.github/workflows/ci.yml`: Typecheck, Lint, Unit, Build, Playwright, a11y, visuell) → Vercel-Preview ansehen → `pr-reviewer` → Merge.
Env-Variablen in Vercel, nicht im Repo.

## Deploy und Revalidate

Vercel über GitHub-Integration. Content-Änderung in Sanity → Webhook → `/api/revalidate` (Signaturprüfung).

## Arbeitsweise: Orga-Chat ↔ Umsetzungs-Chat

```
[ORGA-CHAT]  liest Masterplan und Spec, schreibt Briefing (.md) + kopierbaren Umsetzungs-Prompt.
             Implementiert nie selbst.  (Slash-Command: /naechster-schritt)
     ↓
[UMSETZUNGS-CHAT]  baut den Baustein über die Skills, ruft die Subagents auf,
             Branch → PR → CI grün → Review → Merge, schreibt die dreisätzige Zusammenfassung.
     ↓
[ORGA-CHAT]  wertet die Zusammenfassung aus: Akzeptanzkriterien erfüllt? Loose Ends? Scope-Drift?
             Spec ggf. aktualisieren (Masterplan-Haken, entscheidungen.md). Wenn ok: nächste Iteration.
```

Briefings liegen in `docs/briefings/` (Vorlage: `docs/briefings/README.md`). Master-Spec (Wahrheitsquelle) =
`CLAUDE.md` + `docs/design-system/` (Tokens, Mocks, Briefings von Fred) + `config/site-structure.ts` + `docs/02-preislogik.md`.

## Qualitätskontrolle über Subagents (`.claude/agents/`)

| Agent | Wann | Prüft |
|---|---|---|
| `design-system-guard` | nach jeder UI-Änderung | Tokens, Grün-Regel, Fonts, Radius, Icon-Größen, Bewegungsregeln, Zeichensetzung, Zustände |
| `text-fidelity` | nach jeder Seite/Sektion/Content-Datei | Wortgleichheit mit Freds Briefing, Interna nicht veröffentlicht, Benennungen, Preise, keine erfundenen Zahlen |
| `qa-runner` | vor Abschluss eines Schritts | Playwright-Routine, ohne JS, Reduced Motion, Zustände, axe, visuelle Regression |
| `seo-auditor` | nach Route/Navigation/Verlinkung | Metadata, H1, nur existierende Links, JSON-LD, Sitemap/robots, Redirects |
| `sanity-schema-writer` | wenn ein Content-Typ gebraucht wird | schreibt Schema code-first, typegen, Doku-Eintrag |
| `pr-reviewer` | vor jedem Merge | Akzeptanzkriterien, Scope-/Phasen-Disziplin, Gates; delegiert an die anderen |

Slash-Commands: `/qa <route>`, `/text-check <seite>`, `/review <briefing>`, `/naechster-schritt`.

## Prozess-Regeln

- **Texte sind Daten.** Alle Websiteinhalte einer Seite liegen in `content/<seite>.ts`, aus dem Briefing extrahiert (nur „Websiteinhalt").
  Komponenten enthalten keine freien Inhaltstexte. Fred-Korrekturen sind Ein-Datei-Änderungen; `text-fidelity` prüft gegen das Briefing.
- **Mock-CSS wird portiert, nicht neu erfunden.** Sektionsspezifisches CSS aus dem Mock kommt als `*.module.css` ins Projekt (Token-Namen
  auf `--gn-…` umgestellt). Tailwind nur für Layout-Primitives, Zustände und neue Bausteine. Das hält die Umsetzung nah am freigegebenen Bild.
- **Sanity code-first.** Schema im Code, Deploy als definierter Schritt. Der Sanity-MCP inspiziert und fragt ab – er legt nichts an.
- **Zeichensetzung bleibt.** Halbgeviertstrich `–` und „…" stammen aus Freds Texten und werden nicht „normalisiert". (Anders als in anderen Projekten.)
- **Nur existierende Routen verlinken.** Status in `config/site-structure.ts`; Praxis, Team, Kontakt, Modulseiten warten auf Briefings.
- **Nichts erfinden.** Fehlt ein Text, Bild, Preis oder Briefing: Platzhalter-Baustein oder Rückfrage, nie Improvisation.
- **Kleine PRs.** Ein Baustein oder eine Seite je Branch.

## Wiederverwendbarer Orga-Startprompt

Neuen Orga-Chat öffnen (Claude Code im Projektordner), Block kopieren, nur den `>>>`-Abschnitt anpassen.

```
Du bist der ORGANISATIONS-/STRATEGIE-CHAT für die GolfNext-Marketing-Website.
Du schreibst Briefings und wertest Umsetzungs-Ergebnisse aus, du implementierst NICHT selbst.

PROJEKT (Basis)
GolfNext Marketing-Website (Repo: github.com/AImitSK/golfnext-marketingseite; lokal:
C:\Users\StefanKühne\Desktop\Projekte\GolfNext Marketing-Seite). Neue Website für GolfNext
(Fred Hoffmann) auf Next.js App Router, TS strict, Tailwind v4, motion/react; Sanity CMS
(Ratgeber, Rubriken, Autoren, FAQ), Studio unter /studio; Vercel; SendGrid. Die HTML-Mocks unter
docs/design-system/mocks/ und Freds Briefings unter docs/design-system/briefings/ sind verbindlich.
Preise nach docs/02-preislogik.md (Fassung 2), nie addieren.

>>> PRO ITERATION ANPASSEN <<<
- Baustein/Vorhaben: <z. B. Phase 1.3 Header>
- Masterplan-Schritt: <Nummer aus docs/00-masterplan.md>
- Briefing-Ablage: docs/briefings/NNNN-<baustein>.md
- Branch: feat/<baustein>
- NÄCHSTER SCHRITT: <konkret>
>>> ENDE ANPASSEN <<<

ZUERST LESEN
1. CLAUDE.md (verbindliche Regeln: Texte wortgleich, Preise, Grün-Regel, Bewegung, Datenschutz, Zustände).
2. docs/00-masterplan.md (Sequenz, Haken, [S]/[F]-Abhängigkeiten) und docs/workflow.md (dieser Loop).
3. docs/design-system/README.md, das Briefing und der Mock der betroffenen Seite.
4. config/site-structure.ts, docs/01-architektur.md, docs/08-zustaende-und-feedback.md; je nach Vorhaben
   docs/04 (Sanity), docs/05 (Consent), docs/06 (Formulare), docs/07 (SEO), docs/09 (Tracking).

DER ARBEITS-LOOP
1. Schreibe ein Briefing als .md in docs/briefings/ für den nächsten Baustein (Vorlage: docs/briefings/README.md).
2. Danach einen SEPARATEN, kopierbaren Umsetzungs-Prompt (Code-Block), der aufs Briefing verweist,
   die Skills und Subagents nennt und am Ende die dreisätzige Zusammenfassung fordert.
3. Stefan startet einen frischen Umsetzungs-Chat: baut über die Skills, ruft die Subagents auf,
   Branch → PR → CI grün → pr-reviewer → Merge, schreibt Zusammenfassung.
4. Stefan bringt die Zusammenfassung zurück. Auswerten: Akzeptanzkriterien erfüllt? Loose Ends?
   Scope-/Phasen-Drift? Masterplan-Haken setzen, Spec ggf. aktualisieren. Wenn ok: nächste Iteration.

KONVENTIONEN IN JEDES BRIEFING
- Bauen IMMER über die Skills (golfnext-design-system, golfnext-page-from-mock, golfnext-qa,
  sanity-content-model, sendgrid-forms; /motion für Bewegung).
- Subagents nutzen: design-system-guard, text-fidelity, qa-runner, seo-auditor, sanity-schema-writer, pr-reviewer.
- Gates: pnpm typecheck/lint/test/build vor PR; CI grün; Preview angesehen.
- Texte als Daten in content/<seite>.ts, wortgleich mit dem Briefing; Mock-CSS als CSS-Module portieren.
- Sanity code-first; MCP nur lesend. Nur Routen mit Status live verlinken.
- Deutsch, Sie-Form; Halbgeviertstrich und „…" aus den Briefings bleiben erhalten.
- Jedes Briefing: Kontext + Lesereihenfolge, harte Vorgaben, Aufgaben, PR & Merge,
  Akzeptanzkriterien, „Was du NICHT tust" (Scope), plus kopierbaren Umsetzungs-Prompt.

DEINE ERSTE AUFGABE
Lies die Dateien oben. Schreibe (a) das Briefing für den NÄCHSTEN SCHRITT in docs/briefings/
und (b) den kopierbaren Umsetzungs-Prompt. Bei Lücken im Spec: nachfragen, nicht improvisieren.
```
