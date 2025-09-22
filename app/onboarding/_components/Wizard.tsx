"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { apiGet, apiPost, getApiBaseUrl, getAppBaseUrl } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import HelpDrawer from "./HelpDrawer";

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
  const { t } = useI18n();
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
  const [checklist, setChecklist] = useState<boolean[]>([false, false, false, false]);
  const [copied, setCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<{ tone: "success" | "error"; msg: string } | null>(null);
  const [tenantCreated, setTenantCreated] = useState<boolean>(false);
  const [emailQueuedFlag, setEmailQueuedFlag] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [credsSaved, setCredsSaved] = useState<boolean>(false);
  const [tenantId, setTenantId] = useState<number | null>(null);

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
      setSuccessMessage(t("googleConnected"));
      setStep(3);
    }
    if (params.get("error")) {
      setError(params.get("error") || "");
      setStep(3);
    }
  }, [t]);

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
      // Step 1: create tenant (ignore duplicate errors per spec)
      if (step === 1) {
        const resTenant = await apiPost("/api/v1/tenants/", { name: orgName || "" });
        if (resTenant.status === 200) {
          setToast({ tone: "success", msg: t("companyCreated") });
          try {
            const body = await resTenant.json();
            if (typeof body?.id === "number") setTenantId(body.id);
          } catch {}
          setTenantCreated(true);
          setStep(2);
          setHelpOpen(true);
          return;
        }
        if (resTenant.status === 500 || resTenant.status === 409) {
          setToast({ tone: "success", msg: t("companyExistsContinuing") });
          setTenantCreated(true);
          // Best-effort: fetch tenants and match by name to get id
          try {
            const listRes = await apiGet("/api/v1/tenants");
            if (listRes.ok) {
              const arr = (await listRes.json()) as Array<{ id: number; name: string }>;
              const match = arr.find((tnt) => (tnt?.name || "").toLowerCase() === (orgName || "").toLowerCase());
              if (match) setTenantId(match.id);
            }
          } catch {}
          setStep(2);
          setHelpOpen(true);
          return;
        }
        if (resTenant.status === 422) {
          setToast({ tone: "error", msg: t("invalidCompany") });
          return;
        }
        const text = await resTenant.text();
        throw new Error(text || t("unknownError"));
      }

      // Step 3: save local integration form (no backend call needed per spec)
      setSuccessMessage(t("savedNowConnect"));
      setCredsSaved(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("unknownError"));
    } finally {
      setSaving(false);
    }
  };

  const handleConnectGoogle = () => {
    if (!integrationId) {
      // New flow: fetch init URL from backend and redirect
      // We allow clicking without integrationId in the new server-driven flow
    }
    const doInit = async () => {
      try {
        setError("");
        const shownRedirect = `${getAppBaseUrl().replace(/\/$/, "")}/oauth/callback`;
        // Persist tenant id for callback
        try {
          if (tenantId != null) localStorage.setItem("robotice-tenant-id", String(tenantId));
        } catch {}
        const url = `/api/v1/oauth/init?redirect_uri=${encodeURIComponent(shownRedirect)}`;
        const res = await apiGet(url);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!data.auth_url) throw new Error("Missing auth_url");
        window.location.href = data.auth_url as string;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : t("unknownError"));
      }
    };
    void doInit();
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

      <div className="relative min-h-[560px]">
        <StepPanel active={step === 1}>
          <Card>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">{t("letsGetStarted")}</h2>
              <p className="text-sm text-black/60 dark:text-white/70">
                {t("enterEmailAndCompany")}
              </p>
            </div>
            <div className="space-y-4">
              <Field label={t("emailAddress")}>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                  placeholder={t("yourEmailPlaceholder")}
                />
              </Field>
              <Field label={t("companyName")}>
                <input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                  placeholder={t("companyPlaceholder")}
                />
              </Field>
              <Field label={t("industryOptional")}>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                  placeholder={t("industryPlaceholder")}
                />
              </Field>
            </div>
            <div className="flex items-center justify-end gap-3 pt-6">
              {tenantCreated ? (
                <span className="text-sm text-green-600">{t("companyCreated")}</span>
              ) : null}
              <Button onClick={handleSave} disabled={saving || !(orgName || "").trim()}>{saving ? t("saving") + "..." : t("continueToTutorial")}</Button>
            </div>
          </Card>
        </StepPanel>

        <StepPanel active={step === 2}>
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold mb-3">{t("tutorialTitle")}</h2>
              <button className="h-9 px-3 rounded-md border border-black/10 dark:border-white/15 text-sm cursor-pointer" onClick={() => setHelpOpen(true)}>Guía rápida</button>
            </div>
            <p className="text-sm text-black/70 dark:text-white/70 mb-6">
              {t("tutorialSubtitle")}
            </p>
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 shadow-sm">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Gmail API Setup Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">{t("redirectUri")}</div>
              <button
                type="button"
                className="w-full text-left font-mono text-xs break-all p-2 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/10 transition"
                onClick={async () => {
                  try {
                    const shownRedirect = `${getAppBaseUrl().replace(/\/$/, "")}/oauth/callback`;
                    await navigator.clipboard.writeText(shownRedirect);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {}
                }}
                title={copied ? t("copied") : t("clickToCopy")}
              >
                {`${getAppBaseUrl().replace(/\/$/, "")}/oauth/callback`}
              </button>
              <div className="text-xs mt-1 text-black/60 dark:text-white/60">{copied ? t("copied") : t("clickToCopy")}</div>
            </div>
            <div className="mt-8">
              <div className="text-sm font-medium mb-3">{t("tutorialChecklist")}</div>
              <ul className="text-sm space-y-3">
                <li>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border border-black/25 dark:border-white/25 accent-blue-600"
                      checked={checklist[0]}
                      onChange={() => setChecklist((prev) => { const next = [...prev]; next[0] = !next[0]; return next; })}
                    />
                    <span>{t("checkEnableApi")}</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border border-black/25 dark:border-white/25 accent-blue-600"
                      checked={checklist[1]}
                      onChange={() => setChecklist((prev) => { const next = [...prev]; next[1] = !next[1]; return next; })}
                    />
                    <span>{t("checkCreateOAuth")}</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border border-black/25 dark:border-white/25 accent-blue-600"
                      checked={checklist[2]}
                      onChange={() => setChecklist((prev) => { const next = [...prev]; next[2] = !next[2]; return next; })}
                    />
                    <span>{t("checkRedirectUris")}</span>
                  </label>
                </li>
                <li>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border border-black/25 dark:border-white/25 accent-blue-600"
                      checked={checklist[3]}
                      onChange={() => setChecklist((prev) => { const next = [...prev]; next[3] = !next[3]; return next; })}
                    />
                    <span>{t("checkDownloadJson")}</span>
                  </label>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-between pt-8">
              <Button variant="secondary" onClick={() => setStep(1)}>{t("back")}</Button>
              <Button onClick={() => setStep(3)} disabled={!checklist.every(Boolean)}>{t("completedSetup")}</Button>
            </div>
          </Card>
        </StepPanel>

        <StepPanel active={step === 3}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <button aria-label={t("back")} className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white cursor-pointer"
                onClick={() => { setStep(2); setHelpOpen(true); }}>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="grid gap-4">
              <Field label={t("googleClientId")}>
                <input
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                  placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                />
              </Field>
              <Field label={t("googleClientSecret")}>
                <input
                  value={googleClientSecret}
                  onChange={(e) => setGoogleClientSecret(e.target.value)}
                  className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                  placeholder="GOCSPX-..."
                />
              </Field>
              <Field label={t("fromEmail")}>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
                  placeholder="noreply@company.com"
                />
              </Field>
            </div>
            <div className="pt-6">
              <div className="grid gap-3">
                {!credsSaved ? (
                  <button
                    className="w-full h-11 rounded-md bg-blue-600 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleSave}
                    disabled={saving || !(googleClientId || "").trim() || !(googleClientSecret || "").trim()}
                  >
                    {saving ? t("saving") + "..." : t("save")}
                  </button>
                ) : (
                  <button
                    className="w-full h-11 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black text-black dark:text-white flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleConnectGoogle}
                  >
                    <img src="/google.svg" alt="Google" className="w-5 h-5" />
                    <span>{t("connectWithGoogle")}</span>
                  </button>
                )}
              </div>
            </div>
          </Card>
        </StepPanel>
      </div>
      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} redirectUri={`${getApiBaseUrl().replace(/\/$/, "")}/api/v1/oauth/callback`} apiBase={getApiBaseUrl()} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  const { t } = useI18n();
  const steps = [t("stepCompany"), t("stepGuide"), t("stepConnect")];
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

function StepPanel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!active}
      className={
        "absolute inset-0 transition-all duration-300 " +
        (active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none")
      }
    >
      {children}
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
      ? "h-10 px-4 rounded-md border border-black/10 dark:border-white/15 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      : variant === "outline"
      ? "h-10 px-4 rounded-md border border-blue-600 text-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      : "h-10 px-4 rounded-md bg-blue-600 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";
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

function Toast({ toast, onClose }: { toast: { tone: "success" | "error"; msg: string } | null; onClose: () => void }) {
  if (!toast) return null;
  const base = toast.tone === "success" ? "bg-green-600" : "bg-red-600";
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded-md shadow-lg ${base}`} role="status">
      <div className="flex items-center gap-3">
        <span className="text-sm">{toast.msg}</span>
        <button className="text-white/90 hover:text-white text-xs underline" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}


