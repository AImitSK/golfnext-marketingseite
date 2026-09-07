import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Eigenes Layout für `/studio` – bewusst OHNE Header und Footer der Website
 * (Briefing 0026). Das Studio bringt seine eigene Oberfläche mit; die
 * Seiten-Shell würde stören. Möglich ist das, weil die Website-Seiten in der
 * Route-Gruppe `app/(site)/` liegen und ihren Header dort bekommen – `/studio`
 * hängt nur am Root-Layout (html/body, Fonts).
 *
 * `robots` steht hier zusätzlich zur Seite: `/studio` hat in
 * `config/site-structure.ts` den Status `system` und darf nirgends indexiert
 * oder verlinkt werden.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
