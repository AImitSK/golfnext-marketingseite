import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Der lesende Client darf ohne `SANITY_API_TOKEN` auskommen: Das Dataset
 * `production` ist `public`, veröffentlichte Inhalte lassen sich ohne Anmeldung
 * lesen (docs/04-sanity-content-modell.md). Fehlt der Token – in der CI, in
 * einem frischen Checkout, in einem Preview ohne Secret – darf die Website
 * trotzdem bauen und rendern.
 */
describe("lib/sanity/client", () => {
  const tokenVorher = process.env.SANITY_API_TOKEN;

  beforeEach(() => {
    vi.resetModules();
    delete process.env.SANITY_API_TOKEN;
  });

  afterEach(() => {
    if (tokenVorher === undefined) delete process.env.SANITY_API_TOKEN;
    else process.env.SANITY_API_TOKEN = tokenVorher;
  });

  it("lädt ohne SANITY_API_TOKEN und trägt keinen Token in die Konfiguration", async () => {
    const { client } = await import("./client");
    const config = client.config();

    expect(config.token).toBeUndefined();
    expect(config.projectId).toBe("wsj8a3ho");
    expect(config.dataset).toBe("production");
    expect(config.useCdn).toBe(true);
    expect(config.perspective).toBe("published");
  });

  it("gibt jedem Fetch Cache-Marken und ein Revalidierungs-Netz mit", async () => {
    const { client, sanityFetch } = await import("./client");
    // `client.fetch` ist mehrfach überladen; der Rückgabewert interessiert hier
    // nicht, geprüft werden die übergebenen Cache-Optionen.
    const fetchSpy = vi.spyOn(client, "fetch").mockResolvedValue([] as never);

    await sanityFetch({ query: '*[_type == "post"]', tags: ["post", "category"] });

    expect(fetchSpy).toHaveBeenCalledWith(
      '*[_type == "post"]',
      {},
      { next: { revalidate: 3600, tags: ["post", "category"] } },
    );

    fetchSpy.mockRestore();
  });

  it("kennt genau die fünf Cache-Marken, auf die der Webhook später revalidiert", async () => {
    const { SANITY_TAGS } = await import("./client");

    expect([...SANITY_TAGS]).toEqual(["post", "category", "author", "faq", "settings"]);
  });
});
