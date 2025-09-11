import { NextRequest } from "next/server";
import { getIntegrationById } from "@/lib/store";
import { hmacSha256Hex, requireEnv } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const integrationId = searchParams.get("integrationId") || "";
  const integration = getIntegrationById(integrationId);
  if (!integration) return new Response("Integration not found", { status: 404 });

  const clientId = integration.googleClientId;
  const redirectUri = integration.googleRedirectUri;

  const statePayload = JSON.stringify({ i: integration.integrationId, t: Date.now() });
  const signature = hmacSha256Hex(statePayload, requireEnv("STATE_SIGNING_KEY"));
  const state = Buffer.from(JSON.stringify({ p: statePayload, s: signature }), "utf8").toString("base64url");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/gmail.send");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);

  return Response.redirect(authUrl.toString(), 302);
}



