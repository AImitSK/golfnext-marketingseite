---
name: sendgrid-forms
description: Muster für DSGVO-konforme Formulare (Kontakt/Erstgespräch-Anfrage) mit Server Action, zod, zweistufigem Spam-Schutz ohne CAPTCHA, einheitlichen Fehlermeldungen, Ladezustand und Versand über SendGrid. Laden, wenn ein Formular, eine Server Action, E-Mail-Versand oder Formular-Feedback gebaut wird.
---

# Formulare mit SendGrid

Vollständige Spezifikation: `docs/06-formulare-sendgrid.md`. Zustände site-weit: `docs/08-zustaende-und-feedback.md`. Visuelle Vorlage: UI-Kit `docs/design-system/mocks/2.5-ui-kit.html`, Abschnitte 3 und 7.
Grundsatz: Formulare sind Server-Logik. Der Browser bekommt keinen API-Key, keine Empfängeradresse, keine Spam-Schwellen.

## Dateien

- `components/forms/ContactForm.tsx` – Client, `useActionState` + `useFormStatus`. Felder nach UI-Kit: Golfanlage*, Name*, E-Mail*, Telefon, Rolle (select), Wunschzeit (select), Interesse (radio), Anliegen (textarea), Einwilligung*, Honeypot `website`, signierter Zeitstempel `ts`.
- `app/actions/contact.ts` – `'use server'`: zod → Stufe A (Honeypot, Zeitstempel-Signatur 4 s–2 h, Payload-Anomalien → stilles `{ok:true}`) → Stufe B (Rate-Limit IP-/E-Mail-Hash, Duplikat 10 min, Heuristik-Score → Betreff-Tag `[Prüfen]`) → `sendMail()`.
- `lib/forms/schema.ts` (zod), `lib/forms/messages.ts` (alle Texte, eine Quelle für Client und Server), `lib/forms/spam.ts` (Signatur, Score), `lib/forms/ratelimit.ts` (Upstash, In-Memory-Fallback), `lib/forms/disposable-domains.ts`.
- `lib/mail/sendgrid.ts` – `@sendgrid/mail`, `replyTo` nur validiert, HTML **escaped**, Tracking aus, Mock-Transport ohne Key (`test-results/mail/*.json`).

## Zustände (verbindlich)

- Feldfehler bei blur und submit: `.inp.err` + `.fmsg e` + `aria-invalid` + `aria-describedby`. `.inp.ok` nur für E-Mail/Telefon.
- Formularfehler: `Alert err` (`role="alert"`) über dem Button, Fokus auf erstes fehlerhaftes Feld, Eingaben bleiben.
- Erfolg: `Alert ok` (`role="status"`) ersetzt das Formular, Fokus darauf. Kein Folge-Link – der Buchungsweg ist entfallen (10.09.2026).
- Laden: `.btn.loading` (Ring 16 px), `aria-busy` am Formular, Felder `disabled`, Mindestanzeige 400 ms, Timeout 10 s → `form.network`.
- Ohne JS: normaler POST, Ergebnis auf derselben Seite.

## Texte

Nur aus `lib/forms/messages.ts` (Katalog in `docs/06`). Sie-Form, ein Satz, mit Ausweg, keine Technik.

## Erstgespräch

CTA „Online-Erstgespräch vereinbaren" → `/kontakt` (über `resolveCta`). Es gibt keinen externen Buchungsweg mehr (10.09.2026) und kein eigenes Terminformular.

## Tests

Unit: Schema je Feld, Honeypot, Zeitstempel (fehlend/falsch/zu jung/zu alt), Duplikat, Score-Fälle, Rate-Limit. E2E mit Mock-Transport: Erfolg + Fokus, Feldfehler + Fokus, ohne JS, Doppelklick sendet einmal, `aria-busy`. Nie echte Mails aus Tests oder Preview an info@golfnext.de.
