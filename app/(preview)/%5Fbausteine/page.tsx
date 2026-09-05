import type { Metadata } from "next";
import { Alert } from "@/components/feedback/Alert";
import { Empty } from "@/components/feedback/Empty";
import { Skeleton } from "@/components/feedback/Skeleton";
import { Checkbox } from "@/components/forms/Checkbox";
import { Field } from "@/components/forms/Field";
import { FieldMessage } from "@/components/forms/FieldMessage";
import { Input } from "@/components/forms/Input";
import { Radio } from "@/components/forms/Radio";
import { Select } from "@/components/forms/Select";
import { Textarea } from "@/components/forms/Textarea";
import { Draw } from "@/components/motion/Draw";
import { Reveal } from "@/components/motion/Reveal";
import { Rise, RiseItem } from "@/components/motion/Rise";
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
import { formMessages } from "@/lib/forms/messages";
import { uiMessages } from "@/lib/ui/messages";
import styles from "./page.module.css";
import { ToastDemo } from "./ToastDemo";

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

      {/* Bewegung – Schritt 1.7. Je ein Beispiel für reveal, rise (gestaffelt)
          und draw (Linie). Wrapper aus components/motion/: Endzustand im
          Server-HTML, initial erst nach Mount, einmalig (viewport.once),
          Reduced-Motion → sofort Endzustand. Inhalte bleiben ohne JS sichtbar. */}
      <Section variant="sand">
        <Wrap>
          <div className={styles.stack}>
            <Eyebrow>Bewegung</Eyebrow>
            <h2>Reveal, Rise &amp; Draw</h2>
            <Lead>
              Drei zurückhaltende Varianten aus <code>lib/motion/variants.ts</code>. Jede läuft einmal
              beim Sichtbarwerden, bewegt nur Deckkraft und Position und bleibt danach stehen. Ohne
              JavaScript und bei reduzierter Bewegung steht der Inhalt sofort im Endzustand.
            </Lead>
          </div>

          <div className={styles.motionGrid}>
            <Reveal className={styles.motionCard}>
              <h3>Reveal</h3>
              <p>
                Blendet einmalig auf und schiebt sich 14 Pixel von unten in seine Position – die
                Grundbewegung für Überschriften, Absätze und einzelne Karten.
              </p>
            </Reveal>

            <div className={styles.motionCard}>
              <h3>Rise</h3>
              <p>Ein Container staffelt seine Kinder dezent nacheinander ein:</p>
              <Rise as="ul" className={styles.riseList}>
                <RiseItem as="li">Erster Punkt</RiseItem>
                <RiseItem as="li">Zweiter Punkt</RiseItem>
                <RiseItem as="li">Dritter Punkt</RiseItem>
              </Rise>
            </div>

            <div className={styles.motionCard}>
              <h3>Draw</h3>
              <p>Eine Linie wird einmalig von links nach rechts gezogen:</p>
              <Draw />
            </div>
          </div>
        </Wrap>
      </Section>

      {/* Zustände & Rückmeldungen – Schritt 1.8 (Briefing 0009). Alert/Toast/Empty/
          Skeleton, Button-Ladezustand und alle Formularfelder in ihren Zuständen.
          Jeder Fehler trägt Icon UND Text; alle Meldungstexte kommen aus den
          Katalogen (lib/ui/messages.ts, lib/forms/messages.ts), nie aus der Komponente. */}
      <Section variant="mist">
        <Wrap>
          <div className={styles.stack}>
            <Eyebrow>Zustände &amp; Rückmeldungen</Eyebrow>
            <h2>Alerts, Toast, Leerzustand, Laden &amp; Formularzustände</h2>
            <Lead>
              Die Feedback- und Formular-Bausteine in allen Zuständen. Fehler sind nie nur an der
              Farbe erkennbar – immer über Icon und Text. Sämtliche Meldungstexte stammen aus den
              Katalogen, die Komponenten enthalten keine eigenen.
            </Lead>
          </div>

          {/* Inline-Alerts: info/ok = role=status, err = role=alert (docs/08 §5) */}
          <div className={styles.stack}>
            <h3>Inline-Alerts</h3>
          </div>
          <div className={styles.alertStack}>
            <Alert variant="info">{uiMessages.moduleInDevelopment}</Alert>
            <Alert variant="ok">
              {`${formMessages.form.success.title} ${formMessages.form.success.text}`}
            </Alert>
            <Alert variant="err">{formMessages.form.network}</Alert>
          </div>

          {/* Toast: einziger Toast der Website (Cookie-Einstellungen). Demo-Trigger
              blendet ihn unten rechts ein und nach ~3 s wieder aus. */}
          <div className={styles.stack}>
            <h3>Toast</h3>
            <Lead>
              Der einzige Toast der Website bestätigt gespeicherte Cookie-Einstellungen. Hier als
              Demo – er erscheint unten rechts und verschwindet nach etwa drei Sekunden.
            </Lead>
          </div>
          <div className={styles.row}>
            <ToastDemo />
          </div>

          {/* Leerzustand + Skeleton nebeneinander */}
          <div className={styles.stack}>
            <h3>Leerzustand &amp; Laden</h3>
          </div>
          <div className={styles.feedbackRow}>
            <Empty
              title={uiMessages.empty.title}
              body={uiMessages.empty.body}
              actionLabel={uiMessages.empty.action}
              actionHref="#"
            />
            <Skeleton />
          </div>

          {/* Button-Zustände: Ladezustand (feste Breite, aria-busy, sr-only) und disabled */}
          <div className={styles.stack}>
            <h3>Button-Zustände</h3>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Ladezustand</span>
            <Button variant="primary" loading>
              Modul ansehen
            </Button>
            <Button variant="cta" loading>
              Erstgespräch anfragen
            </Button>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Deaktiviert</span>
            <Button variant="primary" disabled>
              Deaktiviert
            </Button>
            <Button variant="cta" disabled>
              Deaktiviert
            </Button>
          </div>

          {/* Formularfelder: fünf Zustände (default/focus/err/ok/disabled), native
              Elemente (ohne JS bedienbar), Field verdrahtet id/aria/required. */}
          <div className={styles.stack}>
            <h3>Formularfelder</h3>
          </div>
          <div className={`${styles.row} ${styles.fieldRow}`}>
            <Field id="demo-anlage" label="Golfanlage" required>
              <Input placeholder="Golfclub Musterstadt e. V." />
            </Field>
            <Field id="demo-name" label="Ihr Name" state="focus">
              <Input defaultValue="Dr. Martin Berger" />
            </Field>
          </div>
          <div className={`${styles.row} ${styles.fieldRow}`}>
            <Field
              id="demo-mail"
              label="E-Mail"
              required
              state="err"
              message={formMessages.field.email}
              messageVariant="e"
            >
              <Input type="email" defaultValue="m.berger@golfclub-" />
            </Field>
            <Field
              id="demo-mail-ok"
              label="E-Mail (bestätigt)"
              state="ok"
              message={formMessages.field.emailOk}
              messageVariant="s"
            >
              <Input type="email" defaultValue="m.berger@golfclub-musterstadt.de" />
            </Field>
          </div>
          <div className={`${styles.row} ${styles.fieldRow}`}>
            <Field id="demo-rolle" label="Ihre Rolle im Club">
              <Select defaultValue="vorstand">
                <option value="vorstand">Vorstand / Präsidium</option>
                <option value="geschaeftsfuehrung">Geschäftsführung</option>
                <option value="sekretariat">Sekretariat</option>
              </Select>
            </Field>
            <Field id="demo-disabled" label="Deaktiviertes Feld">
              <Input defaultValue="Nicht bearbeitbar" disabled />
            </Field>
          </div>
          <div className={`${styles.row} ${styles.fieldRow}`}>
            <Field
              id="demo-anliegen"
              label="Was beschäftigt Sie aktuell?"
              wide
              message={formMessages.field.optional}
              messageVariant="h"
            >
              <Textarea placeholder="Zum Beispiel: Wir verlieren jedes Jahr Mitglieder …" />
            </Field>
          </div>

          {/* Auswahl: Radio-Gruppe und Checkbox – native Elemente, CSS-Zustände */}
          <div className={`${styles.row} ${styles.fieldRow}`}>
            <span className={styles.label}>Interesse</span>
            <Radio name="demo-interesse" defaultChecked>
              Neue Mitglieder gewinnen
            </Radio>
            <Radio name="demo-interesse">Clubbüro entlasten</Radio>
            <Radio name="demo-interesse">Beides</Radio>
            <Radio name="demo-interesse" disabled>
              Nicht wählbar
            </Radio>
          </div>
          <div className={`${styles.row} ${styles.fieldRow}`}>
            <span className={styles.label}>Einwilligung</span>
            <Checkbox name="demo-check" defaultChecked>
              Angeklickte Checkbox (Demo-Auswahl)
            </Checkbox>
            <Checkbox name="demo-check-2">Leere Checkbox (Demo-Auswahl)</Checkbox>
            <Checkbox name="demo-check-3" disabled>
              Deaktivierte Checkbox
            </Checkbox>
          </div>

          {/* Feldmeldungen einzeln: e Fehler, s bestätigt, h Hinweis (Icon 14 px) */}
          <div className={styles.stack}>
            <h3>Feldmeldungen</h3>
            <FieldMessage variant="e">{formMessages.field.required}</FieldMessage>
            <FieldMessage variant="s">{formMessages.field.emailOk}</FieldMessage>
            <FieldMessage variant="h">{formMessages.field.optional}</FieldMessage>
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

      {/* Footer (Baustein 0005) – hier zur Vorschau am Seitenende, NICHT im Root-Layout
          (app-weite Einbindung folgt in Phase 2). FooterClose ist prop-getrieben; die
          Demo nutzt die echten FooterClose-Daten aus content/ueber-golfnext.ts. */}
      <Footer footerClose={ueberGolfnext.footerClose} />
    </>
  );
}
