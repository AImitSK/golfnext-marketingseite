# 0023 · Navigations- und Routen-Umbau (Informationsarchitektur v2)

Masterplan-Schritt: **2.10** (neu) · Branch: `feat/navigation-v2` · Phase: 2

Fred und Stefan haben die Seitenstruktur am **07.09.2026** neu geschnitten. Dieser Schritt zieht sie nach:
in `config/site-structure.ts` (der einen Wahrheit), in Navigation, Footer, Tests und Doku.

**Es entstehen keine neuen Seiten.** Es werden Routen entfernt, umgehängt und Verweise bereinigt.

**Vorbedingung:** Branch `feat/platzhalter-fehlerseiten` (Briefing 0022) ist **gemerged**. Dieser Schritt baut
direkt darauf auf und löscht einen Teil davon wieder – das ist beabsichtigt, siehe unten. `git fetch`,
`main` nachziehen, dann `feat/navigation-v2` abzweigen.

## Die neue Struktur (Entscheidung Fred/Stefan, 07.09.2026)

```
Plattform            ▾  So arbeitet GolfNext
Wachstum & Vertrieb
Clubprozesse
Pakete
Über GolfNext        ▾  Praxis
                        Kontakt
                                          [CTA] Online-Erstgespräch vereinbaren
```

Was sich ändert:
- **Praxis fliegt aus der Hauptnavigation** und wird Unterpunkt von Über GolfNext.
  **Die URL bleibt `/praxis`** (Entscheidung Stefan) – nur die Menüposition wandert, keine Weiterleitung nötig.
- **Über GolfNext bekommt ein Dropdown** (wie heute Plattform): Praxis und Kontakt.
- **Die sechs Modul-Unterseiten unter Plattform entfallen** (Reach, Search, Landingpages, Marketing-CRM,
  Lifecycle, Content). Plattform behält sein Dropdown mit dem einen verbleibenden Punkt
  **„So arbeitet GolfNext"**.
- **Alle Modul-Unterseiten unter Clubprozesse entfallen** (Concierge, Platzstatus, Gastfee, Firmen-Events,
  Turnier-News, Captains App). Clubprozesse hat damit **kein Dropdown mehr**.
- **`/team` entfällt vollständig** (Entscheidung Stefan) – der Inhalt steckt bereits im Abschnitt
  „Die Menschen dahinter" auf `/ueber-golfnext`.
- **`/ratgeber` entfällt** – der Blog heißt `/praxis` (Entscheidung Stefan, 07.09.2026).

## Kontext und Lesereihenfolge

1. `CLAUDE.md`.
2. Dieses Briefing und `docs/briefings/0022-platzhalter-und-fehlerseiten.md` (der Vorgängerschritt, dessen
   Modul- und Team-Platzhalter hier wieder entfernt werden).
3. `config/site-structure.ts` – die eine Wahrheit; `lib/navigation.ts`; `lib/links.ts`.
4. `components/site/Header.tsx`, `Nav.tsx`, `MobileNav.tsx`, `Footer.tsx`.
5. `docs/10-launch-umfang.md` (§ Navigation v1 – wird durch diesen Schritt überholt).
6. Skills `golfnext-design-system`, `golfnext-qa`.

## Harte Vorgaben

**Die Mock-Header sind jetzt veraltet – das ist kein Fehler.**
Alle Seiten-Mocks unter `docs/design-system/mocks/` zeigen im Kopf noch die alte Navigation mit „Praxis" als
Hauptpunkt und mit Modul-Dropdowns. Die Mocks bleiben die verbindliche Vorlage für **Seiteninhalte**;
für die **Navigation** gilt ab jetzt diese Entscheidung. **Den gebauten Header nicht an die Mocks
zurückanpassen.** `design-system-guard` und `text-fidelity` bekommen diesen Hinweis ausdrücklich mit.

**Nur Datenpflege, kein Redesign.** Header, Dropdown-Mechanik, Mobilmenü und Footer sind gebaut und
funktionieren. Hier wird die Datengrundlage geändert, nicht das Aussehen. Keine neuen Farben, Abstände,
Animationen oder Bausteine. Wenn eine Komponente Code enthält, der nur für die Modulseiten existierte,
wird er entfernt – nicht umgeschrieben.

**`MODULE` bleibt als Datenliste bestehen.** Die zwölf Module verschwinden aus `ROUTES`, aber **nicht** aus
`MODULE` – die Footer-Systemkarte zeigt sie weiterhin als Namen in zwei Spalten. Sie stehen dort dann ohne
Link. Das passiert von selbst, weil `Footer.tsx` über `isLinkable()` rendert und für eine nicht mehr
existierende Route `false` zurückkommt: aus dem `<a>` wird ein `<span>` (so in 0022 angelegt). **Prüfen,
dass das wirklich greift**, und den nun toten `path`-Aufbau im Footer aufräumen. Kein `href="#"`.

**Kein Modulstatus** – unverändert seit Briefing 0014. Das Feld `MODULE[].status` bleibt ungenutzt.

**Kontakt erscheint erst, wenn es die Seite gibt.** `/kontakt` bekommt jetzt `parent: "/ueber-golfnext"`,
bleibt aber nicht `live` – die Seite entsteht in Masterplan 4.3 mit dem Formular. Nach der Regel aus 0022
(nicht-`live` Punkte werden nicht gerendert) taucht „Kontakt" also noch **nicht** im Dropdown auf und
erscheint automatisch, sobald 4.3 fertig ist. **Das ist gewollt** – kein Menüpunkt auf eine leere Seite.
Dasselbe gilt für „Praxis" (kommt mit Phase 3) und „So arbeitet GolfNext" (kommt mit 2.4/`3.3b`).
**Konsequenz, die im PR stehen muss:** bis dahin haben Plattform und Über GolfNext sichtbar **kein**
Dropdown; die Hauptnavigation zeigt vorerst fünf reine Links. Das ist der ehrliche Zwischenstand.

## Aufgaben

### A · `config/site-structure.ts`

1. **`/praxis`:** `nav: "haupt"` entfernen, `parent: "/ueber-golfnext"` setzen. Status bleibt `geplant`,
   `noindex: true` bleibt. Der Mock-Verweis auf `3.9a` bleibt; `briefing:` zeigt bis zum Sanity-Briefing
   ins Leere – Feld auf `undefined` setzen statt auf eine nicht existierende Datei (`0020-praxis.md` gibt
   es nicht und wird es nicht geben).
2. **`/kontakt`:** `parent: "/ueber-golfnext"` ergänzen. Status und `noindex` bleiben, bis 4.3 läuft.
3. **`/team`:** Route ersatzlos entfernen.
4. **Die zwölf `/module/<slug>`-Routen** aus `ROUTES` entfernen (der `...MODULE.map(...)`-Block).
   `MODULE` selbst **bleibt**.
5. **`/ratgeber`:** Route ersatzlos entfernen.
6. Den Kommentarblock am Dateikopf auf den neuen Stand bringen: welche Status es gibt, dass nicht-`live`
   Punkte nicht gerendert werden, und dass die Navigation sich aus `nav`/`parent` ergibt.

### B · Code

7. **`lib/links.ts`:** CTA-Ziel `"team"` entfernen (zeigt auf die gelöschte Route). Auch in
   `content/types.ts` aus dem `Cta["target"]`-Union nehmen. Vorher prüfen, ob es irgendwo benutzt wird –
   nach heutigem Stand nicht. Falls doch: auf `/ueber-golfnext` umbiegen statt löschen, und im PR nennen.
8. **`components/site/Footer.tsx`:** Modulkarte rendert die zwölf Namen als Text. Den `/module/<slug>`-
   Pfadaufbau entfernen, wenn er dadurch überflüssig wird. Keine toten Links, kein `href="#"`.
9. **Routen-Dateien löschen**, die in 0022 entstanden sind und jetzt entfallen:
   `app/(site)/team/` und `app/(site)/module/`. `app/(site)/praxis/` und `app/(site)/kontakt/` **bleiben**.
10. `lib/navigation.ts` sollte **unverändert** funktionieren (es liest `nav`/`parent`/`isLinkable`).
    Wenn doch etwas anzupassen ist, im PR begründen.

### C · Tests

11. `lib/navigation.test.ts`: neue Struktur abbilden – Über GolfNext hat Kinder (Praxis, Kontakt),
    Clubprozesse hat keine, Plattform hat „So arbeitet GolfNext". Zusätzlich ein Test, der festhält, dass
    nicht-`live` Kinder nicht ausgeliefert werden.
12. `tests/e2e/header.spec.ts`: „Praxis" erscheint nicht mehr in der Hauptnavigation; keine
    Modul-Dropdowns; keine `href="#"`-Punkte in Header und Mobilmenü.
13. `tests/e2e/platzhalter.spec.ts` (aus 0022): Team- und Modul-Fälle entfernen, `/praxis` und `/kontakt`
    bleiben. `/team` und `/module/reach` müssen jetzt **404** liefern.

### D · Doku

14. `docs/10-launch-umfang.md`: § Navigation v1 durch die neue Struktur ersetzen. Die Zeilen zu
    Modul-Dropdowns auf Anker, zu Team und zu Ratgeber sind überholt und werden ersetzt, nicht ergänzt.
15. `docs/design-system/README.md`: die Navigationszeile (Kapitel 2.4) auf die neue Struktur bringen und
    den Zusatz aufnehmen, dass die Mock-Header den alten Stand zeigen.
16. `docs/03-seiten-und-routen.md`: entfallene Routen streichen, `/praxis` als Unterpunkt führen.
17. `docs/00-masterplan.md`: Schritt **2.10** mit diesem Umbau aufnehmen und abhaken; in 2.8 vermerken,
    dass Team- und Modul-Platzhalter mit 2.10 wieder entfallen sind; in **3.4/3.5/3.6** `/ratgeber` auf
    `/praxis` umschreiben (auch `/ratgeber/rubrik/[slug]` → `/praxis/thema/[slug]`).
18. `docs/07-seo.md` und `docs/04-sanity-content-modell.md` auf `/ratgeber`-Erwähnungen prüfen und
    umschreiben.
19. `docs/entscheidungen.md`: Eintrag zum 07.09.2026 mit der neuen Struktur, der `/praxis`-URL-Entscheidung,
    dem Wegfall von `/team`, `/ratgeber` und den zwölf Modulseiten – jeweils mit Begründung.

## Skills und Subagents

- **Skills:** `golfnext-design-system`, `golfnext-qa`.
- **Subagents:**
  - `seo-auditor` – **hier zentral:** keine internen Links auf entfernte Routen, keine toten Verweise in
    Doku oder Code, `/team`, `/module/*`, `/ratgeber` liefern 404.
  - `design-system-guard` – **mit dem Hinweis, dass die Mock-Header veraltet sind**: die Abweichung
    zwischen gebautem Header und Mock-Kopf ist die Entscheidung vom 07.09.2026, kein Verstoß.
  - `qa-runner` – Header und Mobilmenü bei 390/768/1024/1180/1440, Tastaturbedienung der Dropdowns,
    ohne JS, axe, keine Konsolenfehler.
  - `text-fidelity` – nur zur Kontrolle, dass keine Seiteninhalte angefasst wurden.
  - `pr-reviewer` – vor dem Merge.

## PR und Merge

Branch `feat/navigation-v2`. Kleine Commits („Hänge Praxis unter Über GolfNext", „Entferne Modul- und
Team-Routen", „Ziehe Navigations-Tests nach", „Ziehe Doku auf Struktur v2 nach").
Gates: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:e2e`, `pnpm test:a11y`.
CI grün, Preview ansehen (Desktop **und** Mobilmenü). **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien

- [ ] Hauptnavigation zeigt genau: Plattform · Wachstum & Vertrieb · Clubprozesse · Pakete · Über GolfNext
      plus CTA. **Praxis erscheint dort nicht mehr.**
- [ ] `/praxis` und `/kontakt` sind in `site-structure.ts` Kinder von `/ueber-golfnext`; sie erscheinen
      im Dropdown erst, wenn ihr Status auf `live` steht. Der PR hält fest, dass die Dropdowns deshalb
      aktuell noch leer sind und keiner gerendert wird.
- [ ] `/plattform/so-arbeitet-golfnext` ist das einzige verbliebene Kind von `/plattform`; Clubprozesse
      hat keine Kinder mehr.
- [ ] `/team`, `/ratgeber` und alle zwölf `/module/<slug>` liefern **404**; die Routen-Ordner sind gelöscht.
- [ ] Die zwölf Modulnamen stehen weiterhin in der Footer-Systemkarte, **als Text ohne Link**.
- [ ] Kein `href="#"` in Header, Mobilmenü oder Footer; kein interner Link auf eine entfernte Route
      (`seo-auditor` bestätigt).
- [ ] `/praxis` behält die Adresse `/praxis` – keine Weiterleitung, kein `/ueber-golfnext/praxis`.
- [ ] Kein Seiteninhalt geändert: `content/*` unverändert außer dem `team`-CTA-Ziel in `content/types.ts`.
- [ ] Gates und CI grün; alle fünf Subagents ohne FAIL; Doku nach Aufgabe D nachgezogen.

## Was du NICHT tust

- **Keine neue Seite bauen** – weder Praxis, Kontakt noch „So arbeitet GolfNext" (2.4 wartet auf `3.3b`).
- **Kein Sanity**, kein Formular, kein Newsletter.
- **Den Header nicht an die Mock-Köpfe zurückanpassen** – die zeigen den alten Stand.
- Keine Weiterleitungen für `/team`, `/ratgeber` oder `/module/*` einrichten: Die Website ist noch nicht
  unter `www.golfnext.de` live, diese URLs waren nie öffentlich.
- `MODULE` nicht aus `site-structure.ts` löschen und die Modulnamen nicht aus dem Footer entfernen.
- Keine bestehenden Seiten umbauen, keine neuen Farben, Abstände oder Bausteine.

## Offene Fragen an Stefan

- Keine. Die drei offenen Punkte (So arbeitet GolfNext bleibt unter Plattform · `/team` entfällt ·
  `/praxis` behält die URL) sind am 07.09.2026 entschieden.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0023-navigation-v2.md. Setze es vollständig um.

Fred und Stefan haben die Seitenstruktur neu geschnitten (07.09.2026). Es entstehen KEINE neuen Seiten –
Routen werden entfernt, umgehängt und Verweise bereinigt. Neue Struktur:

  Plattform ▾ (So arbeitet GolfNext) · Wachstum & Vertrieb · Clubprozesse · Pakete ·
  Über GolfNext ▾ (Praxis, Kontakt) · CTA

Konkret: Praxis raus aus der Hauptnavi und Kind von /ueber-golfnext (URL bleibt /praxis!), Kontakt
ebenfalls Kind von /ueber-golfnext, /team und /ratgeber und alle zwölf /module/<slug> ersatzlos weg
(inklusive der Routen-Ordner aus Briefing 0022), Clubprozesse ohne Dropdown, Plattform behält das
Dropdown mit dem einen Punkt "So arbeitet GolfNext".

Besonders wichtig:
- MODULE bleibt als Datenliste in site-structure.ts – die zwölf Modulnamen stehen weiter in der
  Footer-Systemkarte, aber ohne Link (Footer rendert über isLinkable als <span>). Prüfen, dass das greift.
- Praxis, Kontakt und So arbeitet GolfNext sind noch nicht live, erscheinen also noch NICHT im Dropdown.
  Das ist gewollt. Im PR festhalten, dass die Navigation vorerst fünf reine Links zeigt.
- Die Header in den Mocks unter docs/design-system/mocks/ zeigen die ALTE Navigation. Das ist kein
  Fehler und wird nicht "repariert" – den design-system-guard ausdrücklich darauf hinweisen.
- CTA-Ziel "team" aus lib/links.ts und content/types.ts entfernen.
- Keine Weiterleitungen einrichten: die Seite ist noch nicht unter www.golfnext.de live.

Baue über die Skills golfnext-design-system und golfnext-qa. Rufe danach die Subagents seo-auditor
(zentral: keine toten Links, entfernte Routen liefern 404), design-system-guard, qa-runner und
text-fidelity auf und behebe deren FAILs, dann pr-reviewer.

Branch feat/navigation-v2, Gates (typecheck, lint, test, build, test:e2e, test:a11y) grün,
PR nach .github/pull_request_template.md, CI grün, Preview auf Desktop UND Mobilmenü ansehen.
Merge macht der Orga-Chat.

Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```

---

## Nachtrag aus der Auswertung von 0022 (Orga-Chat, 07.09.2026)

**Befund, der mit diesem Schritt verschwindet – aber wiederkommt.**
In 0022 kam heraus: Next 16 rendert für ein `notFound()` **aus einer Segment-Route** immer die Wurzel-404,
und in dieser Variante bleibt die Seite **ohne JavaScript leer** (der Statuscode 404 stimmt, der Inhalt
fehlt). Der echte 404 auf eine unbekannte URL ist davon nicht betroffen und ohne JS vollständig lesbar
(E2E `tests/e2e/fehlerseiten.spec.ts`, grün). Die einzige Route, die `notFound()` warf, war
`/module/[slug]` – die wird hier gelöscht, damit ist der Fall aktuell weg.

Zusätzliche Aufgabe in diesem Schritt:
- Nach dem Löschen von `app/(site)/module/` prüfen, ob im Projekt noch **irgendein** `notFound()`-Aufruf
  steht. Wenn nein: den entsprechenden Test aus `tests/e2e/fehlerseiten.spec.ts` entfernen und die
  CSS-Regel `header ~ header[data-gn-fallback-header]` in `app/globals.css` **stehen lassen** (sie schadet
  nicht und wird in Phase 3 wieder gebraucht) – aber den Kommentar dort auf diesen Stand bringen.
- In `docs/entscheidungen.md` festhalten: **vor Phase 3 zu lösen.** `/praxis/[slug]` wird `notFound()` für
  unbekannte Artikel-Slugs werfen (gelöschter Artikel, Tippfehler, Crawler). Dann trifft der Befund eine
  echte, öffentliche Route, und „ohne JS lesbar" ist eine nicht verhandelbare Regel aus `CLAUDE.md`.
  Lösungsweg beim Sanity-Briefing festlegen (z. B. statt `notFound()` eine normale Seite mit 404-Status
  ausliefern).

**Zweiter Befund, kein Baustopp:** `NEXT_PUBLIC_BOOKING_URL` ist in Vercel **weder in Production noch in
Preview gesetzt** (in 0022 nachgemessen). Alle „Online-Erstgespräch vereinbaren"-CTAs zeigen deshalb auf
die leere `/kontakt`-Platzhalterseite. Das ist besser als der vorherige 404, aber der wichtigste CTA der
Website führt derzeit ins Nichts. **Nicht in diesem Schritt lösen** – gehört zu Masterplan 4.3/4.4 und
liegt bei Stefan und Fred.
