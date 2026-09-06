# 0014 · Korrektur Header & Footer (Breite + Modulstatus entfernen)

Masterplan-Bezug: Nachbesserung zu 1.3/1.4 · Branch: `fix/header-footer-korrektur` · Phase: 2

Zwei von Stefan gemeldete Korrekturen am geteilten Header und Footer. Betrifft `components/site/Header.tsx`,
`Nav.tsx`, `MobileNav.tsx`, `Footer.tsx` und deren Module + die zugehörigen Tests.

**Vorbedingung:** Zweigt vom aktuellen `main` ab. Wird **vor** der Startseite (0013) gemergt, damit die
Startseite den korrigierten Header/Footer nutzt.

## Korrektur 1 · Header und Footer über die volle Breite

Aktuell sind die Zonen zwar full-bleed, der **Inhalt** ist aber auf `--gn-wrap` (1140 px) zentriert
(Entscheidung 1.3/1.4). Stefan möchte, dass **Header und Footer die volle Breite nutzen**.

- Der Inhalt von Header (Logo · Navigation · CTA) und Footer (Abschluss, Modulkarte, Kontakt, Bodenleiste)
  spannt **über die volle Viewport-Breite**, **nicht** mehr auf 1140 px begrenzt/zentriert.
- Seitlicher Abstand über die Standard-Gutter (40 px · 26 px ≤960 · 20 px ≤620), damit nichts den Rand berührt.
- Hintergrund/Bar bleiben full-bleed (Bar reicht von Kante zu Kante).
- **Kein horizontaler Overflow** bei 390/768/1024/1180/1440 – nach dem Umbau zwingend erneut prüfen
  (breitere Layouts sind overflow-anfällig: Grid-Kinder `minmax(0,1fr)`, `white-space`/lange Wörter).
- Die **Sektionsinhalte der Seiten bleiben unverändert** auf `Wrap`/`--gn-wrap` – nur Header/Footer werden breit.
  (Das ist eine bewusste, von Stefan gewünschte Abweichung von „Header/Footer fluchten mit den Sektionen".)

## Korrektur 2 · Modulstatus aus Navigation und Footer entfernen

Die Status-Kennzeichnung (Im Einsatz / Pilot / In Entwicklung) wurde beim Layouten falsch verstanden.
**Vorgabe Stefan:** Alle Module gelten als fertig; über Pilotkunden wird nicht gesprochen. Der Status
**entfällt vollständig** in der sichtbaren Darstellung.

- **Header-Dropdowns (`Nav.tsx`/`MobileNav.tsx`):** kein Status-`Badge` mehr an den Modulen – nur Modulname + Link.
- **Footer-Modulkarte (`Footer.tsx`):** keine Status-Punkte (grün/gold/weiß) mehr an den Modulen; die
  **Status-Legende** („Im Einsatz · Pilot · In Entwicklung") **entfällt** komplett. Nur Modulname + Link.
- Es wird **kein** Ersatzstatus gezeigt (auch nicht „alle grün") – der Status verschwindet einfach.
- `config/site-structure.ts`: Das Feld `MODULE[].status` **darf bleiben** (Datenfeld), wird aber nirgends
  mehr gerendert. Falls es sonst nirgends mehr gebraucht wird, im Kommentar als „aktuell ungenutzt (Anzeige entfällt, Stand 06.09.2026)" markieren – **nicht** erfinden, dass alles „Im Einsatz" sei.
- Der `Badge`-Baustein (1.2) bleibt als Komponente erhalten (nur die Verwendung im Header/Footer entfällt);
  ebenso der Status-Baustein auf `/_bausteine` (dort ist er reine Referenz, kein Aussagewert über echte Module).
- Tests anpassen (`lib/navigation.test.ts`, Header-/Footer-E2E), die bisher Status prüfen.

## Korrektur 3 · Hover-Effekt am Header-CTA (`hbtn`)

Der CTA „Online-Erstgespräch vereinbaren / 30 Minuten persönlich per Zoom oder Teams" in der Navigation
(`Button`-Variante `hbtn`) hat **keinen Hover-Effekt**. Die `hbtn`-Variante hat aus Mock 2.4 nie einen
bekommen, während die reguläre `cta`-Variante beim Hover auf `#00CE04` abdunkelt.

- `hbtn` beim Hover denselben Grün-Hover geben wie `.btn.cta:hover` (Fläche `#00CE04`, kommentierter
  Mock-Wert), mit weicher `background`-Transition wie bei `cta`; Navy-Text bleibt (Grün-Regel).
- Sichtbarer Fokusring bleibt; Reduced-Motion: nur die Farbe wechselt, keine störende Bewegung.

## Harte Vorgaben (beides)
- Nur Header/Footer und deren Tests anfassen; **keine** Seiteninhalte, keine Tokens, keine anderen Komponenten.
- Grün-Regel und A11y bleiben gewahrt; ohne JS weiterhin bedienbar.

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`.
- Subagents: `design-system-guard` (Grün-Regel, Layout, keine Status-Reste), `qa-runner` (**Overflow @5 Breakpoints nach der Breiten-Änderung**, ohne-JS, axe, Konsole), `seo-auditor` (Header/Footer-Links unverändert `live`/`#`), dann `pr-reviewer`.
- `docs/entscheidungen.md` aktualisieren (Breite Header/Footer voll; Modulstatus-Anzeige entfällt – ersetzt die 1.4-Entscheidung zur Zentrierung bzw. zu den Status-Punkten; verweist auf Issue #6).

## PR und Merge
- Branch `fix/header-footer-korrektur` vom aktuellen `main`; Briefing liegt mit im Branch.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün.
- PR nach Template, CI grün (beide Jobs Pflicht), Preview ansehen, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] Header- und Footer-Inhalt spannen über die volle Breite (Gutter am Rand), Bar full-bleed; **kein Overflow** @390/768/1024/1180/1440.
- [ ] Kein Modulstatus (Badge/Punkt) mehr in Header-Dropdowns und Footer-Modulkarte; **keine** Status-Legende; kein Ersatzstatus.
- [ ] Modulnamen + Links weiterhin korrekt (nur `live` verlinkt, sonst `#`); ohne JS bedienbar; axe ohne AA-Verstoß.
- [ ] Header-CTA (`hbtn`) hat einen Hover-Effekt (Fläche `#00CE04`, Navy-Text), Fokusring sichtbar.
- [ ] Angepasste Tests grün; `pnpm typecheck/lint/test/build` + CI grün; Subagents ohne FAIL; `entscheidungen.md` aktualisiert.

## Was du NICHT tust
- Keine Seiten-/Sektionsbreiten ändern (nur Header/Footer); keine Statuswerte „auf Im Einsatz" setzen; das `status`-Datenfeld nicht mit falschen Werten füllen.
- Keine neuen Tokens/Komponenten; `content/*`/Mocks/`/pakete` nicht anfassen.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0014-header-footer-korrektur.md. Zweige
fix/header-footer-korrektur vom aktuellen main ab. Zwei Korrekturen an Header und Footer:
1) Header- und Footer-INHALT über die volle Viewport-Breite ziehen (nicht mehr auf --gn-wrap/1140px
   zentrieren), seitlich nur die Standard-Gutter (40/26/20); Bar bleibt full-bleed. Sektionsinhalte der
   Seiten bleiben auf Wrap. Danach Overflow @390/768/1024/1180/1440 zwingend erneut prüfen.
2) Modulstatus komplett aus der Anzeige entfernen: keine Status-Badges in den Header-Dropdowns
   (Nav/MobileNav), keine Status-Punkte und KEINE Status-Legende im Footer; kein Ersatzstatus. Nur
   Modulname + Link. MODULE[].status in config/site-structure.ts bleibt als Datenfeld, wird aber nicht
   mehr gerendert (Kommentar 'Anzeige entfällt, Stand 06.09.2026'); nichts auf 'Im Einsatz' faken.
3) Header-CTA (Button-Variante hbtn) einen Hover-Effekt geben wie .btn.cta:hover (Fläche #00CE04,
   Navy-Text, weiche background-Transition); Fokusring bleibt.
Passe die betroffenen Tests an (lib/navigation.test.ts, Header-/Footer-E2E). Baue über golfnext-design-
system und golfnext-qa. Trag die Änderung in docs/entscheidungen.md ein (ersetzt Teile der 1.4-Entscheidung,
Bezug Issue #6). Rufe danach design-system-guard, qa-runner und seo-auditor auf und behebe deren FAILs.
PR nach dem Template, CI grün (beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
