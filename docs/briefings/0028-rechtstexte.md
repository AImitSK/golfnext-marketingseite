# 0028 · Rechtstexte als Seiten: /impressum und /datenschutz

Masterplan-Schritte: **5.1, 5.2** · Branch: `feat/rechtstexte` · Phase: 5

Die beiden Rechtsseiten bauen und live schalten. Damit funktionieren die Links **Impressum** und
**Datenschutz** in der Fußleiste, die heute noch ins Leere zeigen.

**Vorbedingung erfüllt:** Briefing 0026 (Sanity-Fundament) ist gemerged (PR #37). Dieses Briefing und die
fertigen Texte in `docs/legal/` liegen seit dem 08.09.2026 **im Repo auf `main`** – nichts mitzunehmen,
nur `git fetch`, `main` nachziehen und `feat/rechtstexte` abzweigen.

## Kontext und Lesereihenfolge

1. `CLAUDE.md` – **„Rechtstexte aus `docs/legal/` übernehmen"**. Der Wortlaut wird **nicht** verändert,
   nicht gekürzt, nicht umformuliert.
2. **`docs/legal/impressum.md` und `docs/legal/datenschutz.md`** – die Quelle. Beide sind seit
   07.09.2026 vollständig, **es gibt keine offenen `[[ … ]]`-Stellen mehr**.
3. `docs/08-zustaende-und-feedback.md` (Typografie langer Texte), `docs/07-seo.md`.
4. `components/site/Footer.tsx` – die Links liegen bereits als `BarEntry` an und schalten sich über
   `isLinkable` von selbst frei, sobald die Routen `live` sind. **Dort ist nichts zu ändern.**
5. Skills `golfnext-design-system`, `golfnext-qa`.

## Harte Vorgaben

**Der Wortlaut ist verbindlich.** Beide Dateien werden inhaltlich unverändert übernommen. Die mit
`>` markierten **internen Vermerke am Anfang und Ende werden NICHT veröffentlicht** – sie sind
Arbeitsnotizen. Alles zwischen den Vermerken kommt auf die Seite.

**Es gibt keinen Mock für diese Seiten.** Gebaut wird aus der vorhandenen Schale: `Wrap`, `Section`,
`Eyebrow`, die Typografie für lange Texte (17–18 px, **max. 70 Zeichen Zeilenlänge**), Abschnitte als
`<h2>`, genau **eine `<h1>`** je Seite („Impressum" bzw. „Datenschutzerklärung"). Ruhig und lesbar,
kein Hero-Bild, keine Animation außer einem dezenten Reveal.

**Texte als Daten.** Der Inhalt kommt nicht als freies JSX in die Komponente. Zwei Wege sind erlaubt –
im PR begründen, welcher gewählt wurde:
- die Markdown-Dateien zur Bauzeit einlesen und rendern (dann bleibt `docs/legal/` die einzige
  Wahrheit – **bevorzugt**), oder
- den Inhalt nach `content/impressum.ts` und `content/datenschutz.ts` überführen (dann in beiden
  Dateien einen Verweis auf die Quelle setzen).

**Kein `noindex`.** Impressum und Datenschutzerklärung **müssen** auffindbar sein – beide Routen
gehen `live`, ohne `noindex`, und in die Sitemap. Das Feld `noindex: false` steht bei `/impressum`
bereits so in `config/site-structure.ts`.

**Die Weiterleitung bleibt:** `/impressum/` → `/impressum` (`redirectsFrom` ist gesetzt) – die alte
Website hatte den Trailing Slash.

**Auf die Fußleiste achten:** „Cookie-Einstellungen" steht dort ebenfalls und öffnet später den
Consent-Dialog (Masterplan 5.3). **In diesem Schritt nicht anfassen.**

## Aufgaben

1. `app/(site)/impressum/page.tsx` und `app/(site)/datenschutz/page.tsx` mit dem gewählten
   Renderweg. Genau eine `<h1>`, Abschnitte als `<h2>`, Metadata und Canonical.
2. Ein geteilter Baustein für lange Fließtexte (z. B. `components/pages/recht/Rechtstext.module.css`):
   Zeilenlänge, Absatzabstände, Listen, Links im Fließtext. Wird später auch vom Ratgeber gebraucht –
   **aber nicht auf Vorrat verallgemeinern**, nur was diese zwei Seiten brauchen.
3. `config/site-structure.ts`: `/impressum` und `/datenschutz` → `status: "live"`. Titel stehen dort
   bereits; **keine Beschreibung erfinden**, wenn keine da ist.
4. Prüfen, dass die Fußleiste beide Links jetzt echt verlinkt (nicht `#`) – ohne Änderung an `Footer.tsx`.
5. E2E `tests/e2e/rechtstexte.spec.ts`: beide Routen laden, genau eine `<h1>`, kein Overflow
   @390–1440, Fußleisten-Links führen hin, `/impressum/` leitet auf `/impressum` um, **kein
   `noindex`**, keine internen Vermerke im ausgelieferten HTML. Dazu `tests/a11y/`.
6. `docs/03-seiten-und-routen.md` und `docs/entscheidungen.md` nachziehen, Masterplan 5.1 und 5.2
   abhaken.

## Skills und Subagents

- **Skills:** `golfnext-design-system`, `golfnext-qa`.
- **Subagents:** **`text-fidelity`** (Wortlaut identisch mit `docs/legal/`; **interne `>`-Vermerke
  nicht veröffentlicht**; nichts gekürzt oder umformuliert), `design-system-guard`,
  `seo-auditor` (**kein `noindex`**, in der Sitemap, eine H1, Canonical, Weiterleitung),
  `qa-runner` (Overflow, Zeilenlänge, ohne JS lesbar, axe), dann `pr-reviewer`.

## PR und Merge

Branch `feat/rechtstexte`. Gates: `pnpm typecheck`, `lint`, `test`, `build`, `test:e2e`, `test:a11y`.
CI grün, Preview beide Seiten lesen. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien

- [ ] `/impressum` und `/datenschutz` sind `live`, ohne `noindex`, mit genau einer `<h1>` und Canonical.
- [ ] Der Text ist **wortgleich** mit `docs/legal/`; die internen `>`-Vermerke erscheinen **nicht**
      im ausgelieferten HTML.
- [ ] Die Links **Impressum** und **Datenschutz** in der Fußleiste führen auf die Seiten – auf jeder
      Seite der Website, ohne Änderung an `Footer.tsx`.
- [ ] `/impressum/` leitet auf `/impressum` um.
- [ ] Zeilenlänge höchstens 70 Zeichen, kein Overflow @390/768/1024/1180/1440, ohne JS lesbar,
      axe ohne Verstoß.
- [ ] Gates und CI grün; alle vier Subagents ohne FAIL; Doku und Masterplan-Haken nachgezogen.

## Was du NICHT tust

- **Den Wortlaut ändern, kürzen oder „glätten"** – auch nicht, wenn eine Formulierung sperrig wirkt.
- Die internen Vermerke veröffentlichen.
- Den Consent-Dialog bauen oder „Cookie-Einstellungen" anfassen (Masterplan 5.3).
- Die Seiten auf `noindex` setzen.
- Einen Hero, Bilder oder auffällige Bewegung ergänzen.

## Offene Fragen an Stefan

- Keine.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0028-rechtstexte.md. Setze es vollständig um.

Gebaut werden die beiden Rechtsseiten /impressum und /datenschutz (Masterplan 5.1 und 5.2). Danach
funktionieren die Links "Impressum" und "Datenschutz" in der Fußleiste, die heute ins Leere zeigen.

Quelle ist docs/legal/impressum.md und docs/legal/datenschutz.md. Beide sind seit 07.09.2026
vollständig – es gibt KEINE offenen [[ … ]]-Stellen mehr.

Besonders wichtig:
- Der Wortlaut ist verbindlich und wird nicht geändert, gekürzt oder umformuliert.
- Die mit ">" markierten internen Vermerke am Anfang und Ende der Dateien werden NICHT
  veröffentlicht. Alles dazwischen kommt auf die Seite.
- Es gibt keinen Mock: gebaut wird aus der vorhandenen Schale (Wrap, Section, Eyebrow), Typografie
  für lange Texte, max. 70 Zeichen Zeilenlänge, genau eine h1, Abschnitte als h2. Ruhig, kein Hero,
  keine auffällige Bewegung.
- Texte als Daten: entweder die Markdown-Dateien zur Bauzeit einlesen (bevorzugt, dann bleibt
  docs/legal die einzige Wahrheit) oder nach content/ überführen – im PR begründen.
- KEIN noindex. Beide Seiten müssen auffindbar sein und in die Sitemap.
- /impressum/ leitet auf /impressum um (redirectsFrom ist gesetzt).
- Footer.tsx wird NICHT geändert: die Links hängen an isLinkable und schalten sich frei, sobald die
  Routen live sind. "Cookie-Einstellungen" nicht anfassen (Masterplan 5.3).

Baue über die Skills golfnext-design-system und golfnext-qa. Rufe danach die Subagents text-fidelity
(Wortlaut identisch, interne Vermerke nicht veröffentlicht), design-system-guard, seo-auditor
(kein noindex, Sitemap, eine H1, Weiterleitung) und qa-runner auf, behebe deren FAILs, dann
pr-reviewer.

Branch feat/rechtstexte, Gates (typecheck, lint, test, build, test:e2e, test:a11y) grün, PR nach
.github/pull_request_template.md, CI grün, Preview beide Seiten lesen. Merge macht der Orga-Chat.

Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
