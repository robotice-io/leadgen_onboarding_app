"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";

type PlanKey = "starter" | "core" | "pro" | "enterprise";

export default function CheckoutPage() {
  const { t, lang } = useI18n();
  let plan = "starter" as PlanKey;
  try {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const p = new URLSearchParams(search);
    plan = ((p.get("plan") as PlanKey) || "starter");
  } catch {}

  const planMeta = useMemo(() => getPlanMeta(plan, lang), [plan, lang]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{t("checkout.page.title")}</h1>
          <p className="text-white/70 mt-2">{t("checkout.page.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Plan summary */}
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

          {/* MP Brick placeholder */}
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 md:p-8">
            <div className="min-h-[360px] grid place-items-center text-center">
              <div>
                <div id="mp-checkout-brick" className="h-[280px] w-full" />
                <p className="text-white/60 text-sm mt-4">{t("checkout.brick.placeholder")}</p>
                <p className="text-white/50 text-xs mt-1">{t("checkout.secured.by")}</p>
              </div>
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
    enterprise: lang === "es" ? "Enterprise" : "Enterprise",
  };
  const prices: Record<PlanKey, string> = {
    starter: lang === "es" ? "CLP 390.000 / mes" : "CLP 390,000 / mo",
    core: lang === "es" ? "CLP 790.000 / mes" : "CLP 790,000 / mo",
    pro: lang === "es" ? "CLP 1.490.000 / mes" : "CLP 1,490,000 / mo",
    enterprise: lang === "es" ? "A medida" : "Custom",
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
  return { title: titles[plan], priceText: prices[plan], features: featuresByPlan[plan], badge } as const;
}
