# 0017 · Seite Wachstum & Vertrieb (/wachstum-vertrieb) · Neufassung v01

Masterplan-Schritt: 2.5 · Branch: `feat/wachstum-vertrieb` · Phase: 2

Die Wachstum-&-Vertrieb-Seite in der von Stefan freigegebenen **Neufassung v01** (Mock `3.4b`, ersetzt die
archivierte 3.4). Modernes Layout wie Plattform (3.2c), animationsreich: Hero mit Kampagnen-Cockpit,
„Drei Momente", „Vier Wege"-Slider, „Eine Kampagne, eine Woche"-Scroll-Geschichte, „Drei Regeln", „Fundament".

**Vorbedingung:** Plattform (2.3) ist auf `main` (die modernen Layout-Tokens und die Motion-Infra stehen).
`feat/wachstum-vertrieb` zweigt vom **aktuellen `main`** ab (vorher `git fetch` + `main` nachziehen).
**Dieses Briefing liegt untracked im Ordner – mit dem Branch committen.**

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Texte wortgleich; keine erfundenen Zahlen/Versprechen; Benennungen; Grün-Regel; Bewegung gelockert = jede sinnvolle Animation erlaubt, A11y-Grenzen hart).
2. Skill `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
3. **Mock (verbindlich): `docs/design-system/mocks/3.4b-wachstum-vertrieb-neufassung.html`** – Struktur, Texte, CSS, Interaktionen. Die alte `3.4-wachstum-vertrieb.html` ist **Archiv, nicht verwenden**.
4. `docs/briefings/0016-plattform.md` + die gebaute Plattform-Seite (`components/pages/plattform/`, `content/plattform.ts`) als **Referenzmuster** (Layout-Tokens, Slider, Scroll-Story, Bleed, Motion-Nutzung). Vieles ist analog.
5. `content/pakete.ts`/`content/plattform.ts` als Muster für `content/<seite>.ts`; `config/site-structure.ts` (`/wachstum-vertrieb` → hier `live`).

## Seitenstruktur (aus 3.4b)
1. **Hero** (1.75/1, Bleed rechts): Eyebrow „Wachstum & Vertrieb", H1 „Neue Golfer finden Ihren Club. Bevor sie den Nachbarclub finden.", Lead, CTAs (primär „Live-Demo ansehen / ohne Anmeldung", sekundär „Online-Erstgespräch vereinbaren"), Trust-Zeile (Budget/Freigabe/Zahlen). Rechts: Browser-Cockpit (Kampagne „läuft" + Anmeldungsliste) + Handy (Instagram-Anzeige). **Mikro-Animation:** Anzeige führt zu einlaufenden Anmeldungen.
2. **„Drei Momente"** (`.bento`, 3 Boxen): (01) „Wer sucht, soll Sie finden." (Modul Search) – Such-**Tippanimation** (`data-anim="type"`), (02) „Wer nicht sucht, soll Sie sehen." (Modul Reach) – Instagram-Feed, (03) „Wer da war, soll wiederkommen." (Module Marketing-CRM · Lifecycle) – Zeitleiste.
3. **„Vier Wege"** (`.ways`-Slider, horizontaler Scroll-Snap + Pfeile + Ziehen): 4 Karten (Schnuppergolf & Platzreife, Mitglieder gewinnen & Clubwechsel, Greenfee & Gäste, Firmenkunden) mit Mini-Website-Visual, Ziel-Zeile, Modul-Tags und „Darüber sprechen"-Link. Läuft rechts aus dem Raster. `waynote` darunter.
4. **„Eine Kampagne, eine Woche"** (`.story`, klebender Geräterahmen + 5 Schritte: Freigabe → Anzeigen live → erste Anmeldung → Kurs füllt sich → Wochenbericht). Zwei TextLinks am Ende.
5. **„Drei Regeln"** (Werbebudget): 3 Regeln (Budget bestimmen · keine Anzeige ohne Freigabe · jede Kampagne mit Zahlen) + Link „Was GolfNext selbst kostet, steht offen auf der Paketseite" → `/pakete`.
6. **„Fundament"**: aufgefächerte Landingpages + „Jede Anzeige führt auf Ihre Website. Nicht auf ein Portal." + Link „Ihre Clubwebsite ist Teil jedes Pakets" → `/pakete`.
7. **Persönlicher Abschluss (FooterClose)** „Wo soll Ihr Club als Nächstes wachsen?" + geteilter **Footer**.

## Harte Vorgaben
- **Texte als Daten, wortgleich:** alles in `content/wachstum-vertrieb.ts` (`PageContent`), 1:1 aus 3.4b (Zeichensetzung, Umbrüche, „…"). Komponenten ohne freie Texte. Sektions-CSS aus 3.4b als co-lokierte Module portieren (Tokens `--gn-*`, literale Tints kommentiert).
- **Layout-Tokens der Neufassung wiederverwenden:** die mit Plattform (0016) eingeführten Tokens (Wrap 1180, Radius 12 große Flächen, Sektion 120, H2 48). Falls sie noch seiten-scoped in `components/pages/plattform/` liegen, **auf die geteilte Ebene heben** (z. B. `app/globals.css`/Tokens) und hier wie dort nutzen – keine dritte Definition.
- **Modulstatus wird NICHT angezeigt:** der Mock-Footer zeigt Status-Punkte/Legende – überholt. Geteilter `Footer` (ohne Status). Modul-Tags auf Karten/Boxen sind bloße Namens-Labels.
- **Keine erfundenen Zahlen/Versprechen:** Beispiel-UI-Werte (Namen, Uhrzeiten, „30 km", „6 Wochen", Kanäle) sind **illustrativ 1:1 aus dem Mock** – als Beispieloberfläche, keine Zusage. **Keine** Ergebnis-/Reichweiten-/Conversion-Zahlen ergänzen (die Neufassung nennt bewusst keine). Der Wochenbericht zeigt **Kategorien** („Anmeldungen", „Kosten je Anmeldung"), keine konkreten Werte – so lassen.
- **Animationen (volle Freigabe, A11y hart):** Hero-Fill, Such-Tippanimation, Feed, Zeitleiste, „Vier Wege"-Slider, Scroll-Geschichte, Reveals, Fundament-Fächer über die Motion-Infra. Jede **einmal/dezent**; **`prefers-reduced-motion` → sofort Endzustand** (Tippanimation zeigt die fertige Suchanfrage, Anmeldungen sichtbar, Story alle Schritte aktiv); **ohne JS** alles lesbar (Slider nativ horizontal scrollbar; Scroll-Story fällt auf die gestapelte Mobile-Fassung `.stp .mob` zurück; Tippanimation zeigt den Zieltext); **kein CLS**, kein Ton, kein Scroll-Hijacking; **Bleed erzeugt keinen Seiten-Overflow**. *(Die früher tabu Tippanimation/Typewriter ist durch die Lockerung erlaubt, weil sie hier dem Inhalt dient – eine echte Suchanfrage.)*
- **Route & SEO:** `app/(site)/wachstum-vertrieb/page.tsx`; `/wachstum-vertrieb` → `status: "live"` in `config/site-structure.ts`. Genau **eine `<h1>`**; Canonical; Metadata (Briefing liefert keinen Meta-Titel → Root-Default, Feinschliff Phase 6). CTA-Ziele über `resolveCta`/`internalHref`: Live-Demo/Erstgespräch aus `.env`; „So arbeitet GolfNext"-Link → `/plattform/so-arbeitet-golfnext` (noch nicht live → `#`); Paket-/Website-Links → `/pakete` (live); „Darüber sprechen" je Weg → Erstgespräch.

## Aufgaben
1. `content/wachstum-vertrieb.ts` (`PageContent`) – alle Texte wortgleich aus 3.4b (Hero, Drei Momente, Vier Wege, Kampagnen-Schritte, Drei Regeln, Fundament, FooterClose). Sektionsdaten typisiert exportieren.
2. Seitenkomponenten unter `components/pages/wachstum-vertrieb/` – CSS aus 3.4b portiert; Slider + Scroll-Story analog zur Plattform-Umsetzung (wiederverwenden, wo möglich); je Interaktion No-JS-/Reduced-Motion-Fassung.
3. Layout-Tokens der Neufassung auf die geteilte Ebene heben (falls noch nicht) und nutzen; **Pakete/Startseite nicht retrofitten**.
4. `app/(site)/wachstum-vertrieb/page.tsx`: Sektionen + `<Footer footerClose={…}/>`, Metadata/Canonical, eine H1.
5. `config/site-structure.ts`: `/wachstum-vertrieb` → `live`. `docs/03` + `docs/entscheidungen.md` aktualisieren.

## Skills und Subagents
- Skills: `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
- Subagents: **`text-fidelity`** (wortgleich; keine erfundenen Zahlen/Versprechen; Benennungen „Firmen-Events/Turnier-News/Gastfee"), `design-system-guard` (Tokens/Grün-Regel/Radius-Skala/Icon-Größen/Bewegungsregeln), `qa-runner` (**Reduced-Motion-Endzustände inkl. Tippanimation, ohne JS lesbar inkl. Slider+Story, kein CLS, Bleed ohne Seiten-Overflow, kein Overflow @390–1440**, axe, Konsole), `seo-auditor` (eine H1, Canonical, interne Links nur `live`), dann `pr-reviewer`.

## PR und Merge
- Branch `feat/wachstum-vertrieb` vom aktuellen `main`; Briefing mit committen. Commits deutsch, in logischen Teilen.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün; neuer E2E für `/wachstum-vertrieb` (eine H1, kein Overflow inkl. Bleed/Slider, ohne-JS Slider+Story, Reduced-Motion-Endzustände).
- PR nach Template, CI grün (beide Jobs Pflicht), **Preview gegen 3.4b abgleichen (Desktop + Mobile)**, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `/wachstum-vertrieb` entspricht 3.4b in Struktur, Wortlaut und Interaktion (Screenshot-Abgleich Desktop + Mobile); Texte in `content/wachstum-vertrieb.ts`.
- [ ] Alle Animationen laufen (Hero-Fill, Tippanimation, Slider, Scroll-Story, Fächer); **Reduced-Motion → Endzustand**; **ohne JS** alles lesbar (Slider scrollbar, Story gestapelt, Tippanimation = Zieltext); kein CLS; kein Overflow @390/768/1024/1180/1440 (auch Bleed).
- [ ] Kein Modulstatus angezeigt; geteilter Footer; keine erfundenen Zahlen/Versprechen; Wochenbericht als Kategorien.
- [ ] Layout-Tokens geteilt genutzt (nicht neu definiert); Pakete/Startseite unverändert.
- [ ] `/wachstum-vertrieb` `live`; eine H1; Canonical; Header/Footer verlinken die Seite.
- [ ] Gates + CI grün; alle vier Subagents ohne FAIL; `docs/03` + `entscheidungen.md` aktualisiert.

## Was du NICHT tust
- Keine andere Seite; kein Sanity/Formular; keine erfundenen Kennzahlen/Versprechen; die alte 3.4 nicht verwenden; Modulstatus nicht anzeigen; Pakete/Startseite nicht retrofitten; keine neuen Farben.

## Offene Fragen an Stefan/Fred
- **Layout-Sprache site-weit?** Weiterhin offen **[S]** (Wrap 1180/Radius 12/…): mit dieser Seite wird sie die dritte in der modernen Sprache – Vorschlag, sie zum Standard zu erklären und Pakete/Startseite später anzugleichen. Für jetzt geteilt genutzt, Altseiten unverändert.
- Live-Demo-URL `NEXT_PUBLIC_LIVE_DEMO_URL` **[F]** (sonst Fallback `/kontakt`).

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0017-wachstum-vertrieb.md (liegt untracked im Ordner –
committe es mit deinem Branch). Voraussetzung: Plattform (2.3) ist auf main; hol den aktuellen main
(git fetch + checkout main + reset --hard origin/main) und zweige feat/wachstum-vertrieb ab. Baue die Seite
/wachstum-vertrieb aus dem gültigen Mock docs/design-system/mocks/3.4b-wachstum-vertrieb-neufassung.html
(alte 3.4 ist Archiv) über die Skills golfnext-page-from-mock, golfnext-design-system, golfnext-qa. Lege
alle Texte wortgleich in content/wachstum-vertrieb.ts an. Baue die sechs Abschnitte (Hero mit Kampagnen-
Cockpit, Drei Momente inkl. Such-Tippanimation, Vier-Wege-Slider, Kampagnen-Scroll-Story, Drei Regeln,
Fundament, FooterClose) analog zur Plattform-Umsetzung mit der Motion-Infra – jede Animation einmal/dezent,
prefers-reduced-motion -> sofort Endzustand (Tippanimation = Zieltext), OHNE JS alles lesbar (Slider nativ
scrollbar, Scroll-Story gestapelt), kein CLS, Bleed ohne Seiten-Overflow. Verwende die modernen Layout-
Tokens der Plattform-Fassung wieder (Wrap 1180, Radius 12, Sektion 120, H2 48) – ggf. auf die geteilte
Ebene heben; Pakete/Startseite NICHT retrofitten. Modulstatus NICHT anzeigen (geteilter Footer). Keine
erfundenen Zahlen/Versprechen (Wochenbericht als Kategorien). Route app/(site)/wachstum-vertrieb/page.tsx
mit Footer(footerClose), Metadata/Canonical, eine h1; setze /wachstum-vertrieb in config/site-structure.ts
auf live. Aktualisiere docs/03 und docs/entscheidungen.md. Rufe danach text-fidelity, design-system-guard,
qa-runner und seo-auditor auf und behebe deren FAILs. Neuer E2E für /wachstum-vertrieb. PR nach dem
Template, CI grün (beide Jobs Pflicht), Preview gegen 3.4b abgleichen (Desktop+Mobile), dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
