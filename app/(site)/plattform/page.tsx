import type { Metadata } from "next";
import { Bento } from "@/components/pages/plattform/Bento";
import { Grenze } from "@/components/pages/plattform/Grenze";
import { Hero } from "@/components/pages/plattform/Hero";
import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { RollenSlider } from "@/components/pages/plattform/RollenSlider";
import { ScrollStory } from "@/components/pages/plattform/ScrollStory";
import { Zusagen } from "@/components/pages/plattform/Zusagen";
import { FaqSection } from "@/components/site/FaqSection";
import { Footer } from "@/components/site/Footer";
import { routeMetadata } from "@/lib/metadata";
import {
  plattform,
  plattformBento,
  plattformGrenze,
  plattformHero,
  plattformRollen,
  plattformStory,
  plattformStoryLinks,
  plattformZusagen,
} from "@/content/plattform";

/**
 * Plattform `/plattform` – Neufassung v02, gebaut aus Mock `3.2c-plattform-neufassung.html`
 * (Briefing 0016). Sieben Abschnitte: Hero mit Bleed-Demo + Platzstatus-Toggle, Bento
 * „Drei Dinge", Rollen-Slider, Scroll-Geschichte mit klebendem Rahmen, „Klare Grenze",
 * „Vier Zusagen" und der persönliche Abschluss (`FooterClose`, oberer Teil des geteilten
 * `Footer`). Alle Texte kommen wortgleich aus `content/plattform.ts`. Genau eine `<h1>`
 * (im Hero). Modulstatus wird nicht angezeigt (geteilter Footer). Die Layout-Erweiterungen
 * der Neufassung (Wrap 1180, Radius 12, Sektion 120, H2 48) sind benannte Tokens und
 * wirken nur auf dieser Seite (PlattformSection / Modul-CSS).
 *
 * **FAQ-Abschnitt vor dem Abschluss-CTA** (Briefing 0030, Nachtrag 09.09.2026): der
 * geteilte Baustein `components/site/FaqSection.tsx` mit `topic: "plattform"`, Fragen aus
 * Sanity, Reihenfolge über `order`. Zu diesem Thema liegt derzeit **keine** Frage im
 * Dataset – der Abschnitt entfällt deshalb vollständig, samt Eyebrow und Überschrift.
 * Das ist der gewünschte Zustand; sobald Fred im Studio eine Frage anlegt, erscheint er.
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
  const rollen = section("rollen");
  const story = section("story");
  const grenze = section("grenze");
  const zusagen = section("zusagen");
  const faq = section("faq");

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

      <PlattformSection
        variant="mist"
        overflowHidden
        eyebrow={rollen.eyebrow!}
        headline={rollen.headline!}
        lead={rollen.text![0]}
      >
        <RollenSlider data={plattformRollen} />
      </PlattformSection>

      <PlattformSection
        eyebrow={story.eyebrow!}
        headline={story.headline!}
        lead={story.text![0]}
      >
        <ScrollStory steps={plattformStory} links={plattformStoryLinks} />
      </PlattformSection>

      <Grenze eyebrow={grenze.eyebrow!} headline={grenze.headline!} data={plattformGrenze} />

      <Zusagen eyebrow={zusagen.eyebrow!} headline={zusagen.headline!} data={plattformZusagen} />

      {/* „Vier Zusagen" davor steht auf Papier – die FAQ deshalb auf Mist. */}
      <FaqSection
        topic="plattform"
        id={faq.id}
        eyebrow={faq.eyebrow!}
        headline={faq.headline!}
        variant="mist"
        layout="wide"
      />

      <Footer footerClose={plattform.footerClose} />
    </main>
  );
}
