"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiPost } from "@/lib/api";

// Minimal typed window for MP SDK
declare global {
  interface Window { MercadoPago?: any }
}

export function MpCoreForm({ amount, plan, locale }: { amount: number; plan: string; locale?: string }) {
  const [mp, setMp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fieldsReady, setFieldsReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | null>(null);

  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const [installments, setInstallments] = useState<number>(1);
  const [installmentOptions, setInstallmentOptions] = useState<Array<{ label: string; value: number }>>([]);
  const [idTypes, setIdTypes] = useState<Array<{ id: string; name: string }>>([]);
  const [issuerId, setIssuerId] = useState<string | undefined>(undefined);
  const [issuers, setIssuers] = useState<Array<{ id: string; name: string }>>([]);
  const requireIssuer = (process.env.NEXT_PUBLIC_MP_REQUIRE_ISSUER || '').toString() === 'true';

  const refs = useRef<{ cardNumber?: any; exp?: any; cvc?: any } | null>(null);
  const binTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentBinRef = useRef<string | undefined>(undefined);
  const extRefRef = useRef<string | undefined>(undefined);

  const defaultEmail = useMemo(() => {
    try {
      const uStr = localStorage.getItem("robotice_user");
      if (uStr) { const u = JSON.parse(uStr); return String(u?.email || ""); }
    } catch {}
    return "";
  }, []);

  // Inputs (controlled by DOM nodes, we just read on submit)
  const [email, setEmail] = useState(defaultEmail);
  const [holderName, setHolderName] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || (process.env as any).NEXT_PUBLIC_MP_PUBLIC_KEY_PROD;
    if (!pk) { setError("Mercado Pago not configured"); setLoading(false); return; }

    // Load SDK v2 script once
    if (window.MercadoPago) {
      init(window.MercadoPago);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => init(window.MercadoPago);
    script.onerror = () => { setError("Failed to load Mercado Pago SDK"); setLoading(false); };
    document.head.appendChild(script);

    function init(MP: any) {
      try {
        const instance = new MP(pk, { locale: locale || "es-CL" });
        setMp(instance);
        setupFields(instance);
        fetchBasics(instance);
      } catch (e: any) {
        setError(e?.message || "Failed to initialize Mercado Pago");
        setLoading(false);
      }
    }

    async function fetchBasics(instance: any) {
      try {
        const types = await instance.getIdentificationTypes();
        const list = (types && Array.isArray(types) ? types : []) as Array<{ id: string; name: string }>;
        setIdTypes(list.length ? list : [{ id: 'RUT', name: 'RUT' }]);
      } catch {
        // fallback for CL
        setIdTypes([{ id: 'RUT', name: 'RUT' }]);
      }
    }

    async function setupFields(instance: any) {
      try {
  const cardNumber = instance.fields.create('cardNumber', { placeholder: '•••• •••• •••• ••••' }).mount('mp-card-number');
  const expiration = instance.fields.create('expirationDate', { placeholder: 'MM/YY' }).mount('mp-expiration');
  const security = instance.fields.create('securityCode', { placeholder: 'CVC' }).mount('mp-cvc');
  refs.current = { cardNumber, exp: expiration, cvc: security };
  setFieldsReady(true);

        // Listen BIN changes to get payment method and installments
        cardNumber.on('binChange', ({ bin }: any) => {
          if (!bin || bin === currentBinRef.current) return;
          currentBinRef.current = bin;
          if (binTimer.current) clearTimeout(binTimer.current);
          binTimer.current = setTimeout(async () => {
            try {
              const pm = await instance.getPaymentMethods({ bin });
              const method = (pm?.results && pm.results[0]) ? pm.results[0] : null;
              if (method?.id) setPaymentMethodId(method.id);

              // Fetch issuers for this payment method + bin
              try {
                const issuerRes = method?.id ? await instance.getIssuers({ paymentMethodId: method.id, bin }) : [];
                const issuerList: Array<{ id: string; name: string }> = Array.isArray(issuerRes) ? issuerRes.map((i: any) => ({ id: String(i?.id), name: String(i?.name || i?.processing_mode || 'Issuer') })) : [];
                setIssuers(issuerList);
                if (issuerList.length === 1) {
                  setIssuerId(issuerList[0].id);
                } else {
                  setIssuerId(undefined);
                }
              } catch {
                setIssuers([]);
                setIssuerId(undefined);
              }

              const inst = await instance.getInstallments({ amount: amount || 0, bin, paymentTypeId: 'credit_card', issuerId: issuerId || undefined });
              const costs = (inst && inst[0]?.payer_costs) || [];
              const options = costs.map((c: any) => ({ label: c.recommended_message || `${c.installments} x`, value: Number(c.installments || 1) }));
              setInstallmentOptions(options.length ? options : [{ label: '1 cuota', value: 1 }]);
              setInstallments(options[0]?.value || 1);
            } catch (e) {
              setInstallmentOptions([{ label: '1 cuota', value: 1 }]);
              setInstallments(1);
            }
          }, 180);
        });
      } catch (e: any) {
        setError(e?.message || 'Failed to mount card fields');
      } finally {
        setLoading(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, locale]);

  // Recalculate installments when issuer changes (and BIN available)
  useEffect(() => {
    const bin = currentBinRef.current;
    if (!mp || !bin) return;
    (async () => {
      try {
        const inst = await mp.getInstallments({ amount: amount || 0, bin, paymentTypeId: 'credit_card', issuerId: issuerId || undefined });
        const costs = (inst && inst[0]?.payer_costs) || [];
        const options = costs.map((c: any) => ({ label: c.recommended_message || `${c.installments} x`, value: Number(c.installments || 1) }));
        setInstallmentOptions(options.length ? options : [{ label: '1 cuota', value: 1 }]);
        setInstallments(options[0]?.value || 1);
      } catch {
        // keep existing
      }
    })();
  }, [issuerId, mp, amount]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!mp) return;
    setError(null);
    setStatus(null);
    setStatusDetail(null);
    setSubmitting(true);

    // Required values before tokenization
    if (!holderName?.trim() || !idType || !idNumber?.trim()) {
      setError('Please complete cardholder and ID information');
      setSubmitting(false);
      return;
    }

    try {
      const tokenData = await mp.fields.createCardToken({
        cardholderName: holderName.trim(),
        identificationType: idType,
        identificationNumber: idNumber.trim(),
      });
      const token = tokenData?.id;
      if (!token) throw new Error('Failed to tokenize card');
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[MP] token created', tokenData);
      }
      if (typeof document !== 'undefined') {
        const hidden = document.getElementById('token') as HTMLInputElement | null;
        if (hidden) hidden.value = token;
      }

      const tenantId = typeof window !== 'undefined' ? localStorage.getItem('robotice-tenant-id') : null;

      // Build a stable external reference for this order attempt (persist per session if absent)
      if (!extRefRef.current) {
        try {
          const key = 'mp_external_reference';
          const existing = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
          if (existing) {
            extRefRef.current = existing;
          } else {
            const generated = `lg-${tenantId || 'anon'}-${String(plan).toLowerCase()}-${Date.now()}`;
            extRefRef.current = generated;
            if (typeof window !== 'undefined') window.localStorage.setItem(key, generated);
          }
        } catch {}
      }

      const payload = {
        token,
        transaction_amount: Number(amount || 0),
        description: `LeadGen ${String(plan).toUpperCase()} plan`,
        installments: Number(installments || 1),
        payment_method_id: paymentMethodId || undefined,
        issuer_id: issuerId ? (isNaN(Number(issuerId)) ? issuerId : Number(issuerId)) as any : undefined,
        three_d_secure_mode: 'optional' as const,
        external_reference: extRefRef.current,
        payer: {
          email: email,
          identification: idType && idNumber ? { type: idType, number: idNumber } : undefined,
          first_name: holderName?.split(' ')?.[0] || undefined,
          last_name: holderName?.split(' ')?.slice(1).join(' ') || undefined,
        },
        // Redundant flattened fields (defensive): in case upstream service maps from flat keys
        payer_email: email || undefined,
        payer_first_name: holderName?.split(' ')?.[0] || undefined,
        payer_last_name: holderName?.split(' ')?.slice(1).join(' ') || undefined,
        payer_identification_type: idType || undefined,
        payer_identification_number: idNumber || undefined,
        // Enrich for risk scoring
        additional_info: {
          items: [
            {
              quantity: 1,
              category_id: 'services',
              title: `LeadGen ${String(plan).toUpperCase()}`,
              unit_price: Number(amount || 0),
            },
          ],
        },
      };

      // Quick client logging for diagnosis
      try {
        // eslint-disable-next-line no-console
        console.log('[MP] sending payload snapshot', {
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
      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      if (!res.ok) {
        const msg = data?.error || data?.message || `Payment failed (${res.status})`;
        const detail = proxyTarget ? ` — upstream: ${proxyTarget}` : '';
        throw new Error(`${msg}${detail}`);
      }

      setStatus(data?.status || 'unknown');
      setStatusDetail(data?.status_detail || '');

      try {
        // eslint-disable-next-line no-console
        console.log('[MP] payment response', { id: data?.id, status: data?.status, status_detail: data?.status_detail });
      } catch {}

      // Best-effort: mark paid on approved
      try {
        if (String(data?.status) === 'approved' && tenantId) {
          await apiPost('/billing/mp/mark-paid', {
            tenant_id: Number(tenantId),
            provider: 'mercadopago',
            amount: Number(amount || 0),
            currency: 'CLP',
            reference: String(data?.id || data?.payment_id || 'mp_unknown'),
          });
        }
      } catch {}
    } catch (e: any) {
      console.error('Token/payment error:', e?.error || e?.message, (e as any)?.cause || e);
      setError(e?.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id="form-checkout" onSubmit={handleSubmit} noValidate>
      {/* Custom form */}
      <div className="grid gap-4">
        {/* Top inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1">Cardholder name</label>
            <input value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="John Doe" className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm" />
          </div>
        </div>
        {/* Identification & installments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1">ID Type</label>
            <select value={idType} onChange={(e) => setIdType(e.target.value)} className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm">
              <option value="">Select</option>
              {idTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">ID Number</label>
            <input
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.trimStart())}
              inputMode="text"
              className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Installments</label>
            <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))} className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm">
              {(installmentOptions.length ? installmentOptions : [{label:'1 cuota', value:1}]).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Issuer selector when multiple available */}
        {issuers.length > 1 && (
          <div>
            <label className="block text-xs text-white/60 mb-1">Issuer</label>
            <select value={issuerId || ''} onChange={(e) => setIssuerId(e.target.value || undefined)} className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm">
              <option value="">Select issuer</option>
              {issuers.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-xs text-white/60 mb-1">Card number</label>
          {/* Mercado Pago field containers sometimes render a tall iframe; hide overflow to avoid overlaying other inputs */}
          <div id="mp-card-number" className="h-12 rounded-md bg-black/40 border border-white/10 px-3 grid items-center overflow-hidden" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1">Expiration</label>
            <div id="mp-expiration" className="h-12 rounded-md bg-black/40 border border-white/10 px-3 grid items-center overflow-hidden" />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">CVC</label>
            <div id="mp-cvc" className="h-12 rounded-md bg-black/40 border border-white/10 px-3 grid items-center overflow-hidden" />
          </div>
        </div>
        <input id="token" name="token" type="hidden" />
        <button type="submit" disabled={loading || submitting || !fieldsReady || !holderName.trim() || !email.trim() || !idType || !idNumber.trim() || (requireIssuer && issuers.length > 1 && !issuerId)} className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Loading…' : submitting ? 'Processing…' : `Pay ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount)}`}
        </button>
      </div>

      {error && <div className="text-sm text-red-400 mt-3">{error}</div>}
      {status && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 mt-4">
          <div className="text-sm text-white/80">Payment result</div>
          <div className="mt-1 text-white">Status: <span className="font-semibold capitalize">{status}</span></div>
          {statusDetail && <div className="text-white/70 text-xs mt-1">{statusDetail}</div>}
          {status === 'pending' && statusDetail === 'pending_challenge' && (
            <div className="text-xs text-white/60 mt-2">Additional verification required. If your bank prompts a 3D Secure challenge, follow the instructions. You'll remain on this page.</div>
          )}
          {status === 'approved' && (
            <button onClick={() => (window.location.href = '/onboarding')} className="mt-3 px-3 py-1.5 rounded-md bg-green-600 text-sm">Continue to onboarding</button>
          )}
        </div>
      )}
    </form>
  );
}
