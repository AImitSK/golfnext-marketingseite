# 0012 · Seite Pakete (/pakete)

Masterplan-Schritt: 2.1 · Branch: `feat/pakete` · Phase: 2

Die erste echte Seite und die verkaufsstärkste: `/pakete` aus dem **gültigen** Mock `3.7-pakete.html`
(Fassung 2). Fünf Abschnitte + Hero + persönlicher Abschluss. **Preise werden nie addiert.**

**Vorbedingung:** Shell (2.0) ist auf `main` (Header im `(site)`-Layout). `feat/pakete` zweigt vom aktuellen `main` ab.
Nutzt die Phase-1-Bausteine (`Section/Wrap/Eyebrow/Lead/Statement/Hint`, `Button`, `TextLink`, `Badge`, `Faq`, `Footer/FooterClose`, Motion-Wrapper).

## Kontext und Lesereihenfolge
1. `CLAUDE.md` (Preisregeln: **nie addieren**, keine Bestseller-Badges/durchgestrichenen Preise/Rabattoptik/Verknappung; keine erfundenen Zahlen; Beispielrechnung kennzeichnen; Texte wortgleich; Benennungen).
2. Skill **`golfnext-page-from-mock`** (Vorgehen Seite-aus-Mock) und `golfnext-design-system`, `golfnext-qa`.
3. `docs/02-preislogik.md` – **verbindliche Preise** (Sockel 6.800 €/238 € · +Wachstum 5.200 €/312 € · +Komplett 7.200 €/462 € · +Individuell auf Anfrage/ab 662 €; Werbebudget 10 %, Beispiel 1.000 €→100 €; **Mindesthonorar offen [S] – nicht erfinden**).
4. Mock **`docs/design-system/mocks/3.7-pakete.html`** – **die verbindliche Vorlage für Text, Struktur und CSS**:
   - Hero: **410–446** (Eyebrow, H1 „Eine Clubwebsite. Drei Wege, sie arbeiten zu lassen.", Lead, zwei CTAs, „Rückgrat"-Stapel `#stack`).
   - Abschnitt 2 „Die Basis": **448–516** (Sockelband mit Preisen, Leistungsliste, Hinweis, Einrichtungs→Go-live→Betrieb-Schiene `.rail`).
   - Abschnitt 3 „Die drei Pakete": **518–645** (drei `.pkc`-Karten Wachstum/Komplett/Individuell mit Sockel + Pluszeichen + Modulblock + aufklappbaren Leistungen; Werbebudget-`adbox` mit **Beispielrechnung**).
   - Abschnitt 4 „Vergleich": **647–697** (Vergleichstabelle „Was in welcher Stufe enthalten ist").
   - Abschnitt 5 „Häufige Fragen": **699–735** (sieben FAQ, Wortlaut Z. 704–731).
   - Persönlicher Abschluss (FooterClose-Inhalt): der Block **nach 735** vor dem Footer.
   - Sektions-CSS: **52–320** (Hero, Basis, Pakete, Werbebudget, Vergleich, FAQ).
5. `config/site-structure.ts` (`/pakete` hat bereits `title`/`description`; Status wird hier `live`), `content/types.ts` (`PageContent`), `content/ueber-golfnext.ts` (Muster).
6. `docs/03-seiten-und-routen.md` (nach Fertigstellung aktualisieren).

## Harte Vorgaben
- **Texte als Daten, wortgleich:** Alle Inhalte in `content/pakete.ts` (Muster `ueber-golfnext.ts`), 1:1 aus dem Mock (Halbgeviertstrich `–`, „…", Satzfragmente, gewünschte Umbrüche als `headlineLines`). Komponenten enthalten **keine** freien Texte. Preise als Strings exakt wie in der Preislogik/Mock.
- **Preise nie addieren:** In jeder Karte stehen Sockel („Ihre Clubwebsite 6.800 € · 238 €/Monat") und Modulblock durch ein **Pluszeichen** getrennt untereinander – **keine** Summenzeile, kein Gesamtpreis. Die mittlere Karte (Komplett) darf visuell hervorgehoben sein, aber **ohne** „Beliebt/Empfohlen/Bestseller"-Badge und ohne Rabattoptik.
- **Werbebudget:** „Nicht in den Paketpreisen enthalten", 10 % Verwaltungshonorar, **Beispielrechnung** klar als solche beschriftet (1.000 € → 100 €), netto zzgl. USt. **Kein** Mindesthonorar erwähnen (offen [S]).
- **Aufklappbare Leistungen** der drei Karten: als `<details>/<summary>` (ohne JS bedienbar, wie FAQ-Entscheidung 1.6) statt Button+`hidden`+JS. Summary-Label wortgleich („Zusätzlich enthalten · 9 Leistungen anzeigen" / „Alles aus Wachstum · 7 weitere anzeigen" / „Alles aus Komplett · 4 weitere anzeigen"), Leistungslisten wortgleich.
- **Vergleichstabelle** als **semantische `<table>`** (`<thead>`/`<th scope>`), horizontal scrollbar auf schmalen Viewports **innerhalb** eines Containers (kein Seiten-Overflow); Häkchen/leer mit zugänglicher Bedeutung (nicht nur Icon/Farbe).
- **FAQ** über die `Faq`-Komponente (1.6) mit den sieben Fragen/Antworten aus dem Mock (Z. 704–731), Wortlaut exakt; statisch (Sanity-Umstellung ist 3.6).
- **Hero-„Rückgrat"-Animation** mit den 1.7-Motion-Wrappern (`reveal`/`rise`/`draw`): einmalig, `useReducedMotion` → Endzustand, **ohne JS voll sichtbar** (Server rendert den kompletten Stapel). Keine Tabu-Effekte, kein Zähler.
- **Route & SEO:** `app/(site)/pakete/page.tsx`; `/pakete`-Status in `config/site-structure.ts` auf **`live`** (aktiviert Header/Footer-Links). Metadata (title/description aus site-structure), Canonical, genau **eine `<h1>`** (die Hero-H1). JSON-LD `FAQPage` ist Phase 6 – hier **nicht** bauen.
- **Footer** der Seite: `<Footer footerClose={paketeContent.footerClose}/>` mit dem Abschluss-Text aus dem Mock (wortgleich), CTA über `resolveCta`.
- **Bilder:** Falls im Mock ein `Shot`-Platzhalter/echte Produktoberfläche vorkommt, als `Shot` bauen (Launch-Entscheidung: Platzhalter statt weglassen). Die Pakete-Seite ist überwiegend Text/Karten/Tabelle – keine erfundenen Oberflächen.
- **Sektions-CSS portieren** (nicht neu erfinden) als co-lokierte `*.module.css` (Tokens `--gn-*`, literale Tints kommentiert). Tailwind nur für Layout-Primitives/neue Zustände. Grün-Regel beachten.
- **CTA-Ziele** nur über `resolveCta`/`lib/links.ts` (Hero „Pakete ansehen" = interner Anker auf Abschnitt 3; „Online-Erstgespräch" + Karten-`tlink`s = `erstgespraech`).

## Aufgaben
1. `content/pakete.ts` nach `PageContent` anlegen – alle Texte wortgleich aus 3.7 (Hero, Basis inkl. Schiene, drei Karten inkl. Leistungslisten, Werbebudget/Beispielrechnung, Vergleichstabelle, FAQ, FooterClose). Preise exakt.
2. Seitenkomponenten unter `components/pages/pakete/` (Hero mit Stapel-Animation, Sockel+Schiene, PaketKarten, Werbebudget, Vergleichstabelle, FAQ-Einbindung) – CSS aus 3.7 als Module portiert.
3. `app/(site)/pakete/page.tsx`: Sektionen zusammensetzen, `<Footer footerClose={…}/>`, Metadata/Canonical, eine H1.
4. `config/site-structure.ts`: `/pakete` → `status: "live"`.
5. `docs/03-seiten-und-routen.md` aktualisieren; `docs/entscheidungen.md`-Eintrag (Umsetzungsentscheidungen der Seite, z. B. Leistungen als `<details>`, Tabelle als `<table>`).

## Skills und Subagents
- Skills: `golfnext-page-from-mock`, `golfnext-design-system`, `golfnext-qa`.
- Subagents nach dem Bauen: **`text-fidelity`** (wortgleich, Preise, **nie addieren**, keine erfundenen Zahlen, Beispielrechnung gekennzeichnet, Benennungen), `design-system-guard` (Grün-Regel, keine Bestseller-/Rabattoptik, Tokens, Icon-Größen), `qa-runner` (Overflow @390/768/1024/1180/1440 inkl. Tabellen-Scroll, ohne-JS für Leistungen+FAQ, Reduced-Motion-Hero, axe, Konsole), `seo-auditor` (Metadata/Canonical, eine H1, interne Links nur `live`), dann `pr-reviewer`.

## PR und Merge
- Branch `feat/pakete` vom aktuellen `main`; Briefing liegt mit im Branch. Commits deutsch, Imperativ, gern in logischen Teilen (Content → Sektionen → Route/SEO).
- Vor dem PR: `pnpm typecheck && pnpm lint && pnpm test && pnpm build` + `pnpm test:e2e` grün; neuer E2E für `/pakete` (Overflow, ohne-JS Leistungen/FAQ, eine H1).
- PR nach `.github/pull_request_template.md`, CI grün (beide Jobs Pflicht), **Preview genau ansehen (Screenshot-Abgleich gegen 3.7)**, `pr-reviewer`. **Merge übernimmt der Orga-Chat** (Squash).

## Akzeptanzkriterien
- [ ] `/pakete` entspricht visuell und im Wortlaut dem Mock 3.7 (Screenshot-Abgleich); alle Texte in `content/pakete.ts`.
- [ ] Preise exakt; **keine Summen/Gesamtpreise**; Sockel+Modulblock durch Pluszeichen getrennt; keine Bestseller-Badges/Rabattoptik/Verknappung.
- [ ] Werbebudget-Box mit gekennzeichneter Beispielrechnung (1.000 €→100 €), 10 %, „nicht in den Paketpreisen enthalten"; kein Mindesthonorar erfunden.
- [ ] Karten-Leistungen und FAQ **ohne JS** auf-/zuklappbar; Vergleich als semantische `<table>`, Scroll innerhalb Container, kein Seiten-Overflow @5 Breakpoints.
- [ ] Hero-Animation einmalig, Reduced-Motion-Endzustand, ohne JS voll sichtbar; genau eine `<h1>`; axe ohne AA-Verstoß; keine Konsolenfehler.
- [ ] `/pakete` ist `live` in site-structure; Header/Footer verlinken die Seite; Metadata/Canonical gesetzt.
- [ ] `pnpm typecheck/lint/test/build` + CI grün; `text-fidelity`, `design-system-guard`, `qa-runner`, `seo-auditor` ohne FAIL; `docs/03` + `entscheidungen.md` aktualisiert.

## Was du NICHT tust
- Keine andere Seite (Startseite/Plattform/… sind spätere Schritte); keine Sanity-Anbindung der FAQ (3.6); kein JSON-LD (Phase 6); kein Formular/Consent.
- **Nichts addieren, keine Summenpreise, keine Bestseller-Badges, keine erfundenen Zahlen/Konditionen** (kein Mindesthonorar, keine Rabatte). Keine Marketingfloskeln ergänzen, keine Sätze glätten.
- Keine neuen Tokens/Farben; Fassung-1-Briefing (`3.6-pakete-briefing.md`) nur als Kontext, **nicht** dessen Preise/Acht-Abschnitte-Struktur übernehmen; Mocks/Rechtstexte nicht ändern.

## Offene Fragen an Stefan/Fred
- Mindesthonorar auf das Werbebudget (unter ~1.000 € Monatsbudget) ist offen **[S]** – bis dahin **nicht** erwähnen. Concierge/Platzstatus in Komplett (statt Sockel) ist die gültige Fassung-2-Entscheidung; rückschiebbar nur, wenn Fred es will **[F]**.

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md, docs/02-preislogik.md und das Briefing docs/briefings/0012-pakete.md. Voraussetzung: die
Shell (2.0) ist auf main; zweige feat/pakete vom aktuellen main ab. Baue die Seite /pakete aus dem gültigen
Mock 3.7-pakete.html über die Skills golfnext-page-from-mock, golfnext-design-system und golfnext-qa. Lege
alle Texte wortgleich in content/pakete.ts an (Preise exakt aus der Preislogik), baue die Sektionen
(Hero mit Rückgrat-Animation über die 1.7-Motion-Wrapper, Basis+Einrichtungs/Go-live/Betrieb-Schiene, drei
Preiskarten mit Sockel+Pluszeichen+Modulblock, Karten-Leistungen als <details> ohne JS, Werbebudget mit
gekennzeichneter Beispielrechnung 1.000->100, Vergleich als semantische <table> mit contained Scroll, FAQ
über die Faq-Komponente mit den sieben Mock-Texten). Portiere das Sektions-CSS 1:1 aus 3.7 als co-lokierte
Module (--gn-*). PREISE NIE ADDIEREN, keine Summen, keine Bestseller-Badges/Rabattoptik, kein Mindesthonorar
erfinden. Route app/(site)/pakete/page.tsx mit Footer(footerClose), Metadata/Canonical, genau eine h1;
setze /pakete in config/site-structure.ts auf live. Aktualisiere docs/03 und docs/entscheidungen.md. Rufe
danach text-fidelity, design-system-guard, qa-runner und seo-auditor auf und behebe deren FAILs. Neuer E2E
für /pakete. PR nach dem Template, CI grün (beide Jobs Pflicht), Preview gegen 3.7 abgleichen, dann
pr-reviewer.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
