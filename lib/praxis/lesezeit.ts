import type { BlockContent } from "@/sanity.types";

/**
 * Wörter je Minute für die Lesezeit-Schätzung. 200 ist der übliche Richtwert für
 * deutschsprachigen Fließtext am Bildschirm.
 */
const WOERTER_JE_MINUTE = 200;

/**
 * Lesezeit eines Artikels in Minuten.
 *
 * **Rechenregel:** Alle Wörter des Fließtexts (Portable Text) werden gezählt und
 * durch 200 geteilt; das Ergebnis wird aufgerundet, Minimum 1. Ein Artikel mit
 * 1.050 Wörtern ergibt also 6 Minuten.
 *
 * Das ist eine **abgeleitete** Größe, keine erfundene Zahl (CLAUDE.md): Im Schema
 * gibt es kein Lesezeit-Feld, und es wird auch keins ergänzt (Briefing 0027).
 * Gezählt wird nur echter Text – Überschriften, Absätze, Listen, Zitate und die
 * Texte in Hinweiskästen. Bildunterschriften und Button-Beschriftungen zählen nicht
 * mit: sie werden nicht gelesen wie Fließtext.
 */
export function lesezeitMinuten(body: BlockContent | null | undefined): number {
  const woerter = zaehleWoerter(body);
  return Math.max(1, Math.ceil(woerter / WOERTER_JE_MINUTE));
}

/** Wörter im Fließtext – sichtbar für die Rechenregel und für den Test. */
export function zaehleWoerter(body: BlockContent | null | undefined): number {
  if (!body) return 0;

  let text = "";
  for (const block of body) {
    if (block._type === "block") {
      for (const span of block.children ?? []) {
        text += ` ${span.text ?? ""}`;
      }
    } else if (block._type === "callout") {
      // Der Hinweiskasten trägt einfachen Portable Text – ebenfalls Lesestoff.
      for (const inner of block.text ?? []) {
        for (const span of inner.children ?? []) {
          text += ` ${span.text ?? ""}`;
        }
      }
    }
    // `inlineImage` und `cta` tragen keinen Fließtext.
  }

  return text.split(/\s+/).filter(Boolean).length;
}
