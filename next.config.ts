import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // ensure edge runtime is not forced; keep default nodejs
  },
};

export default nextConfig;
