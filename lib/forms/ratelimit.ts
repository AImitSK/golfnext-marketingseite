import { createHash } from "node:crypto";

/**
 * Rate-Limit und Duplikat-Sperre für das Kontaktformular (docs/06, Stufe B, 5 + 6).
 *
 * Zwei Speicher, eine Schnittstelle:
 *  - **Upstash Redis** über die REST-Schnittstelle, sobald `UPSTASH_REDIS_REST_URL`
 *    und `UPSTASH_REDIS_REST_TOKEN` gesetzt sind (Masterplan 4.3a, noch offen).
 *  - **In-Memory** als Fallback für lokal, Preview und Tests. Er überlebt keinen
 *    Neustart und gilt nur je Instanz – für den Launch akzeptabel (docs/06).
 *
 * Datenschutz: Die IP wird **nie im Klartext** gespeichert, sondern als SHA-256-Hash
 * mit Tagesschlüssel; dasselbe gilt für die E-Mail-Adresse und den Duplikat-Hash.
 * Aus einem Schlüssel lässt sich niemand zurückrechnen, und nach Ablauf der TTL ist
 * er weg.
 *
 * Grundsatz: **Im Zweifel zustellen.** Fällt der Speicher aus, gibt jede Prüfung
 * „erlaubt" zurück – ein Speicherfehler darf nie eine echte Anfrage kosten.
 */

export interface RateStore {
  /** Zählt `key` hoch und setzt beim ersten Mal die Lebensdauer. Gibt den Zähler zurück. */
  incr(key: string, ttlSeconds: number): Promise<number>;
  /** Setzt `key`, falls er noch nicht existiert. `true` = neu gesetzt (kein Duplikat). */
  setIfAbsent(key: string, ttlSeconds: number): Promise<boolean>;
  /** Löscht `key` wieder – für die Rücknahme einer Duplikat-Sperre. */
  release(key: string): Promise<void>;
}

/* ────────────────────────── In-Memory-Fallback ────────────────────────── */

interface Entry {
  count: number;
  expiresAt: number;
}

export function createMemoryStore(now: () => number = Date.now): RateStore {
  const map = new Map<string, Entry>();

  function read(key: string): Entry | undefined {
    const entry = map.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= now()) {
      map.delete(key);
      return undefined;
    }
    return entry;
  }

  return {
    async incr(key, ttlSeconds) {
      const entry = read(key);
      if (entry) {
        entry.count += 1;
        return entry.count;
      }
      map.set(key, { count: 1, expiresAt: now() + ttlSeconds * 1000 });
      return 1;
    },
    async setIfAbsent(key, ttlSeconds) {
      if (read(key)) return false;
      map.set(key, { count: 1, expiresAt: now() + ttlSeconds * 1000 });
      return true;
    },
    async release(key) {
      map.delete(key);
    },
  };
}

/* ────────────────────────── Upstash über REST ────────────────────────── */

/**
 * Upstash-Redis über die REST-Schnittstelle (`fetch`), ohne zusätzliches Paket.
 * `docs/06` nennt `@upstash/ratelimit`; wir brauchen davon genau zwei Befehle
 * (`INCR`/`EXPIRE` und `SET NX EX`) und sparen uns die Abhängigkeit – dokumentiert
 * in `docs/entscheidungen.md`. Die Semantik ist dieselbe.
 */
function createUpstashStore(url: string, token: string): RateStore {
  async function pipeline(commands: (string | number)[][]): Promise<unknown[]> {
    const response = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`upstash ${response.status}`);
    const body: unknown = await response.json();
    if (!Array.isArray(body)) throw new Error("upstash: unerwartete Antwort");
    return body.map((item) => (item as { result?: unknown }).result);
  }

  return {
    async incr(key, ttlSeconds) {
      // EXPIRE … NX setzt die Lebensdauer nur beim ersten Zähler – das Fenster
      // wandert also nicht mit jedem weiteren Versuch nach hinten.
      const [count] = await pipeline([
        ["INCR", key],
        ["EXPIRE", key, ttlSeconds, "NX"],
      ]);
      return typeof count === "number" ? count : 1;
    },
    async setIfAbsent(key, ttlSeconds) {
      const [result] = await pipeline([["SET", key, "1", "NX", "EX", ttlSeconds]]);
      return result !== null;
    },
    async release(key) {
      await pipeline([["DEL", key]]);
    },
  };
}

let shared: RateStore | undefined;

/**
 * Der Speicher dieser Instanz: Upstash, wenn konfiguriert – sonst In-Memory.
 *
 * `RATELIMIT_STORE=memory` erzwingt den In-Memory-Speicher. Playwright startet den
 * Server damit (playwright.config.ts): Ein Testlauf soll weder echte Zähler in der
 * gemeinsamen Redis-Datenbank hinterlassen noch am Limit des vorigen Laufs
 * scheitern. In Production darf der Wert **nie** gesetzt sein.
 */
export function getStore(): RateStore {
  if (shared) return shared;
  const erzwingeMemory = process.env.RATELIMIT_STORE?.trim().toLowerCase() === "memory";
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  shared = !erzwingeMemory && url && token ? createUpstashStore(url, token) : createMemoryStore();
  return shared;
}

/** Nur für Tests: setzt den geteilten Speicher zurück bzw. auf einen eigenen. */
export function __setStore(store: RateStore | undefined): void {
  shared = store;
}

/* ────────────────────────── Schlüssel und Grenzen ────────────────────────── */

/** Grenzen aus docs/06 (Stufe B, Punkt 5). */
export const LIMITS = {
  ipPerHour: 5,
  ipPerDay: 20,
  emailPerDay: 3,
} as const;

const HOUR = 60 * 60;
const DAY = 24 * HOUR;
/** Duplikat-Fenster: dieselbe Nachricht innerhalb von 10 Minuten (docs/06, Punkt 6). */
const DUPLICATE_WINDOW = 10 * 60;

/**
 * Tagesschlüssel für den Hash. Er sorgt dafür, dass derselbe Wert an zwei Tagen
 * verschiedene Hashes ergibt – ein gespeicherter Schlüssel taugt damit nicht als
 * dauerhaftes Personenmerkmal.
 */
function daySalt(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

function hash(value: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 32);
}

export type RateVerdict =
  { allowed: true } | { allowed: false; reason: "ip.hour" | "ip.day" | "email.day" };

/**
 * Prüft die drei Grenzen. Ein Fehler des Speichers führt IMMER zu `allowed` –
 * lieber eine Anfrage zu viel als eine verlorene (docs/06).
 */
export async function checkRateLimit(
  ip: string | undefined,
  email: string,
  now: number = Date.now(),
  store: RateStore = getStore(),
): Promise<RateVerdict> {
  const salt = daySalt(now);
  try {
    if (ip) {
      const ipKey = hash(ip, salt);
      const perHour = await store.incr(`gn:rl:ip:h:${ipKey}:${Math.floor(now / 3_600_000)}`, HOUR);
      if (perHour > LIMITS.ipPerHour) return { allowed: false, reason: "ip.hour" };
      const perDay = await store.incr(`gn:rl:ip:d:${ipKey}`, DAY);
      if (perDay > LIMITS.ipPerDay) return { allowed: false, reason: "ip.day" };
    }
    const mailKey = hash(email, salt);
    const perDay = await store.incr(`gn:rl:mail:d:${mailKey}`, DAY);
    if (perDay > LIMITS.emailPerDay) return { allowed: false, reason: "email.day" };
    return { allowed: true };
  } catch {
    // Kein Log mit Inhalt: Der Grund ist hier immer „Speicher nicht erreichbar".
    console.warn("contact.ratelimit.unavailable");
    return { allowed: true };
  }
}

/**
 * Duplikat-Sperre: dieselbe E-Mail mit derselben Nachricht innerhalb von 10 Minuten.
 * `true` = erste Sendung (Mail verschicken), `false` = Wiederholung (Doppelklick,
 * Zurück-Taste) – der Nutzer bekommt trotzdem die Erfolgsmeldung.
 */
export async function claimSubmission(
  email: string,
  message: string,
  now: number = Date.now(),
  store: RateStore = getStore(),
): Promise<boolean> {
  try {
    return await store.setIfAbsent(duplicateKey(email, message, now), DUPLICATE_WINDOW);
  } catch {
    console.warn("contact.duplicate.unavailable");
    return true;
  }
}

/**
 * Nimmt eine Duplikat-Sperre zurück. Wird gebraucht, wenn der Versand nach dem
 * Reservieren fehlschlägt: Ohne diese Rücknahme würde der zweite, korrigierte
 * Versuch desselben Nutzers innerhalb von zehn Minuten still als Duplikat gelten –
 * die Nachricht wäre verloren.
 */
export async function releaseSubmission(
  email: string,
  message: string,
  now: number = Date.now(),
  store: RateStore = getStore(),
): Promise<void> {
  try {
    await store.release(duplicateKey(email, message, now));
  } catch {
    console.warn("contact.duplicate.releaseFailed");
  }
}

function duplicateKey(email: string, message: string, now: number): string {
  return `gn:dup:${hash(`${email}|${message}`, daySalt(now))}`;
}
