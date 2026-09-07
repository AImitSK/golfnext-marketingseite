import type { Metadata } from "next";
import { PlatzhalterSeite } from "@/components/site/PlatzhalterSeite";
import { ROUTES } from "@/config/site-structure";
import { routeMetadata } from "@/lib/metadata";

/**
 * `/team` – Platzhalter (Masterplan 2.8, Briefing 0022). Es gibt kein Fred-Briefing
 * und keinen Mock; die Seite bleibt leer, bis beides vorliegt (docs/10-launch-umfang.md).
 * Die Route existiert, damit der CTA „Unser Team kennenlernen" (`resolveCta`, Ziel
 * `team`) nicht ins 404 läuft.
 *
 * Rücklink: `/ueber-golfnext` – dort steht der Abschnitt „Menschen dahinter".
 */
export const metadata: Metadata = routeMetadata("/team");

const ROUTE = ROUTES.find((r) => r.path === "/team")!;
const ZURUECK = ROUTES.find((r) => r.path === "/ueber-golfnext")!;

export default function TeamPage() {
  return (
    <PlatzhalterSeite
      titel={ROUTE.label}
      zurueck={{ href: ZURUECK.path, label: ZURUECK.label }}
    />
  );
}
