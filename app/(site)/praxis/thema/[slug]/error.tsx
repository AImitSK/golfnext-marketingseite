"use client";

import { PraxisFehler } from "@/components/pages/praxis/PraxisFehler";

/** Fehlergrenze der Rubrikseite (docs/08, Briefing 0027 Aufgabe 6). */
export default function RubrikError({ reset }: { reset: () => void }) {
  return (
    <main>
      <PraxisFehler reset={reset} />
    </main>
  );
}
