"use client";

import { useMemo, useState } from "react";
import { MpCoreForm } from "@/components/payments/MpCoreForm";
import { openCalendly } from "@/lib/calendly";

export default function PayPage() {
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const plan = (query.get("plan") || "starter").toLowerCase();
  const unitPrice = Number(query.get("price") || 49);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto px-6 py-14 md:py-20">
        <h1 className="text-3xl font-bold mb-2">Complete your payment</h1>
        <p className="text-white/70 mb-6">You're almost there. Finish checkout to unlock onboarding.</p>
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
                <MpCoreForm amount={unitPrice} plan={plan} />
              )
            )}
            <p className="text-white/50 text-xs mt-4">Payment secured by Mercado Pago</p>
          </div>
        </section>
      </div>
    </main>
  );
}
