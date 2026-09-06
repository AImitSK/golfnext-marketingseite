import type { Variants } from "motion/react";

/**
 * Gemeinsame Bewegungs-Varianten (Briefing 0008, Masterplan 1.7).
 *
 * Genau drei Varianten – mehr werden nicht erfunden, neue nur, wenn ein Mock
 * sie wirklich braucht:
 *   - `reveal`  einmaliges Ein-/Aufblenden (auch als Item-Variante von `rise`)
 *   - `rise`    Container, staffelt seine `reveal`-Kinder nacheinander
 *   - `draw`    zeichnet Linien/Pfade (pathLength) bzw. skaliert Linien (scaleX)
 *
 * Werte wertgleich zu den CSS-Tokens `--gn-ease`/`--gn-dur` in `app/globals.css`
 * (Ease `cubic-bezier(.2,.8,.3,1)`, Dauer `.55s`) – konsistent halten.
 *
 * Alle Übergänge bewegen nur `opacity`/`transform` (bzw. `pathLength`): keine
 * Layoutverschiebung. Der Endzustand (`visible`) ist zugleich das, was der Server
 * ohne JS rendert – die Wrapper in `components/motion/` setzen `hidden` erst nach
 * Mount und nur, wenn JS läuft und keine reduzierte Bewegung gewünscht ist.
 */

/** Ease-Kurve aller Varianten – identisch zu `--gn-ease`. */
export const EASE: [number, number, number, number] = [0.2, 0.8, 0.3, 1];

/** Dauer aller Varianten in Sekunden – identisch zu `--gn-dur` (.55s). */
export const DURATION = 0.55;

/** Klar wahrnehmbarer Versatz der Staffelung zwischen `rise`-Kindern (Sekunden). */
export const STAGGER = 0.1;

/**
 * Einmaliges Aufblenden: von spürbar darunter (28 px) und transparent in den
 * Endzustand. Dient auch als Item-Variante innerhalb von `rise`. Der Translate
 * ist bewusst großzügig (Briefing 0015: Reveals sollen wahrnehmbar sein, nicht
 * nur ein leises Fade) – bewegt weiterhin nur `opacity`/`transform` (kein CLS).
 */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE },
  },
};

/**
 * Container für gestaffeltes Nacheinander. Selbst unsichtbar bewegt; steuert nur
 * das zeitversetzte Erscheinen seiner Kinder (die die `reveal`-Variante tragen).
 */
export const rise: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER },
  },
};

/**
 * Zeichnet ein SVG-Element: `pathLength` deckt die Strichlänge auf (Pfade/Linien),
 * `scaleX` skaliert Linien von links (die Wrapper setzen dafür `transform-origin`
 * links). Beide laufen gleich lang mit derselben Ease in eine Richtung, sodass die
 * Bewegung als ein Strich von links nach rechts liest.
 */
export const draw: Variants = {
  hidden: { pathLength: 0, scaleX: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    scaleX: 1,
    opacity: 1,
    transition: { duration: DURATION, ease: EASE },
  },
};
