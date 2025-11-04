"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { getAppBaseUrl } from "@/lib/api";

export default function PayPage() {
  const [prefId, setPrefId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inited = useRef(false);

  const query = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const plan = (query.get("plan") || "starter").toLowerCase();
  const unitPrice = Number(query.get("price") || 49);

  useEffect(() => {
  const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || (process.env as any).NEXT_PUBLIC_MP_PUBLIC_KEY_PROD;
    if (!pk) {
      setError("Mercado Pago not configured");
      return;
    }
    if (!inited.current) {
      try { initMercadoPago(pk, { locale: "es-CL" }); } catch {}
      inited.current = true;
    }

    (async () => {
      try {
        setError(null);
        const tenantId = typeof window !== "undefined" ? localStorage.getItem("robotice-tenant-id") : null;
        if (!tenantId) throw new Error("Missing tenant context");
        const base = getAppBaseUrl() || (typeof window !== "undefined" ? window.location.origin : "");
        const res = await fetch("/api/bridge/api/v1/billing/mp/preference", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json", "X-Tenant-ID": String(tenantId) },
          body: JSON.stringify({
            tenant_id: Number(tenantId),
            plan,
            unit_price: unitPrice,
            success_url: `${base}/pay/success?plan=${encodeURIComponent(plan)}`,
            cancel_url: `${base}/pay/cancel`,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || data?.message || "Failed to create preference");
        if (!data?.preference_id) throw new Error("Missing preference id");
        setPrefId(String(data.preference_id));
      } catch (e: any) {
        setError(e?.message || "Failed to initialize payment");
      }
    })();
  }, [plan, unitPrice]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto px-6 py-14 md:py-20">
        <h1 className="text-3xl font-bold mb-2">Complete your payment</h1>
        <p className="text-white/70 mb-6">You're almost there. Finish checkout to unlock onboarding.</p>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="min-h-[360px]">
            {error && (
              <div className="text-sm text-red-400">{error}</div>
            )}
            {!error && prefId && (
              <Wallet initialization={{ preferenceId: prefId }} />
            )}
            {!error && !prefId && (
              <div className="h-[280px] grid place-items-center text-center text-white/70">Preparing checkout…</div>
            )}
            <p className="text-white/50 text-xs mt-4">Payment secured by Mercado Pago</p>
          </div>
        </section>
      </div>
    </main>
  );
}
