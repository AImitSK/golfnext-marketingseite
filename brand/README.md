# Marke · Logo und Favicon

Dieser Ordner ist die Quelle. Beim Aufsetzen des Next.js-Projekts (Masterplan Schritt 0.6)
werden die Dateien an ihre Zielorte kopiert – der Ordner `brand/` bleibt als Referenz bestehen.

## Wortmarke (`logo/`)

| Datei | Verwendung |
|---|---|
| `golfnext-wortmarke-navy.svg` | Header auf hellem Grund |
| `golfnext-wortmarke-white.svg` | Footer-Systemkarte, dunkler Hero |
| `golfnext-wortmarke-currentColor.svg` | Inline-Variante, Farbe über CSS `color` |

viewBox `0 0 200.32 24.4`, Seitenverhältnis rund 8 : 1. Im Header 19 px hoch, im Footer 16–19 px.
**Unter 12 px Höhe nicht einsetzen** – dort das Signet verwenden (Kapitel 2.1).
Die Wortmarke heißt „GolfNext" ohne den Zusatz „Consulting" (Entscheidung Kapitel 2.1).

Empfohlene Umsetzung in Next.js: eine React-Komponente `<Wortmarke />`, die das SVG inline
rendert (`fill="currentColor"`), damit die Farbe aus dem Kontext kommt. Kein `<img>`.

## Signet und Favicon (`favicon/`)

Monogramm **GN**, Archivo 800, weiß auf Navy, Ecken 88/512 (entspricht den 4 px des Systems bei
Icon-Größe). Das ist Variante A aus Kapitel 2.1 – die dort empfohlene Lösung. Die Buchstaben
sind als Pfade gesetzt, die Schrift muss also nicht geladen werden.

| Datei | Ziel im Next.js-Projekt (App Router) |
|---|---|
| `favicon.ico` (16/32/48) | `app/favicon.ico` |
| `favicon.svg` | `app/icon.svg` |
| `apple-touch-icon.png` (180) | `app/apple-icon.png` |
| `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` | `public/` |
| `site.webmanifest` | `app/manifest.ts` (Inhalt übernehmen) oder `public/site.webmanifest` |
| `signet-gn-navy.svg`, `signet-gn-green.svg` | Social-Profile, E-Mail-Absender, OG-Fallback |
| `icon-maskable-source.svg` | Quelle ohne Rundung, für maskable Icons |

Grün-Variante nur dort, wo Navy nicht funktioniert (z. B. auf dunklem Grund einer Fremdplattform).
