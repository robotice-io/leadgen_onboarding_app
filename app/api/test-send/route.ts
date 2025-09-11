import { NextRequest } from "next/server";
import { getIntegrationById } from "@/lib/store";
import { getAccessTokenForIntegration, toBase64Url } from "@/lib/google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const integrationId = String(body.integrationId || "").trim();
    const to = String(body.to || "").trim();
    const subject = String(body.subject || "Test email from Robotice Onboarding").trim();
    const message = String(body.message || "Hello from Robotice Onboarding!").trim();
    if (!integrationId || !to) return new Response("integrationId and to are required", { status: 400 });

    const integration = getIntegrationById(integrationId);
    if (!integration) return new Response("Integration not found", { status: 404 });

    const accessToken = await getAccessTokenForIntegration(integrationId);

    const raw = [
      `From: ${integration.fromEmail}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "",
      message,
    ].join("\r\n");

    const rawBase64Url = toBase64Url(raw);

    const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: rawBase64Url }),
    });

    if (!sendRes.ok) {
      const text = await sendRes.text();
      return new Response(text || "Failed to send email", { status: 500 });
    }
    const json = await sendRes.json();
    return Response.json({ id: json.id });
  } catch (e: unknown) {
    return new Response(e instanceof Error ? e.message : "Server error", { status: 500 });
  }
}


