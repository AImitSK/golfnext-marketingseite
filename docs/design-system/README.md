# Design-System GolfNext

Stand: 05.09.2026. Entwickelt in der Konzeptphase (Stefan Kühne mit Claude), freigegeben von Fred Hoffmann.
Alles hier ist Referenz für die Umsetzung in Next.js. Die HTML-Mocks sind **verbindlich**; sie zeigen Layout,
Texte, Bewegung und Responsive-Verhalten jeder Seite. Bei Widersprüchen gilt: Briefing-Text > Mock > diese Datei.

## Ordner

| Pfad | Inhalt |
|---|---|
| `tokens/tokens.css` | alle Design-Tokens als CSS-Variablen (Quelle) |
| `tokens/tokens.json` | dieselben Werte im W3C-Design-Token-Format |
| `tokens/tailwind-theme.css` | fertiger `@theme`-Block für Tailwind v4 |
| `mocks/1.1 … 2.5` | Designkonzept: Grundlagen, Logo & Bildsprache, Typografie, Farben, Navigation & Footer, UI-Kit |
| `mocks/3.1 … 3.8` | Seitenmocks (siehe Tabelle unten) |
| `mocks/_logo.js` | Wortmarke als SVG-String; im Projekt ersetzt durch `<Wortmarke />` |
| `briefings/` | Freds Word-Briefings je Seite plus automatisch extrahierter Text (`.md`) |

Mocks öffnen: einfach im Browser. Sie laden Archivo und Inter von Google Fonts – **nur für die Vorschau**; die Website selbst hostet die Schriften über `next/font`.

## Seiten und Status

| Nr. | Seite | Route | Mock | Briefing | Status |
|---|---|---|---|---|---|
| 3.1 | Startseite, Fassung 1 | – | `3.1-startseite.html` | `3.1-startseite-umsetzungsbriefing.md` | **Archiv, nicht bauen** (ersetzt durch 3.1b). Freigegebene Fred-Texte weiterhin gültige Quelle. |
| 3.1a | Startseite · Paketblock Fassung 2 | – | `3.1a-startseite-paketblock-fassung2.html` | `../02-preislogik.md` | **Archiv** (Paketblock ist in 3.1b integriert) |
| 3.1b | Startseite, Neufassung v01 | `/` | `3.1b-startseite-neufassung.html` | `../briefings/0021-startseite-neufassung.md` | **gültig**, Stefan (06.09.2026). Layout wie 3.2c; Paketblock Fassung 2. **Kein Modulstatus.** Ersetzt die bestehende Startseite (Rebuild) |
| 3.2 | Plattform, Fassung 1 | – | `3.2-plattform.html` | `3.2-plattform-umsetzungsbriefing.md` | **Archiv, nicht bauen** (ersetzt durch 3.2c) |
| 3.2c | Plattform, Neufassung v02 | `/plattform` | `3.2c-plattform-neufassung.html` | `../briefings/0016-plattform.md` | **gültig**, von Stefan freigegeben (06.09.2026). Modernes Layout: Wrap 1180, Radius 12 (große Flächen), Sektionen 120 px, H2 bis 48 px |
| 3.3 | So arbeitet GolfNext, Fassung 1 | – | `3.3-so-arbeitet-golfnext.html` | `3.3-so-arbeitet-golfnext-briefing.md` | **Archiv, nicht bauen** (ersetzt durch 3.3b). **Achtung:** 3.3b trägt **neue Texte**, nicht die des alten Briefings – dieses ist damit keine Textquelle mehr |
| 3.3b | So arbeitet GolfNext, Neufassung v01 | `/plattform/so-arbeitet-golfnext` | `3.3b-so-arbeitet-golfnext-neufassung.html` | `../briefings/0024-so-arbeitet-golfnext.md` | **gültig**, Stefan (07.09.2026). Layout wie 3.2c. Vier Abschnitte: Hero mit Vier-Nachrichten-Strecke, „Fünf Zielgruppen, fünf eigene Strecken", „Die letzte Nachricht schreibt kein System", „Drei Regeln". **Kein Modulstatus.** Textquelle ist der Mock |
| 3.4 | Wachstum & Vertrieb, Fassung 1 | – | `3.4-wachstum-vertrieb.html` | `3.4-wachstum-vertrieb-briefing.md` | **Archiv, nicht bauen** (ersetzt durch 3.4b) |
| 3.4b | Wachstum & Vertrieb, Neufassung v01 | `/wachstum-vertrieb` | `3.4b-wachstum-vertrieb-neufassung.html` | `../briefings/0017-wachstum-vertrieb.md` | **gültig**, von Stefan freigegeben (06.09.2026). Layout wie 3.2c (Wrap 1180, Radius 12, Sektion 120, H2 48) |
| 3.5 | Clubprozesse, Fassung 1 | – | `3.5-clubprozesse.html` | `3.5-clubprozesse-briefing.md` | **Archiv, nicht bauen** (ersetzt durch 3.5b) |
| 3.5b | Clubprozesse, Neufassung v01 | `/clubprozesse` | `3.5b-clubprozesse-neufassung.html` | `../briefings/0018-clubprozesse.md` | **gültig**, von Stefan freigegeben (06.09.2026). Layout wie 3.2c |
| 3.6 | Pakete, Fassung 1 | – | `3.6-pakete-fassung1-archiv.html` | `3.6-pakete-briefing.md` | **Archiv, nicht bauen** |
| 3.7 | Pakete, Fassung 2 | `/pakete` | `3.7-pakete.html` | `3.6-pakete-briefing.md` + `../02-preislogik.md` | **gültig**, von Stefan freigegeben |
| 3.8 | Über GolfNext, Fassung 1 | – | `3.8-ueber-golfnext.html` | `3.8-ueber-golfnext-briefing.md` | **Archiv, nicht bauen** (ersetzt durch 3.8b) |
| 3.8b | Über GolfNext, Neufassung v01 | `/ueber-golfnext` | `3.8b-ueber-golfnext-neufassung.html` | `../briefings/0019-ueber-golfnext.md` | **gültig**, Stefan (06.09.2026). Layout wie 3.2c. **Modulstatus-Inhalte (Abschnitt 3/„Grundsätze" mit Im Einsatz/Pilot/In Entwicklung) NICHT übernehmen** (Entscheidung Stefan) |
| 3.9a | Praxis, Übersicht (zugleich der Blog) | `/praxis` | `3.9a-praxis-uebersicht.html` | Content aus Sanity (Phase 3) | **gültig**, Stefan (06.09.2026). Layout wie 3.2c. **Kein Modulstatus.** Die neun Artikel im Mock sind Beispieltexte ohne Freigabe |
| 3.9b | Praxis, Artikel | `/praxis/[slug]` | `3.9b-praxis-artikel.html` | Content aus Sanity (Phase 3) | **gültig**, Stefan (06.09.2026). Artikel-Layout. **Kein Modulstatus** |
| 3.10 | Kontakt | `/kontakt` | `3.10-kontakt.html` | `../briefings/0025-kontakt.md` | **gültig**, Stefan (07.09.2026). H1 „Schreiben Sie uns. Es antwortet ein Mensch." Zwei Abschnitte: Formular („Ihre Nachricht an GolfNext") und „Nicht jeder schreibt gern ein Formular." (Erstgespräch · Live-Demo · Telefon). Ersetzt die frühere Annahme aus `docs/10` §40, es brauche kein Briefing. Entsteht mit Masterplan 4.3 (Formularmechanik) |
| – | Impressum, Datenschutz | `/impressum`, `/datenschutz` | – | `../legal/` | Texte vorhanden |

Entfallen am 07.09.2026 (Fred/Stefan, Briefing 0023): **Team** (`/team` – der Inhalt steckt im Abschnitt „Die Menschen dahinter" auf `/ueber-golfnext`), **Ratgeber** (`/ratgeber` – der Blog heißt `/praxis`) und die zwölf **Modulseiten** (`/module/<slug>` – die Namen bleiben in der Footer-Systemkarte, dort ohne Link).

Navigation (Struktur v2, Fred/Stefan 07.09.2026 – ersetzt Kapitel 2.4): Plattform ▾ (So arbeitet GolfNext) · Wachstum & Vertrieb · Clubprozesse · Pakete · Über GolfNext ▾ (Praxis, Kontakt) · CTA „Online-Erstgespräch vereinbaren". Clubprozesse hat kein Dropdown mehr. Nicht-`live` Punkte werden nicht gerendert, deshalb zeigt die Navigation aktuell fünf reine Links ohne Dropdown. Footer-Systemkarte: Abschluss-CTA, Modulkarte (zwölf Modulnamen als Text, ohne Status-Punkte), Kontakt, Rechtliches.

> **Die Kopfzeilen in allen Mocks unter `mocks/` zeigen die alte Navigation** (Praxis als Hauptpunkt, Modul-Dropdowns). Das ist kein Fehler und wird nicht korrigiert: die Mocks bleiben verbindlich für die **Seiteninhalte**, für die Navigation gilt die Entscheidung vom 07.09.2026. Den gebauten Header nicht an die Mock-Köpfe zurückanpassen.

## Gemeinsame Bausteine

Alle Seitenmocks teilen sich einen Kopfbereich im `<style>` (Tokens, Reset, `.pwrap`, `.eyebrow`, `.psec`, `.btn-cta`, `.tlink`, Header, `.hint`, `.shot`, `.statement3`) und den Footer-Block (`.pfoot`, `.f-close`, `.f-map`, `.f-contact`, `.f-bar`). Genau diese werden zu geteilten Komponenten. Sektionsspezifische Blöcke (`/* ---- n · … ---- */`) werden zu Seitenkomponenten.

Empfohlene Komponentenstruktur:

```
components/
  site/        Header, Nav, MobileNav, Footer, FooterClose, Wortmarke
  ui/          Button, TextLink, Eyebrow, Section, Hint, Statement, Shot, Faq, Badge, Chip
  pages/
    startseite/   Hero, Journey, Praxis, Pakete (Fassung 2!), Anna
    plattform/    Hub, Positionierung, Breite, Teaser, Trust
    so-arbeitet/  …
    wachstum/     …
    clubprozesse/ …
    pakete/       HeroStack, Sockel, Rail, PaketKarten, Werbebudget, Vergleich, Faq
    ueber/        Einstieg, Weg, Partner, Menschen
```

### Falle: die geteilten Bausteine schlagen die Sektions-Klasse (gefunden 08.09.2026)

`Section` und `Wrap` setzen ihre Werte über Selektoren, die stärker sind oder gleich
stark und später stehen als eine einzelne Klasse aus einem Seiten-Modul. Zweimal
hintereinander auf den Praxis-Seiten aufgelaufen, beide Male erst in der Preview
sichtbar – deshalb hier notiert.

**1. `Section` färbt jede `h2` darin ein.** `Section.module.css` trägt

```css
.section :global(h2) { font-size: var(--gn-h2); margin-bottom: 16px; max-width: 22ch; }
```

Das ist ein Nachfahren-Selektor mit der Spezifität (0,1,1) und schlägt damit jede
einzelne Klasse (0,1,0) aus einem Seiten-Modul. Ein `h2`, das **keine**
Sektionsüberschrift ist – ein Kartentitel zum Beispiel –, kommt sonst mit 40 px und
22ch Breite heraus und bricht nach wenigen Wörtern um. Auf `/praxis` traf es die
Artikelkarten; im Block „Passt dazu" fiel es nicht auf, weil die Karten dort `h3` sind.

*Abhilfe:* im Seiten-Modul mit **zwei** Klassen selektieren (`.card .titel`, (0,2,0))
und `max-width` sowie `margin-bottom` ausdrücklich zurücknehmen. `Section.module.css`
bleibt unangetastet – der Baustein trägt jede Seite.

**2. `Wrap` nullt oben und unten Innen- wie Außenabstand.** `Wrap.module.css` trägt

```css
.wrap { max-width: var(--gn-wrap); margin: 0 auto; padding: 0 var(--gn-gutter); }
```

Beides sind Kurzschreibweisen. Liegt eine eigene Klasse **auf demselben Element**
(`<Wrap className={styles.art}>`), haben beide dieselbe Spezifität (0,1,0) und `.wrap`
gewinnt über die Reihenfolge – `padding-top/-bottom` **und** `margin-top/-bottom` der
eigenen Klasse fallen ersatzlos weg. Auf der Artikelseite verschwand so der Abstand
über und unter dem Textbereich.

*Abhilfe:* entweder den doppelten Klassenselektor (`.art.art`, (0,2,0)) oder ein
eigenes Element **innerhalb** des `Wrap`. Wer die Spezifität anhebt, muss auch die
Medienabfragen derselben Klasse anheben – sonst greifen die responsiven Überschreibungen
nicht mehr (genau das ist beim ersten Versuch passiert: die 300-px-Seitenspalte blieb
auf dem Telefon stehen und erzeugte einen waagerechten Überlauf).

**3. Dasselbe gilt für `Shot`.** `Shot.module.css` setzt `.shot` mit eigenem Radius
(4 px) und Rahmen. Eine Seiten-Klasse daneben – `.coverShot` auf der Artikelseite, der
`.shot`-Override in der Karte – hat dieselbe Spezifität (0,1,0); wer gewinnt, hinge an
der Reihenfolge im Bündel. Auf der Artikelseite kam der Titelbild-Platzhalter deshalb
mit 4 px und Rahmen heraus, während das echte Titelbild daneben 12 px und randlos ist.
Auch hier hilft nur, mit zwei Klassen zu selektieren: `.cover .coverShot`, `.card .shot`.

**Merksatz:** Wer eine eigene Klasse auf einen geteilten Baustein legt, prüft vorher
dessen Modul-CSS auf Nachfahren-Selektoren und Kurzschreibweisen – und danach das
Ergebnis in allen fünf Breakpoints, nicht nur am Schreibtisch-Monitor.


## Prinzipien (aus Kapitel 1.1)

1. Ruhe vor Effekt – große Headlines, kurze Absätze, viel Fläche.
2. Zeigen statt behaupten – echte Oberflächen, sonst beschriftete Platzhalter.
3. Ein System, keine Modulsammlung – Verbindung sichtbar machen (Linien, Stapel, Sockel).
4. Persönlich – Fred ist Ansprechpartner, der Abschluss jeder Seite ist ein Gespräch, keine Leistungsliste.

## Hero-Layout (Standard für alle Seiten)

Seit 06.09.2026 (Entscheidung Stefan, Briefing 0015) gilt **eine** Hero-Aufteilung für alle Seiten – die dominante Textspalte des Pakete-Heros, **nicht** 50/50:

- Raster `grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr)`, `gap: 56px`, `align-items: center`.
- Textspalte dominant: `h1` `max-width: ~19ch`, Lead `max-width: ~58ch`.
- Systemspalte rechts (Strecke/Stapel/Grafik) ist die schmalere 1fr-Spalte.
- Unter **1080 px** einspaltig (`minmax(0, 1fr)`), Reihenfolge Text → Grafik.
- Genau **eine** `<h1>` je Seite; kein horizontaler Overflow @390–1440.

Umgesetzt in `components/pages/*/Hero.module.css` (Startseite und Pakete identisch aufgeteilt).

## Bewegung (gilt seitenübergreifend)

Einmalig, Endzustand bleibt, kein Loop, kein Ton, kein Scroll-Zwang, keine Layoutverschiebung, Reduced Motion zeigt sofort den Endzustand, Inhalte ohne JS lesbar. Welche Animation je Seite gewollt ist, steht im jeweiligen Briefing und ist im Mock umgesetzt.

### Bewegungs-Standard der Umsetzung (Briefing 0015)

**Scroll-Reveals** (`lib/motion/variants.ts`, Wrapper in `components/motion/`):

- `reveal` – einmaliges Aufblenden, **spürbarer** Translate von 28 px von unten (`opacity`+`y`), `.55 s`, Ease `[.2,.8,.3,1]`. Für Überschriften, Absätze, einzelne Karten.
- `rise` + `RiseItem` – Container staffelt seine Kinder mit `STAGGER = .1 s` klar nacheinander. Für Karten-/Stationen-Gruppen.
- `draw` (`Draw`, SVG-Pfad) und `RevealLine` (CSS-Balken über `scaleX`/`scaleY`) – für Verbindungslinien (Hero-Strecke, Journey-Linie, Pakete-„Rückgrat").
- `CountUp` – echte Kennzahlen zählen **einmal** hoch beim Sichtbarwerden (Wert wortgleich; Reduced-Motion/No-JS = Endwert).
- Auslöser überall `whileInView` mit `viewport={{ once: true, amount: .2 }}`; `initial` wird erst nach Mount und nur ohne `prefers-reduced-motion` gesetzt (Muster `useMountedReveal`) → Server-HTML rendert den Endzustand, ohne JS voll sichtbar.

**Hover-/Micro-Interaktionen (geteilte Konvention):**

- **Buttons:** jede Variante hat einen weichen Flächen-/Rahmen-Hover (`.cta`, `.primary`, `.ghost`, `.light`, `.hbtn`).
- **Karten-Hover-Lift:** globale Klasse **`.gn-card-lift`** (`app/globals.css`) – Navy-Rahmen + weicher Schatten + `translateY(-2px)`, `~.2 s`. An interaktive Karten hängen (Pakete-Karten, Vorteils-Karten, Praxis-Beispiel). Reduced-Motion: kein Anheben. Die Karte braucht einen sichtbaren `border`.
- **TextLink:** Pfeil rückt beim Hover `translateX(3px)`. Fokusring bleibt überall sichtbar (`:focus-visible`).

## Offene Assets (Fred liefert)

- Porträts Fred Hoffmann und Stefan Kühne (gleichwertige Bildgestaltung).
- Produkt-Screenshots für alle `.shot`-Platzhalter (Liste in `../03-seiten-und-routen.md`).
- Partnerlogos mit Freigabe und Beschriftung für „Über GolfNext".
- Zieladressen: Live-Demo, Buchung Erstgespräch, Teamseite.
- Optional: historische Logos imageGolf und GolfNext Consulting.
