import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { bookingUrl, liveDemoUrl, resolveCta } from "./links";

const ORIGINAL = { ...process.env };

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_BOOKING_URL;
  delete process.env.NEXT_PUBLIC_LIVE_DEMO_URL;
});

afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe("bookingUrl", () => {
  it("nutzt den Fallback /kontakt, wenn keine URL gesetzt ist", () => {
    expect(bookingUrl()).toBe("/kontakt");
  });

  it("nutzt die gesetzte Buchungs-URL", () => {
    process.env.NEXT_PUBLIC_BOOKING_URL = "https://calendly.com/golfnext";
    expect(bookingUrl()).toBe("https://calendly.com/golfnext");
  });
});

describe("liveDemoUrl", () => {
  it("fällt auf /kontakt zurück", () => {
    expect(liveDemoUrl()).toBe("/kontakt");
  });
});

describe("resolveCta", () => {
  it("löst erstgespraech über die Buchungs-URL auf", () => {
    process.env.NEXT_PUBLIC_BOOKING_URL = "https://buchung.golfnext.de";
    expect(resolveCta({ label: "x", target: "erstgespraech" })).toBe("https://buchung.golfnext.de");
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
});
