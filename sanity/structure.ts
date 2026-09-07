import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import type { StructureResolver } from "sanity/structure";

/**
 * Die Navigation des Studios – genau fünf Punkte (Briefing 0026, Abschnitt C):
 *
 *   Ratgeber · Ratgeber-Rubriken · Autoren · FAQs · Einstellungen
 *
 * Zur Benennung: Der Menüpunkt der Website heißt seit 07.09.2026 „Ratgeber“,
 * die Adresse bleibt `/praxis`, der Dokumenttyp heißt technisch weiterhin `post`.
 * Im Studio steht „Ratgeber“, weil Fred dort arbeitet – nicht angleichen.
 *
 * Es werden hier KEINE Inhalte angelegt. Rubriken und Autoren sind eigene
 * Dokumenttypen; Fred legt sie im Studio selbst an (Entscheidung Stefan,
 * 07.09.2026). Ein leeres Studio nach dem Deploy ist das erwartete Ergebnis.
 */

/** Themen der FAQs – Werte wie im Feld `faq.topic`, Titel wie im Studio. */
const FAQ_THEMEN = [
  { value: "pakete", title: "Pakete" },
  { value: "plattform", title: "Plattform" },
  { value: "clubprozesse", title: "Clubprozesse" },
  { value: "wachstum", title: "Wachstum" },
  { value: "allgemein", title: "Allgemein" },
] as const;

/**
 * Typen, die NICHT in der automatischen Liste auftauchen dürfen: `siteSettings`
 * ist ein Singleton und steckt unter „Einstellungen“. Die Struktur ist ohnehin
 * vollständig ausgeschrieben – die Konstante hält die Absicht fest.
 */
export const SINGLETONS = ["siteSettings"] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("GolfNext")
    .items([
      S.listItem()
        .title("Ratgeber")
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList("post")
            .title("Ratgeber")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),

      S.listItem()
        .title("Ratgeber-Rubriken")
        .icon(TagIcon)
        .child(
          S.documentTypeList("category")
            .title("Ratgeber-Rubriken")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.listItem()
        .title("Autoren")
        .icon(UserIcon)
        .child(
          S.documentTypeList("author")
            .title("Autoren")
            .defaultOrdering([{ field: "name", direction: "asc" }]),
        ),

      S.listItem()
        .title("FAQs")
        .icon(HelpCircleIcon)
        .child(
          S.list()
            .title("FAQs")
            .items([
              // Neue Fragen hier anlegen – in den Themenlisten darunter ist
              // nur gefiltert, das Thema wird im Formular gesetzt.
              S.listItem()
                .title("Alle Fragen")
                .icon(HelpCircleIcon)
                .child(
                  S.documentTypeList("faq")
                    .title("Alle Fragen")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.divider(),
              ...FAQ_THEMEN.map((thema) =>
                S.listItem()
                  .id(`faq-${thema.value}`)
                  .title(thema.title)
                  .icon(HelpCircleIcon)
                  .child(
                    S.documentList()
                      .id(`faq-liste-${thema.value}`)
                      .title(thema.title)
                      .schemaType("faq")
                      .filter('_type == "faq" && topic == $topic')
                      .params({ topic: thema.value })
                      .defaultOrdering([{ field: "order", direction: "asc" }]),
                  ),
              ),
            ]),
        ),

      // Singleton: feste Dokument-ID, damit es genau ein Dokument gibt und im
      // Studio kein „Neu anlegen“ erscheint (Briefing 0026, Aufgabe 7).
      S.listItem()
        .title("Einstellungen")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings").title("Einstellungen"),
        ),
    ]);
