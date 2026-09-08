import { describe, expect, it } from "vitest";
import type { BlockContent } from "@/sanity.types";
import { tocAusBody, ueberschriftId } from "./toc";

/** Platzhaltertexte, kein Artikelinhalt aus den Mocks (Briefing 0027). */
function block(
  style: "normal" | "h2" | "h3" | "blockquote",
  text: string,
  key: string,
): BlockContent[number] {
  return {
    _type: "block",
    _key: key,
    style,
    children: [{ _type: "span", _key: `${key}-s`, text }],
  };
}

describe("ueberschriftId", () => {
  it("leitet die Sprungmarke aus dem Sanity-Schlüssel ab, nicht aus dem Text", () => {
    // Aus dem Text abgeleitet ergäben zwei gleich lautende Überschriften dieselbe
    // Marke – der zweite Sprung liefe dann auf den ersten Abschnitt.
    expect(ueberschriftId("k1")).toBe("abschnitt-k1");
    expect(ueberschriftId("k2")).not.toBe(ueberschriftId("k1"));
  });
});

describe("tocAusBody", () => {
  it("nimmt genau die h2-Blöcke, in der Reihenfolge des Textes", () => {
    const body: BlockContent = [
      block("normal", "Einleitung", "p1"),
      block("h2", "Erster Abschnitt", "h-1"),
      block("normal", "Text", "p2"),
      block("h3", "Unterpunkt", "h-1a"),
      block("h2", "Zweiter Abschnitt", "h-2"),
      block("blockquote", "Zitat", "z1"),
    ];

    expect(tocAusBody(body)).toEqual([
      { id: "abschnitt-h-1", text: "Erster Abschnitt" },
      { id: "abschnitt-h-2", text: "Zweiter Abschnitt" },
    ]);
  });

  it("setzt mehrteilige Überschriften zusammen (fett ausgezeichnete Wörter)", () => {
    const body: BlockContent = [
      {
        _type: "block",
        _key: "h-1",
        style: "h2",
        children: [
          { _type: "span", _key: "s1", text: "Wichtiger " },
          { _type: "span", _key: "s2", text: "Abschnitt", marks: ["strong"] },
        ],
      },
    ];
    expect(tocAusBody(body)).toEqual([{ id: "abschnitt-h-1", text: "Wichtiger Abschnitt" }]);
  });

  it("überspringt leere Überschriften und liefert für leeren Text nichts", () => {
    expect(tocAusBody([block("h2", "   ", "h-1")])).toEqual([]);
    expect(tocAusBody([])).toEqual([]);
    expect(tocAusBody(null)).toEqual([]);
  });
});
