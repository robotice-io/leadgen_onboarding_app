"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";

export const CLIENT_STEPS = ["audience", "offer", "operations", "messaging", "summary"] as const;
export type ClientStep = typeof CLIENT_STEPS[number];

function labelFor(step: ClientStep, t: (k: any) => string) {
  switch (step) {
    case "audience":
      return t("ss.step.audience");
    case "offer":
      return t("ss.step.offer");
    case "operations":
      return t("ss.step.operations");
    case "messaging":
      return t("ss.step.messaging");
    case "summary":
      return t("ss.step.summary");
  }
}

export function StepperProgress() {
  const { t } = useI18n();
  const pathname = usePathname();
  const currentIndex = useMemo(() => {
    const slug = pathname?.split("/").pop() as ClientStep | undefined;
    const idx = CLIENT_STEPS.findIndex((s) => s === slug);
    return idx >= 0 ? idx : 0;
  }, [pathname]);

  return (
    <div className="flex items-center justify-center gap-6 py-3">
      {CLIENT_STEPS.map((step, idx) => {
        const active = idx === currentIndex;
        const completed = idx < currentIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={
                "w-9 h-9 rounded-full grid place-items-center text-xs transition-shadow " +
                (completed
                  ? "bg-blue-600 text-white shadow-[0_6px_18px_-6px_rgba(59,130,246,0.45)]"
                  : active
                  ? "border border-blue-500 text-blue-600 shadow-[0_0_0_6px_rgba(59,130,246,0.12),0_10px_28px_-10px_rgba(59,130,246,0.45)]"
                  : "border border-black/20 dark:border-white/20 text-black/50 dark:text-white/50")
              }
            >
              {idx + 1}
            </div>
            <span className={"text-sm " + (active ? "font-medium" : "text-black/60 dark:text-white/60")}>
              {labelFor(step, t)}
            </span>
            {idx < CLIENT_STEPS.length - 1 && (
              <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mx-2 rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function nextStepHref(current: ClientStep) {
  const idx = CLIENT_STEPS.indexOf(current);
  const next = CLIENT_STEPS[Math.min(idx + 1, CLIENT_STEPS.length - 1)];
  return `/onboarding/${next}`;
}

export function prevStepHref(current: ClientStep) {
  const idx = CLIENT_STEPS.indexOf(current);
  const prev = CLIENT_STEPS[Math.max(0, idx - 1)];
  return `/onboarding/${prev}`;
}
