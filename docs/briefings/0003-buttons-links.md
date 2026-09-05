# 0003 · Buttons und Links

Masterplan-Schritt: 1.2 · Branch: `feat/buttons-links` · Phase: 1

Zweiter Baustein der Phase 1: die interaktiven Primitives `Button`, `TextLink`, `Chip` und der
Status-`Badge`. Baut auf den Tokens und dem `/_bausteine`-Setup aus 1.1 auf.

**Vorbedingung:** 1.1 (`feat/layout-bausteine`, PR #1) ist nach `main` gemergt. `feat/buttons-links`
zweigt vom **aktualisierten `main`** ab (die `--gn-*`-Tokenebene und `/_bausteine` müssen vorhanden sein).

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Grün-Regel: grüne Fläche + Navy-Text; Zusatzzeile NIE als dunkelgrüner Text auf Grün, sondern eigene Zeile unter dem Label; Icons mit fixer Größe).
2. `docs/00-masterplan.md` – Schritt 1.2; `docs/workflow.md` (Mock-CSS portieren).
3. Skill `golfnext-design-system` (Bausteine, Grün-Regel, „typische Fehler": `display:block` bei `<span>`-Stapeln, Icon-Größe).
4. Mock-CSS (verbindliche Quelle, 1:1 portieren):
   - Buttons: `docs/design-system/mocks/2.5-ui-kit.html` Zeilen **66–77** (`.btn`, `.btn svg`, `.btn.cta`, `.btn.col` + `.btn.col small`, `.btn.primary`, `.btn.ghost`, `.btn.light`, `.btn.sm`). Verwendungsbeispiele Zeilen 276–293.
   - Header-CTA-Variante (zweizeilig, kompakt): `docs/design-system/mocks/2.4-navigation-footer.html` Zeilen **112–113** (`.hbtn`, `.hbtn small`).
   - Sekundär auf dunkel (leiser Textlink „Live-Demo"): Footer-Abschluss in `2.4-navigation-footer.html` (F-Close-Block) – die zweite, unauffällige Aktion neben dem grünen Button.
   - TextLink: `2.5-ui-kit.html` Zeilen **82–84** (`.tlink`, Pfeil-SVG 15 px, Hover `translateX(3px)`).
   - Chip: `2.5-ui-kit.html` Zeilen **96–99** (`.chip`, `.chip:hover`, `.chip.on`, `.chip .x`).
   - Badge: `2.5-ui-kit.html` Zeilen **88–95** (`.badge`, `.badge .dot`, `.badge.live/.pilot/.dev/.addon/.inklusive/.onnavy`).
5. `config/site-structure.ts` – `MODULE[].status` (`im-einsatz` | `pilot` | `in-entwicklung`) und `CTA`; der Badge muss diese Statuswerte abbilden.

## Harte Vorgaben
- **Grün-Regel.** Primär-Button: Fläche `--gn-signal`, Text `--gn-navy`, 700. Die optionale zweite Zeile (`small`) steht als **eigene Zeile** unter dem Label (`.btn.col`), nie als Inline-Zusatz auf der grünen Fläche. `small` bekommt `display:block` (typischer Fehler aus der Mock-Phase).
- **Mock-CSS portieren, nicht neu erfinden.** Werte 1:1 aus 2.5/2.4 in co-lokierte CSS-Module, Tokens auf `--gn-*`. Wo der Mock literale Tints ohne Token nutzt (`#00CE04` Hover, `#FAF4E0`, `#EFECE3`, `#E7F1F6`, `#095B7C`, `#CFC7B8`), diese **literal übernehmen** und per Kommentar als „Mock-Wert, kein Token" kennzeichnen – keine neuen Tokens erfinden.
- **Icons fix 15 px** (`.btn svg`, `.tlink svg`). Pfeil-/Icon-SVGs mit `width/height`, nie ohne Größe.
- **Kein Pill.** In den Mocks existiert keine eigene `.pill`-Klasse – also keinen Pill bauen (nichts erfinden). Nur `Chip`.
- **Zustände gehören NICHT hierher.** `.btn.disabled` und `.btn.loading` (Spinner) sind Schritt 1.8. Ein `disabled`-Attribut darf durchgereicht werden, aber die Lade-/Disabled-**Optik** und der Spinner werden erst in 1.8 gebaut.
- **Semantik:** `Button` rendert `<a>` für Navigation (mit `href`) und `<button type=...>` für Aktionen; CTA-Ziele über `resolveCta`/`lib/links.ts`, nie hart kodiert. Fokuszustand sichtbar (globaler Ring genügt).
- **Server-Komponenten**, wo möglich. `'use client'` nur, wenn eine Komponente wirklich Interaktion selbst hält (hier voraussichtlich nicht: `Chip` bleibt präsentational, Auswahl-/Remove-Logik reicht die Seite später über Props hinein).

## Aufgaben
1. **`Button`** (`components/ui/Button.tsx` + `.module.css`): Basis `.btn`; Varianten `variant: "cta" | "primary" | "ghost" | "light"`; Modifier `secondLine?: string` (rendert `.col` + `<span small>`), `size?: "sm"`. Kompakte Header-Variante (`.hbtn`) als eigener Modifier oder eigene kleine Komponente – vom Header (1.3) nutzbar. Icon optional als `children`/Prop (Pfeil-SVG 15 px).
2. **Sekundär auf dunkel:** eine leise, unterstrichene Textaktion für dunkle Flächen (Footer-Abschluss „Live-Demo"). Als Variante von `Button` (`variant="secondaryOnDark"`, unterstrichen, `--gn-on-dark-link`/weiß) oder als `onDark`-Variante von `TextLink` umsetzen – begründet wählen. Falls die exakte Optik erst im Footer-Kontext (1.4) final beurteilbar ist, die Variante hier anlegen und im PR als „in 1.4 zu verifizieren" vermerken.
3. **`TextLink`** (`components/ui/TextLink.tsx` + `.module.css`): `.tlink` (blau, 15.5 px, 600), Pfeil-SVG 15 px, Hover `translateX(3px)` (`transition .15s`); `onDark?`-Variante (`--gn-on-dark-link`). Als `<a>` mit Pflicht-`href`.
4. **`Chip`** (`components/ui/Chip.tsx` + `.module.css`): `.chip` inkl. `:hover`, `on?`-Zustand (`.chip.on`, Navy-Fläche) und optionalem Entfernen-Zeichen (`.chip .x`). Präsentational; `aria-pressed` wenn als Filter genutzt.
5. **`Badge`** (`components/ui/Badge.tsx` + `.module.css`): `.badge` mit `.dot`; Prop `status: "im-einsatz" | "pilot" | "in-entwicklung"` → `live`/`pilot`/`dev` (Im Einsatz grün · Pilot gold · In Entwicklung hell) plus die weiteren Varianten `addon`, `inklusive`, `onnavy` als zusätzliche Prop-Werte. Beschriftungstext als `children`.
6. **`/_bausteine` erweitern:** einen Abschnitt „Buttons & Links" ergänzen, der alle Varianten zeigt (Button cta/primary/ghost/light, mit/ohne zweite Zeile, sm; sekundär auf dunkel in einem Navy-Block; TextLink hell/onDark; Chip normal/on/mit x; Badge alle Statuswerte). Demo-Texte, keine Fred-Inhalte.
7. **Doku-Fix (Nebenaufgabe):** im Skill `.claude/skills/golfnext-design-system/SKILL.md` die H2-Angabe „max 24ch" auf **22ch** korrigieren (Widerspruch zum Mock aufgelöst zugunsten des Mocks, Präzedenz *Mock > Skill*; Entscheidung aus der 1.1-Auswertung).

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`.
- Subagents nach dem Bauen: `design-system-guard` (Grün-Regel!, Icon-Größe, Tokens, Zeichensetzung), `qa-runner` (Overflow/ohne-JS/Konsole auf `/_bausteine`, Kontraste), dann `pr-reviewer`.
- `text-fidelity`/`seo-auditor` weiter nicht nötig (keine Fred-Texte, `/_bausteine` noindex/unverlinkt) – im PR kurz begründen.

## PR und Merge
- Branch `feat/buttons-links` vom aktualisierten `main` (nach 1.1-Merge). Dieses Briefing liegt mit im Branch. Commits deutsch, Imperativ.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün.
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), Vercel-Preview ansehen, `pr-reviewer`, Merge durch Stefan.

## Akzeptanzkriterien
- [ ] `Button` mit Varianten cta/primary/ghost/light, zweiter Zeile (`.col`, `small` als eigene Zeile mit `display:block`) und `sm`; Werte 1:1 aus 2.5/2.4; Grün-Regel eingehalten (kein grüner/dunkelgrüner Text auf Grün).
- [ ] Sekundär-auf-dunkel-Aktion vorhanden und im Navy-Demoblock lesbar (Kontrast AA).
- [ ] `TextLink` mit 15-px-Pfeil, Hover +3 px, `onDark`-Variante; als `<a href>`.
- [ ] `Chip` mit `on`/`x`; `Badge` bildet `im-einsatz/pilot/in-entwicklung` + `addon/inklusive/onnavy` ab; Dot 7 px.
- [ ] `/_bausteine` zeigt alle Varianten; kein Overflow @390/768/1024/1180/1440; kein SVG > 90 px; ohne JS lesbar; keine Konsolenfehler.
- [ ] Skill-Doku „22ch" korrigiert.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; `design-system-guard` und `qa-runner` ohne FAIL.

## Was du NICHT tust
- Keinen Header (1.3), keinen Footer (1.4), kein `Shot`/`Portrait` (1.5), keine FAQ (1.6), keine Motion (1.7), keine Zustände/`.btn.loading`/Formularfelder (1.8).
- Keinen Pill erfinden; keine neuen Tokens; `@theme`- und `--gn-*`-Werte nicht ändern.
- Keine echten Seiten/Fred-Texte; `/_bausteine` nicht verlinken; `config/site-structure.ts` nicht ändern.

## Offene Fragen an Stefan/Fred
- Keine. (Die exakte Optik der „sekundär auf dunkel"-Aktion wird ggf. im Footer-Schritt 1.4 endgültig verifiziert – im Briefing vermerkt.)

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0003-buttons-links.md. Voraussetzung: 1.1 ist nach main
gemergt; zweige feat/buttons-links vom aktuellen main ab. Setze das Briefing vollständig um, Aufgabe für
Aufgabe. Baue über die Skills golfnext-design-system und golfnext-qa. Portiere das Button-/Link-/Chip-/
Badge-CSS 1:1 aus 2.5-ui-kit.html und 2.4-navigation-footer.html als co-lokierte CSS-Module (Tokens auf
--gn-*, literale Mock-Tints als solche kommentieren, keine neuen Tokens). Beachte die Grün-Regel (zweite
Zeile als eigene Zeile, nie Text auf Grün) und die fixen 15-px-Icons. Erweitere /_bausteine um einen
Abschnitt „Buttons & Links". Korrigiere im Skill golfnext-design-system „max 24ch" auf 22ch. Zustände
(disabled/loading) NICHT bauen (das ist 1.8). Rufe danach design-system-guard und qa-runner auf und behebe
deren FAILs; text-fidelity/seo-auditor sind nicht nötig (im PR begründen). PR nach dem Template, CI grün
(beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
