/**
 * Strukturierte Daten als `<script type="application/ld+json">` im Server-HTML
 * (Masterplan 6.4, Briefing 0034).
 *
 * Bewusst zehn Zeilen statt einer Bibliothek: Es gibt nichts zu berechnen, und ein
 * zusätzliches Bündel im Browser wäre der falsche Preis für ein paar Zeilen JSON.
 * Der Baustein rendert nichts Sichtbares und verschiebt kein Layout.
 *
 * `<` wird als `\u003c` geschrieben. Ohne das könnte ein Text aus Sanity mit
 * `</script>` das Script-Element vorzeitig schließen – der klassische Weg, über
 * einen Redaktionstext fremdes Markup in eine Seite zu bekommen.
 */
export function JsonLd({ daten }: { daten: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(daten).replace(/</g, "\u003c") }}
    />
  );
}
