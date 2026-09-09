import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Prüfungen zum Sanity-Webhook (Briefing 0032).
 *
 * `revalidateTag`/`revalidatePath` sind gemockt: Geprüft wird, **womit** sie
 * aufgerufen werden, nicht der Next-Cache selbst.
 */
const revalidateTag = vi.fn();
const revalidatePath = vi.fn();

vi.mock("next/cache", () => ({
  revalidateTag: (tag: string, profile: unknown) => revalidateTag(tag, profile),
  revalidatePath: (path: string) => revalidatePath(path),
}));

const SECRET = "test-secret-nur-fuer-diese-datei";

/** Erwartetes zweites Argument von `revalidateTag`: ab sofort abgelaufen. */
const SOFORT_ABGELAUFEN = { expire: 0 };

/** Baut eine Anfrage mit gültiger Signatur über genau diesen Rohtext. */
async function signierteAnfrage(payload: unknown, secret = SECRET): Promise<Request> {
  const rohtext = JSON.stringify(payload);
  const signature = await encodeSignatureHeader(rohtext, Date.now(), secret);

  return new Request("https://www.golfnext.de/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json", [SIGNATURE_HEADER_NAME]: signature },
    body: rohtext,
  });
}

describe("POST /api/revalidate", () => {
  const secretVorher = process.env.SANITY_REVALIDATE_SECRET;

  /** Alles, was die Route geloggt hat – für die Prüfung „nichts Vertrauliches im Log". */
  let geloggt: unknown[][] = [];

  beforeEach(() => {
    revalidateTag.mockClear();
    revalidatePath.mockClear();
    geloggt = [];
    // Log-Ausgaben gehören zur Route, nicht in die Testausgabe – mitgeschrieben
    // werden sie trotzdem, damit ihr Inhalt prüfbar bleibt.
    const mitschreiben = (...args: unknown[]) => void geloggt.push(args);
    vi.spyOn(console, "info").mockImplementation(mitschreiben);
    vi.spyOn(console, "warn").mockImplementation(mitschreiben);
    vi.spyOn(console, "error").mockImplementation(mitschreiben);
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (secretVorher === undefined) delete process.env.SANITY_REVALIDATE_SECRET;
    else process.env.SANITY_REVALIDATE_SECRET = secretVorher;
  });

  it("verwirft bei gültiger Signatur die Marke zum gemeldeten Typ", async () => {
    const { POST } = await import("./revalidate");
    const response = await POST(await signierteAnfrage({ _type: "faq", slug: null }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ revalidated: true, tag: "faq" });
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith("faq", SOFORT_ABGELAUFEN);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("bildet `siteSettings` auf die Marke `settings` ab", async () => {
    const { POST } = await import("./revalidate");
    const response = await POST(await signierteAnfrage({ _type: "siteSettings" }));

    await expect(response.json()).resolves.toEqual({ revalidated: true, tag: "settings" });
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith("settings", SOFORT_ABGELAUFEN);
  });

  it("verwirft bei `post` zusätzlich den Pfad der Artikelseite", async () => {
    const { POST } = await import("./revalidate");
    const response = await POST(
      await signierteAnfrage({ _type: "post", slug: "greenfee-richtig-bewerben" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      revalidated: true,
      tag: "post",
      path: "/praxis/greenfee-richtig-bewerben",
    });
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith("post", SOFORT_ABGELAUFEN);
    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/praxis/greenfee-richtig-bewerben");
  });

  it("verwirft bei `post` ohne brauchbaren Slug nur die Marke", async () => {
    const { POST } = await import("./revalidate");
    const response = await POST(await signierteAnfrage({ _type: "post", slug: "../../etc" }));

    await expect(response.json()).resolves.toEqual({ revalidated: true, tag: "post" });
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith("post", SOFORT_ABGELAUFEN);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("antwortet ohne Signatur mit 401 und revalidiert nichts", async () => {
    const { POST } = await import("./revalidate");
    const response = await POST(
      new Request("https://www.golfnext.de/api/revalidate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _type: "post", slug: "ohne-signatur" }),
      }),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("antwortet mit falscher Signatur mit 401 und revalidiert nichts", async () => {
    const { POST } = await import("./revalidate");
    // Gültig geformt, aber mit einem anderen Secret erzeugt.
    const response = await POST(
      await signierteAnfrage({ _type: "post", slug: "falsches-secret" }, "ein-anderes-secret"),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("antwortet mit unbrauchbarer Signaturkopfzeile mit 401 und revalidiert nichts", async () => {
    const { POST } = await import("./revalidate");
    const response = await POST(
      new Request("https://www.golfnext.de/api/revalidate", {
        method: "POST",
        headers: { [SIGNATURE_HEADER_NAME]: "kein-signaturformat" },
        body: JSON.stringify({ _type: "post", slug: "kaputte-kopfzeile" }),
      }),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("antwortet ohne konfiguriertes Secret mit 401 und revalidiert nichts", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;

    const { POST } = await import("./revalidate");
    const response = await POST(await signierteAnfrage({ _type: "post", slug: "ohne-secret" }));

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("bleibt bei einem unbekannten Typ wirkungslos, meldet aber keinen Fehler", async () => {
    const { POST } = await import("./revalidate");
    const response = await POST(await signierteAnfrage({ _type: "irgendwasNeues", slug: "x" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ revalidated: false });
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("bleibt bei unlesbarer Nutzlast wirkungslos, damit Sanity nicht wiederholt", async () => {
    const rohtext = "{kein json";
    const signature = await encodeSignatureHeader(rohtext, Date.now(), SECRET);

    const { POST } = await import("./revalidate");
    const response = await POST(
      new Request("https://www.golfnext.de/api/revalidate", {
        method: "POST",
        headers: { [SIGNATURE_HEADER_NAME]: signature },
        body: rohtext,
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ revalidated: false });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("schreibt weder Secret noch Signatur noch Nutzlast ins Log", async () => {
    const { POST } = await import("./revalidate");

    // Alle vier Log-Wege durchlaufen: angenommen, übersprungen, abgelehnt (falsche
    // Signatur) und abgelehnt (kein Secret in der Umgebung).
    const email = "fred.hoffmann@example.org";
    const nutzlast = { _type: "author", slug: "fred-hoffmann", email };
    const signatur = await encodeSignatureHeader(JSON.stringify(nutzlast), Date.now(), SECRET);

    await POST(await signierteAnfrage(nutzlast));
    await POST(await signierteAnfrage({ _type: "irgendwasNeues", email }));
    await POST(await signierteAnfrage(nutzlast, "ein-anderes-secret"));
    delete process.env.SANITY_REVALIDATE_SECRET;
    await POST(await signierteAnfrage(nutzlast));

    expect(geloggt.length).toBe(4);

    const alles = geloggt.flat().join(" | ");
    expect(alles).not.toContain(SECRET);
    expect(alles).not.toContain(signatur);
    expect(alles).not.toContain(email);
    expect(alles).not.toContain(JSON.stringify(nutzlast));
    // Auch kein Slug: Er gehört zum Inhalt, nicht zum Betriebsstatus.
    expect(alles).not.toContain("fred-hoffmann");

    // Geloggt wird ausschließlich der Status – mit Typ und Marke, sonst nichts.
    expect(geloggt.map(([status]) => status)).toEqual([
      "revalidate.ok",
      "revalidate.skipped",
      "revalidate.rejected",
      "revalidate.rejected",
    ]);
  });

  it("gibt weder Secret noch Signatur in einer Antwort preis", async () => {
    const { POST } = await import("./revalidate");
    const response = await POST(
      await signierteAnfrage({ _type: "post", slug: "falsches-secret" }, "ein-anderes-secret"),
    );

    const text = await response.text();
    expect(text).toBe("");
    expect(text).not.toContain(SECRET);
  });
});
