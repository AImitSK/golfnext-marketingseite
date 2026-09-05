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
| 3.1 | Startseite | `/` | `3.1-startseite.html` | `3.1-startseite-umsetzungsbriefing.md` | Layout freigegeben. Abschnitt 6 (Pakete) zeigt noch Fassung 1 – **Ersatz: 3.1a** |
| 3.1a | Startseite · Paketblock Fassung 2 | `/` Abschnitt 6 | `3.1a-startseite-paketblock-fassung2.html` | `../02-preislogik.md` | Ausschnitt; ersetzt Abschnitt 6 von 3.1. Sockelband + drei Modulkarten, keine Summen. |
| 3.2 | Plattform | `/plattform` | `3.2-plattform.html` | `3.2-plattform-umsetzungsbriefing.md` | freigegeben |
| 3.3 | So arbeitet GolfNext | `/plattform/so-arbeitet-golfnext` | `3.3-so-arbeitet-golfnext.html` | `3.3-so-arbeitet-golfnext-briefing.md` | freigegeben |
| 3.4 | Wachstum & Vertrieb | `/wachstum-vertrieb` | `3.4-wachstum-vertrieb.html` | `3.4-wachstum-vertrieb-briefing.md` | freigegeben; doppelte Headline in Abschnitt 4/Footer – Fred entscheidet |
| 3.5 | Clubprozesse | `/clubprozesse` | `3.5-clubprozesse.html` | `3.5-clubprozesse-briefing.md` | freigegeben |
| 3.6 | Pakete, Fassung 1 | – | `3.6-pakete-fassung1-archiv.html` | `3.6-pakete-briefing.md` | **Archiv, nicht bauen** |
| 3.7 | Pakete, Fassung 2 | `/pakete` | `3.7-pakete.html` | `3.6-pakete-briefing.md` + `../02-preislogik.md` | **gültig**, von Stefan freigegeben |
| 3.8 | Über GolfNext | `/ueber-golfnext` | `3.8-ueber-golfnext.html` | `3.8-ueber-golfnext-briefing.md` | freigegeben |
| – | Praxis | `/praxis` | – | fehlt | wartet auf Briefing |
| – | Team | `/team` | – | fehlt | wartet auf Briefing (CTA „Unser Team kennenlernen" zeigt hierhin) |
| – | Kontakt | `/kontakt` | – | fehlt | wartet auf Briefing |
| – | Modulseiten | `/module/<slug>` | – | fehlt | wartet auf Briefing; Footer-Systemkarte verlinkt dorthin |
| – | Ratgeber | `/ratgeber`, `/ratgeber/[slug]` | – | Content aus Sanity | Layout aus Bausteinen ableiten (Karten 2.5, Artikel-Typografie 2.2) |
| – | Impressum, Datenschutz | `/impressum`, `/datenschutz` | – | `../legal/` | Texte vorhanden |

Navigation (Kapitel 2.4, von Fred festgelegt): Plattform · Wachstum & Vertrieb · Clubprozesse · Praxis · Pakete · Über GolfNext · CTA „Online-Erstgespräch vereinbaren". Plattform und Clubprozesse erhalten Modul-Dropdowns. Footer-Systemkarte: Abschluss-CTA, Modulkarte (zwölf Module, Status-Punkte), Kontakt, Rechtliches.

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

## Prinzipien (aus Kapitel 1.1)

1. Ruhe vor Effekt – große Headlines, kurze Absätze, viel Fläche.
2. Zeigen statt behaupten – echte Oberflächen, sonst beschriftete Platzhalter.
3. Ein System, keine Modulsammlung – Verbindung sichtbar machen (Linien, Stapel, Sockel).
4. Persönlich – Fred ist Ansprechpartner, der Abschluss jeder Seite ist ein Gespräch, keine Leistungsliste.

## Bewegung (gilt seitenübergreifend)

Einmalig, Endzustand bleibt, kein Loop, kein Ton, kein Scroll-Zwang, keine Layoutverschiebung, Reduced Motion zeigt sofort den Endzustand, Inhalte ohne JS lesbar. Welche Animation je Seite gewollt ist, steht im jeweiligen Briefing und ist im Mock umgesetzt.

## Offene Assets (Fred liefert)

- Porträts Fred Hoffmann und Stefan Kühne (gleichwertige Bildgestaltung).
- Produkt-Screenshots für alle `.shot`-Platzhalter (Liste in `../03-seiten-und-routen.md`).
- Partnerlogos mit Freigabe und Beschriftung für „Über GolfNext".
- Zieladressen: Live-Demo, Buchung Erstgespräch, Teamseite.
- Optional: historische Logos imageGolf und GolfNext Consulting.
