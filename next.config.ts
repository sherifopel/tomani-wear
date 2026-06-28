import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // react-paystack accesses `window` at module load time, so it must never
  // be bundled into the server runtime. Marking it as an external package
  // tells Turbopack to exclude it from all server chunks entirely.
  serverExternalPackages: ['react-paystack'],
};

export default nextConfig;
