"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import {
  getMarketingConsent,
  getMarketingConsentServer,
  subscribeMarketingConsent,
} from "@/lib/consent/state";

/**
 * Bindet Google Tag Manager und Meta-Pixel ein – **erst** nach Einwilligung
 * (Briefing 0033, Masterplan 5.4).
 *
 * Zwei Bedingungen, beide müssen erfüllt sein:
 *  1. Einwilligung „Statistik und Marketing" ist erteilt
 *     (`lib/consent/state.ts`, gesetzt von `ConsentBanner`).
 *  2. Die jeweilige ID ist gesetzt (`NEXT_PUBLIC_GTM_ID` bzw.
 *     `NEXT_PUBLIC_META_PIXEL_ID`).
 *
 * **Ohne ID lädt nichts – unabhängig von der Einwilligung.** Beide Werte sind
 * derzeit nicht gesetzt; nach diesem Schritt geht deshalb weiterhin kein Byte an
 * Google oder Meta. Genau so beschreibt es die Datenschutzerklärung („derzeit ist
 * kein Dienst dieser Kategorie im Einsatz"). Wer eine ID einträgt, muss den Dienst
 * dort zuerst benennen (docs/05).
 *
 * **Kein `<noscript>`-Fallback.** Der übliche GTM-Schnipsel enthält ein
 * `<iframe>` und der Meta-Pixel ein `<img>`, die ohne JavaScript feuern – also
 * ohne jede Einwilligung, weil der Dialog JavaScript braucht. Beide fehlen hier
 * bewusst: Ohne JavaScript wird nichts geladen, das ist der sichere Zustand.
 *
 * **Widerruf.** Wird die Einwilligung zurückgenommen, verschwinden die Scripts aus
 * dem Baum und es wird nichts mehr nachgeladen; zusätzlich setzt `ConsentBanner`
 * den Consent Mode auf `denied` zurück und die Bibliothek räumt die gesetzten
 * Cookies weg (`autoClear` in `lib/consent/config.ts`). Ein bereits geladener
 * Container bleibt bis zum nächsten Seitenaufruf im Speicher – er darf dann aber
 * nichts mehr speichern oder senden.
 *
 * Vercel Web Analytics läuft **nicht** hier, sondern in `app/layout.tsx`: cookielos,
 * ohne Einwilligung erlaubt (Datenschutzerklärung §7).
 */

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function Analytics() {
  const erlaubt = useSyncExternalStore(
    subscribeMarketingConsent,
    getMarketingConsent,
    getMarketingConsentServer,
  );

  if (!erlaubt) return null;

  return (
    <>
      {GTM_ID ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});` +
            `var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';` +
            `j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
            `})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}

      {META_PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?` +
            `n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;` +
            `n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;` +
            `t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}` +
            `(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
            `fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
