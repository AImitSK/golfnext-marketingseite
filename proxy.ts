import { NextResponse, type NextRequest } from "next/server";
import { praxisSlugs } from "@/lib/sanity/slugs";

/**
 * Unbekannte `/praxis/…`-Adressen werden hier zu einem echten 404 (Briefing 0027,
 * Aufgabe 0; Messung und Begründung in docs/entscheidungen.md, 08.09.2026).
 *
 * **Warum überhaupt ein Proxy?** `notFound()` liefert in Next 16.3.4 zwar Status 404,
 * aber einen **leeren** Rumpf – der 404-Inhalt steckt nur in der RSC-Nutzlast und
 * wird erst clientseitig eingesetzt. Ohne JavaScript bliebe die Seite leer, und
 * „ohne JavaScript lesbar" ist nicht verhandelbar (CLAUDE.md). Gemessen wurde das für
 * mitliegende `not-found.tsx`, `force-dynamic`, `notFound()` aus einem Layout und aus
 * einer statischen Route – immer leer. Der einzige Weg, der Statuscode **und**
 * vollständiges Server-HTML liefert, ist Nexts eigener Routen-Fehlschlag. Genau den
 * erzeugt dieser Proxy: Er schreibt die Anfrage auf einen Pfad um, den es nicht gibt.
 *
 * Damit rendert `app/not-found.tsx` mit den Texten aus `lib/ui/messages.ts` – die
 * gewohnte 404-Seite, vollständig im HTML, mit genau einer Kopfzeile.
 *
 * Ist Sanity nicht erreichbar, lässt der Proxy die Anfrage durch: lieber ein
 * `notFound()` aus der Seite (Status stimmt, Rumpf leer) als ein falscher 404 auf
 * einen Artikel, den es sehr wohl gibt.
 */

/**
 * Zielpfad des Umschreibens. Muss ein Pfad sein, für den es **keine** Route gibt –
 * dann greift Nexts eigener 404. Der Name ist absichtlich sperrig, damit hier nie
 * versehentlich eine echte Seite entsteht.
 */
const KEINE_ROUTE = "/__praxis-nicht-gefunden__";

/**
 * Nexts Metadata-Routen unter `/praxis` – heute das OG-Bild der Übersichtsseite
 * (`/praxis/opengraph-image-<hash>`). Sie sehen aus wie ein Artikel-Slug, sind aber
 * echte Routen; ohne diese Ausnahme schriebe der Proxy sie auf einen 404 um, und die
 * Seite hätte ein OG-Bild, das es nicht gibt (gemessen am 09.09.2026, Briefing 0034).
 */
const METADATA_ROUTE = /^(opengraph-image|twitter-image|icon|apple-icon)(-|$)/;

/** `/praxis/thema/<slug>` – die Rubrikseite. */
const RUBRIK = /^\/praxis\/thema\/([^/]+)\/?$/;
/** `/praxis/<slug>` – die Artikelseite (`thema` ist die Rubrik-Ebene, kein Artikel). */
const ARTIKEL = /^\/praxis\/([^/]+)\/?$/;

export async function proxy(request: NextRequest) {
  // `decodeURIComponent` wirft bei einem einzelnen `%` im Pfad (`/praxis/100%`).
  // Ein solcher Pfad ist ohnehin kein Slug – er wird direkt zum 404, statt den
  // Proxy mit einem Serverfehler abstürzen zu lassen.
  let pfad: string;
  try {
    pfad = decodeURIComponent(request.nextUrl.pathname);
  } catch {
    return NextResponse.rewrite(new URL(KEINE_ROUTE, request.url));
  }

  const rubrik = RUBRIK.exec(pfad);
  const artikel = rubrik ? null : ARTIKEL.exec(pfad);
  if (!rubrik && !artikel) return NextResponse.next();

  // `/praxis/thema` ohne Rubrik ist keine Seite dieser Website.
  if (artikel && artikel[1] === "thema") {
    return NextResponse.rewrite(new URL(KEINE_ROUTE, request.url));
  }

  // Metadata-Routen (das OG-Bild der Übersicht) durchlassen – sie sind kein Artikel.
  if (artikel && METADATA_ROUTE.test(artikel[1]!)) return NextResponse.next();

  const slugs = await praxisSlugs();
  if (!slugs) return NextResponse.next();

  const gesucht = (rubrik?.[1] ?? artikel?.[1])!;
  const bekannt = rubrik ? slugs.rubriken : slugs.artikel;
  if (bekannt.includes(gesucht)) return NextResponse.next();

  return NextResponse.rewrite(new URL(KEINE_ROUTE, request.url));
}

/**
 * Der Proxy läuft ausschließlich für die Praxis-Unterseiten – nicht site-weit und
 * nicht für `/praxis` selbst (die Liste gibt es immer, auch leer).
 */
export const config = {
  matcher: ["/praxis/:slug", "/praxis/thema/:slug"],
};
