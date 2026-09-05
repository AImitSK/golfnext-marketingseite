# GolfNext Marketing-Website

Next.js · Sanity · Vercel · SendGrid. Arbeitsgrundlage für Claude Code.

- **Einstieg für Claude Code:** `CLAUDE.md`, dann `docs/00-masterplan.md` und `docs/workflow.md`. Erstes Arbeitsbriefing: `docs/briefings/0001-phase-0-grundgeruest.md`.
- **Subagents und Commands:** `.claude/agents/`, `.claude/commands/`. **CI:** `.github/workflows/ci.yml`.
- **Design-System und Mocks:** `docs/design-system/` – die HTML-Mocks sind die verbindliche Vorlage.
- **Rechtstexte:** `docs/legal/`.
- **Marke:** `brand/` (Wortmarke, Signet, Favicon-Set).

Repository: https://github.com/AImitSK/golfnext-marketingseite.git

## Lokal starten (nach Masterplan Phase 0)

```bash
pnpm install
cp .env.example .env.local   # Werte eintragen – oder die vorhandene .env.local verwenden
pnpm dev
```

Secrets stehen ausschließlich in `.env.local` (gitignored) und in den Vercel-Umgebungsvariablen.
