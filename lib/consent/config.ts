import type { CookieConsentConfig } from "vanilla-cookieconsent";
import { ROUTES } from "@/config/site-structure";

/**
 * Deutsche Konfiguration des Einwilligungs-Dialogs (vanilla-cookieconsent v3,
 * MIT – Briefing 0033, Masterplan 5.3; Vorgaben aus `docs/05-consent-dsgvo.md`).
 *
 * Die Bibliothek lädt **nichts** von außen: Sie ist first-party gebündelt, die
 * Optik kommt aus `components/site/consent.css` über die
 * `--cc-*`-Variablen der Bibliothek. Vor der Einwilligung geht damit kein Byte
 * an Dritte – auch nicht „zum Vorbereiten" (Briefing 0033, harte Vorgabe).
 *
 * **Texte.** Alles, was der Besucher liest, steht hier und nur hier. Zwei Herkünfte,
 * im Code getrennt gehalten:
 *  - `FREIGEGEBEN` – wortgleich aus Briefing 0033 („Freigegebene Texte") bzw. aus
 *    `docs/legal/datenschutz.md` Abschnitt 6. Nicht glätten, nicht ergänzen.
 *  - `SYSTEM` – Bedienlabels ohne freigegebene Fassung (Speichern-Schaltfläche,
 *    Beschriftung des Schließen-Symbols). Tonalität wie `lib/ui/messages.ts`
 *    (docs/08 §4): Sie-Form, knapp, keine Technik.
 *
 * **Kategorien.** `necessary` (immer an, nicht abwählbar), `analytics` und
 * `marketing`. Sichtbar ist im Dialog **eine** einwilligungspflichtige Auswahl:
 * „Statistik und Marketing" – genau die eine Kategorie, die Abschnitt 6 der
 * Datenschutzerklärung nennt und für die es einen freigegebenen Text gibt. Sie
 * hängt an `marketing`. `analytics` ist angelegt, aber noch **nicht** als eigener
 * Schalter angeboten: Es gibt derzeit keinen reinen Statistik-Dienst (Vercel Web
 * Analytics ist cookielos und braucht keine Einwilligung) und keinen freigegebenen
 * Text dafür. Ein eigener Schalter kommt, sobald es beides gibt – Text zuerst.
 */

/** Name des First-Party-Cookies, das die Auswahl speichert (Datenschutzerklärung §6). */
export const CONSENT_COOKIE = "cc_cookie";

/** Laufzeit der gespeicherten Auswahl in Tagen – 6 Monate (Datenschutzerklärung §6). */
export const CONSENT_DAYS = 182;

/**
 * Fassung der Einwilligung. **Erhöhen**, sobald die Datenschutzerklärung eine
 * einwilligungspflichtige Kategorie ändert oder ein Dienst dazukommt – dann fragt
 * der Dialog erneut (docs/05, Revision Management).
 */
export const CONSENT_REVISION = 1;

/** Die Kategorie, an der „Statistik und Marketing" im Dialog hängt. */
export const KATEGORIE_MARKETING = "marketing";

/** Angelegt, aber noch nicht angeboten – siehe Kopfkommentar. */
export const KATEGORIE_ANALYTICS = "analytics";

/**
 * Freigegebene Texte – wortgleich aus Briefing 0033 und `docs/legal/datenschutz.md`
 * Abschnitt 6. Einzige Abweichung: In der Kategorien-Beschreibung steht das erste
 * Wort groß („Derzeit"), weil aus dem Listenpunkt „**Statistik und Marketing** (nur
 * mit Einwilligung) – derzeit ist …" im Dialog eine Überschrift und ein eigener
 * Satz werden. Kein Wort ergänzt, keines weggelassen.
 *
 * Die Anführungszeichen stehen bewusst so da wie in der Quelle: unten „, oben
 * gerade ". So schreibt es das ganze Repo – auch `docs/legal/datenschutz.md`, das
 * auf `/datenschutz` wörtlich gerendert wird. Ein typografisch „richtigeres“
 * Schlusszeichen hätte den Dialog von der Datenschutzerklärung abweichen lassen.
 */
const FREIGEGEBEN = {
  titel: "Cookies und Einwilligung",
  einleitung:
    'Notwendige Cookies sorgen dafür, dass die Website funktioniert und Ihre Auswahl gespeichert bleibt. Für Statistik und Marketing fragen wir Sie vorher. Sie können Ihre Auswahl jederzeit im Fußbereich unter „Cookie-Einstellungen" ändern.',
  alleAkzeptieren: "Alle akzeptieren",
  nurNotwendige: "Nur notwendige",
  einstellungen: "Einstellungen",
  notwendig: {
    titel: "Notwendig",
    text: "Auslieferung der Seite, Speicherung Ihrer Cookie-Auswahl, Schutz der Formulare vor Missbrauch.",
  },
  statistikUndMarketing: {
    titel: "Statistik und Marketing (nur mit Einwilligung)",
    text: "Derzeit ist kein Dienst dieser Kategorie im Einsatz. Die Kategorie bleibt vorbereitet; sobald wir einen solchen Dienst einsetzen, wird er hier benannt und erst nach Ihrer Einwilligung geladen.",
  },
} as const;

/**
 * Bedienlabels ohne freigegebene Fassung (docs/08 §4). „Auswahl speichern" braucht
 * der Einstellungen-Dialog, sobald der Besucher den Schalter selbst umlegt; im
 * Briefing steht dafür kein Wortlaut. Als offener Punkt im PR vermerkt.
 */
const SYSTEM = {
  speichern: "Auswahl speichern",
  schliessen: "Einstellungen schließen",
} as const;

/**
 * Fußzeile des Dialogs: Links auf `/datenschutz` und `/impressum`. Die Beschriftung
 * ist das `label` der Route aus `config/site-structure.ts` – eine Wahrheit, keine
 * zweite Schreibweise. Ist eine Route nicht `live`, steht sie als reiner Text da
 * (kein toter Link, wie in Footer und Kontaktformular).
 */
function rechtslink(path: string): string {
  const route = ROUTES.find((r) => r.path === path);
  if (!route) throw new Error(`Route "${path}" fehlt in config/site-structure.ts`);
  return route.status === "live"
    ? `<a href="${route.path}">${route.label}</a>`
    : `<span>${route.label}</span>`;
}

export const consentConfig: CookieConsentConfig = {
  // `opt-in` ist die Vorgabe der Bibliothek und die einzige zulässige Betriebsart:
  // Ohne aktive Zustimmung gilt jede Kategorie außer `necessary` als abgelehnt.
  mode: "opt-in",
  autoShow: true,
  revision: CONSENT_REVISION,

  // Kein Dark Pattern: Die Seite bleibt hinter dem Dialog bedienbar und scrollbar.
  // `disablePageInteraction: true` würde zusätzlich `overflow:hidden` setzen – das
  // nimmt die Scrollleiste weg und verschiebt das Layout (CLS).
  disablePageInteraction: false,

  // Die Bibliothek würde bei `navigator.webdriver` (jeder Automations-Browser) und
  // bei Bot-User-Agents gar nicht starten. Genau dann könnte die Playwright-Prüfung
  // aber nicht nachweisen, dass vor der Einwilligung nichts geladen wird. Der Dialog
  // entsteht ohnehin erst im Browser per JavaScript; ein Crawler ohne JS sieht ihn
  // nie, und einer mit JS sieht nur den Dialogtext, der auch in der
  // Datenschutzerklärung steht.
  hideFromBots: false,

  // Wir binden Scripts über `components/site/Analytics.tsx` ein, nicht über
  // `<script data-category>`-Tags im HTML. Die Abfangfunktion wird nicht gebraucht.
  manageScriptTags: false,

  cookie: {
    name: CONSENT_COOKIE,
    expiresAfterDays: CONSENT_DAYS,
    sameSite: "Lax",
    path: "/",
  },

  guiOptions: {
    // `equalWeightButtons` gibt „Alle akzeptieren" und „Nur notwendige" dieselbe
    // Optik; „Einstellungen" zieht `ConsentBanner.module.css` auf dieselbe Fläche.
    // Ablehnen ist damit nie schwerer als Zustimmen (Datenschutzkonferenz, docs/05).
    consentModal: {
      layout: "box",
      position: "bottom right",
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: { layout: "box", equalWeightButtons: true, flipButtons: false },
  },

  categories: {
    necessary: { enabled: true, readOnly: true },
    // Angelegt, aber noch ohne eigenen Schalter (siehe Kopfkommentar).
    [KATEGORIE_ANALYTICS]: {},
    [KATEGORIE_MARKETING]: {
      // Räumt die Cookies weg, die GTM/Meta setzen würden, sobald der Besucher
      // widerruft. Namensmuster der Dienste, keine erfundenen Werte.
      autoClear: {
        cookies: [{ name: /^_ga/ }, { name: "_gid" }, { name: "_gcl_au" }, { name: "_fbp" }],
      },
    },
  },

  language: {
    default: "de",
    translations: {
      de: {
        consentModal: {
          title: FREIGEGEBEN.titel,
          description: FREIGEGEBEN.einleitung,
          acceptAllBtn: FREIGEGEBEN.alleAkzeptieren,
          acceptNecessaryBtn: FREIGEGEBEN.nurNotwendige,
          showPreferencesBtn: FREIGEGEBEN.einstellungen,
          // Bewusst KEIN `closeIconLabel`: ein „X" am Dialog wäre ein zweiter,
          // stiller Weg an der Auswahl vorbei. Es gibt drei gleichwertige Wege.
          footer: `${rechtslink("/datenschutz")}${rechtslink("/impressum")}`,
        },
        preferencesModal: {
          title: FREIGEGEBEN.titel,
          acceptAllBtn: FREIGEGEBEN.alleAkzeptieren,
          acceptNecessaryBtn: FREIGEGEBEN.nurNotwendige,
          savePreferencesBtn: SYSTEM.speichern,
          closeIconLabel: SYSTEM.schliessen,
          sections: [
            // Einleitung ohne Schalter – derselbe freigegebene Text wie im Dialog.
            { description: FREIGEGEBEN.einleitung },
            {
              title: FREIGEGEBEN.notwendig.titel,
              description: FREIGEGEBEN.notwendig.text,
              linkedCategory: "necessary",
            },
            {
              title: FREIGEGEBEN.statistikUndMarketing.titel,
              description: FREIGEGEBEN.statistikUndMarketing.text,
              linkedCategory: KATEGORIE_MARKETING,
            },
          ],
        },
      },
    },
  },
};
