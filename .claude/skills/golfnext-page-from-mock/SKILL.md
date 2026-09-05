---
name: golfnext-page-from-mock
description: Vorgehen, um eine Seite aus dem HTML-Mock in docs/design-system/mocks und dem zugehörigen Briefing als Next.js-Route zu bauen – Texte wortgleich, Struktur treu, Bewegung regelkonform. Immer laden, wenn eine neue Seite oder Sektion entsteht.
---

# Seite aus Mock bauen

## Reihenfolge

1. **Briefing lesen** (`docs/design-system/briefings/<seite>-*.md`). Nur „Websiteinhalt" wird veröffentlicht. Umsetzungshinweise steuern das Layout, erscheinen aber nicht auf der Seite.
2. **Mock öffnen** (`docs/design-system/mocks/<seite>.html`) und gliedern: Header · Sektionen (Kommentare `<!-- ==== n · TITEL ==== -->`) · Footer. Das `<style>` enthält pro Sektion einen Block `/* ---- n · … ---- */` – daraus die Komponenten-Styles ableiten.
3. **Route anlegen** unter `app/(site)/<slug>/page.tsx` mit `generateMetadata` (Titel und Beschreibung aus dem Briefing, Abschnitt „Technische Seitenangaben").
4. **Inhalte zuerst als Daten:** `content/<seite>.ts` nach dem Muster `content/ueber-golfnext.ts` anlegen – nur Websiteinhalt, wortgleich, Desktop-Umbrüche als `headlineLines`. Danach `text-fidelity` laufen lassen, **bevor** Komponenten entstehen.
5. **CSS portieren, nicht übersetzen.** Den Sektionsblock `/* ---- n · … ---- */` aus dem Mock-`<style>` als `components/pages/<seite>/<Sektion>.module.css` übernehmen; Token-Namen auf `--gn-…` umstellen, sonst nichts ändern. Tailwind nur für Wrap/Section/Eyebrow/Button und Zustände.
6. **Sektionen als Komponenten** in `components/pages/<seite>/` – eine Datei pro Sektion, Server Components, Texte aus `content/`. Interaktive Teile (Akkordeon, Tabs, Animationen) als kleine Client-Komponenten (`'use client'`) mit möglichst wenig Logik.
7. **Bilder** als `<Shot ratio="16/10" tagline="Screenshot folgt" title="…" text="Benötigtes Bild: …" />`. Kein Stock, kein KI-Bild, keine erfundene Oberfläche. Sektionen, die der Launch-Umfang (`docs/10`) ausblendet, hinter das Flag aus `site-structure.ts` legen – bauen, aber nicht rendern.
8. **Bewegung** mit `motion/react` nach `golfnext-design-system` (Skill `/motion` laden). Zuerst ohne JS prüfen, dann mit.
9. **Subagents**: `text-fidelity`, `design-system-guard`, `qa-runner`, `seo-auditor`. FAILs beheben, erneut laufen lassen.
10. **Masterplan** abhaken, `docs/03-seiten-und-routen.md` und `config/site-structure.ts` (Status `live`) aktualisieren, committen, PR.

## Übersetzungstabelle Mock → Next.js

| Mock                                    | Next.js                                                                                            |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `<header class="hdr">`                  | `components/site/Header.tsx`, aktive Seite via `usePathname` (Client) oder Prop                    |
| `<footer class="pfoot">` mit `.f-close` | `components/site/Footer.tsx` + `FooterClose` mit Props `eyebrow/headline/text/cta/secondary`       |
| `.jslogo` + `_logo.js`                  | `<Wortmarke className="h-[19px] text-navy" />` inline-SVG                                          |
| `<a class="btn-cta">` ohne href         | `<Button href={process.env.NEXT_PUBLIC_BOOKING_URL}>` – CTA-Ziele aus `.env`, nie hart kodieren    |
| Inline-`<style>`-Sektionen              | 1:1 als `*.module.css` portiert (Tokens `--gn-…`); Tailwind nur für Primitives                     |
| IntersectionObserver-Skript             | `motion/react` `whileInView` + `viewport={{ once: true }}`, Varianten aus `lib/motion/variants.ts` |
| `@media(prefers-reduced-motion)`        | `useReducedMotion()` aus `motion/react` + `motion-reduce:`-Varianten                               |
| Texte im Markup                         | `content/<seite>.ts`, importiert in die Sektionskomponente                                         |

## Was nicht in die Seite gehört

- Der `.hint`-Hinweis „Platzhalter. Fred liefert …" ist ein interner Vermerk. In die Website nur, solange die Seite als Preview läuft; vor Launch entfernen (Masterplan Phase 7 prüft das).
- Design-Konzept-Kapitel 1.1–2.5 sind Referenz, keine Seiten.
- Fassung 1 der Pakete-Seite (`3.6-pakete-fassung1-archiv.html`) ist Archiv. Gebaut wird `3.7-pakete.html`.

## Offene Briefings

Praxis, Team, Kontakt und die Modulseiten haben noch kein Briefing. Diese Routen nicht erfinden – Platzhalter-Route mit `noindex` und Hinweis im Masterplan.
