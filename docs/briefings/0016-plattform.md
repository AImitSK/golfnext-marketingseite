# 0016 · Seite Plattform (/plattform) · Neufassung v02

Masterplan-Schritt: 2.3 · Branch: `feat/plattform` · Phase: 2

Die Plattform-Seite in der von Stefan freigegebenen **Neufassung v02** – deutlich moderner als die alte 3.2:
Hero mit Bleed-Demo, Bento „Drei Dinge, die sich ändern", Rollen-Slider, Scroll-Geschichte, „Klare Grenze",
„Vier Zusagen". Animationsreich – die volle Motion-Freigabe (jede sinnvolle Animation) gilt, die harten
A11y-/Performance-Grenzen bleiben.

**Vorbedingung:** Der Motion-Schritt (`feat/motion-interaktion`, 0015) ist auf `main` (Hover/Reveal-
Konventionen + Motion-Infra stehen). `feat/plattform` zweigt vom **aktuellen `main`** ab. Diese Seite legt
das `feat/plattform-mock`-Paket (Mock + Doku-Referenzen) voraus (bereits gemergt).

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Texte wortgleich; keine erfundenen Zahlen/Versprechen; Benennungen; Grün-Regel; gelockerte Bewegungsregeln = jede sinnvolle Animation erlaubt, A11y-Grenzen hart).
2. Skill `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
3. **Mock (verbindlich): `docs/design-system/mocks/3.2c-plattform-neufassung.html`** – Struktur, Texte, CSS, Interaktionen. Die alte `3.2-plattform.html` ist **Archiv, nicht verwenden**.
4. `docs/design-system/README.md` (Hero-Standard 1.75/1; Layout-Erweiterungen der Neufassung), `docs/entscheidungen.md` (Motion-Lockerung, Modulstatus entfällt), `config/site-structure.ts` (`/plattform` → hier `live`).
5. `content/pakete.ts` / `content/startseite.ts` als Muster für `content/<seite>.ts`.

## Seitenstruktur (aus 3.2c)
1. **Hero** (1.75/1, Visual läuft rechts aus dem Raster): Eyebrow „Die GolfNext-Plattform", H1 „Ihre Website ist ein Schaufenster. Wir machen ein System daraus.", Lead, CTAs (primär „Live-Demo ansehen / ohne Anmeldung", sekundär „Online-Erstgespräch vereinbaren"), Trust-Zeile. Rechts: Browser-Demo (Club-Website mit Platzstatus) + Handy (Greenkeeper-Toggle). **Mikro-Animation:** Greenkeeper stellt „Platz bespielbar" → Website-Platzstatus springt auf grün/„Platz bespielbar".
2. **Bento „Drei Dinge, die sich ändern"**: 3 Boxen mit je einer Mikro-Animation – (01) Kontakte laufen gestaffelt in die CRM-Liste, (02) Concierge-Chat erscheint Blase für Blase, (03) fünf Werkzeuge fahren zu „GolfNext" zusammen.
3. **Rollen-Slider „Für jede Rolle im Club"**: horizontaler Scroll-Snap-Slider, 6 Karten (Vorstand, Clubmanager, Sekretariat, Greenkeeper, Golflehrer, Captain) mit Frage + Text + Modul-Tags; Pfeil-Buttons + Maus-Ziehen; läuft rechts aus dem Raster.
4. **Scroll-Geschichte „Ein Klick bei Instagram. Vier Wochen später ein Mitglied."**: klebender Geräterahmen rechts, 5 Schritte links (Anzeige → Anmeldung → Vor dem Kurs → Nach dem Kurs → Der nächste Schritt); der aktive Schritt steuert das Bild im Rahmen. Zwei TextLinks am Ende.
5. **„Klare Grenze"**: „Ihre Clubverwaltung bleibt, wo sie ist." – Fließtext + Split GolfNext ↔ Clubverwaltung.
6. **„Vier Zusagen"**: vier Karten (Domain/Daten, Alles mitnehmen, Faire Laufzeiten, Ein Mensch am Telefon) + `vowline`.
7. **Persönlicher Abschluss (FooterClose)** + geteilter **Footer**.

## Harte Vorgaben
- **Texte als Daten, wortgleich:** alles in `content/plattform.ts` (`PageContent`), 1:1 aus 3.2c (Zeichensetzung, Umbrüche). Komponenten ohne freie Texte. Sektions-CSS aus 3.2c als co-lokierte Module portieren (Tokens `--gn-*`, literale Tints kommentiert).
- **Modulstatus wird NICHT angezeigt:** Der Mock-Footer zeigt Status-Punkte/Legende – das ist überholt (Entscheidung 06.09.). Die Seite nutzt den **geteilten `Footer`** (ohne Status). Die Modul-Tags auf den Rollenkarten sind bloße Namens-Labels (kein Status).
- **Keine erfundenen Zahlen/Versprechen:** Beispiel-UI-Werte (Greenfee „65 €", Schnuppergolf „39 €", Chat-Dialoge, Namen) sind **illustrativ 1:1 aus dem Mock** – als Beispiel-Oberfläche, keine Zusage. Die einzige echte Kennzahl ist „**68 % der Fragen außerhalb der Bürozeiten**" (Pilot Rehburg-Loccum, wie auf der Startseite) – wortgleich, als Pilot gekennzeichnet. Keine Ergebnis-/Reichweiten-Versprechen ergänzen.
- **Illustrative Oberflächen** (Browser-Demo, CRM-Liste, Chat, Geräterahmen) sind **schematische Darstellungen** des Systems (wie die System-Grafiken auf Start/Pakete), **keine** foto-realen Screenshots – so bauen, dass sie als Illustration lesbar sind, nicht als echter Screenshot. Wo ein echter Produkt-Screenshot gemeint wäre, `Shot`-Platzhalter (auf dieser Seite nicht nötig).
- **Animationen (volle Freigabe, A11y hart):** Hero-Toggle, Bento-Mikroanimationen, Slider, Scroll-Geschichte über die Motion-Infra (1.7 + 0015). **Jede** läuft einmal/dezent; **`prefers-reduced-motion` → sofort Endzustand** (Toggle „on", CRM-Zeilen sichtbar, Chat komplett, Tools zusammengeführt, Story alle Schritte aktiv); **ohne JS** ist alles lesbar (Slider nativ horizontal scrollbar; Scroll-Geschichte fällt auf die gestapelte Mobile-Variante `.stp .mob` zurück – jeder Schritt zeigt seinen Geräterahmen inline); **kein CLS**, kein Ton, kein Scroll-Hijacking (Sticky ist ok).
- **Slider-A11y:** per Tastatur bedienbar (Pfeil-Buttons fokussierbar, Karten erreichbar); `aria-label` an den Blätter-Buttons; ohne JS scrollbar.
- **Layout-Erweiterungen der Neufassung** (Wrap 1180, Radius 12 px für große Flächen, Sektionen 120 px, H2 bis 48 px): als **benannte, wiederverwendbare Ergänzungen** einführen (z. B. Tokens `--gn-wrap-wide: 1180px`, `--gn-radius-lg: 12px`, großzügige Sektions-/H2-Skala) und **nur auf dieser Seite** anwenden. **Pakete/Startseite NICHT retrofitten.** Ob das site-weit Standard wird, entscheidet Stefan (siehe Offene Fragen).
- **Hero-Standard 1.75/1** (textdominant) einhalten; genau **eine `<h1>`**; Canonical; `/plattform` → `status: "live"` in `config/site-structure.ts` (aktiviert Header-/Footer-Links). CTA-Ziele über `resolveCta`/`internalHref` (Live-Demo/Erstgespräch aus `.env`; „So arbeitet GolfNext"-Link → `/plattform/so-arbeitet-golfnext`, noch nicht live → `#`).

## Aufgaben
1. `content/plattform.ts` (`PageContent`) – alle Texte wortgleich aus 3.2c (Hero, Bento, Rollen, Scroll-Schritte, Grenze, Zusagen, FooterClose). Sektionsdaten typisiert exportieren (Muster `content/pakete.ts`).
2. Seitenkomponenten unter `components/pages/plattform/` (Hero+Demo, Bento, RollenSlider [Client], ScrollStory [Client], Grenze, Zusagen) – CSS aus 3.2c portiert; Animationen über die Motion-Infra; je Interaktion eine No-JS-/Reduced-Motion-Fassung.
3. Layout-Tokens der Neufassung ergänzen (wide-wrap, radius-lg, Sektions-/H2-Skala) – dokumentiert, seiten-scoped angewandt.
4. `app/(site)/plattform/page.tsx`: Sektionen + `<Footer footerClose={…}/>`, Metadata/Canonical, eine H1.
5. `config/site-structure.ts`: `/plattform` → `live`. `docs/03` (Status) + `docs/entscheidungen.md` (Plattform-Neufassung, Layout-Tokens, Illustrations-/Zahlen-Entscheidung) aktualisieren.

## Skills und Subagents
- Skills: `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
- Subagents: **`text-fidelity`** (wortgleich; keine erfundenen Zahlen; „68 %" korrekt/Pilot; Benennungen), `design-system-guard` (Tokens/Grün-Regel/Radius-Skala/Icon-Größen/Bewegungsregeln), `qa-runner` (**Reduced-Motion-Endzustände, ohne JS lesbar inkl. Slider+Story, kein CLS, kein Overflow @390–1440, Bleed erzeugt keinen horizontalen Seiten-Overflow**, axe, Konsole), `seo-auditor` (eine H1, Canonical, interne Links nur `live`), dann `pr-reviewer`.

## PR und Merge
- Branch `feat/plattform` vom aktuellen `main`; Briefing liegt mit im Branch. Commits deutsch, in logischen Teilen.
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün; neuer E2E für `/plattform` (eine H1, kein Overflow inkl. Bleed/Slider, ohne-JS Slider+Story, Reduced-Motion-Endzustände).
- PR nach Template, CI grün (beide Jobs Pflicht), **Preview gegen 3.2c abgleichen (Desktop + Mobile)**, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `/plattform` entspricht 3.2c in Struktur, Wortlaut und Interaktion (Screenshot-Abgleich Desktop + Mobile); Texte in `content/plattform.ts`.
- [ ] Alle Animationen laufen (Hero-Toggle, Bento, Slider, Scroll-Story); **Reduced-Motion → Endzustand**; **ohne JS** alles lesbar (Slider scrollbar, Story gestapelt); kein CLS; kein Overflow @390/768/1024/1180/1440 (auch das Bleed-Visual erzeugt keinen Seiten-Overflow).
- [ ] Kein Modulstatus angezeigt; geteilter Footer; nur echte Kennzahl „68 %" (Pilot), sonst illustrative Mock-Werte; keine erfundenen Versprechen.
- [ ] Layout-Tokens (wide-wrap 1180, radius-lg 12, Sektion 120, H2 48) ergänzt und dokumentiert; Pakete/Startseite unverändert.
- [ ] `/plattform` `live`; eine H1; Canonical; Header/Footer verlinken die Seite.
- [ ] Gates + CI grün; `text-fidelity`/`design-system-guard`/`qa-runner`/`seo-auditor` ohne FAIL; `docs/03` + `entscheidungen.md` aktualisiert.

## Was du NICHT tust
- Keine andere Seite; `/plattform/so-arbeitet-golfnext` (2.4) ist ein eigener Schritt; kein Sanity/Formular.
- Modulstatus nicht anzeigen; die alte 3.2 nicht verwenden; Pakete/Startseite-Layout nicht retrofitten; keine erfundenen Zahlen/Versprechen; keine neuen Farben.

## Offene Fragen an Stefan/Fred
- **Layout-Sprache site-weit?** Die Neufassung nutzt Wrap 1180 / Radius 12 / Sektionen 120 / H2 48. Für jetzt seiten-scoped. Soll das der **neue Standard für alle Seiten** werden (dann später Pakete/Startseite angleichen)? **[S]**
- „Vier Zusagen": Kündigungsfrist und angebundene Clubverwaltungen sind laut Mock „Freigabe Fred ausstehend" **[F]** – Wortlaut so aus dem Mock übernehmen, nichts ergänzen.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0016-plattform.md. Voraussetzung: der Motion-Schritt (0015)
ist auf main; zweige feat/plattform vom aktuellen main ab. Baue die Seite /plattform aus dem gültigen Mock
docs/design-system/mocks/3.2c-plattform-neufassung.html (die alte 3.2 ist Archiv) über die Skills
golfnext-page-from-mock, golfnext-design-system, golfnext-qa. Lege alle Texte wortgleich in
content/plattform.ts an. Baue die sieben Abschnitte (Hero mit Bleed-Demo + Platzstatus-Toggle, Bento „Drei
Dinge", Rollen-Slider, Scroll-Geschichte mit klebendem Rahmen, Klare Grenze, Vier Zusagen, FooterClose)
mit der Motion-Infra – jede Animation einmal/dezent, prefers-reduced-motion -> sofort Endzustand, OHNE JS
alles lesbar (Slider nativ scrollbar, Scroll-Story gestapelte Mobile-Fassung), kein CLS, Bleed ohne
Seiten-Overflow. Modulstatus NICHT anzeigen (geteilter Footer). Keine erfundenen Zahlen/Versprechen:
Beispiel-UI-Werte illustrativ 1:1 aus dem Mock, echte Kennzahl nur „68 %" (Pilot Rehburg-Loccum). Führe die
Layout-Erweiterungen (Wrap 1180, Radius 12 große Flächen, Sektion 120, H2 48) als benannte Tokens ein und
wende sie NUR auf dieser Seite an (Pakete/Startseite nicht retrofitten). Route app/(site)/plattform/page.tsx
mit Footer(footerClose), Metadata/Canonical, eine h1; setze /plattform in config/site-structure.ts auf live.
Aktualisiere docs/03 und docs/entscheidungen.md. Rufe danach text-fidelity, design-system-guard, qa-runner
und seo-auditor auf und behebe deren FAILs. Neuer E2E für /plattform. PR nach dem Template, CI grün (beide
Jobs Pflicht), Preview gegen 3.2c abgleichen (Desktop+Mobile), dann pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
