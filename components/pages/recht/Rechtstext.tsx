import { Fragment } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { Wrap } from "@/components/ui/Wrap";
import type { Inline, LegalDocument } from "@/lib/legal";
import styles from "./Rechtstext.module.css";

/**
 * Rendert einen Rechtstext aus `docs/legal/` (Briefing 0028): genau eine `<h1>`,
 * Abschnitte als `<h2>`, Absätze und Aufzählungen – wortgleich, ohne Zutat.
 *
 * Reine Server-Komponente bis auf den einen `Reveal`-Wrapper: ein dezentes,
 * einmaliges Aufblenden des Textblocks. Mehr Bewegung wäre auf einer Rechtsseite
 * fehl am Platz (Briefing: „ruhig und lesbar, keine Animation außer einem dezenten
 * Reveal"). Der Endzustand steht im Server-HTML – ohne JS und bei reduzierter
 * Bewegung ist der Text sofort da.
 *
 * Kein Hero, kein Eyebrow: Für beide Seiten gibt es kein Fred-Briefing mit
 * freigegebenen Zusatztexten, und ein Eyebrow müsste erfunden werden (CLAUDE.md –
 * keine Marketingfloskeln ergänzen). Die `<h1>` ist die erste Zeile der Quelldatei.
 */
function InlineText({ inlines }: { inlines: Inline[] }) {
  return (
    <>
      {inlines.map((inline, i) => {
        switch (inline.kind) {
          case "strong":
            return <strong key={i}>{inline.text}</strong>;
          case "code":
            return <code key={i}>{inline.text}</code>;
          case "break":
            return <br key={i} />;
          default:
            return <Fragment key={i}>{inline.text}</Fragment>;
        }
      })}
    </>
  );
}

export function Rechtstext({ dokument }: { dokument: LegalDocument }) {
  return (
    <Section>
      <Wrap>
        <Reveal className={styles.rechtstext}>
          <h1 className={styles.h1}>{dokument.titel}</h1>
          {dokument.blocks.map((block, i) => {
            switch (block.kind) {
              case "h2":
                return (
                  <h2 key={i} className={styles.h2}>
                    {block.text}
                  </h2>
                );
              case "ul":
                return (
                  <ul key={i}>
                    {block.items.map((item, j) => (
                      <li key={j}>
                        <InlineText inlines={item} />
                      </li>
                    ))}
                  </ul>
                );
              default:
                return (
                  <p key={i}>
                    <InlineText inlines={block.inlines} />
                  </p>
                );
            }
          })}
        </Reveal>
      </Wrap>
    </Section>
  );
}
