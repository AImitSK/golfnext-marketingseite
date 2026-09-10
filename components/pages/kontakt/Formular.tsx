import Image from "next/image";
import { FRED } from "@/lib/people";
import { ContactForm } from "@/components/forms/ContactForm";
import { KONTAKT } from "@/config/site-structure";
import type { FormularData, SeitenspalteData } from "@/content/kontakt";
import styles from "./Formular.module.css";

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
          />
        </div>

        <aside className={styles.side}>
          <div className={styles.person}>
            <span className={styles.avatar}>
              {/* Echtes Porträt (seit 07.09.2026); Name und Rolle stehen darunter. */}
              <Image
                src={FRED.quadrat}
                alt=""
                width={64}
                height={64}
                className={styles.avatarFoto}
                unoptimized
              />
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
        </aside>
      </div>
    </section>
  );
}
