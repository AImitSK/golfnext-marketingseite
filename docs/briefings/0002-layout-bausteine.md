# 0002 · Layout-Bausteine (Primitives)

Masterplan-Schritt: 1.1 · Branch: `feat/layout-bausteine` · Phase: 1

Erster Baustein der Phase 1. Ziel: die **Primitives**, auf denen Header, Footer und alle Seiten
aufsetzen – `Section`, `Wrap`, `Eyebrow`, `Lead`, `Statement`, `Hint`. Kleiner, sauber reviewbarer PR.
Keine Seiten, kein Header/Footer, keine Buttons (das sind 1.2 ff.).

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Regeln: Grün-Regel, Typografie, `.hint`-Icon 15 px fix, Zeichensetzung, Bewegung).
2. `docs/00-masterplan.md` – Phase 1, Schritt 1.1; `docs/workflow.md` (Loop, Prozess-Regeln: „Mock-CSS wird portiert, nicht neu erfunden").
3. Skill `golfnext-design-system` (Tokens, Bausteine, typische Fehler).
4. `docs/design-system/tokens/tokens.css` (die `--gn-*`-Tokens) und `docs/design-system/tokens/tailwind-theme.css` (die bestehende `@theme`-Ebene in `app/globals.css`).
5. Mock-CSS der Primitives (identisch über alle Seitenmocks – Referenzzeilen):
   - `.pwrap`, `.psec`, `.psec.sand`, `.psec.mist`, `.eyebrow`, `.psec h2`, `.psec .lead` → `docs/design-system/mocks/3.1-startseite.html` (Zeilen 33–39) inkl. Media-Queries (≤960 px Gutter 26, ≤620 px Gutter 20 / `.psec` 58 px).
   - `.hint`, `.hint svg`, `.statement3` → `docs/design-system/mocks/3.7-pakete.html` (Zeilen 67–68, 85) und die Dark-Varianten `.dark-sec .hint / .statement3` in `docs/design-system/mocks/3.5-clubprozesse.html` (Zeilen 90, 401–402).
6. `docs/08-zustaende-und-feedback.md` nur überfliegen (Zustände kommen erst in 1.8).

## Harte Vorgaben
- **Token-Ebene `--gn-*` anlegen.** CLAUDE.md schreibt vor, dass portiertes Modul-CSS Tokens auf `--gn-…` verwendet. Diese Ebene fehlt noch in der App. Deshalb: den kompletten `:root{ --gn-… }`-Block aus `docs/design-system/tokens/tokens.css` **wertgleich** nach `app/globals.css` übernehmen (Farben, Flächen, Text/Linien, Status, Dark, Stufen, Schrift, Skala, Radien, Layout `--gn-wrap/--gn-gutter/--gn-section-y/--gn-header-h`, Bewegung `--gn-ease/--gn-dur`). Die bestehende `@theme { --color-* }`-Ebene für Tailwind-Utilities **bleibt unverändert daneben stehen**. Keine Werte ändern, nichts ergänzen. (Kurze Notiz in `docs/entscheidungen.md`: „--gn-*-Tokenebene für Modul-CSS neben @theme --color-* eingeführt, 1.1".)
- **Mock-CSS portieren, nicht neu erfinden.** Jedes Primitive bekommt ein co-lokiertes CSS-Modul, dessen Werte **1:1** aus dem Mock stammen; Mock-Kurznamen (`var(--sand)`, `var(--navy)` …) werden auf die `--gn-*`-Namen umgestellt. Kein Tailwind-Neuschrieb der Sektions-Optik.
- **Grün-Regel:** `--gn-signal` nur als Fläche/Punkt/Linie oder Text auf Navy. Der grüne Balken von `Statement` ist eine Linie (`border-left`) – erlaubt. Kein grüner Text auf hellem Grund.
- **Hint-Icon 15 px fix:** ein SVG mit `width="15" height="15"` (nicht skalierend), `flex:0 0 auto`, `margin-top:4px`, `aria-hidden`. Icon-Quelle: das Info-Icon aus der `.hint`-Verwendung eines Mocks (z. B. `3.7-pakete.html`) übernehmen.
- **Typografie über Tokens:** H2 `var(--gn-h2)`, Lead `var(--gn-lead)`, Eyebrow 12.5 px/`.18em`/`--gn-blue`, Statement `var(--gn-statement)`/Archivo 700/`border-left 3px --gn-signal`. `text-wrap: balance` auf Headlines.
- **Server-Komponenten.** Alle sechs Primitives sind reine RSC ohne `'use client'` und ohne JS. Keine Bewegung in diesem Schritt (Motion ist 1.7).
- **Zeichensetzung** aus den Vorlagen bleibt (`–`, „…") – Demo-Texte in dieser Sprache halten.

## Aufgaben
1. **Tokens:** `--gn-*`-Block aus `tokens.css` in `app/globals.css` einfügen (siehe Harte Vorgaben). Optional die Basis-Headline-Größen auf Tokens heben (`h1 var(--gn-h1)`, `h2 var(--gn-h2)`, `h3 var(--gn-h3)`, `text-wrap:balance`), ohne die vorhandenen Basis-Styles zu verändern.
2. **Komponenten** unter `components/ui/` je mit co-lokiertem `*.module.css` (Werte aus dem Mock, `--gn-*`):
   - `Section.tsx` – rendert `<section>`; Prop `variant?: "paper" | "sand" | "mist"` (default paper), vertikales Padding `--gn-section-y` (≤620 px 58 px); Prop `as?` optional. Descendant-Styles für `h2` (`var(--gn-h2)`, `max-width:22ch`, `margin-bottom:16px`) und `.lead` wie im Mock, **oder** über die Komponenten `Lead`/Headings gelöst – Hauptsache das Ergebnis entspricht `.psec` aus dem Mock.
   - `Wrap.tsx` – `max-width:var(--gn-wrap)` (1140 px), `margin:0 auto`, Gutter `--gn-gutter` (40 → 26 ≤960 px → 20 ≤620 px). Prop `className?` durchreichen.
   - `Eyebrow.tsx` – `<p>`/`<span>`, uppercase, `.18em`, 12.5 px, 600, `--gn-blue`, `display:block`, `margin-bottom:14px`. Prop `onDark?` → Farbe `--gn-signal` (Eyebrow auf Navy).
   - `Lead.tsx` – `var(--gn-lead)`, `--gn-muted`, `max-width:62ch`.
   - `Statement.tsx` – Archivo 700, `var(--gn-statement)`, `--gn-navy`, `-.02em`, `padding-left:20px`, `border-left:3px solid --gn-signal`, `line-height:1.34`, `max-width:36ch`. Prop `onDark?` → Textfarbe weiß (`.dark-sec .statement3`).
   - `Hint.tsx` – `<div>` mit fixem 15-px-Info-Icon + Text (13.5 px, `--gn-muted`, `max-width:72ch`, `gap:9px`, `align-items:flex-start`). Prop `onDark?` → Text `--gn-on-dark-text`, Icon `--gn-sky`. `children` = Hinweistext.
3. **Preview-Fläche:** interne Route `app/(preview)/_bausteine/page.tsx` (Route `/_bausteine`) anlegen: `noindex` über `export const metadata = { robots: { index:false, follow:false } }`, nicht in Navigation/Sitemap, nur per Direkt-URL. Dort die sechs Primitives in `paper`, `sand`, `mist` und je eine `onDark`-Variante zeigen (Demo-Texte, keine Fred-Inhalte). Diese Seite wächst in 1.2–1.8 mit; sie ist der spätere „Bausteine"-Nachweis aus 1.9.
4. **Barrierefreiheit:** genau eine `<h1>` auf `/_bausteine` (z. B. „Bausteine"), Abschnitte als `<h2>`; Hint-Icon `aria-hidden`, keine Icon-Only-Bedienelemente.

## Skills und Subagents
- Skills: `golfnext-design-system` (verbindlich), `golfnext-qa` (für die QA-Runde).
- Subagents nach dem Bauen: `design-system-guard` (Tokens, Grün-Regel, Fonts, Radius, Icon-15 px, Zeichensetzung), `qa-runner` (Overflow/Icons/Reduced-Motion/ohne-JS/Konsole auf `/_bausteine`), dann `pr-reviewer`.
- `text-fidelity` und `seo-auditor` sind hier **nicht** nötig (keine Fred-Texte, keine öffentliche Route/Verlinkung) – im PR kurz begründen.

## PR und Merge
- Branch `feat/layout-bausteine` (dieses Briefing liegt mit im Branch). Commits deutsch, Imperativ, ein Thema je Commit.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` grün, dann `pnpm test:e2e` (Smoke bleibt grün).
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs sind Pflicht auf `main`), Vercel-Preview ansehen, `pr-reviewer`, dann Merge. `main` ist geschützt: Merge nur über PR mit grüner CI.

## Akzeptanzkriterien
- [ ] `app/globals.css` enthält die vollständige `--gn-*`-Ebene wertgleich zu `tokens.css`; `@theme --color-*` unverändert; Eintrag in `docs/entscheidungen.md`.
- [ ] `Section`, `Wrap`, `Eyebrow`, `Lead`, `Statement`, `Hint` existieren unter `components/ui/` als RSC mit co-lokierten CSS-Modulen; Werte 1:1 aus dem Mock, Tokens als `--gn-*`.
- [ ] `/_bausteine` rendert alle sechs Primitives inkl. `sand`/`mist`/`onDark`; Seite liefert `noindex`, ist nicht in Navigation/Sitemap.
- [ ] Hint-Icon ist exakt 15 × 15 px (nicht skalierend); kein SVG > 90 px auf der Seite.
- [ ] Kein horizontaler Overflow bei 390 / 768 / 1024 / 1180 / 1440; keine Konsolenfehler; Seite ohne JavaScript vollständig lesbar; Reduced-Motion o. B.
- [ ] Genau eine `<h1>` auf `/_bausteine`; Kontraste WCAG AA (Grün-Regel eingehalten).
- [ ] `pnpm typecheck/lint/test/build` grün; CI grün; `design-system-guard` und `qa-runner` ohne FAIL.

## Was du NICHT tust
- Keine `Button`/`TextLink`/`Pill`/`Chip`/`Badge` (das ist 1.2), kein Header (1.3), kein Footer (1.4), kein `Shot`/`Portrait` (1.5), keine FAQ (1.6), keine Motion (1.7), keine Zustände/Formularfelder (1.8).
- Keine echten Seiten aus `content/`/Mocks, keine Fred-Texte, keine erfundenen Inhalte.
- Keine neuen Farben, Radien oder Tokenwerte; `@theme`-Werte nicht anfassen; Mocks/Briefings/Rechtstexte nicht ändern.
- Keine Verlinkung von `/_bausteine` aus der Website; kein Eintrag in `config/site-structure.ts`.

## Offene Fragen an Stefan/Fred
- Keine. (Bewusste, dokumentierte Abweichung vom Masterplan: `/_bausteine` entsteht bereits hier statt erst in 1.9, damit die Primitives ab sofort visuell prüfbar sind und jeder Folgeschritt seine Bausteine ergänzt.)

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0002-layout-bausteine.md. Setze es vollständig um,
Aufgabe für Aufgabe. Baue über die Skills golfnext-design-system und golfnext-qa. Portiere das
Primitive-CSS 1:1 aus den Mocks als co-lokierte CSS-Module (Tokens auf --gn-*, keine Werte ändern)
und lege die --gn-*-Tokenebene in app/globals.css an (aus docs/design-system/tokens/tokens.css),
ohne die @theme --color-*-Ebene zu verändern. Erstelle die Preview-Route /_bausteine (noindex).
Rufe danach die Subagents design-system-guard und qa-runner auf und behebe deren FAILs; text-fidelity
und seo-auditor sind hier nicht nötig (im PR begründen). Branch feat/layout-bausteine (das Briefing
liegt mit im Branch). Vor dem PR pnpm typecheck/lint/test/build und pnpm test:e2e grün. PR nach
.github/pull_request_template.md, CI grün (beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
