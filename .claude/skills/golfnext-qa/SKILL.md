---
name: golfnext-qa
description: Prüfroutine vor dem Abschluss eines Masterplan-Schritts – Playwright-Checks auf Overflow, Icon-Größen, Reduced Motion, No-JS, Konsolenfehler, Lighthouse und Textabgleich mit dem Briefing. Laden, bevor ein Schritt als erledigt markiert wird.
---

# QA-Routine GolfNext

Ziel: dieselben Fehler, die in der Mock-Phase auffielen, automatisch fangen. Tests liegen unter `tests/e2e/`, laufen mit `pnpm test:e2e` gegen einen Produktionsbuild (nicht gegen den Dev-Server). **Vorher `pnpm build:e2e`**, nicht `pnpm build`: Das Skript baut zwei Fassungen (`.next` mit Beispielartikeln, `.next-leer` ohne einen einzigen Artikel), Playwright startet beide auf Port 3000 und 3001 – nur so lassen sich die Seiten prüfen, deren Inhalt beim Bauen entsteht (`/`, `/ueber-golfnext`). Siehe `scripts/build-e2e.mjs`.

## Pflichtchecks je Route

1. **Horizontaler Overflow** bei 390, 768, 1024, 1180, 1440 px: `document.documentElement.scrollWidth - innerWidth === 0`.
2. **Innerer Overflow**: kein sichtbares Element ragt > 2 px über sein Elternelement mit `overflow: visible` hinaus.
3. **Icon-Guard**: kein `<svg>` breiter oder höher als 90 px, ausgenommen `[data-large-svg]` (Wortmarke, bewusste Grafiken).
4. **Konsole**: keine `pageerror`, keine `console.error`.
5. **Reduced Motion**: mit `reducedMotion: 'reduce'` sind alle animierten Elemente im Endzustand (Opacity 1, Klassen `on/lit/done` gesetzt bzw. CSS-Endzustand).
6. **Ohne JavaScript** (`javaScriptEnabled: false`): alle H1/H2/H3 und Fließtexte im DOM sichtbar (`opacity ≥ .9`, nicht `display:none`), Navigation lesbar.
7. **Überschriften**: genau eine H1; H2/H3-Reihenfolge ohne Sprünge.
8. **Textabgleich**: Pflichttexte der Seite (aus dem Briefing, Liste in `tests/e2e/fixtures/<seite>.json`) sind wortgleich im `innerText`.
9. **Preise (Pakete/Startseite)**: kein Summenwert im Text (`550 €`, `700 €`, `900 €`, `12.000`, `14.000`, `8.500` dürfen nicht vorkommen); Sockel `6.800 €`/`238 €` und Modulblöcke `5.200/312`, `7.200/462`, `ab 662 €` vorhanden.
10. **Grün-Regel**: kein Textknoten mit `color` ≈ `#00E805` auf hellem Hintergrund (Luminanz des nächsten Hintergrunds > .5).

## Formulare und Zustände (wo vorhanden)

11. **Formular**: Doppelklick auf Senden erzeugt genau eine Mail (Mock-Transport); während des Versands `aria-busy="true"` und `.btn.loading`; Feldfehler mit `aria-invalid` + `aria-describedby`, Fokus auf erstem Fehlerfeld; Erfolgsalert mit `role="status"` erhält den Fokus; ohne JS liefert ein POST das Ergebnis auf derselben Seite.
12. **Spam-Regeln**: gefüllter Honeypot und fehlende/ungültige Zeitstempel-Signatur → `{ok:true}` ohne Mail.
13. **Skeletons**: jede Sanity-Route hat `loading.tsx`; Skeleton und geladener Zustand haben gleiche Rastermaße (CLS < 0.02); Shimmer steht bei Reduced Motion.
14. **Meldungstexte** nur aus `lib/forms/messages.ts` und `lib/ui/messages.ts` – Grep in `components/` nach hartkodierten Fehlertexten.

## Site-weit

- `pnpm lint`, `pnpm typecheck`, `pnpm build` ohne Warnungen, die auf fehlende Bilder oder Metadata hinweisen.
- Lighthouse (mobil) ≥ 95 in allen vier Kategorien; LCP-Element ist Text, kein Bild.
- Kein Request an `fonts.googleapis.com`, `fonts.gstatic.com` oder Tracking-Domains vor Consent (Netzwerk-Log in Playwright prüfen).
- `sitemap.xml`, `robots.txt`, kanonische URLs, OG-Bild pro Route vorhanden.
- 404-Seite im Design.

## Barrierefreiheit automatisch

`pnpm test:a11y` – `@axe-core/playwright` je Route bei 1440 und 390 px; Regeln `wcag2a`, `wcag2aa`, `wcag21aa`. Jeder `serious`/`critical`-Befund ist ein FAIL. Bekannte, begründete Ausnahmen in `tests/a11y/allowlist.json` mit Kommentar.

## Visuelle Regression gegen den Mock

`pnpm test:visual` – `tests/visual/*.spec.ts` rendert den Mock aus `docs/design-system/mocks/<seite>.html` (Playwright, gleiche Viewports, Animationen per `reducedMotion: 'reduce'` im Endzustand) und die Route sektionsweise (`[data-section]`) und vergleicht mit `toHaveScreenshot({ maxDiffPixelRatio: 0.03 })`. Baselines liegen unter `tests/visual/__screenshots__/`; Aktualisierung nur bewusst (`--update-snapshots`) mit Begründung im PR. Abweichungen in Worten beschreiben (Abstand, Schrift, Farbe, fehlendes Element), nicht nur als Prozentwert.

## Ergebnis festhalten

Am Ende eines Schritts kurz in der Commit-Nachricht oder in `docs/entscheidungen.md`: welche Checks liefen, was abweicht, was offen ist.
