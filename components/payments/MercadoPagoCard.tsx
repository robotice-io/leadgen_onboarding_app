"use client";

import { useEffect, useMemo, useState } from "react";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";

export function MercadoPagoCard({ amount, plan, locale, email }: { amount: number; plan: string; locale?: string; email?: string }) {
  const [result, setResult] = useState<{ id?: string; status?: string; status_detail?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);

  const loc = useMemo(() => (locale || "es-CL") as any, [locale]);

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || (process.env as any).NEXT_PUBLIC_MP_PUBLIC_KEY_PROD;
    if (!pk) { setError("Mercado Pago not configured"); return; }
    try { initMercadoPago(pk, { locale: loc }); setReady(true); } catch (e: any) { setError(e?.message || "Failed to init Mercado Pago"); }
  }, [loc]);

  return (
    <div>
      {!result && ready && !error && (
        <CardPayment
          locale={loc}
          initialization={{ amount, payer: email ? { email } : undefined }}
          customization={{
            paymentMethods: { maxInstallments: 1 },
            visual: { style: { theme: "dark" as const } },
          }}
          onSubmit={async (formData) => {
            setError(null);
            try {
              // Map Brick formData to our bridge payload
              const payload = {
                token: (formData as any)?.token,
                transaction_amount: Number(amount || 0),
                description: `LeadGen ${String(plan).toUpperCase()} plan`,
                installments: Number((formData as any)?.installments || 1),
                payment_method_id: (formData as any)?.payment_method_id,
                payer: {
                  email: (formData as any)?.payer?.email || email,
                  identification: (formData as any)?.payer?.identification,
                },
              };

              const res = await fetch('/api/bridge/api/v1/billing/mp/payments', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(data?.error || data?.message || 'Payment failed');
              setResult({ id: data?.id, status: data?.status, status_detail: data?.status_detail });
              return data;
            } catch (e: any) {
              const msg = e?.message || 'Payment failed';
              setError(msg);
              throw e; // allow Brick to keep the button state consistent
            }
          }}
          onReady={() => {}}
          onError={(brErr) => {
            console.error('MercadoPago Card Brick error', brErr);
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
