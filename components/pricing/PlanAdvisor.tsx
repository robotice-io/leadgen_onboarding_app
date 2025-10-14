"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

const levels = [
  { key: "explorer", color: "bg-emerald-500", ring: "ring-emerald-400/50", plan: "Starter" },
  { key: "scaler", color: "bg-blue-500", ring: "ring-blue-400/50", plan: "Core" },
  { key: "expanding", color: "bg-violet-500", ring: "ring-violet-400/50", plan: "Pro" },
  { key: "enterprise", color: "bg-orange-500", ring: "ring-orange-400/50", plan: "Enterprise" },
];

export function PlanAdvisor() {
  const { t } = useI18n();
  const [idx, setIdx] = useState(1);
  const active = levels[idx];
  return (
    <section className="py-20 md:py-28 bg-[#0b1120]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">{t("pricing.advisor.heading")}</h2>
          <p className="text-slate-300 mt-3">{t("pricing.advisor.subtitle")}</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center justify-between gap-3">
            {levels.map((l, i) => (
              <button key={l.key} onClick={() => setIdx(i)} className={`relative flex-1 h-3 rounded-full bg-slate-700/60 transition-colors ${i <= idx ? "bg-slate-600" : ""}`} aria-label={l.key} />
            ))}
            <motion.div layout transition={{ type: "spring", stiffness: 400, damping: 30 }} className={`absolute -top-2 h-7 w-7 rounded-full ${active.color} ring-8 ${active.ring}`} style={{ left: `${(idx / (levels.length - 1)) * 100}%`, transform: "translateX(-50%)" }} />
          </div>
          <div className="mt-8 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700/40 p-6 md:p-8">
            <motion.div key={active.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="text-sm text-slate-400">{t(`pricing.advisor.level.${active.key}.label` as any)}</div>
              <h3 className="text-2xl font-semibold mt-1">{t(`pricing.advisor.level.${active.key}.title` as any)}</h3>
              <p className="text-slate-300 mt-2">{t(`pricing.advisor.level.${active.key}.desc` as any)}</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="text-slate-400 text-sm">{t("pricing.advisor.suggested")} <span className="font-semibold text-white">{t(`landing.plans.card.${active.plan.toLowerCase()}.title` as any)}</span></div>
                <Link href="#comparison" className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold whitespace-nowrap">{t("pricing.advisor.cta")}</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
