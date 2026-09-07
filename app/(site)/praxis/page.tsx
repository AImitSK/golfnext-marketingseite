import type { Metadata } from "next";
import { PlatzhalterSeite } from "@/components/site/PlatzhalterSeite";
import { ROUTES } from "@/config/site-structure";
import { routeMetadata } from "@/lib/metadata";

/**
 * `/praxis` – Platzhalter (Masterplan 2.8, Briefing 0022).
 *
 * Die Mocks `3.9a`/`3.9b` liegen zwar im Repo, ihre neun Artikel (Titel, Autoren,
 * Daten, Fließtext) sind aber Beispieltexte OHNE Fred-Freigabe. Hier wird deshalb
 * bewusst nichts davon gebaut – auch keine Vorschau und keine „Bild folgt"-Karten.
 * Der Praxis-Blog entsteht in Phase 3 aus Sanity.
 *
 * Rücklink: `/ueber-golfnext` – dort steht der „Wissen"-Abschnitt.
 */
export const metadata: Metadata = routeMetadata("/praxis");

const ROUTE = ROUTES.find((r) => r.path === "/praxis")!;
const ZURUECK = ROUTES.find((r) => r.path === "/ueber-golfnext")!;

export default function PraxisPage() {
  return (
    <PlatzhalterSeite
      titel={ROUTE.label}
      zurueck={{ href: ZURUECK.path, label: ZURUECK.label }}
    />
  );
}
