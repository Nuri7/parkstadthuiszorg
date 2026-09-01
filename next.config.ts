import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-pdf + de mailpakketten niet door de bundler laten verwerken
  serverExternalPackages: ["@react-pdf/renderer", "imapflow", "mailparser"],
  // /contact bestaat niet als pagina (het formulier staat op de homepage) maar
  // is een adres dat mensen intypen — netjes doorsturen i.p.v. 404.
  async redirects() {
    return [
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      // Wondfoto's worden client-side verkleind (~1600px) vóór upload, maar geef
      // ruimte voor de fallback (originele foto als canvas-verkleinen faalt).
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
