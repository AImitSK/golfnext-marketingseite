import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Rechtstexte aus `docs/legal/` (Briefing 0028, Masterplan 5.1 und 5.2).
 *
 * **Warum die Markdown-Datei die Quelle bleibt und nichts nach `content/` wandert:**
 * CLAUDE.md verlangt, dass Impressum und Datenschutzerklärung *wortgleich* aus
 * `docs/legal/` übernommen werden. Jede Kopie wäre eine zweite Wahrheit, die beim
 * nächsten Rechtstext-Update auseinanderläuft – und genau bei diesen beiden Seiten
 * ist ein stiller Versatz ein rechtliches Risiko, kein Schönheitsfehler. Die Dateien
 * werden deshalb **beim Bauen** gelesen (die Routen sind `force-static`), nicht bei
 * jedem Abruf.
 *
 * Der Parser ist bewusst **streng und klein**: Er kennt genau die Bausteine, die in
 * den beiden Dateien vorkommen (H1, H2, Absatz, Aufzählung, `**fett**`, `` `code` ``)
 * und wirft bei allem anderen einen Fehler. Lieber bricht der Build, als dass eine
 * neue Markdown-Auszeichnung still als Rohtext auf einer Rechtsseite landet.
 *
 * Interne Vermerke (Blockquotes mit `>`) und Trennlinien (`---`) werden entfernt,
 * bevor gerendert wird – sie sind Arbeitsnotizen und dürfen nie veröffentlicht
 * werden (docs/legal/README.md). Offene Stellen `[[ … ]]` gibt es seit dem
 * 07.09.2026 nicht mehr; taucht wieder eine auf, bricht der Build ebenfalls ab,
 * statt Klammern auszuliefern.
 */

/** Ein Textstück innerhalb eines Absatzes oder Aufzählungspunkts. */
export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "code"; text: string }
  /** Weicher Zeilenumbruch – hält Anschrift und „Rechtsgrundlage:"-Blöcke zusammen. */
  | { kind: "break" };

/** Die H1 steht separat in `LegalDocument.titel` – sie ist kein Block im Fluss. */
export type LegalBlock =
  | { kind: "h2"; text: string }
  | { kind: "p"; inlines: Inline[] }
  | { kind: "ul"; items: Inline[][] };

export interface LegalDocument {
  /** Die einzige `<h1>` der Seite, direkt aus der ersten Zeile der Datei. */
  titel: string;
  /** Alles nach der H1 – in Reihenfolge, ohne interne Vermerke. */
  blocks: LegalBlock[];
}

const LEGAL_DIR = join(process.cwd(), "docs", "legal");

/**
 * Zerlegt eine Zeile in Text, `**fett**` und `` `code` ``. Alles andere bleibt
 * Zeichen für Zeichen stehen – Paragraphenzeichen, Gedankenstriche und deutsche
 * Anführungszeichen kommen unverändert durch.
 */
function parseInline(line: string, quelle: string, nr: number): Inline[] {
  const inlines: Inline[] = [];
  const muster = /\*\*(.+?)\*\*|`([^`]+)`/g;
  let letzterIndex = 0;

  for (const treffer of line.matchAll(muster)) {
    const index = treffer.index!;
    if (index > letzterIndex) {
      inlines.push({ kind: "text", text: line.slice(letzterIndex, index) });
    }
    if (treffer[1] !== undefined) inlines.push({ kind: "strong", text: treffer[1] });
    else inlines.push({ kind: "code", text: treffer[2]! });
    letzterIndex = index + treffer[0].length;
  }
  if (letzterIndex < line.length) {
    inlines.push({ kind: "text", text: line.slice(letzterIndex) });
  }

  for (const inline of inlines) {
    if (inline.kind === "break") continue;
    if (inline.text.includes("**") || inline.text.includes("`")) {
      throw new Error(
        `${quelle}, Zeile ${nr}: unpaarige Auszeichnung (** oder \`) – der Rechtstext-Parser rendert nur vollständige Paare.`,
      );
    }
  }
  return inlines;
}

/**
 * Bis zu welcher Zeilenlänge eine Datei als „am Rand umbrochen" gilt. `impressum.md`
 * ist mit rund 137 Zeichen je Zeile geschrieben, `datenschutz.md` setzt jeden Absatz
 * in eine einzige, mehrere hundert Zeichen lange Zeile.
 */
const UMBRUCH_MAX = 160;
/** Abstand zur Umbruchbreite, bis zu dem eine Zeile noch als Fortsetzung gilt. */
const UMBRUCH_TOLERANZ = 30;

/**
 * Absatzzeilen zu einem Block verbinden.
 *
 * **Warum das nicht einfach „ein Umbruch je Quellzeile" sein kann:** Die beiden
 * Dateien sind unterschiedlich gesetzt. `impressum.md` ist **hart umbrochen** – die
 * Sätze der Haftungsabschnitte laufen über mehrere Zeilen, mitten im Wortfluss. Ein
 * `<br>` je Quellzeile hätte daraus zerhackte Absätze gemacht. `datenschutz.md`
 * dagegen schreibt jeden Absatz in eine Zeile; jeder Umbruch dort ist **gewollt**
 * (Anschrift, die Blöcke „Rechtsgrundlage: / Speicherdauer: /
 * Auftragsverarbeitung:").
 *
 * Unterschieden wird deshalb an der Umbruchbreite der jeweiligen Datei: Reicht eine
 * Zeile nahe an den Rand heran, ist der Umbruch ein Satzumbruch – die nächste Zeile
 * wird mit einem Leerzeichen angehängt. Endet eine Zeile deutlich davor, ist der
 * Umbruch gewollt und bleibt als `<br>` stehen. Ist die Datei gar nicht umbrochen
 * (`umbruchbreite > UMBRUCH_MAX`), ist jeder Umbruch gewollt.
 *
 * Der Wortlaut ändert sich dabei in keinem Fall – nur, wo eine Zeile endet.
 */
function absatz(
  zeilen: { text: string; nr: number }[],
  quelle: string,
  umbruchbreite: number,
): LegalBlock {
  const hartUmbrochen = umbruchbreite <= UMBRUCH_MAX;
  const inlines: Inline[] = [];

  zeilen.forEach((zeile, i) => {
    if (i > 0) {
      const vorige = zeilen[i - 1]!.text;
      const istFortsetzung = hartUmbrochen && vorige.length >= umbruchbreite - UMBRUCH_TOLERANZ;
      if (istFortsetzung) inlines.push({ kind: "text", text: " " });
      else inlines.push({ kind: "break" });
    }
    inlines.push(...parseInline(zeile.text, quelle, zeile.nr));
  });
  return { kind: "p", inlines };
}

/**
 * Liest eine Datei aus `docs/legal/` und gibt den veröffentlichbaren Teil zurück.
 * `dateiname` ohne Pfad, z. B. `impressum.md`.
 */
export function readLegalDocument(dateiname: string): LegalDocument {
  const quelle = `docs/legal/${dateiname}`;
  const roh = readFileSync(join(LEGAL_DIR, dateiname), "utf8");

  const zeilen = roh
    .split(/\r?\n/)
    .map((text, i) => ({ text, nr: i + 1 }))
    // Interne Vermerke (Blockquote) und Trennlinien fliegen raus – nicht veröffentlichen.
    .filter((zeile) => !/^\s*>/.test(zeile.text) && !/^-{3,}\s*$/.test(zeile.text));

  // Breiteste Zeile der Datei – daran erkennt `absatz`, ob hart umbrochen wurde.
  const umbruchbreite = zeilen.reduce((max, zeile) => Math.max(max, zeile.text.length), 0);

  const blocks: LegalBlock[] = [];
  let titel: string | null = null;
  let absatzZeilen: { text: string; nr: number }[] = [];
  let listenPunkte: Inline[][] | null = null;

  const absatzSchliessen = () => {
    if (absatzZeilen.length === 0) return;
    blocks.push(absatz(absatzZeilen, quelle, umbruchbreite));
    absatzZeilen = [];
  };
  const listeSchliessen = () => {
    if (!listenPunkte) return;
    blocks.push({ kind: "ul", items: listenPunkte });
    listenPunkte = null;
  };

  for (const zeile of zeilen) {
    const text = zeile.text.trimEnd();

    if (text.includes("[[")) {
      throw new Error(
        `${quelle}, Zeile ${zeile.nr}: offene Stelle „[[ … ]]" – Rechtstexte mit offenen Stellen werden nicht veröffentlicht (CLAUDE.md).`,
      );
    }

    if (text.trim() === "") {
      absatzSchliessen();
      listeSchliessen();
      continue;
    }

    if (text.startsWith("# ")) {
      absatzSchliessen();
      listeSchliessen();
      if (titel !== null) {
        throw new Error(
          `${quelle}, Zeile ${zeile.nr}: zweite H1 – je Seite ist genau eine erlaubt.`,
        );
      }
      titel = text.slice(2).trim();
      continue;
    }

    if (text.startsWith("## ")) {
      absatzSchliessen();
      listeSchliessen();
      blocks.push({ kind: "h2", text: text.slice(3).trim() });
      continue;
    }

    if (text.startsWith("- ")) {
      absatzSchliessen();
      if (!listenPunkte) listenPunkte = [];
      listenPunkte.push(parseInline(text.slice(2), quelle, zeile.nr));
      continue;
    }

    if (/^(#{3,}\s|\d+\.\s|\||!\[|\s{4,}\S|```)/.test(text)) {
      throw new Error(
        `${quelle}, Zeile ${zeile.nr}: nicht unterstützte Markdown-Auszeichnung „${text.slice(0, 24)}…". Der Rechtstext-Parser kennt nur H1, H2, Absatz, Aufzählung, **fett** und \`code\`.`,
      );
    }

    listeSchliessen();
    absatzZeilen.push({ text, nr: zeile.nr });
  }

  absatzSchliessen();
  listeSchliessen();

  if (!titel) throw new Error(`${quelle}: keine H1 gefunden – die Seite braucht genau eine.`);

  return { titel, blocks };
}
