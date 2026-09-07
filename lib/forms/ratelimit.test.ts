import { describe, expect, it } from "vitest";
import {
  LIMITS,
  checkRateLimit,
  claimSubmission,
  createMemoryStore,
  releaseSubmission,
  type RateStore,
} from "./ratelimit";

/**
 * Rate-Limit und Duplikat-Sperre. Wichtiger als jede Grenze ist die letzte Prüfung:
 * Fällt der Speicher aus, wird zugestellt – ein Speicherfehler darf nie eine echte
 * Anfrage kosten (docs/06).
 */

const IP = "203.0.113.7";
const MAIL = "anna@example.de";
const NOW = 1_700_000_000_000;

/** Ein Speicher, dessen Uhr wir selbst stellen. */
function store() {
  let jetzt = NOW;
  const s = createMemoryStore(() => jetzt);
  return { s, vor: (ms: number) => (jetzt += ms) };
}

describe("checkRateLimit", () => {
  it("lässt die ersten fünf Sendungen einer IP innerhalb einer Stunde durch", async () => {
    const { s } = store();
    for (let i = 0; i < LIMITS.ipPerHour; i++) {
      // Jede Sendung mit eigener Adresse, damit nur die IP-Grenze greift.
      const verdict = await checkRateLimit(IP, `a${i}@example.de`, NOW, s);
      expect(verdict.allowed).toBe(true);
    }
    const zuViel = await checkRateLimit(IP, "a99@example.de", NOW, s);
    expect(zuViel).toEqual({ allowed: false, reason: "ip.hour" });
  });

  it("gibt die IP nach einer Stunde wieder frei", async () => {
    const { s, vor } = store();
    for (let i = 0; i < LIMITS.ipPerHour; i++) {
      await checkRateLimit(IP, `a${i}@example.de`, NOW, s);
    }
    vor(61 * 60 * 1000);
    const spaeter = NOW + 61 * 60 * 1000;
    expect((await checkRateLimit(IP, "neu@example.de", spaeter, s)).allowed).toBe(true);
  });

  it("begrenzt dieselbe E-Mail auf drei Anfragen am Tag", async () => {
    const { s } = store();
    for (let i = 0; i < LIMITS.emailPerDay; i++) {
      // Wechselnde IPs, damit nur die E-Mail-Grenze greift.
      expect((await checkRateLimit(`10.0.0.${i}`, MAIL, NOW, s)).allowed).toBe(true);
    }
    expect(await checkRateLimit("10.0.0.9", MAIL, NOW, s)).toEqual({
      allowed: false,
      reason: "email.day",
    });
  });

  it("zählt ohne bekannte IP nur die E-Mail", async () => {
    const { s } = store();
    expect((await checkRateLimit(undefined, MAIL, NOW, s)).allowed).toBe(true);
  });

  it("stellt zu, wenn der Speicher ausfällt", async () => {
    const kaputt: RateStore = {
      incr: () => Promise.reject(new Error("offline")),
      setIfAbsent: () => Promise.reject(new Error("offline")),
      release: () => Promise.reject(new Error("offline")),
    };
    expect(await checkRateLimit(IP, MAIL, NOW, kaputt)).toEqual({ allowed: true });
  });

  it("speichert weder IP noch E-Mail im Klartext", async () => {
    const gesehen: string[] = [];
    const spion: RateStore = {
      async incr(key) {
        gesehen.push(key);
        return 1;
      },
      async setIfAbsent(key) {
        gesehen.push(key);
        return true;
      },
      async release() {},
    };
    await checkRateLimit(IP, MAIL, NOW, spion);
    await claimSubmission(MAIL, "Eine Nachricht", NOW, spion);
    expect(gesehen.length).toBeGreaterThan(0);
    for (const key of gesehen) {
      expect(key).not.toContain(IP);
      expect(key).not.toContain(MAIL);
    }
  });
});

describe("Duplikat-Sperre", () => {
  it("lässt dieselbe Nachricht nur einmal durch (Doppelklick, Zurück-Taste)", async () => {
    const { s } = store();
    expect(await claimSubmission(MAIL, "Gleiche Nachricht", NOW, s)).toBe(true);
    expect(await claimSubmission(MAIL, "Gleiche Nachricht", NOW, s)).toBe(false);
  });

  it("unterscheidet verschiedene Nachrichten und Adressen", async () => {
    const { s } = store();
    await claimSubmission(MAIL, "Erste", NOW, s);
    expect(await claimSubmission(MAIL, "Zweite", NOW, s)).toBe(true);
    expect(await claimSubmission("b@example.de", "Erste", NOW, s)).toBe(true);
  });

  it("gibt nach zehn Minuten wieder frei", async () => {
    const { s, vor } = store();
    await claimSubmission(MAIL, "Gleiche Nachricht", NOW, s);
    vor(11 * 60 * 1000);
    const spaeter = NOW + 11 * 60 * 1000;
    expect(await claimSubmission(MAIL, "Gleiche Nachricht", spaeter, s)).toBe(true);
  });

  it("nimmt die Sperre zurück, wenn der Versand fehlschlägt", async () => {
    const { s } = store();
    expect(await claimSubmission(MAIL, "Nachricht", NOW, s)).toBe(true);
    await releaseSubmission(MAIL, "Nachricht", NOW, s);
    // Der zweite Versuch derselben Nachricht darf nicht still verschluckt werden.
    expect(await claimSubmission(MAIL, "Nachricht", NOW, s)).toBe(true);
  });

  it("sendet im Zweifel, wenn der Speicher ausfällt", async () => {
    const kaputt: RateStore = {
      incr: () => Promise.reject(new Error("offline")),
      setIfAbsent: () => Promise.reject(new Error("offline")),
      release: () => Promise.reject(new Error("offline")),
    };
    expect(await claimSubmission(MAIL, "Nachricht", NOW, kaputt)).toBe(true);
  });
});
