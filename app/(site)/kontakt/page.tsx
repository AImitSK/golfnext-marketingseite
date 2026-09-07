import type { Metadata } from "next";
import { PlatzhalterSeite } from "@/components/site/PlatzhalterSeite";
import { ROUTES } from "@/config/site-structure";
import { routeMetadata } from "@/lib/metadata";
import { uiMessages } from "@/lib/ui/messages";

/**
 * `/kontakt` – ausdrücklich ein Zwischenstand (Masterplan 2.8, Briefing 0022).
 *
 * Die Route existiert vor allem, damit der Fallback aus `lib/links.ts`
 * (`FALLBACK = "/kontakt"`, greift solange `NEXT_PUBLIC_BOOKING_URL` leer ist) nicht
 * ins 404 läuft: ohne sie zeigen ALLE „Online-Erstgespräch vereinbaren"-Buttons auf
 * eine Seite, die es nicht gibt.
 *
 * TODO 4.3: Hier entsteht die echte Kontaktseite mit dem Kontaktformular
 * (Masterplan 4.3). Sie ist beschlossen (Stefan, 07.09.2026) und braucht KEIN
 * Fred-Briefing und keinen Mock – `docs/10-launch-umfang.md` §40 legt sie als
 * „schlichte Seite mit dem UI-Kit-Formular" fest. Dann Status in
 * `config/site-structure.ts` auf `live` und `noindex` entfernen; Navigation und
 * Teaser ziehen automatisch nach. Bis dahin wird hier KEIN Formular gebaut, auch
 * kein Markup davon.
 *
 * Statt eines Rücklinks steht hier der Kontakt-Hinweis: Telefon und E-Mail stehen
 * ohnehin im Footer jeder Seite (`KONTAKT` in `config/site-structure.ts`).
 */
export const metadata: Metadata = routeMetadata("/kontakt");

const ROUTE = ROUTES.find((r) => r.path === "/kontakt")!;

export default function KontaktPage() {
  return <PlatzhalterSeite titel={ROUTE.label} hinweis={uiMessages.platzhalter.kontaktHinweis} />;
}
