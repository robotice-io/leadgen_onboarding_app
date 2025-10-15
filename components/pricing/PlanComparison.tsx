"use client";
import { useI18n } from "@/lib/i18n";
import { useMemo, useState } from "react";
import { Check, X, CircleDashed } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { openCalendly } from "@/lib/calendly";

type PlanKey = "starter" | "core" | "pro" | "enterprise";

export function PlanComparison() {
  const { t, lang } = useI18n();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = useMemo(
    () => [
      { key: "starter" as PlanKey, name: t("landing.plans.card.starter.title" as any), priceMonthly: 390_000, priceYearly: Math.round(390_000 * 12 * 0.84) },
      { key: "core" as PlanKey, name: t("landing.plans.card.core.title" as any), priceMonthly: 790_000, priceYearly: Math.round(790_000 * 12 * 0.85) },
      { key: "pro" as PlanKey, name: t("landing.plans.card.pro.title" as any), priceMonthly: 1_490_000, priceYearly: Math.round(1_490_000 * 12 * 0.85) },
      { key: "enterprise" as PlanKey, name: t("landing.plans.card.enterprise.title" as any), priceMonthly: null, priceYearly: null },
    ],
    [t, lang]
  );

  const features = useMemo(
    () => [
      { label: lang === "es" ? "Leads verificados" : "Verified leads", values: { starter: "3,000", core: "5,000", pro: "8,000–12,000", enterprise: lang === "es" ? "Custom" : "Custom" } },
      { label: lang === "es" ? "Plantillas IA" : "AI templates", values: { starter: "3", core: "5", pro: "8", enterprise: lang === "es" ? "Custom" : "Custom" } },
      { label: lang === "es" ? "Campañas + Contactos" : "Campaigns + Contacts", values: { starter: false, core: true, pro: true, enterprise: true } },
      { label: lang === "es" ? "Dashboard" : "Dashboard", values: { starter: lang === "es" ? "Básico" : "Basic", core: lang === "es" ? "Avanzado" : "Advanced", pro: lang === "es" ? "Completo" : "Full", enterprise: lang === "es" ? "Completo" : "Full" } },
      { label: lang === "es" ? "Reporting PDF" : "PDF reporting", values: { starter: false, core: false, pro: true, enterprise: true } },
      { label: lang === "es" ? "Integraciones CRM" : "CRM integrations", values: { starter: false, core: false, pro: true, enterprise: true } },
      { label: lang === "es" ? "Multicanal" : "Multichannel", values: { starter: false, core: false, pro: true, enterprise: true } },
      { label: lang === "es" ? "SLA garantizado" : "Guaranteed SLA", values: { starter: false, core: false, pro: false, enterprise: true } },
      { label: lang === "es" ? "Soporte dedicado" : "Dedicated support", values: { starter: false, core: false, pro: true, enterprise: true } },
      { label: lang === "es" ? "APIs personalizadas" : "Custom APIs", values: { starter: false, core: false, pro: false, enterprise: true } },
    ],
    [lang]
  );

  const [active, setActive] = useState<PlanKey>("core");

  const ctaLabel = (key: PlanKey) => t(`landing.plans.card.${key}.cta` as any);

  // Desktop grid comparative
  const DesktopGrid = () => (
    <div className="hidden md:block overflow-x-auto pb-4 mx-auto md:w-3/4">
      <div className="min-w-[940px] grid grid-cols-[200px_repeat(4,1fr)] rounded-2xl border border-slate-700/40 bg-slate-800/30 backdrop-blur-md">
        {/* Header row (no sticky para ahorrar espacio visual) */}
        <div className="border-b border-slate-700/40"></div>
        {plans.map((p) => (
          <div key={p.key} className="border-b border-l border-slate-700/40 p-4 text-center">
            <h3 className="text-base font-semibold mb-0.5 leading-tight text-white">{p.name}</h3>
            {p.priceMonthly ? (
              <>
                <p className="text-white font-semibold text-lg leading-tight">
                  ${formatNumber(billing === "monthly" ? p.priceMonthly : (p.priceYearly as number), lang)}
                </p>
                <p className="text-white/80 text-[11px] leading-tight font-semibold">
                  {lang === "es" ? (billing === "monthly" ? "CLP/mes" : "CLP/año") : billing === "monthly" ? "CLP/mo" : "CLP/yr"}
                </p>
                {billing === "yearly" && (
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5">
                    {lang === "es" ? "Ahorra ~15%" : "Save ~15%"}
                  </span>
                )}
              </>
            ) : (
              <p className="text-white font-semibold text-lg leading-tight">{lang === "es" ? "A medida" : "Custom"}</p>
            )}
          </div>
        ))}

        {/* Feature rows */}
        {features.map((f, i) => (
          <>
            <div
              key={`label-${i}`}
              className={`px-3 py-2.5 min-h-[44px] ${i % 2 === 0 ? "bg-slate-800/40" : ""} border-t border-slate-700/20 text-white text-sm font-semibold hover:bg-slate-700/10 transition-colors`}
              title={f.label.includes("SLA") ? (lang === "es" ? "Tiempos de respuesta garantizados por contrato" : "Contractual response time guarantees") : f.label.includes("Multicanal") ? (lang === "es" ? "Email + LinkedIn + otros canales" : "Email + LinkedIn + other channels") : undefined}
            >
              {f.label}
            </div>
            {plans.map((p) => (
              <div
                key={`cell-${i}-${p.key}`}
                className={`px-3 py-2.5 min-h-[44px] text-center ${i % 2 === 0 ? "bg-slate-800/40" : ""} border-t border-l border-slate-700/20 hover:bg-slate-700/10 transition-colors`}
                title={typeof (f.values as any)[p.key] === "boolean" ? undefined : (f.label.includes("SLA") ? (lang === "es" ? "Tiempos de respuesta garantizados por contrato" : "Contractual response time guarantees") : f.label.includes("Multicanal") ? (lang === "es" ? "Email + LinkedIn + otros canales" : "Email + LinkedIn + other channels") : undefined)}
              >
                {typeof (f.values as any)[p.key] === "boolean" ? (
                  (f.values as any)[p.key] ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-slate-600 mx-auto" />
                  )
                ) : (f.values as any)[p.key] === "Custom" || (f.values as any)[p.key] === "Personalizado" ? (
                  <CircleDashed className="w-4 h-4 text-orange-400 mx-auto" />
                ) : (
                  <span className="text-white text-sm font-semibold">{(f.values as any)[p.key]}</span>
                )}
              </div>
            ))}
          </>
        ))}

        {/* CTA row */}
        <div className="px-3 py-3" />
        {plans.map((p) => (
          <div key={`cta-${p.key}`} className="px-3 py-3 border-t border-l border-slate-700/20 flex items-center justify-center">
            <button
              type="button"
              onClick={openCalendly}
              className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm"
            >
              {ctaLabel(p.key)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile: one column at a time with tabs
  const MobileTabs = () => (
    <div className="md:hidden">
      <div className="flex items-center justify-between gap-2 mb-4 overflow-x-auto">
        {plans.map((p) => (
          <button
            key={p.key}
            onClick={() => setActive(p.key)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg border transition-all duration-200 ${active === p.key ? "border-blue-500/60 bg-blue-500/15 text-white shadow-[0_0_0_2px_rgba(59,130,246,0.25)_inset]" : "border-slate-700/60 text-slate-300 hover:border-slate-500"}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {plans.filter((p) => p.key === active).map((p) => (
        <div key={p.key} className="rounded-2xl border border-slate-700/40 bg-slate-800/30 backdrop-blur-md">
          <div className="p-5 border-b border-slate-700/40">
            <div className="text-lg font-semibold text-white">{p.name}</div>
            <div className="text-white font-semibold text-2xl">
              {p.priceMonthly ? (
                <>
                  ${formatNumber(billing === "monthly" ? p.priceMonthly : (p.priceYearly as number), lang)}
                  <span className="ml-2 align-middle text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5">
                    {billing === "yearly" ? (lang === "es" ? "Ahorra ~15%" : "Save ~15%") : ""}
                  </span>
                </>
              ) : (lang === "es" ? "A medida" : "Custom")}
            </div>
            <div className="text-white text-xs font-semibold">{lang === "es" ? (billing === "monthly" ? "CLP/mes" : "CLP/año") : billing === "monthly" ? "CLP/mo" : "CLP/yr"}</div>
          </div>
          <div className="p-5">
            {features.map((f, i) => (
              <div key={`m-${i}`} className="py-3 border-t border-slate-700/40 flex items-center justify-between">
                <span className="text-white text-sm font-semibold">{f.label}</span>
                <span className="ml-4">
                  {typeof (f.values as any)[p.key] === "boolean" ? (
                    (f.values as any)[p.key] ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <X className="w-5 h-5 text-slate-600" />
                    )
                  ) : (f.values as any)[p.key] === "Custom" || (f.values as any)[p.key] === "Personalizado" ? (
                    <CircleDashed className="w-5 h-5 text-orange-400" />
                  ) : (
                    <span className="text-white font-semibold">{(f.values as any)[p.key]}</span>
                  )}
                </span>
              </div>
            ))}
            <div className="pt-5">
              <button
                type="button"
                onClick={openCalendly}
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white"
              >
                {ctaLabel(p.key)}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section id="comparison" className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">{t("pricing.comparison.heading")}</h2>
          <p className="text-slate-300 mt-1">{t("pricing.comparison.subtitle")}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/40 p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${billing === "monthly" ? "bg-blue-600 text-white" : "text-slate-300"}`}
            >
              {lang === "es" ? "Mensual" : "Monthly"}
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${billing === "yearly" ? "bg-blue-600 text-white" : "text-slate-300"}`}
            >
              {lang === "es" ? "Anual" : "Yearly"}
            </button>
          </div>
        </div>

        <DesktopGrid />
        <MobileTabs />
      </div>
    </section>
  );
}
