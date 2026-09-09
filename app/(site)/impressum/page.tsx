import type { Metadata } from "next";
import { Rechtstext } from "@/components/pages/recht/Rechtstext";
import { Footer } from "@/components/site/Footer";
import { readLegalDocument } from "@/lib/legal";
import { routeMetadata } from "@/lib/metadata";

/**
 * Impressum `/impressum` (Masterplan 5.1, Briefing 0028). Der Wortlaut kommt
 * wortgleich aus `docs/legal/impressum.md`; die internen Vermerke am Dateianfang
 * werden vom Leser in `lib/legal.ts` entfernt und erscheinen nicht im HTML.
 *
 * **Zur Steuer-/USt-IdNr. (offene Stelle des Masterplans):** Der Absatz fehlt hier
 * bewusst – Entscheidung Stefan vom 07.09.2026, festgehalten im internen Vermerk
 * der Quelldatei: Die alte Angabe war eine Steuernummer, keine USt-IdNr., und § 5
 * DDG verlangt die USt-IdNr. nur, sofern vorhanden. Nichts zu erfinden, nichts
 * nachzutragen, solange Fred keine echte USt-IdNr. liefert.
 *
 * `force-static`: Die Seite wird beim Bauen erzeugt, damit die Markdown-Datei zur
 * Bauzeit gelesen wird und nicht bei jedem Abruf vom Dateisystem abhängt.
 *
 * KEIN `footerClose`: Über einem Rechtstext steht kein Abschluss-CTA.
 */
export const dynamic = "force-static";

export const metadata: Metadata = routeMetadata("/impressum");

export default function ImpressumPage() {
  const dokument = readLegalDocument("impressum.md");

  return (
    <main>
      <Rechtstext dokument={dokument} />
      <Footer />
    </main>
  );
}
