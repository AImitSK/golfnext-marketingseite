import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Faq } from "@/components/ui/Faq";
import { Hint } from "@/components/ui/Hint";
import { Lead } from "@/components/ui/Lead";
import { Portrait } from "@/components/ui/Portrait";
import { Section } from "@/components/ui/Section";
import { Shot } from "@/components/ui/Shot";
import { Statement } from "@/components/ui/Statement";
import { TextLink } from "@/components/ui/TextLink";
import { Wrap } from "@/components/ui/Wrap";
import { ueberGolfnext } from "@/content/ueber-golfnext";
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

      {/* Platzhalter – Schritt 1.5. Shot (hell/dark, mehrere Ratios) und Portrait
          (large + small). Alle Beschriftungen sind Demo-Inhalte, keine Fred-Texte,
          keine erfundenen Bildinhalte. Kein echtes Bild – nur Platzhalter. */}
      <Section variant="mist">
        <Wrap>
          <div className={styles.stack}>
            <Eyebrow>Bild-Platzhalter</Eyebrow>
            <h2>Platzhalter</h2>
            <Lead>
              Fehlende Screenshots und Porträts werden als beschriftete Platzhalter gebaut – nie
              als Stock- oder KI-Bild. Das Seitenverhältnis reserviert die Höhe vorab, damit beim
              Laden nichts springt.
            </Lead>
          </div>

          <div className={styles.shotGrid}>
            <Shot
              ratio="16/10"
              tagline="Ansicht 16 / 10"
              title="Beispiel-Screenshot"
              text="Ein Platzhalter im Querformat – hier stünde später die echte Oberfläche."
            />
            <Shot
              ratio="4/3"
              tagline="Ansicht 4 / 3"
              title="Beispiel-Screenshot"
              text="Dasselbe Muster in einem kompakteren Seitenverhältnis."
            />
            <Shot
              ratio="16/9"
              tagline="Ansicht 16 / 9"
              title="Beispiel-Screenshot"
              text="Ein breites Format – Tagline oben, Beschreibung unten."
            />
          </div>

          <div className={styles.navyBlock}>
            <div className={styles.shotGrid}>
              <Shot
                dark
                ratio="16/10"
                tagline="Auf Navy"
                title="Platzhalter dunkel"
                text="Auf dunklem Grund kommen Sky-Kontur und heller Text zum Einsatz."
              />
              <Shot
                dark
                ratio="4/3"
                tagline="Auf Navy"
                title="Platzhalter dunkel"
                text="Dieselbe Optik, an die dunkle Fläche angepasst."
              />
            </div>
          </div>

          <div className={styles.stack}>
            <Eyebrow>Porträt · groß und klein</Eyebrow>
            <div className={styles.portraitGrid}>
              <Portrait size="large" tag="Team" name="Vorname Nachname" role="Rolle im Team" />
              <Portrait size="large" name="Vorname Nachname" role="Rolle im Team" />
            </div>
            <div className={styles.avatarRow}>
              <Portrait size="small" />
              <Portrait size="small" />
              <Portrait size="small" />
              <span className={styles.label}>46 px rund</span>
            </div>
          </div>
        </Wrap>
      </Section>

      {/* FAQ-Akkordeon – Schritt 1.6. Basis <details>/<summary>: ohne JS auf-/zuklappbar,
          erstes Item server-seitig offen, Plus→Minus per CSS über [open]. Demo-Texte sind
          neutral (keine Pakete-FAQ-Texte von Fred – die kommen auf /pakete bzw. aus Sanity). */}
      <Section>
        <Wrap>
          <div className={styles.stack}>
            <Eyebrow>Frage &amp; Antwort</Eyebrow>
            <h2>FAQ-Akkordeon</h2>
            <Lead>
              Das Akkordeon steht auf nativen <code>&lt;details&gt;</code>-Elementen: ohne JavaScript
              auf- und zuklappbar, das erste Item ist offen, der Marker wechselt von Plus zu Minus.
              Mehrere Einträge dürfen gleichzeitig offen sein.
            </Lead>
          </div>

          <Faq
            items={[
              {
                question: "Funktioniert das Akkordeon auch ohne JavaScript?",
                answer:
                  "Ja. Die Einträge sind native Details-Elemente – sie lassen sich per Klick oder Tastatur öffnen und schließen, ganz ohne Skript. Alle Antworten stehen im Dokument.",
                defaultOpen: true,
              },
              {
                question: "Kann mehr als ein Eintrag gleichzeitig offen sein?",
                answer:
                  "Ja. Jeder Eintrag klappt unabhängig auf und zu. Es gibt kein erzwungenes Single-Open – Sie können mehrere Antworten nebeneinander lesen.",
              },
              {
                question: "Woran erkenne ich, ob ein Eintrag offen ist?",
                answer:
                  "Am Marker rechts: geschlossen zeigt er ein Plus, offen ein Minus. Der Wechsel läuft rein über CSS und respektiert reduzierte Bewegung.",
              },
              {
                question: "Sind diese Fragen echte Website-Inhalte?",
                answer:
                  "Nein. Es sind neutrale Demo-Texte für die Bausteine-Vorschau. Die echten Fragen und Antworten kommen später auf den jeweiligen Seiten.",
              },
            ]}
          />
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

      {/* Footer (Baustein 0005) – hier zur Vorschau am Seitenende, NICHT im Root-Layout
          (app-weite Einbindung folgt in Phase 2). FooterClose ist prop-getrieben; die
          Demo nutzt die echten FooterClose-Daten aus content/ueber-golfnext.ts. */}
      <Footer footerClose={ueberGolfnext.footerClose} />
    </>
  );
}
