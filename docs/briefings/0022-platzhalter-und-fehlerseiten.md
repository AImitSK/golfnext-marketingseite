# 0022 · Platzhalter-Routen und Fehlerseiten

Masterplan-Schritte: **2.8 + 2.9** · Branch: `feat/platzhalter-fehlerseiten` · Phase: 2

Der Abschluss von Phase 2. Zwei kleine Schritte in einem Branch, weil sie denselben Baustein teilen:
eine ruhige, ehrliche Seite ohne Inhalt, die den Weg zurück zeigt.

**Was hier NICHT passiert:** keine Praxis-Inhalte, kein Kontaktformular, kein Sanity. Diese Seiten sind
bewusst leer – sie sollen nur verhindern, dass jemand vor einem 404 oder einem toten Link steht.

**Vorbedingung:** `main` ist aktuell (letzter Stand: `2dc14f4`, Startseite 3.1b). `git fetch`, `main` nachziehen,
dann `feat/platzhalter-fehlerseiten` abzweigen. **Dieses Briefing und die Masterplan-Korrekturen (Haken 2.2/2.3
nachgezogen, 2.4 als blockiert markiert) liegen noch uncommittet im Arbeitsverzeichnis** – mit dem Branch
aufnehmen, wie bei 0018/0019.

## Kontext und Lesereihenfolge

1. `CLAUDE.md` – besonders: nichts erfinden, Sie-Form, Grün-Regel, genau eine `<h1>`, Bewegung.
2. `docs/08-zustaende-und-feedback.md` – **§4 (Meldungstexte)** und die Tabelle mit `404`/`error.tsx`;
   dort steht: „`error.tsx` und `not-found.tsx` rendern Header und Footer."
3. `lib/ui/messages.ts` – **die Texte für 404 und Fehlerseite existieren dort bereits** (`uiMessages.notFound`,
   `uiMessages.error`, aus Briefing 0009). Wortgleich verwenden, nicht neu formulieren.
4. `config/site-structure.ts` – die eine Wahrheit für Routen und Status; `lib/navigation.ts`, `lib/links.ts`.
5. `docs/10-launch-umfang.md` – **§ Navigation v1** (begründet die Navigations-Entscheidung unten).
6. `docs/07-seo.md` – „Platzhalter-Routen (Praxis, Team, Kontakt, Module) mit `robots: { index: false }`".
7. Skills `golfnext-design-system`, `golfnext-qa`. Bestehende Seiten als Referenz für Schale und Tokens.

## Harte Vorgaben

**Nichts erfinden – auch nicht „nur als Platzhalter".**
Die Praxis-Mocks `3.9a`/`3.9b` liegen im Repo, ihre neun Artikel (Titel, Autoren, Daten, der komplette
Artikeltext) sind jedoch **Beispieltexte ohne Fred-Freigabe**. Sie werden hier **nicht** gebaut, nicht als
Vorschau, nicht als „Bild folgt"-Karten. `/praxis` bekommt dieselbe leere Platzhalterseite wie `/team`.
Der Praxis-Blog entsteht in Phase 3 aus Sanity.

**Texte sind System-Copy, keine Fred-Texte.**
Alle sichtbaren Sätze dieser Seiten kommen aus `lib/ui/messages.ts` – wie schon `notFound` und `error`.
**Nicht** nach `content/<seite>.ts`: dort liegen ausschließlich freigegebene Website-Inhalte. Der Katalog wird
um `uiMessages.platzhalter` erweitert; die Tonalität aus `docs/08` §4 gilt (Sie-Form, ein Satz, nennt den
nächsten Schritt, keine Technik, keine Ausrufezeichen, kein „Oops"). **Diese Texte sind vorgegeben:**

```ts
platzhalter: {
  eyebrow: "In Arbeit",
  body: "Dieser Bereich entsteht gerade. Sobald die Inhalte stehen, finden Sie sie hier.",
  actionHome: "Zur Startseite",
  /** Nur auf /kontakt: die Kontaktdaten stehen im Fußbereich jeder Seite. */
  kontaktHinweis: "Bis dahin erreichen Sie uns direkt – Telefon und E-Mail stehen unten im Fußbereich.",
},
```

Die `<h1>` je Route ist das `label` aus `config/site-structure.ts` (Praxis, Team, Kontakt, bzw. der Modulname).
**Keine weiteren Sätze dazudichten**, keine Aussagen über Zeitpunkte („in Kürze", „ab Herbst"), keine
Marketing-Zeile, kein Verkaufsblock.

**Kein Modulstatus.** Auf `/module/[slug]` erscheint **kein** „Im Einsatz/Pilot/In Entwicklung"-Label und
nicht `uiMessages.moduleInDevelopment` – die Anzeige des Modulstatus ist seit Briefing 0014 site-weit
entfallen. Das Datenfeld `MODULE[].status` bleibt ungenutzt.

**Navigation: nicht-live Punkte werden nicht mehr gerendert.**
Heute liefert `lib/navigation.ts` für jede nicht-`live` Route `href = "#"`. Das erzeugt im Header einen
fokussierbaren Link, der nichts tut – für Tastatur und Screenreader ein toter Bedienpunkt. `docs/10`
legt für **Navigation v1** ohnehin fest: „Plattform · Wachstum & Vertrieb · Clubprozesse · Pakete ·
Über GolfNext · CTA. **Praxis entfällt**, bis das Briefing da ist." Also:
- `getNavModel()` gibt nur `live`-Hauptpunkte und nur `live`-Kinder zurück; ein Hauptpunkt ohne `live`-Kinder
  hat kein Dropdown. `PLACEHOLDER_HREF` entfällt.
- Damit verschwinden „Praxis" und die beiden Modul-Dropdowns aus Header und Footer – **wie in `docs/10`
  beschrieben**. Sie kommen automatisch zurück, sobald die Route auf `live` geht.
- Die Platzhalterseiten bleiben **per direkter URL erreichbar** (alte Links, Lesezeichen, der CTA-Fallback unten).
- `lib/navigation.test.ts` und `tests/e2e/header.spec.ts` entsprechend nachziehen.

**Der CTA-Fallback muss ins Leere laufen können, ohne zu 404en.**
`lib/links.ts` setzt `FALLBACK = "/kontakt"`. Solange `NEXT_PUBLIC_BOOKING_URL` leer ist, zeigen **alle**
„Online-Erstgespräch vereinbaren"-Buttons auf `/kontakt` – eine Route, die es bisher nicht gibt. Mit dieser
Umsetzung existiert sie. **Prüfen und im PR vermerken**, ob `NEXT_PUBLIC_BOOKING_URL` in Vercel (Production
und Preview) gesetzt ist; wenn nicht, ist das ein Befund für Stefan (Masterplan 4.4), nicht selbst befüllen.

**Design.** Kein neuer Mock, keine neuen Farben, kein neuer Radius. Die Seiten nutzen die vorhandene Schale
(`Wrap`, `Section`/`PlattformSection`, `Eyebrow`, `Lead`, `Button`, `TextLink`) und die Layout-Tokens der
Neufassung. Ruhig und kurz: eine Bildschirmhöhe reicht, kein `FooterClose`-Verkaufsblock über einer leeren
Seite. Header und Footer wie überall. Grün-Regel beachten (Signalgrün nie als Text auf hellem Grund).

**Bewegung.** Höchstens ein einzelnes, dezentes Aufblenden über die vorhandene Motion-Infra
(`Rise`). Endzustand im Server-HTML, `prefers-reduced-motion` → sofort sichtbar, ohne JS lesbar, kein CLS.
Auf diesen Seiten ist weniger richtig als mehr.

## Aufgaben

### A · Geteilter Baustein

1. `lib/ui/messages.ts` um `platzhalter` erweitern (Wortlaut oben, unverändert übernehmen).
2. `components/site/PlatzhalterSeite.tsx` (+ `.module.css`): ein Baustein für alle vier Fälle.
   Props etwa `{ titel: string; zurueck?: { href: string; label: string }; hinweis?: string }`.
   Enthält: Eyebrow, genau eine `<h1>`, Body-Satz, Button „Zur Startseite", optional ein `TextLink` zurück
   zum thematisch passenden Bereich, optional der Kontakt-Hinweis. **Keine freien Texte in der Komponente.**

### B · 2.8 Platzhalter-Routen

3. `app/(site)/praxis/page.tsx`, `app/(site)/team/page.tsx`, `app/(site)/kontakt/page.tsx`.
   - `/praxis` → Rücklink „Über GolfNext" (dort steht der „Wissen"-Abschnitt); `/team` → „Über GolfNext";
     `/kontakt` → kein Rücklink, dafür `kontaktHinweis`.
   - **`/kontakt` ist ausdrücklich ein Zwischenstand.** Die Seite kommt (Entscheidung Stefan, 07.09.2026)
     und ist in `docs/10-launch-umfang.md` §40 bereits festgelegt: „das Formular liegt auf `/kontakt` als
     schlichte Seite mit dem UI-Kit-Formular" – sie braucht **kein Fred-Briefing und keinen Mock**, sondern
     entsteht in **Masterplan 4.3** mit dem Kontaktformular. Bis dahin trägt sie die Platzhalterseite, damit
     der CTA-Fallback aus `lib/links.ts` nicht ins 404 läuft. In der Datei einen `// TODO 4.3`-Kommentar mit
     genau diesem Verweis hinterlassen. **Jetzt kein Formular bauen**, auch kein Markup davon.
4. `app/(site)/module/[slug]/page.tsx` mit `generateStaticParams()` aus `MODULE`.
   - `<h1>` = Modulname. Rücklink je `gruppe`: `wachstum` → `/plattform`, `clubprozesse` → `/clubprozesse`.
   - Unbekannter Slug → `notFound()`.
5. Je Route `export const metadata` mit `robots: { index: false, follow: false }` – die Quelle ist das Feld
   `noindex` in `config/site-structure.ts`, nicht hart kodiert. Titel aus `label`, solange dort `title: null`
   steht; **keine Beschreibung erfinden**.
6. `config/site-structure.ts`: die vier Routen behalten ihren Status (`geplant` für `/praxis`,
   `wartet-auf-briefing` für Team/Kontakt/Module) und bekommen `noindex: true`, wo es fehlt.
   **Nicht auf `live` setzen** – sonst ziehen `isLinkable`/`internalHref` die Teaser-Links auf der Startseite
   und auf `/ueber-golfnext` auf leere Seiten. Der Kommentarblock oben in der Datei wird ergänzt: `geplant`
   und `wartet-auf-briefing` rendern jetzt beide eine Platzhalterseite, bleiben aber unverlinkt.

### C · 2.9 Fehlerseiten

7. `app/not-found.tsx` – Texte aus `uiMessages.notFound`, zwei Aktionen: „Zur Startseite" und
   „Erstgespräch vereinbaren" (über `bookingUrl()`/`resolveCta`, nie hart kodiert).
   **Achtung:** Diese Datei rendert unter dem Root-Layout, **nicht** unter `app/(site)/layout.tsx` – die
   Shell fehlt dort. Header und Footer daher in der Seite selbst rendern (so verlangt es `docs/08`).
   Ein zusätzliches `app/(site)/not-found.tsx` ist nur nötig, wenn `notFound()` aus einer Segment-Route
   (Modul-Slug) sonst ohne Shell landet – dann dort dieselbe Darstellung.
8. `app/(site)/error.tsx` (Client Component) – Texte aus `uiMessages.error`, Aktion „Noch einmal versuchen"
   ruft `reset()`. Header und Footer wie in `docs/08` gefordert. Fehlerobjekt **nicht** anzeigen und
   **nicht** loggen (keine personenbezogenen Daten).
9. `app/global-error.tsx` minimal (eigenes `<html>`/`<body>`, gleiche Texte, kein Import aus der Shell).

### D · Nachziehen

10. `lib/navigation.ts` nach der Vorgabe oben ändern; `lib/navigation.test.ts` und
    `tests/e2e/header.spec.ts` anpassen (Praxis und Modul-Dropdowns erscheinen nicht mehr).
11. Neue E2E: `tests/e2e/platzhalter.spec.ts` und `tests/e2e/fehlerseiten.spec.ts` (Punkte unten),
    dazu `tests/a11y/` für eine Platzhalterseite und die 404.
12. `docs/03-seiten-und-routen.md`: die vier Platzhalter-Routen und die 404 eintragen.
    `docs/entscheidungen.md`: Navigations-Entscheidung, Praxis bleibt trotz Mock Platzhalter, Fundort des
    `/kontakt`-Fallbacks. Masterplan 2.8 und 2.9 abhaken.

## Skills und Subagents

- **Skills:** `golfnext-design-system` (Tokens, Grün-Regel, Schale), `golfnext-qa` (Prüfroutine).
  `golfnext-page-from-mock` wird **nicht** gebraucht – es gibt keinen Mock für diese Seiten.
- **Subagents nach dem Bauen:**
  - `text-fidelity` – mit dem ausdrücklichen Auftrag: **keine erfundenen Inhalte**; alle sichtbaren Sätze
    stammen aus `lib/ui/messages.ts`; keine Praxis-Artikel aus 3.9a/3.9b; kein Modulstatus.
  - `design-system-guard` – Tokens, Grün-Regel, Icon-Größen, Bewegung, Zeichensetzung.
  - `seo-auditor` – **hier zentral:** `noindex` auf allen vier Platzhaltern, keine internen Links auf
    nicht-`live` Routen, genau eine `<h1>` je Seite, keine erfundenen Meta-Beschreibungen.
  - `qa-runner` – Overflow @390/768/1024/1180/1440, ohne JS, Reduced-Motion, Konsole, axe.
  - `pr-reviewer` – vor dem Merge.

## PR und Merge

Branch `feat/platzhalter-fehlerseiten`. Commits deutsch im Imperativ, klein geschnitten
(z. B. „Baue geteilten Platzhalter-Baustein", „Lege Platzhalter-Routen an", „Baue 404 und Fehlerseite",
„Ziehe Navigation auf live-Routen zurück"). PR nach `.github/pull_request_template.md`.
Gates: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:e2e`, `pnpm test:a11y` – alle grün.
CI grün, Preview ansehen (Header ohne Praxis/Dropdowns, die vier Platzhalter, eine erfundene URL für 404).
**Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien

- [ ] `/praxis`, `/team`, `/kontakt` und alle zwölf `/module/<slug>` rendern die Platzhalterseite mit
      Header und Footer, genau einer `<h1>` und `robots: noindex, nofollow`.
- [ ] Ein unbekannter Modul-Slug führt zu 404, nicht zu einer leeren Platzhalterseite.
- [ ] Alle sichtbaren Sätze dieser Seiten stammen aus `lib/ui/messages.ts`; **kein** Text aus 3.9a/3.9b,
      kein Modulstatus, keine Zeitangabe, keine erfundene Meta-Beschreibung.
- [ ] `/kontakt` existiert – der Fallback aus `lib/links.ts` läuft nicht mehr ins 404. Ob
      `NEXT_PUBLIC_BOOKING_URL` in Vercel gesetzt ist, steht als Befund im PR.
- [ ] Eine nicht existierende URL zeigt die 404-Seite mit `uiMessages.notFound` **wortgleich**, Header, Footer
      und beiden Aktionen; der Statuscode ist 404.
- [ ] `app/(site)/error.tsx` zeigt `uiMessages.error` wortgleich, „Noch einmal versuchen" ruft `reset()`;
      kein Fehlertext und keine Personendaten sichtbar oder im Log.
- [ ] Header und Footer enthalten **keine** `href="#"`-Punkte mehr; Praxis und die Modul-Dropdowns sind
      nicht gerendert. `lib/navigation.test.ts` und `tests/e2e/header.spec.ts` prüfen das.
- [ ] Die Teaser-Links auf `/` und `/ueber-golfnext` („Praxis", „Alle Artikel") zeigen unverändert auf `#` –
      sie führen **nicht** auf die neuen Platzhalterseiten.
- [ ] Kein horizontaler Overflow @390/768/1024/1180/1440; ohne JS lesbar; Reduced-Motion zeigt sofort den
      Endzustand; keine Konsolenfehler; axe ohne Verstoß.
- [ ] Gates und CI grün; alle fünf Subagents ohne FAIL; `docs/03`, `docs/entscheidungen.md` und die
      Masterplan-Haken 2.8/2.9 nachgezogen.

## Was du NICHT tust

- **Keine Praxis-Inhalte** – weder aus `3.9a`/`3.9b` noch als Vorschau, Artikelkarten oder Themenfilter.
- **Kein Sanity** (Phase 3), **kein Kontaktformular und kein Newsletter-Feld** (Phase 4) – auch nicht
  „schon mal das Markup".
- **`/plattform/so-arbeitet-golfnext` nicht bauen** – Masterplan 2.4 ist blockiert, bis der Redesign `3.3b`
  vorliegt (Entscheidung Stefan, 07.09.2026).
- **`/pakete` nicht anfassen** – bleibt in der bestehenden Optik (Entscheidung Stefan, 07.09.2026).
- Keine der bestehenden Seiten umbauen, keine Texte in `content/*` ändern, keine neuen Farben, Radien oder
  Schriftgrößen, keine Routen auf `live` setzen.
- Keine Sitemap, keine JSON-LD, keine OG-Bilder – das ist Phase 6.

## Offene Fragen an Stefan

1. **Navigation:** Praxis und die beiden Modul-Dropdowns verschwinden mit dieser Umsetzung aus Header und
   Footer (statt als `#` dazustehen). Das entspricht „Navigation v1" in `docs/10-launch-umfang.md` – bitte
   kurz bestätigen, weil es sichtbar ist.
2. **`NEXT_PUBLIC_BOOKING_URL`:** Ist der Buchungsweg in Vercel hinterlegt? Wenn nicht, landen alle
   Erstgespräch-CTAs auf der leeren `/kontakt`-Platzhalterseite (Masterplan 4.4 wartet auf Freds Angabe).
3. **Für Phase 3, noch nicht für diesen Schritt:** Heißt der Blog `/praxis` (Navigation, `site-structure.ts`,
   Mocks) oder `/ratgeber` (Masterplan Phase 3)? Die Entscheidung wird vor dem Sanity-Schema gebraucht.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0022-platzhalter-und-fehlerseiten.md. Setze es vollständig um.

Es geht um die Masterplan-Schritte 2.8 (Platzhalter-Routen /praxis, /team, /kontakt, /module/[slug])
und 2.9 (404 und Fehlerseite) in einem Branch. Es gibt für diese Seiten KEINEN Mock – gebaut wird aus
der vorhandenen Schale und den Tokens; die sichtbaren Texte stehen im Briefing und kommen aus
lib/ui/messages.ts (notFound und error existieren dort schon wortgleich, platzhalter kommt neu dazu).

Besonders wichtig:
- Nichts erfinden. Die Praxis-Mocks 3.9a/3.9b liegen im Repo, ihre Artikel sind aber unfreigegebene
  Beispieltexte – /praxis bekommt dieselbe leere Platzhalterseite wie /team. Kein Modulstatus.
- /kontakt ist nur ein Zwischenstand: die Seite ist beschlossen und entsteht in Masterplan 4.3 als
  schlichte Seite mit dem UI-Kit-Formular (docs/10 §40). Jetzt KEIN Formular bauen, nur den Platzhalter
  plus einen // TODO 4.3-Kommentar.
- Die vier Routen bleiben noindex und NICHT live, damit die Teaser-Links auf / und /ueber-golfnext
  weiterhin auf "#" zeigen und nicht auf leere Seiten.
- lib/navigation.ts so ändern, dass nicht-live Punkte gar nicht mehr gerendert werden statt href="#"
  (Begründung und Testanpassungen stehen im Briefing).
- app/not-found.tsx läuft unter dem Root-Layout ohne Shell – Header und Footer dort selbst rendern.
- Prüfen und im PR vermerken, ob NEXT_PUBLIC_BOOKING_URL in Vercel gesetzt ist; der Fallback in
  lib/links.ts zeigt sonst auf /kontakt.

Baue über die Skills golfnext-design-system und golfnext-qa (golfnext-page-from-mock wird nicht gebraucht).
Rufe danach die Subagents text-fidelity, design-system-guard, seo-auditor und qa-runner auf und behebe
deren FAILs, dann pr-reviewer.

Branch feat/platzhalter-fehlerseiten, Gates (typecheck, lint, test, build, test:e2e, test:a11y) grün,
PR nach .github/pull_request_template.md, CI grün, Preview ansehen. Merge macht der Orga-Chat.

Das Briefing und die Doku-Änderungen (Masterplan-Haken 2.2/2.3, 2.4 blockiert, 4.3 Kontakt, docs/10,
Design-System-README) liegen uncommittet im Arbeitsverzeichnis – mit dem Branch aufnehmen.

Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
