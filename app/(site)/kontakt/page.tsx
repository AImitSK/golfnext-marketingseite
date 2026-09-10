import type { Metadata } from "next";
import { Anschrift } from "@/components/pages/kontakt/Anschrift";
import { Formular } from "@/components/pages/kontakt/Formular";
import { Hero } from "@/components/pages/kontakt/Hero";
import { Footer } from "@/components/site/Footer";
import {
  kontakt,
  kontaktAnschrift,
  kontaktFormular,
  kontaktHero,
  kontaktSeitenspalte,
} from "@/content/kontakt";
import { signTimestamp } from "@/lib/forms/spam";
import { routeMetadata } from "@/lib/metadata";
import { internalHref } from "@/lib/links";

/**
 * Kontakt `/kontakt` – gebaut aus Mock `3.10-kontakt.html` (Briefing 0025,
 * Masterplan 4.3). Vier Abschnitte: Hero, Formular mit Seitenspalte, „Nicht jeder
 * schreibt gern ein Formular." und die Anschrift, danach der geteilte Footer.
 * Alle Texte kommen wortgleich aus `content/kontakt.ts`, alle Meldungen aus
 * `lib/forms/messages.ts`. Genau eine `<h1>` (im Hero).
 *
 * Ersetzt die Platzhalterseite aus Briefing 0022. Mit dem Statuswechsel auf `live`
 * in `config/site-structure.ts` erscheint „Kontakt" erstmals im Über-GolfNext-
 * Dropdown, und der CTA-Fallback aus `lib/links.ts` führt auf eine echte Seite.
 *
 * **Warum die Route dynamisch rendert:** Das Formular trägt einen signierten
 * Zeitstempel (Spam-Stufe A, docs/06). Er gilt zwischen 4 Sekunden und 2 Stunden.
 * Ein zur Bauzeit erzeugter Wert wäre beim Abruf fast immer älter als zwei Stunden –
 * jede echte Anfrage würde still verworfen. Deshalb wird die Seite je Abruf
 * gerendert; sie ist reines Server-HTML ohne Datenabruf und damit trotzdem schnell.
 *
 * KEIN persönlicher Abschluss (`FooterClose`): Der Mock führt keinen – der Footer
 * beginnt hier mit der Modul-Landkarte. Nicht dazuerfinden (Briefing 0025).
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = routeMetadata(kontakt.route);

/** Sektions-Kopftexte (eyebrow/headline/lead) aus der PageContent-Struktur holen. */
function section(id: string) {
  const found = kontakt.sections.find((s) => s.id === id);
  if (!found) throw new Error(`Sektion "${id}" fehlt in content/kontakt.ts`);
  return found;
}

export default function KontaktPage() {
  const hero = section("hero");
  const formular = section("formular");
  const anschrift = section("anschrift");

  return (
    <main>
      <Hero
        eyebrow={hero.eyebrow!}
        headline={hero.headline!}
        lead={hero.text![0]!}
        data={kontaktHero}
      />

      <Formular
        headline={formular.headline!}
        lead={formular.text![0]!}
        formular={kontaktFormular}
        seitenspalte={kontaktSeitenspalte}
        ts={signTimestamp()}
        // Seit Briefing 0028 ist `/datenschutz` live, `internalHref` liefert damit
        // den echten Pfad und die Einwilligung verlinkt ihn. Die Weiche bleibt
        // stehen: Wäre die Route nicht live, stünde das Wort als Text da statt als
        // toter Link (wie Anschrift und Footer). Der Wortlaut bleibt unverändert.
        datenschutzHref={internalHref("/datenschutz")}
      />

      <Anschrift
        eyebrow={anschrift.eyebrow!}
        headline={anschrift.headline!}
        data={kontaktAnschrift}
      />

      <Footer footerClose={kontakt.footerClose} />
    </main>
  );
}
