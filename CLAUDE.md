# GolfNext Marketing-Website

Marketing-Website für GolfNext – Marketing und Automation als Software-Layer für Golfanlagen.
Betreiber: Fred Hoffmann (Gründer, PGA Golfprofessional). Umsetzung: Stefan Kühne (SK Online Marketing).
Sprache der Website und aller Inhalte: **Deutsch (Sie-Form)**. Sprache im Code: Englisch. Kommentare und Docs: Deutsch.

## Zuerst lesen

1. `docs/00-masterplan.md` – der Arbeitsplan. Schritt für Schritt abarbeiten, Haken setzen, nichts überspringen. `docs/workflow.md` – wie gearbeitet wird (Orga-Chat ↔ Umsetzungs-Chat, Briefings, Subagents, CI).
1a. Das aktuelle Arbeitsbriefing in `docs/briefings/` – es bestimmt Umfang und Akzeptanzkriterien des laufenden Schritts.
2. `docs/01-architektur.md` – Stack, Ordnerstruktur, Konventionen. `docs/08-zustaende-und-feedback.md` – Lade-, Fehler- und Leerzustände.
3. `docs/design-system/README.md` – Tokens, Bausteine, Regeln. Die HTML-Mocks unter `docs/design-system/mocks/` sind die **verbindliche visuelle Vorlage** für jede Seite.
4. Das jeweilige Fred-Briefing unter `docs/design-system/briefings/` bevor eine Seite gebaut wird – dort stehen die freigegebenen Texte.
5. `config/site-structure.ts` (Routen, Navigation, Status, Metadaten – eine Wahrheit) und `content/README.md` (Texte als Daten).

## Stack

- **Next.js** (App Router, TypeScript, React Server Components), **Tailwind CSS v4** mit `@theme`-Tokens
- **Sanity** (Project `wsj8a3ho`, Dataset `production`) für Blog/Ratgeber, Rubriken, Autoren und FAQs. Studio eingebettet unter `/studio`.
- **Vercel** Hosting. **SendGrid** für Formular-Mails (nur serverseitig).
- Fonts über `next/font` (Archivo, Inter) – **self-hosted, niemals von fonts.googleapis.com laden** (DSGVO, LG München 2022).
- Bewegung mit **`motion/react`** (kostenlose MIT-Bibliothek). Der `/motion`-Skill und der Motion-MCP (kostenloser Teil des AI Kits) liefern Doku und Best Practices. **Kein Motion+**, keine Premium-Komponenten.
- Paketmanager: `pnpm`. Node ≥ 20.

## Befehle

```bash
pnpm dev            # http://localhost:3000, Studio unter /studio
pnpm build && pnpm start
pnpm lint && pnpm typecheck
pnpm test:e2e       # Playwright-Prüfungen (siehe Skill golfnext-qa)
pnpm sanity:deploy  # Schema deployen (nach Schema-Änderungen)
```

## Regeln, die immer gelten

**Inhalt**
- Alle Websiteinhalte einer Seite liegen in `content/<seite>.ts` (Muster: `content/ueber-golfnext.ts`), Komponenten importieren sie. Keine freien Inhaltstexte im JSX.
- Freigegebene Texte aus den Briefings **wortgleich** übernehmen. Keine Marketingfloskeln ergänzen, keine Sätze glätten. Bewusste Satzfragmente bleiben.
- Keine erfundenen Zahlen: keine Klickzahlen, Reichweiten, Conversion-Werte, Einsparungen, Umsatzversprechen, Kundenzahlen. Beispielrechnungen sind als solche zu kennzeichnen.
- Nur als „Websiteinhalt" gekennzeichnete Briefing-Teile werden veröffentlicht. Umsetzungshinweise und Platzhalterbeschreibungen nicht.
- Fehlende Bilder (Screenshots, Porträts, Partnerlogos) werden als **beschriftete Platzhalter** gebaut (`<Shot />`-Baustein), niemals durch Stock, KI-Bilder oder erfundene Oberflächen ersetzt.

**Benennungen (verbindlich)**
- „Turnier-News" (nie „Club News"). „Firmen-Events" (nie nur „Events"). Innerhalb der Clubprozesse „Gastfee" (nicht „Greenfee"); als Zielgruppen-/Kampagnenthema bleibt „Greenfee".
- Wortmarke „GolfNext" ohne „Consulting". Module: Reach, Search, Landingpages, Marketing-CRM, Lifecycle, Content, Concierge, Platzstatus, Gastfee, Firmen-Events, Turnier-News, Captains App.

**Preise (Fassung 2, gültig – siehe `docs/design-system/mocks/3.7-pakete.html` und `docs/02-preislogik.md`)**
- Sockel „Ihre Clubwebsite": 6.800 € einmalig / 238 € monatlich, einzeln buchbar.
- Wachstum + 5.200 € / + 312 € · Komplett + 7.200 € / + 462 € · Individuell auf Anfrage / ab 662 €.
- **Preise werden auf der Website nie addiert.** Sockel und Modulblock stehen zusammen, die Summe zieht der Leser selbst.
- Werbebudget legt der Club fest, darauf 10 % Verwaltungshonorar; in keinem Paketpreis enthalten. Alle Preise netto zzgl. USt.
- Keine Bestseller-Badges, keine durchgestrichenen Preise, keine Rabattoptik, keine Gründungsclub-Konditionen.

**Design**
- Sektions-CSS aus den Mocks wird als `*.module.css` **portiert** (Tokens auf `--gn-…`), nicht nach Tailwind neu geschrieben. Tailwind für Layout-Primitives, Zustände und neue Bausteine.
- Tokens aus `docs/design-system/tokens/` verwenden, keine neuen Farben oder Radien erfinden. Radius 4 px (Pills 20 px).
- **Grün-Regel:** Signalgrün `#00E805` nur als Fläche, Punkt oder Linie – oder als Text **auf Navy**. Nie als Text auf hellem Grund (Kontrast 1,6:1).
- Headlines Archivo 700/800, Tracking −0.02em; Fließtext Inter 17 px / 1.65.
- Genau eine `<h1>` pro Seite. Abschnitte `<h2>`, Unterpunkte `<h3>`.
- `.hint`-Baustein (Info-Icon + Text) immer mit fixer Icon-Größe 15 px – ein SVG ohne Größe skaliert auf Containerbreite (ist zweimal passiert).

**Bewegung** (gelockert am 06.09.2026, Entscheidung Stefan)
- **Haltung: Bewegung mit Absicht – modern und lebendig, aber seriös.** GolfNext tritt als Technologieführer für Golf + Internet auf; die Seite darf sich **nicht wie statisches HTML** anfühlen. Bewegung macht Zusammenhänge sichtbar und das Produkt spürbar – über Hover-/Micro-Interaktionen, weiche Übergänge, Scroll-Reveals mit echter Präsenz und dezent lebendige Elemente. Sie ersetzt keine Aussage und drängt sich nicht auf.
- **Nicht verhandelbar (Barrierefreiheit, Recht, Performance):** `prefers-reduced-motion: reduce` zeigt **sofort den Endzustand**; Texte und Bedienelemente sind **ohne JavaScript** lesbar und bedienbar (Server-HTML rendert den Endzustand); **keine Layoutverschiebung / kein CLS** (nur `opacity`/`transform`/`pathLength`, Höhen vorab reservieren); **kein automatischer Ton; kein Scroll-Hijacking**.
- **Scroll-Reveals** laufen standardmäßig **einmal** und bleiben im Endzustand (`whileInView` mit `viewport={{ once: true }}`, `useReducedMotion()` beachten). Sie dürfen **spürbar** sein (großzügiger Translate, klare Staffelung), nicht nur ein leises Fade.
- **Kontinuierliche/wiederkehrende Bewegung** ist erlaubt, wenn sie **dezent, langsam und nicht ablenkend** ist (z. B. ein sanft lebendiges Detail, eine ruhige Ambient-Bewegung) – **kein** hektisches Blinken, **kein** aufdringlicher Dauer-Effekt, der vom Inhalt abzieht.
- **Zähler** für echte Kennzahlen sind erlaubt: einmaliges Hochzählen beim Sichtbarwerden, Werte jederzeit lesbar, Reduced-Motion zeigt sofort den Endwert.
- **Mit Bedacht statt Tabu:** Effekte wie Typewriter, ScrambleText, splitText, Ticker, Carousel oder Cursor-Effekte nur dort, wo sie dem Inhalt wirklich dienen und **seriös** wirken – nie als Selbstzweck; im Zweifel schlicht und hochwertig. (Fred hatte sie ursprünglich ausgeschlossen; auf Stefans Entscheidung gelockert.)

**Datenschutz / Recht**
- Kein Third-Party-Script vor Einwilligung (Consent-Tool, Google Consent Mode v2). Vercel Web Analytics ist cookielos und darf ohne Consent laufen.
- Formulare: serverseitig validieren (zod), zweistufiger Spam-Schutz ohne CAPTCHA (Honeypot, signierter Zeitstempel, Rate-Limit, Score – Legitimes geht nie verloren), SendGrid-Key nur in Server-Umgebung, Nutzerinhalte in Mails escapen, keine personenbezogenen Daten loggen.

**Zustände und Meldungen**
- Skeleton in Inhaltsform für Sanity-Routen (`loading.tsx`), Button-Ladezustand für Aktionen, Alerts für Ergebnisse, ein einziger Toast (Cookie-Einstellungen). Keine Vollbild-Spinner, kein globaler Fortschrittsbalken.
- Alle Fehler- und Hinweistexte aus `lib/forms/messages.ts` bzw. `lib/ui/messages.ts` – Sie-Form, ein Satz, mit Ausweg, keine Technik. Fokus wandert auf Fehler bzw. Erfolg. Details `docs/08-zustaende-und-feedback.md`.
- Rechtstexte aus `docs/legal/` übernehmen; offene Stellen sind dort mit `[[ … ]]` markiert und dürfen nicht erfunden werden.

## Qualität vor Abschluss eines Schritts

- Subagents aufrufen (`.claude/agents/`): `design-system-guard` nach UI-Änderungen, `text-fidelity` nach jeder Seite/Sektion, `qa-runner` vor Abschluss, `seo-auditor` nach Routen/Links, `pr-reviewer` vor dem Merge. Ihre FAILs werden behoben, nicht wegdiskutiert.

- `pnpm lint`, `pnpm typecheck`, `pnpm build` grün.
- Playwright-Checks (Skill `golfnext-qa`): kein horizontaler Overflow bei 390 / 768 / 1024 / 1180 / 1440, kein SVG > 90 px außer Logo und bewussten Grafiken, Reduced-Motion-Endzustand, Seite ohne JS lesbar, keine Konsolenfehler.
- Lighthouse ≥ 95 in Performance, Accessibility, Best Practices, SEO (mobil).
- Screenshot mit dem Mock vergleichen. Abweichungen sind nur erlaubt, wenn sie im Masterplan oder in `docs/03-seiten-und-routen.md` begründet stehen.

## Arbeitsweise

- Ein Arbeitsbriefing je Baustein (`docs/briefings/`), Feature-Branch, PR mit Template, CI grün, `pr-reviewer`, Merge, dreisätzige Zusammenfassung – siehe `docs/workflow.md`. Nichts außerhalb des Briefings bauen.
- Nur Routen mit Status `live` in `config/site-structure.ts` verlinken. Launch-Umfang nach `docs/10-launch-umfang.md`.
- Kleine, überprüfbare Schritte entlang des Masterplans; nach jedem Schritt Commit mit sprechender Nachricht (deutsch, Imperativ: „Baue Header-Navigation", „Ergänze Sanity-Schema für FAQ").
- Vor größeren Umbauten kurz in `docs/entscheidungen.md` festhalten, was und warum.
- Wenn ein Briefing fehlt (Praxis, Team, Kontakt, Modulseiten): Seite **nicht** erfinden, sondern im Masterplan als „wartet auf Briefing" belassen und Stefan fragen.
- Secrets stehen nur in `.env.local` (gitignored) und in den Vercel-Umgebungsvariablen. Nie in Code, Docs oder Commits.

## MCP und CLI

- `.mcp.json`: Sanity MCP (nur inspizieren und abfragen – Schema code-first, Inhalte über Studio), Vercel MCP (Deployments, Logs), Playwright MCP (Browser-Prüfung), Motion MCP (nach `npx motion-ai`, Masterplan 0.10).
- CLI: `gh` (GitHub), `vercel` (Link, Env, Deploy), `sanity` (Schema-Deploy, Dataset). Details in `docs/01-architektur.md`.
- Git-Remote: `https://github.com/AImitSK/golfnext-marketingseite.git`, Hauptzweig `main`, Vercel deployt `main` automatisch, Feature-Branches erzeugen Preview-Deployments.
