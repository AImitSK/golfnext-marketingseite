# Architektur

## Stack und Begründung

| Baustein | Wahl | Warum |
|---|---|---|
| Framework | Next.js (App Router, RSC, TypeScript) | statisches Rendering der Marketingseiten, ISR für Ratgeber, Server Actions für Formulare, ein Deployment |
| Styling | Tailwind CSS v4 mit `@theme`-Tokens für Primitives und Zustände; **Sektions-CSS aus den Mocks als CSS-Module portiert** | Tokens zentral, kein Runtime-CSS, Mocks bleiben 1:1 erhalten statt in Utilities neu erfunden |
| Bewegung | `motion` (`motion/react`, MIT, kostenlos) | `useInView`, `useReducedMotion`, `whileInView` mit `once`, Layout-Animationen; tree-shakable. Ersetzt handgeschriebene Hooks. **Nicht** Motion+ (kostenpflichtig) – Entscheidung siehe `entscheidungen.md` |
| CMS | Sanity (Project `wsj8a3ho`, Dataset `production`) | Blog/Ratgeber, Rubriken, Autoren, FAQs; Studio im selben Deployment unter `/studio` |
| Hosting | Vercel, Region `fra1` | Preview-Deployments je Branch, Web Analytics cookielos, Edge-Redirects |
| E-Mail | SendGrid (`@sendgrid/mail`) | Formularversand serverseitig, verifizierter Absender `golfnext.de` |
| Tests | Playwright | dieselben Prüfungen wie in der Mock-Phase (Overflow, Icons, Reduced Motion, No-JS) |
| Paketmanager | pnpm | schnell, deterministisch |

## Ordnerstruktur (Ziel)

```
app/
  layout.tsx                 Fonts, Header, Footer, Consent, Analytics
  globals.css                @import "tailwindcss"; @theme {…}; Basis-Styles
  (site)/
    page.tsx                 Startseite
    plattform/page.tsx
    plattform/so-arbeitet-golfnext/page.tsx
    wachstum-vertrieb/page.tsx
    clubprozesse/page.tsx
    pakete/page.tsx
    ueber-golfnext/page.tsx
    praxis/ kontakt/                        (Platzhalter, bis der Inhalt steht)
    praxis/[slug]/page.tsx                  (Phase 3, aus Sanity)
    praxis/thema/[slug]/page.tsx            (Phase 3, aus Sanity)
    impressum/page.tsx  datenschutz/page.tsx
    not-found.tsx
  studio/[[...tool]]/page.tsx
  api/revalidate/route.ts
  api/draft/route.ts
  actions/contact.ts
  sitemap.ts  robots.ts  manifest.ts  opengraph-image.tsx
config/
  site-structure.ts          Routen, Navigation, Status, Metadaten, Flags – eine Wahrheit
content/
  types.ts  <seite>.ts       Websiteinhalte je Seite, wortgleich aus den Briefings
components/
  site/   Header, Nav, MobileNav, Footer, FooterClose, Wortmarke, ConsentBanner, Analytics
  ui/     Button, TextLink, Eyebrow, Section, Hint, Statement, Shot, Faq, Badge, Chip, Portrait
  pages/<seite>/…
  forms/  ContactForm, Field, FieldMessage
  feedback/ Alert, Toast, Empty, Skeleton
  content/PortableText, ArticleCard, AuthorBox
lib/
  sanity/ client.ts  queries.ts  image.ts  live.ts
  mail/   sendgrid.ts
  forms/  schema.ts  messages.ts  spam.ts  ratelimit.ts  disposable-domains.ts
  ui/     messages.ts (Leerzustände, Fehlerseiten, Toast)
  consent/ config.ts
  motion/ variants.ts (gemeinsame Varianten: reveal, rise, draw) · reduced-motion-Helfer
  utils/
sanity/
  schemaTypes/ post.ts category.ts author.ts faq.ts siteSettings.ts index.ts
  structure.ts
sanity.config.ts  sanity.cli.ts  sanity.types.ts (generiert)
tests/e2e/  *.spec.ts  fixtures/<seite>.json
docs/  brand/  (siehe README)
```

## Konventionen

- **Server Components zuerst.** `'use client'` nur für Interaktion (Akkordeon, Tabs, Dropdown, Consent, Animations-Klassen). Client-Komponenten so klein wie möglich, Inhalte per Props/Children hineinreichen.
- **Texte** liegen in `content/<seite>.ts` (statische Seiten) oder in Sanity (Ratgeber, FAQ), nie im JSX. Keine i18n-Schicht.
- **CTA-Ziele** kommen aus `process.env.NEXT_PUBLIC_BOOKING_URL` und `NEXT_PUBLIC_LIVE_DEMO_URL` über `lib/links.ts`. Fehlt ein Wert, rendert der Button einen sinnvollen Fallback (Kontakt), nie einen leeren Link.
- **Bilder** über `next/image`; Sanity-Bilder mit Loader aus `lib/sanity/image.ts`. Platzhalter über `Shot`.
- **Animationen** mit `motion/react`, nur `opacity`/`transform`, Höhen reserviert, einmalig (`viewport.once`), `useReducedMotion` respektiert; Server-HTML rendert den Endzustand, damit die Seite ohne JS vollständig lesbar bleibt.
- **Barrierefreiheit:** semantische Landmarks, eine H1, sichtbarer Fokus, `aria-expanded`/`aria-controls` an Akkordeons, Icon-Links mit `aria-label`, Kontraste nach WCAG AA (Grün-Regel!).
- **Fehlerbehandlung:** Server Actions liefern `{ ok, fieldErrors?, message }`; keine Stacktraces an den Client.
- **Logging:** keine personenbezogenen Daten in Logs.

## Umgebungen

| Umgebung | Domain | Sanity | Mail | Tracking |
|---|---|---|---|---|
| lokal | localhost:3000 | production (lesen), Token aus `.env.local` | Mock-Transport, wenn Key fehlt | aus |
| Preview (Vercel) | `*.vercel.app` | production | echter Versand an Testadresse (`CONTACT_TO_EMAIL` überschreiben) | aus, `noindex` per Header |
| Production | www.golfnext.de | production | echter Versand an info@golfnext.de | nach Consent |

Preview-Deployments bekommen `X-Robots-Tag: noindex` (über `VERCEL_ENV === 'preview'` in `next.config.ts`).

## CLI und MCP

**CLI (einmalig einrichten, Stefan):**
```bash
npm i -g pnpm vercel @sanity/cli
gh auth login            # GitHub
vercel login && vercel link
sanity login             # Sanity-Konto von Stefan/Fred, Project wsj8a3ho
```

**MCP (`.mcp.json`, Claude Code lädt sie beim Start):**
- **Sanity läuft NICHT über `.mcp.json`** (Stand 07.09.2026). Der Eintrag `npx @sanity/mcp-server` wurde entfernt: Das Paket bringt in Version 0.12.2 keine ausführbare Datei mit (`npm error could not determine executable to run`), der Server konnte also nie starten – unabhängig vom Token. Sanity ist stattdessen als **OAuth-Connector** in Claude Code verbunden (Schema lesen, Dokumente abfragen, GROQ). Kein Token in der Shell-Umgebung nötig. Schreibzugriffe auf `production` nur nach Rückfrage.
- `vercel` – Deployments, Logs, Env-Variablen (OAuth beim ersten Aufruf).
- `playwright` – Browser-Prüfung der laufenden Seite aus Claude Code heraus.
- `motion` (AI Kit, kostenloser Teil) – aktuelle Motion-Dokumentation im Kontext, `/motion`-Skill mit Best Practices, CSS-Spring-Generierung. Installation über `npx motion-ai` (Masterplan 0.10); der Installer trägt die gehosteten MCP-Server selbst in `.mcp.json` ein und legt den Skill an. Motion+-Funktionen (MotionScore, Transition-Editor, Beispielcode) bleiben ohne Lizenz einfach inaktiv.

## Qualitätssicherung

Subagents in `.claude/agents/` (Tabelle in `docs/workflow.md`), Slash-Commands `/qa`, `/text-check`, `/review`, `/naechster-schritt`, CI in `.github/workflows/ci.yml` (Typecheck, Lint, Unit, Build, Playwright, axe, visuelle Regression), PR-Template mit Definition of Done.

## Git-Workflow

- `main` = Production. Feature-Branches `feat/<thema>`, Pull Request, Preview-Deployment prüfen, mergen.
- Commits deutsch, Imperativ, ein Thema pro Commit. Keine Secrets, keine `test-results/`.
- Vor jedem Push: `pnpm lint && pnpm typecheck && pnpm build`.
