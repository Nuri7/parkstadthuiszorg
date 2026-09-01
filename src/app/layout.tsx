import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { services } from "@/data/services";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://parkstadthuiszorg.nl"),
  title: "Thuiszorg in Parkstad — Heerlen, Kerkrade, Landgraaf | Parkstad Thuiszorg",
  description: "Wijkverpleging, persoonlijke verzorging en begeleiding aan huis in Parkstad Limburg (Heerlen, Kerkrade, Landgraaf en omgeving). BIG-geregistreerd. Een vertrouwd gezicht, een gerust gevoel.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://parkstadthuiszorg.nl",
    siteName: "Parkstad Thuiszorg",
    title: "Thuiszorg in Parkstad — Heerlen, Kerkrade, Landgraaf | Parkstad Thuiszorg",
    description: "Wijkverpleging, persoonlijke verzorging en begeleiding aan huis in Parkstad Limburg. BIG-geregistreerd. Een vertrouwd gezicht, een gerust gevoel.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thuiszorg in Parkstad | Parkstad Thuiszorg",
    description: "Wijkverpleging en persoonlijke verzorging aan huis in Parkstad Limburg. BIG-geregistreerd.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  name: "Parkstad Thuiszorg",
  url: "https://parkstadthuiszorg.nl",
  telephone: "+31626591818",
  email: "info@parkstadthuiszorg.nl",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kerkrade",
    addressRegion: "Limburg",
    addressCountry: "NL",
  },
  areaServed: [
    "Kerkrade",
    "Heerlen",
    "Landgraaf",
    "Brunssum",
    "Voerendaal",
    "Simpelveld",
  ],
  identifier: [
    { "@type": "PropertyValue", propertyID: "KvK", value: "42026060" },
    { "@type": "PropertyValue", propertyID: "AGB", value: "91133634" },
    { "@type": "PropertyValue", propertyID: "BIG", value: "19923300630" },
  ],
  availableService: services.map((service) => ({
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#fefdfc] dark:bg-[#02191c] text-[#064a54] dark:text-[#e5f2f4]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
