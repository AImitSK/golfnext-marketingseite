import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath, revalidateTag } from "next/cache";
import type { SanityTag } from "./client";

/**
 * Handler für den Sanity-Webhook (Masterplan 3.7, docs/04-sanity-content-modell.md).
 *
 * Sanity meldet jede Veröffentlichung, die Website verwirft genau die betroffene
 * Cache-Marke. Ohne diesen Weg greift nur das Sicherheitsnetz `revalidate = 3600`
 * aus `lib/sanity/client.ts` – ein neuer Artikel oder eine neue FAQ stünde dann bis
 * zu einer Stunde lang nicht auf der Seite. Das Netz bleibt, der Webhook ersetzt es
 * nicht.
 *
 * Der Code steht hier und nicht in `app/api/revalidate/route.ts`, damit ihn die
 * Unit-Tests neben ihm prüfen können (`vitest` liest `lib/**`); die Route
 * exportiert ihn unverändert weiter.
 *
 * Zwei Regeln bestimmen jede Verzweigung:
 *  1. **Ohne gültige Signatur passiert nichts.** Antwort `401`, kein Hinweis darauf,
 *     was gefehlt hat – wer den Endpunkt abklopft, lernt daraus nichts.
 *  2. **Ein unbekannter Typ ist kein Fehler.** Sanity wiederholt fehlgeschlagene
 *     Aufrufe; ein `200` mit dem Vermerk „nichts zu tun" beendet den Vorgang sauber.
 *
 * Geloggt wird ausschließlich `revalidate.<status>` mit Typ und Marke – kein
 * Secret, keine Kopfzeile, keine Nutzlast, nichts Personenbezogenes.
 */

/**
 * Dokumenttyp aus Sanity → Cache-Marke aus `SANITY_TAGS`. Bis auf `siteSettings`
 * (Marke `settings`) heißen beide gleich; die Zuordnung steht trotzdem
 * ausgeschrieben, damit ein neuer Dokumenttyp bewusst ergänzt werden muss und nicht
 * versehentlich eine Marke erfindet.
 */
const TAG_FUER_TYP = {
  post: "post",
  category: "category",
  author: "author",
  faq: "faq",
  siteSettings: "settings",
} as const satisfies Record<string, SanityTag>;

/**
 * Zweites Argument von `revalidateTag` (seit Next 16 Pflicht). `{ expire: 0 }` heißt
 * „ab sofort abgelaufen": Der nächste Aufruf holt die Inhalte frisch, statt noch
 * einmal die alte Fassung weiterzureichen. Genau das erwartet der Webhook – seine
 * Meldung kommt erst, wenn in Sanity tatsächlich veröffentlicht wurde.
 */
const SOFORT_ABGELAUFEN = { expire: 0 } as const;

/** Nutzlast des Webhooks – Projektion `{_type, "slug": slug.current}`. */
type WebhookPayload = {
  _type?: unknown;
  slug?: unknown;
};

/**
 * Ein Slug landet in `revalidatePath('/praxis/' + slug)` und damit in einem Pfad.
 * Deshalb nur die Zeichen, die die Slug-Regel des Schemas ohnehin erlaubt – kein
 * Schrägstrich, kein Leerzeichen, keine Pfadnavigation.
 */
function istVerwendbarerSlug(slug: unknown): slug is string {
  return typeof slug === "string" && /^[a-z0-9][a-z0-9-]*$/i.test(slug);
}

/** Antwort ohne Inhalt und ohne Begründung. */
function abgelehnt(): Response {
  return new Response(null, { status: 401 });
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    // Betriebsfehler, kein Angriff: Ohne Secret kann nichts geprüft werden.
    console.error("revalidate.rejected", "kein Secret in der Umgebung");
    return abgelehnt();
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) {
    console.warn("revalidate.rejected", "Signatur");
    return abgelehnt();
  }

  // Roher Text, nicht neu serialisiertes JSON: Die Signatur gilt für genau die
  // Zeichen, die Sanity gesendet hat.
  const rohtext = await request.text();

  let gueltig = false;
  try {
    gueltig = await isValidSignature(rohtext, signature, secret);
  } catch {
    // Auch eine kaputte Signaturkopfzeile ist nur eine ungültige Signatur.
    gueltig = false;
  }

  if (!gueltig) {
    console.warn("revalidate.rejected", "Signatur");
    return abgelehnt();
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rohtext) as WebhookPayload;
  } catch {
    // Signiert, aber unlesbar: Ein erneuter Versuch änderte daran nichts, deshalb
    // `200` statt eines Fehlers, der Sanity zur Wiederholung bringt.
    console.warn("revalidate.skipped", "Nutzlast nicht lesbar");
    return Response.json({ revalidated: false });
  }

  const typ = payload._type;
  const tag =
    typeof typ === "string" && typ in TAG_FUER_TYP
      ? TAG_FUER_TYP[typ as keyof typeof TAG_FUER_TYP]
      : undefined;

  if (!tag) {
    console.info("revalidate.skipped", typeof typ === "string" ? typ : "ohne Typ");
    return Response.json({ revalidated: false });
  }

  revalidateTag(tag, SOFORT_ABGELAUFEN);

  // Die Artikelseite liegt zusätzlich über ihren Pfad im Cache, nicht nur über die
  // Marke – der Pfad muss deshalb eigens verworfen werden.
  let path: string | undefined;
  if (typ === "post" && istVerwendbarerSlug(payload.slug)) {
    path = `/praxis/${payload.slug}`;
    revalidatePath(path);
  }

  console.info("revalidate.ok", `${typ} → ${tag}`);

  return Response.json(path ? { revalidated: true, tag, path } : { revalidated: true, tag });
}
