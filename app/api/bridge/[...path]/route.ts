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
  headers.set("host", new URL(apiBase).host);
  
  // Always attach API key for every proxied request
  headers.set("X-API-Key", getApiKey());
  
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
  const res = await fetch(target, init);
  const body = await res.arrayBuffer();
  return new Response(body, { status: res.status, headers: res.headers });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;


