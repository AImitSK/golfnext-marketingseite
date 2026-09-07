import type { Metadata } from "next";
import { PlattformSection } from "@/components/pages/plattform/PlattformSection";
import { Hero } from "@/components/pages/so-arbeitet-golfnext/Hero";
import { Regeln } from "@/components/pages/so-arbeitet-golfnext/Regeln";
import { Strecken } from "@/components/pages/so-arbeitet-golfnext/Strecken";
import { Uebergabe } from "@/components/pages/so-arbeitet-golfnext/Uebergabe";
import { Footer } from "@/components/site/Footer";
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
 * Metadata: Briefing 0024 liefert keinen Meta-Titel/-Text → Root-Default
 * (app/layout.tsx) bleibt bestehen, nur der Canonical wird gesetzt (wie
 * Plattform/Wachstum/Clubprozesse).
 */
export const metadata: Metadata = {
  alternates: { canonical: soArbeitetGolfnext.route },
};

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
