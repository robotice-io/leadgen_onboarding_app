import { NextRequest } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

export const runtime = "nodejs";

function assertEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

// Keep in sync with create-preference
const PLANS: Record<string, { title: string; currency: string; amount: number }> = {
  starter: { title: "LeadGen Starter", currency: "CLP", amount: 390000 },
  core: { title: "LeadGen Core", currency: "CLP", amount: 790000 },
  pro: { title: "LeadGen Pro", currency: "CLP", amount: 1490000 },
};

export async function POST(req: NextRequest) {
  try {
    const accessToken = assertEnv("MP_ACCESS_TOKEN", process.env.MP_ACCESS_TOKEN);
    const client = new MercadoPagoConfig({
      accessToken,
      options: { integratorId: process.env.MP_INTEGRATOR_ID },
    });

    const body = await req.json().catch(() => ({}));
    const plan: string = body?.plan || "starter";
    const formData = body?.formData || {};
    const meta = PLANS[plan] || PLANS.starter;

    // Build payment payload from Brick formData. We always set trusted amount and description here.
    const payload: any = {
      transaction_amount: meta.amount,
      token: formData?.token,
      description: meta.title,
      installments: Number(formData?.installments || 1),
      payment_method_id: formData?.payment_method_id,
      issuer_id: formData?.issuer_id,
      payer: {
        email: formData?.payer?.email,
        identification: formData?.payer?.identification,
      },
      metadata: { plan },
    };

    if (!payload.token || !payload.payment_method_id) {
      throw new Error("Missing card token or payment method");
    }

    const paymentResource = new Payment(client);
    const result = await paymentResource.create({ body: payload });

    const response = {
      id: (result as any).id,
      status: (result as any).status,
      status_detail: (result as any).status_detail,
    };

    return new Response(JSON.stringify(response), { status: 200, headers: { "content-type": "application/json" } });
  } catch (e: any) {
    const msg = e?.message || String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
