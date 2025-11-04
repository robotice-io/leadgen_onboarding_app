import { NextRequest } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export const runtime = "nodejs";

function getBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL;
  if (explicit) return explicit;
  const vercelProjectUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProjectUrl && vercelProjectUrl.startsWith("http")) return vercelProjectUrl;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function assertEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

// Simple plan catalog (CLP example). Replace amounts as needed.
const PLANS: Record<string, { title: string; currency: string; amount: number }> = {
  starter: { title: "LeadGen Starter", currency: "CLP", amount: 390000 },
  core: { title: "LeadGen Core", currency: "CLP", amount: 790000 },
  pro: { title: "LeadGen Pro", currency: "CLP", amount: 1490000 },
};

export async function POST(req: NextRequest) {
  try {
    const accessToken = assertEnv(
      "MP_ACCESS_TOKEN",
      process.env.MP_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN_PROD
    );
    const client = new MercadoPagoConfig({
      accessToken,
      options: { integratorId: process.env.MP_INTEGRATOR_ID || process.env.MP_INTEGRATOR_ID_PROD },
    });

    const body = await req.json().catch(() => ({}));
    const plan: string = body?.plan || "starter";
    const qty = Math.max(1, Number(body?.quantity || 1));
    const tenantId = body?.tenant_id ? String(body.tenant_id) : undefined;
    const email = body?.email ? String(body.email) : undefined;

    const base = getBaseUrl();
    const notifUrl = `${base}/api/payments/mp/webhook`;

    const meta = PLANS[plan] || PLANS.starter;
    const preferenceBody = {
      items: [
        {
          title: meta.title,
          quantity: qty,
          unit_price: meta.amount,
          currency_id: meta.currency,
        },
      ],
      payer: email ? { email } : undefined,
      back_urls: {
        success: `${base}/checkout/success`,
        pending: `${base}/checkout/processing`,
        failure: `${base}/checkout/cancel`,
      },
      auto_return: "approved" as const,
      notification_url: notifUrl,
      metadata: {
        plan,
        tenant_id: tenantId,
      },
    };

    const preference = new Preference(client);
    const res = await preference.create({ body: preferenceBody as any });
    return new Response(
      JSON.stringify({ id: (res as any).id, init_point: (res as any).init_point, sandbox_init_point: (res as any).sandbox_init_point }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (e: any) {
    const msg = e?.message || String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
