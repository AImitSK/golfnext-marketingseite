import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Hint } from "@/components/ui/Hint";
import { Lead } from "@/components/ui/Lead";
import { Section } from "@/components/ui/Section";
import { Statement } from "@/components/ui/Statement";
import { Wrap } from "@/components/ui/Wrap";
import styles from "./page.module.css";

/**
 * Interne Vorschau der Layout-Primitives (Briefing 0002). Nicht in Navigation
 * oder Sitemap, nur per Direkt-URL /_bausteine erreichbar, `noindex`.
 * Wächst in den Folgeschritten 1.2–1.8 mit und ist der spätere „Bausteine"-Nachweis.
 * Alle Texte sind Demo-Inhalte – keine Fred-Texte, keine echten Website-Inhalte.
 */
export const metadata: Metadata = {
  title: "Bausteine",
  robots: { index: false, follow: false },
};

export default function BausteinePage() {
  return (
    <main>
      <Section>
        <Wrap>
          <Eyebrow>Design-System · interne Vorschau</Eyebrow>
          <h1>Bausteine</h1>
          <Lead>
            Diese Seite zeigt die Layout-Primitives des GolfNext-Design-Systems in ihren Varianten –
            als visuelle Prüffläche für die Umsetzung. Sie ist nicht Teil der Website.
          </Lead>
        </Wrap>
      </Section>

      <Section variant="sand">
        <Wrap>
          <div className={styles.stack}>
            <Eyebrow>Fläche · Sand</Eyebrow>
            <h2>Eine Sektion mit warmer Sandfläche</h2>
            <Lead>
              Eyebrow, Headline und Lead in ihrer festen Reihenfolge – der Lead bleibt auf maximal
              62 Zeichen Breite, damit die Zeilen gut lesbar bleiben.
            </Lead>
            <Statement>
              Ein Statement setzt eine Kernaussage typografisch ab – mit grüner Linie links.
            </Statement>
            <Hint>
              Ein Hinweis erklärt eine Feinheit in einem Satz – das Info-Icon ist fix 15 × 15 Pixel
              groß und skaliert nicht mit dem Text.
            </Hint>
          </div>
        </Wrap>
      </Section>

      <Section variant="mist">
        <Wrap>
          <div className={styles.stack}>
            <Eyebrow>Fläche · Mist</Eyebrow>
            <h2>Dieselbe Sektion auf kühler Mist-Fläche</h2>
            <Lead>
              Die kühle Fläche kommt für Abschnitte zum Einsatz, die sich vom warmen Sand absetzen
              sollen – die Bausteine selbst bleiben unverändert.
            </Lead>
            <Statement>
              Sand und Mist wechseln sich ab, ohne die Optik der Bausteine zu ändern.
            </Statement>
            <Hint>Auch hier gilt: der Hinweistext läuft auf höchstens 72 Zeichen Breite.</Hint>
          </div>
        </Wrap>
      </Section>

      <Section>
        <Wrap>
          <div className={styles.stack}>
            <Eyebrow>Fläche · Paper</Eyebrow>
            <h2>Die Standardfläche ist Paper</h2>
            <Lead>Ohne Variante rendert die Sektion auf dem hellen Seitenhintergrund.</Lead>
            <Statement>Paper ist die ruhige Grundfläche der Seite.</Statement>
            <Hint>Ein Hinweis auf hellem Grund verwendet die blaue Icon-Farbe.</Hint>
          </div>
        </Wrap>
      </Section>

      {/* Dunkle Demo-Fläche für die onDark-Varianten (Navy) */}
      <section className={styles.dark}>
        <Wrap>
          <div className={styles.stack}>
            <Eyebrow onDark>Fläche · Navy · onDark</Eyebrow>
            <h2>Die Bausteine auf dunklem Grund</h2>
            <Lead onDark>
              Auf Navy schaltet die Eyebrow auf Signalgrün (Text auf Navy ist erlaubt), Lead und
              Hinweis hellen auf, das Statement wird weiß.
            </Lead>
            <Statement onDark>
              Ein Statement auf Navy – Text in Weiß, die Linie bleibt grün.
            </Statement>
            <Hint onDark>
              Auf dunklem Grund wird der Hinweistext heller und das Info-Icon nimmt die Sky-Farbe
              an.
            </Hint>
          </div>
        </Wrap>
      </section>
    </main>
  );
}
