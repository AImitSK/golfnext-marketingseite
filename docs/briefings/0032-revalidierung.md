# 0032 · Revalidierung: Sanity meldet Änderungen an die Website

Masterplan-Schritt: 3.7 · Branch: `feat/revalidierung` · Phase: 3

## Kontext und Lesereihenfolge

Alle Sanity-Abfragen laufen über `sanityFetch` und geben ihre Cache-Marken mit
(`post`, `category`, `author`, `faq`, `settings`). Als Sicherheitsnetz steht
`revalidate = 3600` – bis zu einer Stunde. Am 09.09.2026 hat sich das im Alltag gezeigt:
Zwei neue FAQs zum Thema `wachstum` erschienen erst nach einem Redeploy, und es war von
außen nicht zu unterscheiden, ob etwas kaputt ist oder der Cache hält.

Dieser Schritt schließt die Lücke: Sanity meldet jede Veröffentlichung an die Website,
die Website verwirft genau die betroffenen Marken. Der Vorbau steht vollständig – es
fehlen die Route und der Webhook.

1. `CLAUDE.md`
2. `docs/00-masterplan.md`, Schritt **3.7**
3. `docs/04-sanity-content-modell.md`, Abschnitt „Caching und Revalidierung" – dort steht
   die verbindliche Fassung (Signaturprüfung, Payload-Projektion, `revalidateTag`)
4. `lib/sanity/client.ts` – `SANITY_TAGS`, `sanityFetch`, `DEFAULT_REVALIDATE`
5. `lib/sanity/queries.ts` – `QUERY_TAGS`: welche Abfrage an welchen Marken hängt
6. `app/(site)/kontakt/` bzw. die bestehende Server Action als Vorbild für serverseitige
   Fehlerbehandlung ohne Preisgabe von Interna

## Harte Vorgaben

- **Signaturprüfung ist Pflicht.** `@sanity/webhook` mit `isValidSignature` gegen
  `SANITY_REVALIDATE_SECRET`. Ohne gültige Signatur: `401`, keine Revalidierung, kein
  Hinweis darauf, was gefehlt hat. Der Secret-Wert steht bereits in Vercel (Production und
  Preview) und in `.env.local` – er wird nicht neu erzeugt und taucht in keiner Datei auf.
- **Nur `POST`.** Kein `GET`-Auslöser, auch nicht „zum Testen".
- **Node-Runtime**, keine Edge-Runtime.
- **Nichts Personenbezogenes ins Log.** Weder Payload noch Header vollständig loggen; ein
  Satz mit Typ und Marke genügt, im Fehlerfall der Status.
- Marken kommen aus `SANITY_TAGS`. Ein unbekannter `_type` führt zu einer Antwort mit
  `200` und dem Vermerk, dass nichts zu tun war – nicht zu einem Fehler, sonst wiederholt
  Sanity den Aufruf.
- Bei `_type == "post"` zusätzlich `revalidatePath('/praxis/' + slug)`, weil die
  Artikelseite über den Pfad und nicht nur über die Marke im Cache liegt.
- `revalidate = 3600` bleibt als Sicherheitsnetz stehen. Der Webhook ersetzt es nicht.
- Der Draft-Mode (`/api/draft`) gehört **nicht** hierher – er ist am 09.09.2026 nach
  „Später" verschoben.

## Aufgaben

1. **Route** `app/api/revalidate/route.ts`: `POST`, Signaturprüfung, Payload lesen
   (`{_type, slug}`), passende Marke(n) über `revalidateTag` verwerfen, bei `post`
   zusätzlich `revalidatePath`. Antwort knapp und maschinenlesbar (`{ revalidated: true,
   tag, path? }`).
2. **Abhängigkeit** `@sanity/webhook` ergänzen.
3. **Tests** (Unit, `vitest`): gültige Signatur revalidiert die erwartete Marke; falsche
   und fehlende Signatur ergeben `401` ohne Revalidierung; unbekannter `_type` ergibt
   `200` ohne Wirkung; `post` löst zusätzlich den Pfad aus. `revalidateTag` und
   `revalidatePath` werden dabei gemockt.
4. **Doku**: `docs/04-sanity-content-modell.md` auf den gebauten Stand bringen (die Route
   existiert jetzt), Eintrag in `docs/entscheidungen.md`, Masterplan 3.7 abhaken. In
   `docs/04` **kurz festhalten, was der Redakteur davon merkt**: Änderungen erscheinen
   binnen Sekunden statt binnen einer Stunde.
5. **Nicht selbst anlegen:** Den Webhook im Sanity-Projekt richtet der Orga-Chat ein
   (Filter `_type in ["post","category","author","faq","siteSettings"]`, Projektion
   `{_type, "slug": slug.current}`, Ziel `https://<production-domain>/api/revalidate`,
   Secret aus `SANITY_REVALIDATE_SECRET`). Schreibe in die PR-Beschreibung, welche
   Einstellungen der Webhook braucht, damit das ohne Rückfrage geht.

## Skills und Subagents

- Skill: `sanity-content-model`
- Subagents nach dem Bauen: `qa-runner`, danach `pr-reviewer`. `text-fidelity` und
  `design-system-guard` entfallen – dieser Schritt hat keine Oberfläche und keinen Text.

## PR und Merge

Branch `feat/revalidierung`, PR nach `.github/pull_request_template.md`, CI grün,
`pr-reviewer`. Merge macht der Orga-Chat, sobald die CI grün ist.

## Akzeptanzkriterien

- [ ] `POST /api/revalidate` mit gültiger Signatur verwirft die Marke zum gemeldeten Typ.
- [ ] Ohne oder mit falscher Signatur antwortet die Route `401` und revalidiert nichts.
- [ ] Ein unbekannter `_type` führt zu `200` ohne Wirkung, nicht zu einem Fehler.
- [ ] Bei `post` wird zusätzlich `/praxis/<slug>` revalidiert.
- [ ] Kein Secret und nichts Personenbezogenes im Log oder in einer Antwort.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` grün.
- [ ] Doku und Masterplan-Haken nachgezogen, Webhook-Einstellungen stehen im PR.

## Was du NICHT tust

- Den Webhook in Sanity anlegen oder ändern (macht der Orga-Chat).
- `SANITY_REVALIDATE_SECRET` neu erzeugen, in eine Datei schreiben oder ausgeben.
- Einen `GET`-Auslöser oder eine Debug-Route bauen.
- Den Draft-Mode oder das Presentation-Tool anfangen (steht unter „Später").
- `revalidate = 3600` entfernen.

## Offene Fragen an Stefan/Fred

- Keine.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0032-revalidierung.md. Setze es vollständig um.

Sanity soll jede Veröffentlichung an die Website melden, damit neue Inhalte in Sekunden
erscheinen statt nach bis zu einer Stunde. Der Vorbau steht: sanityFetch gibt überall die
Cache-Marken mit (post, category, author, faq, settings), SANITY_REVALIDATE_SECRET liegt in
Vercel und .env.local. Es fehlt nur die Route.

Besonders wichtig:
- Signaturprüfung ist Pflicht (@sanity/webhook, isValidSignature). Ohne gültige Signatur:
  401, keine Revalidierung, kein Hinweis worauf es lag.
- Nur POST, Node-Runtime, keine Debug- oder GET-Route.
- Nichts Personenbezogenes und kein Secret ins Log oder in eine Antwort.
- Unbekannter _type: 200 ohne Wirkung, kein Fehler – sonst wiederholt Sanity den Aufruf.
- Bei _type == "post" zusätzlich revalidatePath('/praxis/' + slug).
- revalidate = 3600 bleibt als Sicherheitsnetz stehen.
- Den Webhook in Sanity legst du NICHT an. Schreib die nötigen Einstellungen in die
  PR-Beschreibung, dann richtet der Orga-Chat ihn ein.
- Draft-Mode und Presentation-Tool gehören nicht dazu (stehen unter „Später").

Tests mit vitest: gültige Signatur revalidiert die erwartete Marke, falsche und fehlende
Signatur ergeben 401, unbekannter Typ bleibt wirkungslos, post löst zusätzlich den Pfad aus.
revalidateTag und revalidatePath dabei mocken.

Baue über den Skill sanity-content-model, rufe danach qa-runner auf und behebe dessen FAILs.
text-fidelity und design-system-guard entfallen – kein Text, keine Oberfläche.

Tempo: keine Vollsuite während der Iteration, die betroffenen Unit-Tests genügen; die
Vollsuite genau einmal am Ende. Nicht auf die CI warten – Stand melden, sobald lokal grün.

Branch feat/revalidierung, PR nach .github/pull_request_template.md, CI grün, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
