"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, Calendar, ArrowRight, PlayCircle, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Trans } from "@/components/ui/Trans";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { openCalendly } from "@/lib/calendly";
import { useState, useEffect } from "react";

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
  const [demoOpen, setDemoOpen] = useState(false);

  // Disable scroll when modal is open
  useEffect(() => {
    if (demoOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [demoOpen]);

  return (
    <section className="relative min-h-[70vh] px-4 overflow-hidden flex items-center">
      {/* Background decorative layers */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_10%_10%,#122033_20%,#0a101b_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25] mix-blend-overlay bg-grid-pattern" />
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[460px] h-[460px] rounded-full bg-indigo-500/25 blur-3xl" />
      <LanguageToggle />

      <div className="w-full max-w-6xl mx-auto py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left: copy */}
          <motion.div
            variants={fadeParent}
            initial="hidden"
            animate="show"
            className="md:col-span-6 text-center md:text-left"
          >
            {/* Logo */}
            <motion.div variants={fadeUp} className="mb-6 md:mb-8">
              <Image
                src="/landing_logo.png"
                alt="Robotice.io"
                width={200}
                height={64}
                priority
                className="md:mx-0 mx-auto drop-shadow-[0_0_6px_rgba(59,130,246,0.45)]"
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-semibold tracking-tight leading-[1.05] text-3xl sm:text-4xl md:text-[clamp(2.55rem,4.59vw,3.91rem)] text-white"
            >
              <Trans k="landing.hero.title" />
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              className="mt-3 md:mt-4 max-w-2xl md:max-w-none md:pr-6 text-base md:text-lg text-slate-300"
            >
              {t("landing.hero.subtitle")}
            </motion.p>

            {/* Bullets */}
            <motion.ul
              variants={fadeUp}
              className="mt-4 md:mt-5 flex flex-wrap items-center md:justify-start justify-center gap-x-5 gap-y-2.5 text-[13px] font-medium"
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
              className="mt-6 md:mt-7 flex flex-col sm:flex-row md:justify-start items-center gap-3.5"
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
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center justify-center rounded-xl px-6 py-4 text-base font-semibold border border-slate-600/60 text-slate-200 hover:text-white bg-slate-800/30 hover:bg-slate-800/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <PlayCircle className="mr-2 w-5 h-5" /> {t("landing.hero.watchDemo")}
              </button>
              <button
                onClick={openCalendly}
                className="inline-flex items-center justify-center rounded-xl px-6 py-4 text-base font-semibold border border-slate-600/60 text-slate-200 hover:text-white bg-slate-800/30 hover:bg-slate-800/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <Calendar className="mr-2 w-5 h-5" /> {t("landing.hero.secondaryCta")}
              </button>
            </motion.div>

            {/* Trusted by (removed per request) */}
          </motion.div>

          {/* Right: visual preview */}
          <motion.div
            variants={fadeParent}
            initial="hidden"
            animate="show"
            className="hidden md:block md:col-span-6"
          >
            <motion.div
              variants={fadeUp}
              className="relative mx-auto w-full max-w-[460px] xl:max-w-[520px] aspect-[16/10] rounded-[20px] border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/30 backdrop-blur-xl shadow-[0_8px_40px_-10px_rgba(37,99,235,0.35)] overflow-hidden"
            >
              {/* Mock window header */}
              <div className="absolute top-0 inset-x-0 h-9 bg-white/5 flex items-center gap-2 px-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <div className="ml-3 text-xs text-white/60">LeadGen Dashboard</div>
              </div>
              <div className="absolute inset-0 pt-9 p-3.5">
                {/* KPI row */}
                <div className="grid grid-cols-3 gap-2.5">
                  {["Open Rate", "Replies", "Meetings"].map((k, i) => (
                    <div key={k} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="text-[10px] uppercase tracking-wide text-white/60">{k}</div>
                      <div className="mt-1 text-white font-semibold text-xl">{i===0?"72%": i===1?"5.2%":"11"}</div>
                      <div className="mt-2 h-2 rounded bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: i===0?"72%": i===1?"52%":"68%" }} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Chart area */}
                <div className="mt-3.5 rounded-xl border border-white/10 bg-white/[0.03] h-[140px] p-3">
                  <div className="h-full w-full relative">
                    {/* faux grid */}
                    <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px] rounded-lg" />
                    {/* faux line */}
                    <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full">
                      <path d="M0 70 C 30 50, 50 80, 80 60 S 130 30, 160 45 S 200 60, 200 60" stroke="#60a5fa" strokeWidth="2.5" fill="none" />
                      <path d="M0 85 C 25 75, 55 85, 80 75 S 120 55, 160 62 S 200 70, 200 70" stroke="#a78bfa" strokeWidth="2" fill="none" opacity="0.8" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Demo Modal */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDemoOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-3xl rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
            <button aria-label="Close" onClick={() => setDemoOpen(false)} className="absolute top-3 right-3 p-2 rounded-md bg-white/5 hover:bg-white/10 text-white/80">
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full bg-black">
              {/* Replace src with your demo video */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
                title="LeadGen Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
