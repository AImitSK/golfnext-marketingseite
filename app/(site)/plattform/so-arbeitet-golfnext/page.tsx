import type { Metadata } from "next";
import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { Hero } from "@/components/pages/so-arbeitet-golfnext/Hero";
import { Regeln } from "@/components/pages/so-arbeitet-golfnext/Regeln";
import { Strecken } from "@/components/pages/so-arbeitet-golfnext/Strecken";
import { Uebergabe } from "@/components/pages/so-arbeitet-golfnext/Uebergabe";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { routeMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, routeLabel } from "@/lib/seo/jsonld";
import {
  soArbeitetGolfnext,
  soArbeitetHero,
  soArbeitetRegeln,
  soArbeitetStrecken,
  soArbeitetUebergabe,
} from "@/content/so-arbeitet-golfnext";

/**
 * So arbeitet GolfNext `/plattform/so-arbeitet-golfnext` – Neufassung v01, gebaut aus
 * Mock `3.3b-so-arbeitet-golfnext-neufassung.html` (Briefing 0024). Vier Abschnitte:
 * Hero mit dem Mail-Stapel, „Fünf Zielgruppen, fünf eigene Strecken" (Umschalter über
 * fünf Zielgruppen-Strecken mit je vier Nachrichten), „Die letzte Nachricht schreibt
 * kein System" (Übergabe an einen Menschen) und „Drei Regeln für alles, was in Ihrem
 * Namen rausgeht" (Navy-Band), gefolgt vom persönlichen Abschluss (`FooterClose`,
 * oberer Teil des geteilten `Footer`). Alle Texte kommen wortgleich aus
 * `content/so-arbeitet-golfnext.ts`. Genau eine `<h1>` (im Hero).
 *
 * Textquelle ist AUSSCHLIESSLICH der Mock 3.3b. Die alte `3.3` und Freds Briefing
 * `3.3-so-arbeitet-golfnext-briefing.md` (Customer Journey, Marketing-CRM,
 * Phasenkette) sind Archiv und wurden nicht eingemischt.
 *
 * Der Umschalter ist eine native Radiogruppe: alle fünf Strecken stehen im Server-HTML
 * und sind OHNE JavaScript sowie per Tastatur umschaltbar (CSS `:checked`). Die
 * Mail-Fenster und die beiden Übergabe-Karten sind schematische Illustrationen
 * (`aria-hidden`), keine Screenshots und keine Zusagen. KEIN Modulstatus.
 *
 * Metadata: Titel, Beschreibung, Canonical und die OG-Felder kommen über
 * `routeMetadata` aus `config/site-structure.ts` (Masterplan 6.1, Briefing 0034) –
 * die eine Wahrheit. In dieser Datei steht dazu nichts mehr.
 *
 * `BreadcrumbList` (Masterplan 6.4): die einzige gebaute Seite, die unter einer
 * anderen Adresse liegt – Startseite / Plattform / So arbeitet GolfNext.
 */
export const metadata: Metadata = routeMetadata(soArbeitetGolfnext.route);

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = soArbeitetGolfnext.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/so-arbeitet-golfnext.ts`);
  return found;
}

export default function SoArbeitetGolfnextPage() {
  const hero = section("hero");
  const strecken = section("strecken");
  const uebergabe = section("uebergabe");
  const regeln = section("regeln");

  return (
    <main>
      <JsonLd
        daten={breadcrumbJsonLd([
          { name: routeLabel("/"), pfad: "/" },
          { name: routeLabel("/plattform"), pfad: "/plattform" },
          { name: routeLabel(soArbeitetGolfnext.route), pfad: soArbeitetGolfnext.route },
        ])}
      />

      <Hero
        eyebrow={hero.eyebrow!}
        headline={hero.headline!}
        lead={hero.text![0]}
        data={soArbeitetHero}
      />

      <PlattformSection
        eyebrow={strecken.eyebrow!}
        headline={strecken.headline!}
        lead={strecken.text![0]}
      >
        <Strecken data={soArbeitetStrecken} />
      </PlattformSection>

      <PlattformSection
        variant="mist"
        eyebrow={uebergabe.eyebrow!}
        headline={uebergabe.headline!}
        lead={uebergabe.text![0]}
      >
        <Uebergabe data={soArbeitetUebergabe} />
      </PlattformSection>

      <Regeln
        eyebrow={regeln.eyebrow!}
        headline={regeln.headline!}
        lead={regeln.text![0]}
        data={soArbeitetRegeln}
      />

      <Footer footerClose={soArbeitetGolfnext.footerClose} />
    </main>
  );
}
