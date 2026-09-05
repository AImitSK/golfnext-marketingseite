"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/feedback/Toast";
import btn from "@/components/ui/Button.module.css";
import { uiMessages } from "@/lib/ui/messages";
import styles from "./page.module.css";

/**
 * Demo-Trigger für den Toast (nur /_bausteine – kein Website-Baustein). Zeigt den
 * `Toast`-Baustein unten rechts und blendet ihn nach ~3 s wieder aus, wie es die
 * echte Cookie-Bestätigung in Phase 5 tun wird (docs/08 §3). Der Text kommt aus
 * `lib/ui/messages.ts`.
 */
export function ToastDemo() {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function show() {
    if (timer.current) clearTimeout(timer.current);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), 3000);
  }

  return (
    <>
      {/* Interaktiver Auslöser: natives <button> mit der Primär-Optik (Muster wie
          CookieSettingsButton) – die Button-Primitive bleibt ohne onClick-API. */}
      <button type="button" className={`${btn.btn} ${btn.primary} ${btn.sm}`} onClick={show}>
        Toast auslösen
      </button>
      {visible ? (
        <div className={styles.toastDock}>
          <Toast>{uiMessages.toast.cookiesSaved}</Toast>
        </div>
      ) : null}
    </>
  );
}
