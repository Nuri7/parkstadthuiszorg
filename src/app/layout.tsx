import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Parkstad Thuiszorg | Een vertrouwd gezicht, een gerust gevoel",
  description: "Een vertrouwd gezicht, een gerust gevoel – thuiszorg en verpleging in de Parkstad-regio. BIG-geregistreerd en altijd dichtbij als u ons nodig heeft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="nl" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
        <body className="font-sans antialiased bg-[#fefdfc] dark:bg-[#02191c] text-[#064a54] dark:text-[#e5f2f4]">
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
