"use client";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export function PlanComparison() {
  const { t, lang } = useI18n();

  const plans: {
    key: "starter" | "core" | "pro" | "enterprise";
    price: string;
    priceNote?: string;
    ctaKey: string;
    ctaHref: string;
  }[] = [
    { key: "starter", price: "$390K", priceNote: lang === "es" ? "CLP/mes" : "CLP/mo", ctaKey: "landing.plans.card.starter.cta", ctaHref: "/login" },
    { key: "core", price: "$790K", priceNote: lang === "es" ? "CLP/mes" : "CLP/mo", ctaKey: "landing.plans.card.core.cta", ctaHref: "/login" },
    { key: "pro", price: "$1.49M", priceNote: lang === "es" ? "CLP/mes" : "CLP/mo", ctaKey: "landing.plans.card.pro.cta", ctaHref: "/login" },
    { key: "enterprise", price: lang === "es" ? "A medida" : "Custom", ctaKey: "landing.plans.card.enterprise.cta", ctaHref: "/login" },
  ];

  type Row =
    | { perk: string; type: "value"; values: Record<typeof plans[number]["key"], string> }
    | { perk: string; type: "bool"; values: Record<typeof plans[number]["key"], boolean> };

  const rows: Row[] = [
    {
      perk: lang === "es" ? "Leads verificados" : "Verified leads",
      type: "value",
      values: { starter: "3,000", core: "5,000", pro: "8,000–12,000", enterprise: lang === "es" ? "Personalizado" : "Custom" },
    },
    {
      perk: lang === "es" ? "Plantillas IA" : "AI templates",
      type: "value",
      values: { starter: "3", core: "5", pro: "∞", enterprise: "∞" },
    },
    {
      perk: lang === "es" ? "Campañas + Contactos" : "Campaigns + Contacts",
      type: "bool",
      values: { starter: false, core: true, pro: true, enterprise: true },
    },
    {
      perk: lang === "es" ? "Dashboard" : "Dashboard",
      type: "value",
      values: {
        starter: lang === "es" ? "Básico" : "Basic",
        core: lang === "es" ? "Avanzado" : "Advanced",
        pro: lang === "es" ? "Completo" : "Full",
        enterprise: lang === "es" ? "Completo" : "Full",
      },
    },
    {
      perk: lang === "es" ? "Reporting PDF" : "PDF reporting",
      type: "bool",
      values: { starter: false, core: false, pro: true, enterprise: true },
    },
    {
      perk: lang === "es" ? "Integraciones CRM" : "CRM integrations",
      type: "bool",
      values: { starter: false, core: false, pro: true, enterprise: true },
    },
    {
      perk: lang === "es" ? "Multicanal" : "Multichannel",
      type: "bool",
      values: { starter: false, core: false, pro: false, enterprise: true },
    },
    {
      perk: lang === "es" ? "SLA garantizado" : "Guaranteed SLA",
      type: "bool",
      values: { starter: false, core: false, pro: false, enterprise: true },
    },
    {
      perk: lang === "es" ? "Soporte dedicado" : "Dedicated support",
      type: "bool",
      values: { starter: false, core: false, pro: false, enterprise: true },
    },
    {
      perk: lang === "es" ? "APIs personalizadas" : "Custom APIs",
      type: "bool",
      values: { starter: false, core: false, pro: false, enterprise: true },
    },
  ];

  const planTitle = (key: typeof plans[number]["key"]) => t(`landing.plans.card.${key}.title` as any);
  const ctaLabel = (key: typeof plans[number]["key"]) => t(`landing.plans.card.${key}.cta` as any);

  return (
    <section id="comparison" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">{t("pricing.comparison.heading")}</h2>
          <p className="text-slate-300 mt-2">{t("pricing.comparison.subtitle")}</p>
        </div>

        <div className="-mx-4 md:mx-0 overflow-x-auto">
          <div className="min-w-[720px] md:min-w-0 bg-slate-800/40 backdrop-blur-md border border-slate-700/40 rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/40">
                  <th className="text-left px-4 py-4 md:px-6 md:py-5 text-slate-300 font-medium">
                    {lang === "es" ? "Beneficio" : "Benefit"}
                  </th>
                  {plans.map((p) => (
                    <th key={p.key} className="px-4 py-4 md:px-6 md:py-5 text-left">
                      <div className="text-base md:text-lg font-semibold">{planTitle(p.key)}</div>
                      <div className="text-blue-400 font-bold text-lg md:text-xl leading-tight">
                        {p.price}
                      </div>
                      {p.priceNote && (
                        <div className="text-[11px] md:text-xs text-slate-400">{p.priceNote}</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {rows.map((row, idx) => (
                  <tr key={idx} className="">
                    <td className="px-4 py-3 md:px-6 md:py-4 text-slate-200 whitespace-nowrap">{row.perk}</td>
                    {plans.map((p) => (
                      <td key={p.key} className="px-4 py-3 md:px-6 md:py-4">
                        {row.type === "value" ? (
                          <span className="text-slate-300">{(row as any).values[p.key]}</span>
                        ) : (row as any).values[p.key] ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">✓</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* CTA row */}
                <tr>
                  <td className="px-4 py-4 md:px-6 md:py-5" />
                  {plans.map((p) => (
                    <td key={p.key} className="px-4 py-4 md:px-6 md:py-5">
                      <Link
                        href={p.ctaHref}
                        className="inline-flex items-center justify-center w-full md:w-auto px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white"
                      >
                        {ctaLabel(p.key)}
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
