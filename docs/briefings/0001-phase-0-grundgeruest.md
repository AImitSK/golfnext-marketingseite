# 0001 · Phase 0 – Repository und Grundgerüst

Masterplan-Schritte: 0.1 bis 0.12 · Branch: `feat/grundgeruest` (erster Commit direkt auf `main` ist erlaubt, danach Branches) · Phase: 0

## Kontext und Lesereihenfolge
1. `CLAUDE.md`
2. `docs/00-masterplan.md` (Phase 0 komplett), `docs/01-architektur.md`
3. `docs/design-system/tokens/` (alle drei Dateien), `brand/README.md`
4. `docs/workflow.md`, `.claude/skills/golfnext-qa/SKILL.md`
5. `config/site-structure.ts` und `content/README.md` (Muster, die in diesem Schritt technisch angebunden werden)

## Harte Vorgaben
- Das Verzeichnis ist nicht leer: Next.js in einem Temp-Ordner anlegen und hineinverschieben (Masterplan 0.2). `README.md` und `.gitignore` aus dem Repo behalten (mergen, nicht überschreiben).
- `.env.local` niemals committen; erster `git status` muss sie als ignoriert zeigen.
- Fonts ausschließlich über `next/font` (Archivo 400–800, Inter 400–700). Ein Request an `fonts.googleapis.com` ist ein Blocker.
- Tokens exakt aus `tailwind-theme.css` übernehmen, keine Werte ändern oder ergänzen.
- `motion` installieren und `npx motion-ai` ausführen (nur kostenloser Teil, kein Motion+).
- Keine Seiten, Komponenten oder Inhalte bauen – nur das Gerüst. Die Standard-Startseite von Next darf durch eine leere Seite mit Wortmarke ersetzt werden, mehr nicht.

## Aufgaben
1. Git initialisieren, Remote setzen, `.gitignore` prüfen, erster Commit „Lege Projektgerüst an".
2. Next.js scaffolden (Temp-Ordner), pnpm, TypeScript strict, App Router, Tailwind v4, ESLint, Prettier mit Tailwind-Plugin, `pnpm typecheck`, `.node-version` = 22.
3. `app/globals.css`: `@import "tailwindcss"` + `@theme` aus `docs/design-system/tokens/tailwind-theme.css` + Basis-Styles (body paper/ink 17px/1.65, Headlines Archivo, Fokusring).
4. Fonts über `next/font/google` mit CSS-Variablen `--font-archivo`, `--font-inter` im Root-Layout.
5. Marke: Favicon-Set aus `brand/favicon/` nach `app/` bzw. `public/`, `app/manifest.ts`, Komponente `components/site/Wortmarke.tsx` (inline SVG aus `brand/logo/golfnext-wortmarke-currentColor.svg`, `data-large-svg`).
6. `config/site-structure.ts` einbinden (Typen prüfen, `pnpm typecheck` grün), `lib/links.ts` für CTA-Ziele aus `.env`.
7. `content/` mit `content/ueber-golfnext.ts` als Muster übernehmen; Typ `PageContent` in `content/types.ts`.
8. Playwright einrichten: `playwright.config.ts` (webServer `pnpm start`, Projekte 390/768/1024/1180/1440), `tests/e2e/smoke.spec.ts` (Startseite lädt, kein Overflow, kein Konsolenfehler, kein Request an Google-Fonts), Skripte `test:e2e`, `test:a11y` (@axe-core/playwright), `test:visual` (leer, aber lauffähig).
9. Vitest für Unit-Tests (`pnpm test`), ein Beispieltest für `lib/links.ts`.
10. Sicherheits-Header in `next.config.ts` (CSP Report-Only, Referrer-Policy, Permissions-Policy, X-Frame-Options), `X-Robots-Tag: noindex` für Preview.
11. `pnpm add motion`, dann `npx motion-ai` (Projekt, Claude Code); prüfen, dass `/motion` als Skill erscheint.
12. `vercel link` **[S]**, Env-Variablen in Vercel anlegen **[S]**, erster Deploy.
13. CI: `.github/workflows/ci.yml` liegt bereits im Repo – Skripte so benennen, dass sie passen (`typecheck`, `lint`, `test`, `build`, `test:e2e`, `test:a11y`, `test:visual`). Erster PR muss grün sein.

## Skills und Subagents
- Skills: `golfnext-design-system` (Tokens), `golfnext-qa` (Testaufbau).
- Subagents nach dem Bauen: `design-system-guard` (Fonts, Tokens), `qa-runner` (Smoke), `pr-reviewer`.

## PR und Merge
Nach Aufgabe 1 direkt auf `main`; ab Aufgabe 2 auf `feat/grundgeruest`. PR-Template ausfüllen, CI grün, Preview ansehen, `pr-reviewer`, Merge.

## Akzeptanzkriterien
- [ ] `pnpm dev` zeigt eine Seite mit der Wortmarke in Navy auf Paper, Schrift Archivo/Inter, ohne externen Font-Request (Netzwerk-Tab).
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm build` grün; CI grün.
- [ ] `pnpm test:e2e` läuft gegen den Produktionsbuild und ist grün (Smoke).
- [ ] Favicon (GN-Monogramm) im Tab sichtbar; `/manifest.webmanifest` liefert die Icons.
- [ ] `git ls-files` enthält keine `.env.local`; Secret-Scan in CI grün.
- [ ] `npx motion-ai` ausgeführt, `/motion` als Skill verfügbar, `.mcp.json` enthält die Motion-Einträge zusätzlich zu Sanity, Vercel, Playwright.
- [ ] Vercel-Deploy von `main` erreichbar; Preview-Deployments liefern `X-Robots-Tag: noindex`.
- [ ] Masterplan 0.1–0.12 abgehakt.

## Was du NICHT tust
- Keine Header-/Footer-Komponenten, keine Sektionen, keine Seiten (das ist Phase 1 und 2).
- Kein Sanity, keine Formulare, kein Consent, kein Tracking.
- Keine Änderung an Tokens, Mocks, Briefings oder Rechtstexten.
- Kein Motion+-Kauf, keine Motion-Premium-Komponenten.

## Offene Fragen an Stefan/Fred
- Vercel-Team und Projektname **[S]** (vor Aufgabe 12).
- Soll `www.golfnext.de` oder `golfnext.de` kanonisch sein **[S]** (für `NEXT_PUBLIC_SITE_URL` und spätere Redirects)?

---

## Kopierbarer Umsetzungs-Prompt

```
Lies CLAUDE.md und das Briefing docs/briefings/0001-phase-0-grundgeruest.md. Setze es vollständig um,
Aufgabe für Aufgabe, und hake die Masterplan-Schritte 0.1 bis 0.12 in docs/00-masterplan.md ab.
Baue über die Skills golfnext-design-system und golfnext-qa. Rufe danach die Subagents design-system-guard
und qa-runner auf und behebe deren FAILs. Branch feat/grundgeruest (nach dem ersten Commit auf main),
PR nach .github/pull_request_template.md, CI grün, dann pr-reviewer.
Bei den [S]-Punkten (Vercel-Link, Env-Variablen) stoppe und frage mich.
Schließe mit der dreisätzigen Zusammenfassung: Was gebaut, was offen, welche Abweichungen vom Briefing.
```
