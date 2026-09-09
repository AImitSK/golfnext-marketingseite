import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { OrganisationJsonLd } from "@/components/site/OrganisationJsonLd";

/**
 * Layout aller echten Website-Seiten (Route-Gruppe `(site)`).
 * Hängt den Sticky-Header (Baustein 0004) site-weit über den Seiteninhalt –
 * bisher lag er nur in der Vorschau `/_bausteine` (in `app/(preview)/`).
 *
 * Konvention: Das Layout rendert NUR den Header. Jede Seite liefert ihr eigenes
 * `<main>` (und – ab Phase 2.2 – ihren eigenen `<Footer footerClose={…}/>`),
 * weil `footerClose` seitenspezifisch ist. Der Footer bleibt daher bewusst
 * pro Seite und NICHT im Layout.
 *
 * Das Root-`app/layout.tsx` (html/body, Fonts, Metadata) bleibt unverändert.
 * `/_bausteine` liegt in `app/(preview)/` und ist damit außen vor (eigene Header-Demo).
 *
 * Dazu die strukturierten Daten zur Organisation (Masterplan 6.4): ein Script-Tag im
 * Server-HTML, auf jeder öffentlichen Seite, ohne Sichtbares und ohne Layout.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <OrganisationJsonLd />
      <Header />
      {children}
    </>
  );
}
