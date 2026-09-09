/**
 * Der kleinste gemeinsame Nenner eines Portable-Text-Blocks: Typ und Kinder. Mehr
 * braucht der Klartext nicht, und so passt sowohl `blockContent` (Artikel) als auch
 * `simpleBlockContent` (FAQ-Antworten) hinein, ohne die erzeugten Typen aus
 * `sanity.types.ts` zu wiederholen.
 */
interface Textblock {
  _type: string;
  children?: readonly { _type: string; text?: string }[];
}

/**
 * Portable Text als Klartext – für `acceptedAnswer.text` im `FAQPage`-Markup
 * (Masterplan 6.4). schema.org erwartet dort Text, kein Blockformat.
 *
 * Genommen wird nur, was auch sichtbar ist: die `span`-Kinder der Textblöcke, Absatz
 * für Absatz. Bilder, Kästen und CTA-Blöcke haben keinen Fließtext und fallen weg;
 * Links behalten ihren Linktext, nicht ihre Adresse. Es wird nichts ergänzt und
 * nichts gekürzt.
 */
export function klartext(blocks: readonly Textblock[] | null | undefined): string {
  if (!blocks) return "";

  return blocks
    .filter((block) => block._type === "block")
    .map((block) =>
      (block.children ?? [])
        .filter((kind) => kind._type === "span" && typeof kind.text === "string")
        .map((kind) => kind.text)
        .join(""),
    )
    .map((absatz) => absatz.trim())
    .filter(Boolean)
    .join("\n\n");
}
