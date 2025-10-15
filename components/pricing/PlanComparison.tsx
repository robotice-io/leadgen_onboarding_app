"use client";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, X, CircleDashed } from "lucide-react";

type PlanKey = "starter" | "core" | "pro" | "enterprise";

export function PlanComparison() {
  const { t, lang } = useI18n();

  const plans = useMemo(
    () => [
      { key: "starter" as PlanKey, name: t("landing.plans.card.starter.title" as any), price: "$390K", note: lang === "es" ? "CLP/mes" : "CLP/mo" },
      { key: "core" as PlanKey, name: t("landing.plans.card.core.title" as any), price: "$790K", note: lang === "es" ? "CLP/mes" : "CLP/mo" },
      { key: "pro" as PlanKey, name: t("landing.plans.card.pro.title" as any), price: "$1.49M", note: lang === "es" ? "CLP/mes" : "CLP/mo" },
      { key: "enterprise" as PlanKey, name: t("landing.plans.card.enterprise.title" as any), price: lang === "es" ? "A medida" : "Custom" },
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
    <div className="hidden md:block overflow-x-auto pb-4 -mx-4 md:mx-0">
      <div className="min-w-[940px] grid grid-cols-[200px_repeat(4,1fr)] rounded-2xl border border-slate-700/40 bg-slate-800/30 backdrop-blur-md">
        {/* Header row (no sticky para ahorrar espacio visual) */}
        <div className="border-b border-slate-700/40"></div>
        {plans.map((p) => (
          <div key={p.key} className="border-b border-l border-slate-700/40 p-4 text-center">
            <h3 className="text-base font-semibold mb-0.5 leading-tight">{p.name}</h3>
            <p className="text-blue-400 font-bold text-lg leading-tight">{p.price}</p>
            {p.note && <p className="text-slate-400 text-[11px] leading-tight">{p.note}</p>}
          </div>
        ))}

        {/* Feature rows */}
        {features.map((f, i) => (
          <>
            <div key={`label-${i}`} className={`px-3 py-2.5 min-h-[44px] ${i % 2 === 0 ? "bg-slate-800/40" : ""} border-t border-slate-700/20 text-slate-300 text-sm`}>{f.label}</div>
            {plans.map((p) => (
              <div
                key={`cell-${i}-${p.key}`}
                className={`px-3 py-2.5 min-h-[44px] text-center ${i % 2 === 0 ? "bg-slate-800/40" : ""} border-t border-l border-slate-700/20`}
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
                  <span className="text-slate-200 text-sm">{(f.values as any)[p.key]}</span>
                )}
              </div>
            ))}
          </>
        ))}

        {/* CTA row */}
        <div className="px-3 py-3" />
        {plans.map((p) => (
          <div key={`cta-${p.key}`} className="px-3 py-3 border-t border-l border-slate-700/20 flex items-center justify-center">
            <Link href="/login" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 font-semibold text-white text-sm">
              {ctaLabel(p.key)}
            </Link>
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
            className={`flex-shrink-0 px-3 py-2 rounded-lg border ${active === p.key ? "border-blue-500/60 bg-blue-500/10 text-white" : "border-slate-700/60 text-slate-300"}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {plans.filter((p) => p.key === active).map((p) => (
        <div key={p.key} className="rounded-2xl border border-slate-700/40 bg-slate-800/30 backdrop-blur-md">
          <div className="p-5 border-b border-slate-700/40">
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="text-blue-400 font-bold text-2xl">{p.price}</div>
            {p.note && <div className="text-slate-400 text-xs">{p.note}</div>}
          </div>
          <div className="p-5">
            {features.map((f, i) => (
              <div key={`m-${i}`} className="py-3 border-t border-slate-700/40 flex items-center justify-between">
                <span className="text-slate-400 text-sm">{f.label}</span>
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
                    <span className="text-slate-200 font-medium">{(f.values as any)[p.key]}</span>
                  )}
                </span>
              </div>
            ))}
            <div className="pt-5">
              <Link href="/login" className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white">
                {ctaLabel(p.key)}
              </Link>
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
        </div>

        <DesktopGrid />
        <MobileTabs />
      </div>
    </section>
  );
}
