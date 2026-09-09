import { describe, expect, it } from "vitest";
import { indexierungsHeader, istNichtProduktion, NOINDEX_HEADER } from "./indexierung";

/**
 * Der Kopf `X-Robots-Tag: noindex, nofollow` ist ein Akzeptanzkriterium aus
 * Briefing 0034, lässt sich aber mit Playwright nicht prüfen: `VERCEL_ENV` setzt die
 * Plattform, lokal ist die Variable nie gesetzt. Hier ist der Nachweis.
 */
describe("Indexierung je Umgebung", () => {
  it("Produktion auf Vercel wird indexiert", () => {
    expect(istNichtProduktion("production")).toBe(false);
    expect(indexierungsHeader("production")).toEqual([]);
  });

  it("Preview-Deployments werden nicht indexiert", () => {
    expect(istNichtProduktion("preview")).toBe(true);
    expect(indexierungsHeader("preview")).toEqual([NOINDEX_HEADER]);
  });

  it("`vercel dev` wird ebenfalls nicht indexiert", () => {
    expect(indexierungsHeader("development")).toEqual([NOINDEX_HEADER]);
  });

  it("außerhalb von Vercel bleibt der Kopf weg – der Testlauf prüft dieselbe Seite wie Produktion", () => {
    expect(istNichtProduktion(undefined)).toBe(false);
    expect(istNichtProduktion("")).toBe(false);
    expect(indexierungsHeader(undefined)).toEqual([]);
  });
});
