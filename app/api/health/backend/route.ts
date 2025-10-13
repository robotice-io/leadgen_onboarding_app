import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getApiBase() {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (env && env.replace(/\/$/, "")) || "http://192.241.157.92:8000";
}

function getApiKey(): string {
  const k = process.env.API_KEY;
  if (!k) throw new Error("API_KEY not configured on server");
  return k;
}

function json(data: any, status = 200) {
  return new NextResponse(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}

export async function GET(req: NextRequest) {
  const base = getApiBase();

  // Tenant ID puede venir por query, header o cookie
  const url = new URL(req.url);
  const qTenant = url.searchParams.get("tenant_id");
  const hTenant = req.headers.get("x-tenant-id") || req.headers.get("X-Tenant-ID");
  const cTenant = req.cookies.get("robotice-tenant-id")?.value;
  const tenantId = qTenant || hTenant || cTenant;

  if (!tenantId) {
    return json({ status: "error", error: "Missing tenant_id (query/header/cookie)" }, 400);
  }

  const target = `${base}/api/v1/dashboard/${encodeURIComponent(String(tenantId))}/health`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(target, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-Key": getApiKey(),
      },
      signal: controller.signal,
    });

    const text = await res.text();
    let contentType = res.headers.get("content-type") || "application/json";
    return new NextResponse(text, { status: res.status, headers: { "content-type": contentType } });
  } catch (err: any) {
    const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
    const message = isProd ? "Upstream health check failed" : `Upstream health check failed: ${err?.message || String(err)}`;
    return json({ status: "error", error: message, base }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
