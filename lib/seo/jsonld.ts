import { ROUTES } from "@/config/site-structure";
import { ORGANISATION } from "@/lib/seo/organisation";
import { siteUrl } from "@/lib/site-url";

/**
 * Die vier Bausteine strukturierter Daten (Masterplan 6.4, Briefing 0034):
 * `Organization`, `FAQPage`, `Article` und `BreadcrumbList`.
 *
 * **Was hier nicht steht und nicht dazukommt:** Bewertungen, `aggregateRating`,
 * Preise, Kundenzahlen, Öffnungszeiten. Jedes Feld hat eine Quelle – das Impressum,
 * die Sanity-Einstellungen oder das Sanity-Dokument selbst. Fehlt die Quelle, fehlt
 * das Feld.
 */

/** Feste Kennung, damit `Article.publisher` auf dieselbe Organisation zeigt. */
export const ORGANISATION_ID = "#organisation";

function absolut(pfad: string): string {
  return new URL(pfad, siteUrl()).toString();
}

export function organizationJsonLd({
  telefon,
  email,
}: {
  telefon: string;
  email: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absolut(ORGANISATION_ID),
    name: ORGANISATION.name,
    url: absolut("/"),
    // Das Signet aus `public/` – dieselbe Datei, die auch im Web-App-Manifest steht.
    logo: absolut("/icon-512.png"),
    founder: { "@type": "Person", name: ORGANISATION.gruender },
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANISATION.strasse,
      postalCode: ORGANISATION.plz,
      addressLocality: ORGANISATION.ort,
      addressCountry: ORGANISATION.land,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: telefon,
      email,
      availableLanguage: "de",
    },
  };
}

/**
 * `FAQPage` aus den echten Sanity-FAQs. Antworten kommen als Klartext (Portable Text
 * kennt schema.org nicht). Ohne Fragen entsteht kein Markup – wie der sichtbare
 * Abschnitt auch.
 */
export function faqPageJsonLd(
  fragen: { question: string; answer: string }[],
): Record<string, unknown> | null {
  if (fragen.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fragen.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * `Article` eines Praxis-Beitrags. `image` steht nur, wenn der Artikel ein Titelbild
 * hat – ein Platzhalter ist kein Artikelbild und gehört nicht ins Markup.
 */
export function articleJsonLd({
  titel,
  beschreibung,
  pfad,
  veroeffentlicht,
  geaendert,
  autor,
  bildUrl,
}: {
  titel: string;
  beschreibung?: string | null;
  pfad: string;
  veroeffentlicht?: string | null;
  geaendert?: string | null;
  autor?: string | null;
  bildUrl?: string | null;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: titel,
    ...(beschreibung ? { description: beschreibung } : {}),
    mainEntityOfPage: absolut(pfad),
    ...(veroeffentlicht ? { datePublished: veroeffentlicht } : {}),
    ...(geaendert ? { dateModified: geaendert } : {}),
    ...(autor ? { author: { "@type": "Person", name: autor } } : {}),
    ...(bildUrl ? { image: bildUrl } : {}),
    publisher: { "@id": absolut(ORGANISATION_ID) },
    inLanguage: "de-DE",
  };
}

/**
 * `BreadcrumbList` für Unterseiten – Seiten, die unter einer anderen Adresse liegen
 * (`/plattform/so-arbeitet-golfnext`, `/praxis/<slug>`, `/praxis/thema/<slug>`).
 * Auf den Hauptseiten gibt es nichts zu zeigen: Sie hängen direkt an der Startseite.
 */
export function breadcrumbJsonLd(
  stationen: { name: string; pfad: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: stationen.map((station, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: station.name,
      item: absolut(station.pfad),
    })),
  };
}

/**
 * Der Name einer Route für die Brotkrumen – das Navigations-`label` aus
 * `config/site-structure.ts`, nicht der Meta-Titel: In einer Brotkrume steht der
 * kurze Menüname, nicht der Satz aus dem Suchergebnis.
 */
export function routeLabel(pfad: string): string {
  const route = ROUTES.find((r) => r.path === pfad);
  if (!route) throw new Error(`Route "${pfad}" fehlt in config/site-structure.ts`);
  return route.label;
}
