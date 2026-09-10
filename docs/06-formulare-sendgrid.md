# Formulare und E-Mail-Versand

## Anforderungen

- Kontakt- bzw. Erstgespräch-Anfrage auf `/kontakt` – seit Briefing 0025 gebaut und `live` (keine noindex-Testroute nötig gewesen).
- Der CTA „Online-Erstgespräch vereinbaren" führt auf **dieses Formular** (`/kontakt`). Der externe Buchungsweg ist am 10.09.2026 entfallen (Entscheidung Stefan) – es gibt kein cal.com und keine `NEXT_PUBLIC_BOOKING_URL` mehr.
- Kein Newsletter zum Launch → kein Double-Opt-in nötig.
- Visuelle Zustände sind im UI-Kit definiert: `docs/design-system/mocks/2.5-ui-kit.html`, Abschnitt 3 (Eingabefelder Default · Fokus · Fehler · Erfolg · Deaktiviert, Feldmeldungen `.fmsg e/s/h`, Pflichtstern, Einwilligung) und Abschnitt 7 (Inline-Alerts info/ok/err, Toast, Leerzustand, Skeleton, Button-Ladezustand `.btn.loading`).

## Felder (verbindlich: Mock `3.10-kontakt.html`, Briefing 0025)

Die frühere Liste (Golfanlage, Ihr Name, Rolle, **Wunschzeit**, Interesse) stammte aus dem UI-Kit und ist **überholt**. Ein Wunschzeit-Feld gibt es weiterhin nicht: Fred stimmt den Termin in seiner Antwort ab (Entscheidung Stefan, 07.09.2026, Buchungsweg entfallen am 10.09.2026). Es gibt **kein Newsletter-Feld** – der Hero verspricht ausdrücklich „Keine Anmeldung zu irgendeinem Newsletter".

| Feld | Pflicht | Typ | Validierung |
|---|---|---|---|
| Vorname | ja | text | 2–80 Zeichen |
| Nachname | ja | text | 2–80 Zeichen |
| „Ich bin …" | nein | select | Ehrenamtlicher Vorstand eines e.V. · Betreiber einer Golfanlage · Clubmanager · Mitarbeiter Clubsekretariat · etwas anderes |
| Golfclub oder Anlage | nein | text | ≤ 120 Zeichen |
| „Worum geht es?" | nein | select | Erstgespräch vereinbaren · Frage zu den Paketen und Preisen · Frage zu einem einzelnen Modul · Bestehende Website übernehmen · Presse oder Kooperation · Etwas anderes |
| E-Mail | ja | email | RFC-konform, kleingeschrieben, max 254 |
| Telefon | nein | tel | 6–30 Zeichen aus Ziffern, `+`, Leerzeichen, `/`, `-`, Klammern; Hilfetext „Wenn Sie lieber angerufen werden." |
| Ihre Nachricht | ja | textarea | 1–3000 Zeichen |
| Einwilligung | ja | checkbox | „Ich habe die Datenschutzerklärung gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden. Die Einwilligung kann ich jederzeit widerrufen." |
| `website` (Honeypot) | – | text, versteckt | muss leer sein |
| `ts` (signierter Zeitstempel) | – | hidden | siehe Spam-Schutz |

Beide Auswahlfelder haben **keine leere Vorauswahl** (so steht es im Mock): Der erste Eintrag ist vorbelegt. Neben dem Button steht „Wir melden uns innerhalb eines Werktags. Ihre Daten gehen an niemanden sonst." (Wortlaut Mock 3.10).

**Die Route rendert dynamisch** (`export const dynamic = "force-dynamic"`), weil der signierte Zeitstempel sonst zur Bauzeit entstünde und beim Abruf fast immer älter als zwei Stunden wäre – jede echte Anfrage würde still verworfen.

## Ablauf

```
ContactForm (Client, useActionState – `isPending` statt useFormStatus)
   → Server Action submitContact(formData)
   → 1 zod-Schema (Felder, Längen, Format)
   → 2 Spam-Stufe A: Honeypot, signierter Zeitstempel, Origin
   → 3 Spam-Stufe B: Rate-Limit (IP-Hash, E-Mail-Hash), Duplikat, Inhaltsheuristik → Score
   → 4 sendMail() über SendGrid  (Score „verdächtig" → Betreff-Tag [Prüfen], Score „Spam" → stilles Verwerfen)
   → 5 optional Bestätigung an Absender
   → Antwort { ok } | { ok:false, fieldErrors, formError }
```

Server Action statt API-Route: kein exponierter Endpoint, Progressive Enhancement (funktioniert ohne JS mit normalem POST), Origin-Prüfung durch Next (`serverActions.allowedOrigins` für Preview-Domains setzen).

## Spam-Schutz – ohne CAPTCHA, in zwei Stufen

Grundsatz: Kein reCAPTCHA (einwilligungspflichtig, Datentransfer, Barriere für echte Clubmanager). Alles serverseitig, alles unsichtbar für ehrliche Nutzer. **Legitime Anfragen dürfen nie verloren gehen** – deshalb nur klare Bot-Signale still verwerfen, alles Unsichere zustellen und markieren.

**Stufe A – sofortiges Verwerfen (eindeutige Bots), Antwort trotzdem `{ ok: true }`:**
1. **Honeypot** `website`: visuell versteckt (`position:absolute; left:-9999px`, nicht `display:none` – manche Bots erkennen das), `tabindex=-1`, `autocomplete="off"`, `aria-hidden="true"`. Gefüllt → verwerfen.
2. **Signierter Zeitstempel**: Server rendert `ts = <epoch>.<HMAC-SHA256(epoch, FORM_SIGNING_SECRET)>`. Beim Absenden: Signatur gültig, Alter zwischen **4 Sekunden und 2 Stunden**. Ohne Signatur kann ein Bot den Wert nicht fälschen; die Obergrenze verhindert Wiederverwendung.
3. **Origin/Referer** nicht aus unserer Domain (Next prüft das für Server Actions; Preview-Hosts eintragen).
4. **Payload-Anomalien**: unbekannte Felder, Feldlängen weit über dem Maximum, Steuerzeichen, mehr als 2 URLs in der Nachricht, Nachricht ausschließlich aus URLs/Zeichenketten ohne Leerzeichen.

**Stufe B – Bewertung (Score), Zustellung mit Markierung:**
5. **Rate-Limit**: 5 Sendungen pro IP-Hash pro Stunde, 20 pro Tag; 3 pro E-Mail-Hash pro Tag. Speicher: Upstash Redis (Vercel Marketplace) über die REST-Schnittstelle (`INCR`/`EXPIRE`, `SET NX EX` per `fetch`, ohne `@upstash/ratelimit` – zwei Befehle rechtfertigen keine Abhängigkeit); lokal/Preview In-Memory-Fallback. **Jeder Speicherfehler führt zu „zustellen", nie zum Verwerfen.** IP nur als SHA-256-Hash mit Tagesschlüssel speichern, nie im Klartext.
6. **Duplikat**: Hash aus E-Mail + Nachricht innerhalb von 10 Minuten bereits gesendet → keine zweite Mail, aber Erfolgsantwort (Doppelklick, Zurück-Taste).
7. **Inhaltsheuristik** (jeweils Punkte): Nachricht enthält 1–2 URLs, Wegwerf-Domain (kleine Liste in `lib/forms/disposable-domains.ts`), Name gleich E-Mail-Localpart, Mischung aus lateinischen und kyrillischen Zeichen, Golfanlage aus nur einem Wort ohne Vokal, Absendezeit unter 8 Sekunden. Ab Schwelle: Betreff-Präfix `[Prüfen]`, Score in der Mail-Fußzeile, damit Fred es erkennt. Nichts wird deswegen verworfen.
8. **Logging** ohne personenbezogene Daten: `contact.accepted | contact.flagged(score, gründe) | contact.rejected(grund)`. Nach zwei Wochen Live-Betrieb die Gründe auswerten und Schwellen nachziehen.

**Stufe C – Eskalation nur bei Bedarf:** Wenn trotz A und B Spam durchkommt, **Cloudflare Turnstile** im unsichtbaren Modus (privatsphärenfreundlicher als reCAPTCHA, kein Bilderrätsel). Vorher Datenschutzerklärung ergänzen (Cloudflare als Dienst) und prüfen, ob es als technisch erforderlich ohne Einwilligung läuft – konservativ: unter „Notwendig" mit Begründung im Consent-Dialog. Nicht ohne konkreten Anlass einbauen.

**Sicherheit im Versand:**
- Alle Nutzerwerte im HTML-Teil der Mail **escapen** (kein HTML aus dem Formular übernehmen).
- `replyTo` nur setzen, wenn die E-Mail das zod-Schema besteht (kein Header-Injection).
- Kein Nutzerinhalt im Betreff außer Name und Anlage, beide auf 60 Zeichen gekürzt und von Zeilenumbrüchen befreit.
- `SENDGRID_API_KEY` nur serverseitig; im Client-Bundle darf der Name nicht auftauchen (Build-Check greppt `dist`). Gelesen wird er ausschließlich in `lib/mail/sendgrid.ts`.
- Steuerzeichen: Zeilenumbrüche sind **nur in der Nachricht** erlaubt. In einem einzeiligen Feld sind sie das klassische Header-Injection-Signal und führen zum stillen Verwerfen.

## Zustände und Rückmeldungen (einheitlich, aus dem UI-Kit)

**Feldfehler** – inline unter dem Feld (`.fmsg e` mit Icon 14 px), Feld bekommt `.inp.err`, `aria-invalid="true"`, `aria-describedby` auf die Meldung. Fehler erscheinen **beim Verlassen des Feldes** (blur) und beim Absenden, nicht bei jedem Tastendruck; nach Korrektur verschwinden sie sofort. Erfolgszustand `.inp.ok` nur für Felder mit Format (E-Mail, Telefon), nicht für Freitext.

**Formularfehler** – ein Inline-Alert `.alert.err` **über** dem Button mit `role="alert"`, Fokus springt auf das erste fehlerhafte Feld. Eingaben bleiben erhalten. Nie technische Details.

**Zentraler Textkatalog** `lib/forms/messages.ts` – jede Meldung genau einmal definiert, Sie-Form, ein Satz, benennt die Lösung:

| Schlüssel | Text |
|---|---|
| `required` | Bitte füllen Sie dieses Feld aus. |
| `club.short` | Bitte geben Sie den Namen Ihrer Golfanlage an. |
| `name.short` | Bitte geben Sie Ihren Namen an. |
| `email.invalid` | Bitte geben Sie eine vollständige E-Mail-Adresse ein. |
| `phone.invalid` | Bitte prüfen Sie die Telefonnummer – nur Ziffern, Leerzeichen, + und /. |
| `message.long` | Ihre Nachricht ist etwas zu lang – bitte kürzen Sie sie auf 3000 Zeichen. |
| `consent.required` | Bitte bestätigen Sie die Datenschutzerklärung, damit wir Ihre Anfrage bearbeiten dürfen. |
| `vorname` *(0025)* | Bitte geben Sie Ihren Vornamen an. |
| `nachname` *(0025)* | Bitte geben Sie Ihren Nachnamen an. |
| `message` *(0025)* | Bitte schreiben Sie uns kurz, worum es geht. |
| `tooLong` *(0025)* | Diese Angabe ist zu lang – bitte kürzen Sie sie. |
| `form.invalid` | Das Formular konnte nicht gesendet werden. Bitte prüfen Sie die markierten Felder – oder rufen Sie uns direkt an. |
| `form.network` | Die Verbindung wurde unterbrochen. Ihre Eingaben sind noch da – bitte versuchen Sie es noch einmal. |
| `form.server` | Das hat leider nicht geklappt. Schreiben Sie uns direkt an info@golfnext.de oder rufen Sie an: 0175 5951839. |
| `form.ratelimit` | Sie haben in kurzer Zeit mehrere Anfragen gesendet. Bitte warten Sie einen Moment – oder schreiben Sie an info@golfnext.de. |
| `form.success.title` | Vielen Dank – Ihre Anfrage ist eingegangen. |
| `form.success.text` | Fred Hoffmann meldet sich innerhalb eines Werktags persönlich. |

Dieselben Texte gelten für zod (serverseitig) und die Blur-Validierung (clientseitig) – eine Quelle, kein Drift.

**Erfolg** – das Formular wird durch `.alert.ok` mit Titel und Text ersetzt (keine Weiterleitung, kein Toast). Einen Folge-Link zur Terminwahl gibt es seit dem 10.09.2026 nicht mehr; er hätte auf das gerade abgeschickte Formular zurückgezeigt. Fokus auf den Alert (`tabindex=-1`, programmatischer Fokus), Screenreader lesen ihn über `role="status"`.

## Ladezustand

- `useFormStatus().pending` → Button bekommt `.btn.loading` (Spinner 16 px aus dem UI-Kit, Text unsichtbar aber im DOM), `aria-busy="true"` am `<form>`, alle Felder `disabled` (kein zweites Absenden, keine Änderungen während des Versands). Kein Vollbild-Overlay, kein Seitenwechsel.
- Mindestanzeige 400 ms, damit der Spinner bei schnellen Antworten nicht flackert (`useMinPending`-Helfer).
- Ohne JavaScript: normaler POST, Server rendert Ergebnis auf derselben Seite. Muss funktionieren (QA prüft es).
- Bei `prefers-reduced-motion`: Spinner steht still als Ring; Zustand über Text „Wird gesendet …" im `sr-only`.

Für Ladezustände außerhalb von Formularen (Skeletons, Leerzustände, Streaming) gilt `docs/08-zustaende-und-feedback.md`.

## SendGrid

- Paket `@sendgrid/mail`. Key aus `SENDGRID_API_KEY`. Absender `SENDGRID_FROM_EMAIL` muss verifiziert sein: **Domain Authentication für golfnext.de** (CNAME-Einträge) ist der saubere Weg; bis dahin Single Sender `info@golfnext.de`.
- `replyTo` = validierte Absenderadresse, damit Fred direkt antworten kann.
- Betreff `[Website] Anfrage von <Name> – <Anlage>`, bei Verdacht `[Prüfen] …`. Text- und HTML-Version; Felder als Tabelle; Zeitstempel; **keine IP-Adresse** in der Mail.
- Tracking aus: `trackingSettings: { clickTracking:{enable:false}, openTracking:{enable:false} }`. Kategorien `['website','kontakt']`.
- Mock-Transport, wenn `SENDGRID_API_KEY` leer: schreibt JSON nach `test-results/mail/` (Tests, lokal).
- Bestätigungsmail an Absender (empfohlen): Titel/Text wie `form.success`, ohne Marketing, ohne Tracking, mit Impressum-Fußzeile. Nur, wenn der Score nicht „verdächtig" ist (kein Backscatter an gefälschte Adressen).

## Datenschutz am Formular

Unter dem Button, 13.5 px, `muted`: „Mit dem Absenden stimmen Sie zu, dass wir Ihre Angaben zur Bearbeitung Ihrer Anfrage verarbeiten. Die Daten werden per E-Mail an uns übermittelt (Versand über SendGrid) und nach Erledigung gelöscht. Details in der [Datenschutzerklärung](/datenschutz)." Die Einwilligungs-Checkbox bleibt zusätzlich Pflicht (UI-Kit).

## Umgebungsvariablen

`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `SENDGRID_FROM_NAME`, `CONTACT_TO_EMAIL`, **`FORM_SIGNING_SECRET`** (32+ Zufallszeichen, pro Umgebung verschieden), `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (optional, sonst In-Memory).

Nur für Testläufe, **nie in Production**: `MAIL_TRANSPORT=mock` (erzwingt den Mock-Transport) und `RATELIMIT_STORE=memory` (erzwingt den In-Memory-Speicher). `playwright.config.ts` setzt beide selbst.

## Tests

- **Unit**: zod-Schema gültig/ungültig je Feld; Honeypot gefüllt → `{ok:true}` ohne Mail; Zeitstempel fehlt / falsch signiert / 2 s alt / 3 h alt → verworfen; Duplikat → eine Mail; Heuristik-Score-Fälle → Betreff-Tag; Rate-Limit-Überschreitung → `form.ratelimit`.
- **E2E** (Mock-Transport): gültige Sendung → Erfolgsalert sichtbar, Fokus darauf, JSON in `test-results/mail/` mit escaped Inhalt; ungültige E-Mail → Inline-Fehler mit `aria-invalid`, Fokus auf dem Feld, Eingaben erhalten; Absenden ohne JS (`javaScriptEnabled:false`) → Ergebnis auf derselben Seite; Button während Versand `aria-busy`, kein Doppelversand bei zwei schnellen Klicks.
- **Riegel gegen echte Mails aus Testläufen** (0025): `playwright.config.ts` startet den Server **immer selbst** (`reuseExistingServer: false`) und dabei mit `MAIL_TRANSPORT=mock` und `RATELIMIT_STORE=memory`. Ein laufender Dev-Server wird bewusst NICHT wiederverwendet – die Umgebung würde sonst gar nicht greifen. Ist Port 3000 belegt, bricht der Lauf ab; dann den Dev-Server beenden. Ohne diese beiden Werte verschickt ein Testlauf auf einem Rechner mit gefüllter `.env.local` **echte Mails an `info@golfnext.de`** und schreibt Zähler in die gemeinsame Redis-Datenbank. In Production dürfen sie nie gesetzt sein.
- **Manuell vor Launch**: echte Testmail von Production an `info@golfnext.de`, Antwort per Reply-To, Spam-Ordner-Check (SPF/DKIM über Domain Authentication), Bestätigungsmail beim Absender.
