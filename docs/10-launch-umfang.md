# Launch-Umfang v1 – zu entscheiden vor Phase 2

> **Nachtrag 07.09.2026 (Fred/Stefan): Informationsarchitektur v2 – siehe § Navigation unten.**
> Die Seitenstruktur wurde neu geschnitten (Briefing 0023). `/team`, `/ratgeber` und die zwölf
> `/module/<slug>` entfallen ersatzlos, Praxis wandert unter Über GolfNext. Wo unten noch von
> Modul-Dropdowns, Team oder Ratgeber die Rede ist, gilt der Abschnitt „Navigation v2".

> **Entschieden am 05.09.2026 (Stefan): Weg A mit Platzhaltern.**
> Alle Seiten, die Briefing **und** Mock haben, werden vollständig gebaut. **Fehlende Bilder werden als
> beschriftete `Shot`-/`Portrait`-Platzhalter gezeigt** (nicht ausgeblendet, nicht auf Fred gewartet).
> Sektionen werden also **nicht** per Flag versteckt (Weg B entfällt). Seiten **ohne** Briefing
> (Praxis, Kontakt) bleiben noindex-Platzhalter, bis der Inhalt da ist – sie werden
> **nicht** erfunden. Kanonische Domain: **www.golfnext.de** (die neue Seite ersetzt die alte dort).
> **Keine** Alt-URL-Weiterleitungen nötig. Details siehe `docs/entscheidungen.md`.

Die Website kann nicht mit gestrichelten Platzhaltern und Navigationspunkten ohne Seiten live gehen. Deshalb muss vor dem Bau der Seiten
feststehen, was v1 umfasst. Zwei Wege, beide sauber:

## Weg A · Vollständig (Fred liefert vor Launch)

Alle acht Seiten wie gemockt, Navigation nach § Navigation v2.

Voraussetzungen **[F]**, mit Frist:
- rund 30 Produktoberflächen als Screenshots (Liste in `03-seiten-und-routen.md`), ohne personenbezogene Daten
- Porträts Fred und Stefan
- ~~Partnerlogos mit Freigabe und Beschriftung~~ – erledigt am 07.09.2026: fünf freigegebene Clublogos liegen in `public/clubs`
- ~~Briefings für Praxis, Team und die zwölf Modulseiten~~ – hinfällig seit 07.09.2026: Team und die Modulseiten entfallen, Praxis entsteht mit dem Sanity-Briefing in Phase 3. **Kontakt braucht keins** – Stefan hat die Seite am 07.09.2026 beschlossen, sie entsteht nach §40 als schlichte Seite mit dem UI-Kit-Formular (Masterplan 4.3)
- mindestens drei Praxis-Artikel, sonst bleibt `/praxis` aus der Navigation
- Zieladressen: Buchung (die Live-Demo ist am 08.09.2026 ersatzlos entfallen, Briefing 0031)

Realistisch nur, wenn Fred die Assets parallel zu Phase 1–3 liefert. Risiko: Launch wartet auf Inhalte.

## Weg B · Schlank (empfohlen als Sicherheitsnetz)

Live gehen mit dem, was vollständig ist, und den Rest ehrlich weglassen statt zu vertrösten:

- **Navigation:** siehe § Navigation v2 unten – der frühere Abschnitt „Navigation v1" ist überholt.
- **Screenshot-Sektionen:** Jede Sektion, deren Kern ein `Shot`-Platzhalter ist, wird in v1 ausgeblendet (`hidden` per Feature-Flag in
  `site-structure.ts`), nicht mit Platzhalter veröffentlicht. Die Neufassungen haben das erledigt: Wachstum & Vertrieb (3.4b) und
  So arbeitet GolfNext (3.3b) brauchen **keine Screenshots** mehr – ihre Oberflächen sind schematische Illustrationen. Es bleibt
  nichts auszublenden; die Regel gilt weiter für künftige `Shot`-Sektionen.
- **Über GolfNext:** Der Abschnitt „Gemeinsame Projekte" zeigt seit 07.09.2026 die fünf freigegebenen Clublogos – nichts mehr auszublenden. Porträts stehen seit 05.09.2026 als echte Bilder.
- **Praxis (der Blog):** erst in Navigation und Sitemap, wenn Artikel veröffentlicht sind.
- **Kontakt:** bis zum Formular führt der Footer auf Telefon/E-Mail; die Seite entsteht in Masterplan 4.3.

Alles Ausgeblendete ist gebaut und über Flags zuschaltbar, sobald Inhalte vorliegen. Kein doppelter Aufwand.

## Navigation v2 (Entscheidung Fred/Stefan, 07.09.2026 – Briefing 0023)

Ersetzt „Navigation v1". Die eine Wahrheit bleibt `config/site-structure.ts`; der Header liest über
`lib/navigation.ts` die Felder `nav` und `parent`.

```
Plattform            ▾  So arbeitet GolfNext
Wachstum & Vertrieb
Clubprozesse
Pakete
Über GolfNext        ▾  Praxis
                        Kontakt
                                          [CTA] Online-Erstgespräch vereinbaren
```

- **Praxis** ist kein Hauptpunkt mehr, sondern Unterpunkt von Über GolfNext. **Die Adresse bleibt
  `/praxis`** – nur die Menüposition wandert, deshalb keine Weiterleitung.
- **Kontakt** ist ebenfalls Kind von Über GolfNext und erscheint, sobald die Seite in 4.3 steht.
- **Clubprozesse hat kein Dropdown mehr.** Plattform behält seines mit dem einen Punkt
  „So arbeitet GolfNext".
- **`/team` entfällt** – der Inhalt steckt im Abschnitt „Die Menschen dahinter" auf `/ueber-golfnext`.
  Damit entfällt auch der CTA „Unser Team kennenlernen".
- **`/ratgeber` entfällt** – der Blog heißt `/praxis`.
- **Die zwölf `/module/<slug>` entfallen.** Die Modulnamen stehen weiterhin in der Footer-Systemkarte,
  dort als Text ohne Link. Keine Anker-Ersatzlösung, keine Weiterleitungen: die Seite war nie unter
  `www.golfnext.de` erreichbar.
- **Nicht-`live` Punkte werden nicht gerendert.** Seit Briefing 0024 ist „So arbeitet GolfNext" gebaut
  und `live` – **Plattform trägt damit das erste und bisher einzige Dropdown**, mit genau diesem einen
  Punkt. Über GolfNext bleibt vorerst ohne Dropdown, weil weder Ratgeber (`/praxis`) noch Kontakt live
  sind. Weitere Punkte erscheinen von selbst, sobald ihre Route auf `live` geht.
- **Die Mock-Köpfe unter `docs/design-system/mocks/` zeigen die alte Navigation.** Das ist kein Fehler
  und wird nicht korrigiert; die Mocks bleiben nur für die Seiteninhalte verbindlich.

## Entscheidung

- [x] Weg A oder Weg B **[S][F]** – **Weg A mit Platzhaltern** (05.09.2026, Stefan).
- [x] Bei Weg B: entfällt (kein Ausblenden von Sektionen; fehlende Bilder als `Shot`/`Portrait`-Platzhalter).
- [x] Domainfrage: **`www.golfnext.de` kanonisch** (05.09.2026, Stefan).
- [x] Alte URLs: **keine Weiterleitungen nötig** (05.09.2026, Stefan).

Entscheidung getroffen – Phase 2 kann starten.
