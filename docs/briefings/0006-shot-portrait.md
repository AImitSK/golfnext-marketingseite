# 0006 · Platzhalter Shot und Portrait

Masterplan-Schritt: 1.5 · Branch: `feat/shot-portrait` · Phase: 1

Die beschrifteten Bild-Platzhalter: `Shot` (für fehlende Produkt-Screenshots) und `Portrait`
(Porträt-Platzhalter groß 4/5 und klein 46 px rund). **Nie** Stock/KI/erfundene Oberflächen –
fehlende Bilder werden ausschließlich als beschriftete Platzhalter gebaut (CLAUDE.md).

**Vorbedingung:** 1.4 (`feat/footer`) ist auf `main`. `feat/shot-portrait` zweigt vom aktuellen `main` ab.

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Regel: fehlende Bilder als beschriftete Platzhalter über `<Shot />`, niemals Stock/KI).
2. `content/README.md` (wichtig: die „Benötigtes Bild: …"-Beschreibung ist **kein Websiteinhalt** und darf **nur in Preview** erscheinen).
3. Skill `golfnext-design-system` („typische Fehler": große leere Foto-Platzhalter klein halten oder weglassen).
4. Mock (verbindlich, 1:1 portieren) `docs/design-system/mocks/3.8-ueber-golfnext.html`:
   - `Shot`: **72–82** (`.shot`, `::before` gestrichelte Innenlinie, `.tagline`, `.desc b`=Titel, `.desc span`=Text, plus `.shot.dark`-Variante 78–82).
   - `Portrait` groß: **165–172** (`.portrait`, `.pf` `aspect-ratio:4/5`, `::before` gestrichelt, `.pf svg` Personen-Icon 44 px, `.pf .tag`, `.pn` Name, `.pr` Rolle) und Responsive **181/183**.
5. `docs/03-seiten-und-routen.md` (Liste der benötigten Screenshots – nur zur Orientierung, nichts daraus hartkodieren).

## Harte Vorgaben
- **`Shot` rendert genau die `.shot`-Optik:** Sand-Fläche, gestrichelte Innenlinie (`::before`), Tagline oben links, Beschreibung unten (`title` fett + `text` muted), festes Seitenverhältnis über Prop. Props: `ratio` (z. B. `"16/10"`), `tagline`, `title`, `text`, `dark?`.
- **`Portrait` zwei Varianten:** `size="large"` = `.pf` 4/5 mit Personen-Icon 44 px, optional `tag`, darunter `pn` (Name) + `pr` (Rolle); `size="small"` = **46 px rund** in derselben Bildsprache (Personen-Icon, Sand→Mist-Verlauf, gestrichelte/feine Kontur, `border-radius:50%`). Die kleine Variante ist im Mock nicht abgebildet – konsistent zur großen ableiten, nichts erfinden, was über „leerer Personen-Platzhalter" hinausgeht.
- **Kein echtes Bild, kein `next/image`- Src, kein Stock/KI.** Nur der beschriftete Platzhalter. Personen-Icon als Inline-SVG mit fixer Größe.
- **Preview-Regel:** Die interne „Benötigtes Bild"-Beschreibung darf nicht in Produktion sichtbar sein. Da hier nur die **Bausteine** entstehen (Demo auf `/_bausteine`, noindex), genügt es, die Regel als Kommentar an der Komponente zu dokumentieren; die preview-only-Steuerung je Verwendung entscheidet Phase 2. Die sichtbaren Props (`tagline/title/text`, `tag/name/role`) rendert die Komponente wie übergeben.
- **Grün-Regel/Tokens:** `--gn-*`; `.shot.dark` nutzt sky/weiß auf dunkel (erlaubt). Mock-CSS als co-lokierte Module portieren, literale Werte (`rgba(1,65,91,.22)` etc.) kommentieren.
- **A11y:** dekorative Platzhalter-Icons `aria-hidden`; der Platzhalter darf keinen falschen `alt`/kein `<img>` vortäuschen. Kein SVG > 90 px außer bewussten Grafiken (Personen-Icon 44 px ist ok).

## Aufgaben
1. **`components/ui/Shot.tsx`** (+ `.module.css`): Props `ratio, tagline, title, text, dark?`. `aspect-ratio` aus `ratio` (Höhe reservieren → kein CLS). Struktur/Optik exakt `.shot`.
2. **`components/ui/Portrait.tsx`** (+ `.module.css`): Prop `size: "large" | "small"`, `name?`, `role?`, `tag?`. `large` = 4/5 nach `.portrait/.pf`; `small` = 46 px rund, konsistent abgeleitet. Personen-Icon als Inline-SVG.
3. **`/_bausteine` erweitern:** Abschnitt „Platzhalter" mit mehreren `Shot` (verschiedene `ratio`, hell und `dark` in einem Navy-Block) und `Portrait` (large + small), mit Demo-Beschriftungen (keine Fred-Inhalte, keine erfundenen Bildinhalte).
4. **`docs/entscheidungen.md`**: „1.5 — kleines 46-px-Rund-Portrait aus der großen Porträt-Bildsprache abgeleitet (kein Mock vorhanden); Shot-Beschreibung nur-Preview-Regel als Komponentenkommentar dokumentiert (Steuerung je Verwendung in Phase 2)."

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`.
- Subagents nach dem Bauen: `design-system-guard` (Tokens, Icon-Größe, dark-Variante, Zeichensetzung), `qa-runner` (Overflow @5 Breakpoints, kein CLS durch reserviertes Ratio, ohne-JS, axe), dann `pr-reviewer`.
- `text-fidelity`/`seo-auditor` nicht nötig (keine Fred-Fließtexte, keine Routen/Links) – im PR begründen.

## PR und Merge
- Branch `feat/shot-portrait` vom aktuellen `main`; Briefing liegt mit im Branch. Commits deutsch, Imperativ.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün.
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), Preview ansehen, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `Shot` exakt nach `.shot` (Sand, gestrichelte Innenlinie, Tagline, Titel+Text), `ratio`-Prop reserviert die Höhe (kein CLS), `dark`-Variante korrekt und AA-lesbar.
- [ ] `Portrait` `large` (4/5, Personen-Icon, Name/Rolle/Tag) und `small` (46 px rund) konsistent; kein echtes Bild/Stock/KI.
- [ ] `/_bausteine` zeigt beide in mehreren Varianten (inkl. dark); kein Overflow @390/768/1024/1180/1440; ohne JS lesbar; keine Konsolenfehler; axe ohne AA-Verstoß.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; `design-system-guard`, `qa-runner` ohne FAIL; Eintrag in `entscheidungen.md`.

## Was du NICHT tust
- Keine FAQ (1.6), keine `motion/react`-Animationen (1.7), keine Zustände (1.8), keine echten Seiten/Screenshots (Phase 2/7).
- Kein `<img>`/`next/image`/Stock/KI/erfundene Oberflächen; keine echten Bildinhalte erfinden; nichts aus `docs/03` hartkodieren.
- `config/site-structure.ts`/`content/*` nicht ändern; keine neuen Tokens; nicht ins Root-Layout eingreifen.

## Offene Fragen an Stefan/Fred
- Keine (die kleine Porträt-Variante ist mangels Mock aus der großen abgeleitet, dokumentiert).

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0006-shot-portrait.md. Voraussetzung: 1.4 ist auf main;
zweige feat/shot-portrait vom aktuellen main ab. Setze das Briefing vollständig um. Baue über die Skills
golfnext-design-system und golfnext-qa. Portiere Shot (.shot inkl. dark) und Portrait groß (.pf 4/5) 1:1
aus 3.8-ueber-golfnext.html als co-lokierte CSS-Module (Tokens --gn-*, literale Werte kommentiert); leite
die kleine 46-px-runde Portrait-Variante konsistent aus der großen ab (kein Mock vorhanden). Nur
beschriftete Platzhalter, KEIN <img>/next/image/Stock/KI. ratio-Prop reserviert die Höhe (kein CLS).
Dokumentiere die „Benötigtes Bild"-nur-Preview-Regel als Komponentenkommentar. Erweitere /_bausteine um
einen Abschnitt „Platzhalter" (Shot hell/dark in mehreren Ratios, Portrait large+small). Trag die
Entscheidungen in docs/entscheidungen.md ein. Rufe danach design-system-guard und qa-runner auf und
behebe deren FAILs (text-fidelity/seo-auditor nicht nötig, im PR begründen). PR nach dem Template, CI
grün (beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
