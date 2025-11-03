import { NextRequest } from "next/server";
import mercadopago from "mercadopago";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Basic webhook handler: acknowledge quickly, then process
  let body: any = {};
  try { body = await req.json(); } catch {}

  // Mercado Pago sends topic/type and data.id; sometimes query params carry id too
  const topic = body?.type || body?.topic || "";
  const dataId = body?.data?.id || body?.data_id || body?.id || new URL(req.url).searchParams.get("data.id");

  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) throw new Error("Missing MP_ACCESS_TOKEN");
    mercadopago.configure({ access_token: accessToken, integrator_id: process.env.MP_INTEGRATOR_ID });

    if (topic.includes("payment") && dataId) {
      // Fetch payment detail to confirm status
      const payment = await mercadopago.payment.findById(Number(dataId)).catch(() => null);
      const status = (payment as any)?.body?.status || (payment as any)?.response?.status;
      const metadata = (payment as any)?.body?.metadata || {};
      // TODO: persist order/tenant status in your DB using metadata.tenant_id
      console.log("[MP webhook] payment", { id: dataId, status, metadata });
    } else {
      console.log("[MP webhook] event", { topic, dataId, body });
    }
  } catch (e) {
    console.error("[MP webhook] error", e);
    // keep returning 200 to avoid MP retries storms; adjust if you want retry behavior
  }

  return new Response("OK", { status: 200 });
}

export const GET = POST; // MP may call with GET on some flows
