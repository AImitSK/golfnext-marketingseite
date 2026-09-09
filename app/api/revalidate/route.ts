/**
 * `POST /api/revalidate` – Ziel des Sanity-Webhooks (Masterplan 3.7).
 *
 * Die Logik steht in `lib/sanity/revalidate.ts`, damit die Unit-Tests sie neben ihr
 * prüfen können. Hier bleibt nur die Route selbst: **kein `GET`**, auch nicht zum
 * Testen – ein Auslöser ohne Signaturprüfung darf es nicht geben.
 */
export { POST } from "@/lib/sanity/revalidate";

/** `@sanity/webhook` prüft die Signatur mit Node-Krypto – keine Edge-Runtime. */
export const runtime = "nodejs";

/** Jede Meldung wird einzeln geprüft; nichts an dieser Route darf im Cache landen. */
export const dynamic = "force-dynamic";
