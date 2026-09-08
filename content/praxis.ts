import type { PageContent } from "./types";

/**
 * Praxis · /praxis, /praxis/thema/[slug], /praxis/[slug]
 *
 * Quelle der Texte: docs/design-system/mocks/3.9a-praxis-uebersicht.html (Übersicht)
 * und 3.9b-praxis-artikel.html (Artikel). **Es gibt kein Fred-Briefing für diese Seite
 * und es wird keines geben** (Briefing 0027) – die Mocks sind die Textquelle für alles,
 * was nicht aus Sanity kommt.
 *
 * Hier steht ausschließlich die **Seitenschale**: Hero, Filterleiste, Beschriftungen,
 * Abschluss. Artikel, Rubriken und Autoren kommen aus Sanity und tauchen in dieser
 * Datei nicht auf – auch nicht als Beispiel, Seed oder Fixture (Briefing 0027,
 * „Harte Vorgaben"). Die neun Beispielartikel der Mocks sind unfreigegebene
 * Beispieltexte und werden nicht übernommen.
 *
 * Bewusst NICHT übernommen:
 * - **Newsletter-Block „Praxis-Post"** samt Hero-CTA „Praxis-Post abonnieren"
 *   (Entscheidung Stefan, 07.09.2026): kein E-Mail-Feld ohne Versandweg.
 * - Der zweite Hero-Link „Alle Themen" – er zeigte im Mock auf die Filterleiste
 *   derselben Seite; die Filterleiste steht direkt darunter.
 * - Der HTML-Kommentar „HERO MIT TITELTHEMA" und die CSS-Klasse `.feat` sind tote
 *   Reste im Mock (der Hero ist `.hero.plain`, einspaltig). Kein Titelthema.
 * - Die Schlagwort-Zeile des Artikels (`.tags`) – dafür gibt es kein Schemafeld.
 * - „Alle Beiträge von {Name}" – es gibt keine Autorenseite (Briefing 0027,
 *   „Was du NICHT tust"), der Link zeigte sonst ins Leere.
 * - „Ältere Beiträge laden" heißt hier „Ältere Beiträge": geblättert wird über einen
 *   echten Link (`?seite=2`), nicht nachgeladen (Abweichung, docs/03 + entscheidungen).
 *
 * Leerzustands- und Fehlertexte stehen NICHT hier, sondern in `lib/ui/messages.ts`
 * (`uiMessages.praxis`) – sie sind Systemtexte, kein Fred-Marketing.
 */

/** Beschriftungen der Übersicht (3.9a) und der Artikelseite (3.9b). */
export interface PraxisLabels {
  /** Überschrift der Filterleiste (3.9a `.filters .lab`). */
  themen: string;
  /** Erster Chip der Filterleiste – führt auf `/praxis` (3.9a). */
  alle: string;
  /** Link auf die nächste Seite der Liste (3.9a `.more a`, ohne „laden"). */
  aeltereBeitraege: string;
  /** Überschrift der Autorenbox unter dem Artikel (3.9b `.author .rl`). */
  ueberDenAutor: string;
  /** Überschrift des Inhaltsverzeichnisses in der Seitenspalte (3.9b `.toc b`). */
  inhalt: string;
  /** Eyebrow des Empfehlungsblocks (3.9b `.related .eyebrow`). */
  weiterlesen: string;
  /** Überschrift des Empfehlungsblocks (3.9b `.related h2`). */
  passtDazu: string;
  /** Erste Brotkrume der Artikelseite (3.9b `.crumb a`). */
  brotkrumeStart: string;
  /** Beschriftung des Autoren-Links auf LinkedIn. Nicht aus dem Mock (er führt dort
   *  „Alle Beiträge von …" – es gibt keine Autorenseite), sondern aus Briefing 0027:
   *  „LinkedIn nur wenn gesetzt". Der Name der Plattform, nicht neu getextet. */
  linkedin: string;
  /** Zusatz hinter der berechneten Lesezeit (3.9b `.ahead .meta`: „6 Min. Lesezeit"). */
  lesezeitSuffix: string;
}

export const praxisLabels: PraxisLabels = {
  themen: "Themen",
  alle: "Alle",
  aeltereBeitraege: "Ältere Beiträge",
  ueberDenAutor: "Über den Autor",
  inhalt: "Inhalt",
  weiterlesen: "Weiterlesen",
  passtDazu: "Passt dazu",
  brotkrumeStart: "Praxis",
  linkedin: "LinkedIn",
  lesezeitSuffix: "Min. Lesezeit",
};

/**
 * Beschriftung des Hinweiskastens im Fließtext (Sanity-Objekttyp `callout`).
 *
 * Der Mock 3.9b kennt genau einen solchen Kasten, und der trägt die Beschriftung
 * „Kurz gesagt" (`.box b`) – sie steht deshalb auf dem Ton „Hinweis". Der zweite Ton
 * „Tipp" stammt aus der Auswahlliste des Schemas (`sanity/schemaTypes/objects/callout.ts`)
 * und ist kein neu erfundener Text.
 */
export const praxisCalloutLabels: Record<"hinweis" | "tipp", string> = {
  hinweis: "Kurz gesagt",
  tipp: "Tipp",
};

/** Titelbild-Platzhalter der Artikelseite (3.9b `.cover .cp span`). */
export const praxisPlatzhalter = {
  /** Tagline im `Shot` an Stelle eines fehlenden Titelbilds. */
  titelbild: "Titelbild folgt",
  /** Tagline im `Shot` an Stelle eines fehlenden Kartenbilds (3.9a `.acard .ap span`). */
  kartenbild: "Bild folgt",
} as const;

export const praxis: PageContent = {
  route: "/praxis",
  meta: {
    /**
     * Vorschlag aus dem freigegebenen Hero von 3.9a (Briefing 0027, Aufgabe 7):
     * Titel = H1, Beschreibung = der erste Satz des Hero-Absatzes, ohne neue
     * Formulierung gekürzt (≤ 160 Zeichen). Steht so auch in
     * `config/site-structure.ts`; ob Fred eigene Angaben nachliefert, ist Frage 3.
     */
    title: "Praxis. Was in Golfclubs wirklich funktioniert.",
    description:
      "Berichte aus Pilotclubs, Erfahrungen aus dreißig Jahren auf dem Platz und ehrliche Antworten auf die Fragen, die im Clubbüro und im Vorstand gestellt werden.",
  },
  sections: [
    {
      id: "hero",
      eyebrow: "Praxis",
      headline: "Praxis. Was in Golfclubs wirklich funktioniert.",
      text: [
        "Berichte aus Pilotclubs, Erfahrungen aus dreißig Jahren auf dem Platz und ehrliche Antworten auf die Fragen, die im Clubbüro und im Vorstand gestellt werden. Zum Mitnehmen – auch ohne GolfNext.",
      ],
    },
  ],
  /** Wortgleich aus dem geteilten `.f-close`-Block der Mocks 3.9a/3.9b. */
  footerClose: {
    eyebrow: "GolfNext persönlich",
    headline: "Lieber direkt über Ihren Club sprechen?",
    text: [
      "In 30 Minuten schauen wir gemeinsam auf Ihre Ziele und Ihre größten Hebel. Sie bekommen eine ehrliche Einschätzung, keine Verkaufsshow.",
    ],
    cta: {
      label: "Online-Erstgespräch vereinbaren",
      hint: "30 Minuten persönlich per Zoom oder Teams",
      target: "erstgespraech",
    },
    secondary: {
      label: "Oder zuerst die Live-Demo ansehen",
      target: "livedemo",
    },
  },
};
