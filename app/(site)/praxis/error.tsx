"use client";

import { PraxisFehler } from "@/components/pages/praxis/PraxisFehler";

/** Fehlergrenze von `/praxis` (docs/08, Briefing 0027 Aufgabe 6). */
export default function PraxisError({ reset }: { reset: () => void }) {
  return (
    <main>
      <PraxisFehler reset={reset} />
    </main>
  );
}
