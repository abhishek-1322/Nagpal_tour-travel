import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const display = Outfit({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Nagpal Tour & Travels | Taxi Service in Ludhiana, Outstation & Airport Cabs",
  description:
    "Book Sedan, SUV and Innova taxis from Ludhiana for outstation trips, family tours, local rides and airport transfers across PAN India. 24/7 booking on WhatsApp.",
  keywords: ["taxi service Ludhiana", "outstation cab Ludhiana", "Ludhiana to Chandigarh taxi", "Ludhiana to Manali taxi", "Innova on rent Ludhiana", "airport taxi Ludhiana"],
  openGraph: {
    title: "Nagpal Tour & Travels",
    description: "Outstation, local and airport taxis from Ludhiana. Sedan, SUV and Innova. Book on WhatsApp 24/7.",
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
    images: [{ url: "/images/hero.jpg", width: 2000, height: 1333, alt: "Snow-capped mountains near Manali" }],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#062e2a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TaxiService",
  name: site.name,
  url: site.url,
  telephone: site.phoneE164,
  areaServed: "India",
  address: { "@type": "PostalAddress", streetAddress: "House No. 88, Apple Villa", addressLocality: "Ludhiana", addressRegion: "Punjab", addressCountry: "IN" },
  sameAs: [site.instagram, site.facebook],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
