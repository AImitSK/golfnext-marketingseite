import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Basis } from "@/components/pages/pakete/Basis";
import { Hero } from "@/components/pages/pakete/Hero";
import { Pakete } from "@/components/pages/pakete/Pakete";
import { Vergleich } from "@/components/pages/pakete/Vergleich";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Faq } from "@/components/ui/Faq";
import { Section } from "@/components/ui/Section";
import { Wrap } from "@/components/ui/Wrap";
import {
  pakete,
  paketeBasis,
  paketeFaq,
  paketeHero,
  paketePakete,
  paketeVergleich,
} from "@/content/pakete";

/**
 * /pakete – die verkaufsstärkste Seite, gebaut aus dem gültigen Mock
 * `docs/design-system/mocks/3.7-pakete.html` (Fassung 2). Alle Texte kommen
 * wortgleich aus `content/pakete.ts`, Preise werden nie addiert. Genau eine `<h1>`
 * (im Hero). Metadata/Canonical aus `config/site-structure.ts` (via content/meta).
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

      <Section variant="mist" id={faq.id}>
        <Wrap>
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <h2>{faq.headline}</h2>
          <Faq
            items={paketeFaq.map((item, i) => ({
              question: item.question,
              answer: item.answer,
              defaultOpen: i === 0,
            }))}
          />
        </Wrap>
      </Section>

      <Footer footerClose={pakete.footerClose} />
    </main>
  );
}
