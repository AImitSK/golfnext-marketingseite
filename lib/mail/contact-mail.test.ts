import { describe, expect, it } from "vitest";
import type { ContactInput } from "@/lib/forms/schema";
import type { ScoreResult } from "@/lib/forms/spam";
import { buildContactMail } from "./contact-mail";
import { escapeHtml, subjectSafe } from "./sendgrid";

/**
 * Die Anfrage-Mail. Drei Dinge müssen stimmen, sonst wird aus einem Formular ein
 * Einfallstor: Nutzerwerte sind im HTML escaped, der Betreff trägt keine
 * Zeilenumbrüche, und in der Mail steht keine IP-Adresse.
 */

/** Wagenrücklauf und Zeilenumbruch – aus Zeichencodes, damit die Quelle lesbar bleibt. */
const CRLF = String.fromCharCode(13, 10);

const anfrage: ContactInput = {
  vorname: "Anna",
  nachname: "Berger",
  rolle: "Clubmanager",
  club: "Golfclub Musterhausen",
  thema: "Frage zu den Paketen und Preisen",
  email: "anna.berger@gc-musterhausen.de",
  telefon: "0171 1234567",
  nachricht: "Wie würden Sie bei uns vorgehen?",
  einwilligung: "on",
};

const sauber: ScoreResult = { score: 0, reasons: [], review: false };
const verdaechtig: ScoreResult = { score: 5, reasons: ["urls", "disposable"], review: true };

describe("buildContactMail", () => {
  it("baut den Betreff aus Name und Anlage", () => {
    const mail = buildContactMail({ data: anfrage, to: "info@golfnext.de", score: sauber });
    expect(mail.subject).toBe("[Website] Anfrage von Anna Berger – Golfclub Musterhausen");
  });

  it("lässt die Anlage weg, wenn sie nicht angegeben wurde", () => {
    const mail = buildContactMail({
      data: { ...anfrage, club: undefined },
      to: "info@golfnext.de",
      score: sauber,
    });
    expect(mail.subject).toBe("[Website] Anfrage von Anna Berger");
  });

  it("stellt bei Verdacht das Prüfen-Kennzeichen voran und nennt die Gründe", () => {
    const mail = buildContactMail({ data: anfrage, to: "info@golfnext.de", score: verdaechtig });
    expect(mail.subject.startsWith("[Prüfen] ")).toBe(true);
    expect(mail.text).toContain("urls, disposable");
  });

  it("escaped Nutzereingaben im HTML-Teil", () => {
    const mail = buildContactMail({
      data: { ...anfrage, nachricht: '<img src=x onerror="alert(1)">', vorname: "A<b>nna" },
      to: "info@golfnext.de",
      score: sauber,
    });
    expect(mail.html).not.toContain("<img");
    // Der Text `onerror=` darf dastehen – entscheidend ist, dass ihm das
    // Anführungszeichen fehlt und er deshalb kein Attribut mehr bilden kann.
    expect(mail.html).not.toContain("onerror=" + String.fromCharCode(34));
    expect(mail.html).toContain("&lt;img");
    expect(mail.html).toContain("A&lt;b&gt;nna");
  });

  it("setzt replyTo auf die validierte Adresse und nennt keine IP", () => {
    const mail = buildContactMail({ data: anfrage, to: "info@golfnext.de", score: sauber });
    expect(mail.replyTo).toBe(anfrage.email);
    expect(mail.text).not.toMatch(/\b\d{1,3}(\.\d{1,3}){3}\b/);
    expect(mail.html).not.toMatch(/\b\d{1,3}(\.\d{1,3}){3}\b/);
  });
});

describe("subjectSafe", () => {
  it("entfernt Zeilenumbrüche (kein Einschleusen weiterer Kopfzeilen)", () => {
    const mitUmbruch = ["Anna", "Bcc: opfer@example.com"].join(CRLF);
    expect(subjectSafe(mitUmbruch)).toBe("Anna Bcc: opfer@example.com");
  });

  it("kürzt auf 60 Zeichen", () => {
    expect(subjectSafe("x".repeat(200)).length).toBe(60);
  });
});

describe("escapeHtml", () => {
  it("ersetzt die fünf kritischen Zeichen", () => {
    expect(escapeHtml(`<a href="x" data='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; data=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
    );
  });
});
