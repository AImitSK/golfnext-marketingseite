# 0015 · Die Seite zum Leben erwecken (Bewegung & Interaktion)

Masterplan-Bezug: Ausbau von 1.7 (Design-System-Ebene) + Signature-Animationen der Live-Seiten · Branch: `feat/motion-interaktion` · Phase: 2

Stefan: Die Umsetzung wirkt **statischer als die Mocks** – für einen Technologieführer (Golf + Internet) zu
wenig. **Freigabe: jede Animation ist erlaubt, wenn sie Sinn ergibt** (Zweck vor Effekt). Ziel: die Seite
modern und lebendig machen – Hover, spürbare Scroll-Reveals, Signature-Animationen der Hero-/Journey-
Strecken, Kennzahl-Hochzähler. Wirkt auf der geteilten Ebene **und** auf den beiden Live-Seiten
(`/pakete`, `/`).

**Vorbedingung:** alle Vorarbeiten sind auf `main` (Header/Footer-Fix, gelockerte Bewegungsregeln, beide
Live-Seiten). Zweigt vom **aktuellen `main`** ab.

## Nicht verhandelbar (Barrierefreiheit, Recht, Performance – bleibt hart)
- `prefers-reduced-motion: reduce` → **sofort der Endzustand**, keine Übergänge, keine Bewegung.
- **Ohne JavaScript** ist alles sichtbar/bedienbar; Server-HTML rendert den (fertigen) Endzustand.
- **Keine Layoutverschiebung / kein CLS:** nur `opacity`/`transform`/`pathLength`, Höhen vorab reservieren.
- **Kein automatischer Ton, kein Scroll-Hijacking.** Kennzahlen/Texte/Preise werden nie durch Bewegung verdeckt.
- Grün-Regel bleibt (grüne Fläche + Navy-Text; kein grüner Text auf hell).

Innerhalb dieser Grenzen: **alles erlaubt, was dem Inhalt dient** – auch dezente kontinuierliche/Ambient-
Bewegung, bewegte Verbindungslinien, wandernde Elemente, Hochzähler. Kein Selbstzweck-Kitsch, aber ruhig zu
sein ist keine Vorgabe mehr.

## Was gebaut wird

### 1 · Hover-/Micro-Interaktionen (geteilte Ebene, wirkt überall)
- **Buttons:** jede Variante mit ihrem Hover (`.btn.cta`→`#00CE04`, `.btn.primary`→`#095B7C`, `.btn.ghost`→Navy-Fläche, `.btn.light`), weiche `background/color/border`-Transition. (`hbtn` ist bereits erledigt – nur prüfen, nicht verschlechtern.)
- **Karten-Hover-Lift** (Muster `.pkc:hover`): `border-color`→Navy, weicher Schatten, `transform: translateY(-2px)`, ~.2 s – als **wiederverwendbare Konvention** und auf die vorhandenen Karten anwenden (Pakete-Karten, Vorteils-/Clubprozess-Karten der Startseite).
- **TextLink** Pfeil `translateX(3px)`; **Chip** und andere interaktive Flächen wie im Mock. Fokusring bleibt sichtbar.

### 2 · Scroll-Reveals spürbar & konsistent (`lib/motion`)
- `reveal`/`rise` **deutlich wahrnehmbar** einstellen (großzügigerer Translate, klare Staffelung, verlässlicher `amount`); Standard weiterhin **einmal** + Endzustand, Reduced-Motion sofort sichtbar.
- Konventionen kurz dokumentieren (`docs/design-system/README.md`): was reveal bekommt, Hover-Standard Karten/Buttons/Links.

### 3 · Signature-Animationen der Live-Seiten (jetzt voll erlaubt)
- **Startseite Hero-Strecke:** Verbindungslinie baut sich beim Reinscrollen sichtbar auf (`Draw`), die Stationen (Kampagne → Anfrage → Marketing-CRM → E-Mail-Sequenz → eingebundener Ratgeber → Buchung) blenden gestaffelt ein und bleiben stehen.
- **Startseite Journey:** die in 0013 weggelassene Choreografie **wieder aufbauen** – die Linie zieht sich durch die vier Schritte, ein **Kontakt-Element wandert einmal** nachvollziehbar durch die vier Phasen (danach Endzustand); die Bänder Entlasten/Verbinden bleiben sichtbar und reagieren dezent. Einmalig, kein Loop-Zwang; ohne JS steht die komplette Journey statisch da.
- **Praxis-Kennzahlen: Hochzähler** – die bestätigten Werte (rund 1.600, rund 600, 68 %, 72 %) zählen **einmal** beim Sichtbarwerden hoch, bleiben danach lesbar; Reduced-Motion zeigt sofort den Endwert; Werte/Beschriftung **wortgleich**, nichts erfinden.
- **Pakete Hero-„Rückgrat":** darf lebendiger werden (z. B. Linie/Knoten bauen sich beim Reinscrollen auf) – einmalig, Endzustand bleibt. **Keine** Preis-/Textänderung.

## Ausdrücklich nicht
- **Inhalte/Texte/Preise nicht ändern** (`content/*`, Preislogik, Benennungen); keine neuen Design-Tokens (Bewegungs-Tokens `--gn-ease`/`--gn-dur` nutzen); Mocks/Rechtstexte nicht anfassen.
- Header/Footer-Layout und `hbtn`-Hover nicht umbauen (sind erledigt) – nur nicht verschlechtern.
- Nichts, das **ohne JS Inhalte versteckt** oder bei Reduced-Motion weiterläuft; kein CLS, kein Ton, kein Scroll-Zwang.

## Skills und Subagents
- Skills: `golfnext-design-system`, `golfnext-qa`, optional `/motion`.
- Subagents: `design-system-guard` (Grün-Regel, Tokens, Bewegungsregeln), `qa-runner` (**Reduced-Motion sofort Endzustand, kein Layout-Shift, ohne JS lesbar, kein Overflow @390–1440**, axe, Konsole), `text-fidelity` (nur falls Kennzahl-Beschriftung berührt – wortgleich), dann `pr-reviewer`.

## PR und Merge
- Branch `feat/motion-interaktion` vom aktuellen `main`; Briefing liegt mit im Branch. Commits in logischen Teilen (geteilte Ebene → Pakete → Startseite).
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün; QA/E2E erweitern (Reduced-Motion-Endzustand, kein Layout-Shift, Hover vorhanden, Hochzähler zeigt bei Reduced-Motion den Endwert).
- PR nach Template, CI grün (beide Jobs Pflicht), **Preview ansehen (fühlt es sich jetzt lebendig an?)**, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] Buttons/Karten/Links haben spürbare Hover-Zustände; Karten-Hover-Lift als wiederverwendbare Konvention.
- [ ] Scroll-Reveals deutlich wahrnehmbar, einmal, Endzustand bleibt; konsistent über die Sektionen.
- [ ] Startseite: Hero-Strecke + Journey-Choreografie (wandernder Kontakt, einmal) laufen; Praxis-Kennzahlen zählen einmal hoch.
- [ ] `prefers-reduced-motion` → sofort Endzustand (inkl. Hochzähler = Endwert); **kein Layout-Shift**; ohne JS alles sichtbar; kein Overflow @390/768/1024/1180/1440; axe ohne AA-Verstoß.
- [ ] Keine Text-/Preisänderung; `pnpm typecheck/lint/test/build` + CI grün; Subagents ohne FAIL; Bewegungs-Standard dokumentiert.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0015-motion-interaktion.md. Zweige feat/motion-interaktion
vom aktuellen main ab. Ziel: die Seite modern und lebendig machen – jede Animation ist erlaubt, wenn sie
Sinn ergibt. HART bleibt nur: prefers-reduced-motion -> sofort Endzustand; ohne JS alles sichtbar; kein
Layout-Shift/CLS (nur opacity/transform/pathLength, Höhen reservieren); kein Ton; kein Scroll-Hijacking.
Baue über golfnext-design-system und golfnext-qa (optional /motion).
1) Hover geteilt: alle Button-Varianten, Karten-Hover-Lift (border navy + Schatten + translateY(-2px)) als
   wiederverwendbare Konvention, TextLink-Pfeil +3px; hbtn nur prüfen, nicht verschlechtern.
2) lib/motion: reveal/rise spürbar auslösen (großzügiger Translate, klarer Stagger, verlässlicher amount),
   weiterhin einmal + Reduced-Motion-Endzustand. Standard in docs/design-system/README.md dokumentieren.
3) Signature-Animationen der Live-Seiten: Startseite Hero-Strecke baut sich auf (Draw + gestaffeltes Rise);
   Journey-Choreografie wieder aufbauen (Linie zieht durch vier Schritte, ein Kontakt-Element wandert EINMAL
   durch die Phasen, danach Endzustand; ohne JS steht die Journey statisch); Praxis-Kennzahlen zählen EINMAL
   hoch (Reduced-Motion = Endwert, Werte wortgleich). Pakete-Rückgrat darf lebendiger werden. KEINE Text-/
   Preisänderung.
Rufe danach design-system-guard, qa-runner (Reduced-Motion, kein Layout-Shift, ohne JS, Overflow) und - falls
Kennzahl-Beschriftung berührt - text-fidelity auf und behebe deren FAILs. PR nach dem Template, CI grün
(beide Jobs Pflicht), Preview ansehen, dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
