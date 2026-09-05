import type { PageContent } from "./types";

/**
 * Über GolfNext · /ueber-golfnext
 * Quelle: docs/design-system/briefings/3.8-ueber-golfnext-briefing.md (nur „Websiteinhalt"),
 * Layout: docs/design-system/mocks/3.8-ueber-golfnext.html
 * Wortlaut nicht ändern. Änderungen nur nach neuem Briefing von Fred.
 */
export const ueberGolfnext: PageContent = {
  route: "/ueber-golfnext",
  meta: {
    title: "Über GolfNext | Wir hängen am Golf. Nicht am Gestern.",
    description:
      "Von imageGolf zur GolfNext-Plattform: unsere Geschichte, die Menschen dahinter und unser Antrieb für mehr Mitglieder und mehr Zeit fürs Clubleben.",
  },
  sections: [
    {
      id: "einstieg",
      eyebrow: "Über GolfNext",
      headlineLines: ["Wir hängen am Golf.", "Nicht am Gestern."],
      text: [
        "Mehr Menschen auf den Platz bringen. Mehr Zeit fürs Clubleben schaffen. Dafür entwickeln wir die GolfNext-Plattform. Sie verbindet Websites, die Lust auf Golf machen, mit Marketing, das Menschen erreicht, und digitalen Helfern, die dem Clubbüro Arbeit abnehmen.",
      ],
      data: {
        schlussgedanke: "Wir machen digital. Damit mehr Zeit für das bleibt, was keinen Bildschirm braucht.",
      },
      cta: { label: "GolfNext in der Live-Demo ansehen", target: "livedemo" },
    },
    {
      id: "weg",
      eyebrow: "Unser Weg",
      headlineLines: ["Wir wollten Websites bauen.", "Dann haben wir zugehört."],
      data: {
        stationen: [
          {
            marke: "imageGolf",
            titel: "2016 · Erst mal ins Netz.",
            text: [
              "Mit der Gründung von imageGolf ging es los: Clubwebsites, Social Media und Werbekampagnen. Golfclubs bekamen einen digitalen Auftritt. Ihre Angebote ein Publikum.",
            ],
          },
          {
            marke: "GolfNext Consulting",
            titel: "Danach · Klick gemacht. Fragen offen.",
            text: [
              "Online-Marketing ist schnell beauftragt. Es wirklich zu verstehen, braucht mehr. Wie greifen Kanäle, Inhalte und Mitgliedergewinnung ineinander?",
              "Aus diesem Beratungsbedarf wurde GolfNext Consulting. Wir erklärten Zusammenhänge und schulten Mitarbeiter im Clubbüro in Social Media, Suchmaschinenoptimierung, dem Schreiben von Blogartikeln und später im Einsatz von KI.",
            ],
          },
          {
            marke: "GolfNext",
            titel: "Heute · Aus „Man müsste mal“ wird Software.",
            text: [
              "Seit 2026 nutzen wir KI-gestützte Entwicklung, um eigene Anwendungen wirtschaftlicher umzusetzen. So werden Lösungen möglich, die auch zu den Budgets kleinerer Golfclubs und Golfanlagen passen.",
            ],
          },
        ],
        abschluss:
          "Viele Clubprojekte. Viele Erkenntnisse. Heute eine Plattform: GolfNext verbindet Clubwebsite, Mitgliedergewinnung und digitale Tools für den Cluballtag.",
      },
    },
    {
      id: "projekte",
      eyebrow: "Gemeinsame Projekte",
      headline: "Diese Partner haben mitgeschrieben.",
      text: [
        "An unserer Geschichte. Und an der Idee hinter GolfNext.",
        "Für sie haben wir Websites gestaltet, Kampagnen umgesetzt und Printprojekte entwickelt. Ihre Teams haben wir beraten und geschult.",
      ],
      // Logos: Fred liefert Liste, Dateien, Freigaben und Beschriftungen. Bis dahin Platzhalter-Raster (nicht aus dieser Datei).
    },
    {
      id: "menschen",
      eyebrow: "Die Menschen dahinter",
      headlineLines: ["Künstliche Intelligenz.", "Echte Golfverrückte."],
      text: [
        "Fred Hoffmann bringt mehr als 30 Jahre Berufserfahrung im Golfmarkt als PGA Golfprofessional mit.",
        "Stefan Kühne verbindet langjährige Erfahrung im Online-Marketing mit technischer Entwicklung.",
        "Bei Spezialfragen zu Datenschutz und KI-Regulierung unterstützen uns erfahrene Fachpartner.",
      ],
      data: {
        haltung:
          "Uns begeistert, was Technik möglich macht. Noch mehr begeistert uns, was Menschen mit der gewonnenen Zeit anfangen.",
        statementLines: ["Ein gutes Gespräch lässt sich nicht automatisieren.", "Die Arbeit davor oft schon."],
        personen: [
          { name: "Fred Hoffmann", rolle: "PGA Golfprofessional" },
          { name: "Stefan Kühne", rolle: "Online-Marketing und Entwicklung" },
        ],
      },
      cta: { label: "Unser Team kennenlernen", target: "team" },
    },
  ],
  footerClose: {
    eyebrow: "GolfNext persönlich",
    headline: "Was müsste bei Ihnen endlich mal einfacher gehen?",
    text: ["Erzählen Sie es Fred Hoffmann. Vielleicht beginnt genau dort das nächste Kapitel für Ihren Club."],
    cta: {
      label: "Online-Erstgespräch vereinbaren",
      hint: "30 Minuten persönlich per Zoom oder Teams",
      target: "erstgespraech",
    },
  },
};
