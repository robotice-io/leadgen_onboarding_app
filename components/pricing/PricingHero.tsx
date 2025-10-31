"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { openCalendly } from "@/lib/calendly";

export function PricingHero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-black">
      <LanguageToggle />
      <div className="container mx-auto px-6 py-24 md:py-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white"
        >
          {t("pricing.hero.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 text-white/70 text-lg md:text-xl max-w-3xl mx-auto"
        >
          {t("pricing.hero.subtitle")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="#comparison"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-[0_10px_30px_-15px_rgba(49,84,240,0.8)] transition-colors"
          >
            {t("pricing.hero.primaryCta")}
          </Link>
          <button
            onClick={openCalendly}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
          >
            {t("pricing.hero.secondaryCta")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
