"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { MpCoreForm } from "@/components/payments/MpCoreForm";
import { openCalendly } from "@/lib/calendly";

type PlanKey = "starter" | "core" | "pro" | "enterprise";

export default function CheckoutPage() {
  const { t, lang } = useI18n();
  const [plan, setPlan] = useState<PlanKey>(() => {
    try {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const p = new URLSearchParams(search);
      return ((p.get("plan") as PlanKey) || "starter");
    } catch { return "starter"; }
  });

  const planMeta = useMemo(() => getPlanMeta(plan, lang), [plan, lang]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || (process.env as any).NEXT_PUBLIC_MP_PUBLIC_KEY_PROD;
    if (!pk) setError("Mercado Pago not configured"); else setError(null);
  }, [plan, lang]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        {/* Back */}
        <div className="mb-6">
          <button
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
              else window.location.href = "/";
            }}
          >
            <span className="inline-block h-5 w-5 rotate-180">➔</span>
            Back
          </button>
        </div>
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{t("checkout.page.title")}</h1>
          <p className="text-white/70 mt-2">{t("checkout.page.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Plan picker + summary */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{planMeta.title}</h2>
                <p className="text-white/80">{planMeta.priceText}</p>
              </div>
              {planMeta.badge && (
                <span className="text-xs font-semibold rounded-full px-2.5 py-1 bg-blue-600">{planMeta.badge}</span>
              )}
            </div>

            {/* Vertical plan selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white/80">Choose your plan</div>
                <div className="flex gap-2">
                  <button className="h-8 w-8 grid place-items-center rounded-md border border-white/15 hover:bg-white/10" onClick={() => cyclePlan(-1, setPlan)} aria-label="Previous plan">▲</button>
                  <button className="h-8 w-8 grid place-items-center rounded-md border border-white/15 hover:bg-white/10" onClick={() => cyclePlan(1, setPlan)} aria-label="Next plan">▼</button>
                </div>
              </div>
              <div className="space-y-2">
                {(["starter","core","pro","enterprise"] as PlanKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setPlan(key)}
                    className={`w-full text-left rounded-xl px-4 py-3 border ${plan===key?"border-blue-500 bg-blue-500/10":"border-white/10 bg-white/5 hover:bg-white/10"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium capitalize">{getPlanMeta(key, lang).title}</div>
                      <div className="text-sm text-white/70">{getPlanMeta(key, lang).priceText}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-semibold text-white/80 mb-2">{t("checkout.plan.features")}</div>
              <ul className="space-y-2 text-sm">
                {planMeta.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            <div className="min-h-[380px]">
              {error && <div className="text-sm text-red-400">{error}</div>}

              {!error && (
                plan === "enterprise" ? (
                  <div className="flex flex-col items-center justify-center h-[280px] text-center">
                    <div className="text-2xl font-semibold">Free</div>
                    <p className="text-white/70 mt-1 mb-4">Schedule a call to activate</p>
                    <button onClick={() => openCalendly()} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500">Schedule a call</button>
                  </div>
                ) : (
                  <MpCoreForm amount={planMeta.amount} plan={plan} locale={lang === "es" ? "es-CL" : "es-CL"} />
                )
              )}

              <p className="text-white/50 text-xs mt-4">{t("checkout.secured.by")}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function getPlanMeta(plan: PlanKey, lang: "es" | "en") {
  const titles: Record<PlanKey, string> = {
    starter: lang === "es" ? "Starter" : "Starter",
    core: lang === "es" ? "Core" : "Core",
    pro: lang === "es" ? "Pro" : "Pro",
    enterprise: lang === "es" ? "Free — Schedule a call" : "Free — Schedule a call",
  };
  const prices: Record<PlanKey, string> = {
    starter: lang === "es" ? "CLP 390.000 / mes" : "CLP 390,000 / mo",
    core: lang === "es" ? "CLP 790.000 / mes" : "CLP 790,000 / mo",
    pro: lang === "es" ? "CLP 1.490.000 / mes" : "CLP 1,490,000 / mo",
    enterprise: lang === "es" ? "Gratis" : "Free",
  };
  const amounts: Record<PlanKey, number> = {
    starter: 390000,
    core: 790000,
    pro: 1490000,
    enterprise: 0,
  };
  const featuresBase = [
    lang === "es" ? "Envío desde tu cuenta OAuth" : "Sending from your OAuth account",
    lang === "es" ? "Copys por IA + revisión humana" : "AI copy + human review",
    lang === "es" ? "Dashboard y métricas en tiempo real" : "Dashboard & real‑time metrics",
  ];
  const featuresByPlan: Record<PlanKey, string[]> = {
    starter: [lang === "es" ? "3.000 leads verificados" : "3,000 verified leads", lang === "es" ? "3 plantillas IA" : "3 AI templates", ...featuresBase],
    core: [lang === "es" ? "5.000 leads verificados" : "5,000 verified leads", lang === "es" ? "Campañas + Contactos" : "Campaigns + Contacts", ...featuresBase],
    pro: [lang === "es" ? "8.000–12.000 leads" : "8,000–12,000 leads", lang === "es" ? "Reporting PDF + Integraciones CRM" : "PDF reporting + CRM integrations", ...featuresBase],
    enterprise: [lang === "es" ? "SLA garantizado" : "Guaranteed SLA", lang === "es" ? "Integraciones personalizadas" : "Custom integrations", ...featuresBase],
  };
  const badge = plan === "core" ? (lang === "es" ? "Más elegido" : "Most chosen") : undefined;
  return { title: titles[plan], priceText: prices[plan], features: featuresByPlan[plan], badge, amount: amounts[plan] } as const;
}

function cyclePlan(delta: number, setPlan: (p: PlanKey) => void) {
  const order: PlanKey[] = ["starter","core","pro","enterprise"];
  if (typeof window === "undefined") return;
  try {
    const search = new URLSearchParams(window.location.search);
    const cur = (search.get("plan") as PlanKey) || "starter";
    const idx = order.indexOf(cur);
    const next = order[(idx + delta + order.length) % order.length];
    // push state for UX
    search.set("plan", next);
    const url = `${window.location.pathname}?${search.toString()}`;
    window.history.replaceState({}, "", url);
    setPlan(next);
  } catch {
    // fallback just switch locally
    setPlan((delta > 0 ? "core" : "enterprise") as PlanKey);
  }
}
