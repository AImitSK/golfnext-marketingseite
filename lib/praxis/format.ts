/**
 * Kleine Darstellungshelfer der Praxis-Seiten. Keine Inhalte – nur Form.
 */

/**
 * Datum wie im Mock: „28. August 2026". `dateTime` für das `<time>`-Element ist der
 * ISO-Tag. Ein unlesbares Datum liefert `null`, damit nie „Invalid Date" auf der
 * Seite steht.
 */
export function formatDatum(iso: string | null | undefined): { text: string; iso: string } | null {
  if (!iso) return null;
  const datum = new Date(iso);
  if (Number.isNaN(datum.getTime())) return null;

  return {
    text: datum.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }),
    // Nur der Tag – die Uhrzeit der Veröffentlichung ist für Leser ohne Belang.
    iso: datum.toISOString().slice(0, 10),
  };
}

/**
 * Initialen für den kleinen Autoren-Kreis (Mock `.meta .au i`): erster Buchstabe des
 * ersten und des letzten Namensteils, höchstens zwei Zeichen. „Fred Hoffmann" → „FH".
 */
export function initialen(name: string): string {
  const teile = name.trim().split(/\s+/).filter(Boolean);
  if (teile.length === 0) return "";
  const erster = teile[0]!.charAt(0);
  const letzter = teile.length > 1 ? teile[teile.length - 1]!.charAt(0) : "";
  return (erster + letzter).toUpperCase();
}
