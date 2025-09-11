"use client";

import { useCallback, useMemo, useState } from "react";

type RegisterPayload = {
  googleClientId: string;
  googleClientSecret: string;
  fromEmail: string;
  googleRedirectUri: string;
};

type RegisterResponse = {
  integrationId: string;
  redirectUri: string;
};

export default function Wizard() {
  const [step, setStep] = useState<number>(1);
  const [orgName, setOrgName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [googleClientId, setGoogleClientId] = useState<string>("");
  const [googleClientSecret, setGoogleClientSecret] = useState<string>("");
  const [fromEmail, setFromEmail] = useState<string>("");
  const [integrationId, setIntegrationId] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [testSendLoading, setTestSendLoading] = useState<boolean>(false);
  const [testRecipient, setTestRecipient] = useState<string>("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const baseUrl = envBaseUrl || origin || "";
  const redirectUri = useMemo(() => {
    if (!baseUrl) return "/api/oauth/google/callback";
    return `${baseUrl.replace(/\/$/, "")}/api/oauth/google/callback`;
  }, [baseUrl]);

  // Read success flags from URL after OAuth callback redirect
  const readStatusFromUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setSuccessMessage("Google connected successfully. Refresh token stored.");
      setStep(3);
    }
    if (params.get("error")) {
      setError(params.get("error") || "");
      setStep(3);
    }
  }, []);

  // Run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    readStatusFromUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const payload: RegisterPayload = {
        googleClientId,
        googleClientSecret,
        fromEmail,
        googleRedirectUri: redirectUri,
      };
      const res = await fetch("/api/integrations/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save integration");
      }
      const data = (await res.json()) as RegisterResponse;
      setIntegrationId(data.integrationId);
      setSuccessMessage("Saved. Now connect your Google account.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleConnectGoogle = () => {
    if (!integrationId) {
      setError("Please save first to get an integration ID.");
      return;
    }
    window.location.href = `/api/oauth/google/start?integrationId=${encodeURIComponent(
      integrationId
    )}`;
  };

  return (
    <div className="w-full">
      <Stepper current={step} />

      {error ? (
        <div className="rounded-md bg-red-50 text-red-700 border border-red-200 p-3 mb-4 text-sm">
          {error}
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-md bg-green-50 text-green-700 border border-green-200 p-3 mb-4 text-sm">
          {successMessage}
        </div>
      ) : null}

      {step === 1 && (
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company name</label>
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
              placeholder="Robotice"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
              placeholder="you@company.com"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              className="h-10 px-4 rounded-md bg-black text-white dark:bg-white dark:text-black"
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <p className="text-sm text-black/70 dark:text-white/70">
            In your Google Cloud Console:
          </p>
          <ol className="list-decimal ml-6 text-sm space-y-1">
            <li>Enable Gmail API</li>
            <li>OAuth consent: Internal (Workspace)</li>
            <li>Credentials → OAuth client ID (Web)</li>
            <li>
              Authorized redirect URI:
              <span className="ml-2 font-mono text-xs break-all">{redirectUri}</span>
            </li>
          </ol>
          <div>
            <label className="block text-sm font-medium mb-1">Help video (optional)</label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
              placeholder="https://youtu.be/..."
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              className="h-10 px-4 rounded-md border border-black/10 dark:border-white/15"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              className="h-10 px-4 rounded-md bg-black text-white dark:bg-white dark:text-black"
              onClick={() => setStep(3)}
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Google Client ID</label>
            <input
              value={googleClientId}
              onChange={(e) => setGoogleClientId(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
              placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Google Client Secret</label>
            <input
              value={googleClientSecret}
              onChange={(e) => setGoogleClientSecret(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
              placeholder="GOCSPX-..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">From email</label>
            <input
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
              placeholder="noreply@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Redirect URI</label>
            <div className="font-mono text-xs break-all p-2 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20">
              {redirectUri}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              className="h-10 px-4 rounded-md border border-black/10 dark:border-white/15"
              onClick={() => setStep(2)}
            >
              Back
            </button>
            <button
              className="h-10 px-4 rounded-md bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : integrationId ? "Save again" : "Save"}
            </button>
            <button
              className="h-10 px-4 rounded-md border border-black/10 dark:border-white/15 disabled:opacity-60"
              onClick={handleConnectGoogle}
              disabled={!integrationId}
            >
              Connect with Google
            </button>
          </div>
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium">Send test email</label>
            <div className="flex gap-2 items-center">
              <input
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                className="flex-1 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                placeholder="your.email@company.com"
              />
              <button
                className="h-10 px-4 rounded-md border border-black/10 dark:border-white/15 disabled:opacity-60"
                disabled={!integrationId || !testRecipient || testSendLoading}
                onClick={async () => {
                  setError("");
                  setSuccessMessage("");
                  setTestSendLoading(true);
                  try {
                    const res = await fetch("/api/test-send", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ integrationId, to: testRecipient }),
                    });
                    if (!res.ok) throw new Error(await res.text());
                    setSuccessMessage("Test email sent. Check your inbox.");
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : "Failed to send test email");
                  } finally {
                    setTestSendLoading(false);
                  }
                }}
              >
                {testSendLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  const steps = ["Company", "Guide", "Connect"];
  return (
    <div className="flex items-center gap-3 mb-6">
      {steps.map((label, idx) => {
        const number = idx + 1;
        const active = number === current;
        const completed = number < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={
                "w-7 h-7 rounded-full grid place-items-center text-xs " +
                (completed
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : active
                  ? "border border-black/40 dark:border-white/40"
                  : "border border-black/20 dark:border-white/20 text-black/50 dark:text-white/50")
              }
            >
              {number}
            </div>
            <span className={"text-sm " + (active ? "font-medium" : "text-black/60 dark:text-white/60")}>{label}</span>
            {idx < steps.length - 1 && (
              <div className="w-8 h-px bg-black/10 dark:bg-white/10 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}


