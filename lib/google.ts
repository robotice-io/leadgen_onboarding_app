import { getIntegrationById, updateIntegrationTokens } from "@/lib/store";

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
};

export async function getAccessTokenForIntegration(integrationId: string): Promise<string> {
  const integration = getIntegrationById(integrationId);
  if (!integration) throw new Error("Integration not found");
  const refreshToken = integration.tokens?.refreshToken;
  if (!refreshToken) throw new Error("No refresh token stored for this integration");

  // If current access token is valid for > 60s, reuse
  const now = Date.now();
  if (
    integration.tokens?.accessToken &&
    typeof integration.tokens.expiryDateMs === "number" &&
    integration.tokens.expiryDateMs - now > 60_000
  ) {
    return integration.tokens.accessToken;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: integration.googleClientId,
      client_secret: integration.googleClientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  const json = (await res.json()) as TokenResponse;
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || "Failed to refresh access token");
  }
  const expiryMs = json.expires_in ? now + json.expires_in * 1000 : undefined;
  updateIntegrationTokens(integrationId, { accessToken: json.access_token, expiryDateMs: expiryMs });
  return json.access_token;
}

export function toBase64Url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}



