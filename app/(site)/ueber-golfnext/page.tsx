import type { Metadata } from "next";
import { Grundsaetze } from "@/components/pages/ueber-golfnext/Grundsaetze";
import { Hero } from "@/components/pages/ueber-golfnext/Hero";
import { Menschen } from "@/components/pages/ueber-golfnext/Menschen";
import { Projekte } from "@/components/pages/ueber-golfnext/Projekte";
import { Weg } from "@/components/pages/ueber-golfnext/Weg";
import { Wissen } from "@/components/pages/ueber-golfnext/Wissen";
import { FaqSection } from "@/components/site/FaqSection";
import { Footer } from "@/components/site/Footer";
import { routeMetadata } from "@/lib/metadata";
import {
  ueberGolfnext,
  ueberGolfnextGrundsaetze,
  ueberGolfnextHero,
  ueberGolfnextMenschen,
  ueberGolfnextProjekte,
  ueberGolfnextWeg,
  ueberGolfnextWissen,
} from "@/content/ueber-golfnext";

/**
 * Über GolfNext `/ueber-golfnext` – Neufassung v01, gebaut aus Mock
 * `3.8b-ueber-golfnext-neufassung.html` (Briefing 0019). Sechs Abschnitte: Hero mit
 * zwei Porträt-Platzhalterkarten, „Unser Weg“ (Zeitleiste), „Zwei Grundsätze“
 * (Navy-Band), „Die Menschen dahinter“, „Gemeinsame Projekte“ (Club-Platzhalter) und
 * „Wissen“ (Artikel-Slider mit Platzhalterkarten), gefolgt vom persönlichen Abschluss
 * (`FooterClose`, oberer Teil des geteilten `Footer`). Alle Texte kommen wortgleich
 * aus `content/ueber-golfnext.ts`. Genau eine `<h1>` (im Hero).
 *
 * KEIN Modulstatus (Entscheidung Stefan, Briefing 0019): Der Mock-Grundsatz /02
 * „Wir versprechen nur, was läuft.“ mit der Aufzählung „Im Einsatz/Pilot/In
 * Entwicklung“ und der Status-Legende wird NICHT gebaut; die Überschrift lautet
 * „Zwei Grundsätze …“, es wird kein Ersatz-Grundsatz erfunden. Der „Pilotclub“-/
 * Entwicklungspartner-Wortlaut (Grundsatz /01, „Gemeinsame Projekte“, „Wissen“) bleibt
 * wortgleich – er beschreibt Entwicklungspartnerschaften, keinen Modul-Status.
 *
 * **FAQ-Abschnitt vor dem Abschluss-CTA** (Briefing 0030, Nachtrag 09.09.2026): der
 * geteilte Baustein `components/site/FaqSection.tsx` mit `topic: "allgemein"`, Fragen aus
 * Sanity, Reihenfolge über `order`. Zu diesem Thema liegt derzeit **keine** Frage im
 * Dataset – der Abschnitt entfällt deshalb vollständig, samt Eyebrow und Überschrift.
 * Das ist der gewünschte Zustand; sobald Fred im Studio eine Frage anlegt, erscheint er.
 *
 * Metadata: Titel, Beschreibung, Canonical und die OG-Felder kommen über
 * `routeMetadata` aus `config/site-structure.ts` (Masterplan 6.1, Briefing 0034) –
 * die eine Wahrheit. In dieser Datei steht dazu nichts mehr.
 * Die Layout-Tokens der Neufassung (Wrap 1180, Radius 12, Sektion 120, H2 48) sind
 * geteilte Tokens aus `app/globals.css`.
 */
export const metadata: Metadata = routeMetadata(ueberGolfnext.route);

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = ueberGolfnext.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/ueber-golfnext.ts`);
  return found;
}

export default function UeberGolfnextPage() {
  const hero = section("hero");
  const weg = section("weg");
  const grundsaetze = section("grundsaetze");
  const menschen = section("menschen");
  const projekte = section("projekte");
  const wissen = section("wissen");
  const faq = section("faq");

  return (
    <main>
      <Hero
        eyebrow={hero.eyebrow!}
        headline={hero.headline!}
        lead={hero.text![0]}
        data={ueberGolfnextHero}
      />

      <Weg eyebrow={weg.eyebrow!} headline={weg.headline!} lead={weg.text![0]} data={ueberGolfnextWeg} />

      <Grundsaetze
        eyebrow={grundsaetze.eyebrow!}
        headline={grundsaetze.headline!}
        lead={grundsaetze.text![0]}
        data={ueberGolfnextGrundsaetze}
      />

      <Menschen
        eyebrow={menschen.eyebrow!}
        headline={menschen.headline!}
        lead={menschen.text![0]}
        data={ueberGolfnextMenschen}
      />

      <Projekte
        eyebrow={projekte.eyebrow!}
        headline={projekte.headline!}
        lead={projekte.text![0]}
        data={ueberGolfnextProjekte}
      />

      <Wissen
        eyebrow={wissen.eyebrow!}
        headline={wissen.headline!}
        lead={wissen.text![0]}
        data={ueberGolfnextWissen}
      />

      {/* Sand, nicht Mist: „Wissen" davor steht zwar auf Papier, entfällt aber selbst,
          solange kein Artikel veröffentlicht ist – dann stünde die FAQ direkt hinter
          „Gemeinsame Projekte" auf Mist. Sand bricht in beiden Fällen. */}
      <FaqSection
        topic="allgemein"
        id={faq.id}
        eyebrow={faq.eyebrow!}
        headline={faq.headline!}
        variant="sand"
        layout="wide"
      />

      <Footer footerClose={ueberGolfnext.footerClose} />
    </main>
  );
}
