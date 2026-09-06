import type { Metadata } from "next";
import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { RollenSlider } from "@/components/pages/plattform/RollenSlider";
import { DreiTeile } from "@/components/pages/startseite/DreiTeile";
import { EinWeg } from "@/components/pages/startseite/EinWeg";
import { Hero } from "@/components/pages/startseite/Hero";
import { Pakete } from "@/components/pages/startseite/Pakete";
import { Praxis } from "@/components/pages/startseite/Praxis";
import { Vertrauensleiste } from "@/components/pages/startseite/Vertrauensleiste";
import { Zusagen } from "@/components/pages/startseite/Zusagen";
import { Footer } from "@/components/site/Footer";
import {
  startseite,
  startseiteHero,
  startseitePakete,
  startseitePraxis,
  startseiteRollen,
  startseiteTeile,
  startseiteVertrauen,
  startseiteWeg,
  startseiteZusagen,
} from "@/content/startseite";

/**
 * Startseite `/` – Neufassung v01, gebaut aus Mock
 * `docs/design-system/mocks/3.1b-startseite-neufassung.html` (Briefing 0021). Ersetzt
 * die alte Fassung (0013, aus 3.1/3.1a) vollständig. Acht Abschnitte: Hero
 * (Bleed-Demo + drei schwebende Karten), Vertrauensleiste, „Drei Teile" (Bento mit
 * echten Links auf `/plattform`, `/wachstum-vertrieb`, `/clubprozesse`),
 * Rollen-Slider (geteilte Komponente aus /plattform), „Ein Weg" (4-Schritt-
 * Zeitleiste), Pakete (Fassung 2, **ohne Preise/Summen**), „Vier Zusagen" (Navy-Band
 * + Fred-Zitat) und Praxis. Danach der persönliche Abschluss (`FooterClose`) im
 * geteilten `Footer` – ohne Modulstatus.
 *
 * Alle Texte kommen wortgleich aus `content/startseite.ts`. Genau eine `<h1>` (im
 * Hero). Layout-Tokens der Neufassung (Wrap 1180, Radius 12, Sektion 120, H2 48) sind
 * geteilte Tokens aus `app/globals.css`; die Startseite spricht damit dieselbe
 * moderne Sprache wie die übrigen Seiten (Ausnahme: Pakete-Seite, separater Angleich).
 *
 * Metadata: Briefing 0021 liefert keinen Meta-Titel/-Text → Root-Default
 * (app/layout.tsx) bleibt bestehen, nur der Canonical wird gesetzt (wie die übrigen
 * Seiten). `/` bleibt `live`.
 */
export const metadata: Metadata = {
  alternates: { canonical: startseite.route },
};

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = startseite.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/startseite.ts`);
  return found;
}

export default function Home() {
  const hero = section("hero");
  const teile = section("teile");
  const rollen = section("rollen");
  const weg = section("weg");
  const pakete = section("pakete");
  const zusagen = section("zusagen");
  const praxis = section("praxis");

  return (
    <main>
      <Hero eyebrow={hero.eyebrow!} headline={hero.headline!} lead={hero.text![0]} data={startseiteHero} />

      <Vertrauensleiste data={startseiteVertrauen} />

      <DreiTeile
        eyebrow={teile.eyebrow!}
        headline={teile.headline!}
        lead={teile.text![0]}
        data={startseiteTeile}
      />

      <PlattformSection
        variant="mist"
        overflowHidden
        eyebrow={rollen.eyebrow!}
        headline={rollen.headline!}
        lead={rollen.text![0]}
      >
        <RollenSlider data={startseiteRollen} />
      </PlattformSection>

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

      <Praxis eyebrow={praxis.eyebrow!} headline={praxis.headline!} data={startseitePraxis} />

      <Footer footerClose={startseite.footerClose} />
    </main>
  );
}
