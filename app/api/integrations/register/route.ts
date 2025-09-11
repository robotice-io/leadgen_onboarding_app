import { NextRequest } from "next/server";
import { randomId } from "@/lib/crypto";
import { upsertIntegration } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const googleClientId = String(body.googleClientId || "").trim();
    const googleClientSecret = String(body.googleClientSecret || "").trim();
    const googleRedirectUri = String(body.googleRedirectUri || "").trim();
    const fromEmail = String(body.fromEmail || "").trim();

    if (!googleClientId || !googleClientSecret || !googleRedirectUri || !fromEmail) {
      return new Response("Missing fields", { status: 400 });
    }
    try {
      const parsed = new URL(googleRedirectUri);
      if (!parsed.protocol.startsWith("http")) throw new Error("Invalid");
    } catch {
      return new Response("Invalid redirect URI", { status: 400 });
    }

    const integrationId = randomId(8);
    upsertIntegration({
      integrationId,
      googleClientId,
      googleClientSecret,
      googleRedirectUri,
      fromEmail,
      createdAtMs: Date.now(),
    });

    return Response.json({ integrationId, redirectUri: googleRedirectUri });
  } catch (e: unknown) {
    return new Response(e instanceof Error ? e.message : "Server error", { status: 500 });
  }
}


