"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { openCalendly } from "@/lib/calendly";

export function PricingHero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden" style={{ background: "radial-gradient(circle at 20% 30%, #0f172a, #0a0f1c 80%)" }}>
  <LanguageToggle />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-blue-600/20 blur-[140px] rounded-full" />
        <div className="absolute top-20 right-0 w-[28rem] h-[28rem] bg-indigo-600/20 blur-[120px] rounded-full" />
      </div>
      <div className="container mx-auto px-6 py-24 md:py-32 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-bold tracking-tight">
          {t("pricing.hero.title")}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-5 text-slate-300 text-lg md:text-xl max-w-3xl mx-auto">
          {t("pricing.hero.subtitle")}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#comparison" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition-all">
            {t("pricing.hero.primaryCta")}
          </Link>
          <button onClick={openCalendly} className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold">
            {t("pricing.hero.secondaryCta")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
