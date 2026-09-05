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

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

// Preview-Deployments dürfen nicht indexiert werden (docs/01-architektur.md).
const isPreview = process.env.VERCEL_ENV === "preview";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          ...(isPreview ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
