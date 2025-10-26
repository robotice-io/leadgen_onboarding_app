"use client";

import { GlowingEffect } from "@/components/ui/glowing-effect-card";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck, PenTool, LayoutTemplate, BarChart3, Repeat } from "lucide-react";

export function WhyLeadGenGlow() {
  const { t } = useI18n();

  const cards = [
    {
      icon: <ShieldCheck className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point1.title"),
      desc: t("landing.why.point1.desc"),
      // Row 1, left half
      classes: "md:col-span-12 xl:col-start-1 xl:col-end-7 xl:row-start-1 xl:row-end-2",
    },
    {
      icon: <PenTool className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point2.title"),
      desc: t("landing.why.point2.desc"),
      // Row 1, right half
      classes: "md:col-span-12 xl:col-start-7 xl:col-end-13 xl:row-start-1 xl:row-end-2",
    },
    {
      icon: <LayoutTemplate className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point3.title"),
      desc: t("landing.why.point3.desc"),
      // Row 2, left third
      classes: "md:col-span-6 xl:col-start-1 xl:col-end-5 xl:row-start-2 xl:row-end-3",
    },
    {
      icon: <BarChart3 className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point4.title"),
      desc: t("landing.why.point4.desc"),
      // Row 2, middle third
      classes: "md:col-span-6 xl:col-start-5 xl:col-end-9 xl:row-start-2 xl:row-end-3",
    },
    {
      icon: <Repeat className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point5.title"),
      desc: t("landing.why.point5.desc"),
      // Row 2, right third
      classes: "md:col-span-12 xl:col-start-9 xl:col-end-13 xl:row-start-2 xl:row-end-3",
    },
    // (cards limited to first 5 for a clean mosaic)
  ];

  return (
    <section className="w-full bg-black py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            {t("landing.why.heading")}<span className="text-white/60"> — {t("landing.why.claim")}</span>
          </h2>
          <p className="mt-4 text-lg text-white/70">{t("landing.why.subtitle")}</p>
        </div>

  <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4 xl:grid-rows-2">
          {cards.map((c, idx) => (
            <li key={idx} className={`min-h-[14rem] list-none ${c.classes}`}>
              <div className="relative h-full rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3 overflow-hidden">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-black p-6">
                  <div className="relative flex flex-1 flex-col justify-between gap-3">
                    <div className="w-fit rounded-lg border border-white/20 p-2">{c.icon}</div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold md:text-2xl">{c.title}</h3>
                      <p className="text-sm text-white/70 md:text-base">{c.desc}</p>
                    </div>
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
