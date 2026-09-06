---
name: golfnext-design-system
description: Verbindliche Design-Regeln für die GolfNext-Website – Tokens, Bausteine, Grün-Regel, Typografie, Bewegung. Vor jedem UI-Code laden, besonders wenn Farben, Abstände, Buttons, Karten, Header/Footer oder Animationen gebaut werden.
---

# GolfNext Design-System

Quelle der Wahrheit: `docs/design-system/` (Tokens, Mocks, README). Diese Skill fasst zusammen, was beim Bauen zählt.

## Tokens

- CSS-Variablen und Tailwind-`@theme`: `docs/design-system/tokens/tokens.css` und `tailwind-theme.css`. Werte **nicht** abändern.
- Farben: `navy #01415B` (primär), `navy-deep #012B3D`, `blue #0B6A90` (Links, Eyebrows), `sky #7FD3F0`, `signal #00E805`, Flächen `paper/sand/mist`, Text `ink/muted`, Linie `line`.
- Radius 4 px überall, Pills 20 px. Keine Schatten außer der gezielten Karten-Hervorhebung `0 30px 60px -42px rgba(1,65,91,.65)`.

## Grün-Regel (nicht verhandelbar)

Signalgrün nur als Fläche (Button, Badge), Punkt, Linie – oder als **Text auf Navy**. Nie grüner Text auf hellem Grund. Buttons: grüne Fläche, Navy-Text, 700.

## Typografie

- Display: Archivo 700/800, Tracking −0.02 em (H1 bis −0.035 em), `text-wrap: balance` bei Headlines.
- Text: Inter 17 px / 1.65. Nebentext `muted` 13.5–15.5 px.
- Eyebrow: 12.5 px, Versalien, Tracking .18 em, `blue` (auf dunkel `signal`).
- Genau eine H1. H2 `clamp(27px,3.2vw,40px)`, max 22ch. Lead `clamp(16px,1.3vw,19px)`, `muted`, max 62ch.
- Fonts über `next/font/google` mit `display: 'swap'` und CSS-Variablen `--font-archivo`, `--font-inter` – self-hosted durch Next, kein externer Request.

## Wiederkehrende Bausteine (aus 2.4 / 2.5 und den Seitenmocks ableiten)

| Baustein               | Mock-Klasse                                               | Hinweise                                                                                                     |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Header                 | `.hdr`                                                    | sticky, 80 px, Wortmarke 19 px, aktive Seite mit grüner Unterlinie, CTA-Button rechts mit zweizeiligem Text  |
| Section                | `.psec` (+ `.sand`/`.mist`)                               | 86 px vertikal, Wrap 1140 px, Gutter 40/26/20                                                                |
| Eyebrow + H2 + Lead    | `.eyebrow`, `h2`, `.lead`                                 | immer in dieser Reihenfolge                                                                                  |
| Primär-Button          | `.btn-cta` / `.b1`                                        | grün, optional zweizeilig mit `<small>`                                                                      |
| Text-Link mit Pfeil    | `.tlink`                                                  | blau, Pfeil rückt beim Hover 3 px                                                                            |
| Hinweis                | `.hint`                                                   | Info-Icon **15 px fix** + muted Text, max 72ch                                                               |
| Statement              | `.statement3`                                             | Archivo 700, linker grüner Balken 3 px                                                                       |
| Platzhalter für Bilder | `.shot`                                                   | Sand-Fläche, gestrichelte Innenlinie, Tagline oben links, Beschreibung unten, festes Seitenverhältnis        |
| Footer-Systemkarte     | `.pfoot` mit `.f-close`, `.f-map`, `.f-contact`, `.f-bar` | dunkel, Abschluss-CTA oben, Modulkarte mit Status-Punkten (grün Im Einsatz, gold Pilot, weiß In Entwicklung) |
| FAQ                    | `.faqitem/.faqq/.faqa`                                    | Plus/Minus aus zwei Strichen, `aria-expanded`                                                                |

Empfohlene Komponenten: `Header`, `Footer`, `Section`, `Eyebrow`, `Button`, `TextLink`, `Hint`, `Statement`, `Shot`, `Faq`, `Wortmarke`. Seiten-spezifische Grafiken (Hero-Stapel, Zeitschiene, Vergleichstabelle) sind eigene Komponenten unter `components/pages/<seite>/`.

## Bewegung

- Bibliothek: `motion/react` (kostenlos). Vor dem Bauen einer Animation den `/motion`-Skill laden (liefert aktuelle API und Best Practices). Gemeinsame Varianten liegen in `lib/motion/variants.ts` – neue Varianten nur, wenn ein Mock sie wirklich braucht.
- **Haltung (gelockert 06.09.2026, Stefan): Bewegung mit Absicht – modern und lebendig, aber seriös.** Die Seite darf sich nicht wie statisches HTML anfühlen: Hover-/Micro-Interaktionen, weiche Übergänge, spürbare Scroll-Reveals, dezent lebendige Elemente sind erwünscht.
- Scroll-Reveals standardmäßig einmalig: `whileInView` mit `viewport={{ once: true, amount: .2 }}`; sie dürfen **spürbar** sein (großzügiger Translate, klare Staffelung), nicht nur ein leises Fade.
- **Kontinuierliche/wiederkehrende Bewegung erlaubt**, wenn dezent, langsam und nicht ablenkend (kein hektisches Blinken, kein aufdringlicher Dauer-Effekt). **Zähler** für echte Kennzahlen erlaubt (einmal hochzählen, Reduced-Motion zeigt den Endwert).
- **Mit Bedacht statt Tabu:** Typewriter, ScrambleText, splitText, Ticker, Carousel, Cursor-Effekte nur, wo sie dem Inhalt dienen und seriös wirken – nie als Selbstzweck; im Zweifel schlicht.
- Nicht verhandelbar: Endzustand bleibt stehen; kein Ton, kein Scroll-Zwang; **keine Layoutverschiebung/CLS** (nur `opacity`/`transform`/`pathLength`, Höhen vorab reservieren).
- `prefers-reduced-motion: reduce` → Endzustand sofort, alle `transition/animation: none`.
- Ohne JavaScript sind alle Inhalte sichtbar: Server-HTML rendert den Endzustand, `initial`-Startzustände werden erst clientseitig gesetzt (Muster in `lib/motion/variants.ts`).

## Typische Fehler aus der Mock-Phase (nicht wiederholen)

- SVG ohne Größe → skaliert auf Containerbreite. Icons immer mit Breite/Höhe.
- `display:block` bei `<span>`-Stapeln in Buttons vergessen → Zeilen laufen ineinander.
- Grid-Kinder ohne `minmax(0,1fr)` → Min-Content-Overflow bei 1180 px.
- Inline-Zusatz im grünen Button (dunkelgrün auf grün) → unlesbar; Zusatzzeile unter den Button.
- Große leere Foto-Platzhalter wirken schlechter als keine. Klein halten oder weglassen, bis das Bild da ist.
