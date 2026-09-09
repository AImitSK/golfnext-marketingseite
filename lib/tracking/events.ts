import { getMarketingConsent } from "@/lib/consent/state";

/**
 * Die Ereignisse aus `docs/09-tracking-plan.md` – typisiert, an einer Stelle
 * (Briefing 0033, Masterplan 5.4). Komponenten greifen **nie** selbst auf
 * `window.dataLayer` zu.
 *
 * **Zwei Bedingungen, sonst passiert nichts.** Gesendet wird nur, wenn
 *  1. die Einwilligung „Statistik und Marketing" erteilt ist und
 *  2. `NEXT_PUBLIC_GTM_ID` gesetzt ist.
 * Ist eine der beiden nicht erfüllt, ist der Aufruf **wirkungslos, nicht fehlerhaft**
 * – die aufrufende Komponente muss nichts prüfen und nichts abfangen. Ereignisse vor
 * der Einwilligung werden bewusst nicht gepuffert (docs/09): Was vorher geschah, ist
 * weg. Beides ist heute der Normalfall, weil keine GTM-ID gesetzt ist.
 *
 * **Verdrahtet sind in diesem Schritt zwei Ereignisse:** `cta_erstgespraech_click`
 * (Micro-Conversion) und `contact_submitted` (Hauptconversion). Die übrigen fünf
 * stehen hier vorbereitet, werden aber noch nicht ausgelöst – sie hängen an FAQ,
 * Paketkarten und Artikeln, deren Umbau ein eigener Schritt ist (Briefing 0033).
 *
 * **Keine personenbezogenen Daten in Parametern** (docs/09): kein Name, keine
 * E-Mail-Adresse, kein Freitext, kein Clubname. Was hier durchgeht, sind
 * Auswahlwerte aus festen Listen, Positionen und Pfade.
 */

/** Parameter je Ereignis. Namen in snake_case wie im Tracking-Plan. */
type EventMap = {
  /** Klick auf „Online-Erstgespräch vereinbaren" (Header, Sektionen, Footer). */
  cta_erstgespraech_click: { position: string; page: string };
  /** Formular erfolgreich gesendet (Server-Antwort ok). Hauptconversion. */
  contact_submitted: { form: "kontakt"; interesse?: string };
  /** Leistungsliste in einer Paketkarte aufgeklappt. Noch nicht verdrahtet. */
  paket_details_open: { paket: "wachstum" | "komplett" | "individuell" };
  /** Vergleichstabelle im Viewport. Noch nicht verdrahtet. */
  paket_vergleich_view: Record<string, never>;
  /** FAQ-Frage geöffnet. Noch nicht verdrahtet. */
  faq_open: { question_id: string; page: string };
  /** Artikel zu 75 % gescrollt. Noch nicht verdrahtet. */
  ratgeber_read: { slug: string; rubrik?: string };
  /** Klick auf einen externen Link. Noch nicht verdrahtet. */
  outbound_click: { href_domain: string };
};

export type EventName = keyof EventMap;

/** Darf überhaupt gesendet werden? Beide Bedingungen aus dem Kopfkommentar. */
export function trackingAktiv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GTM_ID) && getMarketingConsent();
}

/**
 * Der einzige Schreibzugriff auf den `dataLayer`. Nicht exportiert: Ereignisse
 * laufen über die benannten Funktionen unten, damit Name und Parameter zusammen an
 * einer Stelle stehen und nicht in den Komponenten auseinanderlaufen.
 */
function push<E extends EventName>(event: E, params: EventMap[E]): void {
  if (typeof window === "undefined") return;
  if (!trackingAktiv()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/**
 * Micro-Conversion: Klick auf das Erstgespräch. `position` sagt, wo auf der Seite
 * der Klick war (header · footer · Sektions-Id), `page` ist der Pfad – beides ohne
 * Personenbezug.
 */
export function trackCtaErstgespraechClick(position: string, page: string): void {
  push("cta_erstgespraech_click", { position, page });
}

/**
 * Hauptconversion: Das Kontaktformular wurde erfolgreich gesendet. `interesse` ist
 * der gewählte Wert aus der festen Themenliste (`content/kontakt.ts`) – nie ein
 * Freitext und nie eine Angabe zur Person. Ohne Auswahl bleibt der Parameter weg.
 */
export function trackContactSubmitted(interesse?: string): void {
  push("contact_submitted", interesse ? { form: "kontakt", interesse } : { form: "kontakt" });
}

/* ── Vorbereitet, in diesem Schritt bewusst nicht verdrahtet (Briefing 0033) ── */

export function trackPaketDetailsOpen(paket: EventMap["paket_details_open"]["paket"]): void {
  push("paket_details_open", { paket });
}

export function trackPaketVergleichView(): void {
  push("paket_vergleich_view", {});
}

export function trackFaqOpen(questionId: string, page: string): void {
  push("faq_open", { question_id: questionId, page });
}

export function trackRatgeberRead(slug: string, rubrik?: string): void {
  push("ratgeber_read", rubrik ? { slug, rubrik } : { slug });
}

export function trackOutboundClick(hrefDomain: string): void {
  push("outbound_click", { href_domain: hrefDomain });
}
