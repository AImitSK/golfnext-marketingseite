"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact } from "@/app/actions/contact";
import { initialContactState, type ContactState } from "@/lib/forms/contact-state";
import { Alert } from "@/components/feedback/Alert";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import {
  KONTAKT_AUSWAHL_LEER,
  KONTAKT_ROLLEN,
  KONTAKT_THEMEN,
  type FormularData,
} from "@/content/kontakt";
import { formMessages, type FieldMessageKey } from "@/lib/forms/messages";
import {
  CONFIRMABLE_FIELDS,
  FIELD_ORDER,
  validateField,
  type FieldErrors,
  type FieldName,
  type FieldValues,
} from "@/lib/forms/schema";
import { Checkbox } from "./Checkbox";
import { Field } from "./Field";
import { FieldMessage } from "./FieldMessage";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import styles from "./ContactForm.module.css";

/**
 * Kontaktformular (Briefing 0025, Felder aus Mock 3.10, Mechanik aus docs/06).
 *
 * **Ohne JavaScript vollständig benutzbar.** Es ist ein normales `<form>` mit einer
 * Server Action: Der Browser sendet einen gewöhnlichen POST, der Server rendert das
 * Ergebnis auf derselben Seite, Eingaben bleiben erhalten (`values` aus der Action).
 * Alles Weitere ist Progressive Enhancement:
 *  - Blur-Validierung mit demselben Schema wie der Server (kein Drift),
 *  - Inline-Feldfehler, die nach der Korrektur sofort verschwinden,
 *  - `aria-busy` und Button-Ladezustand mit Mindestanzeige (400 ms),
 *  - Fokus auf das erste fehlerhafte Feld bzw. auf den Erfolgsalert.
 *
 * `noValidate` schaltet die Browser-Blasen ab, damit ausschließlich die Meldungen
 * aus `lib/forms/messages.ts` erscheinen – `required` bleibt für Screenreader und
 * den sichtbaren Pflichtstern gesetzt.
 *
 * Der Baustein enthält **keinen einzigen freien Meldungstext**: Feldmeldungen und
 * Alerts kommen aus dem Katalog, die Seitentexte aus `content/kontakt.ts`.
 */

/** Mindestanzeige des Ladezustands, damit der Ring bei schnellen Antworten nicht flackert. */
const MIN_PENDING_MS = 400;

/**
 * Nach zehn Sekunden ohne Antwort wird der Button freigegeben und `form.network`
 * angezeigt (docs/08 §2). Die Server Action lässt sich nicht abbrechen – kommt die
 * Antwort doch noch, gewinnt sie: Erfolg ersetzt das Formular, ein Serverfehler
 * ersetzt die Netzmeldung. Der Nutzer hängt so nie ohne Ausweg im Ladezustand fest.
 */
const TIMEOUT_MS = 10_000;

function serverErrorsOf(state: ContactState): FieldErrors {
  return state.status === "error" ? (state.fieldErrors ?? {}) : {};
}

function serverValuesOf(state: ContactState): FieldValues {
  return state.status === "error" ? (state.values ?? {}) : {};
}

/** Kurzform: aus einem Ereignis den Wert des auslösenden Feldes lesen. */
type ValueEvent = { currentTarget: { value: string } };

export function ContactForm({
  ts,
  texte,
  datenschutzHref,
  buchungHref,
}: {
  /** Signierter Zeitstempel, vom Server gerendert (Spam-Stufe A). */
  ts: string;
  texte: FormularData;
  /**
   * Ziel der Einwilligung, aufgelöst über `internalHref`. Solange `/datenschutz`
   * nicht `live` ist (Masterplan 5.2), kommt hier `#` an – dann steht das Wort als
   * Text statt als Link, genau wie in der Anschrift und in der Bodenleiste des
   * Footers. Ein Link, der nichts tut, ist für Tastatur und Screenreader ein toter
   * Bedienpunkt (Briefing 0022). Der Link erscheint von selbst, sobald die Route
   * gebaut ist – ohne Codeänderung. Der Wortlaut bleibt in beiden Fällen gleich.
   */
  datenschutzHref: string;
  /** Buchungsweg für den Folge-Link im Erfolgsalert. */
  buchungHref?: string;
}) {
  const [state, formAction, isPending] = useActionState(submitContact, initialContactState);
  // Mindestanzeige: Der Ladezustand bleibt nach dem Absenden mindestens 400 ms
  // stehen, damit der Ring bei einer schnellen Antwort nicht kurz aufblitzt
  // (docs/08 §2). Gestartet wird er im Absende-Ereignis – ohne JavaScript gibt es
  // weder das Ereignis noch einen Ladezustand, und das Formular sendet trotzdem.
  const [mindestAnzeige, setMindestAnzeige] = useState(false);
  const [zeitueberschreitung, setZeitueberschreitung] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const loading = (isPending || mindestAnzeige) && !zeitueberschreitung;

  // `null` = im Browser geprüft und in Ordnung (schlägt eine ältere Servermeldung),
  // ein Schlüssel = Fehler, `undefined` = noch nicht geprüft (Servermeldung gilt).
  const [geprueft, setGeprueft] = useState<Partial<Record<FieldName, FieldMessageKey | null>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const serverErrors = serverErrorsOf(state);
  const values = serverValuesOf(state);

  const errorOf = (field: FieldName): FieldMessageKey | undefined => {
    const local = geprueft[field];
    if (local !== undefined) return local ?? undefined;
    return serverErrors[field];
  };

  const check = (field: FieldName, value: string) =>
    setGeprueft((prev) => ({ ...prev, [field]: validateField(field, value) ?? null }));

  /** Beim Verlassen prüfen (docs/06: nicht bei jedem Tastendruck). */
  const handleBlur = (field: FieldName) => (event: ValueEvent) =>
    check(field, event.currentTarget.value);

  /** Während des Tippens nur prüfen, wenn gerade ein Fehler steht – er soll sofort weg. */
  const handleInput = (field: FieldName) => (event: ValueEvent) => {
    if (errorOf(field)) check(field, event.currentTarget.value);
  };

  /** Zustand eines Feldes; E-Mail und Telefon dürfen eine Bestätigung tragen (docs/06). */
  const stateOf = (field: FieldName): "err" | "ok" | undefined => {
    if (errorOf(field)) return "err";
    if (CONFIRMABLE_FIELDS.includes(field) && geprueft[field] === null) return "ok";
    return undefined;
  };

  /** Meldung unter einem Feld: Fehler, Bestätigung (nur E-Mail) oder Hilfetext. */
  const messageOf = (
    field: FieldName,
    hint?: string,
  ): { message?: string; messageVariant?: "e" | "s" | "h" } => {
    const error = errorOf(field);
    if (error) return { message: formMessages.field[error], messageVariant: "e" };
    if (field === "email" && geprueft.email === null) {
      return { message: formMessages.field.emailOk, messageVariant: "s" };
    }
    if (hint) return { message: hint, messageVariant: "h" };
    return {};
  };

  // Fokusführung (docs/08 §5): nach einem Fehler auf das erste betroffene Feld, nach
  // Erfolg auf den Alert. Läuft nur mit JavaScript – ohne JS steht das Ergebnis
  // trotzdem auf der Seite, nur ohne Fokuswechsel.
  //
  // Erst NACH dem Ladezustand: Während des Versands sind alle Felder `disabled`,
  // und ein deaktiviertes Feld nimmt keinen Fokus an. Die Mindestanzeige des
  // Ladezustands (400 ms) läuft noch, wenn die Antwort schon da ist.
  // Ergebnis da: Die Zeitüberschreitung wird nicht mehr gebraucht.
  useEffect(() => {
    if (state.status !== "idle") clearTimeout(timeoutRef.current);
  }, [state]);

  useEffect(() => {
    if (loading) return;
    if (state.status === "ok") {
      successRef.current?.focus();
      return;
    }
    if (state.status !== "error") return;
    const errors = state.fieldErrors ?? {};
    const first = FIELD_ORDER.find((field) => errors[field]);
    const element = first ? formRef.current?.elements.namedItem(first) : null;
    if (element instanceof HTMLElement) element.focus();
  }, [state, loading]);

  if (state.status === "ok" && !mindestAnzeige) {
    // Erfolg ersetzt das Formular – keine Weiterleitung, kein Toast (docs/08 §3).
    // `!mindestAnzeige`: Die Mindestanzeige (400 ms) gilt für den GESAMTEN
    // Übergang, nicht nur für den Button. Antwortet der Server schneller, wurde
    // das Formular sonst ausgetauscht, bevor der Ladezustand überhaupt sichtbar
    // war – genau das Aufblitzen, das docs/08 §2 verhindern will.
    return (
      <div ref={successRef} tabIndex={-1} className={styles.successBox}>
        <Alert variant="ok" className={styles.success}>
          <span className={styles.successTitle}>{formMessages.form.success.title}</span>
          <span>{formMessages.form.success.text}</span>
        </Alert>
        {buchungHref ? (
          <p className={styles.successLink}>
            <TextLink href={buchungHref}>{formMessages.form.success.link}</TextLink>
          </p>
        ) : null}
      </div>
    );
  }

  // Kommt eine echte Antwort, gewinnt sie über die Netzmeldung der Zeitüberschreitung.
  const formError = state.status === "error" ? state.formError : zeitueberschreitung ? "network" : undefined;
  const felder = texte.felder;
  const einwilligungFehler = errorOf("einwilligung");

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => {
        setZeitueberschreitung(false);
        setMindestAnzeige(true);
        setTimeout(() => setMindestAnzeige(false), MIN_PENDING_MS);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setZeitueberschreitung(true), TIMEOUT_MS);
      }}
      noValidate
      aria-busy={loading || undefined}
      className={styles.form}
    >
      {/* Spam-Stufe A: Honigtopf und signierter Zeitstempel. Der Honigtopf ist
          sichtbar versteckt (nicht display:none), nicht fokussierbar und aus dem
          Accessibility-Baum genommen – Menschen sehen und hören ihn nie. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="ts" value={ts} />

      <div className={styles.row}>
        <Field
          id="vorname"
          label={felder.vorname.label}
          required
          className={styles.fld}
          state={stateOf("vorname")}
          {...messageOf("vorname")}
        >
          <Input
            name="vorname"
            type="text"
            autoComplete="given-name"
            placeholder={felder.vorname.placeholder}
            defaultValue={values.vorname}
            disabled={loading}
            className={styles.inp}
            onBlur={handleBlur("vorname")}
            onInput={handleInput("vorname")}
          />
        </Field>

        <Field
          id="nachname"
          label={felder.nachname.label}
          required
          className={styles.fld}
          state={stateOf("nachname")}
          {...messageOf("nachname")}
        >
          <Input
            name="nachname"
            type="text"
            autoComplete="family-name"
            placeholder={felder.nachname.placeholder}
            defaultValue={values.nachname}
            disabled={loading}
            className={styles.inp}
            onBlur={handleBlur("nachname")}
            onInput={handleInput("nachname")}
          />
        </Field>
      </div>

      {/* „Ich bin …" steht im Mock in einem abgesetzten Kasten samt Hilfetext. */}
      <Field
        id="rolle"
        label={felder.rolle.label}
        className={`${styles.fld} ${styles.role}`}
        message={felder.rolle.hint}
        messageVariant="h"
      >
        <Select name="rolle" defaultValue={values.rolle} disabled={loading} className={styles.inp}>
          {/* Neutrale Vorauswahl: ohne sie meldet jede Anfrage die erste Rolle,
              auch wenn niemand sie gewählt hat (Entscheidung Stefan, 07.09.2026). */}
          <option value="">{KONTAKT_AUSWAHL_LEER}</option>
          {KONTAKT_ROLLEN.map((rolle) => (
            <option key={rolle} value={rolle}>
              {rolle}
            </option>
          ))}
        </Select>
      </Field>

      <div className={styles.row}>
        <Field
          id="club"
          label={
            <>
              {felder.club.label} <span className={styles.opt}>{felder.club.optional}</span>
            </>
          }
          className={styles.fld}
          state={stateOf("club")}
          {...messageOf("club")}
        >
          <Input
            name="club"
            type="text"
            autoComplete="organization"
            placeholder={felder.club.placeholder}
            defaultValue={values.club}
            disabled={loading}
            className={styles.inp}
            onBlur={handleBlur("club")}
            onInput={handleInput("club")}
          />
        </Field>

        <Field id="thema" label={felder.thema.label} className={styles.fld}>
          <Select
            name="thema"
            defaultValue={values.thema}
            disabled={loading}
            className={styles.inp}
          >
            <option value="">{KONTAKT_AUSWAHL_LEER}</option>
            {KONTAKT_THEMEN.map((thema) => (
              <option key={thema} value={thema}>
                {thema}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className={styles.row}>
        <Field
          id="email"
          label={felder.email.label}
          required
          className={styles.fld}
          state={stateOf("email")}
          {...messageOf("email")}
        >
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder={felder.email.placeholder}
            defaultValue={values.email}
            disabled={loading}
            className={styles.inp}
            onBlur={handleBlur("email")}
            onInput={handleInput("email")}
          />
        </Field>

        <Field
          id="telefon"
          label={
            <>
              {felder.telefon.label} <span className={styles.opt}>{felder.telefon.optional}</span>
            </>
          }
          className={styles.fld}
          state={stateOf("telefon")}
          {...messageOf("telefon", felder.telefon.hint)}
        >
          <Input
            name="telefon"
            type="tel"
            autoComplete="tel"
            placeholder={felder.telefon.placeholder}
            defaultValue={values.telefon}
            disabled={loading}
            className={styles.inp}
            onBlur={handleBlur("telefon")}
            onInput={handleInput("telefon")}
          />
        </Field>
      </div>

      <Field
        id="nachricht"
        label={felder.nachricht.label}
        required
        className={styles.fld}
        state={stateOf("nachricht")}
        {...messageOf("nachricht")}
      >
        <Textarea
          name="nachricht"
          placeholder={felder.nachricht.placeholder}
          defaultValue={values.nachricht}
          disabled={loading}
          className={styles.ta}
          onBlur={handleBlur("nachricht")}
          onInput={handleInput("nachricht")}
        />
      </Field>

      <Checkbox
        name="einwilligung"
        value="on"
        required
        defaultChecked={values.einwilligung === "on"}
        disabled={loading}
        className={styles.check}
        aria-invalid={einwilligungFehler ? true : undefined}
        aria-describedby={einwilligungFehler ? "einwilligung-msg" : undefined}
        onChange={(event) => check("einwilligung", event.currentTarget.checked ? "on" : "")}
      >
        {texte.einwilligung.vorLink}
        {datenschutzHref === "#" ? (
          <span>{texte.einwilligung.link}</span>
        ) : (
          <a href={datenschutzHref}>{texte.einwilligung.link}</a>
        )}
        {texte.einwilligung.nachLink}
      </Checkbox>
      {einwilligungFehler ? (
        <div className={styles.checkMessage}>
          <FieldMessage variant="e" id="einwilligung-msg">
            {formMessages.field[einwilligungFehler]}
          </FieldMessage>
        </div>
      ) : null}

      {/* Formularfehler: ein Alert über dem Button, Fokus wandert (docs/08 §3). */}
      {formError ? (
        <Alert variant="err" className={styles.alert}>
          {formMessages.form[formError]}
        </Alert>
      ) : null}

      <div className={styles.submit}>
        <Button type="submit" variant="cta" arrow loading={loading}>
          {texte.absenden}
        </Button>
        <p className={styles.note}>{texte.note}</p>
      </div>
    </form>
  );
}
