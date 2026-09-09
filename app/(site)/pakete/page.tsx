import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Basis } from "@/components/pages/pakete/Basis";
import { Hero } from "@/components/pages/pakete/Hero";
import { Pakete } from "@/components/pages/pakete/Pakete";
import { Vergleich } from "@/components/pages/pakete/Vergleich";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Faq } from "@/components/ui/Faq";
import { Section } from "@/components/ui/Section";
import { SimpleText } from "@/components/ui/SimpleText";
import { Wrap } from "@/components/ui/Wrap";
import { pakete, paketeBasis, paketeHero, paketePakete, paketeVergleich } from "@/content/pakete";
import { sanityFetch } from "@/lib/sanity/client";
import { FAQS_BY_TOPIC_QUERY, QUERY_TAGS } from "@/lib/sanity/queries";

/**
 * /pakete – die verkaufsstärkste Seite, gebaut aus dem gültigen Mock
 * `docs/design-system/mocks/3.7-pakete.html` (Fassung 2). Alle Texte kommen
 * wortgleich aus `content/pakete.ts`, Preise werden nie addiert. Genau eine `<h1>`
 * (im Hero). Metadata/Canonical aus `config/site-structure.ts` (via content/meta).
 *
 * **Ausnahme: die FAQ.** Seit Briefing 0030 (Masterplan 3.6) kommen Fragen und
 * Antworten aus Sanity (`faq`, `topic: "pakete"`), nicht mehr aus `content/pakete.ts` –
 * dort ist der Wortlaut gelöscht. Es gibt bewusst **keinen Rückfall** auf die
 * Repo-Fassung: Zwei Wahrheiten für denselben Text sind genau das, was der Schritt
 * beendet. Liefert Sanity nichts, entfällt der Abschnitt vollständig.
 *
 * `FAQPage`-JSON-LD gehört zu Masterplan 6.4 und steht hier bewusst noch nicht.
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

export default async function PaketePage() {
  // Reihenfolge kommt aus dem Feld `order` – `FAQS_BY_TOPIC_QUERY` sortiert danach
  // (`order asc, question asc`), nicht die Abfragereihenfolge und nicht das Alphabet.
  const faqs = await sanityFetch({
    query: FAQS_BY_TOPIC_QUERY,
    params: { topic: "pakete" },
    tags: QUERY_TAGS.FAQS_BY_TOPIC_QUERY,
  });

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

      {/* Kein Inhalt, kein Abschnitt: ohne FAQs in Sanity entfallen auch Eyebrow und
          Überschrift – sonst stünde eine leere Fläche zwischen Vergleich und Footer. */}
      {faqs.length > 0 ? (
        <Section variant="mist" id={faq.id}>
          <Wrap>
            <Eyebrow>{faq.eyebrow}</Eyebrow>
            <h2>{faq.headline}</h2>
            <Faq
              items={faqs.map((eintrag, i) => ({
                question: eintrag.question,
                answer: <SimpleText value={eintrag.answer} />,
                defaultOpen: i === 0,
              }))}
            />
          </Wrap>
        </Section>
      ) : null}

      <Footer footerClose={pakete.footerClose} />
    </main>
  );
}
