"use client";

import { useState } from "react";
import { CardPayment } from "@mercadopago/sdk-react";

export function MercadoPagoCard({ amount, plan, locale, email }: { amount: number; plan: string; locale?: string; email?: string }) {
  const [result, setResult] = useState<{ id?: string; status?: string; status_detail?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {!result && (
        <CardPayment
          locale={locale as any}
          initialization={{ amount, payer: email ? { email } : undefined }}
          customization={{
            paymentMethods: {
              maxInstallments: 1,
            },
            visual: {
              style: {
                theme: "dark" as const,
              },
            },
          }}
          onSubmit={async (formData) => {
            setError(null);
            try {
              const res = await fetch("/api/payments/mp/create-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan, formData }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error || "Payment failed");
              setResult({ id: data.id, status: data.status, status_detail: data.status_detail });
              return data;
            } catch (e: any) {
              const msg = e?.message || "Payment failed";
              setError(msg);
              throw e; // let Brick handle UI state
            }
          }}
          onReady={() => {}}
          onError={(brErr) => {
            // SDK level errors
            console.error("MercadoPago Card Brick error", brErr);
          }}
        />
      )}

      {error && <div className="text-sm text-red-400 mt-3">{error}</div>}

      {result && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-white/80">Payment result</div>
          <div className="mt-1 text-white">Status: <span className="font-semibold capitalize">{result.status}</span></div>
          {result.id && (
            <div className="text-white/70 text-xs mt-1">ID: {result.id}</div>
          )}
          <button
            onClick={() => setResult(null)}
            className="mt-4 px-3 py-1.5 rounded-md bg-blue-600 text-sm"
          >
            Pay again
          </button>
        </div>
      )}
    </div>
  );
}
