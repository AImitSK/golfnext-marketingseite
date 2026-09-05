# 0009 · Zustände und Rückmeldungen

Masterplan-Schritt: 1.8 · Branch: `feat/zustaende` · Phase: 1

Die Feedback- und Formular-Zustände: `Alert`, `Toast`, `Empty`, `Skeleton`, Button-Ladezustand,
Formularfelder (`Input/Select/Textarea/Checkbox/Radio`) mit fünf Zuständen und `FieldMessage`, dazu
die zwei Textkataloge. Reine Bausteine – **kein** echtes Formular, **keine** Sanity-Anbindung (das ist Phase 3/4).

**Vorbedingung:** 1.7 (`feat/bewegung`) ist auf `main`. `feat/zustaende` zweigt vom aktuellen `main` ab.
Nutzt `Button` (Ladezustand wird hier ergänzt), `--gn-*`-Tokens.

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Zustände-Regeln: Skeleton statt Spinner, ein Toast nur für Cookie-Einstellungen, Alerts, Texte aus `lib/*/messages.ts`, Sie-Form, ein Satz mit Ausweg, keine Technik).
2. `docs/08-zustaende-und-feedback.md` – **verbindlich** (wann welcher Zustand, Rollen, A11y, Tonalität, Icon-Größen: Alert 18 px / Feldmeldung 14 px).
3. `docs/06-formulare-sendgrid.md` – Feldliste und Formular-Wording (nur als Quelle fürs Katalog-Wording; **kein** Formular bauen).
4. Skill `golfnext-design-system`, `golfnext-qa`.
5. Mock (Optik verbindlich, 1:1 portieren) `docs/design-system/mocks/2.5-ui-kit.html`:
   - Felder: **105–125** (`.inp` + `:focus/.err/.ok/:disabled`, `select.inp`, `textarea.inp`, `.check`, `.radio`), `.fmsg` **111–115** (`.e/.s/.h`, Icon 14 px).
   - Zustände: **184–201** (`.alert` info/ok/err mit Icon 18 px, `.toast` navy + signal-Icon, `.empty` dashed + Icon 38 px + h4 + p + Button, `.skel` + `.b1–.b4` + `@keyframes shimmer` 1.4 s).
   - Button-Ladezustand: **79–80** (`.btn.loading`), Disabled **78**.
   - Token-Werte im Mock-`:root` **16–20**: `--okbg:#EDF4EA`, `--errbg:#F8EFEC`, `--warnbg:#F7F1E3`.

## Harte Vorgaben
- **Fehlende Tokens ergänzen (Gap-Fill):** Das Token-Set hat `--gn-ok-bg`, aber **kein** `--gn-err-bg`/`--gn-warn-bg`. Diese zwei Gegenstücke **wertgleich aus dem Mock** ergänzen: `--gn-err-bg:#F8EFEC`, `--gn-warn-bg:#F7F1E3` – **synchron in allen vier Quellen** (`docs/design-system/tokens/tokens.css`, `tokens.json`, `tailwind-theme.css`, `app/globals.css`). Alert-Rahmen/Info-Flächen ohne Token (`#C9DFEA`, `#CFE3C9`, `#EAD2CC`, Info-Bg `#EDF4F8`, Info-Text `#22536E`) als **kommentierte Mock-Literale** übernehmen (keine weiteren Tokens erfinden). In `entscheidungen.md` begründen.
- **Texte nur aus Katalogen:** Alle Meldungs-/Leer-/Fehlertexte liegen in `lib/ui/messages.ts` (Empty, Fehlerseiten, Toast, 404) und `lib/forms/messages.ts` (Formular). Komponenten enthalten **keine** freien Meldungstexte. Tonalität nach docs/08: Sie-Form, ein Satz, nächster Schritt benannt, keine Technik, keine Ausrufezeichen, kein „Oops". Das sind System-Microcopys (kein Fred-Marketing) – nach den Regeln formulieren, nichts über die Tonalität hinaus erfinden.
- **Fehler nie nur über Farbe:** immer Icon **und** Text. Icon-Größen fix (Alert 18 px, FieldMessage 14 px).
- **Rollen/A11y (docs/08 §5):** `Alert err` → `role="alert"`; `Alert ok/info` und `Toast` → `role="status"`. Felder: `aria-invalid` + `aria-describedby` auf die `FieldMessage`; Pflichtfeld `required` **und** sichtbarer Stern. `Skeleton` `aria-hidden="true"` + Container `aria-busy` + `sr-only` „Inhalte werden geladen". Button-Ladezustand: `aria-busy="true"` + `sr-only` „Wird gesendet …", Breite bleibt (kein Springen), `pointer-events:none`. Fokusring sichtbar (blue, 2 px, Offset 3 px).
- **Skeleton-Shimmer** aus dem Mock (1.4 s); bei `prefers-reduced-motion:reduce` **steht der Shimmer still** (einfarbige Fläche).
- **Ein Toast** – nur Cookie-Einstellungen (Navy, unten rechts, ~3 s). Hier nur der Baustein + Demo-Trigger; die echte Verwendung folgt in Phase 5.
- **Ohne JS bedienbar/lesbar:** Formularfelder sind native `<input>/<select>/<textarea>` mit echten Labels; Zustände über Klassen/Attribute. Kein Baustein versteckt Inhalt ohne JS.
- Mock-CSS als co-lokierte Module, Tokens `--gn-*`.

## Aufgaben
1. **Tokens:** `--gn-err-bg`/`--gn-warn-bg` synchron in allen vier Quellen ergänzen.
2. **Textkataloge:** `lib/ui/messages.ts` (Empty-Zustände, 404/Fehlerseite, Toast-Text) und `lib/forms/messages.ts` (Starter: Pflichtfeld, ungültige E-Mail, Netzfehler `form.network`, Erfolg, generischer Serverfehler) – nach docs/08-Tonalität; wird in Phase 4 erweitert.
3. **`components/feedback/`**: `Alert` (`info|ok|err`, Icon 18 px, Rolle je Variante), `Toast` (navy, signal-Icon, `role=status`), `Empty` (dashed, Icon 38 px, H4, Text, Button „…"), `Skeleton` (`.b`-Bausteine, Shimmer, reduced-motion still, `aria-hidden`+`aria-busy`+`sr-only`).
4. **Button-Zustände:** `components/ui/Button` um `loading` (Spinner, `aria-busy`, `sr-only`, feste Breite) und `disabled` erweitern (Optik `.btn.loading`/`.btn.disabled`). Die Mindestanzeige 400 ms / 10-s-Timeout ist **Formularlogik (Phase 4)** – hier nur der visuelle Zustand + `loading`-Prop.
5. **`components/forms/`**: `Field` (Label + Stern + Kind + `FieldMessage`, verdrahtet `id`/`aria-describedby`/`aria-invalid`), `FieldMessage` (`e|s|h`, Icon 14 px), sowie `Input/Select/Textarea/Checkbox/Radio` mit den fünf Zuständen (default/focus/err/ok/disabled) nach `.inp`/`.check`/`.radio`.
6. **`/_bausteine` erweitern:** Abschnitt „Zustände" mit Alert ×3, Toast (Demo-Trigger), Empty, Skeleton, Button (loading/disabled), allen Feldtypen in ihren fünf Zuständen und FieldMessage `e/s/h`. Texte aus den Katalogen.
7. **`docs/entscheidungen.md`**: „1.8 — `--gn-err-bg`/`--gn-warn-bg` als fehlende Gegenstücke ergänzt (wertgleich Mock); Alert-Rahmen/Info als kommentierte Mock-Literale; Textkataloge angelegt (Phase-4-Erweiterung)."

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`.
- Subagents: `design-system-guard` (Tokens, Icon-Größen, Grün-Regel, Zeichensetzung), `qa-runner` (Rollen/A11y, `aria-invalid`/`describedby`, Fokusführung, Reduced-Motion-Skeleton, ohne-JS, Overflow @5 Breakpoints, axe), `text-fidelity` (**Katalog-Tonalität**: Sie-Form, ein Satz, Ausweg, keine Technik/Ausrufezeichen; kein Meldungstext außerhalb der `messages.ts`), dann `pr-reviewer`.
- `seo-auditor` nicht nötig (keine Routen/Links) – im PR begründen.

## PR und Merge
- Branch `feat/zustaende` vom aktuellen `main`; Briefing liegt mit im Branch. Commits deutsch, Imperativ.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün.
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), Preview ansehen, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `--gn-err-bg`/`--gn-warn-bg` in allen vier Token-Quellen wertgleich ergänzt.
- [ ] `Alert` (info/ok/err, korrekte Rollen, Icon 18 px), `Toast` (role=status), `Empty`, `Skeleton` (Shimmer, reduced-motion still, `aria-hidden`+`aria-busy`+`sr-only`) vorhanden.
- [ ] Button `loading` (feste Breite, `aria-busy`, `sr-only`) und `disabled`; kein Springen.
- [ ] Formularfelder `Input/Select/Textarea/Checkbox/Radio` mit fünf Zuständen; `Field`/`FieldMessage` (`e/s/h`, Icon 14 px) mit `aria-invalid`/`aria-describedby`; Pflichtstern + `required`.
- [ ] Alle Texte aus `lib/ui/messages.ts`/`lib/forms/messages.ts`; kein Meldungstext in Komponenten (Grep in `components/`); Tonalität nach docs/08.
- [ ] `/_bausteine` zeigt alle Zustände; kein Overflow @390/768/1024/1180/1440; ohne JS lesbar; axe ohne AA-Verstoß; keine Konsolenfehler.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; `design-system-guard`, `qa-runner`, `text-fidelity` ohne FAIL; Eintrag in `entscheidungen.md`.

## Was du NICHT tust
- Kein echtes Formular/keine Server Action/kein SendGrid (Phase 4), keine Sanity-`loading.tsx`/`error.tsx` (Phase 3), kein Consent-Toast-Einsatz (Phase 5), keine echten Seiten (Phase 2).
- Keine Mindestanzeige-/Timeout-Logik (Phase 4); keine weiteren Tokens außer den zwei Gegenstücken; keine freien Meldungstexte in Komponenten.
- `config/site-structure.ts`/`content/*` nicht ändern; nicht ins Root-Layout eingreifen; keine Tabu-Effekte.

## Offene Fragen an Stefan/Fred
- Keine. (Die zwei Token-Gegenstücke sind eine dokumentierte Gap-Füllung wertgleich zum Mock; die Katalogtexte folgen der freigegebenen docs/08-Tonalität und werden in Phase 4 vervollständigt.)

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0009-zustaende.md sowie docs/08-zustaende-und-feedback.md.
Voraussetzung: 1.7 ist auf main; zweige feat/zustaende vom aktuellen main ab. Setze das Briefing
vollständig um. Baue über die Skills golfnext-design-system und golfnext-qa. Ergänze --gn-err-bg (#F8EFEC)
und --gn-warn-bg (#F7F1E3) synchron in tokens.css, tokens.json, tailwind-theme.css und app/globals.css.
Portiere Alert/Toast/Empty/Skeleton (2.5, Z. 184–201) und die Formularfelder + .fmsg (Z. 105–125) 1:1 als
co-lokierte CSS-Module (Tokens --gn-*, Alert-Rahmen/Info als kommentierte Mock-Literale). Erweitere Button
um loading/disabled. Lege lib/ui/messages.ts und lib/forms/messages.ts an (Sie-Form, ein Satz mit Ausweg,
keine Technik, keine Ausrufezeichen) – keine freien Meldungstexte in Komponenten. Setze die A11y-Regeln aus
docs/08 §5 um (Rollen, aria-invalid/describedby, Pflichtstern+required, Skeleton aria-hidden+aria-busy+
sr-only, Button aria-busy+sr-only, Reduced-Motion-Skeleton still). Kein echtes Formular/keine Server Action.
Erweitere /_bausteine um einen Abschnitt „Zustände" (alle Bausteine in allen Zuständen). Trag die
Entscheidungen in docs/entscheidungen.md ein. Rufe danach design-system-guard, qa-runner und text-fidelity
auf und behebe deren FAILs (seo-auditor nicht nötig, im PR begründen). PR nach dem Template, CI grün
(beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
