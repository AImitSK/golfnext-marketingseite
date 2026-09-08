import type { BlockContent } from "@/sanity.types";

/** Ein Eintrag des Inhaltsverzeichnisses: Sprungmarke und Überschrift. */
export interface TocEintrag {
  id: string;
  text: string;
}

/**
 * Ab wie vielen `h2` das Inhaltsverzeichnis überhaupt erscheint. Bei ein oder zwei
 * Abschnitten ist der Kasten mehr Rahmen als Inhalt und entfällt (Briefing 0027).
 */
export const TOC_MINDESTZAHL = 3;

/**
 * Sprungmarke eines Blocks. Der `_key` aus Sanity ist innerhalb eines Dokuments
 * eindeutig und stabil – daraus wird die `id`. Kein Slug aus dem Überschriftentext:
 * zwei gleich lautende Überschriften ergäben sonst dieselbe Marke.
 */
export function ueberschriftId(key: string): string {
  return `abschnitt-${key}`;
}

/** Der reine Text eines Blocks (alle Spans aneinander). */
function blockText(children: Array<{ text?: string }> | undefined): string {
  return (children ?? [])
    .map((span) => span.text ?? "")
    .join("")
    .trim();
}

/**
 * Inhaltsverzeichnis aus den `h2`-Blöcken des Fließtexts. `h3` bleibt außen vor –
 * der Kasten in der Seitenspalte hat nur eine Ebene (Mock 3.9b `.toc`).
 *
 * Die Nummerierung „01, 02 …" kommt per CSS-Zähler und steckt bewusst NICHT im Text:
 * im Studio schreibt niemand Nummern in die Überschrift.
 */
export function tocAusBody(body: BlockContent | null | undefined): TocEintrag[] {
  if (!body) return [];

  const eintraege: TocEintrag[] = [];
  for (const block of body) {
    if (block._type !== "block" || block.style !== "h2") continue;
    const text = blockText(block.children);
    if (!text) continue;
    eintraege.push({ id: ueberschriftId(block._key), text });
  }
  return eintraege;
}
