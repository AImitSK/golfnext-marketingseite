# 0033 · Einwilligung, Consent Mode v2, Reichweitenmessung

Masterplan-Schritte: 5.3 · 5.4 · 5.5 · 5.6 · Branch: `feat/consent` · Phase: 5

## Kontext und Lesereihenfolge

Die Website lädt heute **kein** Third-Party-Script. Dieser Schritt baut die Mechanik, mit
der später eines geladen werden darf: einen Einwilligungs-Dialog, Google Consent Mode v2
im Standardmodus „alles verweigert", das Nachladen von GTM und Meta-Pixel **erst** nach
Einwilligung, die cookielose Reichweitenmessung von Vercel und den Nachweis per Playwright.

Wichtig für das Verständnis: `NEXT_PUBLIC_GTM_ID` und `NEXT_PUBLIC_META_PIXEL_ID` sind
**nicht gesetzt**. Nach diesem Schritt lädt also weiterhin nichts – die Mechanik steht
bereit und der Zustand ist prüfbar. Genau so ist es gewollt und genau so steht es in der
Datenschutzerklärung („derzeit ist kein Dienst dieser Kategorie im Einsatz").

1. `CLAUDE.md`
2. `docs/05-consent-dsgvo.md` – die verbindliche Fassung: Tool, Kategorien, Consent Mode,
   Umsetzungsschritte 1–7
3. `docs/09-tracking-plan.md` – Ereignisse, Conversion-Definition, `/danke`
4. `docs/legal/datenschutz.md`, Abschnitte **6** (Cookies und Einwilligung) und **7**
   (Reichweitenmessung) – daher kommen die Texte des Dialogs
5. `docs/08-zustaende-und-feedback.md` – der Dialog ist der **einzige** Toast der Website
6. `components/site/CookieSettingsButton.tsx` – der Footer-Button wartet mit einem
   `TODO(5.3)` auf seine Aufgabe
7. `docs/design-system/README.md` und die Tokens – Navy/Paper, 4 px Radius, Archivo/Inter

## Harte Vorgaben

- **Vor der Einwilligung geht kein Byte an Dritte.** Kein Google, kein Meta, kein
  Tag Manager, keine externe Schrift – auch nicht „nur zum Vorbereiten".
- **Keine Dark Patterns.** „Alle akzeptieren", „Nur notwendige" und „Einstellungen" sind
  **gleichwertig** gestaltet: gleiche Größe, gleiches Gewicht, gleiche Farbfläche.
  Ablehnen darf nicht schwerer sein als Zustimmen. Kein vorausgewähltes Häkchen außer
  „Notwendig" (nicht abwählbar), kein Wegklicken, das als Zustimmung zählt.
- **Ohne IDs lädt nichts.** Fehlt `NEXT_PUBLIC_GTM_ID` bzw. `NEXT_PUBLIC_META_PIXEL_ID`,
  wird das jeweilige Script nie eingebunden – unabhängig von der Einwilligung.
- **`gtag('consent','default', …denied)` steht vor allem anderen** im `<head>`, mit
  `wait_for_update: 500`. Kein „Advanced Consent Mode", keine cookielosen Pings ohne
  Einwilligung.
- **Vercel Web Analytics läuft ohne Einwilligung** (cookielos, in Abschnitt 7 der
  Datenschutzerklärung benannt) – aber nur dieses eine.
- **Texte kommen aus `docs/legal/datenschutz.md`.** Die Kategorienbeschreibungen werden
  wortgleich aus Abschnitt 6 übernommen. Der Einleitungstext des Dialogs steht unten unter
  „Freigegebene Texte" – wortgleich, nichts ergänzen.
- **Die Datenschutzerklärung wird in diesem Schritt nicht geändert.** Sie beschreibt den
  Zustand korrekt. Erst wenn jemand eine GTM- oder Pixel-ID einträgt, muss der Dienst dort
  benannt werden; halte das als Hinweis in `docs/05` fest.
- Der Dialog ist **ohne Maus bedienbar** (Tastatur, sichtbarer Fokus, Fokusfalle im
  Dialog, `Esc` schließt die Einstellungen), respektiert `prefers-reduced-motion` und
  verschiebt beim Erscheinen **kein Layout**.
- **Ohne JavaScript** bleibt die Website vollständig lesbar und bedienbar. Erscheint kein
  Dialog, wird auch nichts geladen – der sichere Zustand.

## Aufgaben

1. **Consent-Tool** (5.3): `vanilla-cookieconsent` v3 als Abhängigkeit,
   `lib/consent/config.ts` mit der deutschen Konfiguration (Kategorien `necessary`
   – immer an, nicht abwählbar –, `analytics`, `marketing`; `revision`, Cookie `cc_cookie`,
   Laufzeit 6 Monate) und `components/site/ConsentBanner.tsx` als Client-Baustein, der
   nichts Sichtbares selbst rendert. Gestaltung über eigene CSS-Variablen auf die Tokens
   ziehen (Navy/Paper, 4 px Radius, Archivo für Überschrift, Inter für Text) – **keine**
   fremde Optik stehen lassen.
2. **Footer-Button** (5.3): `CookieSettingsButton` öffnet die Einstellungen erneut
   (`showPreferences()`); das `TODO(5.3)` verschwindet.
3. **Consent Mode v2 und Nachladen** (5.4): Inline-`gtag('consent','default')` im `<head>`
   vor allem anderen; `components/site/Analytics.tsx` lädt GTM (`next/script`,
   `afterInteractive`) und Meta-Pixel **nur** bei Einwilligung `marketing` **und** gesetzter
   ID; bei Widerruf wird nichts nachgeladen und der Status auf `denied` zurückgesetzt.
4. **Ereignisse** (5.4): `lib/tracking/events.ts` mit den Ereignissen aus
   `docs/09-tracking-plan.md` (`dataLayer.push`, snake_case). Ohne Einwilligung ist der
   Aufruf wirkungslos, nicht fehlerhaft. Verdrahte in diesem Schritt nur
   `cta_erstgespraech_click` und `contact_submitted`; die übrigen Ereignisse bleiben
   vorbereitet, aber ungenutzt – sie hängen an Bausteinen, die sonst umgebaut werden müssten.
5. **`/danke`** (5.4): Route mit `noindex`, wird nach erfolgreichem Formular aufgerufen
   (`/danke?quelle=kontakt`). Text: nur das, was `docs/09-tracking-plan.md` und die
   bestehenden Erfolgsmeldungen aus `lib/forms/messages.ts` hergeben – **erfinde keinen
   neuen Seitentext**; reicht es nicht für eine Seite, baue sie schlicht aus Überschrift,
   Bestätigungssatz und einem Weg zurück zur Startseite und vermerke es in der PR.
6. **Vercel Web Analytics** (5.5): `@vercel/analytics` einbinden, immer aktiv, cookielos.
7. **Prüfung** (5.6, Playwright): vor jeder Interaktion **kein** Request an `google*`,
   `googletagmanager*`, `facebook*`, `doubleclick*`, `fonts.g*`; nach „Nur notwendige"
   ebenfalls keiner; nach „Alle akzeptieren" **mit** gesetzter Test-ID einer; der
   Footer-Button öffnet die Einstellungen erneut; Tastaturbedienung und Fokusfalle; kein
   Layoutsprung. Dazu ein a11y-Lauf über den geöffneten Dialog.
8. **Doku**: `docs/05-consent-dsgvo.md` auf den gebauten Stand, Eintrag in
   `docs/entscheidungen.md`, Masterplan 5.3–5.6 abhaken, `.env.example` prüfen.

## Freigegebene Texte (Stefan, 09.09.2026)

Einleitung im Dialog – wortgleich:

> **Cookies und Einwilligung**
> Notwendige Cookies sorgen dafür, dass die Website funktioniert und Ihre Auswahl
> gespeichert bleibt. Für Statistik und Marketing fragen wir Sie vorher. Sie können Ihre
> Auswahl jederzeit im Fußbereich unter „Cookie-Einstellungen" ändern.

Buttons – wortgleich: „Alle akzeptieren" · „Nur notwendige" · „Einstellungen".

Kategorien – wortgleich aus `docs/legal/datenschutz.md`, Abschnitt 6:

- **Notwendig** – Auslieferung der Seite, Speicherung Ihrer Cookie-Auswahl, Schutz der
  Formulare vor Missbrauch.
- **Statistik und Marketing** (nur mit Einwilligung) – derzeit ist kein Dienst dieser
  Kategorie im Einsatz. Die Kategorie bleibt vorbereitet; sobald wir einen solchen Dienst
  einsetzen, wird er hier benannt und erst nach Ihrer Einwilligung geladen.

Im Dialog stehen Links auf `/datenschutz` und `/impressum` – beide sind live.

## Skills und Subagents

- Skills: `golfnext-design-system`, `golfnext-qa`
- Subagents nach dem Bauen: `design-system-guard`, `text-fidelity` (Dialogtexte gegen
  dieses Briefing und `docs/legal/datenschutz.md`), `qa-runner`, danach `pr-reviewer`

## PR und Merge

Branch `feat/consent`, PR nach `.github/pull_request_template.md`, CI grün, `pr-reviewer`.
Merge macht der Orga-Chat, sobald die CI grün ist.

## Akzeptanzkriterien

- [ ] Vor jeder Interaktion geht **kein** Request an Google, Meta, Doubleclick, GTM oder
      eine Schriftquelle – nachgewiesen im Test.
- [ ] Nach „Nur notwendige" ebenfalls keiner; nach „Alle akzeptieren" und gesetzter ID
      wird GTM geladen.
- [ ] Die drei Schaltflächen sind gleichwertig gestaltet; „Notwendig" ist nicht abwählbar.
- [ ] Der Footer-Button öffnet die Einstellungen erneut.
- [ ] Der Dialog ist mit der Tastatur bedienbar, hält den Fokus, schließt mit `Esc`,
      respektiert Reduced Motion und verschiebt kein Layout.
- [ ] Ohne JavaScript bleibt die Seite lesbar; es wird nichts geladen.
- [ ] Vercel Web Analytics läuft; `/danke` ist `noindex`.
- [ ] Die Dialogtexte sind wortgleich mit diesem Briefing und `docs/legal/datenschutz.md`.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`,
      `pnpm test:a11y` grün.
- [ ] Doku und Masterplan-Haken nachgezogen.

## Was du NICHT tust

- Eine GTM- oder Pixel-ID eintragen oder erfinden.
- Die Datenschutzerklärung ändern (sie beschreibt den Zustand korrekt).
- Ein bezahltes CMP, IAB TCF oder den „Advanced Consent Mode" einbauen.
- Externe Schriften, Google Maps, Social-Plugins oder ein YouTube-Embed ergänzen.
- Weitere Ereignisse verdrahten als die zwei genannten.
- Einen zweiten Toast oder einen globalen Fortschrittsbalken einführen.

## Offene Fragen an Stefan/Fred

- Keine. Sobald eine GTM- oder Pixel-ID eingetragen wird, muss der Dienst in
  `docs/legal/datenschutz.md` benannt werden – das ist dann ein eigener kleiner Schritt.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0033-consent-und-tracking.md. Setze es
vollständig um. Es deckt die Masterplan-Schritte 5.3, 5.4, 5.5 und 5.6 ab.

Gebaut wird die Mechanik für Einwilligung und Tracking: Consent-Dialog mit
vanilla-cookieconsent v3, Google Consent Mode v2 im Standard „alles verweigert",
Nachladen von GTM und Meta-Pixel erst nach Einwilligung, Vercel Web Analytics (cookielos,
ohne Einwilligung erlaubt), /danke mit noindex und der Playwright-Nachweis.

Besonders wichtig:
- Vor der Einwilligung geht kein Byte an Dritte. Auch nicht „zum Vorbereiten".
- Keine Dark Patterns: „Alle akzeptieren", „Nur notwendige" und „Einstellungen" sind
  gleichwertig gestaltet. „Notwendig" ist nicht abwählbar, sonst nichts vorausgewählt.
- NEXT_PUBLIC_GTM_ID und NEXT_PUBLIC_META_PIXEL_ID sind nicht gesetzt: ohne ID lädt nichts,
  unabhängig von der Einwilligung. Trag keine ID ein und erfinde keine.
- Die Dialogtexte stehen im Briefing unter „Freigegebene Texte" und in
  docs/legal/datenschutz.md Abschnitt 6 – wortgleich übernehmen, nichts ergänzen.
- Die Datenschutzerklärung wird nicht geändert.
- Der Dialog ist mit der Tastatur bedienbar, hält den Fokus, schließt mit Esc, respektiert
  prefers-reduced-motion und verschiebt kein Layout. Ohne JavaScript bleibt die Seite
  lesbar und es wird nichts geladen.
- Verdrahte nur die Ereignisse cta_erstgespraech_click und contact_submitted; die übrigen
  aus docs/09-tracking-plan.md bleiben vorbereitet.

Baue über die Skills golfnext-design-system und golfnext-qa, rufe danach design-system-guard,
text-fidelity und qa-runner auf und behebe deren FAILs.

Tempo: während der Iteration nur die betroffene Spec laufen lassen
(pnpm exec playwright test e2e/<name>), die Vollsuite genau einmal am Ende.
Nicht auf die CI warten – Stand melden, sobald lokal alles grün ist.

Branch feat/consent, PR nach .github/pull_request_template.md, CI grün, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
