# Zustände und Rückmeldungen (site-weit)

Quelle: UI-Kit `docs/design-system/mocks/2.5-ui-kit.html`, Abschnitt 7 „Alerts, Toast, Leerzustand, Laden" und die Button-Zustände in Abschnitt 1. Diese Datei legt fest, **wann** welcher Zustand verwendet wird. Formulare im Detail: `06-formulare-sendgrid.md`.

## Grundsatz

Die statischen Marketingseiten laden ohne Wartezustand – sie sind vorgerendert, Fonts und Bilder sind reserviert, es gibt nichts zu überbrücken. Ladezustände entstehen nur an drei Stellen: Inhalte aus Sanity (Praxis-Artikel, FAQ), das Formular beim Absenden, und Bilder. Für jede Stelle gibt es genau eine Antwort; keine kreativen Loader, keine Vollbild-Spinner, kein globaler Fortschrittsbalken.

## 1 · Inhalte, die noch laden: Skeleton statt Spinner

Heute üblich und für uns richtig: **Skeleton-Platzhalter in der Form des späteren Inhalts**, damit sich nichts verschiebt, wenn die Daten kommen.

- **Überholt am 08.09.2026 (Masterplan 3.4, Briefing 0027):** Die Praxis-Routen haben **kein** `loading.tsx`. Ein `loading.tsx` erzeugt eine Suspense-Grenze, Next streamt daraufhin, und der nachgereichte Teil wird nur per JavaScript eingesetzt – ohne JS blieben von `/praxis` 158 statt 1.902 Zeichen lesbar. „Ohne JavaScript vollständig lesbar" (CLAUDE.md) ist nicht verhandelbar und gewinnt; die Routen sind ISR-Inhalt, es gibt kaum Wartezeit zu überbrücken. Messung und Begründung in `docs/entscheidungen.md`. Der `Skeleton`-Baustein bleibt für künftige Fälle bestehen, in denen eine echte Wartezeit **ohne** Suspense-Grenze überbrückt wird.
- Shimmer aus dem UI-Kit (`@keyframes shimmer`, 1.4 s, Sand-Töne). Bei `prefers-reduced-motion` steht der Shimmer still (einfarbige Fläche).
- `Suspense`-Grenzen nur um wirklich dynamische Bereiche (z. B. „Weitere Artikel" unter einem Artikel), damit der Rest sofort steht (Streaming). Der Hauptinhalt eines Artikels wird nicht hinter einem Skeleton versteckt – er ist statisch/ISR und kommt mit dem ersten Byte.
- Skeleton nie länger als nötig; maximale sichtbare Dauer ist durch ISR/CDN ohnehin kurz. Kein künstliches Delay.
- Bilder: `next/image` mit `placeholder="blur"` und Sanity-LQIP (`metadata.lqip`), feste `aspect-ratio` – kein Springen, kein leerer Kasten.

Kein Skeleton für: Header, Footer, statische Sektionen, Consent-Dialog, Navigation (alles synchron da).

## 2 · Aktionen, die dauern: Button-Ladezustand

- `.btn.loading` aus dem UI-Kit: Text unsichtbar, 16-px-Ring dreht, `pointer-events:none`, Breite bleibt (kein Springen). Am umgebenden Element `aria-busy="true"`; im `sr-only` „Wird gesendet …".
- Mindestanzeige 400 ms gegen Flackern; kein Maximum, aber nach 10 s ohne Antwort `form.network`-Fehler anzeigen und Button freigeben.
- Genau ein Ladezustand je Aktion; keine zusätzlichen Spinner im Formular.

## 3 · Rückmeldungen nach Aktionen

| Situation | Baustein | Verhalten |
|---|---|---|
| Formular erfolgreich | `Alert ok` (`role="status"`) ersetzt das Formular | bleibt stehen, Fokus darauf, Folge-Link zur Buchung |
| Validierungsfehler | `.fmsg e` am Feld + `Alert err` (`role="alert"`) über dem Button | Fokus auf erstes fehlerhaftes Feld, Eingaben bleiben |
| Server-/Netzfehler | `Alert err` über dem Button | konkreter Ausweg (Mail, Telefon), Eingaben bleiben |
| Cookie-Einstellungen gespeichert | `Toast` (Navy, unten rechts, 3 s, `role="status"`) | einziger Toast-Einsatz auf der Website |
| Praxis-Filter ohne Treffer | `Empty` (gestrichelter Rahmen, Icon, H4, Text, Button „Alle Artikel") | Wortlaut ohne Marketing, ein Ausweg |
| Sanity nicht erreichbar | `error.tsx` im Segment: `Alert err` in der Seite, Header/Footer bleiben | Button „Noch einmal versuchen" (`reset()`), kein Stacktrace |
| 404 | `not-found.tsx` im Design | CTA Startseite und Erstgespräch |

Toasts sind bewusst selten: Sie verschwinden, Screenreader verpassen sie leicht, und nichts auf dieser Website ist so flüchtig, dass es keinen festen Platz verdient.

## 4 · Einheitliche Fehler- und Hinweistexte

- Alle Meldungen liegen in `lib/forms/messages.ts` (Formular) und `lib/ui/messages.ts` (Leerzustände, Fehlerseiten, Toast). Komponenten enthalten keine freien Meldungstexte.
- Tonalität: Sie-Form, ein Satz, benennt immer den nächsten Schritt, keine Technik („Fehler 500", „Request failed" kommen nicht vor), keine Ausrufezeichen, kein „Oops".
- Farben ausschließlich über Tokens: `err #A3564A` auf `errbg`, `ok #2E6B38` auf `okbg`, `info` Blau. Fehler nie nur über Farbe – immer Icon **und** Text (Farbenblindheit).
- Icon-Größe in Alerts 18 px, in Feldmeldungen 14 px, beide fix gesetzt.

## 5 · Barrierefreiheit der Zustände

- `role="alert"` für Fehler (unterbricht), `role="status"` für Erfolg/Info (unterbricht nicht).
- `aria-invalid` und `aria-describedby` an fehlerhaften Feldern; Pflichtfelder mit `required` **und** sichtbarem Stern.
- Fokusmanagement: nach Absenden mit Fehlern auf das erste fehlerhafte Feld, nach Erfolg auf den Erfolgsalert.
- Skeletons `aria-hidden="true"` plus ein `sr-only`-„Inhalte werden geladen" am Container mit `aria-busy`.
- Alle Zustände per Tastatur erreichbar, Fokusring sichtbar (Token `blue`, 2 px, Offset 3 px).

## 6 · Prüfen (Skill `golfnext-qa`)

- **Kein** `loading.tsx` auf den Sanity-Routen (Entscheidung 08.09.2026, siehe oben). Stattdessen wird geprüft: Die Route ist **ohne JavaScript** vollständig lesbar, und der Inhalt steht im ersten Server-HTML (kein CLS > 0.02).
- Formular: Doppelklick sendet einmal; `aria-busy` während Versand; Fehlerfokus; Erfolgsfokus; ohne JS funktionsfähig.
- `error.tsx` und `not-found.tsx` rendern Header und Footer.
- Kein Meldungstext außerhalb der `messages.ts`-Dateien (Grep in `components/`).
