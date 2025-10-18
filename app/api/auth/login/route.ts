import { NextRequest } from "next/server";

export const runtime = "nodejs";

function getApiBase() {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  const base = (env && env.replace(/\/$/, "")) || "https://lead-gen-service.robotice.io";
  // Normalize: if env incorrectly includes '/api/v1' suffix, strip it to avoid '/api/v1/api/v1'
  return base.replace(/\/api\/v1\/?$/, "");
}

function getApiKey(): string {
  const apiKey = process.env.API_KEY;
  if (apiKey) return apiKey;
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (!isProd) {
    const publicKey = process.env.NEXT_PUBLIC_API_KEY;
    if (publicKey) return publicKey;
  }
  throw new Error("API_KEY not configured on server");
}

export async function POST(req: NextRequest) {
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  const apiBase = getApiBase();
  const target = `${apiBase}/api/v1/auth/login`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Key": getApiKey(),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const body = await res.arrayBuffer();
    const headers = new Headers(res.headers);
    headers.delete("content-length");
    headers.delete("transfer-encoding");
    headers.delete("content-encoding");
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    if (!isProd) headers.set("X-Login-Target", target);
    return new Response(body, { status: res.status, headers });
  } catch (err: any) {
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    const message = isProd ? "Login upstream failed" : `Login upstream failed: ${err?.message || String(err)}`;
    return new Response(JSON.stringify({ error: message }), { status: 502, headers: { "content-type": "application/json" } });
  } finally {
    clearTimeout(timeout);
  }
}
