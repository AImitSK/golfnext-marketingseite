# 0024 · Seite So arbeitet GolfNext (/plattform/so-arbeitet-golfnext) · Neufassung v01

Masterplan-Schritt: **2.4** · Branch: `feat/so-arbeitet-golfnext` · Phase: 2

Die letzte fehlende Seite aus Phase 2, in der von Stefan freigegebenen **Neufassung v01**
(Mock `3.3b`, ersetzt die archivierte `3.3`). Sie zeigt, was ein Club nach einer Anmeldung
tatsächlich verschickt – vier Nachrichten je Zielgruppe, zum Nachlesen.

**Mit dieser Seite erscheint das Plattform-Dropdown zum ersten Mal**: „So arbeitet GolfNext" ist
seit Briefing 0023 das einzige Kind von `/plattform` und wird sichtbar, sobald die Route `live` ist.

**Vorbedingung:** Briefing 0023 (Navigation v2) ist auf `main`. `git fetch`, `main` nachziehen, dann
`feat/so-arbeitet-golfnext` abzweigen. **Dieses Briefing, der Mock `3.3b` und die Doku-Änderungen liegen
uncommittet im Arbeitsverzeichnis – mit dem Branch aufnehmen.**

## Kontext und Lesereihenfolge

1. `CLAUDE.md` – Texte wortgleich, keine erfundenen Zahlen, Benennungen, Grün-Regel, Bewegung, **kein Modulstatus**.
2. Skills `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
3. **Mock (verbindlich): `docs/design-system/mocks/3.3b-so-arbeitet-golfnext-neufassung.html`.**
4. Die gebauten Seiten `components/pages/plattform|wachstum-vertrieb|clubprozesse|ueber-golfnext/`
   als Referenzmuster (Layout-Tokens, `PlattformSection`, `Rise`/`RiseItem`, `useStagedInView`, Slider-Mechanik).
5. `config/site-structure.ts` (`/plattform/so-arbeitet-golfnext` → hier auf `live`), `lib/links.ts`.

## Seitenstruktur (aus 3.3b)

1. **Hero** – Eyebrow „So arbeitet GolfNext", H1 **„Nach der Anmeldung hört Ihr Club nicht auf zu reden."**,
   Lead (vier Nachrichten: Bestätigung, Vorbereitung, Danke, nächstes Angebot), CTAs Live-Demo /
   Erstgespräch, drei Vertrauenspunkte („Kein Newsletter an alle" · „Sie geben jeden Text frei" ·
   „Abmeldung mit einem Klick"). Rechts die Vier-Nachrichten-Strecke „Was tatsächlich verschickt wird".
2. **„Fünf Zielgruppen, fünf eigene Strecken."** – Umschalter mit fünf Strecken:
   **Schnuppergolf · Platzreife · Mitgliedschaft · Greenfee & Gäste · Firmen-Event**.
   Je Strecke vier Mail-Fenster (Betreff, Vorschautext, Zeitangabe, teils ein Ratgeber-Verweis).
3. **„Die letzte Nachricht schreibt kein System."** – der Übergabepunkt an einen Menschen.
4. **„Drei Regeln für alles, was in Ihrem Namen rausgeht."** – Navy-Band wie auf 3.4b/3.8b.
5. **Abschluss** „Welche Zielgruppe soll bei Ihnen als Erstes begleitet werden?" + geteilter
   `FooterClose`/`Footer`.

## Harte Vorgaben

**Die Textquelle ist der Mock, nicht Freds altes Briefing.**
`3.3b` trägt **neue Texte**. Das alte `docs/design-system/briefings/3.3-so-arbeitet-golfnext-briefing.md`
(Customer Journey, Marketing-CRM, Phasenkette „Unbekannt → Besucher → …") ist mit der Neufassung **Archiv**
und darf **nicht** als Textquelle herangezogen oder mit der neuen Fassung vermischt werden. Alle Texte
wortgleich aus `3.3b` nach `content/so-arbeitet-golfnext.ts`.

**Die Mail-Inhalte sind illustrative Beispiele, keine Zusagen.**
Betreffzeilen, Vorschautexte, Empfängeradressen (`anna.berger@…`), Uhrzeiten, Treffpunkte und die Zeile
„Ihr Trainer ist Fred Hoffmann" stammen 1:1 aus dem Mock und illustrieren, wie eine Strecke aussieht.
Sie werden **wortgleich übernommen**, aber als dekorative Beispieloberfläche gebaut (`aria-hidden` an den
Mail-Fenstern, wie die Oberflächen auf `/clubprozesse` und `/plattform`). **Keine Zahlen ergänzen**, keine
Öffnungs- oder Klickraten, keine Terminversprechen.

**Benennungen** – der Mock ist bereits regelkonform, das bitte so lassen: **„Greenfee & Gäste"** und
„Greenfee-Gast" als **Zielgruppe**, **„Gastfee"** für Modul und Zahlung. Nicht vereinheitlichen.

**Kein Modulstatus** – keine „Im Einsatz/Pilot/In Entwicklung"-Labels, keine Legende (seit 0014).

**Der Umschalter muss ohne JavaScript funktionieren.**
Der Mock schaltet die fünf Strecken per JS (`.tab` + `data-s`). Nachbauen wie auf der Startseite (Briefing
0013, Umschalter Wachstum ↔ Clubprozesse): **native Radiogruppe** – versteckte, aber fokussierbare
`<input type="radio">` plus `<label>`-Tabs in `<fieldset>`/`<legend>`, Umschalten rein über CSS `:checked`.
Alle fünf Strecken stehen im Server-HTML, sind per Tastatur (Pfeiltasten) erreichbar, und ohne JS ist
**jede** Strecke lesbar. Kurzer Übergang nur mit Motion, unter Reduced Motion sofort.

**Layout und Bewegung.** Layout-Tokens der Neufassung wiederverwenden (`--gn-wrap-wide`, `--gn-radius-lg`,
`--gn-section-y-lg`, `--gn-h2-lg`), geteilte Sektions-Schale `PlattformSection`, geteilte Motion-Infra
(`useStagedInView`, `Rise`/`RiseItem`, `RevealLine`). Sektions-CSS aus `3.3b` als co-lokierte `*.module.css`
portieren (Tokens auf `--gn-…`). **Pakete und Startseite nicht anfassen.**
Bewegung: Reveals und die Mail-Strecke einmal/dezent; **Endzustand im Server-HTML**, `prefers-reduced-motion`
→ sofort, ohne JS lesbar, kein CLS, Bleed über `overflow: hidden` ohne Seiten-Overflow.

**Der Header in `3.3b` zeigt die alte Navigation** (Praxis als Hauptpunkt, Modul-Dropdowns). Das ist seit
Briefing 0023 überholt – **den gebauten Header nicht daran anpassen**, `design-system-guard` darauf hinweisen.

## Aufgaben

1. `content/so-arbeitet-golfnext.ts` – alle Texte wortgleich aus `3.3b`, typisierte Sektionsdaten;
   die fünf Strecken als Datenstruktur (Zielgruppe → vier Nachrichten mit Betreff, Text, Zeitangabe,
   optionalem Ratgeber-Verweis).
2. Seitenkomponenten unter `components/pages/so-arbeitet-golfnext/` – CSS portiert, Umschalter als
   Radiogruppe, Mail-Fenster als schematische Illustrationen.
3. `app/(site)/plattform/so-arbeitet-golfnext/page.tsx` – Sektionen + `<Footer footerClose={…} />`,
   Metadata/Canonical, genau **eine** `<h1>`.
4. `config/site-structure.ts`: Route auf `status: "live"` setzen. Damit erscheint das Plattform-Dropdown –
   `lib/navigation.test.ts` und `tests/e2e/header.spec.ts` entsprechend nachziehen (Plattform hat jetzt ein
   Dropdown mit einem Punkt).
5. Neue Specs `tests/e2e/so-arbeitet-golfnext.spec.ts` und `tests/a11y/so-arbeitet-golfnext.spec.ts`.
6. `docs/03-seiten-und-routen.md` (Status), `docs/entscheidungen.md` (Neufassung v01, Textquelle Mock,
   Umschalter ohne JS, Illustrations-/Zahlen-Entscheidung), Masterplan 2.4 abhaken.

## Skills und Subagents

- **Skills:** `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
- **Subagents:** `text-fidelity` (wortgleich mit **3.3b**, nicht mit dem alten Briefing; Benennungen
  Greenfee/Gastfee; keine erfundenen Zahlen), `design-system-guard` (**Mock-Header veraltet, kein Verstoß**),
  `qa-runner` (Umschalter ohne JS und per Tastatur, Reduced-Motion, kein CLS, Overflow @390–1440, axe),
  `seo-auditor` (eine H1, Canonical, Dropdown-Link korrekt), dann `pr-reviewer`.

## PR und Merge

Branch `feat/so-arbeitet-golfnext`. Gates: `pnpm typecheck`, `lint`, `test`, `build`, `test:e2e`, `test:a11y`.
CI grün, Preview gegen `3.3b` abgleichen (Desktop **und** Mobil, alle fünf Strecken).
**Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien

- [ ] `/plattform/so-arbeitet-golfnext` entspricht `3.3b` in Struktur und Wortlaut; Texte in
      `content/so-arbeitet-golfnext.ts`; kein Text aus dem alten 3.3-Briefing.
- [ ] Alle fünf Strecken (Schnuppergolf · Platzreife · Mitgliedschaft · Greenfee & Gäste · Firmen-Event)
      sind **ohne JavaScript** lesbar und per Tastatur umschaltbar.
- [ ] Mail-Fenster sind dekorativ (`aria-hidden`); keine erfundenen Zahlen; „Greenfee" als Zielgruppe und
      „Gastfee" als Modul bleiben wie im Mock.
- [ ] Kein Modulstatus; genau eine `<h1>`; Canonical gesetzt.
- [ ] Route ist `live`; **das Plattform-Dropdown erscheint** und enthält genau diesen einen Punkt;
      Tests dafür angepasst.
- [ ] Kein Overflow @390/768/1024/1180/1440; Reduced-Motion → Endzustand; kein CLS; keine Konsolenfehler.
- [ ] Gates und CI grün; alle fünf Subagents ohne FAIL; Doku und Masterplan-Haken 2.4 nachgezogen.

## Was du NICHT tust

- Freds altes 3.3-Briefing als Textquelle verwenden oder Inhalte daraus einmischen.
- Den Umschalter als reine JS-Lösung bauen.
- Zahlen, Raten oder Fristen ergänzen, die nicht im Mock stehen.
- Den Header an den veralteten Mock-Kopf anpassen.
- Pakete oder Startseite retrofitten; Praxis, Kontakt oder Sanity anfassen.

## Nebenbei mitzunehmen

**Menü-Label des Blogs (Entscheidung Stefan, 07.09.2026):** `/praxis` heißt in der Navigation
**„Ratgeber"** – `label` in `config/site-structure.ts` ist bereits geändert und liegt uncommittet im
Arbeitsverzeichnis. Adresse bleibt `/praxis`, der **Seiteninhalt spricht weiter von „Praxis"**
(Freds Wortlaut in Mock 3.9a) – **nicht angleichen**. Falls ein Test das alte Label „Praxis" erwartet,
mit anpassen; die Platzhalterseite `/praxis` trägt dadurch die `<h1>` „Ratgeber".

## Offene Fragen an Stefan

1. **Soll Fred den neuen Wortlaut von `3.3b` gegenlesen?** Die Neufassung trägt komplett neue Texte
   (konkrete Mail-Betreffs statt der Customer-Journey-Sprache seines Briefings). Bei 3.2c/3.4b/3.5b/3.8b/3.1b
   galt dein Freigabe-OK als ausreichend – hier ist der inhaltliche Sprung größer.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0024-so-arbeitet-golfnext.md. Setze es vollständig um.

Gebaut wird die letzte fehlende Seite aus Phase 2: /plattform/so-arbeitet-golfnext aus dem Mock
docs/design-system/mocks/3.3b-so-arbeitet-golfnext-neufassung.html (Neufassung v01).

Besonders wichtig:
- Die Textquelle ist AUSSCHLIESSLICH der Mock 3.3b. Freds altes Briefing
  docs/design-system/briefings/3.3-so-arbeitet-golfnext-briefing.md ist Archiv und trägt ganz andere
  Texte (Customer Journey, Marketing-CRM) – nicht einmischen.
- Der Umschalter über die fünf Zielgruppen-Strecken (Schnuppergolf, Platzreife, Mitgliedschaft,
  Greenfee & Gäste, Firmen-Event) muss OHNE JavaScript funktionieren: native Radiogruppe mit
  versteckten, fokussierbaren Radios und Label-Tabs, Umschalten per CSS :checked – genau wie der
  Umschalter auf der Startseite (Briefing 0013). Alle fünf Strecken stehen im Server-HTML.
- Die Mail-Fenster sind schematische Illustrationen (aria-hidden). Betreffs, Beispieladressen und
  "Ihr Trainer ist Fred Hoffmann" wortgleich aus dem Mock übernehmen, aber KEINE Zahlen, Raten oder
  Fristen ergänzen.
- Benennungen so lassen wie im Mock: "Greenfee & Gäste" als Zielgruppe, "Gastfee" als Modul/Zahlung.
- Kein Modulstatus.
- Der Header IM MOCK zeigt die alte Navigation (Praxis, Modul-Dropdowns). Das ist seit Briefing 0023
  überholt – den gebauten Header nicht daran anpassen, den design-system-guard darauf hinweisen.
- Route danach auf live setzen: damit erscheint das Plattform-Dropdown zum ersten Mal. Nav-Tests
  (lib/navigation.test.ts, tests/e2e/header.spec.ts) entsprechend nachziehen.
- Briefing, Mock 3.3b und die Doku-Änderungen liegen uncommittet im Arbeitsverzeichnis – mit dem
  Branch committen.

Baue über die Skills golfnext-page-from-mock, golfnext-design-system und golfnext-qa. Rufe danach die
Subagents text-fidelity, design-system-guard, qa-runner und seo-auditor auf und behebe deren FAILs,
dann pr-reviewer.

Branch feat/so-arbeitet-golfnext, Gates (typecheck, lint, test, build, test:e2e, test:a11y) grün,
PR nach .github/pull_request_template.md, CI grün, Preview gegen 3.3b abgleichen (Desktop und Mobil,
alle fünf Strecken). Merge macht der Orga-Chat.

Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
