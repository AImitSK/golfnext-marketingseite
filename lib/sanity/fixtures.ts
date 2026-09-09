import type {
  BlockContent,
  CATEGORIES_WITH_COUNT_QUERY_RESULT,
  FAQS_BY_TOPIC_QUERY_RESULT,
  POSTS_QUERY_RESULT,
  POST_BY_SLUG_QUERY_RESULT,
} from "@/sanity.types";

/**
 * Testdaten an Stelle von Sanity – **nur für Playwright** (Briefing 0027, Aufgabe 8).
 *
 * Warum es das gibt: Die Praxis-Routen holen ihre Inhalte serverseitig. Playwright
 * kann diese Abfragen im Browser nicht abfangen (sie laufen im Node-Prozess), und im
 * echten Dataset dürfen für Tests **keine Inhalte angelegt werden** (Briefing 0027,
 * „Was du NICHT tust"). Deshalb der Weg über einen Test-Fetch: Steht
 * `SANITY_SOURCE=fixtures`, antwortet `sanityFetch` aus dieser Datei statt aus Sanity.
 * Gesetzt wird die Variable ausschließlich in `playwright.config.ts`, genauso wie
 * `MAIL_TRANSPORT=mock` (Briefing 0025).
 *
 * **Das hier ist kein Websiteinhalt.** Alle Texte sind erkennbare Platzhalter
 * („Beispielartikel 1", „Platzhaltertext …"). Die neun Beispielartikel aus den Mocks
 * 3.9a/3.9b stehen bewusst NICHT hier – auch nicht gekürzt (Briefing 0027).
 *
 * Zusammensetzung, damit die Prüfungen etwas zu prüfen haben:
 * - **12 Artikel** – mehr als die neun je Seite, damit „Ältere Beiträge" erscheint.
 * - **drei Rubriken**, eine davon **ohne Artikel** – sie darf in der Filterleiste
 *   nicht auftauchen.
 * - Artikel 1 hat einen Fließtext mit **drei `h2`** (Inhaltsverzeichnis erscheint),
 *   Liste, Zitat, Hinweiskasten und CTA; Artikel 2 hat **zwei `h2`** (Kasten entfällt).
 * - **Kein Artikel hat ein Titelbild** – so prüft der Testlauf immer den
 *   beschrifteten `Shot`-Platzhalter statt eines Bildes von cdn.sanity.io.
 * - **Zwei Autoren, einer mit Porträt und einer ohne** – damit sind beide Zweige der
 *   Meta-Zeile abgedeckt: das Foto und der Initialenkreis als Rückfall. Welcher
 *   Artikel welchen Autor hat, sagen `FIXTURE_ARTIKEL_AUTOR_MIT_BILD` und
 *   `FIXTURE_ARTIKEL_AUTOR_OHNE_BILD`.
 *
 * - **drei FAQs zum Thema `pakete`** (Briefing 0030). Sie stehen hier **absichtlich in
 *   falscher Reihenfolge** im Array – geordnet wird nach `order`, wie in GROQ. Die
 *   zweite Antwort trägt `strong`, einen internen und einen externen Link sowie einen
 *   zweiten Absatz; damit ist alles abgedeckt, was `simpleBlockContent` zulässt. **Der
 *   Wortlaut der sieben echten Pakete-FAQs steht bewusst NICHT hier** – er liegt in
 *   Sanity und nirgends sonst.
 *
 * Daneben gibt es den **leeren Bestand** `SANITY_SOURCE=fixtures-leer` (Briefing
 * 0029): dieselben Rubriken, aber kein einziger Artikel und (seit Briefing 0030) auch
 * keine FAQ. Er prüft die Seiten in dem Zustand, in dem sie beim Abnehmen stehen – und
 * damit, dass die Artikel-Teaser auf `/` und `/ueber-golfnext` ohne Artikel und der
 * FAQ-Abschnitt auf `/pakete` ohne FAQs vollständig entfallen.
 */

/**
 * Ist der Test-Fetch aktiv? Niemals auf Vercel, egal was in der Umgebung steht.
 *
 * Zwei Testbestände (Briefing 0029): `fixtures` liefert die zwölf Beispielartikel,
 * `fixtures-leer` einen Bestand **ohne einen einzigen Artikel**. Der leere Bestand
 * prüft, was beim Abnehmen der Normalfall ist – ein Dataset, in dem Fred noch nichts
 * veröffentlicht hat: Dann entfallen der Praxis-Abschnitt der Startseite und der
 * Wissen-Abschnitt auf `/ueber-golfnext` vollständig.
 */
export function fixturesAktiv(): boolean {
  return (
    (process.env.SANITY_SOURCE === "fixtures" || process.env.SANITY_SOURCE === "fixtures-leer") &&
    !process.env.VERCEL
  );
}

/**
 * Der leere Testbestand (`SANITY_SOURCE=fixtures-leer`): kein Artikel und **keine
 * FAQ** – das Studio, wie es beim Abnehmen dasteht. Seit Briefing 0030 hängt auch
 * der FAQ-Abschnitt auf `/pakete` daran; ohne FAQs muss er vollständig entfallen.
 */
function leererBestand(): boolean {
  return process.env.SANITY_SOURCE === "fixtures-leer";
}

export const FIXTURE_RUBRIKEN = [
  { title: "Rubrik A", slug: "rubrik-a", anzahl: 11 },
  { title: "Rubrik B", slug: "rubrik-b", anzahl: 1 },
  // Ohne Artikel – darf in der Filterleiste nicht erscheinen.
  { title: "Rubrik C", slug: "rubrik-c", anzahl: 0 },
] as const;

/** Änderungsdatum aller Testdokumente – fest, damit die Sitemap prüfbar bleibt. */
export const FIXTURE_STAND = "2026-09-01T10:00:00Z";

/** Slug des Artikels mit vollständigem Fließtext (Inhaltsverzeichnis, Kasten, CTA). */
export const FIXTURE_ARTIKEL_SLUG = "beispielartikel-1";
/** Slug des Artikels mit nur zwei Überschriften (kein Inhaltsverzeichnis). */
export const FIXTURE_ARTIKEL_KURZ_SLUG = "beispielartikel-2";

/**
 * Ein Porträt, wie es aus Sanity käme. Die Kennung ist erfunden – in der Testumgebung
 * liefert `urlForImage` ohnehin eine Datei aus `public/` statt `cdn.sanity.io`
 * (siehe `lib/sanity/image.ts`).
 */
const PORTRAIT = {
  alt: "Porträt des Autors",
  asset: {
    _id: "image-fixture-portrait-400x400-webp",
    url: "https://cdn.sanity.io/images/fixture/portrait.webp",
    // `dimensions` holt nur POST_BY_SLUG_QUERY; die Kartenabfrage kommt ohne aus.
    // Dasselbe Objekt bedient beide, deshalb steht das Feld hier mit.
    metadata: { lqip: null, dimensions: null },
  },
};

/**
 * Zwei Autoren, **einer mit Porträt und einer ohne** – so prüft der Testlauf beide
 * Zweige der Meta-Zeile: das Bild und den Initialenkreis als Rückfall.
 */
const AUTOREN = [
  {
    name: "Vorname Nachname",
    slug: "vorname-nachname",
    role: "Rolle des Autors",
    image: PORTRAIT,
  },
  { name: "Zweite Person", slug: "zweite-person", role: "Zweite Rolle", image: null },
];

/**
 * Welcher Artikel welchen Autor trägt – die Zuordnung läuft über `nummer % 2`, das
 * wollen Tests nicht nachrechnen müssen.
 */
export const FIXTURE_ARTIKEL_AUTOR_MIT_BILD = "beispielartikel-2";
export const FIXTURE_ARTIKEL_AUTOR_OHNE_BILD = "beispielartikel-1";

function karte(nummer: number): POSTS_QUERY_RESULT[number] {
  const rubrik = nummer === 12 ? FIXTURE_RUBRIKEN[1] : FIXTURE_RUBRIKEN[0];
  const autor = AUTOREN[nummer % 2]!;
  return {
    _id: `beispiel-${nummer}`,
    title: `Beispielartikel ${nummer}`,
    slug: `beispielartikel-${nummer}`,
    excerpt: `Platzhaltertext für den Anriss von Beispielartikel ${nummer}.`,
    // Absteigend nach Datum – der zwölfte ist der älteste.
    publishedAt: `2026-0${nummer < 10 ? "9" : "8"}-${String(28 - nummer).padStart(2, "0")}T09:00:00.000Z`,
    mainImage: null,
    category: { title: rubrik.title, slug: rubrik.slug, audience: "clubbetrieb" },
    author: { name: autor.name, slug: autor.slug, image: autor.image },
  };
}

const ALLE_KARTEN: POSTS_QUERY_RESULT = Array.from({ length: 12 }, (_, i) => karte(i + 1));

function absatz(key: string, text: string): BlockContent[number] {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    children: [{ _type: "span", _key: `${key}-s`, text }],
  };
}

function ueberschrift(key: string, text: string): BlockContent[number] {
  return {
    _type: "block",
    _key: key,
    style: "h2",
    children: [{ _type: "span", _key: `${key}-s`, text }],
  };
}

const LANGER_TEXT: BlockContent = [
  absatz("p0", "Platzhaltertext für den Einstieg in den Beispielartikel."),
  ueberschrift("h1", "Erster Abschnitt"),
  absatz("p1", "Platzhaltertext im ersten Abschnitt des Beispielartikels."),
  ueberschrift("h2", "Zweiter Abschnitt"),
  absatz("p2", "Platzhaltertext im zweiten Abschnitt des Beispielartikels."),
  {
    _type: "block",
    _key: "q1",
    style: "blockquote",
    children: [{ _type: "span", _key: "q1-s", text: "Platzhalter für ein Zitat." }],
  },
  ueberschrift("h3", "Dritter Abschnitt"),
  {
    _type: "block",
    _key: "l1",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: "l1-s", text: "Erster Listenpunkt als Platzhalter." }],
  },
  {
    _type: "callout",
    _key: "cal1",
    tone: "hinweis",
    text: [absatz("cal1-p", "Platzhaltertext im Hinweiskasten.")],
  },
  { _type: "cta", _key: "cta1", label: "Beispiel-Button", target: "erstgespraech" },
] as BlockContent;

const KURZER_TEXT: BlockContent = [
  absatz("k0", "Platzhaltertext für den kurzen Beispielartikel."),
  ueberschrift("kh1", "Erster Abschnitt"),
  absatz("k1", "Platzhaltertext im ersten Abschnitt."),
  ueberschrift("kh2", "Zweiter Abschnitt"),
  absatz("k2", "Platzhaltertext im zweiten Abschnitt."),
];

function artikel(nummer: number, body: BlockContent): NonNullable<POST_BY_SLUG_QUERY_RESULT> {
  const k = ALLE_KARTEN[nummer - 1]!;
  const autor = AUTOREN[nummer % 2]!;
  return {
    _id: k._id,
    title: k.title,
    slug: k.slug,
    excerpt: k.excerpt,
    publishedAt: k.publishedAt,
    body,
    mainImage: null,
    category: {
      title: k.category.title,
      slug: k.category.slug,
      description: "Platzhalterbeschreibung der Rubrik.",
      audience: "clubbetrieb",
    },
    author: {
      name: autor.name,
      slug: autor.slug,
      role: autor.role,
      bio: "Platzhaltertext für die Kurzbiografie des Autors.",
      linkedin: null,
      image: autor.image,
    },
    related: null,
    seo: null,
  };
}

/**
 * Alle zwölf Artikel sind auch einzeln abrufbar – sonst zeigte die Liste Karten,
 * deren Ziel es nicht gibt, und Nexts Vorabruf holte sich reihenweise 404.
 * Nummer 1 trägt den langen Fließtext (Inhaltsverzeichnis, Kasten, CTA), alle
 * anderen den kurzen (zwei Überschriften, also kein Inhaltsverzeichnis).
 */
const ARTIKEL: Record<string, NonNullable<POST_BY_SLUG_QUERY_RESULT>> = Object.fromEntries(
  ALLE_KARTEN.map((k, i) => [k.slug, artikel(i + 1, i === 0 ? LANGER_TEXT : KURZER_TEXT)]),
);

const RUBRIKEN: CATEGORIES_WITH_COUNT_QUERY_RESULT = FIXTURE_RUBRIKEN.map((r, i) => ({
  _id: `rubrik-${i}`,
  title: r.title,
  slug: r.slug,
  description: "Platzhalterbeschreibung der Rubrik.",
  audience: "clubbetrieb",
  order: i,
  anzahl: r.anzahl,
}));

/**
 * FAQ-Testdaten zum Thema `pakete` (Briefing 0030, Aufgabe 5).
 *
 * **Absichtlich in falscher Reihenfolge** notiert (3, 1, 2): Die Seite zeigt sie nach
 * `order` – genau das prüft `tests/e2e/pakete.spec.ts`. Käme die Reihenfolge aus dem
 * Array, fiele der Test durch, und das soll er.
 *
 * Kein Websiteinhalt: erkennbare Platzhalter. Der Wortlaut der sieben echten
 * Pakete-FAQs liegt in Sanity und wird hier nicht wiederholt – eine zweite Fassung
 * im Repo ist genau das, was Briefing 0030 beendet.
 */
const FAQS: FAQS_BY_TOPIC_QUERY_RESULT = [
  {
    _id: "faq-fixture-3",
    question: "Beispielfrage 3 als Platzhalter?",
    topic: "pakete",
    order: 3,
    answer: [
      {
        _type: "block",
        _key: "f3",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: "f3-s", marks: [], text: "Platzhalterantwort drei." }],
      },
    ],
  },
  {
    _id: "faq-fixture-1",
    question: "Beispielfrage 1 als Platzhalter?",
    topic: "pakete",
    order: 1,
    answer: [
      {
        _type: "block",
        _key: "f1",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: "f1-s", marks: [], text: "Platzhalterantwort eins." }],
      },
    ],
  },
  {
    // Deckt alles ab, was `simpleBlockContent` zulässt: `strong`, ein interner und ein
    // externer Link (der externe muss `rel="noopener noreferrer"` bekommen) und ein
    // zweiter Absatz.
    _id: "faq-fixture-2",
    question: "Beispielfrage 2 als Platzhalter?",
    topic: "pakete",
    order: 2,
    answer: [
      {
        _type: "block",
        _key: "f2",
        style: "normal",
        markDefs: [
          { _type: "link", _key: "f2-intern", href: "/pakete" },
          { _type: "link", _key: "f2-extern", href: "https://example.org", openInNewTab: true },
        ],
        children: [
          { _type: "span", _key: "f2-a", marks: ["strong"], text: "Fett hervorgehoben." },
          { _type: "span", _key: "f2-b", marks: [], text: " Platzhalterantwort zwei mit " },
          { _type: "span", _key: "f2-c", marks: ["f2-intern"], text: "internem Link" },
          { _type: "span", _key: "f2-d", marks: [], text: " und " },
          { _type: "span", _key: "f2-e", marks: ["f2-extern"], text: "externem Link" },
          { _type: "span", _key: "f2-f", marks: [], text: "." },
        ],
      },
      {
        _type: "block",
        _key: "f2b",
        style: "normal",
        markDefs: [],
        children: [
          { _type: "span", _key: "f2b-s", marks: [], text: "Zweiter Absatz derselben Antwort." },
        ],
      },
    ],
  },
];

/** Die Test-FAQs in der Reihenfolge, in der `/pakete` sie zeigen muss (nach `order`). */
const FAQS_NACH_ORDER = [...FAQS].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/** Fragen des Themas `pakete`, nach `order` – die erwartete Reihenfolge auf der Seite. */
export const FIXTURE_FAQ_FRAGEN = FAQS_NACH_ORDER.map((f) => f.question);

/**
 * Die Antworten als sichtbarer Text, ein Eintrag je Absatz, in derselben Reihenfolge
 * wie `FIXTURE_FAQ_FRAGEN` – so, wie sie im Browser zu lesen sind.
 */
export const FIXTURE_FAQ_ANTWORTEN = FAQS_NACH_ORDER.map((f) =>
  f.answer.map((block) => (block.children ?? []).map((span) => span.text ?? "").join("")),
);

/**
 * Dieselben Antworten, aber in ihren einzelnen Textstücken (Spans). Im HTML stehen
 * ausgezeichnete Stellen in eigenen Elementen (`<strong>`, `<a>`) – ein Absatz ist dort
 * also kein zusammenhängender Textblock. Für die Prüfung „steht im Server-HTML" ist
 * deshalb das Stück die richtige Einheit, nicht der Absatz.
 */
export const FIXTURE_FAQ_ANTWORT_TEILE = FAQS_NACH_ORDER.flatMap((f) =>
  f.answer.flatMap((block) => (block.children ?? []).map((span) => span.text ?? "")),
);

/**
 * Slug-Listen für den Proxy (`lib/sanity/slugs.ts`). Im leeren Bestand gibt es keine
 * Artikel – die Rubriken bleiben, sie stehen im Studio unabhängig von Artikeln.
 */
export function fixtureSlugs() {
  return {
    artikel: leererBestand() ? [] : Object.keys(ARTIKEL),
    rubriken: FIXTURE_RUBRIKEN.map((r) => r.slug),
  };
}

/**
 * Antwort auf eine Abfrage. Erkannt wird sie am Abfragetext – die Abfragen liegen als
 * Zeichenketten vor, ein Vergleich auf ihre kennzeichnenden Bestandteile genügt.
 * Unbekannte Abfragen liefern `null`; die Praxis-Routen und `/pakete` stellen keine
 * anderen.
 */
export function fixtureFuer(query: string, params?: Record<string, unknown>): unknown {
  const leer = leererBestand();

  // Die Einstellungen (`siteSettings`) gibt es im Testbestand nicht: Die
  // `Organization`-Daten fallen dann auf das Impressum zurück, genau wie heute im
  // echten Dataset. Der Zweig steht hier, damit das eine Entscheidung ist und kein
  // Durchfallen bis zum `return null` am Ende.
  if (query.includes('_id == "siteSettings"')) return null;

  // `SITEMAP_QUERY` (Briefing 0034) – steht VOR den Zweigen für `post` und
  // `category`, sonst würde einer davon greifen und Artikelkarten ohne
  // `_updatedAt` liefern. Das Datum ist fest: Ein wanderndes „jetzt" machte die
  // Sitemap-Prüfung von der Uhr abhängig.
  if (query.includes("_updatedAt")) {
    return {
      artikel: (leer ? [] : Object.keys(ARTIKEL)).map((slug) => ({
        slug,
        _updatedAt: FIXTURE_STAND,
      })),
      rubriken: FIXTURE_RUBRIKEN.map((r) => ({ slug: r.slug, _updatedAt: FIXTURE_STAND })),
    };
  }

  if (query.includes('_type == "faq"')) {
    if (leer) return [];
    // Sortierung wie in GROQ (`order asc, question asc`) – im Testbestand liegen die
    // Fragen absichtlich unsortiert, damit die Reihenfolge geprüft wird und nicht
    // zufällig stimmt.
    return FAQS.filter((f) => f.topic === params?.topic).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.question.localeCompare(b.question),
    );
  }

  if (query.includes('_type == "category"')) {
    return leer ? RUBRIKEN.map((r) => ({ ...r, anzahl: 0 })) : RUBRIKEN;
  }

  if (query.includes("slug.current == $slug")) {
    return leer ? null : (ARTIKEL[String(params?.slug ?? "")] ?? null);
  }

  if (query.includes('_type == "post"')) {
    if (leer) return [];

    const rubrik = params?.rubrik;
    const karten =
      typeof rubrik === "string"
        ? ALLE_KARTEN.filter((k) => k.category.slug === rubrik)
        : ALLE_KARTEN;

    // `NEUESTE_POSTS_QUERY` schneidet in GROQ auf `$anzahl` zu – hier von Hand.
    const anzahl = params?.anzahl;
    return typeof anzahl === "number" ? karten.slice(0, anzahl) : karten;
  }

  return null;
}
