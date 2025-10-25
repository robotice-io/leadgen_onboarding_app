"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Trans } from "@/components/ui/Trans";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { openCalendly } from "@/lib/calendly";

const fadeParent: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative flex flex-col justify-center items-center min-h-[88vh] px-6 overflow-hidden">
      {/* Background decorative layers */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_25%,#132033,#0b121d_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] mix-blend-overlay bg-grid-pattern" />
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-blue-600/15 blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[460px] h-[460px] rounded-full bg-indigo-500/20 blur-3xl" />
      <LanguageToggle />

      {/* Content */}
      <motion.div
        variants={fadeParent}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl text-center"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="mb-10">
          <Image
            src="/landing_logo.png"
            alt="Robotice.io"
            width={200}
            height={64}
            priority
            className="mx-auto drop-shadow-[0_0_6px_rgba(59,130,246,0.45)]"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-black tracking-tight leading-[1.05] text-4xl sm:text-5xl md:text-[clamp(3rem,6vw,4.5rem)] text-white"
        >
          <Trans k="landing.hero.title" />
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-300"
        >
          {t("landing.hero.subtitle")}
        </motion.p>

        {/* Bullets */}
        <motion.ul
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium"
        >
          {[
            t("landing.hero.bullet1"),
            t("landing.hero.bullet2"),
            t("landing.hero.bullet3"),
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> {item}
            </li>
          ))}
        </motion.ul>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/pricing#comparison"
            className="group relative inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-white bg-blue-600 shadow-[0_8px_22px_-6px_rgba(37,99,235,0.55)] hover:shadow-[0_10px_28px_-4px_rgba(37,99,235,0.65)] transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span>{t("landing.hero.primaryCta")}</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
          </Link>
          <button
            onClick={openCalendly}
            className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold border border-slate-600/60 text-slate-200 hover:text-white bg-slate-800/30 hover:bg-slate-800/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Calendar className="mr-2 w-5 h-5" /> {t("landing.hero.secondaryCta")}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
