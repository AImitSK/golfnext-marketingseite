/**
 * Eine Wahrheit für Routen, Navigation, Status und Metadaten.
 * Header, Footer, Sitemap, robots, Platzhalter-Routen und der seo-auditor lesen hier.
 *
 * Status:
 *  - "live"                 gebaut und verlinkbar
 *  - "geplant"              Briefing und Mock vorhanden, noch nicht gebaut (verlinkbar erst nach Bau)
 *  - "wartet-auf-briefing"  kein Briefing – Route rendert eine noindex-Platzhalterseite, wird NICHT verlinkt,
 *                           solange docs/10-launch-umfang.md sie nicht freigibt
 *  - "system"               technische Route (Studio, API), nie in Navigation oder Sitemap
 *
 * Die Navigation ergibt sich allein aus den Feldern `nav` und `parent`: `nav: "haupt"`
 * macht eine Route zum Hauptpunkt, `parent` hängt sie als Kind in dessen Dropdown.
 * Im Header steht kein Menüpunkt hart kodiert.
 *
 * NICHT-`live` Punkte werden gar nicht gerendert – weder als Hauptpunkt noch im
 * Dropdown (`lib/navigation.ts`), weder im Footer noch in Teaser-Links (`isLinkable`
 * prüft nur `live`). Ein Link, der nichts tut (`href="#"`), ist für Tastatur und
 * Screenreader ein toter Bedienpunkt; es gibt hier keinen mehr. Folge: ein Hauptpunkt
 * ohne `live`-Kinder hat sichtbar kein Dropdown, und Punkte erscheinen von selbst,
 * sobald ihr Status auf `live` wechselt – ohne Codeänderung.
 *
 * Struktur v2 (Entscheidung Fred/Stefan, 07.09.2026 – Briefing 0023):
 *   Plattform ▾ (So arbeitet GolfNext) · Wachstum & Vertrieb · Clubprozesse · Pakete ·
 *   Über GolfNext ▾ (Praxis, Kontakt) · CTA
 * `/team`, `/ratgeber` und die zwölf `/module/<slug>` sind ersatzlos entfallen. Die
 * Mock-Köpfe unter docs/design-system/mocks/ zeigen noch die alte Navigation – das ist
 * kein Fehler, die Mocks bleiben nur für Seiteninhalte verbindlich.
 *
 * Platzhalterseiten (Briefing 0022): `/praxis` (geplant) und `/kontakt`
 * (wartet-auf-briefing) rendern seit Schritt 2.8 dieselbe leere Platzhalterseite –
 * beide Status also, nicht nur „wartet-auf-briefing". Sie bleiben trotzdem UNVERLINKT,
 * erreichbar per direkter URL (Lesezeichen, alte Links, der CTA-Fallback aus
 * `lib/links.ts`). Sobald eine Seite gebaut ist, wechselt ihr Status auf `live`,
 * `noindex` fällt weg, und Navigation wie Teaser ziehen automatisch nach.
 *
 * Titel und Beschreibung stammen aus den „Technischen Seitenangaben" der Fred-Briefings.
 * Fehlt dort eine Angabe, steht hier `null` – nicht erfinden, sondern nachfragen.
 */

export type RouteStatus = "live" | "geplant" | "wartet-auf-briefing" | "system";

export interface Route {
  path: string;
  label: string;
  status: RouteStatus;
  /** Erscheint in der Hauptnavigation (Kapitel 2.4) */
  nav?: "haupt";
  /** Untermenü eines Hauptpunkts (Dropdown) */
  parent?: string;
  /** Mock und Fred-Briefing unter docs/design-system/ */
  mock?: string;
  briefing?: string;
  /** SEO */
  title: string | null;
  description: string | null;
  noindex?: boolean;
  /** Weiterleitungen von der alten golfnext.de */
  redirectsFrom?: string[];
}

/**
 * Die zwölf Module, zwei Richtungen (gruppe), ein Vertrag.
 *
 * Seit Briefing 0023 eine reine Datenliste: Es gibt keine `/module/<slug>`-Routen
 * mehr. Die Namen stehen weiterhin in der Systemkarte des Footers – dort als Text
 * ohne Link. `gruppe` sortiert sie in die beiden Spalten.
 *
 * Hinweis zum Feld `status` (im-einsatz/pilot/in-entwicklung): aktuell ungenutzt –
 * die Anzeige des Modulstatus entfällt (Briefing 0014, Stand 06.09.2026). Das Feld
 * bleibt als Datenfeld erhalten, wird aber nirgends mehr gerendert. Werte NICHT auf
 * „im-einsatz" fälschen; wenn der Status später wieder gebraucht wird, hier pflegen.
 */
export const MODULE = [
  // Wachstum nach außen
  { slug: "reach", name: "Reach", gruppe: "wachstum", status: "im-einsatz" },
  { slug: "search", name: "Search", gruppe: "wachstum", status: "im-einsatz" },
  { slug: "landingpages", name: "Landingpages", gruppe: "wachstum", status: "im-einsatz" },
  { slug: "marketing-crm", name: "Marketing-CRM", gruppe: "wachstum", status: "pilot" },
  { slug: "lifecycle", name: "Lifecycle", gruppe: "wachstum", status: "im-einsatz" },
  { slug: "content", name: "Content", gruppe: "wachstum", status: "im-einsatz" },
  // Entlastung nach innen
  { slug: "concierge", name: "Concierge", gruppe: "clubprozesse", status: "pilot" },
  { slug: "platzstatus", name: "Platzstatus", gruppe: "clubprozesse", status: "im-einsatz" },
  { slug: "gastfee", name: "Gastfee", gruppe: "clubprozesse", status: "pilot" },
  { slug: "firmen-events", name: "Firmen-Events", gruppe: "clubprozesse", status: "in-entwicklung" },
  { slug: "turnier-news", name: "Turnier-News", gruppe: "clubprozesse", status: "pilot" },
  { slug: "captains-app", name: "Captains App", gruppe: "clubprozesse", status: "in-entwicklung" },
] as const;

export const ROUTES: Route[] = [
  {
    path: "/",
    label: "Startseite",
    status: "live",
    mock: "mocks/3.1b-startseite-neufassung.html",
    briefing: "briefings/0021-startseite-neufassung.md",
    // Briefing liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx), nicht erfinden (Phase 6).
    title: null,
    description: null,
  },
  {
    path: "/plattform",
    label: "Plattform",
    status: "live",
    nav: "haupt",
    mock: "mocks/3.2c-plattform-neufassung.html",
    briefing: "briefings/0016-plattform.md",
    // Briefing 0016 liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx),
    // nur Canonical wird gesetzt (wie Startseite). Nicht erfinden (Feinschliff Phase 6).
    title: null,
    description: null,
  },
  {
    path: "/plattform/so-arbeitet-golfnext",
    label: "So arbeitet GolfNext",
    // Seit Briefing 0024 gebaut → `live`. Damit erscheint das Plattform-Dropdown
    // zum ersten Mal (es hat genau diesen einen Punkt).
    status: "live",
    parent: "/plattform",
    mock: "mocks/3.3b-so-arbeitet-golfnext-neufassung.html",
    briefing: "briefings/0024-so-arbeitet-golfnext.md",
    title: null,
    description: null,
  },
  {
    path: "/wachstum-vertrieb",
    label: "Wachstum & Vertrieb",
    status: "live",
    nav: "haupt",
    mock: "mocks/3.4b-wachstum-vertrieb-neufassung.html",
    briefing: "briefings/0017-wachstum-vertrieb.md",
    // Briefing 0017 liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx),
    // nur Canonical wird gesetzt (wie Plattform/Startseite). Nicht erfinden (Feinschliff Phase 6).
    title: null,
    description: null,
  },
  {
    path: "/clubprozesse",
    label: "Clubprozesse",
    status: "live",
    nav: "haupt",
    mock: "mocks/3.5b-clubprozesse-neufassung.html",
    briefing: "briefings/0018-clubprozesse.md",
    // Briefing 0018 liefert keinen Meta-Titel/-Text → Root-Default (app/layout.tsx),
    // nur Canonical wird gesetzt (wie Plattform/Wachstum/Startseite). Nicht erfinden (Feinschliff Phase 6).
    title: null,
    description: null,
  },
  {
    // Seit 07.09.2026 Unterpunkt von „Über GolfNext" statt Hauptpunkt (Briefing 0023).
    // Die Adresse bleibt `/praxis` (Entscheidung Stefan) – nur die Menüposition wandert,
    // deshalb keine Weiterleitung. `/praxis` ist zugleich der Blog (früher `/ratgeber`).
    path: "/praxis",
    // Menü-Label „Ratgeber", Adresse `/praxis` (Entscheidung Stefan, 07.09.2026).
    // Beides ist gewollt und kein Versehen: die URL war schon entschieden, im Menü
    // liest sich „Ratgeber" besser. Der Seiteninhalt selbst spricht weiter von
    // „Praxis" (Freds freigegebener Wortlaut in Mock 3.9a) – nicht angleichen.
    label: "Ratgeber",
    status: "geplant",
    parent: "/ueber-golfnext",
    mock: "mocks/3.9a-praxis-uebersicht.html",
    // Es gibt kein Praxis-Briefing und wird keines geben (`0020-praxis.md` existiert
    // nicht); die Seite entsteht mit dem Sanity-Briefing in Phase 3. Bewusst leer
    // gelassen statt auf eine nicht existierende Datei zu zeigen.
    briefing: undefined,
    title: null,
    description: null,
    // Platzhalterseite bis der Blog in Phase 3 aus Sanity kommt: die neun Artikel in
    // 3.9a/3.9b sind Beispieltexte ohne Fred-Freigabe (Briefing 0022).
    noindex: true,
  },
  {
    path: "/pakete",
    label: "Pakete",
    status: "live",
    nav: "haupt",
    mock: "mocks/3.7-pakete.html",
    briefing: "briefings/0012-pakete.md",
    title: "GolfNext Pakete und Preise für Golfclubs",
    // Briefing-Text bezieht sich auf Fassung 1; an Fassung 2 anpassen [S]
    description:
      "GolfNext bietet drei Ausbaustufen für Golfclubs: digitale Grundlage, systematisches Wachstum und eine vollständige digitale Clubzentrale.",
  },
  {
    path: "/ueber-golfnext",
    label: "Über GolfNext",
    status: "live",
    nav: "haupt",
    mock: "mocks/3.8b-ueber-golfnext-neufassung.html",
    briefing: "briefings/0019-ueber-golfnext.md",
    title: "Über GolfNext | Wir hängen am Golf. Nicht am Gestern.",
    description:
      "Von imageGolf zur GolfNext-Plattform: unsere Geschichte, die Menschen dahinter und unser Antrieb für mehr Mitglieder und mehr Zeit fürs Clubleben.",
    redirectsFrom: ["/ueber-golfnext/"],
  },
  {
    // Kind von „Über GolfNext" (Briefing 0023). Erscheint im Dropdown erst, wenn die
    // Seite mit dem Formular gebaut ist (Masterplan 4.3) und der Status auf `live` geht.
    path: "/kontakt",
    label: "Kontakt",
    status: "wartet-auf-briefing",
    parent: "/ueber-golfnext",
    title: null,
    description: null,
    noindex: true,
  },
  { path: "/impressum", label: "Impressum", status: "geplant", title: "Impressum – GolfNext", description: null, noindex: false, redirectsFrom: ["/impressum/"] },
  { path: "/datenschutz", label: "Datenschutz", status: "geplant", title: "Datenschutzerklärung – GolfNext", description: null },
  { path: "/studio", label: "Studio", status: "system", title: null, description: null, noindex: true },
];

export const NAV_HAUPT = ROUTES.filter((r) => r.nav === "haupt");
export const LIVE = ROUTES.filter((r) => r.status === "live");
export const isLinkable = (path: string) => ROUTES.find((r) => r.path === path)?.status === "live";

export const CTA = {
  erstgespraech: { label: "Online-Erstgespräch vereinbaren", hint: "30 Minuten persönlich per Zoom oder Teams" },
  liveDemo: { label: "GolfNext in der Live-Demo ansehen" },
} as const;

export const KONTAKT = {
  name: "Fred Hoffmann",
  rolle: "Gründer von GolfNext, PGA Golfprofessional",
  telefon: "0175 5951839",
  email: "info@golfnext.de",
  rueckmeldung: "Rückmeldung innerhalb eines Werktags",
} as const;
