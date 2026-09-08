import { describe, expect, it } from "vitest";
import { formatDatum, initialen } from "./format";

describe("formatDatum", () => {
  it("schreibt das Datum aus, wie im Mock", () => {
    expect(formatDatum("2026-08-28T09:00:00.000Z")).toEqual({
      text: "28. August 2026",
      iso: "2026-08-28",
    });
  });

  it("liefert null statt „Invalid Date", () => {
    expect(formatDatum("keindatum")).toBeNull();
    expect(formatDatum(null)).toBeNull();
    expect(formatDatum(undefined)).toBeNull();
  });
});

describe("initialen", () => {
  it("nimmt den ersten Buchstaben des ersten und des letzten Namensteils", () => {
    expect(initialen("Fred Hoffmann")).toBe("FH");
    expect(initialen("Stefan Kühne")).toBe("SK");
    expect(initialen("Anna Maria Berger")).toBe("AB");
  });

  it("kommt mit einem einzelnen Namen und mit Leerraum zurecht", () => {
    expect(initialen("Fred")).toBe("F");
    expect(initialen("  Fred   Hoffmann  ")).toBe("FH");
    expect(initialen("")).toBe("");
  });
});
