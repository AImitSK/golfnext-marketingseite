# 0005 · Footer-Systemkarte

Masterplan-Schritt: 1.4 · Branch: `feat/footer` · Phase: 1

Der dunkle Seitenabschluss: Abschluss-CTA (FooterClose), Modulkarte mit zwölf Modulen und
Status-Punkten, Kontaktzeile und Bodenleiste. Verifiziert nebenbei die `secondaryOnDark`-Aktion
aus 1.2 im echten dunklen Kontext.

**Vorbedingung:** 1.3 (`feat/header`) ist auf `main`. `feat/footer` zweigt vom aktuellen `main` ab.
Nutzt `Button` (cta zweizeilig, `secondaryOnDark`), `Badge`/Status, `Wortmarke`, `TextLink`.

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Grün-Regel: Signalgrün als Fläche/Punkt/Linie **oder** Text auf Navy – im dunklen Footer sind grüne/sky Eyebrows also erlaubt; Benennungen „Turnier-News/Firmen-Events/Gastfee"; nur `live`-Routen verlinken; „Rückmeldung innerhalb eines Werktags").
2. `docs/00-masterplan.md` – Schritt 1.4; `docs/workflow.md`.
3. Skill `golfnext-design-system` (Footer-Zeile, Status-Punkte grün/gold/weiß).
4. Mock (verbindlich, 1:1 portieren) `docs/design-system/mocks/2.4-navigation-footer.html`:
   - FooterClose: **171–182** (`.fx`, `.fz`, `.f-cta` Grid + Gradient + `::after`, `.ce` Eyebrow signal, `h3` weiß, `p` ftext, `.acts`, `.b1` grün zweizeilig, `.b2` sekundär auf dunkel mit Unterlinie).
   - Modulkarte: **184–200** (`.f-map`, `.mh`, `.f-cols` 2 Spalten, `.f-col>b` Eyebrow signal / `.ops` sky, `.f-mods` 2-spaltig, `.f-mod` + `.dot.live/.pilot/.dev`, `.f-legend`).
   - Kontakt: **202–210** (`.f-contact`, `.cl`, `.big`, `p`, `p.sm`, `.soc`).
   - Bodenleiste: **212–216** (`.f-bar`, `.jslogo` weiß 17 px, Links, `.sp` = margin-left:auto).
   - Responsive: **242–261** (≤960: `.f-cta`/`.f-cols` einspaltig, `.f-contact` 2-spaltig, `.f-bar` Padding).
   - Token-Mapping: Mock `var(--ftext)` → `var(--gn-on-dark-text)`, `var(--fline)` → `var(--gn-on-dark-line)`; Flächen `--gn-navy-deep`/`--gn-navy`.
5. `content/types.ts` (`FooterClose`-Typ: `eyebrow, headline, text[], cta, secondary?`), `content/ueber-golfnext.ts` (**echte** FooterClose-Daten für die Demo).
6. `config/site-structure.ts` – `MODULE` (12 Module, `gruppe` wachstum/clubprozesse, `status`), `KONTAKT` (Fred Hoffmann, 0175 5951839, info@golfnext.de, Rückmeldung innerhalb eines Werktags), `CTA`, `ROUTES` (Impressum/Datenschutz), `isLinkable`.

## Harte Vorgaben
- **Datengetrieben:** Modulkarte aus `MODULE` (zwei Spalten nach `gruppe`: „Wachstum nach außen" / „Entlastung nach innen"), Status-Punkt je `status` (`im-einsatz`→grün `--gn-signal`, `pilot`→gold `#E8C55A`, `in-entwicklung`→weiß `rgba(255,255,255,.35)`). Modul-Links auf `/module/<slug>` – **vorerst `#`** (nicht live). Kontaktzeile aus `KONTAKT`. Keine hartkodierten Modul-/Kontaktdaten, keine erfundenen Module.
- **FooterClose ist prop-getrieben** (pro Seite): Komponente nimmt den `FooterClose`-Typ (`eyebrow, headline, text[], cta, secondary?`). CTA = `cta` (grün, zweizeilig, `cta.hint` als zweite Zeile), sekundär = `secondary` (Variante `secondaryOnDark`, unterstrichen). Ziele über `resolveCta`. **Keinen** FooterClose-Text erfinden – für die Demo die echten Daten aus `content/ueber-golfnext.ts` verwenden.
- **Grün-Regel im Dunkeln:** Eyebrows/Labels grün bzw. sky auf Navy sind erlaubt (Text auf Navy). `h3`/Namen weiß. Kontraste AA prüfen (axe) – `--gn-on-dark-text` auf `--gn-navy-deep`.
- **Bodenleiste:** `Wortmarke` (weiß, 17 px, Link zur Startseite), „© 2026 GolfNext", `Impressum`, `Datenschutz` (beide `geplant` → `isLinkable` → aktuell `#`, wird live in Phase 5), **„Cookie-Einstellungen"** als `<button>` – öffnet später den Consent-Dialog (Phase 5.3); jetzt Platzhalter (no-op mit TODO-Kommentar, kein toter Link).
- **Benennungen wortgleich** aus `MODULE` (Turnier-News, Firmen-Events, Gastfee, Captains App …). Zeichensetzung `–`/„…" bleibt.
- **Ohne JS** vollständig lesbar/bedienbar; nur `opacity`/`transform` falls überhaupt Transition; kein `motion/react` (das ist 1.7). Genau **keine** H1 im Footer (Abschnittsüberschriften `<h2>`/`<h3>`; auf `/_bausteine` bleibt die eine Seiten-H1 erhalten).
- **Social-Icons** nur, wenn URLs bekannt sind – sind sie **nicht**, also weglassen (nicht erfinden), Platz im Kontaktblock entsprechend.
- **Mock-CSS portieren** als co-lokierte Module, Tokens `--gn-*`, literale Tints (`#E8C55A`, Gradient-Stops) kommentiert.

## Aufgaben
1. **`components/site/Footer.tsx`** (+ `.module.css`): dunkle Systemkarte (`--gn-navy-deep`), enthält FooterClose + Modulkarte + Kontakt + Bodenleiste. Prop `footerClose: FooterClose`. Server-Komponente; die Cookie-Einstellungen-Aktion als kleiner Client-Button.
2. **`FooterClose`** (`components/site/FooterClose.tsx`): `.f-cta`-Layout, Eyebrow/Headline/Text, `Button` cta (zweizeilig) + optional `secondaryOnDark`. `secondaryOnDark`-Optik hier final verifizieren (Notiz aus 1.2 auflösen).
3. **Modulkarte** (`.f-map`): Kopf (`.mh`), zwei Spalten aus `MODULE` nach `gruppe`, `.f-mod` mit Status-Punkt + Name (Link `#`), `.f-legend` (grün/gold/weiß = Im Einsatz/Pilot/In Entwicklung).
4. **Kontaktblock** (`.f-contact`) aus `KONTAKT`: Name (`.big`), Rolle, Telefon (`tel:`-Link), E-Mail (`mailto:`-Link), „Rückmeldung innerhalb eines Werktags".
5. **Bodenleiste** (`.f-bar`): Wortmarke, © 2026, Impressum/Datenschutz (`#` bis live), Cookie-Einstellungen-Button (Platzhalter).
6. **Demo:** Footer unten auf `app/(preview)/_bausteine/page.tsx` mit `footerClose={ueberGolfnext.footerClose}`.
7. **`docs/entscheidungen.md`**: „1.4 — FooterClose prop-getrieben (per Seite, Demo aus ueber-golfnext); Modul-/Impressum-/Datenschutz-Links vorerst `#`; Cookie-Einstellungen Platzhalter bis 5.3; Social weggelassen (keine URLs)."

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`.
- Subagents nach dem Bauen: `design-system-guard` (Grün-Regel/Status-Punkte, Tokens, Kontrast auf dunkel), `qa-runner` (Overflow @5 Breakpoints, ohne-JS, axe auf dunkel, Fokus), `seo-auditor` (nur-`live`-Links, keine zweite H1, `mailto`/`tel`), dann `pr-reviewer`.
- `text-fidelity`: die FooterClose-Demo nutzt echten `ueber-golfnext`-Text → **doch aufrufen** (prüft Wortgleichheit dieser Passage + Benennungen der Module).

## PR und Merge
- Branch `feat/footer` vom aktuellen `main`; Briefing liegt mit im Branch. Commits deutsch, Imperativ.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün.
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), Preview ansehen, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] FooterClose prop-getrieben; CTA grün zweizeilig + `secondaryOnDark` (unterstrichen) korrekt und AA-lesbar auf dunkel.
- [ ] Modulkarte zeigt alle 12 Module aus `MODULE` in zwei Gruppen mit korrekten Status-Punkten (grün/gold/weiß) + Legende; Links `#`.
- [ ] Kontaktblock aus `KONTAKT` mit funktionierenden `tel:`/`mailto:`-Links und „Rückmeldung innerhalb eines Werktags".
- [ ] Bodenleiste: Wortmarke + © 2026 + Impressum/Datenschutz (`#`) + Cookie-Einstellungen-Button (Platzhalter, kein toter Link).
- [ ] Kein Overflow @390/768/1024/1180/1440; ohne JS lesbar; axe ohne AA-Verstoß auf dunkel; keine Konsolenfehler; keine zweite H1.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; `design-system-guard`, `qa-runner`, `seo-auditor`, `text-fidelity` ohne FAIL; Eintrag in `entscheidungen.md`.

## Was du NICHT tust
- Kein `Shot`/`Portrait` (1.5), keine FAQ (1.6), keine `motion/react`-Animationen (1.7), keine Zustände/Consent-Tool (1.8/5.3), keine echten Seiten (Phase 2).
- Footer **nicht** ins Root-Layout einhängen und Header nicht anfassen (Layout-Shell folgt zu Phase 2: Header ins Layout, Footer pro Seite). `config/site-structure.ts`/`content/*` nicht ändern; keine neuen Tokens; keine Module/Kontaktdaten/Social erfinden.

## Offene Fragen an Stefan/Fred
- Social-Profil-URLs? Bis dahin keine Social-Icons. Consent-Dialog-Anbindung der „Cookie-Einstellungen" erfolgt in Phase 5.3. Keine blockierende Frage.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0005-footer.md. Voraussetzung: 1.3 ist auf main; zweige
feat/footer vom aktuellen main ab. Setze das Briefing vollständig um. Baue über die Skills
golfnext-design-system und golfnext-qa. Portiere das Footer-CSS 1:1 aus 2.4-navigation-footer.html als
co-lokierte Module (Tokens --gn-*, --ftext→--gn-on-dark-text, --fline→--gn-on-dark-line, literale Tints
kommentiert). Modulkarte, Status-Punkte (grün/gold/weiß), Kontaktzeile und Bodenleiste kommen aus
config/site-structure.ts (MODULE/KONTAKT/ROUTES); Modul-/Impressum-/Datenschutz-Links vorerst #,
Cookie-Einstellungen als Platzhalter-Button. FooterClose ist prop-getrieben (Typ aus content/types.ts);
für die Demo footerClose aus content/ueber-golfnext.ts verwenden, CTA via resolveCta, secondaryOnDark
final verifizieren. Kein Social (keine URLs), nichts erfinden. Footer nur unten auf /_bausteine, NICHT
ins Root-Layout. Trag die Entscheidungen in docs/entscheidungen.md ein. Rufe danach design-system-guard,
qa-runner, seo-auditor und text-fidelity auf und behebe deren FAILs. PR nach dem Template, CI grün
(beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
