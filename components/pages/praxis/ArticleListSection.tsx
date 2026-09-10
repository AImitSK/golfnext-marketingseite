import { Empty } from "@/components/feedback/Empty";
import { Section } from "@/components/ui/Section";
import { Wrap } from "@/components/ui/Wrap";
import { blaettere, type Blaetterung } from "@/lib/praxis/blaettern";
import type { Artikel } from "./ArticleCard";
import { ArticleGrid } from "./ArticleGrid";
import { Pager } from "./Pager";
import { TopicFilter, type RubrikMitAnzahl } from "./TopicFilter";

/**
 * Filterleiste, Artikelraster und „Ältere Beiträge" – der gemeinsame Teil von
 * `/praxis` und `/praxis/thema/<slug>` (portiert aus 3.9a, Abschnitt 2).
 *
 * Geblättert wird serverseitig: `?seite=n` schneidet die Liste zu (`lib/praxis/
 * blaettern.ts`), „Ältere Beiträge" ist ein echter Link. Ohne JavaScript bedienbar.
 *
 * Ist die Liste leer, steht statt des Rasters der `Empty`-Zustand mit einem Text aus
 * `lib/ui/messages.ts` – keine Fehlerseite, kein leerer Rumpf und keine erfundene
 * Ankündigung. Der Weg weiter steht zusätzlich im Abschluss unter der Liste.
 *
 * Reine Server-Komponente.
 */
export function ArticleListSection({
  artikel,
  rubriken,
  aktiveRubrik,
  pfad,
  seite,
  leer,
}: {
  artikel: Artikel[];
  rubriken: RubrikMitAnzahl[];
  aktiveRubrik: string | null;
  /** Pfad dieser Liste – Ziel des Blätter-Links. */
  pfad: string;
  seite: number;
  /** Leerzustandstexte aus `lib/ui/messages.ts` (praxis.leer bzw. praxis.leerRubrik). */
  leer: { title: string; body: string; action: string; href: string };
}) {
  const blaetterung: Blaetterung<Artikel> = blaettere(artikel, seite);

  return (
    <Section>
      <Wrap>
        <TopicFilter rubriken={rubriken} aktiv={aktiveRubrik} />

        {blaetterung.artikel.length === 0 ? (
          <Empty
            title={leer.title}
            body={leer.body}
            actionLabel={leer.action}
            actionHref={leer.href}
            // Der Leerzustand steht hier direkt unter der Seiten-H1.
            headingLevel="h2"
          />
        ) : (
          <>
            {/* `key` erzwingt eine neue Montierung, sobald sich die Liste ändert.
                Nötig, weil „Ältere Beiträge" und der Chip „Alle" nur den
                Suchparameter wechseln – gleicher Pfad, also behält React den
                Rise-Container. Dessen Scroll-Reveal ist mit `viewport={{ once:
                true }}` bereits abgelaufen und meldet seinen Beobachter ab; die
                neu montierten Karten erben `initial="hidden"` und blieben ohne
                den Schlüssel dauerhaft unsichtbar (gemessen: opacity 0 trotz
                vollem Sichtfeld). Beim Rubrikwechsel fällt das nicht auf, dort
                wechselt das dynamische Segment und der Teilbaum wird ohnehin neu
                montiert. */}
            <ArticleGrid
              key={`${aktiveRubrik ?? "alle"}-${blaetterung.seite}`}
              artikel={blaetterung.artikel}
            />
            <Pager pfad={pfad} naechsteSeite={blaetterung.naechsteSeite} />
          </>
        )}
      </Wrap>
    </Section>
  );
}
