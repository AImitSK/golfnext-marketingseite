import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { WORTMARKE_PFADE, WORTMARKE_VIEWBOX } from "@/components/site/Wortmarke";

/**
 * Das geteilte OG-Bild der Website (Masterplan 6.2, Briefing 0034).
 *
 * Aufbau, 1200 × 630, wie der Hero der Seiten: Navy-Verlauf, die Wortmarke weiß oben
 * links, darunter der Seitentitel in Archivo 800 weiß, unten die Domain. Optional
 * eine Zeile darüber (Rubrik eines Praxis-Artikels) – Signalgrün auf Navy, das ist
 * die einzige Stelle, an der Grün als Text erlaubt ist (CLAUDE.md, Grün-Regel).
 *
 * **Keine externe Schriftquelle** (CLAUDE.md, DSGVO): Archivo liegt als statische
 * TTF-Datei unter `assets/fonts/` im Repo und wird hier aus dem Dateisystem gelesen.
 * `next/font` hilft hier nicht – es liefert WOFF2, und der Renderer hinter
 * `next/og` (Satori) liest ausschließlich TTF/OTF/WOFF.
 *
 * Die Wortmarke kommt aus derselben Quelle wie im Header: den Pfaddaten aus
 * `components/site/Wortmarke.tsx`. Satori zeichnet kein React-SVG mit
 * `currentColor`, deshalb wird daraus hier eine Daten-URL mit festem Weiß gebaut –
 * eine Kopie der Pfade gibt es nicht.
 *
 * **Warum hier literale Hex-Werte und keine `var(--gn-…)` stehen:** Satori kennt
 * weder CSS-Variablen noch Kaskade – es bekommt fertige Werte oder gar keine. Die
 * vier Farben unten sind deshalb 1 : 1 aus `docs/design-system/tokens/tokens.css`
 * bzw. den Hero-Modulen übernommen und mit ihrer Quelle benannt. Ändert sich ein
 * Token, ist das die eine Stelle, die nachzuziehen ist.
 */

/** Maße nach OG-Vorgabe; 1,91 : 1, wie LinkedIn, Facebook und X sie erwarten. */
export const OG_GROESSE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/** Hero-Verlauf, 1 : 1 aus den Hero-Modulen unter `components/pages/`. */
const NAVY_VERLAUF = "linear-gradient(160deg, #012B3D 0%, #01415B 58%, #065877 100%)";
const SIGNALGRUEN = "#00E805";
/** `--gn-on-dark-text` aus `docs/design-system/tokens/tokens.css`. */
const AUF_DUNKEL = "#B9D2DE";

/** Die Wortmarke als Daten-URL, weiß – gebaut aus den Pfaden des Headers. */
function wortmarkeDatenUrl(): string {
  const pfade = WORTMARKE_PFADE.map((d) => `<path d="${d}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WORTMARKE_VIEWBOX}" fill="#FFFFFF">${pfade}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * Die Domain, wie sie unten im Bild steht – aus `NEXT_PUBLIC_SITE_URL`, nicht hart
 * kodiert. „www." fällt weg; im Bild steht der Name, nicht die Adresszeile.
 */
function domain(): string {
  const roh = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.golfnext.de";
  try {
    return new URL(roh).hostname.replace(/^www\./, "");
  } catch {
    return "golfnext.de";
  }
}

/**
 * Schriftgrad des Titels. Lange Titel werden kleiner gesetzt, statt aus dem Bild zu
 * laufen – der Titel bleibt in jedem Fall vollständig lesbar.
 */
function titelGroesse(titel: string): number {
  if (titel.length > 72) return 52;
  if (titel.length > 46) return 62;
  return 72;
}

async function archivo(datei: string) {
  return readFile(join(process.cwd(), "assets", "fonts", datei));
}

/**
 * Erzeugt das OG-Bild einer Seite. `titel` ist der Seitentitel aus
 * `config/site-structure.ts` bzw. der Artikeltitel aus Sanity; `eyebrow` trägt bei
 * Praxis-Artikeln die Rubrik.
 */
export async function ogBild({ titel, eyebrow }: { titel: string; eyebrow?: string }) {
  const [bold, extraBold] = await Promise.all([
    archivo("Archivo-Bold.ttf"),
    archivo("Archivo-ExtraBold.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: NAVY_VERLAUF,
          fontFamily: "Archivo",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori kennt nur <img>; next/image gibt es im OG-Bild nicht. */}
        <img src={wortmarkeDatenUrl()} alt="GolfNext" width={264} height={32} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: SIGNALGRUEN,
              }}
            >
              {/* Grün als Linie und als Text auf Navy – beides ist erlaubt. */}
              <div style={{ width: 48, height: 4, background: SIGNALGRUEN }} />
              {eyebrow}
            </div>
          ) : (
            <div style={{ display: "flex", width: 64, height: 5, background: SIGNALGRUEN, marginBottom: 28 }} />
          )}

          <div
            style={{
              display: "block",
              fontSize: titelGroesse(titel),
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              color: "#FFFFFF",
              // Satori beschneidet lange Titel zeilenweise, statt sie aus dem Bild
              // laufen zu lassen.
              lineClamp: 4,
            }}
          >
            {titel}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: AUF_DUNKEL }}>
          {domain()}
        </div>
      </div>
    ),
    {
      ...OG_GROESSE,
      fonts: [
        { name: "Archivo", data: bold, weight: 700, style: "normal" },
        { name: "Archivo", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
