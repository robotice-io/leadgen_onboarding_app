"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const faqKeys = ["q1", "q2", "q3", "q4"] as const;

export function PricingFAQ() {
  const { t } = useI18n();
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">{t("pricing.faq.heading")}</h2>
          <p className="text-slate-300 mt-2">{t("pricing.faq.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqKeys.map((k, i) => (
            <motion.div key={k} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700/40 p-6">
              <h3 className="text-lg font-semibold">{t(`pricing.faq.${k}.q` as any)}</h3>
              <p className="text-slate-300 text-sm mt-1">{t(`pricing.faq.${k}.a` as any)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
