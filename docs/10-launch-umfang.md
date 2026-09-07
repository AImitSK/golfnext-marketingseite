# Launch-Umfang v1 – zu entscheiden vor Phase 2

> **Entschieden am 05.09.2026 (Stefan): Weg A mit Platzhaltern.**
> Alle Seiten, die Briefing **und** Mock haben, werden vollständig gebaut. **Fehlende Bilder werden als
> beschriftete `Shot`-/`Portrait`-Platzhalter gezeigt** (nicht ausgeblendet, nicht auf Fred gewartet).
> Sektionen werden also **nicht** per Flag versteckt (Weg B entfällt). Seiten **ohne** Briefing
> (Praxis, Team, Kontakt, Modulseiten) bleiben noindex-Platzhalter, bis Fred sie liefert – sie werden
> **nicht** erfunden. Kanonische Domain: **www.golfnext.de** (die neue Seite ersetzt die alte dort).
> **Keine** Alt-URL-Weiterleitungen nötig. Details siehe `docs/entscheidungen.md`.

Die Website kann nicht mit gestrichelten Platzhaltern und Navigationspunkten ohne Seiten live gehen. Deshalb muss vor dem Bau der Seiten
feststehen, was v1 umfasst. Zwei Wege, beide sauber:

## Weg A · Vollständig (Fred liefert vor Launch)

Alle acht Seiten wie gemockt, Navigation wie in Kapitel 2.4 inklusive Praxis und zwei Modul-Dropdowns.

Voraussetzungen **[F]**, mit Frist:
- rund 30 Produktoberflächen als Screenshots (Liste in `03-seiten-und-routen.md`), ohne personenbezogene Daten
- Porträts Fred und Stefan
- Partnerlogos mit Freigabe und Beschriftung
- Briefings für Praxis, Team und die zwölf Modulseiten (oder Entscheidung, dass Modul-Dropdowns auf Anker zeigen). **Kontakt braucht keins mehr** – Stefan hat die Seite am 07.09.2026 beschlossen, sie entsteht nach §40 als schlichte Seite mit dem UI-Kit-Formular (Masterplan 4.3)
- mindestens drei Ratgeberartikel, sonst bleibt `/ratgeber` aus der Navigation
- Zieladressen: Buchung, Live-Demo

Realistisch nur, wenn Fred die Assets parallel zu Phase 1–3 liefert. Risiko: Launch wartet auf Inhalte.

## Weg B · Schlank (empfohlen als Sicherheitsnetz)

Live gehen mit dem, was vollständig ist, und den Rest ehrlich weglassen statt zu vertrösten:

- **Navigation v1:** Plattform · Wachstum & Vertrieb · Clubprozesse · Pakete · Über GolfNext · CTA. **Praxis entfällt**, bis das Briefing da ist.
- **Modul-Dropdowns** zeigen auf Anker in `/plattform` und `/clubprozesse` (`#reach`, `#concierge` …) statt auf `/module/<slug>`.
  Die Footer-Systemkarte verlinkt dieselben Anker.
- **Screenshot-Sektionen:** Jede Sektion, deren Kern ein `Shot`-Platzhalter ist, wird in v1 ausgeblendet (`hidden` per Feature-Flag in
  `site-structure.ts`), nicht mit Platzhalter veröffentlicht. Betroffen vor allem Wachstum & Vertrieb (Hero-Komposition, Systemabschnitt) und
  So arbeitet GolfNext (CRM-Board, Sequenz). Die Seiten bleiben inhaltlich stimmig, weil Text und Struktur tragen; die Bilder kommen als v1.1 dazu.
- **Über GolfNext:** Partnerlogo-Abschnitt ausgeblendet, bis Logos und Freigaben da sind; Porträts als kleine Platzhalter sind vertretbar, große nicht.
- **Ratgeber:** erst in Navigation und Sitemap, wenn drei Artikel veröffentlicht sind.
- **Kontakt:** bis zum Briefing führt der Footer auf Telefon/E-Mail; das Formular liegt auf `/kontakt` als schlichte Seite mit dem UI-Kit-Formular.
- **Team:** CTA „Unser Team kennenlernen" auf Über GolfNext wird in v1 nicht gerendert (Route existiert nicht).

Alles Ausgeblendete ist gebaut und über Flags zuschaltbar, sobald Inhalte vorliegen. Kein doppelter Aufwand.

## Entscheidung

- [x] Weg A oder Weg B **[S][F]** – **Weg A mit Platzhaltern** (05.09.2026, Stefan).
- [x] Bei Weg B: entfällt (kein Ausblenden von Sektionen; fehlende Bilder als `Shot`/`Portrait`-Platzhalter).
- [x] Domainfrage: **`www.golfnext.de` kanonisch** (05.09.2026, Stefan).
- [x] Alte URLs: **keine Weiterleitungen nötig** (05.09.2026, Stefan).

Entscheidung getroffen – Phase 2 kann starten.
