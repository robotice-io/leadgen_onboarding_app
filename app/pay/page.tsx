"use client";

import { useEffect, useMemo, useState } from "react";
import { MercadoPagoCard } from "@/components/payments/MercadoPagoCard";
import { openCalendly } from "@/lib/calendly";

export default function PayPage() {
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const plan = (query.get("plan") || "starter").toLowerCase();
  const unitPrice = Number(query.get("price") || 1);

  // Redirect to the full two-column checkout with plan carousel (keeps this page as fallback)
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      params.set("plan", plan);
      params.set("price", String(unitPrice));
      const target = `/checkout?${params.toString()}`;
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/checkout")) {
        window.location.replace(target);
      }
    } catch {}
  }, [plan, unitPrice]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto px-6 py-14 md:py-20">
  <h1 className="text-3xl font-bold mb-2">Redirecting to checkout…</h1>
  <p className="text-white/70 mb-6">If this page doesn’t change, you can complete payment below.</p>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="min-h-[360px]">
            {error && <div className="text-sm text-red-400">{error}</div>}
            {!error && (
              plan === "enterprise" ? (
                <div className="flex flex-col items-center justify-center h-[280px] text-center">
                  <div className="text-2xl font-semibold">Free</div>
                  <p className="text-white/70 mt-1 mb-4">Schedule a call to activate</p>
                  <button onClick={() => openCalendly()} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500">Schedule a call</button>
                </div>
              ) : (
                <MercadoPagoCard amount={unitPrice} plan={plan} />
              )
            )}
            <p className="text-white/50 text-xs mt-4">Payment secured by Mercado Pago</p>
          </div>
        </section>
      </div>
    </main>
  );
}
