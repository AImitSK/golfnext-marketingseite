import Link from "next/link";
import { praxisLabels } from "@/content/praxis";
import type { CATEGORIES_WITH_COUNT_QUERY_RESULT } from "@/sanity.types";
import styles from "./TopicFilter.module.css";

export type RubrikMitAnzahl = CATEGORIES_WITH_COUNT_QUERY_RESULT[number];

/**
 * Themenfilter (portiert aus 3.9a `.filters`), aber als **echte Links** statt der
 * Browser-Buttons des Mocks: „Alle" führt auf `/praxis`, jede Rubrik auf
 * `/praxis/thema/<slug>`. So ist der Filter ohne JavaScript bedienbar (harte Vorgabe,
 * Briefing 0027), und jede Rubrik hat eine eigene, teilbare Adresse.
 *
 * Der Suchparameter `?rubrik=` aus docs/04 entfällt damit – zwei Wege auf dieselbe
 * Liste wären doppelter Inhalt.
 *
 * Rubriken **ohne Artikel werden nicht angezeigt**: ein Chip, der auf eine leere
 * Liste führt, ist ein Versprechen, das die Seite nicht hält. Der aktive Chip trägt
 * `aria-current="page"` – daran hängt auch seine Optik.
 *
 * Reine Server-Komponente. Ist keine einzige Rubrik gefüllt, entfällt die Leiste
 * ganz (auf einer leeren Übersicht gibt es nichts zu filtern).
 */
export function TopicFilter({
  rubriken,
  aktiv,
}: {
  rubriken: RubrikMitAnzahl[];
  /** Slug der aktiven Rubrik; `null` heißt „Alle" (die Übersicht). */
  aktiv: string | null;
}) {
  const sichtbar = rubriken.filter((r) => r.anzahl > 0);
  if (sichtbar.length === 0) return null;

  return (
    <nav className={styles.filters} aria-label={praxisLabels.themen}>
      <span className={styles.lab}>{praxisLabels.themen}</span>

      <Link
        href="/praxis"
        className={styles.chip}
        aria-current={aktiv === null ? "page" : undefined}
      >
        {praxisLabels.alle}
      </Link>

      {sichtbar.map((rubrik) => (
        <Link
          key={rubrik._id}
          href={`/praxis/thema/${rubrik.slug}`}
          className={styles.chip}
          aria-current={aktiv === rubrik.slug ? "page" : undefined}
        >
          {rubrik.title}
          <span className={styles.n}>{rubrik.anzahl}</span>
        </Link>
      ))}
    </nav>
  );
}
