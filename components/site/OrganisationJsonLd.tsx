import { JsonLd } from "@/components/site/JsonLd";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { ORGANISATION } from "@/lib/seo/organisation";
import { sanityFetch } from "@/lib/sanity/client";
import { QUERY_TAGS, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";

/**
 * `Organization` als strukturierte Daten auf jeder Seite der Website
 * (Masterplan 6.4, Briefing 0034). Liegt im Layout der Route-Gruppe `(site)` und
 * damit auf allen öffentlichen Seiten – nicht im Studio.
 *
 * Telefon und E-Mail kommen aus den Sanity-Einstellungen, sofern gepflegt; sonst aus
 * dem Impressum (`lib/seo/organisation.ts`). Beides sind dieselben Angaben, nur zwei
 * Pflegeorte – deshalb hat das Studio Vorrang. Ist Sanity nicht erreichbar, bleibt es
 * beim Impressum, statt dass eine Seite deswegen nicht rendert.
 */
export async function OrganisationJsonLd() {
  const einstellungen = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    tags: QUERY_TAGS.SITE_SETTINGS_QUERY,
  }).catch(() => null);

  return (
    <JsonLd
      daten={organizationJsonLd({
        telefon: einstellungen?.phone ?? ORGANISATION.telefon,
        email: einstellungen?.email ?? ORGANISATION.email,
      })}
    />
  );
}
