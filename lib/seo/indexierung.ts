/**
 * Wer darf indexieren? Die eine Entscheidung, die `next.config.ts` als Kopfzeile
 * ausliefert (Masterplan 6.3, Briefing 0034).
 *
 * Sie steht hier und nicht in der Konfiguration, damit sie prüfbar ist: `VERCEL_ENV`
 * setzt die Plattform selbst, lokal ist die Variable nie gesetzt – ein Playwright-Lauf
 * kann den Fall „Preview" deshalb nicht herstellen, ein Unit-Test schon.
 */

/** Der Kopf, mit dem eine Umgebung sagt: bitte nicht indexieren. */
export const NOINDEX_HEADER = { key: "X-Robots-Tag", value: "noindex, nofollow" } as const;

/**
 * Antwortet diese Umgebung mit `X-Robots-Tag: noindex, nofollow`?
 *
 * Ja für alles auf Vercel, was nicht Produktion ist – Preview-Deployments und
 * `vercel dev`. Nein außerhalb von Vercel: Lokale Builds und der Testlauf sollen die
 * Seite so ausliefern, wie Produktion sie ausliefert, sonst prüfte Playwright eine
 * andere Website.
 */
export function istNichtProduktion(vercelEnv: string | undefined): boolean {
  return Boolean(vercelEnv) && vercelEnv !== "production";
}

/** Die Kopfzeilen zur Indexierung – leer in Produktion und außerhalb von Vercel. */
export function indexierungsHeader(
  vercelEnv: string | undefined,
): { key: string; value: string }[] {
  return istNichtProduktion(vercelEnv) ? [{ ...NOINDEX_HEADER }] : [];
}
