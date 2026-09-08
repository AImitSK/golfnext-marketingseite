# Masterplan · GolfNext Marketing-Website

Arbeitsplan für Claude Code. Schritte in Reihenfolge abarbeiten, jeden erledigten Schritt hier abhaken
(`- [x]`) und committen. Ein Schritt gilt erst als erledigt, wenn die QA-Routine (`.claude/skills/golfnext-qa`)
für den Schritt durch ist. Wenn etwas fehlt (Briefing, Asset, Zugang): Schritt als „blockiert" markieren,
nicht raten, Stefan fragen.

Legende: **[S]** Stefan muss etwas liefern/entscheiden · **[F]** Fred muss etwas liefern/entscheiden.

---

## Phase 0 · Repository und Grundgerüst

- [x] **0.1 Git.** `git init`, Remote `https://github.com/AImitSK/golfnext-marketingseite.git`, Zweig `main`.
      Vor dem ersten Commit prüfen, dass `.gitignore` greift: `git status` darf `.env.local` **nicht** zeigen.
- [x] **0.2 Next.js anlegen.** Das Verzeichnis ist nicht leer, `create-next-app` verweigert dann. Deshalb:
      ```bash
      pnpm dlx create-next-app@latest ../gn-tmp --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-pnpm --turbopack
      # alles außer README.md und .gitignore von ../gn-tmp hierher verschieben, ../gn-tmp löschen
      ```
      Danach `pnpm dev` starten – Standardseite muss laufen.
- [x] **0.3 Tooling.** Prettier (mit `prettier-plugin-tailwindcss`), ESLint-Regeln von Next, `pnpm typecheck`-Skript (`tsc --noEmit`), `engines.node >= 20`. `.nvmrc`/`.node-version` mit `22`.
- [x] **0.4 Tokens.** `docs/design-system/tokens/tailwind-theme.css` in `app/globals.css` übernehmen. Basis-Styles: `body` paper/ink, 17 px, 1.65; Headlines Archivo; `a` ohne Unterstrich; Fokus-Ring `2px solid blue, offset 3px`.
- [x] **0.5 Fonts.** `next/font/google` für Archivo (400–800) und Inter (400–700), `variable: '--font-archivo'` / `'--font-inter'`, `display: 'swap'`, Subset `latin`. Prüfen, dass **kein** Request an `fonts.googleapis.com` geht.
- [x] **0.6 Marke.** Aus `brand/` kopieren: `app/favicon.ico`, `app/icon.svg`, `app/apple-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/icon-512-maskable.png`; `app/manifest.ts` aus `site.webmanifest`. Komponente `components/site/Wortmarke.tsx` (inline SVG, `currentColor`, `data-large-svg`).
- [ ] **0.7 Vercel.** `vercel link` auf ein Projekt im Team von Stefan **[S]**, Framework Next.js, Region `fra1`. Umgebungsvariablen aus `.env.example` anlegen (Production + Preview), Werte aus `.env.local` **[S]**. Erster Deploy von `main`.
- [x] **0.8 Playwright.** `@playwright/test` installieren, `playwright.config.ts` mit `webServer: pnpm start` und Projekten für 390/768/1024/1180/1440. Erste Spec: Startseite lädt, kein Overflow, kein Konsolenfehler. Skript `pnpm test:e2e`.
- [x] **0.9 Sicherheits-Header.** In `next.config.ts`: `Content-Security-Policy` (Report-Only zunächst), `X-Frame-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. Sanity-CDN und Studio in der CSP berücksichtigen.
- [ ] **0.10 Motion und AI Kit.** `pnpm add motion`. Danach `npx motion-ai` im Projektordner ausführen (Auswahl: *Projekt*, Agent *Claude Code*); der Installer ergänzt `.mcp.json` um die gehosteten Motion-MCP-Server und legt den `/motion`-Skill an. Claude Code neu starten, MCP ggf. in den Agent-Optionen aktivieren. Prüfen: `/motion` ist als Skill sichtbar. Nur der kostenlose Teil – **kein Motion+ kaufen** (Entscheidung 05.09.2026).

- [ ] **0.11 CI und PR-Prozess.** `.github/workflows/ci.yml` und `.github/pull_request_template.md` liegen vor; Skripte passend benennen (`typecheck`, `lint`, `test`, `build`, `test:e2e`, `test:a11y` mit `@axe-core/playwright`, `test:visual`). GitHub-Secret `SANITY_API_TOKEN` anlegen **[S]**. Branch-Schutz auf `main`: PR + grüne CI Pflicht **[S]**.
- [x] **0.12 Struktur und Inhalte als Daten.** `config/site-structure.ts` einbinden (Routen, Navigation, Status, Metadaten, `flags` für den Launch-Umfang), `lib/links.ts` (CTA-Ziele aus `.env` mit Fallback), `content/types.ts` + `content/ueber-golfnext.ts` als Muster übernehmen. Header, Footer, Sitemap und Platzhalter-Routen lesen ab jetzt nur noch aus `site-structure.ts`.

**Phase 0 fertig, wenn:** Deploy auf Vercel läuft, Fonts self-hosted, Favicon sichtbar, CI grün, `pnpm build` + `pnpm test:e2e` grün. Arbeitsbriefing: `docs/briefings/0001-phase-0-grundgeruest.md`.

---

## Phase 1 · Design-System als Komponenten

Quelle: `docs/design-system/mocks/2.4-navigation-footer.html`, `2.5-ui-kit.html` sowie der gemeinsame Kopf- und Footer-Block aller Seitenmocks. Skill `golfnext-design-system` laden.

- [x] **1.1 Layout-Bausteine.** `Section` (Varianten paper/sand/mist, Padding 86/58), `Wrap` (1140 px, Gutter 40/26/20), `Eyebrow`, `Lead`, `Statement`, `Hint` (Icon 15 px fix).
- [x] **1.2 Buttons und Links.** `Button` (primär grün mit optionaler zweiter Zeile, sekundär auf dunkel mit Unterlinie), `TextLink` mit Pfeil, `Pill`/`Chip`, Status-`Badge` (Im Einsatz grün · Pilot gold · In Entwicklung hell).
- [x] **1.3 Header.** Sticky 80 px, Wortmarke 19 px, Hauptnavigation nach 2.4 mit zwei Modul-Dropdowns (Plattform, Clubprozesse), aktive Seite mit grüner Unterlinie, CTA rechts. Unter 1024 px Burger + Vollbild-Menü nach 2.4 (mobil). Tastaturbedienbar, `aria-current="page"`. **Überholt durch 2.10:** Struktur v2 – Clubprozesse hat kein Dropdown mehr, die Modulseiten sind entfallen. Die Mechanik bleibt unverändert, nur die Datengrundlage ändert sich.
- [x] **1.4 Footer-Systemkarte.** `Footer` mit `FooterClose` (Props: eyebrow, headline, text, cta, ctaHint, secondary?), Modulkarte (zwölf Module in zwei Spalten mit Status-Punkten, Links auf `/module/<slug>` – vorerst `#`; **überholt:** Status-Punkte entfielen mit 0014, die Links mit 2.10 – die Namen stehen jetzt als Text da), Kontaktzeile (Fred Hoffmann, 0175 5951839, info@golfnext.de, Rückmeldung innerhalb eines Werktags), Leiste mit Wortmarke, © 2026, Impressum, Datenschutz, Cookie-Einstellungen (öffnet Consent-Dialog).
- [x] **1.5 Platzhalter.** `Shot` (ratio, tagline, title, text, dark?) exakt nach `.shot` im Mock; `Portrait`-Platzhalter klein (46 px rund) und groß (4/5).
- [x] **1.6 FAQ.** `Faq`/`FaqItem` auf `<details>/<summary>` (Basis liefert den Auf-/Zu-Zustand nativ – kein manuelles `aria-expanded`), Plus/Minus-Marker rein per CSS über `[open]`, ohne JS voll bedienbar und alle Antworten sichtbar.
- [x] **1.7 Bewegung mit `motion/react`.** `lib/motion/variants.ts` mit den wenigen Varianten, die die Mocks brauchen: `reveal` (Opacity/Translate 14 px, .55 s, Ease `[.2,.8,.3,1]`), `rise` (gestaffelt), `draw` (Linien über `pathLength`/`scaleX`). Überall `whileInView` mit `viewport={{ once: true, amount: .2 }}`, `useReducedMotion()` → Endzustand ohne Übergang. Server-Rendering liefert den Endzustand im HTML; Startzustände setzt erst der Client (`initial` nur, wenn JS läuft) – damit bleibt die Seite ohne JavaScript vollständig lesbar. Verboten: Typewriter/ScrambleText/splitText, Ticker, Carousel, Cursor-Effekte, Zähler-Effekte außer der gekennzeichneten Saisonrechnung. **Erweitert durch Briefing 0015 (06.09.2026):** Bewegungsregeln gelockert – `reveal`-Translate auf 28 px, Hover-Karten-Lift (`.gn-card-lift`), `RevealLine`/`CountUp` als geteilte Bausteine, Signatur-Animationen der Live-Seiten und **Kennzahl-Hochzähler jetzt erlaubt** (einmalig, Reduced-Motion = Endwert). Die harten Regeln (Reduced-Motion-Endzustand, ohne JS sichtbar, kein CLS, kein Ton/Scroll-Zwang) bleiben. Siehe `docs/entscheidungen.md` und `docs/design-system/README.md`.
- [x] **1.8 Zustände.** Aus UI-Kit Abschnitt 7: `Alert` (info/ok/err, `role` je Variante), `Toast` (einziger Einsatz: Cookie-Einstellungen gespeichert), `Empty` (Leerzustand), `Skeleton` (Shimmer, bei Reduced Motion still), Button-Ladezustand `.btn.loading`; Formularfelder `Input/Select/Textarea/Checkbox/Radio` mit den fünf Zuständen aus Abschnitt 3 und `FieldMessage` (`e/s/h`). Textkataloge `lib/ui/messages.ts` und `lib/forms/messages.ts` anlegen. Regeln: `docs/08-zustaende-und-feedback.md`.
- [x] **1.9 Bausteinseite.** Interne Route `/_bausteine` (noindex, nur in Preview sichtbar), die alle Komponenten zeigt – zum Abgleich mit 2.5. Screenshot gegen den Mock vergleichen.

---

## Phase 2 · Statische Seiten aus den Mocks

**Voraussetzung:** Launch-Umfang entschieden (`docs/10-launch-umfang.md`) **[S][F]**. Ohne diese Entscheidung startet Phase 2 nicht.

Je Seite: Skill `golfnext-page-from-mock` → Fred-Briefing lesen → `content/<seite>.ts` anlegen → Sektions-CSS aus dem Mock als CSS-Module portieren → bauen → Subagents (`text-fidelity`, `design-system-guard`, `qa-runner`, `seo-auditor`) → `docs/03-seiten-und-routen.md` aktualisieren. Reihenfolge nach Verkaufsrelevanz.

- [x] **2.0 Layout-Shell.** Header (Baustein 0004) site-weit ins neue `app/(site)/layout.tsx` eingehängt; `app/page.tsx` → `app/(site)/page.tsx` verschoben (Route bleibt `/`, Platzhalter, genau eine `<h1>`). Footer bewusst pro Seite, nicht im Layout. (Briefing 0011)
- [x] **2.1 Pakete** `/pakete` aus `3.7-pakete.html` (Fassung 2). Hero-Stapel mit Rückgrat-Animation, Sockelblock, Zeitschiene Einrichtung → Go-live → Betrieb, drei Karten mit aufklappbaren Leistungen, Werbebudget-Box, Vergleichstabelle, FAQ (FAQ zunächst statisch, in 3.6 auf Sanity umstellen). **Preise nie addieren.**
- [x] **2.2 Startseite** `/` – zunächst aus `3.1`/`3.1a` gebaut (Briefing 0013), dann als **Rebuild auf `3.1b-startseite-neufassung.html`** (Briefing 0021, Neufassung v01) vollständig umgestellt; 3.1/3.1a sind Archiv. Acht Abschnitte, Paketblock **ohne Preise** (Preise nur auf `/pakete`), kein Modulstatus. `/` `live`.
- [x] **2.3 Plattform** `/plattform` aus `3.2c-plattform-neufassung.html` (Neufassung v02, Briefing 0016; alte `3.2` ist Archiv). Sieben Abschnitte; hat die modernen Layout-Tokens (`--gn-wrap-wide`/`--gn-radius-lg`/`--gn-section-y-lg`/`--gn-h2-lg`), die Sektions-Schale `PlattformSection` und die Motion-Infra etabliert, auf denen alle folgenden Seiten aufsetzen. `/plattform` `live`.
- [x] **2.4 So arbeitet GolfNext** `/plattform/so-arbeitet-golfnext` aus `3.3b-so-arbeitet-golfnext-neufassung.html` (Neufassung v01, Briefing 0024; alte `3.3` ist Archiv). Vier Abschnitte: Hero mit der Vier-Nachrichten-Strecke, „Fünf Zielgruppen, fünf eigene Strecken" (fünf umschaltbare Strecken mit je vier Mails – Daten als typisierte Konstante in `content/so-arbeitet-golfnext.ts`), „Die letzte Nachricht schreibt kein System", „Drei Regeln" + geteilter Abschluss. **3.3b trägt neue Texte** – Freds altes 3.3-Briefing war keine Textquelle und wurde nicht eingemischt. Der Umschalter ist eine **native Radiogruppe** (CSS `:checked`, ohne JS und per Tastatur bedienbar, alle fünf Strecken im Server-HTML); Mail-Fenster und Übergabe-Karten sind schematische Illustrationen (`aria-hidden`), **kein Modulstatus**, keine erfundenen Zahlen. `/plattform/so-arbeitet-golfnext` ist `live` – **damit erscheint das Plattform-Dropdown zum ersten Mal** (genau dieser eine Punkt).
- [x] **2.5 Wachstum & Vertrieb** `/wachstum-vertrieb` aus `3.4b-wachstum-vertrieb-neufassung.html` (Neufassung v01, Briefing 0017; alte `3.4` ist Archiv). Sechs Abschnitte (Hero mit Kampagnen-Cockpit, Drei Momente inkl. Such-Tippanimation, Vier-Wege-Slider, Kampagnen-Scroll-Geschichte, Drei Regeln, Fundament) + geteilter Abschluss. Texte wortgleich in `content/wachstum-vertrieb.ts`, `live` in `config/site-structure.ts`. Moderne Layout-Tokens/Sektions-Schale wiederverwendet (kein Retrofit von Pakete/Startseite). Die frühere Anmerkung zur „doppelten Headline" entfällt: die Neufassung hat eigene Abschnitts- und Footer-Überschriften.
- [x] **2.6 Clubprozesse** `/clubprozesse` aus `3.5b-clubprozesse-neufassung.html` (Neufassung v01, Briefing 0018; alte `3.5` ist Archiv). Fünf Abschnitte (Hero mit Clubwebsite + Sonntags-Log, „Drei Dinge" Concierge/Platzstatus/Gastfee, Turnier-News-Bericht-Strecke, Captains App, „Was bleibt") + geteilter Abschluss. Texte wortgleich in `content/clubprozesse.ts`, `live` in `config/site-structure.ts`. Moderne Layout-Tokens/Sektions-Schale und Motion-Infra wiederverwendet (kein Retrofit von Pakete/Startseite). **Modulstatus wird nicht angezeigt** (Entscheidung Stefan): keine Pilot/Im-Einsatz/In-Entwicklung-Badges, keine dev-Labels, nicht die Zeile „Stand je Modul wie im Footer"; die Praxis-Zeile „68 % Rehburg-Loccum" bleibt. Die frühere 3.5-Fassung (Saisonrechnung, Replay-Buttons) entfällt mit der Neufassung.
- [x] **2.7 Über GolfNext** `/ueber-golfnext` aus `3.8b-ueber-golfnext-neufassung.html` (Neufassung v01, Briefing 0019; alte `3.8` ist Archiv). Sechs Abschnitte (Hero mit Porträt-Platzhaltern, Unser Weg, Zwei Grundsätze, Menschen dahinter, Gemeinsame Projekte, Wissen-Slider) + geteilter Footer. **Kein Modulstatus** (Grundsatz /02 + Status-Legende weggelassen, „Zwei Grundsätze"); „Pilotclub"-Wortlaut wortgleich behalten. Porträts/Logos/Artikel als beschriftete Platzhalter **[F]**. Bewegung nach gelockerter Haltung (einmal/dezent, Reduced-Motion-Endzustand, ohne JS lesbar, kein CLS).
- [x] **2.8 Platzhalter-Routen** für Praxis, Team, Kontakt und die zwölf `/module/<slug>` (Briefing 0022, gemeinsam mit 2.9). Ein geteilter Baustein `PlatzhalterSeite`: Eyebrow, genau eine `<h1>` (das `label` aus `config/site-structure.ts`), ein Satz, Button „Zur Startseite", optionaler Rücklink – alle Texte aus `lib/ui/messages.ts` (`uiMessages.platzhalter`), **nichts erfunden**, kein Modulstatus, keine Zeitangabe. Alle vier Routen `noindex, nofollow` und **nicht** `live`, damit die Teaser-Links auf `/` und `/ueber-golfnext` weiter auf `#` zeigen. `/praxis` bleibt trotz der Mocks 3.9a/3.9b Platzhalter (unfreigegebene Beispielartikel; der Blog kommt in Phase 3 aus Sanity). `/kontakt` ist ein Zwischenstand für den CTA-Fallback aus `lib/links.ts` – die echte Seite entsteht in 4.3 (`// TODO 4.3` in der Datei). Unbekannter Modul-Slug → 404. **Navigation nachgezogen:** `getNavModel()` liefert nur noch `live`-Routen, damit Header und Footer keine toten `#`-Punkte mehr führen. **Nachtrag 2.10 (07.09.2026):** Die Platzhalter für Team und die zwölf Modulseiten sind wieder entfallen – die Routen gibt es nicht mehr. Übrig bleiben `/praxis` und `/kontakt`.
- [x] **2.9 404 und Fehlerseite** (Briefing 0022, gemeinsam mit 2.8). `app/not-found.tsx` mit Header, Footer und den beiden Aktionen (Startseite, Erstgespräch über `bookingUrl()`), `app/(site)/error.tsx` mit „Noch einmal versuchen" (`reset()`) und `app/global-error.tsx` ohne Shell. Texte wortgleich aus `lib/ui/messages.ts` (`notFound`, `error`); das Fehlerobjekt wird weder angezeigt noch geloggt. **Bekannte Grenze:** Bei `notFound()` aus einer Segment-Route (unbekannter Modul-Slug) reicht Next den 404-Inhalt nur über den Client nach – der Statuscode 404 stimmt, ohne JavaScript bleibt diese eine Variante leer (siehe `docs/entscheidungen.md`). **Nachtrag 2.10:** `/module/[slug]` war die einzige Route mit `notFound()` und ist gelöscht; der Fall tritt aktuell nicht mehr auf und kommt mit `/praxis/[slug]` in Phase 3 zurück – **vorher zu lösen**.
- [x] **2.10 Navigations- und Routen-Umbau** (Informationsarchitektur v2, Briefing 0023, Entscheidung Fred/Stefan 07.09.2026). Keine neue Seite: Routen werden entfernt, umgehängt und Verweise bereinigt. Praxis verliert `nav: "haupt"` und wird Kind von `/ueber-golfnext` – **die Adresse `/praxis` bleibt**, deshalb keine Weiterleitung; Kontakt bekommt denselben `parent`. `/team`, `/ratgeber` und die zwölf `/module/<slug>` fallen ersatzlos weg (404 ohne Redirect, die Seite war nie unter `www.golfnext.de` erreichbar), ihre Routen-Ordner aus 2.8 sind gelöscht. Clubprozesse hat kein Dropdown mehr, Plattform behält seines mit „So arbeitet GolfNext". `MODULE` bleibt als Datenliste: die zwölf Namen stehen weiter in der Footer-Systemkarte, dort als Text ohne Link. CTA-Ziel `team` ist aus `lib/links.ts` und `content/types.ts` entfernt. **Zwischenstand:** Weil „So arbeitet GolfNext", Praxis und Kontakt noch nicht `live` sind, zeigt die Hauptnavigation vorerst fünf reine Links ohne Dropdown – das ist gewollt. Die Mock-Köpfe zeigen weiterhin die alte Navigation und werden nicht korrigiert.

---

## Phase 3 · Sanity

Skill `sanity-content-model` laden. Details `docs/04-sanity-content-modell.md`.

- [x] **3.1 Sanity einrichten** (Briefing 0026). `next-sanity`, `sanity`, `@sanity/image-url`, `@sanity/vision`, `@sanity/icons`. `sanity.config.ts` (Project `wsj8a3ho`, Dataset `production`), Studio unter `app/studio/[[...tool]]/page.tsx` mit eigenem Layout **ohne Header und Footer**, `sanity.cli.ts`. Die CSP aus 0.9 ist **nur für `/studio`** erweitert (Sanity-Hosts, `core.sanity-cdn.com`, WebSockets, Worker) – die öffentlichen Seiten behalten die strenge Fassung. CORS-Origins von Stefan eingetragen.
- [x] **3.2 Schema** (Briefing 0026). `post`, `category`, `author`, `faq`, `siteSettings` code-first in `sanity/schemaTypes/`, Feldliste nach `docs/04`. Deutsche Feldbeschriftungen und -beschreibungen im Studio. Validierungen (Pflichtfelder, Slug eindeutig und kleingeschrieben, `title` ≤ 90, `excerpt` ≤ 160, `alt` Pflicht sobald ein Bild gesetzt ist). Struktur im Studio: Ratgeber · Ratgeber-Rubriken · Autoren · FAQs · Einstellungen; `siteSettings` als Singleton.
- [x] **3.3 Typegen und Client** (Briefing 0026). `pnpm sanity:typegen` (Extract + Generate → `sanity.types.ts`, eingecheckt), `lib/sanity/client.ts`, `queries.ts`, `image.ts`. Fetch mit Tags (`post`, `category`, `author`, `faq`, `settings`) und `revalidate: 3600` als Netz. Die Abfragen für Liste, Artikel, Rubriken mit Anzahl, Autor und FAQs stehen bereits – gerendert werden sie in 3.4.
- [ ] **3.4 Praxis-Seiten (der Blog).** `/praxis` (Liste, Rubrik-Filter), `/praxis/[slug]` (Artikel mit Portable-Text-Renderer, Autorenbox, verwandte Artikel derselben Rubrik, CTA zum Erstgespräch), `/praxis/thema/[slug]`. Die Route `/praxis` löst dabei die Platzhalterseite aus 2.8 ab. **Vorher klären** (docs/entscheidungen.md): `notFound()` für unbekannte Artikel-Slugs macht die Seite ohne JavaScript leer – „ohne JS lesbar" ist nicht verhandelbar. Typografie nach 2.2 (Artikel 17–18 px, max 70ch). Je Route `loading.tsx` mit passgenauem Skeleton, `error.tsx` mit Alert und Retry, Leerzustand für Filter ohne Treffer, Bilder mit LQIP-Blur (`docs/08`).
- [ ] **3.5 Startinhalte legt Fred im Studio an – nicht der Code** (Entscheidung Stefan, 07.09.2026, Briefing 0026). Rubriken und Autoren sind eigene Dokumenttypen, also Formulare im Studio: Fred legt an, benennt um und löscht selbst; im Artikel wählt er Rubrik und Autor aus Klapplisten. **Der Code legt keinerlei Inhalte an** – keine Beispielrubriken, keine Autoren, keine Artikel. Die fünf Zielgruppen (Einsteiger · Mitgliedschaft · Gäste · Unternehmen · Clubbetrieb) leben als Auswahlliste im Feld `category.audience` und sind ein **Vorschlag** für Freds Rubriken, keine Vorgabe. Offen bleibt nur: Fred trägt Rubriken, Autoren (Fred Hoffmann, Stefan Kühne) und die Einstellungen ein **[F]**.
- [ ] **3.6 FAQ aus Sanity.** Die sieben Pakete-FAQs als `faq`-Dokumente (topic `pakete`) anlegen, Wortlaut aus `3.7-pakete.html`; `/pakete` liest sie aus Sanity, Reihenfolge über `order`.
- [ ] **3.7 Revalidierung.** `POST /api/revalidate` mit Signaturprüfung, Webhook in Sanity anlegen (Filter `_type in ["post","category","author","faq","siteSettings"]`) **[S]**. Test: Artikel ändern → Seite innerhalb Sekunden aktuell.
- [ ] **3.8 Preview.** Draft-Mode für Redakteure (`/api/draft`), Presentation-Tool im Studio optional.

---

## Phase 4 · Formulare und E-Mail

Skill `sendgrid-forms` laden. Details `docs/06-formulare-sendgrid.md`.

- [ ] **4.1 SendGrid-Absender.** Domain Authentication für `golfnext.de` in SendGrid (DNS-Einträge) **[S]** oder vorerst Single-Sender-Verifizierung für `info@golfnext.de`. Ohne verifizierten Absender schlägt der Versand fehl.
- [x] **4.2 Mail-Transport.** `lib/mail/sendgrid.ts` mit Mock-Transport, wenn `SENDGRID_API_KEY` leer ist (schreibt JSON nach `test-results/mail/`). **Ergänzt (0025):** `MAIL_TRANSPORT=mock` erzwingt den Mock-Transport auch bei gesetztem Schlüssel – Playwright startet den Server damit, sonst gehen aus einem Testlauf echte Mails an `info@golfnext.de` raus.
- [x] **4.3 Kontaktseite `/kontakt`** (Briefing **0025**, Mock **`3.10-kontakt.html`**). **Feldliste jetzt aus dem Mock, nicht mehr aus dieser Zeile:** Vorname, Nachname, „Ich bin …" (fünf Rollen), Golfclub oder Anlage, „Worum geht es?" (sechs Anliegen), E-Mail, Telefon, Nachricht, Einwilligung. **Ein Wunschzeit-Feld gibt es nicht mehr** – Termine laufen über cal.com (Entscheidung Stefan, 07.09.2026), nicht über dieses Formular. Zweiter Abschnitt „Nicht jeder schreibt gern ein Formular." mit Erstgespräch (cal.com), Live-Demo und Telefon. Server Action mit zod; Spam-Stufe A (Honeypot, **signierter** Zeitstempel mit `FORM_SIGNING_SECRET`, Payload-Anomalien → stilles Verwerfen) und Stufe B (Rate-Limit über Upstash Redis mit In-Memory-Fallback, Duplikat-Sperre, Heuristik-Score → Betreff-Tag `[Prüfen]`, nichts Legitimes geht verloren). Zustände nach `docs/08`: Blur-Validierung, Inline-Feldfehler, Formular-Alert mit Fokus, Erfolgsalert ersetzt Formular, Button-Ladezustand mit Mindestanzeige, ohne JS funktionsfähig. Alle Texte aus `lib/forms/messages.ts`. **Einbau direkt auf `/kontakt`.** Bis dahin trägt die Route die Platzhalterseite aus Briefing 0022; hier wird sie durch die echte Seite ersetzt (Status in `config/site-structure.ts` dann auf `live`, `noindex` entfernen – die Navigation zieht automatisch nach, und der Menüpunkt „Kontakt" erscheint erstmals im Über-GolfNext-Dropdown). Keine noindex-Testroute nötig. *(Die frühere Annahme aus `docs/10` §40, es brauche keinen Mock, ist mit `3.10` überholt.)*
- [ ] **4.3a Upstash Redis** über den Vercel Marketplace anlegen **[S]**, `UPSTASH_REDIS_REST_URL`/`_TOKEN` in Vercel und `.env.local`. Ohne diese Werte läuft der In-Memory-Fallback (nur lokal/Preview akzeptabel).
- [ ] **4.4 Erstgespräch-CTA.** Alle „Online-Erstgespräch vereinbaren"-Buttons lesen `NEXT_PUBLIC_BOOKING_URL`; Fallback auf Kontaktformular, wenn leer. Fred nennt den bestehenden Buchungsweg **[F]**.
- [x] **4.5 Tests.** *(mit 4.3 erledigt, Briefing 0025.)* Unit für Schema, Signatur, Duplikat, Score, Rate-Limit; E2E mit Mock-Transport inkl. Doppelklick, `aria-busy`, Fokusführung, ohne JS (Skill `golfnext-qa`, Punkte 11–14).
- [ ] **4.6 Nachjustieren.** Zwei Wochen nach Launch die `contact.flagged`-Gründe auswerten, Schwellen anpassen; erst wenn Spam durchkommt, Stufe C (Turnstile) erwägen.

---

## Phase 5 · Recht und Einwilligung

Details `docs/05-consent-dsgvo.md`, Texte `docs/legal/`.

- [ ] **5.1 Impressum** `/impressum` aus `docs/legal/impressum.md`. Offene Stelle: Steuer-/USt-IdNr. prüfen **[F]** (siehe Hinweis in der Datei).
- [ ] **5.2 Datenschutzerklärung** `/datenschutz` aus `docs/legal/datenschutz.md`. Alle `[[…]]`-Stellen mit Stefan/Fred klären **[S][F]**, dann juristische Prüfung (die Datei ist ein fachlich fundierter Entwurf, keine Rechtsberatung).
- [ ] **5.3 Consent-Tool.** `vanilla-cookieconsent` (v3) integrieren: Kategorien „Notwendig" (immer), „Statistik/Marketing" (opt-in). Dialog im Design (Navy/Paper, 4 px Radius, Buttons gleichwertig: „Alle akzeptieren" / „Nur notwendige" / „Einstellungen"). Footer-Link „Cookie-Einstellungen" öffnet den Dialog erneut. Consent-Log lokal (Datum, Version, Auswahl).
- [ ] **5.4 Google Consent Mode v2 und Tracking-Plan.** Ereignisse und Conversion-Definition nach `docs/09-tracking-plan.md` (`lib/tracking/events.ts`, `/danke` noindex). `gtag('consent','default', …denied)` vor allem anderen; nach Einwilligung `update`. GTM erst nach Consent laden (`NEXT_PUBLIC_GTM_ID`). Meta-Pixel nur nach Consent. Ohne IDs in `.env` lädt nichts.
- [ ] **5.5 Vercel Web Analytics** (cookielos) aktivieren – ohne Consent zulässig, in der Datenschutzerklärung nennen.
- [ ] **5.6 Prüfung.** Playwright: vor Consent kein Request an Google/Meta; nach „Nur notwendige" ebenfalls nicht; nach „Alle akzeptieren" ja. Keine externen Fonts. Kein YouTube-Embed ohne Zwei-Klick-Lösung.

---

## Phase 6 · SEO und Auffindbarkeit

Details `docs/07-seo.md`.

- [ ] **6.1 Metadata** je Route (Titel und Beschreibung aus den Briefings, Abschnitt „Technische Seitenangaben"), `metadataBase`, kanonische URLs, `lang="de"`.
- [ ] **6.2 OG-Bilder** dynamisch (`app/opengraph-image.tsx`) im Design: Navy-Fläche, Wortmarke, Seitentitel in Archivo.
- [ ] **6.3 Sitemap und robots** (`app/sitemap.ts`, `app/robots.ts`); Studio, `/_bausteine`, Platzhalter-Routen ausgeschlossen.
- [ ] **6.4 Strukturierte Daten.** `Organization` (Name, Logo, Kontakt), `FAQPage` auf `/pakete`, `Article` auf Ratgeber-Artikeln, `BreadcrumbList`.
- [ ] **6.5 Weiterleitungen** von der bestehenden golfnext.de: `/impressum/` → `/impressum`, `/ueber-golfnext/` bleibt (Briefing), Trailing-Slash-Politik festlegen (Next: ohne). Alte URLs der aktuellen Website erheben **[S]** und in `next.config.ts` `redirects()` eintragen.
- [ ] **6.6 Performance.** Bilder über `next/image` (Sanity-Loader), `priority` nur für Hero-Text-nahe Bilder, kein CLS durch Platzhalter (feste `aspect-ratio`).

---

## Phase 7 · Abnahme und Launch

- [ ] **7.1 Inhalte final.** Alle `Shot`-Platzhalter durch echte Screenshots ersetzt oder Fläche entfernt **[F]**; Porträts eingesetzt (05.09.2026); ~~Partnerlogos mit Freigabe~~ **erledigt am 07.09.2026** – fünf freigegebene Clublogos auf `/ueber-golfnext`, Platzhalter-Kacheln und der Vermerk „Logos und Freigaben…" entfallen; interne Platzhalter-Hinweise entfernt.
- [ ] **7.2 QA komplett** über alle Routen (`qa-runner`, `text-fidelity`, `design-system-guard`, `seo-auditor` je Route), Lighthouse ≥ 95 mobil, Barrierefreiheit manuell: Tastatur durch Header, Akkordeons, Consent-Dialog; Screenreader-Labels der Icon-Links.
- [x] ~~**7.3 Rechtsprüfung** Impressum/Datenschutz durch Fachpartner~~ **entfällt** (Entscheidung Stefan, 07.09.2026). Eine externe juristische Prüfung findet nicht statt; Verantwortung für Inhalt und Freigabe tragen Stefan und Fred. Beide Texte sind seit 07.09.2026 vollständig (`docs/legal/`, keine offenen `[[ … ]]`-Stellen); gebaut werden sie mit Briefing 0028.
- [ ] **7.4 Domain.** `www.golfnext.de` und `golfnext.de` in Vercel, DNS umstellen, HTTPS, Redirect apex → www (oder umgekehrt, festlegen **[S]**). Alte Website erst abschalten, wenn Redirects getestet sind.
- [ ] **7.5 Nach Launch.** Search Console (Sitemap einreichen), Vercel Analytics prüfen, Formular-Testmail, Consent-Dialog auf Smartphone testen, Monitoring der 404s in der ersten Woche.

---

## Später (nicht in diesem Plan)

- Praxis-, Team-, Kontakt- und Modulseiten nach Briefing.
- Newsletter (dann Double-Opt-in und Datenschutz-Ergänzung).
- Live-Demo-Verlinkung und ggf. eingebettete Produkt-Videos (Zwei-Klick).
- Mehrsprachigkeit ist nicht vorgesehen.
