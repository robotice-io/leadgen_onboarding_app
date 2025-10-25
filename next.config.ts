import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // ensure edge runtime is not forced; keep default nodejs
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
    ],
  },
};

export default nextConfig;
