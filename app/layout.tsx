import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

/**
 * Fonts über next/font/google – zur Build-Zeit heruntergeladen und selbst gehostet.
 * Es geht KEIN Laufzeit-Request an fonts.googleapis.com (DSGVO, LG München 2022).
 * Archivo = Headlines (--font-display), Inter = Fließtext (--font-sans), beide variabel.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.golfnext.de";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GolfNext",
    template: "%s | GolfNext",
  },
  description: "Marketing und Automation als Software-Layer für Golfanlagen.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${archivo.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
