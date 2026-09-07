/**
 * Kleine Liste bekannter Wegwerf-Mail-Dienste (docs/06, Stufe B, Punkt 7).
 *
 * Bewusst kurz und konservativ: Ein Treffer VERWIRFT nichts, er erhöht nur den
 * Score und führt damit höchstens zum Betreff-Tag `[Prüfen]`. Ein Clubmanager mit
 * einer ungewöhnlichen Adresse verliert seine Anfrage nie.
 */
export const DISPOSABLE_DOMAINS = new Set<string>([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "sharklasers.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "trashmail.com",
  "trashmail.de",
  "wegwerfmail.de",
  "wegwerfemail.de",
  "yopmail.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "throwawaymail.com",
  "mailnesia.com",
  "spamgourmet.com",
  "byom.de",
]);

/** Prüft die Domain einer bereits validierten (kleingeschriebenen) Adresse. */
export function isDisposableDomain(email: string): boolean {
  const domain = email.split("@")[1];
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}
