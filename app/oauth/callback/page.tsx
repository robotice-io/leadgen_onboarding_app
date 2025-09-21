"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, getAppBaseUrl } from "@/lib/api";
import Link from "next/link";

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
        const resCb = await apiGet(`/api/v1/oauth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(shownRedirect)}`);
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

  if (status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-black/70 dark:text-white/70">Procesando autenticación…</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="space-y-3 text-center">
          <div className="text-red-600">Error: {error}</div>
          <Link className="underline" href="/onboarding">Volver al asistente</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="space-y-3 text-center">
        <div className="text-green-700">¡Conectado con Google!</div>
        <Link className="underline" href="/onboarding">Volver al asistente</Link>
      </div>
    </div>
  );
}


