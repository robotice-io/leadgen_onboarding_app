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
    // Relaxed CSP needed for checkout (Mercado Pago secure fields, telemetry) and Calendly widget when used.
    const checkoutCsp = [
      "default-src 'self'",
      // Allow MP SDK + GTM + Calendly scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://www.googletagmanager.com https://assets.calendly.com",
      // Some browsers use script-src-elem separately
      "script-src-elem 'self' 'unsafe-inline' https://sdk.mercadopago.com https://www.googletagmanager.com https://assets.calendly.com",
      // MP secure-fields uses api-static and api domains; telemetry goes to mercadolibre domains
      "connect-src 'self' https://api.mercadopago.com https://sdk.mercadopago.com https://api-static.mercadopago.com https://api.mercadolibre.com https://www.mercadolibre.com https://www.googletagmanager.com https://www.google-analytics.com data: blob:",
      // Allow MP iframes and mercadolibre postMessage targets; Calendly embeds if used
      "frame-src 'self' https://sdk.mercadopago.com https://api.mercadopago.com https://www.mercadolibre.com https://assets.calendly.com",
      // Basic resource directives
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ');

    return [
      {
        // Apply on checkout pages only. We'll keep stricter defaults elsewhere.
        source: '/checkout(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: checkoutCsp },
        ]
      },
      {
        // Calendly callback pages (if any) — keep same relaxed policy
        source: '/onboarding(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: checkoutCsp },
        ]
      },
    ];
  }
};

export default nextConfig;
