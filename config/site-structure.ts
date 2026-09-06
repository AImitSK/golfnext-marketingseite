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
  /** Untermenü eines Hauptpunkts (Modul-Dropdowns) */
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
    status: "geplant",
    parent: "/plattform",
    mock: "mocks/3.3-so-arbeitet-golfnext.html",
    briefing: "briefings/3.3-so-arbeitet-golfnext-briefing.md",
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
    path: "/praxis",
    label: "Praxis",
    status: "geplant",
    nav: "haupt",
    mock: "mocks/3.9a-praxis-uebersicht.html",
    briefing: "briefings/0020-praxis.md",
    title: null,
    description: null,
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
    status: "geplant",
    nav: "haupt",
    mock: "mocks/3.8b-ueber-golfnext-neufassung.html",
    briefing: "briefings/0019-ueber-golfnext.md",
    title: "Über GolfNext | Wir hängen am Golf. Nicht am Gestern.",
    description:
      "Von imageGolf zur GolfNext-Plattform: unsere Geschichte, die Menschen dahinter und unser Antrieb für mehr Mitglieder und mehr Zeit fürs Clubleben.",
    redirectsFrom: ["/ueber-golfnext/"],
  },
  { path: "/team", label: "Team", status: "wartet-auf-briefing", title: null, description: null, noindex: true },
  { path: "/kontakt", label: "Kontakt", status: "wartet-auf-briefing", title: null, description: null, noindex: true },
  ...MODULE.map<Route>((m) => ({
    path: `/module/${m.slug}`,
    label: m.name,
    status: "wartet-auf-briefing",
    parent: m.gruppe === "wachstum" ? "/plattform" : "/clubprozesse",
    title: null,
    description: null,
    noindex: true,
  })),
  { path: "/ratgeber", label: "Ratgeber", status: "geplant", title: "Ratgeber – GolfNext", description: null },
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
