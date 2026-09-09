"use client";

import { useEffect } from "react";
import { trackCtaErstgespraechClick } from "@/lib/tracking/events";

/**
 * Zählt Klicks auf den Erstgespräch-CTA (`cta_erstgespraech_click`, docs/09 –
 * Micro-Conversion). Rendert nichts.
 *
 * **Ein Zuhörer statt vieler Handler.** Der CTA steht im Header, in der mobilen
 * Navigation, in jedem Hero, in Paketkarten, auf `/kontakt` und im Footer – überall
 * als Server-gerenderter Link. Ein `onClick` an jeder Stelle würde all diese
 * Bausteine zu Client-Komponenten machen. Stattdessen trägt jeder CTA-Link die
 * Markierung `data-gn-cta="erstgespraech"` (gesetzt in `lib/links.ts`,
 * `ctaLinkProps`), und dieser eine Zuhörer am Dokument fängt den Klick ab – in der
 * Capture-Phase, damit er vor dem Seitenwechsel läuft.
 *
 * `position` beschreibt, wo der Klick war (docs/09: header · hero · footer · pakete
 * · …). Sie wird aus der Umgebung des Links gelesen: Kopfzeile, Fußzeile oder die
 * Id der umgebenden Sektion. Kein Personenbezug, kein Freitext.
 *
 * Ohne Einwilligung ist der Aufruf wirkungslos – das entscheidet
 * `lib/tracking/events.ts`, nicht dieser Baustein.
 */

function position(element: Element): string {
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return element.closest("section[id]")?.id || "seite";
}

export function CtaTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('[data-gn-cta="erstgespraech"]');
      if (!link) return;
      trackCtaErstgespraechClick(position(link), window.location.pathname);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
