# 0019 · Seite Über GolfNext (/ueber-golfnext) · Neufassung v01

Masterplan-Schritt: 2.7 · Branch: `feat/ueber-golfnext` · Phase: 2

Die Über-GolfNext-Seite in der von Stefan freigegebenen **Neufassung v01** (Mock `3.8b`, ersetzt die
archivierte 3.8). Modernes Layout wie die anderen Seiten: Hero mit Porträts, „Unser Weg" (Zeitleiste),
Grundsätze, „Die Menschen dahinter", „Gemeinsame Projekte", „Wissen".

**Vorbedingung:** Eine der bisherigen Neufassungen (Plattform/Wachstum/Clubprozesse) ist auf `main` (moderne
Layout-Tokens + Motion-Infra + Slider stehen). Vorher `git fetch` + `main` nachziehen, dann
`feat/ueber-golfnext` abzweigen. **Dieses Briefing liegt untracked im Ordner – mit dem Branch committen.**

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Texte wortgleich; keine erfundenen Zahlen; Benennungen; Grün-Regel; Bewegung gelockert; **kein Modulstatus**).
2. Skill `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
3. **Mock (verbindlich): `docs/design-system/mocks/3.8b-ueber-golfnext-neufassung.html`** – die alte `3.8` ist Archiv.
4. Gebaute Seiten (`components/pages/plattform|wachstum-vertrieb|clubprozesse/`) als Referenzmuster (Tokens, Slider, Reveal, Portrait/Shot-Platzhalter).
5. `config/site-structure.ts` (`/ueber-golfnext` → hier `live`; Titel/Beschreibung sind dort bereits gesetzt und passen zur neuen H1).

## Seitenstruktur (aus 3.8b)
1. **Hero**: Eyebrow „Über GolfNext", H1 „Wir hängen am Golf. Nicht am Gestern.", Lead, CTAs (Live-Demo / Erstgespräch), Zitatzeile. Rechts: zwei Personen-Karten (Fred, Stefan) mit **Porträt-Platzhaltern** („Porträt folgt").
2. **„Unser Weg"**: Zeitleiste imageGolf (2016) → GolfNext Consulting → GolfNext (2026), wortgleich.
3. **Grundsätze** — **hier die Abweichung (Entscheidung Stefan, kein Modulstatus):** Grundsatz **/02 „Wir versprechen nur, was läuft" mit der Status-Aufzählung „Im Einsatz/Pilot/In Entwicklung" und der Status-Legende wird NICHT gebaut.** Gebaut werden **/01 „Mit Clubs entwickelt, nicht für sie."** und **/03 „Ein Mensch am Telefon."** – **Überschrift entsprechend „Zwei Grundsätze"** (statt „Drei"). **Nichts erfinden** – keinen Ersatz-Grundsatz dazudichten (siehe Offene Fragen).
4. **„Die Menschen dahinter"**: Fred + Stefan (Karten mit Porträt-Platzhaltern, Fakten wortgleich), „Haltung"-Zitat, Partner-Zeile (SK Online Marketing, Bad Oeynhausen) wortgleich.
5. **„Gemeinsame Projekte"**: Club-Namen als Platzhalter-Kacheln (vorhandene Namen + „Logo folgt" wortgleich); Note „Logos und Freigaben: Fred liefert die endgültige Liste." Link „…Praxis" → `/praxis`.
6. **„Wissen"**: Artikel-Slider (golfmanager + Blog) mit **Platzhalter-Karten** („Titel folgt/Bild folgt" wortgleich); „Alle Artikel" → `/ratgeber`.
7. **Persönlicher Abschluss (FooterClose)** „Was müsste bei Ihnen endlich mal einfacher gehen?" + geteilter **Footer**.

## Harte Vorgaben
- **Kein Modulstatus (Entscheidung Stefan):** keine „Im Einsatz/Pilot/In Entwicklung"-Labels, keine Status-Legende – auch nicht als Grundsatz /02 (siehe oben). Der geteilte Footer bleibt ohne Status.
- **„Pilotclub"/Entwicklungspartner-Wortlaut BEIBEHALTEN:** Formulierungen wie „entsteht in einem Pilotclub" (Grundsatz /01), „mit einigen entwickeln wir die Plattform heute im Pilot weiter" (Abschnitt 5), „Arbeit mit Pilotclubs" (Abschnitt 6) beschreiben **Entwicklungspartnerschaften** (kein Modul-Status) und stehen so bereits **live auf der Startseite** (Rehburg-Loccum). Daher **wortgleich behalten**. *(Falls Stefan auch dieses Wort tilgen will: Offene Fragen.)*
- **Texte als Daten, wortgleich:** alles in `content/ueber-golfnext.ts` (bestehende Datei ist das Muster – Inhalte an 3.8b anpassen). Komponenten ohne freie Texte. Sektions-CSS aus 3.8b als co-lokierte Module portieren (`--gn-*`).
- **Bilder als Platzhalter:** Porträts Fred/Stefan als **`Portrait`-Platzhalter** (klein/groß), Club-„Logos" und Artikel-„Bild folgt" als beschriftete Platzhalter (`Shot`/kleine Kachel) – **kein Stock/KI**, „…folgt"-Beschriftungen aus dem Mock beibehalten.
- **Layout-Tokens der Neufassung wiederverwenden** (geteilte Ebene: Wrap 1180, Radius 12, Sektion 120, H2 48). Pakete/Startseite nicht retrofitten.
- **Animationen (volle Freigabe, A11y hart):** Reveals, Personen-/Weg-Einblendung, Wissen-Slider – einmal/dezent; **Reduced-Motion → Endzustand**; **ohne JS** lesbar (Slider nativ scrollbar); kein CLS; Bleed ohne Overflow.
- **Route & SEO:** `app/(site)/ueber-golfnext/page.tsx`; `/ueber-golfnext` → `status: "live"`. Genau **eine `<h1>`**; Canonical; Titel/Beschreibung aus site-structure (bereits gesetzt). CTA-Ziele über `resolveCta`/`internalHref`: Live-Demo/Erstgespräch aus `.env`; „Praxis"-Link → `/praxis` (bis live → `#`), „Alle Artikel"/Wissen → `/ratgeber` (bis live → `#`). `redirectsFrom: ["/ueber-golfnext/"]` bleibt.

## Aufgaben
1. `content/ueber-golfnext.ts` an 3.8b anpassen – Texte wortgleich, Grundsatz /02 weglassen (Überschrift „Zwei Grundsätze"), „Pilotclub"-Entwicklungswortlaut behalten. Sektionsdaten typisiert.
2. Seitenkomponenten unter `components/pages/ueber-golfnext/` – CSS portiert; Slider/Reveals analog; Porträt-/Logo-/Artikel-Platzhalter.
3. `app/(site)/ueber-golfnext/page.tsx`: Sektionen + `<Footer footerClose={…}/>`, Metadata/Canonical, eine H1.
4. `config/site-structure.ts`: `/ueber-golfnext` → `live`. `docs/03` + `docs/entscheidungen.md` aktualisieren (Grundsatz /02 weggelassen, kein Modulstatus, Pilotclub-Wortlaut behalten).

## Skills und Subagents
- Skills: `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
- Subagents: **`text-fidelity`** (wortgleich; **kein Modulstatus**; Grundsatz /02 nicht gebaut; „Pilotclub"-Wortlaut wie Mock; keine erfundenen Namen/Titel – „…folgt" bleibt), `design-system-guard`, `qa-runner` (Reduced-Motion, ohne JS, kein CLS, Overflow @390–1440, axe), `seo-auditor` (eine H1, Canonical, interne Links nur `live`), dann `pr-reviewer`.

## PR und Merge
- Branch `feat/ueber-golfnext`; Briefing mit committen. Gates + CI grün; Preview gegen 3.8b abgleichen. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `/ueber-golfnext` entspricht 3.8b in Struktur/Wortlaut **ohne** Grundsatz /02 und **ohne** Modulstatus; Überschrift „Zwei Grundsätze"; „Pilotclub"-Entwicklungswortlaut erhalten.
- [ ] Porträts/Logos/Artikel als beschriftete Platzhalter (kein Stock/KI); Texte in `content/ueber-golfnext.ts`.
- [ ] Reveals/Slider laufen; Reduced-Motion → Endzustand; ohne JS lesbar; kein CLS; kein Overflow @390/768/1024/1180/1440.
- [ ] `/ueber-golfnext` `live`; eine H1; Canonical; Header/Footer verlinken die Seite.
- [ ] Gates + CI grün; alle vier Subagents ohne FAIL; `docs/03` + `entscheidungen.md` aktualisiert.

## Was du NICHT tust
- Grundsatz /02 / Status-Legende **nicht** bauen; keinen Ersatz-Grundsatz erfinden; keine Modulstatus-Labels; die alte 3.8 nicht verwenden; keine erfundenen Namen/Artikel-Titel/Logos; Pakete/Startseite nicht retrofitten.

## Offene Fragen an Stefan/Fred
- **Grundsatz /02:** aktuell weggelassen → „Zwei Grundsätze". Wenn ein dritter Grundsatz gewünscht ist, liefert Stefan/Fred den Wortlaut **[S/F]**.
- **„Pilotclub"-Wortlaut:** bleibt (Entwicklungspartner, wie live auf der Startseite). Falls doch zu tilgen: kurz melden **[S]**.
- Porträts Fred/Stefan, Partnerlogos + Freigaben, Artikel-Titel/-Bilder liefert Fred **[F]**; Live-Demo-URL **[F]**.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0019-ueber-golfnext.md (liegt untracked im Ordner – committe
es mit deinem Branch). Hol den aktuellen main (git fetch + checkout main + reset --hard origin/main) und
zweige feat/ueber-golfnext ab. Baue die Seite /ueber-golfnext aus dem gültigen Mock
docs/design-system/mocks/3.8b-ueber-golfnext-neufassung.html (alte 3.8 ist Archiv) über die Skills
golfnext-page-from-mock, golfnext-design-system, golfnext-qa. Lege alle Texte wortgleich in
content/ueber-golfnext.ts an. WICHTIG (Entscheidung Stefan): KEIN Modulstatus – baue den Grundsatz /02
„Wir versprechen nur, was läuft" mit der Im-Einsatz/Pilot/In-Entwicklung-Aufzählung und -Legende NICHT;
nur /01 und /03, Überschrift „Zwei Grundsätze"; erfinde keinen Ersatz-Grundsatz. Den „Pilotclub"/
Entwicklungspartner-Wortlaut (Grundsatz /01, Abschnitt 5+6) BEHALTEN (wie live auf der Startseite). Baue
Hero mit Porträt-Platzhaltern, Unser-Weg-Zeitleiste, Menschen dahinter, Gemeinsame Projekte (Logo-
Platzhalter, „Logo folgt" wortgleich), Wissen-Slider (Artikel-Platzhalter, „Titel/Bild folgt" wortgleich),
FooterClose – mit der Motion-Infra (einmal/dezent, Reduced-Motion-Endzustand, ohne JS lesbar, kein CLS).
Porträts/Logos/Artikelbilder als beschriftete Platzhalter (Portrait/Shot), kein Stock/KI. Verwende die
geteilten Layout-Tokens wieder; Pakete/Startseite nicht retrofitten. Route app/(site)/ueber-golfnext/page.tsx
mit Footer(footerClose), Metadata/Canonical, eine h1; setze /ueber-golfnext in config/site-structure.ts auf
live (Titel/Beschreibung sind gesetzt). Aktualisiere docs/03 und docs/entscheidungen.md. Rufe danach
text-fidelity, design-system-guard, qa-runner und seo-auditor auf und behebe deren FAILs. Neuer E2E für
/ueber-golfnext. PR nach dem Template, CI grün (beide Jobs Pflicht), Preview gegen 3.8b abgleichen, dann
pr-reviewer. Schließe mit der dreisätzigen Zusammenfassung.
```
