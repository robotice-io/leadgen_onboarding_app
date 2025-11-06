"use client";

import { useEffect, useState } from "react";
import { apiPost } from "@/lib/api";

export default function PaySuccessPage() {
  const [status, setStatus] = useState<"marking" | "done" | "error">("marking");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
        const paymentId = params.get("payment_id") || params.get("collection_id") || undefined;
        const amount = Number(params.get("amount") || 0) || undefined;
        const currency = params.get("currency_id") || undefined;
        const tenantId = typeof window !== "undefined" ? localStorage.getItem("robotice-tenant-id") : null;
        if (!tenantId) throw new Error("Missing tenant context");
        await apiPost("/billing/mp/mark-paid", {
          tenant_id: Number(tenantId),
          provider: "mercadopago",
          amount: amount ?? 0,
          currency: currency ?? "USD",
          reference: paymentId ?? "mp_unknown",
        });
        setStatus("done");
        setMessage("Payment confirmed. Redirecting…");
        setTimeout(() => {
          window.location.href = "/onboarding/audience";
        }, 800);
      } catch (e: any) {
        setStatus("error");
        setMessage(e?.message || "Failed to confirm payment");
      }
    };
    run();
  }, []);

  return (
    <main className="min-h-[70vh] grid place-items-center bg-black text-white">
      <div className="text-center max-w-xl mx-auto px-6">
        <div className="mx-auto mb-6 h-14 w-14 rounded-full grid place-items-center bg-green-600/20 text-green-400">
          <span className="inline-block h-6 w-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <h1 className="text-3xl font-semibold">Payment success</h1>
        <p className="text-white/70 mt-2">{status === "marking" ? "Confirming your payment…" : message}</p>
      </div>
    </main>
  );
}
