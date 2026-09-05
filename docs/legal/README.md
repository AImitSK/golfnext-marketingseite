# Rechtstexte

| Datei | Route | Stand |
|---|---|---|
| `impressum.md` | `/impressum` | von golfnext.de übernommen, auf DDG aktualisiert, zwei offene Prüfpunkte (USt-IdNr./Steuernummer, Firmierung) |
| `datenschutz.md` | `/datenschutz` | Entwurf passend zum Stack; offene Stellen in `[[…]]`; juristische Prüfung ausstehend |
| `../05-consent-dsgvo.md` | Technik | Consent-Konzept, Consent Mode v2, AV-Verträge |

Regeln für die Umsetzung:
- Die Texte werden als Markdown gerendert (z. B. `react-markdown` oder MDX), damit Änderungen ohne Layoutarbeit möglich sind. Typografie wie Ratgeberartikel (max 70ch).
- Interne Vermerke (Blockquotes am Anfang/Ende und `[[…]]`) dürfen **nie** in der veröffentlichten Seite erscheinen. Ein Build-Check (`tests/e2e/legal.spec.ts`) sucht nach `[[` und „Interner Vermerk" im gerenderten Text und schlägt fehl, wenn etwas gefunden wird.
- Jede Änderung an `datenschutz.md` erhöht `revision` im Consent-Tool.
- Cookie-Einstellungen-Link im Footer öffnet den Consent-Dialog; die Datenschutzseite verlinkt ebenfalls darauf.
