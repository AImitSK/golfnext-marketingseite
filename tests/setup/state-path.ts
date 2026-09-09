/**
 * Wohin `tests/setup/consent.setup.ts` den vorentschiedenen Einwilligungs-Zustand
 * schreibt und woher `playwright.config.ts` ihn liest (Briefing 0033).
 *
 * Steht in einer eigenen Datei ohne Playwright-Import: Die Konfiguration darf keine
 * Spec-Datei laden, sonst liefe deren `setup(...)`-Aufruf schon beim Einlesen der
 * Konfiguration.
 */
export const CONSENT_STATE = "tests/.state/consent.json";
