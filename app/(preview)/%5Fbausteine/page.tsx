import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
 * Interne Bausteine-Referenz (Briefing 0010, Abschluss Phase 1). Zeigt ALLE
 * Phase-1-Bausteine geordnet und beschriftet – Vergleichsvorlage ist das
 * UI-Kit `docs/design-system/mocks/2.5-ui-kit.html`. Die Abschnitte folgen der
 * 2.5-Reihenfolge für die dort enthaltenen Gruppen (Buttons → Badges/Chips →
 * Formulare → Akkordeon → Rückmeldungen); die GolfNext-eigenen Bausteine
 * außerhalb des Kits (Layout-Primitives, Header, Platzhalter, Bewegung, Footer)
 * sind ergänzt und beschriftet.
 *
 * Sichtbarkeit: nur in Entwicklung und Vercel-Preview. In der Produktion
 * (`VERCEL_ENV === "production"`) liefert die Route `notFound()`. Zusätzlich
 * bleibt `noindex`; keine Verlinkung aus der Website, kein Sitemap-Eintrag.
 * Alle Texte sind neutrale Demo-/Katalog-Inhalte – keine Fred-Marketingtexte.
 */
export const metadata: Metadata = {
  title: "Bausteine",
  robots: { index: false, follow: false },
};

// Pro Aufruf serverseitig rendern, damit das Preview-Gating `VERCEL_ENV` zur
// Laufzeit liest (Vercel setzt die Variable je Umgebung). Ohne dies würde die
// Route statisch vorgerendert und das Ergebnis des Build-Zeitpunkts fixiert.
export const dynamic = "force-dynamic";

export default function BausteinePage() {
  // Preview-Gating: in der Produktion ist die interne Referenz nicht erreichbar.
  // In dev (VERCEL_ENV undefined) und in der Vercel-Preview (VERCEL_ENV="preview")
  // bleibt sie sichtbar; die noindex-Metadata deckt zusätzlich ab.
  if (process.env.VERCEL_ENV === "production") {
    notFound();
  }

  return (
    <>
      {/* Header (Baustein 0004) – hier zur Vorschau eingesetzt, NICHT im Root-Layout
          (app-weite Einbindung folgt in Phase 2). Dropdowns und Mobil-Menü sind hier
          prüfbar; der beschriftete Abschnitt „Header" unten erklärt den Baustein. */}
      <Header />
      <main>
        {/* Kapitel-Kopf: genau eine <h1> der Seite. */}
        <Section>
          <Wrap>
            <Eyebrow>Design-System · interne Referenz</Eyebrow>
            <h1>Bausteine</h1>
            <Lead>
              Diese Seite versammelt alle Bausteine der Phase 1 – geordnet und beschriftet als
              Prüffläche gegen das UI-Kit (Kapitel 2.5). Sie ist nicht Teil der Website und nur in
              Entwicklung und Vorschau erreichbar.
            </Lead>
          </Wrap>
        </Section>

        {/* Header – beschriebener Seitenrahmen-Baustein (oben gerendert). */}
        <Section variant="sand">
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>Seitenrahmen</Eyebrow>
              <h2>Header</h2>
              <Lead>
                Der Sticky-Header am oberen Seitenrand ist der erste Baustein jeder Seite:
                Wortmarke, Hauptnavigation mit zwei Modul-Dropdowns, aktive Seite mit grüner
                Unterlinie und der Conversion-Button rechts. Unter 1024 Pixeln klappt die
                Navigation ins Vollbild-Menü. Ohne JavaScript bleibt die Navigation lesbar.
              </Lead>
            </div>
          </Wrap>
        </Section>

        {/* Layout-Primitives (Schritt 1.1): Section/Wrap/Eyebrow/Lead/Statement/Hint
            auf den drei Flächen Sand, Mist und Paper. Nicht Teil des 2.5-Kits, aber
            Fundament aller Sektionen – daher vor den Kit-Gruppen. */}
        <Section variant="mist">
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>Fundament</Eyebrow>
              <h2>Layout-Primitives</h2>
              <Lead>
                Section und Wrap setzen die Fläche und die maximale Breite; Eyebrow, Headline und
                Lead stehen in fester Reihenfolge. Statement setzt eine Kernaussage typografisch ab,
                der Hinweis erklärt eine Feinheit in einem Satz.
              </Lead>
              <Statement>
                Ein Statement setzt eine Kernaussage typografisch ab – mit grüner Linie links.
              </Statement>
              <Hint>
                Ein Hinweis erklärt eine Feinheit in einem Satz – das Info-Icon ist fix 15 × 15
                Pixel groß und skaliert nicht mit dem Text.
              </Hint>
            </div>
          </Wrap>
        </Section>

        <Section variant="sand">
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>Fläche · Sand</Eyebrow>
              <h3>Dieselbe Sektion auf warmer Sandfläche</h3>
              <Lead>
                Die warme Sandfläche setzt Abschnitte voneinander ab, ohne die Optik der Bausteine
                zu ändern.
              </Lead>
              <Statement>Sand und Mist wechseln sich ab, die Bausteine bleiben gleich.</Statement>
              <Hint>Auch hier läuft der Hinweistext auf höchstens 72 Zeichen Breite.</Hint>
            </div>
          </Wrap>
        </Section>

        <Section>
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>Fläche · Paper</Eyebrow>
              <h3>Die Standardfläche ist Paper</h3>
              <Lead>Ohne Variante rendert die Sektion auf dem hellen Seitenhintergrund.</Lead>
              <Statement>Paper ist die ruhige Grundfläche der Seite.</Statement>
              <Hint>Ein Hinweis auf hellem Grund verwendet die blaue Icon-Farbe.</Hint>
            </div>
          </Wrap>
        </Section>

        {/* 2.5 · Abschnitt 1 – Buttons & Links (Schritt 1.2). Alle Varianten in
            neutralen Demo-Texten. Der grüne Button ist die einzige grüne Fläche;
            die Zusatzzeile steht als eigene Zeile, nie als Text auf Grün. */}
        <Section variant="sand">
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>2.5 · Abschnitt 1</Eyebrow>
              <h2>Buttons &amp; Links</h2>
              <Lead>
                Button und Text-Link in ihren Varianten. Der grüne Button ist die einzige grüne
                Fläche – die Zusatzzeile steht darunter, nie als Text auf Grün. Auf Navy dürfen
                grüner und heller Button nebeneinander stehen.
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
          </Wrap>
        </Section>

        {/* 2.5 · Abschnitt 2 – Badges & Chips (Schritt 1.2). Reifegrad-Badges in den
            drei Status-Stufen plus Add-on/Inklusive, und die Filter-Chips. */}
        <Section variant="mist">
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>2.5 · Abschnitt 2</Eyebrow>
              <h2>Badges &amp; Chips</h2>
              <Lead>
                Der Reifegrad steht in drei verbindlichen Status-Stufen – überall in derselben
                Farbe. Filter-Chips ordnen Übersichten; ein aktiver Chip lässt sich entfernen.
              </Lead>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Status</span>
              <Badge status="im-einsatz">Im Einsatz</Badge>
              <Badge status="pilot">Pilot</Badge>
              <Badge status="in-entwicklung">In Entwicklung</Badge>
              <Badge status="addon">Add-on</Badge>
              <Badge status="inklusive">Im Paket enthalten</Badge>
            </div>

            <div className={styles.navyBlock}>
              <Badge status="onnavy">Auf Navy</Badge>
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
          </Wrap>
        </Section>

        {/* 2.5 · Abschnitt 3 – Formulare (Schritt 1.8). Alle Feld-Bausteine in ihren
            Zuständen (Default/Fokus/Fehler/Erfolg/Deaktiviert), Auswahl und Meldungen.
            Meldungstexte kommen aus den Katalogen (lib/forms/messages.ts). */}
        <Section>
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>2.5 · Abschnitt 3</Eyebrow>
              <h2>Formularfelder</h2>
              <Lead>
                Die Feld-Bausteine in ihren fünf Zuständen – Default, Fokus, Fehler, Erfolg,
                Deaktiviert – als native Elemente, ohne JavaScript bedienbar. Fehler sind nie nur
                an der Farbe erkennbar; jede Meldung stammt aus dem Katalog.
              </Lead>
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

            {/* Feldmeldungen einzeln: e Fehler, s bestätigt, h Hinweis */}
            <div className={styles.stack}>
              <h3>Feldmeldungen</h3>
              <FieldMessage variant="e">{formMessages.field.required}</FieldMessage>
              <FieldMessage variant="s">{formMessages.field.emailOk}</FieldMessage>
              <FieldMessage variant="h">{formMessages.field.optional}</FieldMessage>
            </div>
          </Wrap>
        </Section>

        {/* 2.5 · Abschnitt 6 – Akkordeon (Schritt 1.6). Native <details>/<summary>:
            ohne JS auf-/zuklappbar, erstes Item offen, Plus→Minus per CSS über [open].
            Demo-Texte neutral (keine Pakete-FAQ-Texte von Fred). */}
        <Section variant="sand">
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>2.5 · Abschnitt 6</Eyebrow>
              <h2>FAQ-Akkordeon</h2>
              <Lead>
                Das Akkordeon steht auf nativen <code>&lt;details&gt;</code>-Elementen: ohne
                JavaScript auf- und zuklappbar, das erste Item ist offen, der Marker wechselt von
                Plus zu Minus. Mehrere Einträge dürfen gleichzeitig offen sein.
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

        {/* 2.5 · Abschnitt 7 – Rückmeldungen (Schritt 1.8). Alert/Toast/Empty/Skeleton
            und der Button-Ladezustand. Alerts: info/ok = role=status, err = role=alert.
            Alle Meldungstexte aus den Katalogen (lib/ui/messages.ts, lib/forms/messages.ts). */}
        <Section variant="mist">
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>2.5 · Abschnitt 7</Eyebrow>
              <h2>Rückmeldungen</h2>
              <Lead>
                Inline-Alerts, der eine Toast, Leerzustand, Ladezustand und der Button-Ladezustand.
                Fehler sind nie nur an der Farbe erkennbar – immer über Icon und Text. Sämtliche
                Meldungstexte stammen aus den Katalogen.
              </Lead>
            </div>

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
          </Wrap>
        </Section>

        {/* Platzhalter (Schritt 1.5): Shot (hell/dark, mehrere Ratios) und Portrait
            (large + small). GolfNext-Baustein außerhalb des 2.5-Kits. Kein echtes
            Bild – nur beschriftete Platzhalter, keine erfundenen Bildinhalte. */}
        <Section>
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

        {/* Bewegung (Schritt 1.7): je ein Beispiel für reveal, rise (gestaffelt) und
            draw (Linie). GolfNext-Baustein außerhalb des 2.5-Kits. Endzustand im
            Server-HTML, einmalig (viewport.once), Reduced-Motion → sofort Endzustand.
            Inhalte bleiben ohne JS sichtbar. */}
        <Section variant="sand">
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>Bewegung</Eyebrow>
              <h2>Bewegung</h2>
              <Lead>
                Drei zurückhaltende Varianten aus <code>lib/motion/variants.ts</code>. Jede läuft
                einmal beim Sichtbarwerden, bewegt nur Deckkraft und Position und bleibt danach
                stehen. Ohne JavaScript und bei reduzierter Bewegung steht der Inhalt sofort im
                Endzustand.
              </Lead>
            </div>

            <div className={styles.motionGrid}>
              <Reveal className={styles.motionCard}>
                <h3>Reveal</h3>
                <p>
                  Blendet einmalig auf und schiebt sich 28 Pixel von unten in seine Position – die
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

        {/* Footer – beschriebener Seitenrahmen-Baustein (unten gerendert). */}
        <Section variant="mist">
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow>Seitenrahmen</Eyebrow>
              <h2>Footer</h2>
              <Lead>
                Die dunkle Footer-Systemkarte am Seitenende schließt jede Seite ab: Abschluss-CTA,
                die Landkarte der zwölf Module mit Status-Punkten, die Kontaktzeile und die
                Rechtsleiste. Der Abschluss-CTA ist pro Seite über Props gesetzt; die Demo unten
                nutzt die Daten aus <code>content/ueber-golfnext.ts</code>.
              </Lead>
            </div>
          </Wrap>
        </Section>

        {/* Dunkle Demo-Fläche für die onDark-Varianten (Navy) */}
        <section className={styles.dark}>
          <Wrap>
            <div className={styles.stack}>
              <Eyebrow onDark>Fläche · Navy · onDark</Eyebrow>
              <h2>Bausteine auf Navy</h2>
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
