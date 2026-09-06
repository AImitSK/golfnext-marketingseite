import type { Metadata } from "next";
import { CaptainsApp } from "@/components/pages/clubprozesse/CaptainsApp";
import { DreiDinge } from "@/components/pages/clubprozesse/DreiDinge";
import { Hero } from "@/components/pages/clubprozesse/Hero";
import { TurnierNews } from "@/components/pages/clubprozesse/TurnierNews";
import { WasBleibt } from "@/components/pages/clubprozesse/WasBleibt";
import { Footer } from "@/components/site/Footer";
import {
  clubprozesse,
  clubprozesseCaptainsApp,
  clubprozesseDinge,
  clubprozesseHero,
  clubprozesseTurnierNews,
  clubprozesseWasBleibt,
} from "@/content/clubprozesse";

/**
 * Clubprozesse `/clubprozesse` – Neufassung v01, gebaut aus Mock
 * `3.5b-clubprozesse-neufassung.html` (Briefing 0018). Fünf Abschnitte: Hero mit
 * Clubwebsite + Sonntags-Log, „Drei Dinge" (Bento: Concierge/Platzstatus/Gastfee),
 * „Turnier-News" (Bericht-Strecke PDF → Angaben → drei Kanäle), „Captains App"
 * (Spieltag → Mannschaftsseite) und „Was bleibt" (Digital ↔ Persönlich), gefolgt vom
 * persönlichen Abschluss (`FooterClose`, oberer Teil des geteilten `Footer`). Alle
 * Texte kommen wortgleich aus `content/clubprozesse.ts`. Genau eine `<h1>` (im Hero).
 *
 * Der MODULSTATUS wird bewusst NICHT dargestellt (Entscheidung Stefan, Briefing 0018):
 * keine Pilot/Im-Einsatz/In-Entwicklung-Badges, keine dev-Labels, nicht die Zeile
 * „Stand je Modul wie im Footer". Die Praxis-Zeile „Im Pilot des Golfclubs
 * Rehburg-Loccum kamen 68 % …" bleibt als Fallbeispiel wortgleich erhalten. Der
 * Modulstatus im geteilten Footer bleibt ebenfalls aus (Briefing 0014).
 *
 * Metadata: Briefing 0018 liefert keinen Meta-Titel/-Text → Root-Default
 * (app/layout.tsx) bleibt bestehen, nur der Canonical wird gesetzt (wie Plattform/
 * Wachstum/Startseite). Die Layout-Tokens der Neufassung (Wrap 1180, Radius 12,
 * Sektion 120, H2 48) sind geteilte Tokens aus `app/globals.css`.
 */
export const metadata: Metadata = {
  alternates: { canonical: clubprozesse.route },
};

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = clubprozesse.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/clubprozesse.ts`);
  return found;
}

export default function ClubprozessePage() {
  const hero = section("hero");
  const dinge = section("dinge");
  const turnierNews = section("turnier-news");
  const captainsApp = section("captains-app");
  const wasBleibt = section("was-bleibt");

  return (
    <main>
      <Hero eyebrow={hero.eyebrow!} headline={hero.headline!} lead={hero.text![0]} data={clubprozesseHero} />

      <DreiDinge
        eyebrow={dinge.eyebrow!}
        headline={dinge.headline!}
        lead={dinge.text![0]}
        data={clubprozesseDinge}
      />

      <TurnierNews
        eyebrow={turnierNews.eyebrow!}
        headline={turnierNews.headline!}
        lead={turnierNews.text![0]}
        data={clubprozesseTurnierNews}
      />

      <CaptainsApp
        eyebrow={captainsApp.eyebrow!}
        headline={captainsApp.headline!}
        lead={captainsApp.text![0]}
        data={clubprozesseCaptainsApp}
      />

      <WasBleibt
        eyebrow={wasBleibt.eyebrow!}
        headline={wasBleibt.headline!}
        lead={wasBleibt.text![0]}
        data={clubprozesseWasBleibt}
      />

      <Footer footerClose={clubprozesse.footerClose} />
    </main>
  );
}
