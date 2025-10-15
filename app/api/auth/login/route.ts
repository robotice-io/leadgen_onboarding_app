import { NextRequest } from "next/server";

export const runtime = "nodejs";

function getApiBase() {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (env && env.replace(/\/$/, "")) || "https://lead-gen-service.robotice.io";
}

function getApiKey(): string {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not configured on server");
  return apiKey;
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

    const text = await res.text();
    const headers = new Headers({ "content-type": res.headers.get("content-type") || "application/json" });
    return new Response(text, { status: res.status, headers });
  } catch (err: any) {
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    const message = isProd ? "Login upstream failed" : `Login upstream failed: ${err?.message || String(err)}`;
    return new Response(JSON.stringify({ error: message }), { status: 502, headers: { "content-type": "application/json" } });
  } finally {
    clearTimeout(timeout);
  }
}
