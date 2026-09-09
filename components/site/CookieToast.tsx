"use client";

import { useEffect, useState } from "react";
import { Toast } from "@/components/feedback/Toast";
import { subscribeConsentSaved } from "@/lib/consent/state";
import { uiMessages } from "@/lib/ui/messages";
import styles from "./CookieToast.module.css";

/**
 * Der einzige Toast der Website (docs/08 §3): die gespeicherte Cookie-Einstellung.
 * Erscheint unten rechts, sobald der Besucher im Dialog eine Auswahl trifft oder
 * ändert – nicht bei einem Seitenaufruf mit bereits gespeicherter Auswahl.
 *
 * Der Text kommt aus `lib/ui/messages.ts`, `role="status"` bringt der Baustein
 * `components/feedback/Toast.tsx` mit: Screenreader hören die Bestätigung, ohne
 * unterbrochen zu werden. Es gibt bewusst keinen zweiten Toast auf dieser Website.
 */

/** Anzeigedauer (docs/08 §3: ~3 s, dann von selbst weg). */
const DAUER_MS = 3000;

export function CookieToast() {
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const abmelden = subscribeConsentSaved(() => {
      setSichtbar(true);
      clearTimeout(timer);
      timer = setTimeout(() => setSichtbar(false), DAUER_MS);
    });
    return () => {
      clearTimeout(timer);
      abmelden();
    };
  }, []);

  if (!sichtbar) return null;

  return (
    <div className={styles.host}>
      <Toast>{uiMessages.toast.cookiesSaved}</Toast>
    </div>
  );
}
