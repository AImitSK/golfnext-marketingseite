import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatzhalterSeite } from "@/components/site/PlatzhalterSeite";
import { MODULE, ROUTES } from "@/config/site-structure";
import { routeMetadata } from "@/lib/metadata";

/**
 * `/module/<slug>` – Platzhalter für die zwölf Modulseiten (Masterplan 2.8,
 * Briefing 0022). Es gibt weder Briefing noch Mock; die Seiten bleiben leer.
 *
 * Der MODULSTATUS wird hier bewusst NICHT gezeigt – weder ein
 * „Im Einsatz/Pilot/In Entwicklung"-Label noch `uiMessages.moduleInDevelopment`.
 * Die Anzeige des Modulstatus ist seit Briefing 0014 site-weit entfallen; das
 * Datenfeld `MODULE[].status` bleibt ungenutzt.
 *
 * Rücklink nach `gruppe`: „Wachstum nach außen" → `/plattform`, „Entlastung nach
 * innen" → `/clubprozesse`. Ein unbekannter Slug führt zu 404, nicht zu einer
 * leeren Platzhalterseite.
 */

/** Rücklink-Ziel je Modulgruppe – dieselbe Zuordnung wie `parent` in ROUTES. */
const ZURUECK_PFAD = {
  wachstum: "/plattform",
  clubprozesse: "/clubprozesse",
} as const;

function modul(slug: string) {
  return MODULE.find((m) => m.slug === slug);
}

export function generateStaticParams() {
  return MODULE.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Unbekannter Slug: die Seite meldet 404, hier nur noindex – kein erfundener Titel.
  if (!modul(slug)) return { robots: { index: false, follow: false } };
  return routeMetadata(`/module/${slug}`);
}

export default async function ModulPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = modul(slug);
  if (!m) notFound();

  const zurueckPfad = ZURUECK_PFAD[m.gruppe];
  const zurueck = ROUTES.find((r) => r.path === zurueckPfad)!;

  return (
    <PlatzhalterSeite titel={m.name} zurueck={{ href: zurueck.path, label: zurueck.label }} />
  );
}
