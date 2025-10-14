"use client";
import { motion, Variants } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { formatNumber } from "@/lib/format";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function Pricing() {
  const { t, lang } = useI18n();

  return (
    <section className="relative py-24 md:py-32" style={{ background: "radial-gradient(circle at 30% 40%, #0f172a, #0b1120 70%)" }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">{t("landing.plans.heading")}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t("landing.plans.subtitle")}</p>
        </div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 max-w-7xl mx-auto">
          {/* Starter */}
          <motion.div variants={item} className="relative bg-slate-800/30 backdrop-blur-lg border border-slate-700/40 rounded-2xl p-8 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:scale-[1.03] hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-2">{t("landing.plans.card.starter.title")}</h3>
            <div className="mb-1">
              <span className="text-4xl font-bold text-blue-400" style={{ textShadow: "0 0 8px rgba(37,99,235,0.3)" }}>$390K</span>
              <span className="text-slate-400"> {lang === "es" ? "CLP/mes" : "CLP/mo"}</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">{t("landing.plans.card.starter.desc")}</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> {formatNumber(3000, lang)} {lang === "es" ? "leads verificados" : "verified leads"}</li>
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> 3 {lang === "es" ? "plantillas IA" : "AI templates"}</li>
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> {lang === "es" ? "Dashboard básico" : "Basic dashboard"}</li>
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> 1 ICP</li>
            </ul>
            <Link href="/login" className="block w-full text-center px-6 py-3 rounded-xl bg-slate-700/60 hover:bg-slate-600 text-white font-semibold transition-all duration-300 hover:scale-[1.04]">
              {t("landing.plans.card.starter.cta")}
            </Link>
          </motion.div>

          {/* Core - Popular */}
          <motion.div variants={item} className="relative bg-slate-800/30 backdrop-blur-lg border-2 border-blue-500/40 rounded-2xl p-8 md:p-10 shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_38px_rgba(37,99,235,0.35)] hover:scale-[1.03] transition-all duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-[0_8px_24px_rgba(37,99,235,0.45)]">{t("landing.plans.card.core.badge")}</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t("landing.plans.card.core.title")}</h3>
            <div className="mb-1">
              <span className="text-4xl font-bold text-blue-400" style={{ textShadow: "0 0 8px rgba(37,99,235,0.3)" }}>$790K</span>
              <span className="text-slate-400"> {lang === "es" ? "CLP/mes" : "CLP/mo"}</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">{t("landing.plans.card.core.desc")}</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> {formatNumber(5000, lang)} {lang === "es" ? "leads verificados" : "verified leads"}</li>
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> 5 {lang === "es" ? "plantillas IA" : "AI templates"}</li>
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> {lang === "es" ? "Campañas + Contactos" : "Campaigns + Contacts"}</li>
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> {lang === "es" ? "Dashboard avanzado" : "Advanced dashboard"}</li>
            </ul>
            <Link href="/login" className="block w-full text-center px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-300 hover:scale-[1.04] shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              {t("landing.plans.card.core.cta")}
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div variants={item} className="relative bg-slate-800/30 backdrop-blur-lg border border-slate-700/40 rounded-2xl p-8 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:scale-[1.03] hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-2">{t("landing.plans.card.pro.title")}</h3>
            <div className="mb-1">
              <span className="text-4xl font-bold text-blue-400" style={{ textShadow: "0 0 8px rgba(37,99,235,0.3)" }}>$1.49M</span>
              <span className="text-slate-400"> {lang === "es" ? "CLP/mes" : "CLP/mo"}</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">{t("landing.plans.card.pro.desc")}</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> {formatNumber(8000, lang)}–{formatNumber(12000, lang)} {lang === "es" ? "leads" : "leads"}</li>
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> {lang === "es" ? "App completa" : "Full app"}</li>
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> {lang === "es" ? "Reporting PDF" : "PDF reporting"}</li>
              <li className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-emerald-400" /> {lang === "es" ? "Integraciones CRM" : "CRM integrations"}</li>
            </ul>
            <Link href="/login" className="block w-full text-center px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all duration-300 hover:scale-[1.04]">
              {t("landing.plans.card.pro.cta")}
            </Link>
          </motion.div>

          {/* Enterprise */}
          <motion.div variants={item} className="relative rounded-2xl p-8 md:p-10 shadow-[0_0_30px_rgba(0,0,0,0.25)] hover:scale-[1.03] transition-all duration-300 bg-gradient-to-br from-[#1d4ed8] to-[#1e3a8a] border border-blue-400/20">
            <h3 className="text-xl font-semibold text-white mb-2">{t("landing.plans.card.enterprise.title")}</h3>
            <div className="mb-1">
              <span className="text-3xl font-bold text-white/90">{lang === "es" ? "A medida" : "Custom"}</span>
            </div>
            <p className="text-blue-100 text-sm mb-6">{t("landing.plans.card.enterprise.desc")}</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-white/90"><CheckCircle className="w-5 h-5 text-emerald-300" /> {lang === "es" ? "Multicanal" : "Multichannel"}</li>
              <li className="flex items-center gap-2 text-white/90"><CheckCircle className="w-5 h-5 text-emerald-300" /> {lang === "es" ? "SLA garantizado" : "Guaranteed SLA"}</li>
              <li className="flex items-center gap-2 text-white/90"><CheckCircle className="w-5 h-5 text-emerald-300" /> {lang === "es" ? "Soporte dedicado" : "Dedicated support"}</li>
              <li className="flex items-center gap-2 text-white/90"><CheckCircle className="w-5 h-5 text-emerald-300" /> {lang === "es" ? "APIs personalizadas" : "Custom APIs"}</li>
            </ul>
            <Link href="/login" className="block w-full text-center px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold transition-all duration-300 hover:bg-slate-100 hover:scale-[1.04]">
              {t("landing.plans.card.enterprise.cta")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
