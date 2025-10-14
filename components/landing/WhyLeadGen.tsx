"use client";
import { motion, Variants } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck, PenLine, LayoutTemplate, BarChart3, RefreshCw, Eye, Users } from "lucide-react";
import { Trans } from "@/components/ui/Trans";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const perks = [
  { icon: ShieldCheck, color: "text-blue-400", title: "landing.why.point1.title", desc: "landing.why.point1.desc" },
  { icon: PenLine, color: "text-violet-400", title: "landing.why.point2.title", desc: "landing.why.point2.desc" },
  { icon: LayoutTemplate, color: "text-green-400", title: "landing.why.point3.title", desc: "landing.why.point3.desc" },
  { icon: BarChart3, color: "text-cyan-400", title: "landing.why.point4.title", desc: "landing.why.point4.desc" },
  { icon: RefreshCw, color: "text-orange-400", title: "landing.why.point5.title", desc: "landing.why.point5.desc" },
  { icon: Eye, color: "text-emerald-400", title: "landing.why.point6.title", desc: "landing.why.point6.desc" },
  { icon: Users, color: "text-pink-400", title: "landing.why.point7.title", desc: "landing.why.point7.desc" },
];

export function WhyLeadGen() {
  const { t } = useI18n();
  return (
    <section className="relative py-28 md:py-36 bg-[#0d1523] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.18),transparent_60%)] pointer-events-none" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {t("landing.why.heading")}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
            {t("landing.why.subtitle")}
          </p>
          <div className="mt-6">
            <span className="inline-block text-sm font-medium uppercase tracking-wide text-slate-300/70 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-sm">{t("landing.why.claim")}</span>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {perks.map(({ icon: Icon, color, title, desc }) => (
            <motion.div
              key={title}
              variants={item}
              className="group relative bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 h-full backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-slate-600 hover:shadow-[0_4px_28px_-6px_rgba(59,130,246,0.35)]"
            >
              <Icon className={`${color} mb-5`} size={30} />
              <h3 className="text-lg font-semibold text-white mb-1 leading-snug">{t(title as any)}</h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                {t(desc as any)}
              </p>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-white/0 via-white/0 to-white/5" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
