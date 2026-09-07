"use client";

import { uiMessages } from "@/lib/ui/messages";

/**
 * Letzte Instanz (Masterplan 2.9, Briefing 0022): greift nur, wenn das Root-Layout
 * selbst scheitert. Dann sind weder `app/layout.tsx` noch `app/globals.css` noch die
 * Fonts geladen – diese Datei rendert deshalb ihr eigenes `<html>`/`<body>` und
 * importiert bewusst NICHTS aus der Shell (kein Header, kein Footer, kein
 * CSS-Modul). Die wenigen Werte stehen inline: es sind dieselben Token-Werte wie in
 * `app/globals.css` (`--gn-paper`, `--gn-navy`, `--gn-ink`), keine neuen Farben.
 *
 * Texte wortgleich aus `uiMessages.error` – wie auf `app/(site)/error.tsx`. Das
 * Fehlerobjekt wird weder angezeigt noch geloggt.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  const { title, body, action } = uiMessages.error;

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "#fffcf5",
          color: "#16262c",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          fontSize: 17,
          lineHeight: 1.65,
        }}
      >
        <main style={{ maxWidth: "62ch", padding: "72px 20px" }}>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, color: "#01415b" }}>{title}</h1>
          <p style={{ marginTop: 18, color: "#5c6f76" }}>{body}</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 32,
              padding: "13px 24px",
              border: "1px solid #01415b",
              borderRadius: 4,
              background: "transparent",
              color: "#01415b",
              font: "inherit",
              fontWeight: 700,
              fontSize: 15.5,
              cursor: "pointer",
            }}
          >
            {action}
          </button>
        </main>
      </body>
    </html>
  );
}
