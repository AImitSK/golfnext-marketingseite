import { describe, expect, it } from "vitest";
import { clubprozesse } from "./clubprozesse";
import { pakete } from "./pakete";
import { plattform } from "./plattform";
import { ueberGolfnext } from "./ueber-golfnext";
import { wachstumVertrieb } from "./wachstum-vertrieb";
import type { PageContent } from "./types";

/**
 * Der Sektionskopf des FAQ-Abschnitts (Briefing 0030, Nachtrag 09.09.2026).
 *
 * Eyebrow und Überschrift sind **Seitentext** und gehören deshalb in die
 * Content-Datei der jeweiligen Seite, nicht ins JSX – nur die Fragen und Antworten
 * kommen aus Sanity. Diese Prüfung hält die von Stefan freigegebenen Überschriften
 * wortgleich fest und schützt davor, dass ein Abschnitt ohne Kopf gebaut wird.
 */
const SEITEN: { route: string; inhalt: PageContent; headline: string }[] = [
  { route: "/pakete", inhalt: pakete, headline: "Häufige Fragen zu den Paketen." },
  { route: "/plattform", inhalt: plattform, headline: "Häufige Fragen zur Plattform." },
  {
    route: "/clubprozesse",
    inhalt: clubprozesse,
    headline: "Häufige Fragen zu den Clubprozessen.",
  },
  {
    route: "/wachstum-vertrieb",
    inhalt: wachstumVertrieb,
    headline: "Häufige Fragen zu Wachstum und Vertrieb.",
  },
  { route: "/ueber-golfnext", inhalt: ueberGolfnext, headline: "Häufige Fragen zu GolfNext." },
];

describe("FAQ-Sektionskopf", () => {
  it.each(SEITEN)("$route trägt die freigegebene Überschrift", ({ inhalt, headline }) => {
    const abschnitt = inhalt.sections.find((s) => s.id === "faq");
    expect(abschnitt, "Sektion „faq“ fehlt").toBeDefined();
    expect(abschnitt!.headline).toBe(headline);
  });

  it("benutzt auf allen fünf Seiten denselben Eyebrow", () => {
    for (const { route, inhalt } of SEITEN) {
      const abschnitt = inhalt.sections.find((s) => s.id === "faq");
      expect(abschnitt!.eyebrow, `Eyebrow auf ${route}`).toBe("Klarheit vor dem Gespräch");
    }
  });

  it("steht auf jeder Seite unmittelbar vor dem Abschluss-CTA – also als letzter Abschnitt", () => {
    for (const { route, inhalt } of SEITEN) {
      const letzter = inhalt.sections.at(-1);
      expect(letzter?.id, `letzter Abschnitt auf ${route}`).toBe("faq");
    }
  });
});
