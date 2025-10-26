"use client";

import { ShieldCheck, PenLine, LayoutTemplate, BarChart3, RefreshCw } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect-card";
import { useI18n } from "@/lib/i18n";

// New black-themed "Por qué LeadGen by Robotice" with 5 glowing cards
export function WhyLeadGenAI() {
  const { t } = useI18n();

  const items = [
    { icon: ShieldCheck, title: t("landing.why.point1.title"), desc: t("landing.why.point1.desc") },
    { icon: PenLine, title: t("landing.why.point2.title"), desc: t("landing.why.point2.desc") },
    { icon: LayoutTemplate, title: t("landing.why.point3.title"), desc: t("landing.why.point3.desc") },
    { icon: BarChart3, title: t("landing.why.point4.title"), desc: t("landing.why.point4.desc") },
    { icon: RefreshCw, title: t("landing.why.point5.title"), desc: t("landing.why.point5.desc") },
  ];

  return (
    <section className="w-full bg-black text-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("landing.why.heading")}<span className="sr-only"> by Robotice</span>
          </h2>
          <p className="mt-4 text-lg text-white/70">{t("landing.why.subtitle")}</p>
        </div>

        {/* 5-card grid */}
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {items.map((it, idx) => (
            <li key={idx} className="list-none">
              <div className="relative h-full rounded-2xl border border-white/10 p-2">
                <GlowingEffect spread={44} glow disabled={false} proximity={72} inactiveZone={0.06} blur={10} />
                <div className="relative flex h-full flex-col gap-4 rounded-xl bg-black/40 p-6">
                  <div className="w-fit rounded-lg border border-white/15 bg-white/5 p-2">
                    <it.icon className="h-5 w-5 text-white/80" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold leading-snug">{it.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{it.desc}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
