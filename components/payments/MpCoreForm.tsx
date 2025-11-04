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
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | null>(null);

  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const [installments, setInstallments] = useState<number>(1);
  const [installmentOptions, setInstallmentOptions] = useState<Array<{ label: string; value: number }>>([]);
  const [idTypes, setIdTypes] = useState<Array<{ id: string; name: string }>>([]);

  const refs = useRef<{ cardNumber?: any; exp?: any; cvc?: any } | null>(null);

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
        setIdTypes(types || []);
      } catch {}
    }

    async function setupFields(instance: any) {
      try {
        const cardNumber = instance.fields.create('cardNumber', { placeholder: '•••• •••• •••• ••••' }).mount('mp-card-number');
        const expiration = instance.fields.create('expirationDate', { placeholder: 'MM/YY' }).mount('mp-expiration');
        const security = instance.fields.create('securityCode', { placeholder: 'CVC' }).mount('mp-cvc');
        refs.current = { cardNumber, exp: expiration, cvc: security };

        // Listen BIN changes to get payment method and installments
        let currentBin: string | undefined;
        cardNumber.on('binChange', async ({ bin }: any) => {
          if (!bin || bin === currentBin) return;
          currentBin = bin;
          try {
            const pm = await instance.getPaymentMethods({ bin });
            const method = (pm?.results && pm.results[0]) ? pm.results[0] : null;
            if (method?.id) setPaymentMethodId(method.id);
            // Installments for given amount+bin
            const inst = await instance.getInstallments({ amount: amount || 0, bin, paymentTypeId: 'credit_card' });
            const costs = (inst && inst[0]?.payer_costs) || [];
            setInstallmentOptions(costs.map((c: any) => ({ label: c.recommended_message || `${c.installments} x`, value: Number(c.installments || 1) })));
            setInstallments(costs[0]?.installments ? Number(costs[0].installments) : 1);
          } catch (e) {
            // silent fail; user can still try 1 installment
            setInstallmentOptions([{ label: '1 cuota', value: 1 }]);
            setInstallments(1);
          }
        });
      } catch (e: any) {
        setError(e?.message || 'Failed to mount card fields');
      } finally {
        setLoading(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, locale]);

  async function handlePay() {
    if (!mp) return;
    setError(null);
    setStatus(null);
    setStatusDetail(null);
    try {
      const tokenData = await mp.fields.createCardToken({
        cardholderName: holderName,
        identificationType: idType,
        identificationNumber: idNumber,
      });
      const token = tokenData?.id;
      if (!token) throw new Error('Failed to tokenize card');
      const tenantId = typeof window !== 'undefined' ? localStorage.getItem('robotice-tenant-id') : null;

      const payload = {
        token,
        transaction_amount: Number(amount || 0),
        description: `LeadGen ${String(plan).toUpperCase()} plan`,
        installments: Number(installments || 1),
        payment_method_id: paymentMethodId || undefined,
        payer: {
          email: email,
          identification: idType && idNumber ? { type: idType, number: idNumber } : undefined,
        }
      };

      // Use server bridge to inject X-API-Key
      const res = await fetch('/api/bridge/api/v1/billing/mp/payments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || 'Payment failed');

      setStatus(data?.status || 'unknown');
      setStatusDetail(data?.status_detail || '');

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
      setError(e?.message || 'Payment failed');
    }
  }

  return (
    <div>
      {/* Custom form */}
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1">Cardholder name</label>
            <input value={holderName} onChange={(e) => setHolderName(e.target.value)} placeholder="John Doe" className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1">ID Type</label>
            <select value={idType} onChange={(e) => setIdType(e.target.value)} className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm">
              <option value="">Select</option>
              {idTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">ID Number</label>
            <input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm" />
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
        <div>
          <label className="block text-xs text-white/60 mb-1">Card number</label>
          <div id="mp-card-number" className="h-10 rounded-md bg-black/40 border border-white/10 px-3 grid items-center" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1">Expiration</label>
            <div id="mp-expiration" className="h-10 rounded-md bg-black/40 border border-white/10 px-3 grid items-center" />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">CVC</label>
            <div id="mp-cvc" className="h-10 rounded-md bg-black/40 border border-white/10 px-3 grid items-center" />
          </div>
        </div>
        <button disabled={loading} onClick={handlePay} className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Loading…' : `Pay ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount)}`}
        </button>
      </div>

      {error && <div className="text-sm text-red-400 mt-3">{error}</div>}
      {status && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 mt-4">
          <div className="text-sm text-white/80">Payment result</div>
          <div className="mt-1 text-white">Status: <span className="font-semibold capitalize">{status}</span></div>
          {statusDetail && <div className="text-white/70 text-xs mt-1">{statusDetail}</div>}
          {status === 'approved' && (
            <button onClick={() => (window.location.href = '/onboarding')} className="mt-3 px-3 py-1.5 rounded-md bg-green-600 text-sm">Continue to onboarding</button>
          )}
        </div>
      )}
    </div>
  );
}
