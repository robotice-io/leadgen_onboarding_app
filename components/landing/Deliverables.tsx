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
    <section className="relative py-24 md:py-32 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("landing.deliver.heading")}
          </h2>
          <p className="text-white/70 text-lg mt-3 leading-relaxed">
            {t("landing.deliver.subtitle")}
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto space-y-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-7 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-[2px]"
            >
              {/* subtle inner ring on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.15)]" />

              {/* corner accents */}
              <span className="pointer-events-none absolute top-3 left-3 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 border-t border-l border-white/30" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 border-b border-r border-white/30" />

              <div className="flex items-start gap-4">
                <div className="mt-1 text-emerald-400/90">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[18px] md:text-lg font-semibold leading-snug">
                    {t(it.title as any)}
                  </h3>
                  <p className="text-white/70 text-[15px] md:text-base leading-relaxed">
                    {t(it.desc as any)}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
