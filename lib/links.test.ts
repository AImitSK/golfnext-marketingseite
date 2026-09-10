import { describe, expect, it } from "vitest";
import type { Cta } from "@/content/types";
import { resolveCta } from "./links";

describe("resolveCta", () => {
  // Der Buchungsweg ist am 10.09.2026 entfallen (Entscheidung Stefan): kein cal.com,
  // keine NEXT_PUBLIC_BOOKING_URL. Das Erstgespräch läuft über das Kontaktformular.
  it("löst erstgespraech auf das Kontaktformular auf", () => {
    expect(resolveCta({ label: "x", target: "erstgespraech" })).toBe("/kontakt");
  });

  it("ignoriert eine gesetzte NEXT_PUBLIC_BOOKING_URL", () => {
    process.env.NEXT_PUBLIC_BOOKING_URL = "https://buchung.golfnext.de";
    expect(resolveCta({ label: "x", target: "erstgespraech" })).toBe("/kontakt");
    delete process.env.NEXT_PUBLIC_BOOKING_URL;
  });

  it("löst interne Ziele über href auf", () => {
    expect(resolveCta({ label: "x", target: "intern", href: "/plattform" })).toBe("/plattform");
  });

  it("gibt für intern ohne href die Startseite zurück", () => {
    expect(resolveCta({ label: "x", target: "intern" })).toBe("/");
  });

  it("mappt feste Ziele", () => {
    expect(resolveCta({ label: "x", target: "pakete" })).toBe("/pakete");
    expect(resolveCta({ label: "x", target: "kontakt" })).toBe("/kontakt");
  });

  // Seit Briefing 0031 ist ein Ziel aus der Union verschwunden. Käme ein unbekanntes
  // Ziel trotzdem durch (etwa aus Sanity), landet es auf /kontakt – niemals auf "#".
  it("führt ein unbekanntes Ziel auf /kontakt, nicht auf #", () => {
    const unbekannt = { label: "x", target: "gibt-es-nicht" } as unknown as Cta;
    expect(resolveCta(unbekannt)).toBe("/kontakt");
  });
});
