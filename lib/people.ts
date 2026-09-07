/**
 * Porträtfotos der beiden Personen hinter GolfNext – eine Wahrheit für alle Stellen,
 * an denen sie erscheinen (Hero und „Menschen dahinter" auf /ueber-golfnext, der
 * persönliche Abschluss im Footer, das Fred-Zitat auf der Startseite, die
 * Seitenspalte auf /kontakt).
 *
 * Zwei Zuschnitte je Person, weil die Flächen unterschiedlich sind:
 *  - `hoch`    3:4-Quelle (1200 × 1600) für die großen Porträtflächen
 *  - `quadrat` 1:1-Quelle (800 × 800) für die runden Avatare
 *
 * Die Dateien liegen als WebP in `public/people/` und sind bereits auf die
 * Anzeigegröße gerechnet (Hochformat 900 × 1200 für Karten bis ~380 px, Quadrat
 * 400 × 400 für die runden Avatare bis 72 px – jeweils rund das Doppelte für
 * hochauflösende Bildschirme). Deshalb werden sie mit `unoptimized` ausgeliefert:
 * Der Bildoptimierer von Next bringt bei 12–56 KB großen WebP-Dateien praktisch
 * nichts mehr ein, kostet aber je Viewport eine eigene Variante. Im CI ließ das
 * den No-JS-Test auf /ueber-golfnext in die Zeitüberschreitung laufen, weil fünf
 * Viewports parallel Varianten anforderten.
 *
 * Alt-Texte: sachlich, ohne Beschreibung des Aussehens (die Bilder illustrieren die
 * Person, sie transportieren keine eigene Information).
 */

export interface PersonFoto {
  hoch: string;
  quadrat: string;
  alt: string;
}

export const FRED: PersonFoto = {
  hoch: "/people/fred-hoffmann-portrait.webp",
  quadrat: "/people/fred-hoffmann-quadrat.webp",
  alt: "Fred Hoffmann",
};

export const STEFAN: PersonFoto = {
  hoch: "/people/stefan-kuehne-portrait.webp",
  quadrat: "/people/stefan-kuehne-quadrat.webp",
  alt: "Stefan Kühne",
};

/** Reihenfolge wie in den Inhalten: erst Fred, dann Stefan. */
export const PERSONEN: PersonFoto[] = [FRED, STEFAN];
