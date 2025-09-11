import { NextRequest } from "next/server";
import { getIntegrationById, updateIntegrationTokens } from "@/lib/store";
import { hmacSha256Hex, requireEnv } from "@/lib/crypto";

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

function verifyStateAndExtractIntegrationId(stateParam: string): string | null {
  try {
    const decoded = JSON.parse(Buffer.from(stateParam, "base64url").toString("utf8"));
    const payload = String(decoded.p || "");
    const signature = String(decoded.s || "");
    const expected = hmacSha256Hex(payload, requireEnv("STATE_SIGNING_KEY"));
    if (expected !== signature) return null;
    const parsed = JSON.parse(payload);
    return String(parsed.i || "");
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return Response.redirect(`/onboarding?error=${encodeURIComponent(error)}`, 302);
  }

  if (!code || !state) return new Response("Missing params", { status: 400 });
  const integrationId = verifyStateAndExtractIntegrationId(state);
  if (!integrationId) return new Response("Invalid state", { status: 400 });

  const integration = getIntegrationById(integrationId);
  if (!integration) return new Response("Integration not found", { status: 404 });

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: integration.googleClientId,
      client_secret: integration.googleClientSecret,
      redirect_uri: integration.googleRedirectUri,
      grant_type: "authorization_code",
    }),
    // cache disabled for safety
    cache: "no-store",
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return Response.redirect(`/onboarding?error=${encodeURIComponent(text)}`, 302);
  }

  const tokenJson = (await tokenRes.json()) as TokenResponse;
  updateIntegrationTokens(integration.integrationId, {
    accessToken: tokenJson.access_token,
    refreshToken: tokenJson.refresh_token,
    expiryDateMs: tokenJson.expires_in ? Date.now() + tokenJson.expires_in * 1000 : undefined,
  });

  return Response.redirect(`/onboarding?success=1`, 302);
}



