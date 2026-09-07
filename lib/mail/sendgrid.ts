import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

/**
 * Mail-Versand über SendGrid (Masterplan 4.2, docs/06 §SendGrid).
 *
 * Zwei Transporte hinter einer Funktion:
 *  - **SendGrid**, sobald `SENDGRID_API_KEY` gesetzt ist. Tracking ist aus,
 *    Kategorien `['website','kontakt']`, `replyTo` nur mit validierter Adresse.
 *  - **Mock**, solange der Schlüssel fehlt **oder** `MAIL_TRANSPORT=mock` gesetzt ist:
 *    schreibt die Mail als JSON nach `test-results/mail/`. So ist die Seite
 *    vollständig baubar und prüfbar, auch ohne einen einzigen Umgebungswert
 *    (Briefing 0025).
 *
 * `MAIL_TRANSPORT=mock` ist der **Riegel für Tests**: Playwright startet den Server
 * damit (playwright.config.ts), damit aus einem Testlauf niemals eine echte Mail an
 * `info@golfnext.de` geht – auch dann nicht, wenn in `.env.local` ein gültiger
 * SendGrid-Schlüssel steht. Der Wert darf in Production **nie** gesetzt sein.
 *
 * Der Schlüssel wird **nur hier** gelesen und niemals an den Browser gereicht:
 * Diese Datei ist ausschließlich aus Server-Code erreichbar (Server Action).
 * `@sendgrid/mail` wird erst im Versandzweig geladen (dynamischer Import), damit
 * das Paket im Mock-Betrieb gar nicht erst gestartet wird.
 */

export interface MailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Nur eine bereits validierte Adresse – sonst droht Header-Injection (docs/06). */
  replyTo?: string;
}

export type MailResult = { ok: true; transport: "sendgrid" | "mock" } | { ok: false };

/** Absender und Empfänger aus der Umgebung; Fallbacks nur für den Mock-Betrieb. */
export function mailConfig() {
  return {
    apiKey: process.env.SENDGRID_API_KEY?.trim() ?? "",
    fromEmail: process.env.SENDGRID_FROM_EMAIL?.trim() ?? "website@golfnext.de",
    fromName: process.env.SENDGRID_FROM_NAME?.trim() ?? "GolfNext Website",
    to: process.env.CONTACT_TO_EMAIL?.trim() ?? "info@golfnext.de",
  };
}

/** Erzwingt der Testlauf den Mock-Transport? (playwright.config.ts setzt das) */
export function isMockForced(): boolean {
  return process.env.MAIL_TRANSPORT?.trim().toLowerCase() === "mock";
}

/**
 * Ersetzt die fünf HTML-kritischen Zeichen. Aus dem Formular wird **nie** HTML
 * übernommen – jeder Nutzerwert läuft durch diese Funktion, bevor er in den
 * HTML-Teil der Mail kommt (docs/06 §Sicherheit im Versand).
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Entfernt Zeilenumbrüche und kürzt – für Werte, die in den Betreff wandern.
 * Ohne das könnte ein Zeilenumbruch weitere Kopfzeilen einschleusen.
 */
export function subjectSafe(value: string, maxLength = 60): string {
  const flat = value.replace(/[\r\n\t]+/g, " ").trim();
  return flat.length > maxLength ? `${flat.slice(0, maxLength - 1)}…` : flat;
}

/** Ablage des Mock-Transports – dieselbe, die die Playwright-Prüfungen lesen. */
export const MOCK_MAIL_DIR = path.join(process.cwd(), "test-results", "mail");

async function sendMock(payload: MailPayload): Promise<MailResult> {
  await mkdir(MOCK_MAIL_DIR, { recursive: true });
  const file = path.join(MOCK_MAIL_DIR, `${Date.now()}-${randomUUID()}.json`);
  const { fromEmail, fromName } = mailConfig();
  await writeFile(
    file,
    JSON.stringify({ ...payload, from: { email: fromEmail, name: fromName } }, null, 2),
    "utf8",
  );
  return { ok: true, transport: "mock" };
}

/**
 * Verschickt eine Mail. Wirft nicht – der Aufrufer bekommt `{ ok: false }` und
 * zeigt dann `form.server` mit dem konkreten Ausweg (Mail, Telefon).
 *
 * Im Fehlerfall wird bewusst NICHTS aus der Anfrage geloggt (keine Adresse, kein
 * Name, kein Text) – nur die Tatsache, dass der Versand fehlgeschlagen ist.
 */
export async function sendMail(payload: MailPayload): Promise<MailResult> {
  const { apiKey, fromEmail, fromName } = mailConfig();

  if (!apiKey || isMockForced()) {
    try {
      return await sendMock(payload);
    } catch {
      console.error("contact.mail.mockFailed");
      return { ok: false };
    }
  }

  try {
    const { default: sgMail } = await import("@sendgrid/mail");
    sgMail.setApiKey(apiKey);
    await sgMail.send({
      to: payload.to,
      from: { email: fromEmail, name: fromName },
      ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      trackingSettings: {
        clickTracking: { enable: false, enableText: false },
        openTracking: { enable: false },
      },
      categories: ["website", "kontakt"],
    });
    return { ok: true, transport: "sendgrid" };
  } catch {
    console.error("contact.mail.sendFailed");
    return { ok: false };
  }
}
