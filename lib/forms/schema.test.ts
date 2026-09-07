import { describe, expect, it } from "vitest";
import { KONTAKT_ROLLEN, KONTAKT_THEMEN } from "@/content/kontakt";
import { contactSchema, toFieldErrors, validateField } from "./schema";
import { formMessages } from "./messages";

/**
 * Das Schema ist die verbindliche Prüfung – der Browser kann sie umgehen, der Server
 * nicht. Geprüft wird deshalb Feld für Feld, was durchgeht und was nicht, und dass
 * jede Meldung ein Schlüssel aus `lib/forms/messages.ts` ist (kein freier Text).
 */

/** Eine gültige Anfrage, aus der die Einzelfälle abgeleitet werden. */
const gueltig = {
  vorname: "Anna",
  nachname: "Berger",
  rolle: "Clubmanager",
  club: "Golfclub Musterhausen",
  thema: "Frage zu den Paketen und Preisen",
  email: "Anna.Berger@Golfclub-Musterhausen.de",
  telefon: "0171 1234567",
  nachricht: "Wie würden Sie bei uns vorgehen?",
  einwilligung: "on",
};

describe("contactSchema", () => {
  it("nimmt eine vollständige Anfrage an und schreibt die E-Mail klein", () => {
    const result = contactSchema.safeParse(gueltig);
    expect(result.success).toBe(true);
    expect(result.data?.email).toBe("anna.berger@golfclub-musterhausen.de");
  });

  it("nimmt eine Anfrage nur mit Pflichtfeldern an", () => {
    const result = contactSchema.safeParse({
      vorname: "Anna",
      nachname: "Berger",
      club: "",
      email: "anna@example.de",
      telefon: "",
      nachricht: "Kurze Frage.",
      einwilligung: "on",
    });
    expect(result.success).toBe(true);
    expect(result.data?.club).toBeUndefined();
    expect(result.data?.telefon).toBeUndefined();
  });

  it.each([
    ["vorname", { vorname: "A" }, "vorname"],
    ["nachname", { nachname: "" }, "nachname"],
    ["email", { email: "anna@" }, "email"],
    ["telefon", { telefon: "kein Telefon" }, "phone"],
    ["nachricht", { nachricht: "   " }, "message"],
    ["nachricht zu lang", { nachricht: "x".repeat(3001) }, "messageLong"],
    ["club zu lang", { club: "x".repeat(121) }, "tooLong"],
  ])("weist %s zurück", (_name, patch, schluessel) => {
    const result = contactSchema.safeParse({ ...gueltig, ...patch });
    expect(result.success).toBe(false);
    const errors = toFieldErrors(result.error!);
    expect(Object.values(errors)).toContain(schluessel);
  });

  it("verlangt die Einwilligung", () => {
    const ohne = contactSchema.safeParse({ ...gueltig, einwilligung: undefined });
    expect(ohne.success).toBe(false);
    expect(toFieldErrors(ohne.error!).einwilligung).toBe("consent");
  });

  it("nimmt nur die Auswahlwerte aus dem Mock an", () => {
    for (const rolle of KONTAKT_ROLLEN) {
      expect(contactSchema.safeParse({ ...gueltig, rolle }).success).toBe(true);
    }
    for (const thema of KONTAKT_THEMEN) {
      expect(contactSchema.safeParse({ ...gueltig, thema }).success).toBe(true);
    }
    expect(contactSchema.safeParse({ ...gueltig, rolle: "Hausmeister" }).success).toBe(false);
  });

  it("gibt ausschließlich Schlüssel aus dem Meldungskatalog zurück", () => {
    const result = contactSchema.safeParse({
      vorname: "",
      nachname: "",
      email: "keine",
      telefon: "!!!",
      nachricht: "",
      club: "",
    });
    const errors = toFieldErrors(result.error!);
    for (const key of Object.values(errors)) {
      expect(formMessages.field).toHaveProperty(key!);
    }
  });

  it("zeigt je Feld höchstens eine Meldung", () => {
    const result = contactSchema.safeParse({ ...gueltig, email: "" });
    const errors = toFieldErrors(result.error!);
    expect(Object.keys(errors)).toEqual(["email"]);
  });
});

/** Die Blur-Validierung im Browser nutzt dasselbe Schema – sie darf nicht abweichen. */
describe("validateField", () => {
  it("beanstandet nichts, was der Server annimmt", () => {
    expect(validateField("vorname", "Anna")).toBeUndefined();
    expect(validateField("email", "anna@example.de")).toBeUndefined();
    expect(validateField("telefon", "+49 171 1234567")).toBeUndefined();
    expect(validateField("telefon", "")).toBeUndefined();
    expect(validateField("club", "")).toBeUndefined();
  });

  it("meldet dieselben Fehler wie der Server", () => {
    expect(validateField("vorname", "A")).toBe("vorname");
    expect(validateField("email", "anna@")).toBe("email");
    expect(validateField("telefon", "abc")).toBe("phone");
    expect(validateField("einwilligung", "")).toBe("consent");
  });

  it("meldet ein leeres Pflichtfeld als Pflichtfeld", () => {
    expect(validateField("nachricht", "")).toBe("required");
  });
});
