# Inhalte als Daten

Alle Websiteinhalte einer statischen Seite liegen in **einer** Datei `content/<seite>.ts` und werden von den Komponenten importiert.
Komponenten enthalten keine freien Inhaltstexte. Gründe: Wortgleichheit mit Freds Briefings ist prüfbar (`text-fidelity`),
Korrekturen sind Ein-Datei-Änderungen, und der Agent kann nicht unbemerkt „glätten".

Regeln:
- Nur Texte aus dem Briefing-Abschnitt „Websiteinhalt" (bzw. aus dem Mock, wo das Briefing Spielraum ließ). Umsetzungshinweise,
  Platzhalterbeschreibungen, Animationsbeschreibungen gehören nicht hierher.
- Wortlaut exakt: Halbgeviertstrich `–`, Anführungszeichen „…", Satzfragmente, gewünschte Desktop-Umbrüche als `headlineLines`.
- CTA-Ziele nur als `target`, die URL löst `lib/links.ts` aus `.env` auf.
- Interne Vermerke, falls nötig, als TypeScript-Kommentar – nie als String.
- `content/ueber-golfnext.ts` ist das Muster. Die übrigen Seiten legt der Umsetzungs-Chat nach demselben Schema an, bevor er die Komponenten baut.

Bilder-Platzhalter werden nicht hier, sondern in der Komponente über `<Shot />` gesetzt; ihre Beschreibung („Benötigtes Bild: …") ist
kein Websiteinhalt und darf nur in Preview erscheinen.
