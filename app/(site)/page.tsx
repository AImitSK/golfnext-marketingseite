import type { Metadata } from "next";
import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { DreiTeile } from "@/components/pages/startseite/DreiTeile";
import { EinWeg } from "@/components/pages/startseite/EinWeg";
import { Hero } from "@/components/pages/startseite/Hero";
import { Pakete } from "@/components/pages/startseite/Pakete";
import { Praxis } from "@/components/pages/startseite/Praxis";
import { Zusagen } from "@/components/pages/startseite/Zusagen";
import { Footer } from "@/components/site/Footer";
import { routeMetadata } from "@/lib/metadata";
import {
  startseite,
  startseiteHero,
  startseitePakete,
  startseitePraxis,
  startseiteTeile,
  startseiteWeg,
  startseiteZusagen,
} from "@/content/startseite";

/**
 * Startseite `/` – Neufassung v01, gebaut aus Mock
 * `docs/design-system/mocks/3.1b-startseite-neufassung.html` (Briefing 0021),
 * textlich nachgezogen mit dem „Finalen Briefing Startseite" (Korrekturbriefing).
 * Sechs Abschnitte: Hero (Bleed-Demo + drei schwebende Karten), „Drei Bausteine"
 * (Bento mit echten Links auf `/plattform`, `/wachstum-vertrieb`, `/clubprozesse`),
 * „So greift es ineinander" (4-Schritt-Zeitleiste), Pakete (Fassung 2, **ohne
 * Preise/Summen**), „Vier Zusagen" (Navy-Band + Fred-Zitat) und Ratgeber. Danach der
 * persönliche Abschluss (`FooterClose`) im geteilten `Footer` – ohne Modulstatus.
 * Vertrauensleiste und Rollen-Slider sind mit dem Korrekturbriefing ersatzlos entfallen.
 *
 * Alle Texte kommen wortgleich aus `content/startseite.ts`. Genau eine `<h1>` (im
 * Hero). Layout-Tokens der Neufassung (Wrap 1180, Radius 12, Sektion 120, H2 48) sind
 * geteilte Tokens aus `app/globals.css`; die Startseite spricht damit dieselbe
 * moderne Sprache wie die übrigen Seiten (Ausnahme: Pakete-Seite, separater Angleich).
 *
 * Metadata: Titel, Beschreibung, Canonical und die OG-Felder kommen über
 * `routeMetadata` aus `config/site-structure.ts` (Masterplan 6.1, Briefing 0034) –
 * die eine Wahrheit. In dieser Datei steht dazu nichts mehr.
 */
export const metadata: Metadata = routeMetadata(startseite.route);

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = startseite.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/startseite.ts`);
  return found;
}

export default function Home() {
  const hero = section("hero");
  const teile = section("teile");
  const weg = section("weg");
  const pakete = section("pakete");
  const zusagen = section("zusagen");
  const praxis = section("praxis");

  return (
    <main>
      <Hero eyebrow={hero.eyebrow!} headline={hero.headline!} lead={hero.text![0]} data={startseiteHero} />

      <DreiTeile
        eyebrow={teile.eyebrow!}
        headline={teile.headline!}
        lead={teile.text![0]}
        data={startseiteTeile}
      />

      <PlattformSection eyebrow={weg.eyebrow!} headline={weg.headline!} lead={weg.text![0]}>
        <EinWeg data={startseiteWeg} />
      </PlattformSection>

      <Pakete
        eyebrow={pakete.eyebrow!}
        headline={pakete.headline!}
        lead={pakete.text![0]}
        data={startseitePakete}
      />

      <Zusagen eyebrow={zusagen.eyebrow!} headline={zusagen.headline!} data={startseiteZusagen} />

      <Praxis
        eyebrow={praxis.eyebrow!}
        headline={praxis.headline!}
        lead={praxis.text![0]}
        data={startseitePraxis}
      />

      <Footer footerClose={startseite.footerClose} />
    </main>
  );
}
