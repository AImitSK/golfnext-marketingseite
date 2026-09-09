# 0030 · FAQ auf /pakete aus Sanity

Masterplan-Schritt: 3.6 · Branch: `feat/faq-aus-sanity` · Phase: 3

## Kontext und Lesereihenfolge

Die sieben FAQs auf `/pakete` stehen heute als `paketeFaq` in `content/pakete.ts`. **Die
Sanity-Dokumente gibt es bereits:** Stefan hat am 08.09.2026 entschieden, sie über den
Sanity-Connector anzulegen statt sie im Studio abzutippen (bewusste Ausnahme von der Regel
„Inhalte über Studio" in `CLAUDE.md`, siehe `docs/entscheidungen.md`). Sie liegen als sieben
veröffentlichte `faq`-Dokumente mit `topic: "pakete"`, `order: 1–7` und den festen IDs
`faq-pakete-1` … `faq-pakete-7`. Der Wortlaut ist maschinell gegen `content/pakete.ts` geprüft und
**wortgleich**.

Dieser Schritt macht also nur noch eines: `/pakete` liest die Fragen aus Sanity statt aus dem Repo.

1. `CLAUDE.md`
2. `docs/00-masterplan.md`, Schritt **3.6**
3. `docs/04-sanity-content-modell.md` – `faq`, `simpleBlockContent`, Caching
4. `lib/sanity/queries.ts` – `FAQS_BY_TOPIC_QUERY` und `QUERY_TAGS` **stehen bereits**
5. `app/(site)/pakete/page.tsx` (Zeile 14 und 83), `content/pakete.ts` (`paketeFaq`, `FaqEntryData`)
6. `components/ui/Faq.tsx` / `FaqItem.tsx` – `answer` nimmt bereits `ReactNode`
7. `components/pages/praxis/PortableTextRenderer.tsx` – das gebaute Vorbild für Portable Text

## Harte Vorgaben

- **Der Wortlaut wird nicht angefasst.** Weder im Repo noch in Sanity. Wer beim Bauen eine
  Formulierung ändern möchte, lässt es.
- **Kein Rückfall auf die Repo-Fassung.** Wenn Sanity keine FAQs liefert, entfällt der Abschnitt –
  es werden nicht heimlich die alten Daten gezeigt. Zwei Wahrheiten für denselben Text sind genau
  das, was dieser Schritt beendet.
- Das Akkordeon bleibt, wie es ist: `<details>/<summary>`, ohne JavaScript bedienbar, alle Antworten
  im Server-HTML, Plus/Minus rein über CSS.
- Reihenfolge kommt aus `order`, nicht aus der Abfragereihenfolge oder dem Alphabet.
- Keine erfundenen Zahlen, keine Preisaddition – die Antworten enthalten Preise, sie bleiben Text.
- `FAQPage`-JSON-LD gehört zu Masterplan 6.4 und wird hier **nicht** gebaut.

## Aufgaben

1. **Antwort-Renderer.** Ein schlanker Renderer für `simpleBlockContent` (nur Absätze, `strong`,
   `em`, Annotation `link`) – z. B. `components/ui/SimpleText.tsx`. Der bestehende
   `PortableTextRenderer` der Praxis-Seiten ist auf `blockContent` mit Bildern, Kästen und CTA
   zugeschnitten; ihn hierher zu ziehen wäre zu viel. Gemeinsame Teile (Link-Behandlung, `rel` bei
   externen Zielen) nicht doppeln, sondern teilen.
2. **`/pakete` liest aus Sanity.** In `app/(site)/pakete/page.tsx` die FAQs über `sanityFetch` mit
   `FAQS_BY_TOPIC_QUERY` (`$topic = "pakete"`) und der Marke `faq` holen, nach `order` sortiert
   ausgeben, Antwort über den Renderer aus Aufgabe 1.
3. **Repo-Fassung entfernen.** `paketeFaq` und `FaqEntryData` aus `content/pakete.ts` löschen, samt
   dem Import in der Seite. Die Abschnittstexte um das Akkordeon herum (Eyebrow, Überschrift) bleiben
   im Content, sie sind Seitentext.
4. **Kein Inhalt, kein Abschnitt.** Liefert Sanity keine FAQs zum Thema `pakete`, entfällt der
   Abschnitt vollständig – ohne Leerzustandsmeldung und ohne doppelten Abstand.
5. **Tests.** `lib/sanity/fixtures.ts` um FAQ-Testdaten erweitern (mindestens zwei, davon eine mit
   `strong` und einem Link in der Antwort). E2E: Fragen erscheinen in der Reihenfolge aus `order`,
   alle Antworten stehen ohne JavaScript im HTML, das Akkordeon ist ohne JS bedienbar, kein
   horizontaler Überlauf bei 390/768/1024/1180/1440. Dazu ein Fall ohne FAQs (Abschnitt fehlt).
6. **Doku.** `docs/03-seiten-und-routen.md` und `docs/04-sanity-content-modell.md` nachziehen,
   Masterplan 3.6 abhaken, Eintrag in `docs/entscheidungen.md`.

## Skills und Subagents

- Skills: `sanity-content-model`, `golfnext-design-system`, `golfnext-qa`
- Subagents nach dem Bauen: `text-fidelity` (Wortlaut identisch mit den Sanity-Dokumenten),
  `design-system-guard`, `qa-runner`, danach `pr-reviewer`

## PR und Merge

Branch `feat/faq-aus-sanity`, PR nach `.github/pull_request_template.md`, CI grün,
`pr-reviewer`. Merge macht der Orga-Chat.

## Akzeptanzkriterien

- [ ] `/pakete` zeigt die sieben Fragen aus Sanity, in der Reihenfolge 1–7 aus `order`.
- [ ] Der Wortlaut auf der Seite ist identisch mit den Sanity-Dokumenten – Fragen und Antworten,
      inklusive Gedankenstrichen, `€` und `10 %`.
- [ ] `paketeFaq` und `FaqEntryData` stehen nicht mehr im Repo; es gibt keinen Rückfall auf sie.
- [ ] Ohne FAQs in Sanity entfällt der Abschnitt vollständig, ohne Layoutlücke.
- [ ] Alle Antworten stehen ohne JavaScript im HTML, das Akkordeon ist ohne JS bedienbar.
- [ ] Kein horizontaler Überlauf bei 390/768/1024/1180/1440, keine Konsolenfehler.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e` grün.
- [ ] Doku und Masterplan-Haken nachgezogen.

## Was du NICHT tust

- Den Wortlaut der Fragen oder Antworten ändern – auch nicht „glätten".
- FAQ-Dokumente in Sanity anlegen, ändern oder löschen. Sie sind da und geprüft.
- Einen Rückfall auf `content/pakete.ts` einbauen.
- `FAQPage`-JSON-LD bauen (Masterplan 6.4).
- FAQs auf anderen Seiten einführen – die übrigen `topic`-Werte (`plattform`, `clubprozesse`,
  `wachstum`, `allgemein`) bleiben vorerst ungenutzt.

## Offene Fragen an Stefan/Fred

- Keine.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0030-faq-aus-sanity.md. Setze es vollständig um.

/pakete liest die sieben FAQs künftig aus Sanity statt aus content/pakete.ts. Die sieben
faq-Dokumente (topic „pakete", order 1–7, IDs faq-pakete-1 … faq-pakete-7) liegen bereits
veröffentlicht in Sanity und sind wortgleich mit dem Repo geprüft – du legst KEINE
Dokumente an und änderst KEINE.

Besonders wichtig:
- Der Wortlaut wird nicht angefasst, weder im Repo noch in Sanity.
- Kein Rückfall auf die Repo-Fassung: Liefert Sanity nichts, entfällt der Abschnitt.
  paketeFaq und FaqEntryData werden aus content/pakete.ts gelöscht.
- Das Akkordeon bleibt <details>/<summary>, ohne JavaScript bedienbar, alle Antworten
  im Server-HTML.
- Reihenfolge kommt aus dem Feld order.
- Für die Antworten (simpleBlockContent) einen schlanken Renderer bauen – der
  PortableTextRenderer der Praxis-Seiten ist auf blockContent mit Bildern und Kästen
  zugeschnitten und wird nicht hierher gezogen.
- FAQPage-JSON-LD gehört zu Masterplan 6.4 und wird hier nicht gebaut.

Baue über die Skills sanity-content-model, golfnext-design-system und golfnext-qa, rufe
danach die Subagents text-fidelity, design-system-guard und qa-runner auf und behebe deren
FAILs.

Branch feat/faq-aus-sanity, PR nach .github/pull_request_template.md, CI grün, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
