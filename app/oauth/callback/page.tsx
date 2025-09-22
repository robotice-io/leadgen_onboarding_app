"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, getAppBaseUrl } from "@/lib/api";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function OAuthCallbackPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<string>("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        if (!code || !state) throw new Error("Missing code/state");
        const shownRedirect = `${getAppBaseUrl().replace(/\/$/, "")}/oauth/callback`;
        let tenantParam = "";
        try {
          const tid = localStorage.getItem("robotice-tenant-id");
          if (tid) tenantParam = `&tenant_id=${encodeURIComponent(tid)}`;
        } catch {}
        const resCb = await apiGet(`/api/v1/oauth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(shownRedirect)}${tenantParam}`);
        if (!resCb.ok) throw new Error(await resCb.text());
        const data = await resCb.json();
        if (data?.status !== "ok") throw new Error("Invalid callback");
        const resRefresh = await apiPost("/api/v1/oauth/refresh", {});
        if (!resRefresh.ok && resRefresh.status !== 404) throw new Error(await resRefresh.text());
        setStatus("ok");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
        setStatus("error");
      }
    };
    void run();
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-6">
      <CornerLogo position="tl" />
      <CornerLogo position="tr" />
      <CornerLogo position="bl" />
      <CornerLogo position="br" />

      {status === "loading" && (
        <div className="text-sm text-black/70 dark:text-white/70">{t("loading")}…</div>
      )}

      {status === "error" && (
        <div className="space-y-4 text-center">
          <div className="text-red-600">Error: {error}</div>
          <Link className="underline" href="/onboarding">{t("backToWizard")}</Link>
        </div>
      )}

      {status === "ok" && <SuccessCard />}
    </main>
  );
}

function SuccessCard() {
  const { t } = useI18n();
  return (
    <div className="w-full max-w-md text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-white dark:bg-black grid place-items-center shadow border border-black/10 dark:border-white/10">
        <img src="/google.svg" alt="Google" className="w-8 h-8" />
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-green-600">{t("connectedHeadline")}</h1>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70">{t("funnelTeaser")}</p>
      <TestEmail />
      <div className="mt-6">
        <Link href="/onboarding" className="inline-flex h-10 px-4 items-center justify-center rounded-md bg-blue-600 text-white">
          {t("backToWizard")}
        </Link>
      </div>
    </div>
  );
}

function TestEmail() {
  const { t } = useI18n();
  const [to, setTo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  return (
    <div className="mt-6 text-left">
      <div className="text-sm font-medium mb-2">{t("sendTestEmail")}</div>
      <div className="flex gap-2 items-center">
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 rounded-md border border-black/10 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 outline-none"
          placeholder={t("yourEmailPlaceholder")}
        />
        <button
          className="h-10 px-4 rounded-md border border-blue-600 text-blue-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!to || loading}
          onClick={async () => {
            setMsg("");
            setLoading(true);
            try {
              const res = await fetch("/api/bridge/api/v1/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to, subject: "Test email", body: t("funnelTeaser") }),
              });
              if (res.status === 202) setMsg(t("queuedEmail"));
              else setMsg(await res.text());
            } catch (e) {
              setMsg(String(e));
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? t("sending") + "..." : t("send")}
        </button>
      </div>
      {msg ? <div className="mt-2 text-xs text-green-600">{msg}</div> : null}
    </div>
  );
}

function CornerLogo({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const map: Record<string, string> = {
    tl: "left-4 top-4",
    tr: "right-4 top-4",
    bl: "left-4 bottom-4",
    br: "right-4 bottom-4",
  };
  return (
    <div className={`absolute ${map[position]} opacity-70`}> 
      <img src="/logo.png" alt="Robotice" className="w-6 h-6 rounded" />
    </div>
  );
}


