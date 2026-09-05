# 0008 · Bewegung mit motion/react

Masterplan-Schritt: 1.7 · Branch: `feat/bewegung` · Phase: 1

Die gemeinsame Bewegungs-Infrastruktur: `lib/motion/variants.ts` (die wenigen Varianten, die die
Mocks brauchen) plus das Muster, das den **Endzustand im Server-HTML** rendert und Startzustände
nur clientseitig setzt – damit alles **ohne JavaScript** lesbar bleibt.

**Vorbedingung:** 1.6 (`feat/faq`) ist auf `main`. `feat/bewegung` zweigt vom aktuellen `main` ab.
`motion` (v13) ist installiert. Der `/motion`-Skill (aus `npx motion-ai`, Masterplan 0.10) ist **optional**:
empfohlen, aber die Varianten sind unten exakt spezifiziert – **kein Motion+**, keine Premium-Komponenten.

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Bewegungsregeln: einmalig, kein Loop/Ton/Scroll-Zwang/Layoutverschiebung; Reduced-Motion → sofort Endzustand; ohne JS lesbar/bedienbar; Tabu-Liste).
2. `docs/00-masterplan.md` – Schritt 1.7 (**exakte Varianten**: `reveal` Opacity/Translate 14 px, .55 s, Ease `[.2,.8,.3,1]`; `rise` gestaffelt; `draw` via `pathLength`/`scaleX`).
3. Skill `golfnext-design-system` (Abschnitt „Bewegung": `whileInView` `{ once:true, amount:.2 }`, `useReducedMotion()`, Server-HTML = Endzustand, Tabu-Liste) und – falls vorhanden – der `/motion`-Skill.
4. `docs/08-zustaende-und-feedback.md` nur überfliegen (Zustände sind 1.8).

## Harte Vorgaben
- **Ohne JS vollständig sichtbar:** Server-HTML rendert den **Endzustand** (opacity 1, kein Versatz). Startzustände (`initial`) werden **erst clientseitig nach Mount** gesetzt – ohne sichtbares Flackern (kein „sichtbar → versteckt → animiert"). Ohne JavaScript bleibt der Inhalt einfach stehen.
- **Reduced Motion:** `useReducedMotion()` → sofort Endzustand, keine Übergänge (`initial` = Endzustand, keine Transition). Muss per `prefers-reduced-motion` nachweisbar sein.
- **Einmalig:** `whileInView` mit `viewport={{ once:true, amount:.2 }}`. Kein Loop, kein Ton, kein Scroll-Hijacking.
- **Nur `opacity`/`transform`:** keine Layoutverschiebung; Höhen vorab reserviert. `draw` nutzt `pathLength` (Pfade) bzw. `scaleX` (Linien) mit `transform-origin` links.
- **Tabu (auch wenn Motion/der Skill sie anbietet):** Typewriter, ScrambleText, splitText (Buchstabenflug), Ticker, Carousel, Cursor-Effekte, Zähler-Effekte (außer der später gekennzeichneten Saisonrechnung auf Clubprozesse – **nicht** Teil dieses Schritts).
- **Client-Grenze klein halten:** nur die Animations-Wrapper sind `'use client'`; Inhalte werden als `children` hineingereicht (bleiben RSC).
- **Nur die drei Varianten** `reveal`, `rise`, `draw` – keine weiteren erfinden (neue nur, wenn ein Mock sie später wirklich braucht).

## Aufgaben
1. **`lib/motion/variants.ts`**: die Varianten als `motion`-`Variants`:
   - `reveal`: hidden `{opacity:0, y:14}` → visible `{opacity:1, y:0}`, `transition:{duration:.55, ease:[.2,.8,.3,1]}`.
   - `rise`: Container mit `staggerChildren` (dezent, z. B. .08 s) + Item-Variante wie `reveal` (gestaffeltes Nacheinander).
   - `draw`: Linien/Pfade `hidden {pathLength:0}`/`{scaleX:0}` → visible `{pathLength:1}`/`{scaleX:1}`, gleiche Ease/Dauer; `transform-origin` links für `scaleX`.
   - Konstanten `EASE = [.2,.8,.3,1]`, `DURATION = .55` exportieren (auch als `--gn-ease`/`--gn-dur` vorhanden – Werte konsistent halten).
2. **Wrapper-Komponenten** (`components/motion/…`, `'use client'`), die das SSR/Reduced-Motion-Muster kapseln, z. B. `Reveal`, `Rise` (+ `RiseItem`), `Draw`:
   - Rendern `children` server-seitig im Endzustand; setzen `initial` erst nach Mount (JS); `useReducedMotion()` → Endzustand ohne Übergang; `whileInView` `{once:true, amount:.2}`.
   - Ein wiederverwendbarer Hook/Helfer (z. B. `useMountedReveal`) für „erst nach Mount animieren, sonst Endzustand" – das dokumentierte Muster.
3. **`/_bausteine` erweitern:** Abschnitt „Bewegung" – je ein Beispiel für `reveal`, `rise` (mehrere gestaffelte Elemente) und `draw` (eine einfache Linie/ein Pfad). Einmalig beim Sichtbarwerden, danach Endzustand.
4. **Tests:** E2E/QA-Nachweis: (a) ohne JS sind die Inhalte des Bewegungs-Abschnitts sichtbar; (b) mit `prefers-reduced-motion:reduce` sofort Endzustand, keine Transition; (c) kein Layout-Shift.
5. **Doku-Fix (Nebenaufgabe):** In `docs/00-masterplan.md` Schritt **1.6** die Erwähnung von `aria-expanded` als Überbleibsel der Button-Ära bereinigen (FAQ nutzt `<details>/<summary>`, das den Zustand nativ liefert). Eintrag der Bewegungs-Entscheidungen in `docs/entscheidungen.md`.

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`, (optional) `/motion`.
- Subagents nach dem Bauen: `design-system-guard` (Bewegungsregeln, Tabu-Liste, nur opacity/transform, einmalig), `qa-runner` (**ohne JS sichtbar, Reduced-Motion-Endzustand, kein Layout-Shift, once**), dann `pr-reviewer`.
- `text-fidelity`/`seo-auditor` nicht nötig – im PR begründen.

## PR und Merge
- Branch `feat/bewegung` vom aktuellen `main`; Briefing liegt mit im Branch. Commits deutsch, Imperativ.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün.
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), Preview ansehen, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `lib/motion/variants.ts` enthält genau `reveal`, `rise`, `draw` mit den spezifizierten Werten (.55 s, Ease `[.2,.8,.3,1]`).
- [ ] Wrapper rendern den Endzustand im Server-HTML; ohne JS ist der Bewegungs-Abschnitt vollständig sichtbar (kein `opacity:0`-Rest).
- [ ] `prefers-reduced-motion:reduce` → sofort Endzustand, keine Übergänge; kein Flackern beim Laden mit JS.
- [ ] Animationen laufen **einmal** (`viewport.once`), nur `opacity`/`transform`, kein Layout-Shift; keine Tabu-Effekte; kein Motion+.
- [ ] Kein Overflow @390/768/1024/1180/1440; keine Konsolenfehler; axe ohne AA-Verstoß.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; `design-system-guard`, `qa-runner` ohne FAIL; Masterplan-1.6-Doku bereinigt; Eintrag in `entscheidungen.md`.

## Was du NICHT tust
- Keine Zustände/Formularfelder (1.8), keine echten Seiten/Sektionsanimationen (Phase 2), keine Saisonrechnung/Zähler (Clubprozesse, Phase 2).
- Keine weiteren Varianten erfinden; keine Tabu-Effekte; kein Motion+/Premium; keine Bewegung, die ohne JS Inhalte versteckt.
- `config/site-structure.ts`/`content/*` nicht ändern; keine neuen Design-Tokens; nicht ins Root-Layout eingreifen.

## Offene Fragen an Stefan/Fred
- `npx motion-ai` (0.10) für den `/motion`-Skill wurde noch nicht ausgeführt – für 1.7 nicht zwingend (Varianten sind spezifiziert). Falls du magst, hol es nach; sonst baut der Umsetzungs-Chat direkt mit `motion/react`. Keine blockierende Frage.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0008-bewegung.md. Voraussetzung: 1.6 ist auf main; zweige
feat/bewegung vom aktuellen main ab. Setze das Briefing vollständig um. Baue über die Skills
golfnext-design-system und golfnext-qa (optional /motion, falls verfügbar) mit motion/react (kein
Motion+). Lege lib/motion/variants.ts mit genau reveal (opacity/y:14, .55s, ease [.2,.8,.3,1]), rise
(gestaffelt) und draw (pathLength/scaleX) an. Baue Wrapper-Komponenten (use client) nach dem Muster:
Server-HTML rendert den Endzustand, initial erst nach Mount, useReducedMotion -> sofort Endzustand,
whileInView {once:true, amount:.2}, nur opacity/transform, kein Layout-Shift, keine Tabu-Effekte
(Typewriter/Ticker/Carousel/Cursor/Zähler). Ohne JS müssen die Inhalte sichtbar bleiben. Erweitere
/_bausteine um einen Abschnitt „Bewegung" (reveal/rise/draw) und ergänze QA/E2E für ohne-JS-Sichtbarkeit
und Reduced-Motion-Endzustand. Bereinige in docs/00-masterplan.md Schritt 1.6 den aria-expanded-Rest und
trag die Entscheidungen in docs/entscheidungen.md ein. Rufe danach design-system-guard und qa-runner auf
und behebe deren FAILs (text-fidelity/seo-auditor nicht nötig, im PR begründen). PR nach dem Template,
CI grün (beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
