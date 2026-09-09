import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Faq } from "@/components/ui/Faq";
import { Section } from "@/components/ui/Section";
import { SimpleText } from "@/components/ui/SimpleText";
import { Wrap } from "@/components/ui/Wrap";
import { sanityFetch } from "@/lib/sanity/client";
import { FAQS_BY_TOPIC_QUERY, QUERY_TAGS } from "@/lib/sanity/queries";
import type { FAQS_BY_TOPIC_QUERY_RESULT } from "@/sanity.types";

/**
 * Die Themen des Dokumenttyps `faq`. Der Typ kommt aus der erzeugten Abfrage, nicht
 * aus einer zweiten Liste von Hand: Ein Tippfehler im `topic` einer Seite wäre sonst
 * ein Abschnitt, der stillschweigend für immer leer bleibt. So bricht der Typecheck.
 */
export type FaqTopic = FAQS_BY_TOPIC_QUERY_RESULT[number]["topic"];

/**
 * Der FAQ-Abschnitt, wie ihn alle Seiten benutzen (Briefing 0030 samt Nachtrag vom
 * 09.09.2026): Fragen aus Sanity zum jeweiligen `topic`, sortiert nach `order`,
 * Antworten als `simpleBlockContent` über `SimpleText`.
 *
 * **Kein Inhalt, kein Abschnitt.** Liefert Sanity zu diesem Thema nichts, gibt die
 * Komponente `null` zurück – samt Eyebrow und Überschrift, ohne Leerzustandsmeldung
 * und ohne doppelten Abstand zum Abschluss-CTA. Es gibt **keinen Rückfall** auf Texte
 * im Repo; die FAQ lebt ausschließlich in Sanity.
 *
 * Zurzeit trägt nur das Thema `pakete` Dokumente. Die vier übrigen Abschnitte sind
 * deshalb unsichtbar – das ist der gewünschte Zustand, kein Fehler: Sobald Fred im
 * Studio eine Frage zum Thema anlegt, erscheint der Abschnitt von selbst.
 *
 * `layout` wählt die Sektionsschale: `"standard"` ist die Schale der Mocks 3.7
 * (`Section` + `Wrap`), `"wide"` die der Neufassungen 3.2c/3.4b/3.5b/3.8b
 * (`PlattformSection` mit breitem Satzspiegel, 120 px Luft und größerer H2). So sitzt
 * der Abschnitt auf jeder Seite in derselben Optik wie ihre übrigen Abschnitte.
 *
 * `FAQPage`-JSON-LD gehört zu Masterplan 6.4 und ist hier bewusst nicht gebaut.
 *
 * Reine Server-Komponente; das Akkordeon bleibt `<details>/<summary>` und ist ohne
 * JavaScript bedienbar, alle Antworten stehen im Server-HTML.
 */
export async function FaqSection({
  topic,
  eyebrow,
  headline,
  id = "faq",
  variant = "mist",
  layout = "standard",
}: {
  topic: FaqTopic;
  eyebrow: string;
  headline: string;
  id?: string;
  /** Flächenfarbe – je Seite so gewählt, dass kein Hintergrund zweimal aufeinanderfolgt. */
  variant?: "paper" | "sand" | "mist";
  layout?: "standard" | "wide";
}) {
  // Die Reihenfolge kommt aus dem Feld `order` – `FAQS_BY_TOPIC_QUERY` sortiert danach
  // (`order asc, question asc`), nicht die Abfragereihenfolge und nicht das Alphabet.
  const faqs = await sanityFetch({
    query: FAQS_BY_TOPIC_QUERY,
    params: { topic },
    tags: QUERY_TAGS.FAQS_BY_TOPIC_QUERY,
  });

  if (faqs.length === 0) return null;

  const akkordeon = (
    <Faq
      items={faqs.map((eintrag, i) => ({
        question: eintrag.question,
        answer: <SimpleText value={eintrag.answer} />,
        // Das erste Item steht server-seitig offen, wie im Mock 3.7.
        defaultOpen: i === 0,
      }))}
    />
  );

  if (layout === "wide") {
    return (
      <PlattformSection variant={variant} id={id} eyebrow={eyebrow} headline={headline}>
        {akkordeon}
      </PlattformSection>
    );
  }

  return (
    <Section variant={variant} id={id}>
      <Wrap>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{headline}</h2>
        {akkordeon}
      </Wrap>
    </Section>
  );
}
