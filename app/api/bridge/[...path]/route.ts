import { NextRequest } from "next/server";

export const runtime = "nodejs";

function getApiBase() {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (env && env.replace(/\/$/, "")) || "http://192.241.157.92:8000";
}

function getApiKey(): string {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key not configured. Please set API_KEY in your environment variables (server-side only).");
  }
  return apiKey;
}

async function proxy(req: NextRequest) {
  const apiBase = getApiBase();
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/bridge/, "");
  const target = `${apiBase}${path}${url.search}`;
  const headers = new Headers(req.headers);
  
  // Always attach API key for every proxied request
  try {
    headers.set("X-API-Key", getApiKey());
  } catch (e) {
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    const message = isProd ? "Internal Server Error" : "Server misconfiguration: missing API_KEY on server";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "content-type": "application/json" } });
  }
  
  // If X-Tenant-ID not present, try to infer it from cookie set by the app
  const hasTenantHeader = headers.has("X-Tenant-ID") || headers.has("x-tenant-id");
  if (!hasTenantHeader) {
    try {
      const tenantCookie = req.cookies.get("robotice-tenant-id")?.value;
      if (tenantCookie) {
        headers.set("X-Tenant-ID", tenantCookie);
      }
    } catch {
      // ignore cookie parsing issues
    }
  }
  
  headers.delete("content-length");
  const init: RequestInit = {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.text(),
  };

  // Add a timeout to avoid hanging requests
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 15000);
  try {
    const res = await fetch(target, { ...init, signal: ac.signal });
    const body = await res.arrayBuffer();
    // Sanitize response headers to avoid forbidden/hop-by-hop headers issues
    const resHeaders = new Headers(res.headers);
    resHeaders.delete("content-length");
    resHeaders.delete("transfer-encoding");
    resHeaders.delete("content-encoding");
    return new Response(body, { status: res.status, headers: resHeaders });
  } catch (err: any) {
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    const payload = {
      error: "Upstream fetch failed",
      code: err?.name || "FETCH_ERROR",
      message: isProd ? undefined : (err?.message || String(err)),
      target: isProd ? undefined : target,
    };
    return new Response(JSON.stringify(payload), { status: 502, headers: { "content-type": "application/json" } });
  } finally {
    clearTimeout(timeout);
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;


