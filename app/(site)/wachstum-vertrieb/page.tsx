import type { Metadata } from "next";
import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { Fundament } from "@/components/pages/wachstum-vertrieb/Fundament";
import { Hero } from "@/components/pages/wachstum-vertrieb/Hero";
import { Kampagne } from "@/components/pages/wachstum-vertrieb/Kampagne";
import { Momente } from "@/components/pages/wachstum-vertrieb/Momente";
import { Regeln } from "@/components/pages/wachstum-vertrieb/Regeln";
import { Wege } from "@/components/pages/wachstum-vertrieb/Wege";
import { FaqSection } from "@/components/site/FaqSection";
import { Footer } from "@/components/site/Footer";
import { routeMetadata } from "@/lib/metadata";
import {
  wachstumFundament,
  wachstumHero,
  wachstumKampagne,
  wachstumKampagneLinks,
  wachstumMomente,
  wachstumRegeln,
  wachstumVertrieb,
  wachstumWaynote,
  wachstumWege,
} from "@/content/wachstum-vertrieb";

/**
 * Wachstum & Vertrieb `/wachstum-vertrieb` – Neufassung v01, gebaut aus Mock
 * `3.4b-wachstum-vertrieb-neufassung.html` (Briefing 0017). Sechs Abschnitte: Hero mit
 * Kampagnen-Cockpit + Instagram-Handy, „Drei Momente" (Bento inkl. Such-Tippanimation),
 * „Vier Wege"-Slider, Kampagnen-Scroll-Geschichte, „Drei Regeln" (Navy-Band) und
 * „Fundament" (aufgefächerte Landingpages), gefolgt vom persönlichen Abschluss
 * (`FooterClose`, oberer Teil des geteilten `Footer`). Alle Texte kommen wortgleich aus
 * `content/wachstum-vertrieb.ts`. Genau eine `<h1>` (im Hero). Modulstatus wird nicht
 * angezeigt (geteilter Footer). Die Layout-Tokens der Neufassung (Wrap 1180, Radius 12,
 * Sektion 120, H2 48) sind geteilte Tokens aus `app/globals.css`.
 *
 * **FAQ-Abschnitt vor dem Abschluss-CTA** (Briefing 0030, Nachtrag 09.09.2026): der
 * geteilte Baustein `components/site/FaqSection.tsx` mit `topic: "wachstum"`, Fragen aus
 * Sanity, Reihenfolge über `order`. Zu diesem Thema liegt derzeit **keine** Frage im
 * Dataset – der Abschnitt entfällt deshalb vollständig, samt Eyebrow und Überschrift.
 * Das ist der gewünschte Zustand; sobald Fred im Studio eine Frage anlegt, erscheint er.
 *
 * Metadata: Titel, Beschreibung, Canonical und die OG-Felder kommen über
 * `routeMetadata` aus `config/site-structure.ts` (Masterplan 6.1, Briefing 0034) –
 * die eine Wahrheit. In dieser Datei steht dazu nichts mehr.
 */
export const metadata: Metadata = routeMetadata(wachstumVertrieb.route);

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = wachstumVertrieb.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/wachstum-vertrieb.ts`);
  return found;
}

export default function WachstumVertriebPage() {
  const hero = section("hero");
  const momente = section("momente");
  const wege = section("wege");
  const kampagne = section("kampagne");
  const regeln = section("regeln");
  const fundament = section("fundament");
  const faq = section("faq");

  return (
    <main>
      <Hero eyebrow={hero.eyebrow!} headline={hero.headline!} lead={hero.text![0]} data={wachstumHero} />

      <Momente
        eyebrow={momente.eyebrow!}
        headline={momente.headline!}
        lead={momente.text![0]}
        data={wachstumMomente}
      />

      <Wege
        eyebrow={wege.eyebrow!}
        headline={wege.headline!}
        lead={wege.text![0]}
        data={wachstumWege}
        waynote={wachstumWaynote}
      />

      <PlattformSection
        eyebrow={kampagne.eyebrow!}
        headline={kampagne.headline!}
        lead={kampagne.text![0]}
      >
        <Kampagne steps={wachstumKampagne} links={wachstumKampagneLinks} />
      </PlattformSection>

      <Regeln
        eyebrow={regeln.eyebrow!}
        headline={regeln.headline!}
        lead={regeln.text![0]}
        data={wachstumRegeln}
      />

      <Fundament eyebrow={fundament.eyebrow!} headline={fundament.headline!} data={wachstumFundament} />

      {/* Das „Fundament" davor steht auf Sand – die FAQ deshalb auf Mist. */}
      <FaqSection
        topic="wachstum"
        id={faq.id}
        eyebrow={faq.eyebrow!}
        headline={faq.headline!}
        variant="mist"
        layout="wide"
      />

      <Footer footerClose={wachstumVertrieb.footerClose} />
    </main>
  );
}
