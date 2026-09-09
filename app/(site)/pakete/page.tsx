import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Basis } from "@/components/pages/pakete/Basis";
import { Hero } from "@/components/pages/pakete/Hero";
import { Pakete } from "@/components/pages/pakete/Pakete";
import { Vergleich } from "@/components/pages/pakete/Vergleich";
import { FaqSection } from "@/components/site/FaqSection";
import { pakete, paketeBasis, paketeHero, paketePakete, paketeVergleich } from "@/content/pakete";

/**
 * /pakete – die verkaufsstärkste Seite, gebaut aus dem gültigen Mock
 * `docs/design-system/mocks/3.7-pakete.html` (Fassung 2). Alle Texte kommen
 * wortgleich aus `content/pakete.ts`, Preise werden nie addiert. Genau eine `<h1>`
 * (im Hero). Metadata/Canonical aus `config/site-structure.ts` (via content/meta).
 *
 * **Ausnahme: die FAQ.** Seit Briefing 0030 (Masterplan 3.6) kommen Fragen und
 * Antworten aus Sanity (`faq`, `topic: "pakete"`), nicht mehr aus `content/pakete.ts` –
 * dort ist der Wortlaut gelöscht. Gebaut ist das im geteilten Baustein
 * `components/site/FaqSection.tsx`, den seit dem Nachtrag vom 09.09.2026 fünf Seiten
 * benutzen; er entfällt vollständig, wenn Sanity zum Thema nichts liefert. Der
 * Sektionskopf (Eyebrow, Überschrift) bleibt Seitentext in `content/pakete.ts`.
 */
export const metadata: Metadata = {
  title: { absolute: pakete.meta.title ?? "GolfNext Pakete" },
  description: pakete.meta.description ?? undefined,
  alternates: { canonical: pakete.route },
};

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = pakete.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/pakete.ts`);
  return found;
}

export default function PaketePage() {
  const hero = section("hero");
  const basis = section("basis");
  const paketeSec = section("pakete");
  const vergleich = section("vergleich");
  const faq = section("faq");

  return (
    <main>
      <Hero
        eyebrow={hero.eyebrow!}
        headlineLines={hero.headlineLines!}
        lead={hero.text![0]}
        data={paketeHero}
      />

      <Basis
        eyebrow={basis.eyebrow!}
        headline={basis.headline!}
        lead={basis.text![0]}
        data={paketeBasis}
      />

      <Pakete
        id={paketeSec.id}
        eyebrow={paketeSec.eyebrow!}
        headline={paketeSec.headline!}
        lead={paketeSec.text![0]}
        data={paketePakete}
      />

      <Vergleich
        id={vergleich.id}
        eyebrow={vergleich.eyebrow!}
        headline={vergleich.headline!}
        lead={vergleich.text![0]}
        data={paketeVergleich}
      />

      {/* Der Vergleich davor steht auf Papier – die FAQ deshalb auf Mist. */}
      <FaqSection
        topic="pakete"
        id={faq.id}
        eyebrow={faq.eyebrow!}
        headline={faq.headline!}
        variant="mist"
      />

      <Footer footerClose={pakete.footerClose} />
    </main>
  );
}
