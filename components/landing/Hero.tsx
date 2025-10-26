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
    <section className="relative min-h-[100svh] md:min-h-[92vh] px-4 overflow-hidden flex items-center bg-black">
      {/* Complex animated background (restored) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle vignette */}
        <div className="absolute inset-0 [background:radial-gradient(120%_80%_at_50%_0%,rgba(37,99,235,0.15),rgba(0,0,0,0)_60%)]" />

        {/* Soft grid with edge fade */}
        <div className="absolute inset-0 opacity-[0.22] [mask-image:radial-gradient(130%_90%_at_50%_20%,black,transparent_70%)] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:38px_38px]" />

        {/* Aurora blobs */}
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />

        {/* Light sweep */}
        <div className="light-sweep" />
      </div>

      {/* Keyframes and scoped FX styles */}
      <style jsx>{`
        .aurora {
          position: absolute;
          width: 60vw;
          height: 60vw;
          border-radius: 9999px;
          filter: blur(72px);
          opacity: 0.34;
          mix-blend-mode: screen;
          will-change: transform;
        }
        .aurora-1 {
          top: -18vw;
          left: -12vw;
          background: radial-gradient(circle at 30% 30%, rgba(59,130,246,0.9), rgba(99,102,241,0.45) 40%, rgba(0,0,0,0) 62%);
          animation: float1 24s ease-in-out infinite alternate;
        }
        .aurora-2 {
          bottom: -26vw;
          right: -18vw;
          background: radial-gradient(circle at 70% 45%, rgba(168,85,247,0.85), rgba(59,130,246,0.38) 45%, rgba(0,0,0,0) 66%);
          animation: float2 28s ease-in-out infinite alternate;
        }
        .aurora-3 {
          top: 18vh;
          right: 34vw;
          width: 52vw;
          height: 52vw;
          background: radial-gradient(circle at 50% 50%, rgba(56,189,248,0.7), rgba(99,102,241,0.28) 52%, rgba(0,0,0,0) 68%);
          animation: float3 32s ease-in-out infinite alternate;
        }
        .light-sweep {
          position: absolute;
          inset: -12%;
          background: conic-gradient(from 180deg at 50% 50%, rgba(0,0,0,0) 0deg, rgba(99,102,241,0.12) 30deg, rgba(0,0,0,0) 60deg);
          filter: blur(40px);
          opacity: 0.5;
          animation: rotate 42s linear infinite;
        }
        @keyframes rotate { to { transform: rotate(360deg); } }
        @keyframes float1 {
          0% { transform: translate3d(0,0,0) rotate(0deg); }
          100% { transform: translate3d(8vw,4vh,0) rotate(15deg); }
        }
        @keyframes float2 {
          0% { transform: translate3d(0,0,0) rotate(0deg); }
          100% { transform: translate3d(-6vw,5vh,0) rotate(-12deg); }
        }
        @keyframes float3 {
          0% { transform: translate3d(0,0,0) rotate(0deg); }
          100% { transform: translate3d(5vw,-6vh,0) rotate(10deg); }
        }
        @media (max-width: 768px) {
          .aurora { width: 90vw; height: 90vw; filter: blur(84px); opacity: 0.28; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora, .light-sweep { animation: none; }
        }
      `}</style>

      <LanguageToggle />

      <div className="w-full max-w-7xl mx-auto py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Left: copy */}
          <motion.div
            variants={fadeParent}
            initial="hidden"
            animate="show"
            className="md:col-span-7 text-center md:text-left"
          >
            {/* Logo removed (already present in navbar/sidebar) */}

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

            {/* Instantly-like arrangement: CTA followed by reassurance checks */}

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-6 md:mt-7 flex flex-row flex-wrap md:justify-start items-center gap-3.5"
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
                className="inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-base font-semibold border border-slate-600/60 text-slate-200 hover:text-white bg-slate-800/30 hover:bg-slate-800/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <PlayCircle className="mr-2 w-5 h-5" /> {t("landing.hero.watchDemo")}
              </button>
            </motion.div>

            {/* Reassurance checks */}
            <motion.ul
              variants={fadeUp}
              className="mt-4 flex flex-wrap items-center md:justify-start justify-center gap-x-6 gap-y-2 text-[13px] text-slate-300"
            >
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t("landing.hero.reassure1")}</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t("landing.hero.reassure2")}</li>
            </motion.ul>

            {/* Trusted by (removed per request) */}
          </motion.div>

          {/* Right: visual preview */}
          <motion.div
            variants={fadeParent}
            initial="hidden"
            animate="show"
            className="hidden md:block md:col-span-5"
          >
            <motion.div variants={fadeUp} className="relative mx-auto md:ml-auto w-full max-w-[560px]">
              {/* soft glow behind card */}
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br from-blue-600/20 via-indigo-500/15 to-fuchsia-500/10 blur-2xl" aria-hidden />
              {/* Card */}
              <div className="relative aspect-[16/10] rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-[0_20px_70px_-20px_rgba(49,84,240,0.45)] overflow-hidden">
                {/* Mock window header */}
                <div className="absolute top-0 inset-x-0 h-9 bg-white/5 flex items-center gap-2 px-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <div className="ml-3 text-xs text-white/70">LeadGen Dashboard</div>
                </div>
                <div className="absolute inset-0 pt-9 p-4">
                  {/* KPI row */}
                  <div className="grid grid-cols-3 gap-3">
                    {["Open Rate", "Replies", "Meetings"].map((k, i) => (
                      <div key={k} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <div className="text-[10px] uppercase tracking-wide text-white/65">{k}</div>
                        <div className="mt-1 text-white font-semibold text-xl">{i===0?"72%": i===1?"5.2%":"11"}</div>
                        <div className="mt-2 h-2 rounded bg-white/10 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: i===0?"72%": i===1?"52%":"68%" }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] h-[150px] p-3">
                    <div className="h-full w-full relative rounded-xl overflow-hidden">
                      {/* grid */}
                      <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
                      {/* lines */}
                      <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full">
                        <defs>
                          <linearGradient id="lg1" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor="#3154F0" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3.2" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <path d="M0 76 C 18 70, 34 84, 54 72 S 96 42, 124 48 S 168 66, 200 62" stroke="url(#lg1)" strokeWidth="6" opacity="0.25" fill="none" filter="url(#glow)" />
                        <path d="M0 76 C 18 70, 34 84, 54 72 S 96 42, 124 48 S 168 66, 200 62" stroke="url(#lg1)" strokeWidth="2.4" fill="none" />
                        <path d="M0 88 C 22 80, 40 88, 62 82 S 112 58, 150 65 S 200 72, 200 72" stroke="#94a3b8" strokeWidth="1.8" opacity="0.6" />
                      </svg>
                    </div>
                  </div>

                  {/* Mini stat inside, non-overlapping */}
                  <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 w-[220px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                    <div className="text-[11px] uppercase tracking-wide text-white/85">Emails sent</div>
                    <svg viewBox="0 0 100 36" className="w-full h-[36px]">
                      <defs>
                        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                      <path d="M0 30 C 10 26, 18 29, 28 24 S 48 16, 58 18 S 82 26, 100 20" stroke="url(#g1)" strokeWidth="2" fill="none" />
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
