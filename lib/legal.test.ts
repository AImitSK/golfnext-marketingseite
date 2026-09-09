import { describe, expect, it } from "vitest";
import { readLegalDocument, type Inline, type LegalBlock } from "./legal";

/**
 * Der Rechtstext-Leser (Briefing 0028). Geprüft wird das, was rechtlich zählt:
 * Die internen Vermerke bleiben draußen, der Wortlaut bleibt drin – Zeichen für
 * Zeichen, ohne Kürzung.
 */

/** Setzt einen Block wieder zu reinem Text zusammen – für den Wortlaut-Abgleich. */
function text(inlines: Inline[]): string {
  return inlines.map((i) => (i.kind === "break" ? "\n" : i.text)).join("");
}
function blockText(block: LegalBlock): string {
  if (block.kind === "h2") return block.text;
  if (block.kind === "ul") return block.items.map(text).join("\n");
  return text(block.inlines);
}

describe("readLegalDocument", () => {
  const impressum = readLegalDocument("impressum.md");
  const datenschutz = readLegalDocument("datenschutz.md");

  it("nimmt die H1 aus der ersten Zeile", () => {
    expect(impressum.titel).toBe("Impressum");
    expect(datenschutz.titel).toBe("Datenschutzerklärung");
  });

  it("veröffentlicht keine internen Vermerke und keine offenen Stellen", () => {
    for (const dokument of [impressum, datenschutz]) {
      const ganz = dokument.blocks.map(blockText).join("\n");
      expect(ganz).not.toContain("Interner Vermerk");
      expect(ganz).not.toContain("Interne Checkliste");
      expect(ganz).not.toContain("[[");
      // Die Steuernummer steht nur im internen Vermerk – sie darf nicht auf die Seite.
      expect(ganz).not.toContain("DE 26 / 118 / 04502");
    }
  });

  it("übernimmt die Abschnitte des Impressums vollständig", () => {
    const h2 = impressum.blocks.filter((b) => b.kind === "h2").map((b) => b.text);
    expect(h2).toEqual([
      "Angaben gemäß § 5 DDG",
      "Kontakt",
      "Verantwortlich für journalistisch-redaktionelle Inhalte (§ 18 Abs. 2 MStV)",
      "Verbraucherstreitbeilegung",
      "Haftung für Inhalte",
      "Haftung für Links",
      "Urheberrecht",
    ]);
  });

  it("hält die Anschrift als Absatz mit Zeilenumbrüchen zusammen", () => {
    const anschrift = impressum.blocks.find(
      (b) => b.kind === "p" && text(b.inlines).startsWith("Fred Hoffmann"),
    );
    expect(anschrift && blockText(anschrift)).toBe(
      "Fred Hoffmann\nGolfNext\nRichartzstraße 10\n30519 Hannover",
    );
  });

  it("übernimmt alle fünfzehn Abschnitte der Datenschutzerklärung in ihrer Reihenfolge", () => {
    const h2 = datenschutz.blocks.filter((b) => b.kind === "h2").map((b) => b.text);
    expect(h2).toHaveLength(15);
    expect(h2[0]).toBe("1. Verantwortlicher");
    expect(h2[14]).toBe("15. Änderungen");
  });

  it("erkennt Auszeichnungen im Fließtext", () => {
    const alle = datenschutz.blocks.flatMap((b) =>
      b.kind === "p" ? b.inlines : b.kind === "ul" ? b.items.flat() : [],
    );
    expect(alle.some((i) => i.kind === "strong" && i.text === "Vercel Inc.")).toBe(true);
    expect(alle.some((i) => i.kind === "code" && i.text === "cc_cookie")).toBe(true);
  });

  it("gibt die Aufzählung der Betroffenenrechte vollständig wieder", () => {
    const rechte = datenschutz.blocks.filter(
      (b) => b.kind === "ul" && blockText(b).startsWith("Auskunft (Art. 15 DSGVO)"),
    );
    expect(rechte).toHaveLength(1);
    expect((rechte[0] as { items: Inline[][] }).items).toHaveLength(7);
  });

  /**
   * Der eigentliche Wortlaut-Beweis: Aus der Quelldatei werden nur die internen
   * Vermerke, die Trennlinien und die Markdown-Zeichen selbst entfernt. Die
   * verbleibende Zeichenfolge muss – Wort für Wort, Satzzeichen für Satzzeichen –
   * dem entsprechen, was die Seite ausgibt. Verglichen wird ohne Rücksicht darauf,
   * *wo* eine Zeile endet (das entscheidet `absatz` je nach Satz der Datei);
   * fällt dagegen ein Satz, ein Absatz oder ein Aufzählungspunkt weg oder kommt
   * ein Wort hinzu, schlägt die Prüfung fehl.
   */
  it.each([
    ["impressum.md", impressum],
    ["datenschutz.md", datenschutz],
  ])("gibt %s wortgleich wieder", async (datei, dokument) => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const roh = readFileSync(join(process.cwd(), "docs", "legal", datei), "utf8");

    const erwartet = roh
      .split(/\r?\n/)
      .filter((z) => !/^\s*>/.test(z) && !/^-{3,}\s*$/.test(z) && z.trim() !== "")
      .map((z) => z.replace(/^#{1,2}\s+/, "").replace(/^-\s+/, ""))
      .map((z) => z.replace(/\*\*(.+?)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1"))
      .join(" ")
      .replace(/\s+/g, " ");

    const gerendert = [dokument.titel, ...dokument.blocks.map(blockText)]
      .join(" ")
      .replace(/\s+/g, " ");
    expect(gerendert).toBe(erwartet);
  });

  /**
   * Zeilenumbrüche: `impressum.md` ist hart am Rand umbrochen, `datenschutz.md`
   * setzt jeden Absatz in eine Zeile. Beide Sätze müssen richtig gelesen werden –
   * sonst stehen entweder zerhackte Absätze oder zusammengeschobene Blöcke auf der
   * Seite.
   */
  it("verbindet die hart umbrochenen Absätze des Impressums zu einem Fluss", () => {
    const haftung = impressum.blocks.find(
      (b) => b.kind === "p" && text(b.inlines).startsWith("Als Diensteanbieter"),
    );
    expect(haftung).toBeDefined();
    expect(blockText(haftung!)).not.toContain("\n");
    expect(blockText(haftung!)).toContain("fremde Informationen zu überwachen");
  });

  it("hält die gewollten Umbrüche der Datenschutzerklärung", () => {
    const rechtsgrundlage = datenschutz.blocks.find(
      (b) => b.kind === "p" && text(b.inlines).startsWith("Rechtsgrundlage: Art. 6 Abs. 1 lit. f"),
    );
    expect(rechtsgrundlage).toBeDefined();
    // Rechtsgrundlage, Speicherdauer und Auftragsverarbeitung stehen untereinander.
    expect(blockText(rechtsgrundlage!).split("\n")).toHaveLength(3);
  });

  it("meldet eine fehlende Datei, statt eine leere Seite auszuliefern", () => {
    expect(() => readLegalDocument("gibt-es-nicht.md")).toThrow();
  });
});
