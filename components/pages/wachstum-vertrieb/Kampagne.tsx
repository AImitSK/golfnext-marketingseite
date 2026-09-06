"use client";

import { useEffect, useRef, useState } from "react";
import { useMountedReveal } from "@/components/motion/useMountedReveal";
import { TextLink } from "@/components/ui/TextLink";
import { internalHref } from "@/lib/links";
import type { KampagneLink, KampagneStep } from "@/content/wachstum-vertrieb";
import { KampagneDevice } from "./KampagneDevice";
import styles from "./Kampagne.module.css";

/**
 * 4 · Eine Kampagne, eine Woche (Scroll-Geschichte) – portiert aus 3.4b .story/.stage/
 * .panel/.stps/.stp. Links ein klebender Geräterahmen, rechts fünf Schritte; der aktive
 * Schritt steuert das Bild im Rahmen (IntersectionObserver, Muster aus dem Mock).
 *
 * ENHANCEMENT-Umkehr für „ohne JS lesbar": Der Default (Server-HTML, ohne JS und bei
 * reduzierter Bewegung) ist die GESTAPELTE Fassung – jeder Schritt zeigt seinen
 * Geräterahmen inline (`.mob`), der klebende Rahmen ist ausgeblendet, alle Schritte
 * sind aktiv. Erst nach Mount und nur ohne reduzierte Bewegung schaltet die Komponente
 * (Klasse `enhanced`, zusammen mit `@media(min-width:901px)`) auf die klebende
 * Desktop-Fassung; der aktive Schritt wird per IntersectionObserver gesetzt. Kein
 * Scroll-Hijacking (nur Sticky), kein CLS (Höhen reserviert).
 */
export function Kampagne({ steps, links }: { steps: KampagneStep[]; links: KampagneLink[] }) {
  const enhanced = useMountedReveal();
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!enhanced || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.i);
          if (!Number.isNaN(i)) setActive(i);
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [enhanced]);

  return (
    <>
      <div className={`${styles.story}${enhanced ? ` ${styles.enhanced}` : ""}`}>
        <div className={styles.stage} aria-hidden="true">
          {steps.map((s, i) => (
            <div key={s.sn} className={`${styles.panel}${active === i ? ` ${styles.on}` : ""}`}>
              <KampagneDevice device={s.device} />
            </div>
          ))}
        </div>

        <div className={styles.stps}>
          {steps.map((s, i) => (
            <div
              key={s.sn}
              data-i={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className={`${styles.stp}${enhanced && active === i ? ` ${styles.on}` : ""}`}
            >
              <div className={styles.sn}>{s.sn}</div>
              <h3 className={styles.sh}>{s.title}</h3>
              <p className={styles.sp}>{s.text}</p>
              <div className={styles.mob} aria-hidden="true">
                <KampagneDevice device={s.device} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className={styles.links}>
        {links.map((l) => (
          <TextLink key={l.label} href={internalHref(l.path)}>
            {l.label}
          </TextLink>
        ))}
      </p>
    </>
  );
}
