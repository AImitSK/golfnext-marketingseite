# Briefings

Ein Briefing je Baustein oder Seite, fortlaufend nummeriert: `NNNN-<baustein>.md`. Geschrieben vom Orga-Chat
(`/naechster-schritt`), abgearbeitet vom Umsetzungs-Chat, ausgewertet vom Orga-Chat. Freds Seiten-Briefings liegen
getrennt unter `docs/design-system/briefings/` – das hier sind **Arbeitsbriefings** für Claude Code.

## Vorlage

```markdown
# NNNN · <Baustein>

Masterplan-Schritt: <x.y> · Branch: `feat/<baustein>` · Phase: <n>

## Kontext und Lesereihenfolge
1. CLAUDE.md
2. <relevante Docs, Mock, Fred-Briefing in Lesereihenfolge>

## Harte Vorgaben
- <Regeln, die in diesem Schritt besonders greifen: Wortgleichheit, Preise, Grün-Regel, Bewegung …>

## Aufgaben
1. <konkret, in Reihenfolge, mit Dateipfaden>

## Skills und Subagents
- Skills: <…>
- Subagents nach dem Bauen: <…>

## PR und Merge
- Branch, Commit-Stil, PR-Template ausfüllen, CI grün, Preview ansehen, `pr-reviewer`.

## Akzeptanzkriterien
- [ ] <prüfbar, mit Zahl oder Ja/Nein>

## Was du NICHT tust
- <Scope-Grenzen: keine anderen Seiten, keine Textänderungen, keine neuen Farben …>

## Offene Fragen an Stefan/Fred
- <falls vorhanden – sonst „keine">

---

## Kopierbarer Umsetzungs-Prompt

​```
Lies CLAUDE.md und das Briefing docs/briefings/NNNN-<baustein>.md. Setze es vollständig um.
Baue über die Skills <…>, rufe danach die Subagents <…> auf und behebe deren FAILs.
Branch feat/<baustein>, PR nach .github/pull_request_template.md, CI grün, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
​```
```

## Auswertungs-Checkliste (Orga-Chat)

- Alle Akzeptanzkriterien erfüllt? Wenn nein: Folge-Briefing oder Nachbesserung im selben Branch?
- Loose Ends in der Zusammenfassung → in `docs/00-masterplan.md` oder `docs/03-seiten-und-routen.md` eintragen.
- Scope-/Phasen-Drift? → zurückrollen lassen, nicht durchwinken.
- Entscheidungen, die unterwegs gefallen sind → `docs/entscheidungen.md`.
- Masterplan-Haken setzen, nächstes Briefing.
