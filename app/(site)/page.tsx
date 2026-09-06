import type { Metadata } from "next";
import { Hero } from "@/components/pages/startseite/Hero";
import { Journey } from "@/components/pages/startseite/Journey";
import { Paketblock } from "@/components/pages/startseite/Paketblock";
import { Praxis } from "@/components/pages/startseite/Praxis";
import { Umschalter } from "@/components/pages/startseite/Umschalter";
import { Vorteile } from "@/components/pages/startseite/Vorteile";
import { Footer } from "@/components/site/Footer";
import {
  startseite,
  startseiteHero,
  startseiteJourney,
  startseitePakete,
  startseitePraxis,
  startseiteUmschalter,
  startseiteVorteile,
} from "@/content/startseite";

/**
 * Startseite `/` – Teaser-Seite, gebaut aus Mock `3.1-startseite.html` (Abschnitte
 * 1–5, 7) und `3.1a-startseite-paketblock-fassung2.html` (Abschnitt 6, Preislogik
 * Fassung 2). Alle Texte kommen wortgleich aus `content/startseite.ts`. Genau eine
 * `<h1>` (im Hero). Der persönliche Abschluss ist der obere Teil des dunklen Footers
 * (`FooterClose`) – keine doppelte Gespräch/Demo-Zone.
 *
 * Metadata: das Briefing liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx)
 * bleibt bestehen (Feinschliff Phase 6), nur der Canonical wird gesetzt.
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
  const vorteile = section("vorteile");
  const journey = section("journey");
  const umschalter = section("umschalter");
  const praxis = section("praxis");
  const pakete = section("pakete");

  return (
    <main>
      <Hero
        eyebrow={hero.eyebrow!}
        headlineLines={hero.headlineLines!}
        lead={hero.text![0]}
        data={startseiteHero}
      />

      <Vorteile eyebrow={vorteile.eyebrow!} headline={vorteile.headline!} data={startseiteVorteile} />

      <Journey
        eyebrow={journey.eyebrow!}
        headline={journey.headline!}
        lead={journey.text![0]}
        data={startseiteJourney}
      />

      <Umschalter
        eyebrow={umschalter.eyebrow!}
        headline={umschalter.headline!}
        lead={umschalter.text![0]}
        data={startseiteUmschalter}
      />

      <Praxis
        eyebrow={praxis.eyebrow!}
        headline={praxis.headline!}
        lead={praxis.text![0]}
        data={startseitePraxis}
      />

      <Paketblock
        id={pakete.id}
        eyebrow={pakete.eyebrow!}
        headline={pakete.headline!}
        lead={pakete.text![0]}
        data={startseitePakete}
      />

      <Footer footerClose={startseite.footerClose} />
    </main>
  );
}
