# 0031 · Die Live-Demo entfällt – CTAs neu ordnen

Masterplan-Schritt: 2.11 (neu) · Branch: `feat/live-demo-entfaellt` · Phase: 2 (nachgezogen)

## Kontext und Lesereihenfolge

**Es gibt keine Live-Demo und wird keine geben** (Entscheidung Stefan, 08.09.2026). Ein Bereich, in
dem ein Interessent selbstständig etwas ausprobiert, existiert nicht. Was es geben kann, ist ein
**Termin für eine Live-Präsentation** – und dafür gibt es bereits einen Weg: das Online-Erstgespräch.

Die Mocks und der daraus gebaute Code führen die Live-Demo an 27 Stellen, auf sechs Seiten sogar als
**primären grünen Button**, mit dem Zusatz „ohne Anmeldung". Das ist ein Versprechen, das die Website
nicht einlösen kann. Dieser Schritt räumt es weg.

1. `CLAUDE.md`
2. Dieses Briefing – die Fundstellenliste unten ist die Arbeitsgrundlage
3. `content/types.ts` (`Cta`), `lib/links.ts`, `config/site-structure.ts` (CTA-Ziele)
4. `docs/design-system/README.md` – Button-Varianten (primär grün / sekundär auf dunkel)
5. Die Mocks unter `docs/design-system/mocks/` – sie zeigen die Live-Demo weiterhin und werden
   **nicht** nachgezogen; die Abweichung wird dokumentiert

## Die Regel

Wo bisher **beide** Aktionen angeboten wurden, bleibt genau eine:

```
Online-Erstgespräch vereinbaren
30 Minuten persönlich per Zoom oder Teams
```

War das Erstgespräch dort die **sekundäre** Aktion, wird es zur **primären** – grüner Button, mit der
zweiten Zeile als `hint`. Ein sekundärer CTA steht an diesen Stellen danach **nicht** mehr; er wird
nicht durch etwas anderes ersetzt.

## Harte Vorgaben

- **Nichts erfinden.** Es entsteht kein neuer CTA-Text, keine „Live-Präsentation anfragen"-Variante,
  keine neue Formulierung. Verwendet wird ausschließlich der oben zitierte, bereits freigegebene
  Wortlaut, wie er heute schon im Header und in `FooterClose` steht.
- **Kein Ersatzangebot bauen.** Wo ein Verweis auf die Live-Demo ersatzlos wegfällt, fällt er
  ersatzlos weg. Keine Ankündigung („Demo folgt"), kein Platzhalter, kein Video.
- Der Zusatz **„ohne Anmeldung"** verschwindet überall mit – er gehörte zur Demo.
- Die Mocks bleiben unangetastet und sind ab jetzt an diesen Stellen überholt.
- Layout und Abstände dürfen nicht springen, wenn eine zweite Aktion verschwindet: Wo ein
  Aktionspaar zu einer einzelnen Aktion wird, den Abstand prüfen (kein doppelter Rand, keine leere
  Zeile, kein CLS).

## Fundstellen

### A · Sechs Hero-Blöcke: Erstgespräch wird primär

Überall `ctaPrimary` (Live-Demo, `hint: "ohne Anmeldung"`) **entfernen** und `ctaSecondary`
(Erstgespräch) zum `ctaPrimary` machen, mit `hint: "30 Minuten persönlich per Zoom oder Teams"`.
Kein `ctaSecondary` mehr.

| Datei | Zeile |
|---|---|
| `content/startseite.ts` | 58 |
| `content/plattform.ts` | 66 |
| `content/clubprozesse.ts` | 85 |
| `content/so-arbeitet-golfnext.ts` | 51 |
| `content/ueber-golfnext.ts` | 154 |
| `content/wachstum-vertrieb.ts` | 77 |

Die zugehörigen Hero-Komponenten tragen die alte Rollenverteilung in ihren Doc-Kommentaren
(„primärer grüner CTA (Live-Demo) und sekundäre on-dark-Aktion (Erstgespräch)") – mitziehen.
Ob die Komponenten den Fall „nur eine Aktion" schon können, ist zu prüfen; wenn nicht, wird die
Prop optional, nicht die Aktion künstlich verdoppelt.

### B · Acht `FooterClose`-Abschlüsse: sekundärer Verweis entfällt

Der primäre CTA (Erstgespräch) steht dort bereits richtig, samt zweiter Zeile. Nur die Zeile
darunter fällt weg:

| Datei | Zeile | Text |
|---|---|---|
| `content/startseite.ts` | 524 | „Oder zuerst die Live-Demo ansehen" |
| `content/plattform.ts` | 523 | dito |
| `content/clubprozesse.ts` | 514 | dito |
| `content/so-arbeitet-golfnext.ts` | 512 | dito |
| `content/ueber-golfnext.ts` | 360 | dito |
| `content/wachstum-vertrieb.ts` | 603 | dito |
| `content/praxis.ts` | 130 | dito |
| `content/pakete.ts` | 454 | „Oder zuerst GolfNext in der Live-Demo ansehen" |

Danach nutzt niemand mehr die Prop `secondary` von `FooterClose`. **Die Prop bleibt trotzdem
erhalten** – sie ist Teil des Bausteins aus Masterplan 1.4 und wird nicht wegen momentaner
Nichtnutzung entfernt. Im `_bausteine`-Katalog bleibt sie sichtbar, mit neutralem Beispieltext.

### C · Zwei einzelne Verweise im Fließtext

- `content/startseite.ts:341` – Abschnitt „Ein Weg": Von den zwei Links unter dem Abschnitt bleibt
  nur „So arbeitet GolfNext – alle Sequenzen im Detail". Prüfen, dass `EinWeg.tsx` mit einem
  einzelnen Link sauber aussieht (Doc-Kommentar dort nennt noch beide).
- `content/so-arbeitet-golfnext.ts:354` – „Alle Sequenzen in der Live-Demo" entfällt aus der
  Linkliste.

### D · Kontaktseite: aus drei Wegen werden zwei

- `content/kontakt.ts:166–170` – der Seitenspalten-Kasten „Lieber erst schauen?" mit dem Satz „Die
  Live-Demo läuft ohne Anmeldung …" entfällt vollständig, samt Feld `livedemo` in
  `SeitenspalteData` und dem Block in `components/pages/kontakt/Formular.tsx:117–121`. Der
  Rollen-Hinweis darüber bleibt.
- `content/kontakt.ts:190–197` – der zweite Weg „Live-Demo" (Icon `bildschirm`) entfällt. Es bleiben
  **Online-Erstgespräch** und **Einfach anrufen**. Der Icon-Typ `bildschirm` wird damit unbenutzt –
  aus der Union in `WegData` entfernen und das Icon in `Wege.tsx` mit ausbauen.
- Das Raster der Wege ist auf drei Karten ausgelegt; auf zwei umstellen, ohne dass eine Lücke
  klafft. Der Abschnittstext darüber („Nicht jeder schreibt gern ein Formular.") ist freigegebener
  Text und bleibt wortgleich – **auch wenn er auf drei Wege anspielt, wird er nicht umgeschrieben**.
  Passt er nach der Änderung nicht mehr, ist das eine Frage an Stefan, keine Eigenmächtigkeit.

### E · Technik: das Ziel `livedemo` verschwindet

- `content/types.ts:11` – `"livedemo"` aus der Union `Cta["target"]`.
- `lib/links.ts` – Funktion `liveDemoUrl()` und der `case "livedemo"` in `resolveCta` entfallen;
  Doc-Kommentar oben mitziehen.
- `lib/links.test.ts` – die Fälle zu `liveDemoUrl` entfallen; ein Test soll dafür sichern, dass
  `resolveCta` ein unbekanntes Ziel nicht stillschweigend auf `#` abbiegt.
- `config/site-structure.ts:229` – der CTA-Eintrag `liveDemo` entfällt.
- `components/pages/praxis/PortableTextRenderer.tsx:23–24` – `case "livedemo"` entfällt.
- `.env.example` – `NEXT_PUBLIC_LIVE_DEMO_URL` entfällt. **In Vercel war sie nie gesetzt** (Stefan,
  08.09.2026 geprüft) – dort ist nichts zu tun.

### F · Sanity-Schema

**Vorab geprüft (08.09.2026, GROQ gegen `production`):** Kein Artikel enthält ein `cta`-Objekt –
`target: "livedemo"` wird nirgends verwendet –, und ein `siteSettings`-Dokument existiert noch nicht.
Die Änderung bricht also keinen Inhalt.

- `sanity/schemaTypes/objects/cta.ts:7` – Option „Live-Demo" aus der Auswahlliste entfernen.
- `sanity/schemaTypes/siteSettings.ts:41–42` – Feld `liveDemoUrl` entfernen.
- `lib/sanity/queries.ts:131` – `liveDemoUrl` aus `SITE_SETTINGS_QUERY` entfernen.
- Danach `pnpm sanity:typegen`, `sanity.types.ts` und `sanity/schema.json` neu einchecken.
- Schema-Änderung in `docs/04-sanity-content-modell.md` unter „Änderungen am Schema" eintragen
  (Datum, Feld, Grund) – so schreibt es der Skill `sanity-content-model` vor.

### G · Design-System-Katalog

- `app/(preview)/_bausteine/page.tsx:221` – der Beispieltext „Alternativ: Live-Demo ansehen" wird zu
  einem neutralen Beispiel.
- `components/ui/Button.module.css:184` – der Kommentar nennt dasselbe Beispiel; mitziehen.
- **Die Button-Variante „sekundär auf dunkel" bleibt bestehen** (Masterplan 1.2). Sie ist nach diesem
  Schritt womöglich nirgends mehr im Einsatz – das ist kein Grund, einen Baustein zu löschen.

## Aufgaben

1. Abschnitte A bis G der Reihe nach abarbeiten. Nach A und B jeweils `pnpm build` – die
   Typänderung in E zieht Fehler durch den ganzen Baum, deshalb kommt sie **nach** den Inhalten.
2. `grep -ri "live-demo\|livedemo\|LIVE_DEMO"` über `app`, `components`, `content`, `lib`, `config`,
   `sanity`, `tests` – das Ergebnis muss leer sein (Mocks und `docs/` ausgenommen).
3. Tests: E2E prüfen, dass auf jeder Seite genau ein Hero-CTA steht und er auf das Erstgespräch
   zeigt; dass keine Seite mehr auf eine Live-Demo verweist; dass die Kontaktseite zwei Wege zeigt.
   Bestehende Tests, die die alte Anordnung sichern, mitziehen statt zu löschen.
4. Doku: `docs/03-seiten-und-routen.md`, `docs/10-launch-umfang.md` (falls dort erwähnt),
   `docs/04-sanity-content-modell.md` und `docs/entscheidungen.md` nachziehen. Im Masterplan einen
   Schritt **2.11** ergänzen, der diesen Umbau festhält, und die Zeile zu Masterplan **4.4**
   (Erstgespräch-CTA) um den Hinweis erweitern, dass es nur noch dieses eine Ziel gibt.

## Skills und Subagents

- Skills: `golfnext-design-system`, `golfnext-qa`, `sanity-content-model` (für Abschnitt F)
- Subagents nach dem Bauen: `text-fidelity` (kein neuer CTA-Text, freigegebener Wortlaut unverändert),
  `design-system-guard`, `seo-auditor` (keine toten internen Verweise), `qa-runner`, dann `pr-reviewer`

## PR und Merge

Branch `feat/live-demo-entfaellt`, PR nach `.github/pull_request_template.md`, CI grün, Preview über
**alle** Seiten klicken, `pr-reviewer`. Merge macht der Orga-Chat.

## Akzeptanzkriterien

- [ ] Auf keiner Seite steht mehr das Wort „Live-Demo" – geprüft per `grep` über `app`, `components`,
      `content`, `lib`, `config`, `sanity`, `tests`.
- [ ] Die sechs Hero-Blöcke tragen genau **einen** CTA: „Online-Erstgespräch vereinbaren" als grünen
      Button mit der zweiten Zeile „30 Minuten persönlich per Zoom oder Teams".
- [ ] Der Zusatz „ohne Anmeldung" kommt nirgends mehr vor.
- [ ] Die acht `FooterClose`-Abschlüsse haben keinen sekundären Verweis mehr; die Prop `secondary`
      existiert weiterhin im Baustein.
- [ ] Die Kontaktseite zeigt zwei Wege (Erstgespräch, Anruf) ohne Lücke im Raster; der
      Seitenspalten-Kasten „Lieber erst schauen?" ist weg.
- [ ] `Cta["target"]` kennt `livedemo` nicht mehr; `liveDemoUrl()` und
      `NEXT_PUBLIC_LIVE_DEMO_URL` existieren nicht mehr.
- [ ] Schema ohne `livedemo`-Option und ohne `siteSettings.liveDemoUrl`, `sanity.types.ts` neu erzeugt.
- [ ] Kein neuer CTA-Text, keine neue Formulierung, kein Ersatzangebot.
- [ ] Kein horizontaler Überlauf bei 390/768/1024/1180/1440, keine Konsolenfehler, ohne JS lesbar,
      kein CLS an den Stellen, wo eine zweite Aktion verschwunden ist.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e` grün.

## Was du NICHT tust

- Einen Ersatz für die Live-Demo bauen oder ankündigen.
- Neue CTA-Texte formulieren – auch keine „Live-Präsentation vereinbaren"-Variante.
- Den freigegebenen Abschnittstext „Nicht jeder schreibt gern ein Formular." umschreiben, weil es
  jetzt zwei statt drei Wege sind.
- Die Mocks ändern.
- Die Button-Variante „sekundär auf dunkel" oder die Prop `secondary` löschen, weil sie gerade
  niemand benutzt.
- Inhalte in Sanity anlegen oder ändern.

## Offene Fragen an Stefan

- Der Abschnittstext auf `/kontakt` („Nicht jeder schreibt gern ein Formular.") bleibt wortgleich,
  obwohl darunter nur noch zwei Wege stehen. Wenn dir das schief vorkommt, brauchen wir eine
  freigegebene Neufassung – die erfindet niemand nebenbei.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0031-live-demo-entfaellt.md. Setze es vollständig um.

Es gibt keine Live-Demo und wird keine geben (Entscheidung Stefan, 08.09.2026). Ein Bereich,
in dem ein Interessent selbstständig etwas ausprobiert, existiert nicht – es kann nur einen
Termin für eine Live-Präsentation geben, und dafür gibt es bereits das Online-Erstgespräch.

Die Regel: Wo bisher beide Aktionen angeboten wurden, bleibt genau eine –
„Online-Erstgespräch vereinbaren" mit der zweiten Zeile
„30 Minuten persönlich per Zoom oder Teams". War das Erstgespräch dort die sekundäre Aktion,
wird es zur primären im grünen Button. Ein sekundärer CTA steht danach nicht mehr da.

Das Briefing listet alle 27 Fundstellen mit Datei und Zeile, in sieben Abschnitten A bis G:
Hero-Blöcke, FooterClose, einzelne Verweise, Kontaktseite, Technik (Cta-Union, lib/links,
site-structure, PortableTextRenderer, .env.example), Sanity-Schema und Design-System-Katalog.
Arbeite sie in dieser Reihenfolge ab – die Typänderung kommt NACH den Inhalten.

Besonders wichtig:
- Nichts erfinden: kein neuer CTA-Text, keine „Live-Präsentation vereinbaren"-Variante,
  kein Ersatzangebot, keine Ankündigung.
- Der Zusatz „ohne Anmeldung" verschwindet überall mit.
- Die Mocks werden NICHT geändert; sie sind an diesen Stellen ab jetzt überholt.
- Die Button-Variante „sekundär auf dunkel" und die Prop `secondary` von FooterClose bleiben
  bestehen, auch wenn sie danach niemand benutzt.
- Der freigegebene Text „Nicht jeder schreibt gern ein Formular." bleibt wortgleich, obwohl
  darunter nur noch zwei Wege stehen.
- Für Sanity ist geprüft: kein Artikel nutzt target „livedemo", kein siteSettings-Dokument
  existiert. Trotzdem: keine Inhalte anlegen oder ändern.

Zum Schluss muss `grep -ri "live-demo\|livedemo\|LIVE_DEMO"` über app, components, content,
lib, config, sanity und tests leer sein (docs und mocks ausgenommen).

Baue über die Skills golfnext-design-system, golfnext-qa und sanity-content-model, rufe danach
die Subagents text-fidelity, design-system-guard, seo-auditor und qa-runner auf und behebe
deren FAILs.

Branch feat/live-demo-entfaellt, PR nach .github/pull_request_template.md, CI grün, dann
pr-reviewer. Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche
Abweichungen vom Briefing.
```
