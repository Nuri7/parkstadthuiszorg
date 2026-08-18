import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-pdf niet door de bundler laten verwerken (eigen layout-engine)
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    serverActions: {
      // Wondfoto's worden client-side verkleind (~1600px) vóór upload, maar geef
      // ruimte voor de fallback (originele foto als canvas-verkleinen faalt).
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
