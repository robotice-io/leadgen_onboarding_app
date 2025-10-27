"use client";

import { MoveUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export function StatsSection() {
  const { t } = useI18n();
  return (
    <section className="w-full py-20 lg:py-28 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Text */}
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge className="border-white/15 bg-white/10 text-white">Insights</Badge>
            </div>
            <div className="flex gap-3 flex-col">
              <h2 className="text-4xl md:text-5xl tracking-tight font-bold max-w-xl text-left">
                {t("landing.results.heading")}
              </h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-md text-left">
                {"Promedios obtenidos por nuestros clientes activos."}
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[
                {
                  value: "65–80%",
                  label: t("landing.results.point1" as any),
                },
                {
                  value: "4–7%",
                  label: t("landing.results.point2" as any),
                },
                {
                  value: "6–12",
                  label: t("landing.results.point3" as any),
                },
                {
                  value: "×6",
                  label: t("landing.results.point4" as any),
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <MoveUpRight className="w-4 h-4 mb-8 text-blue-400/80" />
                  <h3 className="text-4xl md:text-5xl tracking-tight font-semibold flex items-end gap-3">
                    {s.value}
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    {s.label}
                  </p>
                  {/* inner ring and corner accents */}
                  <span className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:[box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.15)]" />
                  <span className="pointer-events-none absolute top-3 left-3 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 border-t border-l border-white/30" />
                  <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 border-b border-r border-white/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
