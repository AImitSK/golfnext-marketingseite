/**
 * Blättern in der Artikelliste (Briefing 0027, Aufgabe 3).
 *
 * Statt „Ältere Beiträge laden" (Mock 3.9a) blättert die Liste über einen echten
 * Link `?seite=2`, der serverseitig ausgewertet wird. Grund: ohne JavaScript
 * bedienbar – Nachladen per Klick wäre es nicht. Bewusste Abweichung vom Mock,
 * vermerkt in docs/03-seiten-und-routen.md und docs/entscheidungen.md.
 */

/** Artikel je Seite – das 3-Spalten-Raster des Mocks fasst drei volle Reihen. */
export const ARTIKEL_JE_SEITE = 9;

/** Name des Suchparameters. */
export const SEITEN_PARAMETER = "seite";

export interface Blaetterung<T> {
  /** Die Artikel dieser Seite. */
  artikel: T[];
  /** Die aktuelle Seite, immer ≥ 1. */
  seite: number;
  /** Gesamtzahl der Seiten, mindestens 1 (auch bei null Artikeln). */
  seiten: number;
  /** Nummer der nächsten Seite oder `null`, wenn dies die letzte ist. */
  naechsteSeite: number | null;
}

/**
 * Liest die gewünschte Seite aus dem Suchparameter. Alles Unbrauchbare (fehlend,
 * keine Zahl, 0, negativ, „2abc", Array bei doppeltem Parameter) führt auf Seite 1 –
 * eine Liste soll nie mit einer Fehlermeldung antworten.
 */
export function seiteAusParameter(wert: string | string[] | undefined): number {
  const roh = Array.isArray(wert) ? wert[0] : wert;
  if (!roh || !/^\d+$/.test(roh)) return 1;
  const zahl = Number.parseInt(roh, 10);
  return zahl >= 1 ? zahl : 1;
}

/**
 * Schneidet die Liste auf die gewünschte Seite zu. Eine Seite hinter dem Ende
 * liefert die letzte vorhandene Seite statt einer leeren – so führt ein alter Link
 * (`?seite=9`, nachdem Artikel gelöscht wurden) nicht auf ein Nichts.
 */
export function blaettere<T>(alle: T[], gewuenschteSeite: number): Blaetterung<T> {
  const seiten = Math.max(1, Math.ceil(alle.length / ARTIKEL_JE_SEITE));
  const seite = Math.min(Math.max(1, gewuenschteSeite), seiten);
  const start = (seite - 1) * ARTIKEL_JE_SEITE;

  return {
    artikel: alle.slice(start, start + ARTIKEL_JE_SEITE),
    seite,
    seiten,
    naechsteSeite: seite < seiten ? seite + 1 : null,
  };
}

/** Adresse der nächsten Seite – derselbe Pfad, nur mit Seitenparameter. */
export function seitenHref(pfad: string, seite: number): string {
  return `${pfad}?${SEITEN_PARAMETER}=${seite}`;
}
