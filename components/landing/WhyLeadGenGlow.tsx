"use client";

import { GlowingEffect } from "@/components/ui/glowing-effect-card";
import { useI18n } from "@/lib/i18n";
import {
  ShieldCheck,
  PenTool,
  LayoutTemplate,
  BarChart3,
  Repeat,
  Eye,
  LifeBuoy,
} from "lucide-react";

export function WhyLeadGenGlow() {
  const { t } = useI18n();

  const cards = [
    {
      icon: <ShieldCheck className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point1.title"),
      desc: t("landing.why.point1.desc"),
      area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
    },
    {
      icon: <PenTool className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point2.title"),
      desc: t("landing.why.point2.desc"),
      area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
    },
    {
      icon: <LayoutTemplate className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point3.title"),
      desc: t("landing.why.point3.desc"),
      area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
    },
    {
      icon: <BarChart3 className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point4.title"),
      desc: t("landing.why.point4.desc"),
      area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
    },
    {
      icon: <Repeat className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point5.title"),
      desc: t("landing.why.point5.desc"),
      area: "md:[grid-area:3/1/4/8] xl:[grid-area:2/5/3/9]",
    },
    {
      icon: <Eye className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point6.title"),
      desc: t("landing.why.point6.desc"),
      area: "md:[grid-area:3/8/4/13] xl:[grid-area:2/9/3/13]",
    },
    // Optional: Support card
    {
      icon: <LifeBuoy className="h-4 w-4 text-white/80" />,
      title: t("landing.why.point7.title"),
      desc: t("landing.why.point7.desc"),
      area: "hidden xl:[grid-area:1/9/2/13] xl:block",
    },
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

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          {cards.map((c, idx) => (
            <li key={idx} className={`min-h-[14rem] list-none ${c.area}`}>
              <div className="relative h-full rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3">
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
