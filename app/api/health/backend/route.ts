import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getApiBase() {
  const env = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (env && env.replace(/\/$/, "")) || "http://192.241.157.92:8000";
}

function ok(json: any, status = 200) {
  return new NextResponse(JSON.stringify(json), { status, headers: { "content-type": "application/json" } });
}

export async function GET() {
  const base = getApiBase();
  const info = {
    base,
    hasApiKey: !!process.env.API_KEY,
  };
  // We don't call backend here to avoid noise; proxy itself will validate in real calls.
  return ok({ status: "ok", info });
}
