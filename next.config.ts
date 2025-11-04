import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // ensure edge runtime is not forced; keep default nodejs
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://www.googletagmanager.com; connect-src 'self' https://api.mercadopago.com https://sdk.mercadopago.com https://www.googletagmanager.com https://www.google-analytics.com; frame-src 'self' https://sdk.mercadopago.com;" },
        ]
      }
    ];
  }
};

export default nextConfig;
