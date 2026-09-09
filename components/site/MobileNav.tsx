"use client";

import { useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { usePathname } from "next/navigation";
import { KONTAKT } from "@/config/site-structure";
import type { Cta } from "@/content/types";
import { ctaLinkProps } from "@/lib/links";
import { type NavItem } from "@/lib/navigation";
import styles from "./MobileNav.module.css";

/**
 * Mobil-Navigation unter 1024 px (portiert aus 2.4 .phone-x / .ph-menu / .ph-bar).
 *
 * Progressive Enhancement:
 *  - OHNE JS bedienbar: Das Vollbild-Menü ist ein <details> mit dem Burger als
 *    <summary>; die Untermenüs sind verschachtelte <details>. Alles öffnet und
 *    schließt nativ, ohne JavaScript.
 *  - MIT JS angereichert: aria-expanded/aria-controls am Burger, Escape schließt und
 *    gibt den Fokus zurück, der Fokus wandert beim Öffnen ins Menü, der Body-Scroll
 *    ist gesperrt, solange das Menü offen ist, und ein Route-Wechsel schließt es.
 */
export function MobileNav({ items, cta }: { items: NavItem[]; cta: Cta }) {
  const pathname = usePathname();
  const summaryRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Kontrolliertes <details>: der native Toggle (auch ohne JS) meldet den Zustand,
  // React hält `open` synchron. Ohne JS bleibt der native Auf-/Zu-Mechanismus aktiv.
  function onToggle(event: SyntheticEvent<HTMLDetailsElement>) {
    setOpen(event.currentTarget.open);
  }

  // Route-Wechsel schließt das Menü (Zustand während des Renderns anpassen,
  // nicht im Effekt – vermeidet Kaskaden-Renders).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Body-Scroll sperren, solange das Menü offen ist.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape schließt und gibt den Fokus an den Burger zurück; Fokus beim Öffnen ins Menü.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        summaryRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    const firstLink = overlayRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const phoneHref = `tel:${KONTAKT.telefon.replace(/[^\d]/g, "").replace(/^0/, "+49")}`;

  return (
    <details className={styles.mobile} open={open} onToggle={onToggle}>
      <summary
        ref={summaryRef}
        className={styles.burger}
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <span className={styles.burgerLines} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </summary>

      <div id="mobile-menu" ref={overlayRef} className={styles.overlay}>
        <nav className={styles.menu} aria-label="Hauptnavigation (mobil)">
          {items.map((item) =>
            item.children.length > 0 ? (
              <details key={item.path} className={styles.group}>
                <summary className={styles.groupHead}>
                  <span>{item.label}</span>
                  <ChevronDown />
                </summary>
                <div className={styles.sub}>
                  <a href={item.href} className={styles.subLead}>
                    {item.label} ansehen
                  </a>
                  {/* Nur Label + Link – keine Icons, keine Beschreibungen. */}
                  {item.children.map((child) => (
                    <a key={child.path} href={child.href} className={styles.subLink}>
                      <span>{child.label}</span>
                    </a>
                  ))}
                </div>
              </details>
            ) : (
              <a key={item.path} href={item.href} className={styles.link}>
                <span>{item.label}</span>
                <ChevronRight />
              </a>
            ),
          )}
        </nav>

        {/* Fixierte Aktionsleiste (2.4 .ph-bar): grüner CTA + Anruf als Nebenweg. */}
        <div className={styles.bar}>
          <a {...ctaLinkProps(cta)} className={styles.b1}>
            {cta.label}
            {cta.hint ? <small>{cta.hint}</small> : null}
          </a>
          <a href={phoneHref} className={styles.b2} aria-label={`Anrufen: ${KONTAKT.telefon}`}>
            <PhoneIcon />
          </a>
        </div>
      </div>
    </details>
  );
}

/** Chevron nach unten (Untermenü auf-/zuklappen), fix 14 × 14 px. */
function ChevronDown() {
  return (
    <svg
      className={styles.chevron}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Chevron nach rechts (Hauptpunkt ohne Untermenü), fix 14 × 14 px. */
function ChevronRight() {
  return (
    <svg
      className={styles.chevron}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/** Telefonhörer (Anruf-Nebenweg), fix 17 × 17 px (2.4 .ph-bar .b2). */
function PhoneIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
