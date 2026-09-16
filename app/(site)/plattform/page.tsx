import type { Metadata } from "next";
import { Bento } from "@/components/pages/plattform/Bento";
import { Grenze } from "@/components/pages/plattform/Grenze";
import { Hero } from "@/components/pages/plattform/Hero";
import { PlattformModule } from "@/components/pages/plattform/PlattformModule";
import { Footer } from "@/components/site/Footer";
import { routeMetadata } from "@/lib/metadata";
import {
  plattform,
  plattformBento,
  plattformGrenze,
  plattformHero,
  plattformModulGruppen,
  plattformModulLink,
} from "@/content/plattform";

/**
 * Plattform `/plattform` – Struktur nach dem finalen Korrekturbriefing (0035). Vier
 * Abschnitte: Hero mit Bleed-Demo + Platzstatus-Toggle, Bento „Was sich ändert",
 * „Plattform auf einen Blick" (aus dem Footer in den Hauptinhalt verschoben, erscheint
 * websiteweit genau einmal – hier) mit zentriertem Link „So arbeitet GolfNext →", und
 * „Was GolfNext nicht ist". Danach der persönliche Abschluss (`FooterClose`) und der
 * persönliche/rechtliche Footer OHNE Modul-Landkarte.
 *
 * Mit 0035 entfallen: Rollen-Slider „Für jede Rolle im Club", die Scroll-Geschichte
 * „So greift es ineinander" (die ausführliche Journey lebt auf
 * `/plattform/so-arbeitet-golfnext`), „Vier Zusagen" und der FAQ-Abschnitt.
 *
 * Alle Texte kommen wortgleich aus `content/plattform.ts`. Genau eine `<h1>` (im Hero).
 *
 * Metadata: Titel, Beschreibung, Canonical und die OG-Felder kommen über
 * `routeMetadata` aus `config/site-structure.ts` (Masterplan 6.1, Briefing 0034) –
 * die eine Wahrheit. In dieser Datei steht dazu nichts mehr.
 */
export const metadata: Metadata = routeMetadata(plattform.route);

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = plattform.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/plattform.ts`);
  return found;
}

export default function PlattformPage() {
  const hero = section("hero");
  const bento = section("bento");
  const modulblick = section("modulblick");
  const grenze = section("grenze");

  return (
    <main>
      <Hero
        eyebrow={hero.eyebrow!}
        headline={hero.headline!}
        lead={hero.text![0]}
        data={plattformHero}
      />

      <Bento
        eyebrow={bento.eyebrow!}
        headline={bento.headline!}
        lead={bento.text![0]}
        data={plattformBento}
      />

      <PlattformModule
        eyebrow={modulblick.eyebrow!}
        headline={modulblick.headline!}
        gruppen={plattformModulGruppen}
        link={plattformModulLink}
      />

      <Grenze eyebrow={grenze.eyebrow!} headline={grenze.headline!} data={plattformGrenze} />

      <Footer footerClose={plattform.footerClose} />
    </main>
  );
}
