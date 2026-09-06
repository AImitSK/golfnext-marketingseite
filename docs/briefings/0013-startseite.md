# 0013 · Startseite (/)

Masterplan-Schritt: 2.2 · Branch: `feat/startseite` · Phase: 2

Die Startseite als Teaser-Seite: Hero, vier Vorteile, Journey, Wachstum/Clubprozesse-Umschalter,
Praxis, Paketblock (**Fassung 2**) und persönlicher Abschluss. Größte Seite bisher – gern in
logischen Commits (Abschnitt für Abschnitt) bauen.

**Vorbedingung:** 2.1 (`feat/pakete`) ist auf `main` (`/pakete` ist `live`). `feat/startseite` zweigt vom aktuellen `main` ab.
Nutzt alle Phase-1-Bausteine, die 1.7-Motion-Wrapper und den geteilten `Footer/FooterClose`. Ersetzt die Phase-0-Platzhalter-Home in `app/(site)/page.tsx`.

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Texte wortgleich; **keine erfundenen Zahlen/Modulstatus/Versprechen**; Grün-Regel; Bewegungsregeln inkl. **Zähler-Tabu außer Saisonrechnung**; nur `live` verlinken).
2. Skill **`golfnext-page-from-mock`**, `golfnext-design-system`, `golfnext-qa`.
3. **`docs/design-system/briefings/3.1-startseite-umsetzungsbriefing.md`** – **die verbindliche Textquelle** (Freds freigegebene finale Texte je Abschnitt, Änderungsvorgaben, Abnahmecheckliste, Animationsregeln, Mobile-Vorgaben). Wortlaut hier hat Vorrang vor älteren Mock-Texten.
4. Mock `docs/design-system/mocks/3.1-startseite.html` – Struktur, Layout, Sektions-CSS (Abschnitte 1–5 + Footer: Zeilen 440–940).
5. **`docs/design-system/mocks/3.1a-startseite-paketblock-fassung2.html`** – **Abschnitt 6 verbindlich** (Sockband, `plusrow`, drei `.pkc`-Karten, `pknote`, „Pakete und Leistungen vergleichen"). Zeilen 146–209. `docs/02-preislogik.md` für die Preise.
6. `config/site-structure.ts` (`/`-Status wird `live`; CTA-Ziele/`isLinkable`), `content/types.ts`, `content/pakete.ts`/`content/ueber-golfnext.ts` (Muster).

## Harte Vorgaben
- **Texte als Daten, wortgleich:** alle Inhalte in `content/startseite.ts` (`PageContent`), 1:1 aus dem **Umsetzungsbriefing** (finale Fassungen), nicht aus den älteren Mock-Texten. Zeichensetzung `–`/„…"/`„…"` und gewünschte Umbrüche (`headlineLines`) erhalten. Komponenten ohne freie Texte.
- **Abschnitt 6 = Fassung 2 (3.1a), NICHT die Briefing-Abschnitt-6-Preise:** Der Umsetzungsbriefing-Abschnitt 6 zeigt noch **überholte** Fassung-1-Preise (8.500/250, 12.000/400, 14.000/550, „GolfNext Start") – **die sind ungültig**. Gebaut wird der Paketblock **exakt aus 3.1a**: Sockband „Ihre Clubwebsite 6.800 € · 238 €", „Auch einzeln buchbar"; drei „+"; drei kompakte Karten Wachstum 5.200 €/312 € · Komplett 7.200 €/462 € (mittig, ohne Bestseller-Badge) · Individuell auf Anfrage/ab 662 €; `pknote` (netto zzgl. USt, Werbebudget 10 %, Stand September 2026); Haupt-Link **„Pakete und Leistungen vergleichen" → `/pakete`**. **Preise nie addieren, keine Summen, keine Empfehlung/Bevorzugung.**
- **Praxis-Kennzahlen (Abschnitt 5):** Die bestätigten Werte (rund 1.600 Dialoge, rund 600 Nutzer, 68 % außerhalb Bürozeiten, 72 % vollständig geführte Dialoge) **statisch** anzeigen, **kein Hochzähl-Effekt** – CLAUDE.md schließt Zähler außer der Saisonrechnung (Clubprozesse) aus. (Freds Briefing wünscht ein einmaliges Hochzählen – **Konflikt, siehe Offene Fragen**; Default bis zur Klärung: statisch, Werte jederzeit lesbar.) Werte/Status wortgleich, nichts erfinden. Zweites Beispiel Bad Wörishofen wie im Briefing.
- **Umschalter Wachstum ↔ Clubprozesse (Abschnitt 4):** interaktive Tabs; **ohne JS beide Ansichten erreichbar** (z. B. beide gerendert, per CSS/`:target`/`<details>` oder Tab-Muster), mit JS ruhiger Übergang (`aria-selected`/`role="tab"`, Tastatur). Mobil als gestapelte Bereiche oder gut bedienbare Tabs. Kein „aus dem Sichtfeld fliegen".
- **Bewegung (1.7-Wrapper):** Hero-Strecke und Journey-Linie bauen sich **einmal** auf und bleiben im Endzustand; `useReducedMotion` → sofort Endzustand; **ohne JS voll sichtbar** (Server rendert Endzustand). Vorteilskarten-Mikrovisualisierungen **feststehend** (kein Hover-Trigger, kein Dauerlauf). Keine Tabu-Effekte (kein Typewriter/Ticker/Carousel/Cursor/**Zähler**).
- **Bilder/Assets:** fehlende Produktoberflächen (Hero-Strecke-UIs, Vorteils-Visuals, Journey-UI-Ausschnitte, ANNA/Praxis) als **beschriftete `Shot`-Platzhalter** (Launch-Entscheidung); Foto Fred als **`Portrait`-Platzhalter** (klein, im Zitatblock/Abschluss). **Nichts erfinden** – keine Stock/KI/erfundenen Oberflächen.
- **Zitatblock (Abschnitt 3):** echtes Fred-Zitat (Umsetzungsbriefing Tabelle 5, wortgleich inkl. „…") als typografischer Zitatblock mit Namenszeile, **nicht** als CTA gestaltet.
- **Persönlicher Abschluss (Abschnitt 7) = FooterClose:** Overline/Headline/Text/CTAs aus dem Briefing in `content/startseite.ts.footerClose`; `<Footer footerClose={…}/>` rendern. Die „persönliche Zeile" (Fred als Ansprechpartner) mit aufnehmen. **Keine** doppelte „Gespräch und Demo"-Footerzone. Sicherstellen, dass die Zeile **„Ein Produkt von SK Online Marketing und Fred Hoffmann" nicht** im sichtbaren Footer steht.
- **Route & SEO:** `app/(site)/page.tsx` ersetzt den Platzhalter; `/`-Status in `config/site-structure.ts` auf **`live`**. Genau **eine `<h1>`** (Hero). Canonical. Metadata: falls im Briefing kein Meta-Titel/-Text steht, Root-Default belassen (Feinschliff Phase 6) – **nicht** erfinden.
- **CTA-Ziele:** über `resolveCta`/`lib/links.ts`. Interne Ziele auf noch **nicht-live** Seiten (Plattform, Wachstum & Vertrieb, Clubprozesse, So arbeitet GolfNext, Praxis) über `isLinkable` als `#`-Platzhalter (aktivieren sich, sobald die Seiten live sind); `/pakete` ist live; Erstgespräch/Live-Demo über die Env-Ziele mit Fallback.
- **Sektions-CSS portieren** als co-lokierte Module (`--gn-*`, literale Tints kommentiert); Tailwind nur für Primitives/Zustände. Keine neuen Tokens.

## Aufgaben
1. `content/startseite.ts` (`PageContent`) – alle Texte wortgleich aus dem Umsetzungsbriefing (Abschnitte 1–5, 7) und Abschnitt 6 aus 3.1a; Preise exakt; `footerClose` aus Abschnitt 7.
2. Seitenkomponenten unter `components/pages/startseite/` (Hero+Strecke, Vorteile, Journey, Umschalter, Praxis, Paketblock-Fassung2, Zitatblock) – CSS aus 3.1/3.1a portiert; Animationen über 1.7-Wrapper; Platzhalter über `Shot`/`Portrait`.
3. `app/(site)/page.tsx`: Abschnitte zusammensetzen, `<Footer footerClose={…}/>`, Canonical, eine H1.
4. `config/site-structure.ts`: `/` → `status: "live"`.
5. `docs/03-seiten-und-routen.md` + `docs/entscheidungen.md` aktualisieren (u. a. Praxis-Kennzahlen statisch, Umschalter-Umsetzung, Paketblock aus 3.1a).

## Skills und Subagents
- Skills: `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
- Subagents: **`text-fidelity`** (wortgleich gegen das Umsetzungsbriefing + 3.1a; keine erfundenen Kennzahlen/Modulstatus; Preise; Benennungen „Turnier-News/Firmen-Events/Gastfee" – Achtung: das Briefing schreibt an einigen Stellen noch „Club News", **Benennungsregel geht vor → „Turnier-News"**, im PR vermerken), `design-system-guard` (Grün-Regel, keine Bevorzugung, Tokens, Icon-Größen, Bewegungsregeln), `qa-runner` (Overflow @390/768/1024/1180/1440, Umschalter+Bewegung ohne JS, Reduced-Motion-Endzustände, axe, Konsole), `seo-auditor` (eine H1, Canonical, interne Links nur `live`/`#`), dann `pr-reviewer`.

## PR und Merge
- Branch `feat/startseite` vom aktuellen `main`; Briefing liegt mit im Branch. Commits deutsch, Imperativ, in logischen Teilen.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün; neuer E2E für `/` (eine H1, Overflow, Umschalter ohne JS, kein Zähler-Loop).
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), **Preview gegen 3.1 (+3.1a für Abschnitt 6) abgleichen**, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien (Auszug aus Freds Abnahmeliste)
- [ ] Concierge/Platzstatus aus dem Hero entfernt; Hero zeigt nur die verbundene Vertriebs-/Kommunikationsstrecke inkl. benannter E-Mail-Sequenz und Ratgeber-Inhalt.
- [ ] Vier Vorteilskarten mit feststehenden Mikrovisualisierungen (kein Hover-Zwang); Journey = vier Schritte + Entlasten/Verbinden als dauerhafte Ebenen; keine identischen Wireframe-Boxen.
- [ ] Blauer Block ist als Fred-**Zitat** erkennbar (kein CTA); Umschalter ruhig, mobil bedienbar.
- [ ] **Abschnitt 6 = Fassung 2** (3.1a): Sockband + drei „+" + drei Karten, **keine Summen**, „Pakete und Leistungen vergleichen" → `/pakete`; **keine** Fassung-1-Preise.
- [ ] Praxis-Kennzahlen **statisch**, wortgleich, jederzeit lesbar; keine erfundenen Werte/Status.
- [ ] Persönlicher Abschluss = oberer Teil des dunklen Footers; **keine** doppelte Gespräch/Demo-Zone; **keine** „Ein Produkt von …"-Zeile im sichtbaren Footer.
- [ ] Alle Texte wortgleich; `/` ist `live`; genau eine `<h1>`; Header/Footer verlinken `/`.
- [ ] Kein Overflow @5 Breakpoints; ohne JS vollständig lesbar/bedienbar; Reduced-Motion-Endzustände; axe ohne AA-Verstoß; keine Konsolenfehler.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; alle vier Subagents ohne FAIL; `docs/03` + `entscheidungen.md` aktualisiert.

## Was du NICHT tust
- Keinen zusätzlichen Startseiten-Abschnitt (CRM/E-Mail/Content) ergänzen; keine andere Seite bauen; keine Sanity/Formulare/Consent.
- **Keine erfundenen Kennzahlen/Modulstatus/Funktionen/Versprechen**; keine Fassung-1-Preise; keine Summen; keine Bestseller-/Empfehlungsoptik; keine Marketingfloskeln, keine geglätteten Sätze.
- Keine neuen Tokens; kein `<img>`/Stock/KI für fehlende Oberflächen (nur `Shot`/`Portrait`); Mocks/Rechtstexte/`content/pakete.ts` nicht ändern.

## Offene Fragen an Stefan/Fred
- **Praxis-Kennzahlen: statisch oder einmaliges Hochzählen?** Freds Startseiten-Briefing wünscht ein einmaliges Hochzählen, CLAUDE.md/das Design-System schließen Zähler außer der Saisonrechnung aus. Default bis zur Klärung: **statisch**. Bitte entscheiden **[S/F]**.
- Meta-Titel/-Beschreibung für `/` liefert das Briefing nicht – bleibt vorerst Root-Default (Phase 6). Foto Fred fehlt → Platzhalter **[F]**.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md, docs/design-system/briefings/3.1-startseite-umsetzungsbriefing.md und das Briefing
docs/briefings/0013-startseite.md. Voraussetzung: 2.1 ist auf main; zweige feat/startseite vom aktuellen
main ab. Baue die Startseite / aus Mock 3.1 (Abschnitte 1-5,7) und Abschnitt 6 aus 3.1a (Fassung 2) über
die Skills golfnext-page-from-mock, golfnext-design-system, golfnext-qa. Lege alle Texte wortgleich in
content/startseite.ts an (finale Fassungen aus dem Umsetzungsbriefing; Abschnitt-6-Preise NUR aus 3.1a,
NICHT die überholten 8.500/250-Fassung-1-Preise). Ersetze die Platzhalter-Home in app/(site)/page.tsx.
Preise nie addieren, keine Summen/Bestseller-Badges. Praxis-Kennzahlen STATISCH (kein Hochzähler,
CLAUDE.md-Tabu). Umschalter Wachstum/Clubprozesse ohne JS bedienbar. Hero-/Journey-Animation über die
1.7-Motion-Wrapper (einmal, Reduced-Motion-Endzustand, ohne JS sichtbar), Vorteils-Mikrovisuals
feststehend. Fehlende Produktoberflächen als Shot-, Foto Fred als Portrait-Platzhalter (nichts erfinden).
Fred-Zitat als Zitatblock (kein CTA). Persönlicher Abschluss als FooterClose; keine doppelte Gespräch/
Demo-Zone; keine "Ein Produkt von..."-Zeile im Footer. Interne Links auf nicht-live Seiten via isLinkable
als #; /pakete ist live. Setze / in config/site-structure.ts auf live, genau eine h1, Canonical.
Aktualisiere docs/03 und docs/entscheidungen.md. Rufe danach text-fidelity, design-system-guard,
qa-runner und seo-auditor auf und behebe deren FAILs. Neuer E2E für /. PR nach dem Template, CI grün
(beide Jobs Pflicht), Preview gegen 3.1/3.1a abgleichen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
