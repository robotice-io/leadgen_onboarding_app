"use client";
import { motion, Variants } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { MailCheck, Target, Sparkles, BarChart3 } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const cards = [
  {
    icon: MailCheck,
    color: "text-blue-400",
    titleKey: "landing.how.step1.title",
    descKey: "landing.how.step1.desc",
  },
  {
    icon: Target,
    color: "text-green-400",
    titleKey: "landing.how.step2.title",
    descKey: "landing.how.step2.desc",
  },
  {
    icon: Sparkles,
    color: "text-violet-400",
    titleKey: "landing.how.step3.title",
    descKey: "landing.how.step3.desc",
  },
  {
    icon: BarChart3,
    color: "text-orange-400",
    titleKey: "landing.how.step4.title",
    descKey: "landing.how.step4.desc",
  },
];

export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-[#0f172a] to-[#111827] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.15),transparent_60%)]" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          variants={container}
          initial="hidden"
            whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h2 variants={item} className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {t("landing.how.altHeading")}
          </motion.h2>
          <motion.p variants={item} className="text-slate-400 text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
            {t("landing.how.subtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-14"
        >
          {cards.map(({ icon: Icon, color, titleKey, descKey }) => (
            <motion.div
              key={titleKey}
              variants={item}
              className="group bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8 md:p-10 flex flex-col h-full backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-slate-600 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_28px_-4px_rgba(59,130,246,0.25)]"
            >
              <Icon className={`${color} mb-5 drop-shadow`} size={28} />
              <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
                {t(titleKey as any)}
              </h3>
              <p className="text-slate-400 text-base leading-relaxed">
                {t(descKey as any)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
