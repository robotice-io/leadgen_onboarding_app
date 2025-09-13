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
      <div className="mb-6">
        <Stepper current={step} />
      </div>

      {error ? (
        <Alert tone="error" message={error} />
      ) : null}
      {successMessage ? (
        <Alert tone="success" message={successMessage} />
      ) : null}

      {step === 1 && (
        <Card>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">Let's Get Started</h2>
            <p className="text-sm text-black/60 dark:text-white/70">
              Enter your email and company details to begin the Gmail API setup process.
            </p>
          </div>
          <div className="space-y-4">
            <Field label="Email Address">
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                placeholder="john@example.com"
              />
            </Field>
            <Field label="Company/Brand Name">
              <input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                placeholder="Acme Corporation"
              />
            </Field>
            <Field label="Industry (Optional)">
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                placeholder="Select your industry"
              />
            </Field>
          </div>
          <div className="flex justify-end pt-6">
            <Button onClick={() => setStep(2)}>Continue to Tutorial</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <h2 className="text-xl font-semibold mb-2 text-center">Gmail API Setup Tutorial</h2>
          <p className="text-sm text-black/60 dark:text-white/70 text-center mb-6">
            Follow this step-by-step video to enable Gmail API access for your account.
          </p>
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-black/5">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Gmail API Setup Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Tutorial Checklist:</div>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2"><Check /> Enable Gmail API in Google Cloud Console</li>
              <li className="flex items-center gap-2"><Check /> Create OAuth 2.0 credentials</li>
              <li className="flex items-center gap-2"><Check /> Configure authorized redirect URIs</li>
              <li className="flex items-center gap-2"><Check /> Download credentials JSON file</li>
            </ul>
          </div>
          <div className="flex items-center justify-between pt-6">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>I've Completed Setup →</Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <div className="grid gap-4">
            <Field label="Google Client ID">
              <input
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
              />
            </Field>
            <Field label="Google Client Secret">
              <input
                value={googleClientSecret}
                onChange={(e) => setGoogleClientSecret(e.target.value)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                placeholder="GOCSPX-..."
              />
            </Field>
            <Field label="From email">
              <input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                placeholder="noreply@company.com"
              />
            </Field>
            <Field label="Redirect URI">
              <div className="font-mono text-xs break-all p-2 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20">
                {redirectUri}
              </div>
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-6">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : integrationId ? "Save again" : "Save"}</Button>
            <Button variant="outline" onClick={handleConnectGoogle} disabled={!integrationId}>Connect with Google</Button>
          </div>
          <div className="mt-6 space-y-2">
            <div className="text-sm font-medium">Send test email</div>
            <div className="flex gap-2 items-center">
              <input
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                className="flex-1 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                placeholder="your.email@company.com"
              />
              <Button variant="outline" disabled={!integrationId || !testRecipient || testSendLoading}
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
              >{testSendLoading ? "Sending..." : "Send"}</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  const steps = ["Company", "Guide", "Connect"];
  return (
    <div className="flex items-center justify-center gap-6">
      {steps.map((label, idx) => {
        const number = idx + 1;
        const active = number === current;
        const completed = number < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={
                "w-9 h-9 rounded-full grid place-items-center text-xs " +
                (completed
                  ? "bg-blue-600 text-white"
                  : active
                  ? "border-2 border-blue-600 text-blue-600"
                  : "border border-black/20 dark:border-white/20 text-black/50 dark:text-white/50")
              }
            >
              {number}
            </div>
            <span className={"text-sm " + (active ? "font-medium" : "text-black/60 dark:text-white/60")}>{label}</span>
            {idx < steps.length - 1 && (
              <div className="w-10 h-px bg-black/10 dark:bg-white/10 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/90 dark:bg-black/30 backdrop-blur rounded-xl shadow-sm border border-black/5 dark:border-white/10 p-6 sm:p-8">
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}

function Button({ children, onClick, disabled, variant }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: "primary" | "secondary" | "outline" }) {
  const cls =
    variant === "secondary"
      ? "h-10 px-4 rounded-md border border-black/10 dark:border-white/15"
      : variant === "outline"
      ? "h-10 px-4 rounded-md border border-blue-600 text-blue-600"
      : "h-10 px-4 rounded-md bg-blue-600 text-white";
  return (
    <button className={cls + (disabled ? " opacity-60 cursor-not-allowed" : "")} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Alert({ tone, message }: { tone: "error" | "success"; message: string }) {
  const styles = tone === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200";
  return <div className={`rounded-md border p-3 mb-4 text-sm ${styles}`}>{message}</div>;
}


