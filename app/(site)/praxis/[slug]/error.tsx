"use client";

import { PraxisFehler } from "@/components/pages/praxis/PraxisFehler";

/** Fehlergrenze der Artikelseite (docs/08, Briefing 0027 Aufgabe 6). */
export default function ArtikelError({ reset }: { reset: () => void }) {
  return (
    <main>
      <PraxisFehler reset={reset} />
    </main>
  );
}
