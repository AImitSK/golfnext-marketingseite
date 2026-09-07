# 0025 · Kontaktseite (/kontakt) mit Formular

Masterplan-Schritt: **4.3** (vorgezogen aus Phase 4) · Branch: `feat/kontakt` · Phase: 4

Die Kontaktseite aus dem neuen Mock **`3.10-kontakt.html`** (Stefan, 07.09.2026) – Layout **und**
funktionierendes Formular in einem Schritt. Damit erscheint der Menüpunkt **„Kontakt"** erstmals im
Über-GolfNext-Dropdown, und der CTA-Fallback aus `lib/links.ts` führt endlich auf eine echte Seite.

**Vorbedingung:** Briefing 0024 ist gemerged (Phase 2 abgeschlossen). `git fetch`, `main` nachziehen, dann
`feat/kontakt` abzweigen. **Briefing, Mock `3.10` und die Doku-Änderungen liegen uncommittet im
Arbeitsverzeichnis – mit dem Branch aufnehmen.**

## Kontext und Lesereihenfolge

1. `CLAUDE.md` – Texte wortgleich, Sie-Form, Datenschutz, Zustände.
2. **Skill `sendgrid-forms`** – das Muster für Server Action, zod, Spam-Schutz, Versand. **Zuerst laden.**
3. **`docs/06-formulare-sendgrid.md`** – die verbindlichen Details der Formularmechanik.
4. `docs/08-zustaende-und-feedback.md` – Blur-Validierung, Inline-Feldfehler, Alerts, Fokusführung,
   Button-Ladezustand. **Alle Texte aus `lib/forms/messages.ts`.**
5. **Mock (verbindlich): `docs/design-system/mocks/3.10-kontakt.html`.**
6. Skills `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
7. `components/forms/` und `components/feedback/` – Feldbausteine und Alerts stehen seit Briefing 0009.

## Seitenstruktur (aus 3.10)

1. **Hero** – H1 **„Schreiben Sie uns. Es antwortet ein Mensch."**, Lead („…landet direkt bei Fred
   Hoffmann – nicht in einem Ticketsystem"), drei Vertrauenspunkte: „Rückmeldung innerhalb eines
   Werktags" · „Kein Callcenter, keine Warteschleife" · „Keine Anmeldung zu irgendeinem Newsletter".
2. **„Ihre Nachricht an GolfNext"** – das Formular (Felder unten).
3. **„Nicht jeder schreibt gern ein Formular."** – drei Alternativen nebeneinander:
   **Online-Erstgespräch** („Termin aussuchen" → cal.com) · **Live-Demo** („Demo öffnen") ·
   **Einfach anrufen** (0175 5951839, Montag bis Freitag zwischen 9 und 18 Uhr).
4. Geteilter **Footer**. *(Ob ein `FooterClose` darüber steht, entscheidet der Mock – nicht dazuerfinden.)*

## Die Feldliste kommt aus dem Mock

**Wichtig: Die Feldliste in Masterplan 4.3 war älter und ist überholt.** Verbindlich ist der Mock:

| Feld | Typ | Pflicht |
|---|---|---|
| Vorname | Text | ja |
| Nachname | Text | ja |
| „Ich bin …" | Auswahl: Ehrenamtlicher Vorstand eines e.V. · Betreiber einer Golfanlage · Clubmanager · Mitarbeiter Clubsekretariat · etwas anderes | nein |
| Golfclub oder Anlage | Text | nein |
| „Worum geht es?" | Auswahl: Erstgespräch vereinbaren · Frage zu den Paketen und Preisen · Frage zu einem einzelnen Modul · Bestehende Website übernehmen · Presse oder Kooperation · Etwas anderes | nein |
| E-Mail | E-Mail | ja |
| Telefon | Tel | nein („Wenn Sie lieber angerufen werden.") |
| Ihre Nachricht | Textarea | ja |
| Einwilligung Datenschutzerklärung | Checkbox | ja |

**Es gibt kein Wunschzeit-Feld** – Termine laufen über cal.com, nicht über dieses Formular
(Entscheidung Stefan, 07.09.2026). **Keine Felder aus dem Masterplan ergänzen.**
Der Mock nennt die Pflichtfelder selbst: „Pflichtfelder sind Name, E-Mail und Ihre Nachricht" – die
Einwilligung kommt als rechtliche Pflicht dazu.

## Harte Vorgaben

**Datenschutz – das ist der ernste Teil dieses Schritts.**
- Serverseitige Validierung mit **zod**, niemals nur im Browser.
- **Zweistufiger Spam-Schutz ohne CAPTCHA** nach `docs/06`: Stufe A (Honeypot, **signierter** Zeitstempel
  mit `FORM_SIGNING_SECRET`, Payload-Anomalien → stilles Verwerfen), Stufe B (Rate-Limit über Upstash
  Redis mit In-Memory-Fallback, Duplikat-Sperre, Heuristik-Score → Betreff-Tag `[Prüfen]`).
  **Nichts Legitimes darf verloren gehen** – im Zweifel zustellen und markieren, nie verwerfen.
- **SendGrid-Key ausschließlich serverseitig.** Nutzereingaben in der Mail **escapen**.
  **Keine personenbezogenen Daten loggen** – auch nicht bei Fehlern.
- Die Einwilligungs-Checkbox verlinkt auf `/datenschutz`. **Diese Route ist noch nicht gebaut**
  (Masterplan 5.2). Der Link läuft über `internalHref`, zeigt also bis dahin auf `#` – **Checkbox und
  Text bleiben trotzdem wortgleich stehen**. Im PR vermerken, dass der Link mit 5.2 aktiv wird.

**Ohne die Umgebungswerte läuft das Formular nur im Mock-Modus.** `lib/mail/sendgrid.ts` bekommt einen
**Mock-Transport, wenn `SENDGRID_API_KEY` leer ist** (schreibt JSON nach `test-results/mail/`, Masterplan
4.2). So ist der Schritt vollständig baubar und testbar, ohne dass ein einziger Wert gesetzt ist.
Offen bei Stefan/Fred (**nicht** in diesem Schritt lösen): `FORM_SIGNING_SECRET`, verifizierter
SendGrid-Absender (4.1), `UPSTASH_REDIS_*` (4.3a). Im PR auflisten, was fehlt.

**Zustände nach `docs/08`, Texte aus `lib/forms/messages.ts`:** Blur-Validierung, Inline-Feldfehler,
Formular-Alert mit **Fokuswanderung**, Erfolgsalert **ersetzt** das Formular, Button-Ladezustand mit
Mindestanzeige. **Keine freien Meldungstexte in Komponenten.** Fehlt eine Meldung im Katalog, dort
ergänzen – Sie-Form, ein Satz, mit Ausweg, keine Technik.

**Ohne JavaScript funktionsfähig.** Das Formular muss als normales `<form>` mit Server Action abschickbar
sein; die Progressive Enhancement kommt obendrauf. Wird in der QA ausdrücklich geprüft.

**Die drei Alternativen führen an die richtigen Ziele:** „Termin aussuchen" → `bookingUrl()`
(`NEXT_PUBLIC_BOOKING_URL`, künftig cal.com), „Demo öffnen" → `liveDemoUrl()`, Telefon als `tel:`-Link.
**Nie hart kodiert** – immer über `lib/links.ts`. Die Telefonnummer kommt aus `KONTAKT` in
`config/site-structure.ts`.

**Kein Newsletter-Feld.** Der Hero verspricht ausdrücklich „Keine Anmeldung zu irgendeinem Newsletter" –
also auch keine Checkbox dafür.

**Der Header im Mock zeigt die alte Navigation** (Praxis als Hauptpunkt). Überholt seit 0023 – den
gebauten Header **nicht** daran anpassen, `design-system-guard` darauf hinweisen.

## Aufgaben

1. `content/kontakt.ts` – alle sichtbaren Seitentexte wortgleich aus `3.10` (Hero, Abschnittstitel,
   Feldlabels, Hilfetexte, die drei Alternativen). **Meldungstexte gehören nicht hierher**, sondern
   nach `lib/forms/messages.ts`.
2. `lib/mail/sendgrid.ts` mit Mock-Transport (Masterplan 4.2), falls noch nicht vorhanden.
3. Server Action + zod-Schema + Spam-Stufen A und B nach Skill `sendgrid-forms` und `docs/06`.
4. Seitenkomponenten unter `components/pages/kontakt/` – CSS aus `3.10` als `*.module.css` portiert
   (`--gn-*`), Feldbausteine aus `components/forms/` wiederverwenden.
5. `app/(site)/kontakt/page.tsx` – ersetzt die Platzhalterseite. Genau eine `<h1>`, Metadata, Canonical.
6. `config/site-structure.ts`: `/kontakt` → `status: "live"`, `noindex` entfernen. Damit erscheint der
   Menüpunkt im Dropdown – `lib/navigation.test.ts` und `tests/e2e/header.spec.ts` nachziehen.
7. Tests: Unit für Schema, Signatur, Duplikat, Score, Rate-Limit; E2E mit Mock-Transport inkl.
   Doppelklick, `aria-busy`, Fokusführung, **ohne JS** (Skill `golfnext-qa`, Punkte 11–14); a11y-Spec.
8. `docs/03-seiten-und-routen.md`, `docs/entscheidungen.md`, Masterplan 4.2/4.3 abhaken.

## Skills und Subagents

- **Skills:** `sendgrid-forms` (zuerst), `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
- **Subagents:** `text-fidelity` (wortgleich mit 3.10; keine erfundenen Felder oder Versprechen),
  `design-system-guard` (**Mock-Header veraltet, kein Verstoß**), `qa-runner` (**ohne JS absendbar**,
  Fokusführung, Ladezustand, Reduced Motion, Overflow @390–1440, axe), `seo-auditor` (eine H1, Canonical,
  `noindex` entfernt, Dropdown-Link korrekt), dann `pr-reviewer`.

## PR und Merge

Branch `feat/kontakt`. Gates: `pnpm typecheck`, `lint`, `test`, `build`, `test:e2e`, `test:a11y`.
CI grün, Preview gegen `3.10` abgleichen (Desktop und Mobil, Formular einmal mit und einmal ohne JS
abschicken). **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien

- [ ] `/kontakt` entspricht `3.10` in Struktur und Wortlaut; Texte in `content/kontakt.ts`,
      Meldungen in `lib/forms/messages.ts`.
- [ ] Feldliste exakt wie im Mock; **kein Wunschzeit-Feld**, kein Newsletter-Feld, keine Zusatzfelder.
- [ ] Das Formular ist **ohne JavaScript** absendbar; mit JS zusätzlich Blur-Validierung,
      Inline-Fehler, `aria-busy`, Fokus auf Fehler bzw. Erfolg, Erfolgsalert ersetzt das Formular.
- [ ] Spam-Stufen A und B greifen (Unit-Tests); nichts Legitimes wird verworfen; keine
      personenbezogenen Daten im Log; Nutzereingaben in der Mail escaped.
- [ ] Ohne `SENDGRID_API_KEY` läuft der Mock-Transport und schreibt nach `test-results/mail/`.
- [ ] Einwilligungs-Checkbox ist Pflicht und verweist auf `/datenschutz` (bis 5.2 über `internalHref`).
- [ ] Die drei Alternativen zeigen auf `bookingUrl()`, `liveDemoUrl()` und einen `tel:`-Link – nichts
      hart kodiert.
- [ ] `/kontakt` ist `live`, `noindex` entfernt, **der Menüpunkt „Kontakt" erscheint im Dropdown**;
      Nav-Tests angepasst.
- [ ] Kein Overflow @390/768/1024/1180/1440; keine Konsolenfehler; axe ohne Verstoß.
- [ ] Gates und CI grün; alle fünf Subagents ohne FAIL; Doku und Masterplan-Haken nachgezogen.
- [ ] Der PR listet auf, welche Umgebungswerte für den echten Versand noch fehlen.

## Was du NICHT tust

- Keine Felder erfinden oder aus der alten Masterplan-Liste ergänzen (kein Wunschzeit-Feld).
- **Kein CAPTCHA** – der Spam-Schutz ist bewusst zweistufig ohne.
- Kein Newsletter, keine Terminbuchung im Formular, **cal.com nicht einbetten** (nur verlinken –
  ein eingebettetes Skript bräuchte vorher eine Einwilligung).
- Keine Umgebungswerte erfinden oder Platzhalter-Keys eintragen.
- Den Header nicht an den veralteten Mock-Kopf anpassen; andere Seiten nicht umbauen.
- Kein Sanity, keine Rechtstexte (`/datenschutz` ist Schritt 5.2).

## Offene Fragen an Stefan

1. **Telefonzeiten:** Der Mock nennt „Montag bis Freitag zwischen 9 und 18 Uhr". Das ist neu und legt
   Fred auf Zeiten fest – bewusst so gewollt? Es wird wortgleich gebaut, falls keine Rückmeldung kommt.
2. **Empfängeradresse** der Formular-Mails: `info@golfnext.de` wie im Footer, oder eine andere?

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0025-kontakt.md. Setze es vollständig um.

Gebaut wird die Kontaktseite /kontakt aus dem neuen Mock
docs/design-system/mocks/3.10-kontakt.html – Layout UND funktionierendes Formular in einem Schritt
(Masterplan 4.3, vorgezogen). Sie ersetzt die Platzhalterseite aus Briefing 0022.

Lade ZUERST den Skill sendgrid-forms und lies docs/06-formulare-sendgrid.md – die Formularmechanik
ist der ernste Teil dieses Schritts, nicht das Layout.

Besonders wichtig:
- Die Feldliste kommt AUS DEM MOCK, nicht aus Masterplan 4.3 (die Liste dort ist überholt):
  Vorname, Nachname, "Ich bin …", Golfclub oder Anlage, "Worum geht es?", E-Mail, Telefon,
  Nachricht, Einwilligung. KEIN Wunschzeit-Feld – Termine laufen über cal.com. Kein Newsletter-Feld,
  der Hero verspricht ausdrücklich das Gegenteil.
- Serverseitige zod-Validierung, zweistufiger Spam-Schutz OHNE CAPTCHA (Honeypot, signierter
  Zeitstempel, Rate-Limit, Score). Nichts Legitimes darf verloren gehen. SendGrid-Key nur
  serverseitig, Nutzereingaben in der Mail escapen, keine personenbezogenen Daten loggen.
- lib/mail/sendgrid.ts mit Mock-Transport, wenn SENDGRID_API_KEY leer ist (Masterplan 4.2) – damit ist
  der Schritt vollständig baubar, obwohl noch kein einziger Umgebungswert gesetzt ist. Im PR
  auflisten, was für den echten Versand fehlt.
- Das Formular muss OHNE JavaScript absendbar sein (normales form + Server Action), alles Weitere
  ist Progressive Enhancement. Alle Meldungstexte aus lib/forms/messages.ts, keine freien Texte.
- Die drei Alternativen im Abschnitt "Nicht jeder schreibt gern ein Formular." zeigen auf
  bookingUrl(), liveDemoUrl() und einen tel:-Link – nichts hart kodieren. cal.com NICHT einbetten.
- Die Einwilligung verlinkt auf /datenschutz, das es noch nicht gibt – über internalHref, Text bleibt
  wortgleich stehen.
- Route danach auf live setzen und noindex entfernen: damit erscheint "Kontakt" erstmals im
  Über-GolfNext-Dropdown. Nav-Tests nachziehen.
- Der Header IM MOCK zeigt die alte Navigation – nicht daran anpassen, design-system-guard hinweisen.
- Briefing, Mock 3.10 und die Doku-Änderungen liegen uncommittet im Arbeitsverzeichnis – mit dem
  Branch committen.

Rufe danach die Subagents text-fidelity, design-system-guard, qa-runner (Schwerpunkt: ohne JS
absendbar, Fokusführung, Ladezustand) und seo-auditor auf, behebe deren FAILs, dann pr-reviewer.

Branch feat/kontakt, Gates (typecheck, lint, test, build, test:e2e, test:a11y) grün, PR nach
.github/pull_request_template.md, CI grün, Preview gegen 3.10 abgleichen (Desktop und Mobil,
Formular einmal mit und einmal ohne JS abschicken). Merge macht der Orga-Chat.

Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
