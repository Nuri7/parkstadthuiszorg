import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-pdf + de mailpakketten niet door de bundler laten verwerken
  serverExternalPackages: ["@react-pdf/renderer", "imapflow", "mailparser"],
  experimental: {
    serverActions: {
      // Wondfoto's worden client-side verkleind (~1600px) vóór upload, maar geef
      // ruimte voor de fallback (originele foto als canvas-verkleinen faalt).
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
