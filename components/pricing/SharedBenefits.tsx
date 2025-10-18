"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Shield, Sparkles, BarChart3, PlugZap, Users, Mail } from "lucide-react";

const items = [
  { icon: Mail, k: "item1" },
  { icon: Sparkles, k: "item2" },
  { icon: BarChart3, k: "item3" },
  { icon: Users, k: "item4" },
  { icon: PlugZap, k: "item5" },
  { icon: Shield, k: "item6" },
];

export function SharedBenefits() {
  const { t } = useI18n();
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">{t("pricing.shared.heading")}</h2>
          <p className="text-slate-300 mt-2">{t("pricing.shared.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, k }, i) => (
            <motion.div key={k} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700/40 p-6">
              <Icon className="w-7 h-7 text-blue-400" />
              <h3 className="mt-3 text-lg font-semibold">{t(`pricing.shared.${k}.title` as any)}</h3>
              <p className="text-slate-300 text-sm mt-1">{t(`pricing.shared.${k}.desc` as any)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
