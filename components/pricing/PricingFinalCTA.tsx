"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { openCalendly } from "@/lib/calendly";

export function PricingFinalCTA() {
  const { t } = useI18n();
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-80" aria-hidden>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g1" cx="20%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0b1120" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="g2" cx="80%" cy="70%" r="60%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0b1120" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="#0b1120" />
          <rect width="100%" height="100%" fill="url(#g1)" />
          <rect width="100%" height="100%" fill="url(#g2)" />
        </svg>
      </div>
      <div className="container mx-auto px-6 text-center">
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold">
          {t("pricing.finalCta.heading")}
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="text-slate-300 mt-3 max-w-2xl mx-auto">
          {t("pricing.finalCta.subtitle")}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold">
            {t("pricing.finalCta.primary")}
          </Link>
          <button onClick={openCalendly} className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold">
            {t("pricing.finalCta.secondary")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
