import { ContactForm } from "@/components/forms/ContactForm";
import { TextLink } from "@/components/ui/TextLink";
import { KONTAKT } from "@/config/site-structure";
import type { FormularData, SeitenspalteData } from "@/content/kontakt";
import { resolveCta } from "@/lib/links";
import styles from "./Formular.module.css";

/**
 * 2 · „Ihre Nachricht an GolfNext" (portiert aus 3.10-kontakt.html, `.kwrap`).
 *
 * Links die Formularkarte mit dem einzigen interaktiven Teil der Seite
 * (`ContactForm`, Client), rechts die klebende Seitenspalte: Fred mit Telefon und
 * E-Mail, der Rollen-Hinweis und der Verweis auf die Live-Demo.
 *
 * Kontaktdaten kommen aus `KONTAKT` (config/site-structure.ts), das Demo-Ziel aus
 * `lib/links.ts` – nichts hart kodiert. Das Porträt ist ein Platzhalter (Silhouette),
 * kein Stock- und kein KI-Bild.
 */

/** Silhouette im Porträt-Platzhalter, fix 28 px (Icon-Regel: nie ohne Größe). */
function PersonIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="9" r="3.4" />
      <path d="M4.8 20c1.5-3.4 4.2-5.1 7.2-5.1s5.7 1.7 7.2 5.1" />
    </svg>
  );
}

/** Hörer, fix 17 px. */
function PhoneIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z" />
    </svg>
  );
}

/** Briefumschlag, fix 17 px. */
function MailIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function Formular({
  headline,
  lead,
  formular,
  seitenspalte,
  ts,
  datenschutzHref,
}: {
  headline: string;
  lead: string;
  formular: FormularData;
  seitenspalte: SeitenspalteData;
  /** Signierter Zeitstempel für den Spam-Schutz, hier auf dem Server erzeugt. */
  ts: string;
  datenschutzHref: string;
}) {
  const telHref = `tel:${KONTAKT.telefon.replace(/\s+/g, "")}`;
  const buchung = resolveCta({ label: "", target: "erstgespraech" });

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h2 className={styles.h2}>{headline}</h2>
          <p className={styles.sub}>{lead}</p>
          <ContactForm
            ts={ts}
            texte={formular}
            datenschutzHref={datenschutzHref}
            // Der Folge-Link im Erfolgsalert nur, wenn es einen echten Buchungsweg
            // gibt – sonst zeigte er auf diese Seite zurück (Fallback aus lib/links).
            buchungHref={buchung === "/kontakt" ? undefined : buchung}
          />
        </div>

        <aside className={styles.side}>
          <div className={styles.person}>
            <span className={styles.avatar}>
              <PersonIcon />
            </span>
            <b className={styles.personName}>{KONTAKT.name}</b>
            <p className={styles.personRole}>{seitenspalte.rolleLang}</p>
            <div className={styles.contacts}>
              <a href={telHref}>
                <PhoneIcon />
                {KONTAKT.telefon}
              </a>
              <a href={`mailto:${KONTAKT.email}`}>
                <MailIcon />
                {KONTAKT.email}
              </a>
            </div>
            <p className={styles.when}>
              <i aria-hidden="true" />
              {seitenspalte.erreichbar}
            </p>
          </div>

          <div className={styles.rolebox}>
            <p className={styles.roleboxEyebrow}>{seitenspalte.rollenhinweis.eyebrow}</p>
            <b className={styles.roleboxHeadline}>{seitenspalte.rollenhinweis.headline}</b>
            <p>{seitenspalte.rollenhinweis.text}</p>
          </div>

          <div className={styles.altbox}>
            <b className={styles.altboxHeadline}>{seitenspalte.livedemo.headline}</b>
            <p>{seitenspalte.livedemo.text}</p>
            <TextLink href={resolveCta(seitenspalte.livedemo.cta)}>
              {seitenspalte.livedemo.cta.label}
            </TextLink>
          </div>
        </aside>
      </div>
    </section>
  );
}
