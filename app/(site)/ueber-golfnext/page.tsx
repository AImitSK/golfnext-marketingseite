import type { Metadata } from "next";
import { Grundsaetze } from "@/components/pages/ueber-golfnext/Grundsaetze";
import { Hero } from "@/components/pages/ueber-golfnext/Hero";
import { Menschen } from "@/components/pages/ueber-golfnext/Menschen";
import { Projekte } from "@/components/pages/ueber-golfnext/Projekte";
import { Weg } from "@/components/pages/ueber-golfnext/Weg";
import { Wissen } from "@/components/pages/ueber-golfnext/Wissen";
import { Footer } from "@/components/site/Footer";
import {
  ueberGolfnext,
  ueberGolfnextGrundsaetze,
  ueberGolfnextHero,
  ueberGolfnextMenschen,
  ueberGolfnextProjekte,
  ueberGolfnextWeg,
  ueberGolfnextWissen,
} from "@/content/ueber-golfnext";

/**
 * Über GolfNext `/ueber-golfnext` – Neufassung v01, gebaut aus Mock
 * `3.8b-ueber-golfnext-neufassung.html` (Briefing 0019). Sechs Abschnitte: Hero mit
 * zwei Porträt-Platzhalterkarten, „Unser Weg“ (Zeitleiste), „Zwei Grundsätze“
 * (Navy-Band), „Die Menschen dahinter“, „Gemeinsame Projekte“ (Club-Platzhalter) und
 * „Wissen“ (Artikel-Slider mit Platzhalterkarten), gefolgt vom persönlichen Abschluss
 * (`FooterClose`, oberer Teil des geteilten `Footer`). Alle Texte kommen wortgleich
 * aus `content/ueber-golfnext.ts`. Genau eine `<h1>` (im Hero).
 *
 * KEIN Modulstatus (Entscheidung Stefan, Briefing 0019): Der Mock-Grundsatz /02
 * „Wir versprechen nur, was läuft.“ mit der Aufzählung „Im Einsatz/Pilot/In
 * Entwicklung“ und der Status-Legende wird NICHT gebaut; die Überschrift lautet
 * „Zwei Grundsätze …“, es wird kein Ersatz-Grundsatz erfunden. Der „Pilotclub“-/
 * Entwicklungspartner-Wortlaut (Grundsatz /01, „Gemeinsame Projekte“, „Wissen“) bleibt
 * wortgleich – er beschreibt Entwicklungspartnerschaften, keinen Modul-Status.
 *
 * Metadata: Titel/Beschreibung sind in `config/site-structure.ts` gesetzt (Briefing
 * 0019) und liegen als `meta` in content – zusätzlich der Canonical. Die Layout-Tokens
 * der Neufassung (Wrap 1180, Radius 12, Sektion 120, H2 48) sind geteilte Tokens aus
 * `app/globals.css`.
 */
export const metadata: Metadata = {
  title: { absolute: ueberGolfnext.meta.title ?? "Über GolfNext" },
  description: ueberGolfnext.meta.description ?? undefined,
  alternates: { canonical: ueberGolfnext.route },
};

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = ueberGolfnext.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/ueber-golfnext.ts`);
  return found;
}

export default function UeberGolfnextPage() {
  const hero = section("hero");
  const weg = section("weg");
  const grundsaetze = section("grundsaetze");
  const menschen = section("menschen");
  const projekte = section("projekte");
  const wissen = section("wissen");

  return (
    <main>
      <Hero
        eyebrow={hero.eyebrow!}
        headline={hero.headline!}
        lead={hero.text![0]}
        data={ueberGolfnextHero}
      />

      <Weg eyebrow={weg.eyebrow!} headline={weg.headline!} lead={weg.text![0]} data={ueberGolfnextWeg} />

      <Grundsaetze
        eyebrow={grundsaetze.eyebrow!}
        headline={grundsaetze.headline!}
        lead={grundsaetze.text![0]}
        data={ueberGolfnextGrundsaetze}
      />

      <Menschen
        eyebrow={menschen.eyebrow!}
        headline={menschen.headline!}
        lead={menschen.text![0]}
        data={ueberGolfnextMenschen}
      />

      <Projekte
        eyebrow={projekte.eyebrow!}
        headline={projekte.headline!}
        lead={projekte.text![0]}
        data={ueberGolfnextProjekte}
      />

      <Wissen
        eyebrow={wissen.eyebrow!}
        headline={wissen.headline!}
        lead={wissen.text![0]}
        data={ueberGolfnextWissen}
      />

      <Footer footerClose={ueberGolfnext.footerClose} />
    </main>
  );
}
