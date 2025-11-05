"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { loadMercadoPago } from "@mercadopago/sdk-js";

export function MercadoPagoCard({ amount, plan, locale, email }: { amount: number; plan: string; locale?: string; email?: string }) {
  const [result, setResult] = useState<{ id?: string; status?: string; status_detail?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const extRefRef = useRef<string | undefined>(undefined);
  const mountedRef = useRef<boolean>(false);
  const useJsFallback = useRef<boolean>(false);
  const brickControllerRef = useRef<any>(null);
  const [phase, setPhase] = useState<string>('init');

  const loc = useMemo(() => (locale || "es-CL") as any, [locale]);

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || (process.env as any).NEXT_PUBLIC_MP_PUBLIC_KEY_PROD;
    if (!pk) { setError("Mercado Pago not configured"); return; }
    try {
      initMercadoPago(pk, { locale: loc });
      try { console.log('[MP][Brick] initMercadoPago OK'); } catch {}
      setReady(true);
      setPhase('react-brick');
      // If nothing mounted within 2s, try JS fallback bricks
      const t = setTimeout(() => {
        if (!mountedRef.current) {
          useJsFallback.current = true;
          setReady(false); // stop rendering React brick
          setPhase('js-fallback');
          try { console.log('[MP][Brick] switching to JS fallback'); } catch {}
        }
      }, 2000);
      return () => clearTimeout(t);
    } catch (e: any) { setError(e?.message || "Failed to init Mercado Pago"); }
  }, [loc]);

  return (
    <div>
      {/* React Brick path */}
      {!result && ready && !error && !useJsFallback.current && (
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
              // Build/persist a stable external reference per session
              if (!extRefRef.current) {
                try {
                  const key = 'mp_external_reference';
                  const existing = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
                  if (existing) {
                    extRefRef.current = existing;
                  } else {
                    const tenantId = typeof window !== 'undefined' ? window.localStorage.getItem('robotice-tenant-id') : null;
                    const generated = `lg-${tenantId || 'anon'}-${String(plan).toLowerCase()}-${Date.now()}`;
                    extRefRef.current = generated;
                    if (typeof window !== 'undefined') window.localStorage.setItem(key, generated);
                  }
                } catch {}
              }

              // Map Brick formData to our bridge payload
              const payload = {
                token: (formData as any)?.token,
                transaction_amount: Number(amount || 0),
                description: `LeadGen ${String(plan).toUpperCase()} plan`,
                installments: Number((formData as any)?.installments || 1),
                payment_method_id: (formData as any)?.payment_method_id,
                issuer_id: (formData as any)?.issuer_id,
                three_d_secure_mode: 'optional' as const,
                external_reference: extRefRef.current,
                payer: {
                  email: (formData as any)?.payer?.email || email,
                  identification: (formData as any)?.payer?.identification,
                },
                // additional redundancy to help upstream mapping
                payer_email: (formData as any)?.payer?.email || email,
                payer_first_name: (formData as any)?.payer?.first_name,
                payer_last_name: (formData as any)?.payer?.last_name,
                payer_identification_type: (formData as any)?.payer?.identification?.type,
                payer_identification_number: (formData as any)?.payer?.identification?.number,
                additional_info: {
                  items: [
                    { quantity: 1, category_id: 'services', title: `LeadGen ${String(plan).toUpperCase()}`, unit_price: Number(amount || 0) },
                  ],
                },
              };

              try {
                // eslint-disable-next-line no-console
                console.log('[MP][Brick] payload snapshot', {
                  payment_method_id: payload.payment_method_id,
                  issuer_id: payload.issuer_id,
                  installments: payload.installments,
                  payer: { email: payload.payer.email, identification: payload.payer.identification },
                  external_reference: payload.external_reference,
                });
              } catch {}

              const res = await fetch('/api/bridge/api/v1/billing/mp/payments', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
              });
              const proxyTarget = res.headers.get('x-proxy-target');
              const data = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(data?.error || data?.message || 'Payment failed');
              setResult({ id: data?.id, status: data?.status, status_detail: data?.status_detail });
              try { console.log('[MP][Brick] payment response', { id: data?.id, status: data?.status, status_detail: data?.status_detail, proxyTarget }); } catch {}
              // Redirect flow on approved payments: survey -> onboarding
              if (String(data?.status) === 'approved') {
                const surveyUrl = `/precheckout/survey?plan=${encodeURIComponent(String(plan))}&next=${encodeURIComponent('/onboarding')}`;
                window.location.href = surveyUrl;
              }
              return data;
            } catch (e: any) {
              const msg = e?.message || 'Payment failed';
              setError(msg);
              throw e; // allow Brick to keep the button state consistent
            }
          }}
          onReady={() => { mountedRef.current = true; setPhase('react-mounted'); }}
          onError={(brErr) => {
            console.error('MercadoPago Card Brick error', brErr);
            setError(brErr?.message || 'Brick error');
          }}
        />
      )}

      {/* JS fallback Brick (mounts into a div) */}
      {!result && !error && useJsFallback.current && (
        <div id="mp-card-brick-fallback" className="min-h-[280px]">
          <FallbackBrick
            amount={amount}
            plan={plan}
            locale={loc}
            email={email}
            onMounted={() => { mountedRef.current = true; }}
            onError={(msg) => setError(msg)}
          />
        </div>
      )}

      {!result && !error && (
        <div className="text-xs text-white/50 mt-2">{phase === 'react-brick' ? 'Loading payment form…' : phase === 'js-fallback' ? 'Loading fallback payment form…' : null}</div>
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

// Lightweight fallback using sdk-js bricksBuilder
function FallbackBrick({ amount, plan, locale, email, onMounted, onError }: { amount: number; plan: string; locale: string; email?: string; onMounted: () => void; onError: (msg: string) => void }) {
  const extRefRef = useRef<string | undefined>(undefined);
  const ctrlRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || (process.env as any).NEXT_PUBLIC_MP_PUBLIC_KEY_PROD;
      if (!pk) { onError('Mercado Pago not configured'); return; }
      try {
        await loadMercadoPago();
        // @ts-ignore
        const mp = new window.MercadoPago(pk, { locale });
        const bricksBuilder = mp.bricks();
        if (!extRefRef.current) {
          try {
            const key = 'mp_external_reference';
            const existing = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
            if (existing) extRefRef.current = existing; else {
              const tenantId = typeof window !== 'undefined' ? window.localStorage.getItem('robotice-tenant-id') : null;
              const generated = `lg-${tenantId || 'anon'}-${String(plan).toLowerCase()}-${Date.now()}`;
              extRefRef.current = generated;
              if (typeof window !== 'undefined') window.localStorage.setItem(key, generated);
            }
          } catch {}
        }
        ctrlRef.current = await bricksBuilder.create('cardPayment', 'mp-card-brick-fallback', {
          initialization: { amount, payer: email ? { email } : undefined },
          callbacks: {
            onReady: () => onMounted(),
            onError: (e: any) => onError(e?.message || 'Brick error'),
            onSubmit: async (formData: any) => {
              try {
                const payload = {
                  token: formData?.token,
                  transaction_amount: Number(amount || 0),
                  description: `LeadGen ${String(plan).toUpperCase()} plan`,
                  installments: Number(formData?.installments || 1),
                  payment_method_id: formData?.payment_method_id ?? formData?.paymentMethodId,
                  issuer_id: formData?.issuer_id ?? formData?.issuerId,
                  three_d_secure_mode: 'optional' as const,
                  external_reference: extRefRef.current,
                  payer: { email: formData?.payer?.email || email, identification: formData?.payer?.identification },
                };
                const res = await fetch('/api/bridge/api/v1/billing/mp/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const text = await res.text();
                let data: any = {}; try { data = JSON.parse(text); } catch {}
                if (!res.ok) throw new Error((data?.error || data?.message || text || 'Payment failed'));
                if (String(data?.status) === 'approved') {
                  const surveyUrl = `/precheckout/survey?plan=${encodeURIComponent(String(plan))}&next=${encodeURIComponent('/onboarding')}`;
                  window.location.href = surveyUrl;
                }
                return Promise.resolve();
              } catch (e: any) {
                onError(e?.message || 'Payment failed');
                throw e;
              }
            }
          }
        });
      } catch (e: any) {
        onError(e?.message || 'Failed to load Mercado Pago');
      }
    })();
    return () => { try { ctrlRef.current?.unmount?.(); } catch {} };
  }, [amount, plan, locale, email, onMounted, onError]);

  return null;
}
