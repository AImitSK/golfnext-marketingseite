import { describe, expect, it } from "vitest";
import type { BlockContent } from "@/sanity.types";
import { lesezeitMinuten, zaehleWoerter } from "./lesezeit";

/**
 * Testdaten sind erfundene Platzhalterwörter („wort wort wort …") – **kein**
 * Artikeltext aus den Mocks (Briefing 0027: die neun Beispielartikel werden nicht
 * übernommen, auch nicht als Fixture mit echtem Wortlaut).
 */
function absatz(woerter: number, key = "a1"): BlockContent[number] {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    children: [{ _type: "span", _key: `${key}-s`, text: Array(woerter).fill("wort").join(" ") }],
  };
}

function hinweiskasten(woerter: number, key = "c1"): BlockContent[number] {
  return {
    _type: "callout",
    _key: key,
    tone: "hinweis",
    text: [
      {
        _type: "block",
        _key: `${key}-b`,
        style: "normal",
        children: [{ _type: "span", _key: `${key}-s`, text: Array(woerter).fill("wort").join(" ") }],
      },
    ],
  } as BlockContent[number];
}

describe("zaehleWoerter", () => {
  it("zählt die Wörter aller Textblöcke", () => {
    expect(zaehleWoerter([absatz(10, "a"), absatz(5, "b")])).toBe(15);
  });

  it("zählt auch den Text im Hinweiskasten mit – er wird gelesen wie Fließtext", () => {
    expect(zaehleWoerter([absatz(10, "a"), hinweiskasten(20)])).toBe(30);
  });

  it("zählt einen leeren oder fehlenden Fließtext als null", () => {
    expect(zaehleWoerter([])).toBe(0);
    expect(zaehleWoerter(null)).toBe(0);
    expect(zaehleWoerter(undefined)).toBe(0);
  });
});

describe("lesezeitMinuten", () => {
  it("rechnet Wörter ÷ 200 und rundet auf", () => {
    // 1.050 Wörter / 200 = 5,25 → 6 Minuten (das Beispiel aus der Rechenregel).
    expect(lesezeitMinuten([absatz(1050)])).toBe(6);
    expect(lesezeitMinuten([absatz(200)])).toBe(1);
    expect(lesezeitMinuten([absatz(201)])).toBe(2);
    expect(lesezeitMinuten([absatz(400)])).toBe(2);
  });

  it("liefert nie weniger als eine Minute", () => {
    expect(lesezeitMinuten([absatz(1)])).toBe(1);
    expect(lesezeitMinuten([])).toBe(1);
    expect(lesezeitMinuten(null)).toBe(1);
  });
});
