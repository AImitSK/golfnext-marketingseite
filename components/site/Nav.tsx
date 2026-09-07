"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TextLink } from "@/components/ui/TextLink";
import { type NavItem } from "@/lib/navigation";
import styles from "./Nav.module.css";

/**
 * Desktop-Hauptnavigation (portiert aus 2.4 .hnav / .mega). Client-Teil, weil sie
 * die aktive Seite (usePathname → grüne Unterlinie + aria-current) und die
 * Dropdown-Interaktion braucht.
 *
 * Progressive Enhancement:
 *  - OHNE JS bedienbar: Die Panels erscheinen über CSS :hover / :focus-within
 *    (Server-HTML rendert sie geschlossen; Fokus auf Link oder Caret öffnet sie,
 *    Tab läuft durch die Einträge, Fokus verlassen schließt).
 *  - MIT JS angereichert: Caret-<button aria-expanded/aria-controls> zum Klick-
 *    Öffnen, Escape schließt (Fokus zurück auf den Caret), Klick außerhalb schließt,
 *    Route-Wechsel schließt, Pfeil hoch/runter bewegt den Fokus durch die Einträge.
 */
export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Route-Wechsel schließt ein offenes Dropdown (Zustand während des Renderns
  // anpassen statt im Effekt – React-Muster, vermeidet Kaskaden-Renders).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenPath(null);
  }

  // Klick außerhalb der Navigation schließt das offene Dropdown.
  useEffect(() => {
    if (!openPath) return;
    function onPointerDown(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenPath(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openPath]);

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Hauptnavigation">
      <ul className={styles.list}>
        {items.map((item) => {
          const active = isActive(pathname, item.path);
          const current = pathname === item.path;
          if (item.children.length === 0) {
            return (
              <li key={item.path} className={styles.item}>
                <a
                  href={item.href}
                  className={[styles.link, active ? styles.active : undefined]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={current ? "page" : undefined}
                >
                  <Label label={item.label} />
                </a>
              </li>
            );
          }
          return (
            <DropdownItem
              key={item.path}
              item={item}
              active={active}
              current={current}
              open={openPath === item.path}
              onToggle={() => setOpenPath((prev) => (prev === item.path ? null : item.path))}
              onClose={() => setOpenPath(null)}
            />
          );
        })}
      </ul>
    </nav>
  );
}

function DropdownItem({
  item,
  active,
  current,
  open,
  onToggle,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  current: boolean;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function panelLinks(): HTMLAnchorElement[] {
    return panelRef.current ? Array.from(panelRef.current.querySelectorAll("a")) : [];
  }

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      onClose();
      buttonRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const links = panelLinks();
      if (links.length === 0) return;
      const activeEl = document.activeElement;
      const currentIndex = links.findIndex((link) => link === activeEl);
      event.preventDefault();
      if (currentIndex === -1) {
        links[event.key === "ArrowDown" ? 0 : links.length - 1]?.focus();
        return;
      }
      const nextIndex =
        event.key === "ArrowDown"
          ? Math.min(currentIndex + 1, links.length - 1)
          : Math.max(currentIndex - 1, 0);
      links[nextIndex]?.focus();
    }
  }

  return (
    // data-open steuert die Sichtbarkeit bei Klick-Öffnung; :hover/:focus-within
    // im CSS decken den Fall ohne JS ab.
    <li
      className={styles.item}
      data-open={open ? "true" : undefined}
      data-has-child=""
      onKeyDown={onKeyDown}
    >
      <a
        href={item.href}
        className={[styles.link, active ? styles.active : undefined].filter(Boolean).join(" ")}
        aria-current={current ? "page" : undefined}
      >
        <Label label={item.label} />
      </a>
      <button
        ref={buttonRef}
        type="button"
        className={styles.caret}
        aria-label={`Untermenü ${item.label} ${open ? "schließen" : "öffnen"}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.caretIcon} aria-hidden="true" />
      </button>

      <div id={panelId} ref={panelRef} className={styles.mega}>
        <div className={styles.megaIn}>
          <div className={styles.mlead}>
            {/* Lead-Spalte verlinkt auf die Sektionsseite (Platzhalter, bis live). */}
            <TextLink href={item.href}>{item.label} ansehen</TextLink>
          </div>
          <ul className={styles.mgrid}>
            {item.children.map((child) => (
              <li key={child.path} className={styles.mitem}>
                {/* Reduziert: nur Label + Link. Icons und Beschreibungen kommen
                    später (bewusst nicht erfunden). */}
                <a href={child.href} className={styles.mlink}>
                  {child.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

/** Rendert „Wachstum & Vertrieb" mit gedämpftem „&" (2.4 .amp). */
function Label({ label }: { label: string }): ReactNode {
  const marker = " & ";
  if (label.includes(marker)) {
    const [first, second] = label.split(marker);
    return (
      <>
        {first}
        <span className={styles.amp}>&amp;</span>
        {second}
      </>
    );
  }
  return label;
}

/** Aktiv, wenn die Route der Hauptpunkt selbst oder eine Unterseite davon ist. */
function isActive(pathname: string, itemPath: string): boolean {
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}
