"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { openCalendly } from "@/lib/calendly";

export function PricingFinalCTA() {
  const { t } = useI18n();
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-black text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold"
        >
          {t("pricing.finalCta.heading")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-white/70 mt-3 max-w-2xl mx-auto"
        >
          {t("pricing.finalCta.subtitle")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/checkout/processing?plan=starter"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-[0_10px_30px_-15px_rgba(49,84,240,0.8)]"
          >
            {t("pricing.finalCta.primary")}
          </Link>
          <button
            onClick={openCalendly}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 font-semibold text-white"
          >
            {t("pricing.finalCta.secondary")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
