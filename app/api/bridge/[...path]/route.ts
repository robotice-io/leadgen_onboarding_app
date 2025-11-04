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
  // Dev/Preview fallback: allow using public key env only outside production to avoid 500s during local/preview testing
  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (!isProd) {
    const publicKey = process.env.NEXT_PUBLIC_API_KEY;
    if (publicKey) return publicKey;
  }
  throw new Error("API key not configured. Please set API_KEY in your environment variables (server-side only).");
}

async function proxy(req: NextRequest) {
  const apiBase = getApiBase();
  const url = new URL(req.url);
  // Preserve /api/v1 when present. If client omitted it (e.g., /api/bridge/billing/..), prepend /api/v1.
  const subPath = url.pathname.replace(/^\/api\/bridge/, "");
  const upstreamPath = subPath.startsWith("/api/") ? subPath : `/api/v1${subPath}`;
  const target = `${apiBase}${upstreamPath}${url.search}`;
  // Build sanitized upstream headers (avoid hop-by-hop/forbidden headers)
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Accept", req.headers.get("accept") ?? "application/json");
  const tenantHeader = req.headers.get("x-tenant-id") || req.headers.get("X-Tenant-ID");
  if (tenantHeader) headers.set("X-Tenant-ID", tenantHeader);
  
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
  // Read body once to allow diagnostics and integrity checks
  const rawBody = req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();
  const init: RequestInit = {
    method: req.method,
    headers,
    body: rawBody,
  };

  // Add a timeout to avoid hanging requests
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 15000);
  try {
    const res = await fetch(target, { ...init, signal: ac.signal });
    (global as any).__proxyLastTarget = target;
    const body = await res.arrayBuffer();
    // Sanitize response headers to avoid forbidden/hop-by-hop headers issues
    const resHeaders = new Headers(res.headers);
    resHeaders.delete("content-length");
    resHeaders.delete("transfer-encoding");
    resHeaders.delete("content-encoding");
    // Add debug headers with upstream target and request body diagnostics (length + sha256)
    resHeaders.set("X-Proxy-Target", String((global as any).__proxyLastTarget || target));
    try {
      if (rawBody) {
        const enc = new TextEncoder();
        const data = enc.encode(rawBody);
        // @ts-ignore Node crypto is available in nodejs runtime
        const { createHash } = await import('crypto');
        const hash = createHash('sha256').update(Buffer.from(data)).digest('hex');
        resHeaders.set('X-Proxy-Body-Length', String(data.byteLength));
        resHeaders.set('X-Proxy-Body-Sha256', hash);
        const ct = headers.get('Content-Type') || headers.get('content-type') || '';
        if (ct) resHeaders.set('X-Proxy-Content-Type', ct);
      }
    } catch {}
    return new Response(body, { status: res.status, headers: resHeaders });
  } catch (err: any) {
    const payload = {
      error: "Upstream fetch failed",
      code: err?.name || "FETCH_ERROR",
      message: err?.message || String(err),
      target,
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


