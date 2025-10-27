"use client";

import Link from "next/link";
import { ArrowRightIcon, Calendar, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { openCalendly } from "@/lib/calendly";

export function CallToAction() {
  const { t } = useI18n();
  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col justify-between gap-y-6 border-y border-white/10 bg-[radial-gradient(35%_80%_at_25%_0%,rgba(255,255,255,0.06),transparent)] px-4 py-10 text-white">
      {/* Corner guides */}
      <PlusIcon className="absolute top-[-12.5px] left-[-11.5px] z-[1] size-6 text-white/30" strokeWidth={1} />
      <PlusIcon className="absolute top-[-12.5px] right-[-11.5px] z-[1] size-6 text-white/30" strokeWidth={1} />
      <PlusIcon className="absolute bottom-[-12.5px] left-[-11.5px] z-[1] size-6 text-white/30" strokeWidth={1} />
      <PlusIcon className="absolute bottom-[-12.5px] right-[-11.5px] z-[1] size-6 text-white/30" strokeWidth={1} />

      {/* side dividers */}
      <div className="pointer-events-none absolute left-0 -inset-y-6 w-px border-l border-white/10" />
      <div className="pointer-events-none absolute right-0 -inset-y-6 w-px border-r border-white/10" />
      <div className="-z-10 absolute top-0 left-1/2 h-full border-l border-dashed border-white/10" />

      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {t("landing.finalCta.heading")}
        </h2>
        <p className="text-white/75 text-lg max-w-3xl mx-auto">
          {t("landing.finalCta.subtitle")}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Link href="/login" className="inline-flex">
          <Button variant="white" className="group relative h-12 px-7 overflow-hidden border border-white/10 backdrop-blur-sm shadow-[0_8px_24px_-12px_rgba(255,255,255,0.35)] hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.45)] before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45),rgba(255,255,255,0.18)_42%,rgba(255,255,255,0.06)_70%,transparent_100%)] before:pointer-events-none">
            {t("landing.finalCta.primaryCta")}
            <ArrowRightIcon className="size-4 ml-2" />
          </Button>
        </Link>
        <Button
          variant="white"
          className="group relative h-12 px-7 overflow-hidden border border-white/15 bg-white/10 text-white hover:bg-white/15 backdrop-blur-sm shadow-[0_8px_24px_-12px_rgba(255,255,255,0.35)] before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45),rgba(255,255,255,0.18)_42%,rgba(255,255,255,0.06)_70%,transparent_100%)] before:pointer-events-none"
          onClick={openCalendly}
        >
          <Calendar className="size-4 mr-2" /> {t("landing.finalCta.secondaryCta")}
        </Button>
      </div>
    </div>
  );
}
