import { Fragment } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lead } from "@/components/ui/Lead";
import { Section } from "@/components/ui/Section";
import { Wrap } from "@/components/ui/Wrap";
import type { CmpCell, VergleichData } from "@/content/pakete";
import styles from "./Vergleich.module.css";

/** Farbklasse des „Enthalten"-Punkts je Paketspalte (0…3), 1:1 aus Mock .dot/.b/.c/.d. */
const DOT_CLASS = [styles.dot, styles.dotB, styles.dotC, styles.dotD] as const;
/** Farbige Oberkante der Kopfzellen, 1:1 aus Mock .h0/.h1/.h2/.h3 (Leistung + Nur Website = h0). */
const HEAD_CLASS = [styles.h0, styles.h0, styles.h1, styles.h2, styles.h3] as const;

function Cell({ cell, col }: { cell: CmpCell; col: number }) {
  switch (cell.kind) {
    case "yes":
      return (
        <>
          <span className={DOT_CLASS[col]} aria-hidden="true" />
          <span className={styles.srOnly}>Enthalten</span>
        </>
      );
    case "no":
      return (
        <>
          <span className={styles.no} aria-hidden="true" />
          <span className={styles.srOnly}>Nicht enthalten</span>
        </>
      );
    case "text":
      return <span className={styles.txt}>{cell.text}</span>;
    case "money":
      return (
        <span className={styles.moneyCell}>
          {cell.sock ? <span className={styles.moneySock}>{cell.sock}</span> : null}
          <span className={styles.moneyMod}>{cell.mod}</span>
        </span>
      );
  }
}

/**
 * Abschnitt 4 „Vergleich" (portiert aus 3.7-pakete.html, Z.647–697). Semantische
 * `<table>` mit Spalten- und Zeilenköpfen; horizontaler Scroll liegt innerhalb des
 * Containers (kein Seiten-Overflow). Enthalten/Nicht enthalten trägt zusätzlich
 * sr-only-Text. Reine Server-Komponente.
 */
export function Vergleich({
  id,
  eyebrow,
  headline,
  lead,
  data,
}: {
  id: string;
  eyebrow: string;
  headline: string;
  lead: string;
  data: VergleichData;
}) {
  const { columns, groups, note } = data;

  return (
    <Section id={id}>
      <Wrap>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{headline}</h2>
        <Lead>{lead}</Lead>

        <div className={styles.cmp}>
          {/* Scrollbarer Bereich per Tastatur erreichbar (tabindex) und benannt (role/label):
              auf schmalen Viewports scrollt die Tabelle horizontal, ohne Maus bedienbar. */}
          <div
            className={styles.cmpscroll}
            role="region"
            aria-label={headline}
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption className={styles.srOnly}>{headline}</caption>
              <colgroup>
                <col className={styles.leadCol} />
                <col className={styles.pkgCol} />
                <col className={styles.pkgCol} />
                <col className={styles.pkgCol} />
                <col className={styles.pkgCol} />
              </colgroup>
              <thead>
                <tr className={styles.chead}>
                  {columns.map((col, i) => (
                    <th
                      key={col}
                      scope="col"
                      className={
                        i === 0
                          ? `${HEAD_CLASS[i]} ${styles.leadHead}`
                          : HEAD_CLASS[i]
                      }
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <Fragment key={group.title}>
                    <tr>
                      {/* Gruppen-Zwischenüberschrift über die volle Breite: bewusst OHNE
                          scope – sie labelt weder eine Spalte noch eine Zeilengruppe,
                          sondern gliedert nur (kein irreführendes colgroup/row-Scope). */}
                      <th colSpan={5} className={styles.cgroup}>
                        {group.title}
                      </th>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label} className={row.money ? styles.money : undefined}>
                        <th scope="row" className={styles.rowhead}>
                          {row.label}
                        </th>
                        {row.cells.map((cell, j) => (
                          <td key={j} className={styles.c}>
                            <Cell cell={cell} col={j} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.cnote}>{note}</div>
        </div>
      </Wrap>
    </Section>
  );
}
