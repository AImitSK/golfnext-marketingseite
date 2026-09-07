import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ContactInput } from "./schema";
import {
  MAX_AGE_MS,
  REVIEW_THRESHOLD,
  detectAnomalies,
  hasSigningSecret,
  scoreSubmission,
  signTimestamp,
  verifyTimestamp,
} from "./spam";

/**
 * Der Spam-Schutz hat eine Leitregel: **Nichts Legitimes darf verloren gehen.**
 * Die Tests halten beide Seiten fest – was still verworfen wird (eindeutige
 * Bot-Signale) und was auf jeden Fall durchkommt, notfalls nur markiert.
 */

/** Wagenrücklauf und Zeilenumbruch – aus Zeichencodes, damit die Quelle lesbar bleibt. */
const CRLF = String.fromCharCode(13, 10);

const SECRET = "test-signing-secret-mindestens-32-zeichen";

beforeEach(() => {
  process.env.FORM_SIGNING_SECRET = SECRET;
});

afterEach(() => {
  delete process.env.FORM_SIGNING_SECRET;
});

describe("signierter Zeitstempel", () => {
  it("erkennt den eigenen Wert nach angemessener Zeit an", () => {
    const now = 1_700_000_000_000;
    const ts = signTimestamp(now);
    const verdict = verifyTimestamp(ts, now + 30_000);
    expect(verdict.ok).toBe(true);
    expect(verdict.ok && verdict.ageMs).toBe(30_000);
    expect(verdict.ok && verdict.unsigned).toBe(false);
  });

  it("verwirft einen fehlenden Zeitstempel", () => {
    expect(verifyTimestamp(undefined)).toEqual({ ok: false, reason: "ts.missing" });
    expect(verifyTimestamp("")).toEqual({ ok: false, reason: "ts.missing" });
    expect(verifyTimestamp("1700000000000")).toEqual({ ok: false, reason: "ts.missing" });
  });

  it("verwirft eine gefälschte Signatur", () => {
    const now = 1_700_000_000_000;
    expect(verifyTimestamp(`${now}.deadbeef`, now + 30_000)).toEqual({
      ok: false,
      reason: "ts.forged",
    });
  });

  it("verwirft einen Zeitstempel aus einem anderen Schlüssel", () => {
    const fremd = signTimestamp(1_700_000_000_000);
    process.env.FORM_SIGNING_SECRET = "ein-ganz-anderes-secret-mit-32-zeichen";
    expect(verifyTimestamp(fremd, 1_700_000_030_000).ok).toBe(false);
  });

  it("verwirft eine Sendung nach 2 Sekunden (zu schnell für einen Menschen)", () => {
    const now = 1_700_000_000_000;
    expect(verifyTimestamp(signTimestamp(now), now + 2_000)).toEqual({
      ok: false,
      reason: "ts.tooYoung",
    });
  });

  it("verwirft ein drei Stunden altes Formular", () => {
    const now = 1_700_000_000_000;
    expect(verifyTimestamp(signTimestamp(now), now + 3 * 60 * 60 * 1000)).toEqual({
      ok: false,
      reason: "ts.tooOld",
    });
    // Genau an der Grenze ist es noch gültig.
    expect(verifyTimestamp(signTimestamp(now), now + MAX_AGE_MS).ok).toBe(true);
  });

  describe("ohne FORM_SIGNING_SECRET", () => {
    beforeEach(() => {
      delete process.env.FORM_SIGNING_SECRET;
    });

    it("meldet den Notbetrieb", () => {
      expect(hasSigningSecret()).toBe(false);
    });

    it("verliert keine legitime Anfrage, markiert sie aber", () => {
      const now = 1_700_000_000_000;
      const verdict = verifyTimestamp(signTimestamp(now), now + 30_000);
      expect(verdict.ok).toBe(true);
      expect(verdict.ok && verdict.unsigned).toBe(true);
    });

    it("weist ein fremdes Format trotzdem ab", () => {
      const now = 1_700_000_000_000;
      expect(verifyTimestamp(`${now}.abc`, now + 30_000).ok).toBe(false);
    });
  });
});

describe("Payload-Anomalien (Stufe A)", () => {
  const feld = (entries: Record<string, string>) => new Map(Object.entries(entries));

  it("lässt eine normale Anfrage durch", () => {
    expect(
      detectAnomalies(
        feld({
          vorname: "Anna",
          nachname: "Berger",
          email: "anna@example.de",
          nachricht: "Wir sind ein 18-Loch-Club und hätten eine Frage zu den Paketen.",
          einwilligung: "on",
          ts: "1700000000000.abc",
        }),
      ),
    ).toEqual([]);
  });

  it("lässt eine Nachricht mit einer einzelnen Adresse durch (nur Stufe B bewertet sie)", () => {
    expect(
      detectAnomalies(
        feld({ nachricht: "Unsere Seite ist https://gc-musterhausen.de – schauen Sie mal." }),
      ),
    ).toEqual([]);
  });

  it("erkennt unbekannte Felder", () => {
    expect(detectAnomalies(feld({ vorname: "Anna", geschenk: "ja" }))).toContain(
      "payload.unknownField",
    );
  });

  it("erkennt Steuerzeichen (Header-Injection)", () => {
    const mitUmbruch = ["anna@example.de", "bcc:opfer@example.com"].join(CRLF);
    expect(detectAnomalies(feld({ email: mitUmbruch }))).toContain("payload.controlChars");
  });

  it("erkennt absurd lange Felder", () => {
    expect(detectAnomalies(feld({ vorname: "x".repeat(400) }))).toContain("payload.oversized");
  });

  it("lässt eine zu lange, aber menschenmögliche Nachricht durch – sie bekommt den Feldfehler", () => {
    expect(detectAnomalies(feld({ nachricht: "x ".repeat(1800) }))).toEqual([]);
  });

  it("erkennt drei und mehr Adressen in der Nachricht", () => {
    expect(
      detectAnomalies(feld({ nachricht: "http://a.de http://b.de http://c.de günstige Angebote" })),
    ).toContain("payload.manyUrls");
  });

  it("erkennt eine Nachricht, die nur aus Adressen besteht", () => {
    expect(detectAnomalies(feld({ nachricht: "https://spam.example" }))).toContain(
      "payload.onlyUrls",
    );
  });

  it("erkennt einen langen Block ohne ein einziges Leerzeichen", () => {
    expect(detectAnomalies(feld({ nachricht: "a".repeat(200) }))).toContain("payload.noWhitespace");
  });
});

describe("Heuristik-Score (Stufe B)", () => {
  const anfrage = (patch: Partial<ContactInput> = {}): ContactInput => ({
    vorname: "Anna",
    nachname: "Berger",
    rolle: "Clubmanager",
    club: "Golfclub Musterhausen",
    thema: "Etwas anderes",
    email: "anna.berger@gc-musterhausen.de",
    telefon: undefined,
    nachricht: "Wir hätten eine Frage zu den Paketen.",
    einwilligung: "on",
    ...patch,
  });

  const kontext = { ageMs: 60_000, unsigned: false };

  it("bewertet eine normale Anfrage mit 0 und markiert sie nicht", () => {
    const result = scoreSubmission(anfrage(), kontext);
    expect(result.score).toBe(0);
    expect(result.review).toBe(false);
  });

  it("zählt eine Wegwerf-Adresse hoch genug für die Markierung", () => {
    const result = scoreSubmission(anfrage({ email: "abc@mailinator.com" }), kontext);
    expect(result.reasons).toContain("disposable");
    expect(result.review).toBe(true);
  });

  it("zählt eine Adresse in der Nachricht und schnelles Ausfüllen zusammen", () => {
    const result = scoreSubmission(anfrage({ nachricht: "Schauen Sie auf https://x.example" }), {
      ageMs: 5_000,
      unsigned: false,
    });
    expect(result.reasons).toEqual(expect.arrayContaining(["urls", "fastFill"]));
    expect(result.score).toBeGreaterThanOrEqual(REVIEW_THRESHOLD);
  });

  it("erkennt eine Mischung aus lateinischer und kyrillischer Schrift", () => {
    const result = scoreSubmission(anfrage({ nachricht: "Hallo Приветствие Angebot" }), kontext);
    expect(result.reasons).toContain("mixedScripts");
  });

  it("erkennt Namen gleich E-Mail-Localpart", () => {
    const result = scoreSubmission(
      anfrage({ vorname: "anna", nachname: "berger", email: "annaberger@example.de" }),
      kontext,
    );
    expect(result.reasons).toContain("nameEqualsLocalpart");
  });

  it("erkennt einen Anlagennamen aus einem Wort ohne Vokal", () => {
    expect(scoreSubmission(anfrage({ club: "xkcdgh" }), kontext).reasons).toContain(
      "clubWithoutVowel",
    );
  });

  it("markiert den Notbetrieb ohne Signatur, verwirft aber nicht", () => {
    const result = scoreSubmission(anfrage(), { ageMs: 60_000, unsigned: true });
    expect(result.reasons).toEqual(["unsignedTimestamp"]);
    expect(result.review).toBe(false);
  });
});
