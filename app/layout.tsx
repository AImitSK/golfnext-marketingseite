import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { Analytics } from "@/components/site/Analytics";
import { ConsentBanner } from "@/components/site/ConsentBanner";
import { CookieToast } from "@/components/site/CookieToast";
import { CtaTracking } from "@/components/site/CtaTracking";
import { CONSENT_DEFAULT_SNIPPET } from "@/lib/consent/consent-mode";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

/**
 * Fonts über next/font/google – zur Build-Zeit heruntergeladen und selbst gehostet.
 * Es geht KEIN Laufzeit-Request an fonts.googleapis.com (DSGVO, LG München 2022).
 * Archivo = Headlines (--font-display), Inter = Fließtext (--font-sans), beide variabel.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Site-weite Metadata (Masterplan 6.1, Briefing 0034).
 *
 * `metadataBase` kommt aus `NEXT_PUBLIC_SITE_URL` (`lib/site-url.ts`) und macht die
 * relativen Canonicals der Seiten zu absoluten Adressen. Titel und Beschreibung sind
 * der Rückfall für Routen ohne eigene Angabe; jede gebaute Seite setzt beides über
 * `routeMetadata` aus `config/site-structure.ts`.
 *
 * Die `openGraph`-Vorgaben stehen hier, damit auch die Routen ohne eigene Metadata
 * (404, `/studio`) als GolfNext-Seite geteilt werden. Das Bild hängt nicht hier: Das
 * liefert `app/opengraph-image.tsx` bzw. die Datei der jeweiligen Route.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "GolfNext",
    template: "%s | GolfNext",
  },
  description: "Marketing und Automation als Software-Layer für Golfanlagen.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "GolfNext",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${archivo.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/*
          Google Consent Mode v2, Standard „alles verweigert" (Briefing 0033,
          Masterplan 5.4). `beforeInteractive` hängt das Script inline in den
          <head> und lässt es vor der Hydration laufen – und damit lange vor
          allem, was Google oder Meta laden könnte: Diese Tags bindet erst
          `components/site/Analytics.tsx` nach einer Einwilligung ein. Ohne den
          Standard „denied" würde ein später geladener Google-Tag annehmen, es sei
          eingewilligt worden.

          Im Quelltext stehen davor nur Next.js' eigene Framework-Chunks
          (first-party, `async`) – die stellt der Router selbst voran, sie laden
          nichts von außen und lesen den `dataLayer` nicht. Das Script kontaktiert
          niemanden: Es legt `dataLayer` und `gtag` an und schreibt vier
          `denied`-Werte hinein; inline, damit es keinen eigenen Request braucht.
        */}
        <Script
          id="consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }}
        />
        {children}

        {/* Einwilligung und Tracking (Briefing 0033). Reihenfolge egal – keiner der
            vier Bausteine rendert Layout, keiner verschiebt etwas.
            - ConsentBanner startet den Dialog (rendert nichts Sichtbares),
            - CookieToast bestätigt die gespeicherte Auswahl (der einzige Toast),
            - Analytics bindet GTM/Meta-Pixel ein – erst nach Einwilligung und nur
              mit gesetzter ID (beide IDs sind derzeit nicht gesetzt),
            - CtaTracking zählt Klicks auf den Erstgespräch-CTA. */}
        <ConsentBanner />
        <CookieToast />
        <Analytics />
        <CtaTracking />

        {/* Vercel Web Analytics: cookielos, keine geräteübergreifende Kennung,
            keine IP-Speicherung – deshalb ohne Einwilligung zulässig und in
            Abschnitt 7 der Datenschutzerklärung benannt (docs/05). Der einzige
            Dienst, der vor einer Entscheidung laufen darf. Er ist first-party:
            Script und Messpunkt liegen unter `/_vercel/insights` auf derselben
            Domain, es geht nichts an einen Dritten.

            **Nur auf Vercel.** Genau dort gibt es diesen Pfad; außerhalb (lokale
            Entwicklung, Testläufe, jede andere Umgebung) antwortet er mit 404, und
            der Browser meldet einen Konsolenfehler auf jeder Seite. `VERCEL` setzt
            die Plattform selbst – beim Bauen wie zur Laufzeit. */}
        {process.env.VERCEL ? <VercelAnalytics /> : null}
      </body>
    </html>
  );
}
