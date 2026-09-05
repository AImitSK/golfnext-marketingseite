---
name: sanity-content-model
description: Konventionen für das Sanity-Content-Modell der GolfNext-Website (Blog/Ratgeber, Rubriken, Autoren, FAQs), GROQ-Muster, Studio-Einbettung, Revalidierung. Laden bei allem, was Sanity-Schema, Studio, Queries oder Content-Rendering betrifft.
---

# Sanity für GolfNext

Project `wsj8a3ho`, Dataset `production`, API-Version `2025-01-01`. Studio eingebettet unter `/studio` (Route Group `app/studio/[[...tool]]/page.tsx`). Details in `docs/04-sanity-content-modell.md`.

## Dokumenttypen

| Typ | Zweck | Pflichtfelder |
|---|---|---|
| `post` | Blog-/Ratgeberartikel | `title`, `slug`, `excerpt` (≤ 160 Zeichen), `category` (ref), `author` (ref), `publishedAt`, `body` (Portable Text), `mainImage` mit `alt`, `seo{title,description,noindex}` |
| `category` | Rubrik | `title`, `slug`, `description`, `audience` (Einsteiger · Mitgliedschaft · Gäste · Unternehmen · Clubbetrieb) |
| `author` | Autor | `name`, `slug`, `role`, `image` mit `alt`, `bio` (kurz) |
| `faq` | Frage/Antwort | `question`, `answer` (Portable Text, einfach), `topic` (pakete · plattform · clubprozesse · allgemein), `order` |
| `siteSettings` (Singleton) | Kontakt, Social, Default-SEO | `phone`, `email`, `bookingUrl`, `liveDemoUrl`, `defaultOgImage` |

Regeln: `slug` aus `title` generieren, deutsch, ohne Umlaute (`ae/oe/ue/ss`). Keine Marketingzahlen in Vorlagen. Bilder immer mit Pflicht-`alt`. Portable Text nur mit den Blöcken, die die Website rendert: `h2`, `h3`, `normal`, `blockquote`, Listen, Links, `image`, `callout` (Hinweiskasten), `cta` (Button mit Label + Zieltyp).

## Routen

- `/ratgeber` – Übersicht, Filter nach `category` (Serverseitig via Searchparam, keine Client-Filterlogik nötig).
- `/ratgeber/[slug]` – Artikel; `generateStaticParams` aus Sanity, `revalidate = 3600` plus On-Demand-Revalidierung.
- `/ratgeber/rubrik/[slug]` – Rubrikseite.
- FAQs erscheinen auf `/pakete` (topic `pakete`) und ggf. weiteren Seiten – Query nach `topic`, Sortierung `order asc`.

## Client und Queries

- `lib/sanity/client.ts` (`next-sanity`, `useCdn: true` im Prod-Read, `false` mit Token für Drafts).
- Queries in `lib/sanity/queries.ts` als `defineQuery`, Typen generieren mit `sanity typegen` (`pnpm sanity:typegen`) → `sanity.types.ts`.
- Bilder über `@sanity/image-url` mit `next/image`-Loader; Hotspot/Crop respektieren.

Beispiel:
```groq
*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...12]{
  title, "slug": slug.current, excerpt, publishedAt,
  mainImage{asset->{_id, url, metadata{lqip, dimensions}}, alt},
  category->{title, "slug": slug.current, audience},
  author->{name, "slug": slug.current}
}
```

## Revalidierung

Sanity-Webhook (Projekt → API → Webhooks) → `POST /api/revalidate` mit Header-Signatur (`SANITY_REVALIDATE_SECRET`, `@sanity/webhook`). Handler ruft `revalidateTag('post')` bzw. `revalidateTag('faq')`; alle Fetches taggen.

## MCP

Der Sanity-MCP-Server (`.mcp.json`) kann Schema lesen, Dokumente anlegen und GROQ ausführen. Vor Schreiboperationen im Dataset `production` Rückfrage an Stefan. Beispielinhalte nur mit klar erkennbarem Titel („Beispiel: …") und `noindex: true`.

## Schema-Änderung – Ablauf

1. Schema unter `sanity/schemaTypes/*.ts` ändern.
2. `pnpm sanity:typegen`, dann Queries/Komponenten anpassen.
3. `pnpm sanity:deploy` (Schema deployen, damit MCP und Studio aktuell sind).
4. Eintrag in `docs/04-sanity-content-modell.md`.
