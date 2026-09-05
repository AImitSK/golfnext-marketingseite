import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Hint } from "@/components/ui/Hint";
import { Lead } from "@/components/ui/Lead";
import { Section } from "@/components/ui/Section";
import { Statement } from "@/components/ui/Statement";
import { TextLink } from "@/components/ui/TextLink";
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
    <>
      {/* Header (Baustein 0004) – hier zur Vorschau eingesetzt, NICHT im Root-Layout
          (app-weite Einbindung folgt nach 1.4). Dropdowns und Mobil-Menü sind hier prüfbar. */}
      <Header />
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

      {/* Buttons & Links – Schritt 1.2. Alle Varianten in Demo-Texten (keine Fred-Inhalte). */}
      <Section variant="sand">
        <Wrap>
          <div className={styles.stack}>
            <Eyebrow>Interaktive Primitives</Eyebrow>
            <h2>Buttons &amp; Links</h2>
            <Lead>
              Button, Text-Link, Chip und Status-Badge in ihren Varianten. Der grüne Button ist die
              einzige grüne Fläche – die Zusatzzeile steht als eigene Zeile darunter, nie als Text auf
              Grün.
            </Lead>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Conversion</span>
            <Button variant="cta" secondLine="Zweite Zeile als eigene Zeile">
              Grüner Button
            </Button>
            <Button variant="cta">Ohne Zusatzzeile</Button>
            <Button variant="cta" size="sm">
              Klein
            </Button>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Primär</span>
            <Button variant="primary" arrow>
              Modul ansehen
            </Button>
            <Button variant="primary" size="sm">
              Klein
            </Button>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Sekundär</span>
            <Button variant="ghost">Fallstudie lesen</Button>
            <Button variant="ghost" size="sm">
              Klein
            </Button>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Header-CTA</span>
            <Button variant="header" secondLine="Kompakt, zweizeilig">
              Header-Variante
            </Button>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Text-Link</span>
            <TextLink href="#">Text-Link mit Pfeil</TextLink>
            <TextLink href="#" arrow={false}>
              Text-Link ohne Pfeil
            </TextLink>
          </div>

          <div className={styles.navyBlock}>
            <Button variant="cta" secondLine="30 Minuten per Zoom oder Teams">
              Auf Navy: grüner Button
            </Button>
            <Button variant="light">Heller Button</Button>
            <Button variant="secondaryOnDark" href="#">
              Alternativ: Live-Demo ansehen
            </Button>
            <TextLink href="#" onDark>
              Text-Link auf dunkel
            </TextLink>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Chips</span>
            <Chip pressed>Alle Module</Chip>
            <Chip>Wachstum &amp; Vertrieb</Chip>
            <Chip>Clubprozesse</Chip>
            <Chip pressed removable>
              Im Einsatz
            </Chip>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Badges</span>
            <Badge status="im-einsatz">Im Einsatz</Badge>
            <Badge status="pilot">Pilot</Badge>
            <Badge status="in-entwicklung">In Entwicklung</Badge>
            <Badge status="addon">Add-on</Badge>
            <Badge status="inklusive">Im Paket enthalten</Badge>
          </div>

          <div className={styles.navyBlock}>
            <Badge status="onnavy">Auf Navy</Badge>
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
    </>
  );
}
