import { describe, expect, it } from "vitest";
import { ARTIKEL_JE_SEITE, blaettere, seiteAusParameter, seitenHref } from "./blaettern";

/** Neutrale Platzhalter statt Artikeldaten (Briefing 0027: kein Artikelinhalt im Repo). */
const liste = (anzahl: number) => Array.from({ length: anzahl }, (_, i) => i + 1);

describe("seiteAusParameter", () => {
  it("liefert Seite 1, solange nichts Brauchbares im Parameter steht", () => {
    for (const wert of [undefined, "", "0", "-3", "zwei", "2abc", " 2"]) {
      expect(seiteAusParameter(wert)).toBe(1);
    }
  });

  it("liest eine gültige Seitenzahl", () => {
    expect(seiteAusParameter("2")).toBe(2);
    expect(seiteAusParameter("17")).toBe(17);
  });

  it("nimmt beim doppelten Parameter den ersten Wert", () => {
    expect(seiteAusParameter(["3", "9"])).toBe(3);
  });
});

describe("blaettere", () => {
  it("zeigt neun Artikel je Seite und verweist auf die nächste", () => {
    const erste = blaettere(liste(20), 1);
    expect(erste.artikel).toHaveLength(ARTIKEL_JE_SEITE);
    expect(erste.artikel[0]).toBe(1);
    expect(erste.seiten).toBe(3);
    expect(erste.naechsteSeite).toBe(2);
  });

  it("schneidet die zweite Seite richtig zu", () => {
    const zweite = blaettere(liste(20), 2);
    expect(zweite.artikel[0]).toBe(10);
    expect(zweite.artikel).toHaveLength(9);
    expect(zweite.naechsteSeite).toBe(3);
  });

  it("kennt auf der letzten Seite keine nächste", () => {
    const letzte = blaettere(liste(20), 3);
    expect(letzte.artikel).toEqual([19, 20]);
    expect(letzte.naechsteSeite).toBeNull();
  });

  it("blättert bei genau neun Artikeln nicht", () => {
    const eine = blaettere(liste(9), 1);
    expect(eine.seiten).toBe(1);
    expect(eine.naechsteSeite).toBeNull();
  });

  it("führt eine zu hohe Seitenzahl auf die letzte Seite statt ins Leere", () => {
    // Alter Link `?seite=9`, nachdem Artikel gelöscht wurden.
    const zurueck = blaettere(liste(20), 9);
    expect(zurueck.seite).toBe(3);
    expect(zurueck.artikel).toEqual([19, 20]);
  });

  it("bleibt bei leerer Liste bei einer Seite ohne Artikel", () => {
    const leer = blaettere([], 1);
    expect(leer.artikel).toEqual([]);
    expect(leer.seiten).toBe(1);
    expect(leer.naechsteSeite).toBeNull();
  });
});

describe("seitenHref", () => {
  it("hängt den Seitenparameter an denselben Pfad", () => {
    expect(seitenHref("/praxis", 2)).toBe("/praxis?seite=2");
    expect(seitenHref("/praxis/thema/clubbuero", 3)).toBe("/praxis/thema/clubbuero?seite=3");
  });
});
