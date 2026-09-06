# 0018 · Seite Clubprozesse (/clubprozesse) · Neufassung v01

Masterplan-Schritt: 2.6 · Branch: `feat/clubprozesse` · Phase: 2

Die Clubprozesse-Seite in der von Stefan freigegebenen **Neufassung v01** (Mock `3.5b`, ersetzt die
archivierte 3.5). Modernes Layout wie Plattform/Wachstum: Hero mit Sonntags-Log, „Drei Dinge",
„Turnier-News", „Captains App", „Was bleibt".

**Vorbedingung:** Wachstum & Vertrieb (2.5) ist auf `main` (moderne Layout-Tokens + Motion-Infra + Slider/
Story-Muster stehen). Vorher `git fetch` + `main` nachziehen, dann `feat/clubprozesse` abzweigen.
**Dieses Briefing liegt untracked im Ordner – mit dem Branch committen.**

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Texte wortgleich; keine erfundenen Zahlen/Versprechen/Funktionen; Benennungen; Grün-Regel; Bewegung gelockert; A11y-Grenzen hart).
2. Skill `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
3. **Mock (verbindlich): `docs/design-system/mocks/3.5b-clubprozesse-neufassung.html`** – Struktur, Texte, CSS, Interaktionen. Die alte `3.5-clubprozesse.html` ist **Archiv, nicht verwenden**.
4. Die gebauten Seiten `components/pages/plattform/` und `components/pages/wachstum-vertrieb/` als **Referenzmuster** (Layout-Tokens, Slider/Scroll-Story/Bleed, Motion-Nutzung, No-JS-/Reduced-Motion-Fassungen). Vieles ist analog.
5. `content/plattform.ts`/`content/wachstum-vertrieb.ts` als Muster; `config/site-structure.ts` (`/clubprozesse` → hier `live`).

## Seitenstruktur (aus 3.5b)
1. **Hero** (1.75/1, Bleed): Eyebrow „Clubprozesse", H1 „Mehr Clubleben. Weniger Arbeit im Clubbüro.", Lead, CTAs (primär „Live-Demo ansehen / ohne Anmeldung", sekundär „Online-Erstgespräch vereinbaren"), Trust-Zeile (Kontrolle/Persönliches/Clubverwaltung). Rechts: Browser-Demo (Website mit Platzstatus + „Aktuell im Club"/News) + Handy (Sonntags-Log „5 Vorgänge · 0 Anrufe im Büro"). Mikro-Animation: Log/Platzstatus füllt sich.
2. **„Drei Dinge, die das Clubbüro ab morgen nicht mehr macht."** (`.bento`, 3 Boxen): (01) Concierge (Chat), (02) Platzstatus (Handy-Toggle → Website in derselben Sekunde), (03) Gastfee (Online-Zahlung + Bestätigung).
3. **„Turnier-News"**: „Der letzte Putt fällt. Noch am selben Abend ist der Bericht online." – Ablauf-Track: (01) Ergebnisliste (PDF) hochladen → erkannte Zeilen, (02) drei Angaben + Tonalität → „Bericht erstellen", danach drei Ausgaben (Website · Facebook · Instagram). `trackline`: nichts ohne Freigabe.
4. **„Captains App"**: „Jede Mannschaft sichtbar. Ohne Umweg über das Clubbüro." – Handy (Captain trägt Spieltag ein) → Mannschaftsseite auf der Website. `capnote`.
5. **„Was bleibt"** (`.split2`): „Digital, wo es entlastet. Persönlich, wo es zählt." – zwei Spalten „Läuft von allein" (Module) ↔ „Bleibt beim Clubteam".
6. **Persönlicher Abschluss (FooterClose)** „Wo verliert Ihr Clubbüro heute die meiste Zeit?" + geteilter **Footer**.

## Harte Vorgaben
- **Modulstatus NICHT anzeigen (Entscheidung Stefan):** Die Status-Badges des Mocks (`.stat pilot/dev` „Pilot/Im Einsatz/In Entwicklung" an den Abschnitten in 2/3/4), die `.m dev`-Tags in „Was bleibt" und die Zeile **„Stand je Modul wie im Footer: Im Einsatz · Pilot · In Entwicklung"** werden **weggelassen**. Module werden als verfügbar dargestellt (konsistent mit Navi/Footer). **Kein** Ersatzstatus. Modul-Namen (`Modul Concierge` etc.) bleiben als Labels.
- **Ausnahme Praxisbeispiel:** Die Zeile „Im Pilot des Golfclubs Rehburg-Loccum kamen 68 % der Fragen außerhalb der Bürozeiten." **bleibt wortgleich** (freigegebenes Praxisbeispiel, wie auf der Startseite) – das ist ein Fallbeispiel, kein Modul-Status.
- **Texte als Daten, wortgleich:** alles in `content/clubprozesse.ts` (`PageContent`), 1:1 aus 3.5b (Zeichensetzung, „…", Umbrüche). Komponenten ohne freie Texte. Sektions-CSS aus 3.5b als co-lokierte Module portieren (Tokens `--gn-*`, literale Tints kommentiert).
- **Keine erfundenen Zahlen/Versprechen/Funktionen:** Beispiel-UI-Werte (Namen, Uhrzeiten, „65 €", „5 : 3", „38 Pkt.", Ortsnamen) sind **illustrativ 1:1 aus dem Mock** – als Beispieloberfläche, keine Zusage. Keine Ergebnis-/Reichweiten-Zahlen ergänzen. **Benennungen:** Turnier-News, Firmen-Events, Gastfee, Captains App (nie „Club News"/„Greenfee" im Clubprozess-Kontext – „Greenfee" nur wo es um den Gast-/Preisbegriff geht, wie im Mock „Greenfee 18 Loch 65 €").
- **Layout-Tokens der Neufassung wiederverwenden** (geteilte Ebene aus Plattform/Wachstum): Wrap 1180, Radius 12, Sektion 120, H2 48. Keine erneute Definition. **Pakete/Startseite nicht retrofitten.**
- **Animationen (volle Freigabe, A11y hart):** Hero-Log/Platzstatus, Concierge-Chat, Platzstatus-Toggle→Website, Gastfee-Zahlung, Turnier-News-Track (PDF→Ausgaben), Captains-App-Demo, Reveals – über die Motion-Infra. Jede **einmal/dezent**; **`prefers-reduced-motion` → sofort Endzustand**; **ohne JS** alles lesbar; **kein CLS**, kein Ton, kein Scroll-Hijacking; **Bleed erzeugt keinen Seiten-Overflow**. (Keine Saisonrechnung/Zähler nötig – die Neufassung hat keine.)
- **Route & SEO:** `app/(site)/clubprozesse/page.tsx`; `/clubprozesse` → `status: "live"`. Genau **eine `<h1>`**; Canonical; Metadata (Briefing liefert keinen → Root-Default, Phase 6). CTA-Ziele über `resolveCta`/`internalHref`: Live-Demo/Erstgespräch aus `.env`; interne Links nur auf `live`-Routen, sonst `#`.

## Aufgaben
1. `content/clubprozesse.ts` (`PageContent`) – alle Texte wortgleich aus 3.5b (Hero, Drei Dinge, Turnier-News, Captains App, Was bleibt, FooterClose) **ohne** die Status-Badges/-Zeile. Sektionsdaten typisiert exportieren.
2. Seitenkomponenten unter `components/pages/clubprozesse/` – CSS aus 3.5b portiert; Interaktionen analog zu Plattform/Wachstum (wiederverwenden, wo möglich); je Interaktion No-JS-/Reduced-Motion-Fassung.
3. `app/(site)/clubprozesse/page.tsx`: Sektionen + `<Footer footerClose={…}/>`, Metadata/Canonical, eine H1.
4. `config/site-structure.ts`: `/clubprozesse` → `live`. `docs/03` + `docs/entscheidungen.md` aktualisieren (u. a. Modulstatus auf der Seite weggelassen, konsistent mit 0014).

## Skills und Subagents
- Skills: `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
- Subagents: **`text-fidelity`** (wortgleich; keine erfundenen Zahlen/Funktionen; Benennungen; „68 %" korrekt; keine Status-Badges), `design-system-guard` (Tokens/Grün-Regel/Icon-Größen/Bewegungsregeln), `qa-runner` (**Reduced-Motion-Endzustände, ohne JS lesbar, kein CLS, Bleed ohne Overflow, kein Overflow @390–1440**, axe, Konsole), `seo-auditor` (eine H1, Canonical, interne Links nur `live`), dann `pr-reviewer`.

## PR und Merge
- Branch `feat/clubprozesse` vom aktuellen `main`; Briefing mit committen. Commits deutsch, in logischen Teilen.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün; neuer E2E für `/clubprozesse`.
- PR nach Template, CI grün (beide Jobs Pflicht), **Preview gegen 3.5b abgleichen (Desktop + Mobile)**, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `/clubprozesse` entspricht 3.5b in Struktur, Wortlaut und Interaktion (Screenshot-Abgleich) – **ohne** Modulstatus-Badges/-Zeile; Texte in `content/clubprozesse.ts`.
- [ ] „68 % Rehburg-Loccum"-Zeile wortgleich erhalten; keine sonstigen erfundenen Zahlen/Funktionen; Module ohne Statuslabel als verfügbar dargestellt.
- [ ] Alle Animationen laufen; **Reduced-Motion → Endzustand**; **ohne JS** alles lesbar; kein CLS; kein Overflow @390/768/1024/1180/1440 (auch Bleed).
- [ ] Layout-Tokens geteilt genutzt; Pakete/Startseite unverändert; `/clubprozesse` `live`; eine H1; Canonical.
- [ ] Gates + CI grün; alle vier Subagents ohne FAIL; `docs/03` + `entscheidungen.md` aktualisiert.

## Was du NICHT tust
- Keine Modulstatus-Badges/-Legende auf der Seite; die alte 3.5 nicht verwenden; keine erfundenen Kennzahlen/Funktionen; keine andere Seite; Pakete/Startseite nicht retrofitten; keine neuen Farben.

## Offene Fragen an Stefan/Fred
- Keine. **Alle Module (auch Captains App, Firmen-Events) gelten als fertig/verfügbar** – kein „Pilot", kein „In Entwicklung", kein „kommt bald", nirgends (Entscheidung Stefan, endgültig).
- Live-Demo-URL `NEXT_PUBLIC_LIVE_DEMO_URL` **[F]** (sonst Fallback `/kontakt`).

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0018-clubprozesse.md (liegt untracked im Ordner – committe
es mit deinem Branch). Voraussetzung: Wachstum & Vertrieb (2.5) ist auf main; hol den aktuellen main
(git fetch + checkout main + reset --hard origin/main) und zweige feat/clubprozesse ab. Baue die Seite
/clubprozesse aus dem gültigen Mock docs/design-system/mocks/3.5b-clubprozesse-neufassung.html (alte 3.5
ist Archiv) über die Skills golfnext-page-from-mock, golfnext-design-system, golfnext-qa. Lege alle Texte
wortgleich in content/clubprozesse.ts an. Baue die Abschnitte (Hero mit Sonntags-Log, Drei Dinge
[Concierge/Platzstatus/Gastfee], Turnier-News-Track, Captains App, Was bleibt, FooterClose) analog zu
Plattform/Wachstum mit der Motion-Infra – jede Animation einmal/dezent, prefers-reduced-motion -> sofort
Endzustand, OHNE JS alles lesbar, kein CLS, Bleed ohne Seiten-Overflow. WICHTIG: Modulstatus NICHT anzeigen
(keine Pilot/Im-Einsatz/In-Entwicklung-Badges an den Abschnitten, keine .m-dev-Tags, nicht die Zeile
„Stand je Modul wie im Footer") – Module als verfügbar darstellen; ABER die Zeile „Im Pilot des Golfclubs
Rehburg-Loccum kamen 68 % …" bleibt wortgleich. Keine erfundenen Zahlen/Funktionen (UI-Beispielwerte
illustrativ aus dem Mock). Verwende die geteilten modernen Layout-Tokens wieder (Wrap 1180, Radius 12,
Sektion 120, H2 48); Pakete/Startseite nicht retrofitten. Modulstatus im geteilten Footer bleibt aus.
Route app/(site)/clubprozesse/page.tsx mit Footer(footerClose), Metadata/Canonical, eine h1; setze
/clubprozesse in config/site-structure.ts auf live. Aktualisiere docs/03 und docs/entscheidungen.md. Rufe
danach text-fidelity, design-system-guard, qa-runner und seo-auditor auf und behebe deren FAILs. Neuer E2E
für /clubprozesse. PR nach dem Template, CI grün (beide Jobs Pflicht), Preview gegen 3.5b abgleichen
(Desktop+Mobile), dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
