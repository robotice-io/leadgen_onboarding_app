"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { CheckCircle, Brain, BarChart3, Bot, Shield } from "lucide-react";
import Link from "next/link";

type TabKey = "main" | "ai" | "metrics" | "support";
const tabs: { key: TabKey; icon: any }[] = [
  { key: "main", icon: CheckCircle },
  { key: "ai", icon: Brain },
  { key: "metrics", icon: BarChart3 },
  { key: "support", icon: Shield },
];

function PlanCard({ plan }: { plan: "starter" | "core" | "pro" | "enterprise" }) {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<TabKey>("main");
  const title = t(`landing.plans.card.${plan}.title` as any);
  const desc = t(`landing.plans.card.${plan}.desc` as any);
  const price = plan === "starter" ? "$390K" : plan === "core" ? "$790K" : plan === "pro" ? "$1.49M" : lang === "es" ? "A medida" : "Custom";
  const cta = t(`landing.plans.card.${plan}.cta` as any) || (plan === "enterprise" ? t("landing.plans.card.enterprise.cta") : t("landing.plans.card.starter.cta"));
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/40 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-slate-300 text-sm mt-1">{desc}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">{price}</div>
          {plan !== "enterprise" && <div className="text-slate-400 text-xs">{lang === "es" ? "CLP/mes" : "CLP/mo"}</div>}
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {tabs.map(({ key, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${tab === key ? "bg-white/10 border-white/30" : "bg-white/5 border-white/10"}`}>
            <Icon className="w-4 h-4" />
            <span className="text-sm capitalize">{t(`pricing.comparison.tab.${key}` as any)}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "main" && (
          <ul className="space-y-2 text-slate-300 text-sm">
            {plan === "starter" && (
              <>
                <li>3,000 {lang === "es" ? "leads verificados" : "verified leads"}</li>
                <li>3 {lang === "es" ? "plantillas IA" : "AI templates"}</li>
                <li>{lang === "es" ? "Dashboard básico" : "Basic dashboard"}</li>
                <li>1 ICP</li>
              </>
            )}
            {plan === "core" && (
              <>
                <li>5,000 {lang === "es" ? "leads verificados" : "verified leads"}</li>
                <li>5 {lang === "es" ? "plantillas IA" : "AI templates"}</li>
                <li>{lang === "es" ? "Campañas + Contactos" : "Campaigns + Contacts"}</li>
                <li>{lang === "es" ? "Dashboard avanzado" : "Advanced dashboard"}</li>
              </>
            )}
            {plan === "pro" && (
              <>
                <li>8,000–12,000 {lang === "es" ? "leads" : "leads"}</li>
                <li>{lang === "es" ? "App completa" : "Full app"}</li>
                <li>{lang === "es" ? "Reporting PDF" : "PDF reporting"}</li>
                <li>{lang === "es" ? "Integraciones CRM" : "CRM integrations"}</li>
              </>
            )}
            {plan === "enterprise" && (
              <>
                <li>{lang === "es" ? "Multicanal" : "Multichannel"}</li>
                <li>{lang === "es" ? "SLA garantizado" : "Guaranteed SLA"}</li>
                <li>{lang === "es" ? "Soporte dedicado" : "Dedicated support"}</li>
                <li>{lang === "es" ? "APIs personalizadas" : "Custom APIs"}</li>
              </>
            )}
          </ul>
        )}
        {tab === "ai" && (
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>{t("pricing.comparison.ai1")}</li>
            <li>{t("pricing.comparison.ai2")}</li>
          </ul>
        )}
        {tab === "metrics" && (
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>{t("pricing.comparison.metrics1")}</li>
            <li>{t("pricing.comparison.metrics2")}</li>
          </ul>
        )}
        {tab === "support" && (
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>{t("pricing.comparison.support1")}</li>
            <li>{t("pricing.comparison.support2")}</li>
          </ul>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Link href="/login" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold">{cta}</Link>
      </div>
    </motion.div>
  );
}

export function PlanComparison() {
  const { t } = useI18n();
  return (
    <section id="comparison" className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">{t("pricing.comparison.heading")}</h2>
          <p className="text-slate-300 mt-2">{t("pricing.comparison.subtitle")}</p>
        </div>
        {/*
          En móvil: carrusel horizontal con snap y overflow-x, para evitar cards apiladas verticalmente.
          En md+: mantener disposición en grilla (2 y 4 columnas).
        */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
          <div className="snap-start shrink-0 min-w-[280px] w-[85%] sm:w-[65%] md:w-auto">
            <PlanCard plan="starter" />
          </div>
          <div className="snap-start shrink-0 min-w-[280px] w-[85%] sm:w-[65%] md:w-auto">
            <PlanCard plan="core" />
          </div>
          <div className="snap-start shrink-0 min-w-[280px] w-[85%] sm:w-[65%] md:w-auto">
            <PlanCard plan="pro" />
          </div>
          <div className="snap-start shrink-0 min-w-[280px] w-[85%] sm:w-[65%] md:w-auto">
            <PlanCard plan="enterprise" />
          </div>
        </div>
      </div>
    </section>
  );
}
