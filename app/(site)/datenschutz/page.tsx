import type { Metadata } from "next";
import { Rechtstext } from "@/components/pages/recht/Rechtstext";
import { Footer } from "@/components/site/Footer";
import { readLegalDocument } from "@/lib/legal";
import { routeMetadata } from "@/lib/metadata";

/**
 * Datenschutzerklärung `/datenschutz` (Masterplan 5.2, Briefing 0028). Der Wortlaut
 * kommt wortgleich aus `docs/legal/datenschutz.md`; interne Vermerke am Anfang und
 * die Checkliste am Ende entfernt `lib/legal.ts`, sie erscheinen nicht im HTML.
 *
 * Abschnitt 6 („Cookies und Einwilligung") beschreibt den Einwilligungs-Dialog,
 * der erst mit Masterplan 5.3 gebaut wird. Der Text bleibt trotzdem stehen – er ist
 * freigegeben und wird hier nicht angepasst (Briefing 0028). Der Link
 * „Cookie-Einstellungen" im Fußbereich gehört ebenfalls zu 5.3.
 *
 * `force-static`: siehe `/impressum`.
 */
export const dynamic = "force-static";

export const metadata: Metadata = routeMetadata("/datenschutz");

export default function DatenschutzPage() {
  const dokument = readLegalDocument("datenschutz.md");

  return (
    <main>
      <Rechtstext dokument={dokument} />
      <Footer />
    </main>
  );
}
