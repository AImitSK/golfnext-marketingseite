# 0004 · Header (Navigation)

Masterplan-Schritt: 1.3 · Branch: `feat/header` · Phase: 1

Der Kopfbereich aller Seiten: sticky Header mit Wortmarke, Hauptnavigation nach 2.4, zwei
Modul-Dropdowns (Plattform, Clubprozesse), aktive Seite mit grüner Unterlinie, CTA rechts, und
unter 1024 px Burger + Vollbild-Menü. Tastaturbedienbar und **ohne JavaScript** benutzbar.

**Vorbedingung:** 1.2 (`feat/buttons-links`) ist auf `main`. `feat/header` zweigt vom aktuellen `main` ab.
Der Header nutzt `Button` (Variante `hbtn`), `Badge` und `Wortmarke` – alle vorhanden.

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (nur `live`-Routen verlinken; genau eine H1 pro Seite – der Header enthält **keine** H1; Grün-Regel; ohne-JS-Bedienbarkeit; `aria-current`).
2. `docs/00-masterplan.md` – Schritt 1.3; `docs/workflow.md`.
3. Skill `golfnext-design-system` (Header-Zeile in der Bausteintabelle, „typische Fehler").
4. Mock (verbindlich, 1:1 portieren) `docs/design-system/mocks/2.4-navigation-footer.html`:
   - Header: **100–115** (`.hdr`, `.hdr.compact`, `.jslogo`, `.hnav`, `.hnav a`, `.amp`, aktiv/hover grüne Unterlinie Zeile 109, `.haschild::after` Caret 110, `.hcta`, `.hbtn`, Responsive 114–115).
   - Dropdown-Panel: **117–135** (`.mega`, `.mega .in`, `.mlead`, `.mgrid`, `.mitem`, Status `.st.live/.pilot/.dev` 131–133, `.mnote`).
   - Mobil: **146–168** (`.phone-x`, `.ph-hdr`, `.burger`, `.ph-menu`, `.ph-menu .sub`, `.ph-bar` mit `.b1` zweizeilig + `.b2` Icon-Button).
   - Header-Markup-Beispiele: ab **436** (Desktop) und **466/519/574** (CTA), Mobil ab **~460**.
5. `config/site-structure.ts` – **die Datenquelle**: `NAV_HAUPT` (Hauptpunkte), `ROUTES` (mit `parent` für die Dropdowns), `MODULE` (slug/name/gruppe/status), `CTA`, `isLinkable(path)`, `KONTAKT`.
6. `docs/design-system/README.md` (Navigationsreihenfolge, Kapitel 2.4).

## Harte Vorgaben
- **Eine Wahrheit:** Navigation, Dropdown-Einträge und Status kommen **ausschließlich** aus `config/site-structure.ts`. Keine hartkodierten Menüpunkte.
- **Nur `live` verlinken:** pro Eintrag `isLinkable(path)` prüfen. `live` → `<a href={path}>`. Nicht-live → optisch identischer Platzhalter mit `href="#"` (Konvention wie Modul-Links in 1.4), mit Code-Kommentar „wird live in Phase 2". Aktuell ist **keine** Route live – das ist erwartet; der Header aktiviert die Links automatisch, sobald Seiten auf `live` gehen.
- **Aktive Seite:** über `usePathname()` bestimmen; aktiver Hauptpunkt bekommt grüne Unterlinie (`border-color:var(--gn-signal)`) **und** `aria-current="page"`.
- **Dropdowns (reduziert):** „Plattform" listet die Kinder mit `parent==="/plattform"` (Modulgruppe `wachstum` + Unterseite „So arbeitet GolfNext"); „Clubprozesse" die mit `parent==="/clubprozesse"` (Modulgruppe `clubprozesse`). Pro Eintrag: **Modulname + Status-`Badge` + Link**. Lead-Spalte (`.mlead`) verlinkt auf die Sektionsseite (z. B. „Plattform ansehen"). **Keine** Modul-Icons oder -Beschreibungen erfinden (Daten fehlen; werden in Phase 2 nachgezogen – im Code als TODO kommentieren).
- **CTA rechts:** `Button`-Variante `hbtn` (zweizeilig, grün, Navy-Text) mit `CTA.erstgespraech` (Label + `hint`), Ziel über `resolveCta({target:"erstgespraech"})`. Grün-Regel: Zusatzzeile als eigene Zeile.
- **Ohne JavaScript benutzbar (Progressive Enhancement):**
  - Desktop-Dropdowns: Basis über CSS `:hover`/`:focus-within` (Panel erscheint ohne JS, per Tastatur erreichbar). Mit JS: Toggle-`<button aria-expanded>` mit Caret, `Escape` schließt, Klick außerhalb schließt, `aria-controls`.
  - Mobil: Burger öffnet ein Vollbild-Menü. Ohne JS funktionsfähig (z. B. `<details>`/`<summary>` oder Checkbox-Technik). Mit JS: `aria-expanded`, `Escape` schließt, Fokus wandert ins Menü und zurück, Body-Scroll gesperrt solange offen.
- **Sticky, 80 px** (`position:sticky; top:0`), Wortmarke 19 px (Navy). Header enthält **keine** `<h1>`; die Wortmarke ist ein Link zur Startseite mit `aria-label="GolfNext, zur Startseite"`.
- **Breakpoint 1024 px:** darüber Desktop-Navigation, darunter Burger + Vollbild-Menü (Masterplan 1.3). Icons mit fixer Größe; kein SVG > 90 px außer der Wortmarke.
- **Mock-CSS portieren** als co-lokierte CSS-Module, Tokens `--gn-*`, literale Tints kommentiert.

## Aufgaben
1. **`components/site/Header.tsx`** (+ `.module.css`): sticky Shell, Wortmarke-Link links, Desktop-`Nav`, CTA rechts (`hbtn`). Server-Shell, Interaktion in kleine Client-Teile ausgelagert.
2. **Desktop-Navigation** aus `NAV_HAUPT`: Hauptpunkte mit `.amp`-Behandlung für „Wachstum & Vertrieb", aktivem Zustand (grüne Unterlinie + `aria-current`), Caret bei den zwei Dropdown-Punkten.
3. **Dropdown-Panels** (`components/site/Nav.tsx` oder `MegaMenu.tsx`, Client): Plattform/Clubprozesse aus `ROUTES` (per `parent`) und `MODULE`; Eintrag = Name + `Badge status`; Lead-Spalte-Link. Tastatur: Pfeil/Tab durch die Einträge, `Escape` schließt.
4. **`components/site/MobileNav.tsx`** (Client, unter 1024 px): Burger, Vollbild-Menü mit Hauptpunkten und aufklappbaren Modulgruppen (`.ph-menu .sub`), unten `.ph-bar` mit CTA (`b1` zweizeilig) + sekundärem Icon-Button (`b2`). Ohne JS bedienbar, mit JS angereichert.
5. **Demo:** Header oben auf `app/(preview)/_bausteine/page.tsx` einsetzen (voll sichtbar, Dropdowns/Mobile prüfbar). **Noch nicht** ins Root-Layout einhängen – die app-weite Einbindung von Header+Footer erfolgt nach 1.4 (kurzer Shell-Schritt) bzw. zu Phase 2.
6. **`docs/entscheidungen.md`**: Eintrag „1.3 — Header liest site-structure; nicht-live Punkte als `#`-Platzhalter (auto-live in Phase 2); Dropdown reduziert (Name+Status), Icons/Beschreibungen deferred; compact-on-scroll optional."

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`. Für etwaige Bewegung (Dropdown-Einblendung) gilt: dezent, `prefers-reduced-motion` respektieren – **keine** neue Motion-Bibliotheks-Nutzung in diesem Schritt (Motion ist 1.7); CSS-Transitions genügen.
- Subagents nach dem Bauen: `design-system-guard`, `qa-runner` (Tastatur, ohne-JS, Overflow @390/768/1024/1180/1440, Fokusführung, axe), `seo-auditor` (nur-`live`-Links, `aria-current`, keine zweite H1), dann `pr-reviewer`.
- `text-fidelity` nicht nötig (keine Fred-Fließtexte; Labels stammen aus site-structure) – im PR begründen.

## PR und Merge
- Branch `feat/header` vom aktuellen `main`; dieses Briefing liegt mit im Branch. Commits deutsch, Imperativ.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün.
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), Vercel-Preview ansehen, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] Header sticky 80 px, Wortmarke 19 px Navy als Home-Link mit `aria-label`; keine H1 im Header.
- [ ] Hauptnavigation und Dropdown-Inhalte kommen aus `config/site-structure.ts`; nicht-live Punkte sind `#`-Platzhalter; aktive Seite hat grüne Unterlinie + `aria-current="page"`.
- [ ] Zwei Dropdowns (Plattform, Clubprozesse) mit Modulname + Status-`Badge`; per Maus **und** Tastatur bedienbar; `Escape` schließt; **ohne JS** erreichbar (`:focus-within`).
- [ ] Unter 1024 px Burger + Vollbild-Menü, ohne JS bedienbar; mit JS `aria-expanded`, `Escape`, Fokusführung, Body-Scroll-Lock.
- [ ] CTA rechts als `hbtn` (Grün-Regel, Ziel via `resolveCta`); kein SVG > 90 px außer Wortmarke.
- [ ] Kein horizontaler Overflow @390/768/1024/1180/1440; keine Konsolenfehler; Reduced-Motion o. B.; axe ohne AA-Verstoß.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; `design-system-guard`, `qa-runner`, `seo-auditor` ohne FAIL; Eintrag in `entscheidungen.md`.

## Was du NICHT tust
- Keinen Footer (1.4), kein `Shot`/`Portrait` (1.5), keine FAQ (1.6), keine `motion/react`-Animationen (1.7), keine Zustände/Formulare (1.8), keine echten Seiten (Phase 2).
- Keine Modul-Icons/-Beschreibungen erfinden; keine Menüpunkte hartkodieren; nicht-live Routen nicht als echte Links ausgeben.
- Header **nicht** ins Root-Layout einhängen (kommt nach 1.4); `config/site-structure.ts` nicht ändern; keine neuen Tokens.

## Offene Fragen an Stefan/Fred
- Modul-Icons und Kurzbeschreibungen für die Dropdowns liefert Fred/Phase-2-Content – bis dahin reduzierte Darstellung (dokumentiert). Keine blockierende Frage.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0004-header.md. Voraussetzung: 1.2 ist auf main; zweige
feat/header vom aktuellen main ab. Setze das Briefing vollständig um. Baue über die Skills
golfnext-design-system und golfnext-qa. Portiere das Header-/Dropdown-/Mobile-CSS 1:1 aus
2.4-navigation-footer.html als co-lokierte CSS-Module (Tokens --gn-*, literale Tints kommentiert).
Navigation, Dropdowns und Status kommen ausschließlich aus config/site-structure.ts; verlinke nur
live-Routen (isLinkable), nicht-live als #-Platzhalter. Dropdowns reduziert (Modulname + Status-Badge +
Link), keine Icons/Beschreibungen erfinden. CTA rechts als Button-Variante hbtn via resolveCta. Alles
muss ohne JavaScript bedienbar sein (Dropdown per :focus-within, Mobil per details/Checkbox) und mit JS
angereichert (aria-expanded, Escape, Fokusführung, Scroll-Lock). Header nur auf /_bausteine einsetzen,
NICHT ins Root-Layout. Trag die Entscheidungen in docs/entscheidungen.md ein. Rufe danach
design-system-guard, qa-runner und seo-auditor auf und behebe deren FAILs (text-fidelity nicht nötig,
im PR begründen). PR nach dem Template, CI grün (beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
