import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lead } from "@/components/ui/Lead";
import { TextLink } from "@/components/ui/TextLink";
import { uiMessages } from "@/lib/ui/messages";
import { Footer } from "./Footer";
import styles from "./PlatzhalterSeite.module.css";

/**
 * Die ruhige, leere Seite (Briefing 0022). Zwei Exporte, ein Baustein:
 *
 * - `MeldungsSeite` – die geteilte Schale (Eyebrow, genau eine `<h1>`, ein Satz,
 *   Aktionen, optionaler Hinweis, Footer ohne Verkaufsblock). Sie trägt außer der
 *   Platzhalterseite auch `app/not-found.tsx` und `app/(site)/error.tsx`, damit die
 *   drei leeren Seiten identisch aussehen und nur einmal gepflegt werden.
 * - `PlatzhalterSeite` – der Fall „Route existiert, Inhalt fehlt noch"
 *   (`/praxis` und `/kontakt`; `/team` und `/module/<slug>` sind mit Briefing 0023 entfallen).
 *
 * Es gibt für diese Seiten keinen Mock; die Schale entsteht aus den vorhandenen
 * Tokens und Bausteinen. **Keine freien Texte in der Komponente:** alle sichtbaren
 * Sätze kommen aus `lib/ui/messages.ts`, die `<h1>` aus dem `label` der Route in
 * `config/site-structure.ts`. Der Footer läuft bewusst OHNE `footerClose` – über
 * einer leeren Seite steht kein Verkaufsblock.
 *
 * Bewegung: ein einzelnes, dezentes Aufblenden (`Reveal`). Server-HTML rendert den
 * Endzustand, `prefers-reduced-motion` und „ohne JS" zeigen ihn sofort; bewegt wird
 * nur `opacity`/`transform` (kein CLS).
 */
export function MeldungsSeite({
  eyebrow,
  titel,
  body,
  hinweis,
  children,
}: {
  /** Nur die Platzhalterseite hat einen (`uiMessages.platzhalter.eyebrow`);
      404 und Fehlerseite haben keinen – es wird keiner erfunden. */
  eyebrow?: string;
  /** Wird zur einzigen `<h1>` der Seite. */
  titel: string;
  body: string;
  /** Optionale zweite, gedämpfte Zeile (nur `/kontakt`). */
  hinweis?: string;
  /** Aktionen (Button, TextLink) – stehen unter dem Satz. */
  children: ReactNode;
}) {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.wrap}>
          <Reveal className={styles.stack}>
            {eyebrow ? <Eyebrow className={styles.eyebrow}>{eyebrow}</Eyebrow> : null}
            <h1 className={styles.titel}>{titel}</h1>
            <Lead className={styles.body}>{body}</Lead>
            <div className={styles.actions}>{children}</div>
            {hinweis ? <p className={styles.hinweis}>{hinweis}</p> : null}
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export function PlatzhalterSeite({
  titel,
  zurueck,
  hinweis,
}: {
  /** Das `label` der Route aus `config/site-structure.ts`. */
  titel: string;
  /** Rücklink in den thematisch passenden, bereits gebauten Bereich. */
  zurueck?: { href: string; label: string };
  /** Nur `/kontakt`: `uiMessages.platzhalter.kontaktHinweis`. */
  hinweis?: string;
}) {
  const { eyebrow, body, actionHome } = uiMessages.platzhalter;

  return (
    <MeldungsSeite eyebrow={eyebrow} titel={titel} body={body} hinweis={hinweis}>
      {/* „Zur Startseite" bleibt Ghost: die einzige grüne Fläche der Seite gehört
          site-weit dem Erstgespräch-CTA (Header, Grün-Regel). */}
      <Button variant="ghost" href="/">
        {actionHome}
      </Button>
      {zurueck ? <TextLink href={zurueck.href}>{zurueck.label}</TextLink> : null}
    </MeldungsSeite>
  );
}
