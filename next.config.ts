import type { NextConfig } from "next";

/**
 * Content-Security-Policy zunächst als Report-Only (beobachten, nicht blockieren).
 * Sanity-CDN (Bilder) und Studio-Einbettung sind bereits berücksichtigt, damit die
 * Policy in späteren Phasen ohne Umbau scharf geschaltet werden kann.
 */
const cspReportOnly = [
  "default-src 'self'",
  // 'unsafe-inline'/'unsafe-eval': Next-Hydration und Studio; wird beim Scharfschalten via Nonce ersetzt
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

/**
 * Eigene, weitere Fassung NUR für `/studio` (Briefing 0026).
 *
 * Das eingebettete Sanity Studio braucht mehr als die öffentlichen Seiten:
 * - `https://core.sanity-cdn.com` – next-sanity lädt von dort `bridge.js`
 *   (Verbindung zum Sanity-Kern, siehe `next-sanity/studio`).
 * - Bilder und Assets von `cdn.sanity.io` und `*.sanity.io`, dazu die Avatare der
 *   angemeldeten Person (Google-Login, Gravatar, GitHub).
 * - `connect-src` zusätzlich zu den API-Hosts auch WebSockets – das Studio hört
 *   live auf Änderungen am Dataset.
 * - `worker-src blob:` – das Studio startet Web-Worker aus Blob-URLs.
 * - `frame-src` – Anmelde- und Vorschau-Rahmen von Sanity.
 * - `font-src` für `design-system-static.sanity.io`: Das Studio lädt seine
 *   Oberflächenschrift (Inter) von dort. Das betrifft **nur die Redaktions-
 *   oberfläche hinter dem Login**, nicht die Website – die öffentlichen Seiten
 *   hosten ihre Schriften weiterhin selbst (`next/font`, DSGVO).
 * - `unsafe-eval` steht schon in der öffentlichen Fassung; das Studio braucht es
 *   für seine Laufzeit weiterhin.
 *
 * Die öffentlichen Seiten behalten die strenge Fassung: Die erste Header-Regel
 * greift für alles AUSSER `/studio` (negatives Lookahead im `source`), die zweite
 * nur für `/studio` und seine Unterpfade. So wird nichts global aufgeweicht.
 */
const cspStudioReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://core.sanity-cdn.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://secure.gravatar.com",
  // Oberflächenschrift des Studios (design-system-static.sanity.io)
  "font-src 'self' data: https://*.sanity.io",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.sanity-cdn.com",
  "worker-src 'self' blob:",
  "frame-src 'self' https://*.sanity.io",
  "media-src 'self' data: blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const baseSecurityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
  ...baseSecurityHeaders,
];

const studioSecurityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: cspStudioReportOnly },
  ...baseSecurityHeaders,
  // `/studio` ist eine Systemroute (config/site-structure.ts) – nie indexieren.
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

// Preview-Deployments dürfen nicht indexiert werden (docs/01-architektur.md).
const isPreview = process.env.VERCEL_ENV === "preview";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Alles außer `/studio` – die öffentlichen Seiten behalten die strenge CSP.
        source: "/((?!studio).*)",
        headers: [
          ...securityHeaders,
          ...(isPreview ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
        ],
      },
      {
        source: "/studio/:path*",
        headers: studioSecurityHeaders,
      },
    ];
  },
};

export default nextConfig;
