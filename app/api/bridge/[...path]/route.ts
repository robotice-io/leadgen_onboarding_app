import { NextRequest } from "next/server";

export const runtime = "nodejs";

function getApiBase() {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (env && env.replace(/\/$/, "")) || "http://192.241.157.92:8000";
}

function getApiKey(): string {
  return process.env.NEXT_PUBLIC_API_KEY || "lk_ad23ea53ecf1a7937b66d9a18fe30848056fc88a97eea7f7a2a7b1d9a1cc1175";
}

async function proxy(req: NextRequest) {
  const apiBase = getApiBase();
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/bridge/, "");
  const target = `${apiBase}${path}${url.search}`;
  const headers = new Headers(req.headers);
  headers.set("host", new URL(apiBase).host);
  
  // Only add API key for telemetry endpoints
  // Auth and dashboard endpoints DO NOT require API key
  if (path.includes('/telemetry/')) {
    headers.set("X-API-Key", getApiKey());
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


