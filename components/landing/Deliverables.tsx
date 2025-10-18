"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { CheckCircle } from "lucide-react";

const items = [
  { title: "landing.deliver.item1.title", desc: "landing.deliver.item1.desc" },
  { title: "landing.deliver.item2.title", desc: "landing.deliver.item2.desc" },
  { title: "landing.deliver.item3.title", desc: "landing.deliver.item3.desc" },
  { title: "landing.deliver.item4.title", desc: "landing.deliver.item4.desc" },
  { title: "landing.deliver.item5.title", desc: "landing.deliver.item5.desc" },
];

export function Deliverables() {
  const { t } = useI18n();
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-[#0f172a] to-[#111827] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.14),transparent_60%)]" />
      <div className="container mx-auto px-6 relative">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {t("landing.deliver.heading")}
          </h2>
          <p className="text-slate-400 text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
            {t("landing.deliver.subtitle")}
          </p>
          <div className="mt-5">
            <span className="inline-block text-sm font-medium tracking-wide text-emerald-200/90 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-4 py-2 backdrop-blur-sm">
              {t("landing.deliver.claim")}
            </span>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto space-y-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
              className="flex items-start gap-4 bg-slate-800/40 border border-slate-700/40 p-6 rounded-xl hover:scale-[1.02] hover:border-slate-600 transition-all duration-300 backdrop-blur-md"
            >
              <div className="text-emerald-400 mt-1">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{t(it.title as any)}</h3>
                <p className="text-slate-400 text-base leading-relaxed">{t(it.desc as any)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
