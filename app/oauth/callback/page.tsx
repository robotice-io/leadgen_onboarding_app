"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, getAppBaseUrl } from "@/lib/api";
import Link from "next/link";
import { I18nProvider, useI18n } from "@/lib/i18n";

export default function OAuthCallbackPage() {
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
  // Include tenant_id if available per API reference
  const tenantId = (() => { try { return localStorage.getItem("robotice-tenant-id") || ""; } catch { return ""; } })();
  const refreshPath = tenantId ? `/api/v1/oauth/refresh?tenant_id=${encodeURIComponent(tenantId)}` : "/api/v1/oauth/refresh";
  const resRefresh = await apiPost(refreshPath, {});
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
    <I18nProvider>
      <CallbackUi status={status} error={error} />
    </I18nProvider>
  );
}

function CallbackUi({ status, error }: { status: string; error: string }) {
  const { t } = useI18n();
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
      <h1 className="mt-4 text-2xl font-semibold text-blue-600">{t("connectedHeadline")}</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/70">{t("funnelTeaser")}</p>
      <TestConnection />
      <div className="mt-6">
        <Link href="/onboarding" className="inline-flex h-10 px-4 items-center justify-center rounded-md bg-blue-600 text-white">
          {t("backToWizard")}
        </Link>
      </div>
    </div>
  );
}

function TestConnection() {
  const { t, lang } = useI18n();
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleTest = async () => {
    setLoading(true);
    setStatus("idle");
    setMessage("");
    
    try {
      // Get data from localStorage
      const tenantId = localStorage.getItem("robotice-tenant-id");
      const contactEmail = localStorage.getItem("robotice-contact-email");
      const orgName = localStorage.getItem("robotice-org-name");
      const language = localStorage.getItem("robotice-lang") || "es";

      if (!tenantId || !contactEmail || !orgName) {
        throw new Error("Missing tenant data. Please complete the onboarding process first.");
      }

      const isSpanish = language === "es";

      // Email templates based on language
      const testEmailSubject = isSpanish 
        ? "¡Esto es una prueba de LeadGen - Robotice.io! 🚀"
        : "This is a LeadGen test from Robotice.io! 🚀";
      
      const testEmailBody = isSpanish
        ? "¡Hola! Esta es una prueba de tu conexión con Gmail. Tu configuración de LeadGen está funcionando perfectamente. 🎉\n\n¡Bienvenido a Robotice! Tu sistema de generación de leads está listo para acelerar tu negocio."
        : "Hello! This is a test of your Gmail connection. Your LeadGen setup is working perfectly. 🎉\n\nWelcome to Robotice! Your lead generation system is ready to accelerate your business.";

      const adminSubject = "New Onboarding Completed - Robotice LeadGen";
      const adminBody = `New user completed onboarding:
- Email: ${contactEmail}
- Company: ${orgName}
- Language: ${language}
- Timestamp: ${new Date().toLocaleString()}
- Tenant ID: ${tenantId}`;

      // Send test email to user
      const testEmailRes = await apiPost("/email/send", {
        tenant_id: Number(tenantId),
        to: contactEmail,
        subject: testEmailSubject,
        body: testEmailBody
      });

      // Send admin notification
      const adminEmailRes = await apiPost("/email/send", {
        tenant_id: 1, // Admin tenant ID
        to: "jose@robotice.io",
        subject: adminSubject,
        body: adminBody
      });

      // Check both responses
      if (testEmailRes.ok && adminEmailRes.ok) {
        setStatus("success");
        setMessage(isSpanish ? "¡Emails enviados correctamente! Revisa tu bandeja." : "Emails sent successfully! Check your inbox.");
      } else {
        const testError = !testEmailRes.ok ? await testEmailRes.text() : null;
        const adminError = !adminEmailRes.ok ? await adminEmailRes.text() : null;
        
        if (testError && adminError) {
          throw new Error(`Both emails failed: ${testError} | ${adminError}`);
        } else if (testError) {
          throw new Error(`Test email failed: ${testError}`);
        } else if (adminError) {
          setStatus("success");
          setMessage(isSpanish ? "Email de prueba enviado, pero falló la notificación al admin." : "Test email sent, but admin notification failed.");
        } else {
          throw new Error("Unknown error occurred");
        }
      }
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : t("failedToSendTest"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        className="w-full h-10 px-4 rounded-md border border-blue-600 text-blue-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        disabled={loading}
        onClick={handleTest}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 border-2 border-blue-600/70 border-t-transparent rounded-full animate-spin" />
            <span>{t("sending")}...</span>
          </>
        ) : (
          <span>{t("sendTestEmail")}</span>
        )}
      </button>
      
      {status === "success" && (
        <div className="mt-3 text-sm text-green-600 text-center">
          {message}
        </div>
      )}
      
      {status === "error" && (
        <div className="mt-3 text-sm text-red-600 text-center">
          {message}
        </div>
      )}
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
      <img src="/icon.png" alt="Robotice" className="w-6 h-6 rounded" />
    </div>
  );
}


