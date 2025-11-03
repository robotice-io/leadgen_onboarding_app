"use client";

import { StepperProgress } from "@/components/onboarding/StepperProgress";

export default function ClientOnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0)_60%,rgba(2,6,23,0.03)_100%)]">
      <div className="sticky top-0 z-20 bg-white/70 dark:bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-black/5 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <StepperProgress />
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8">
        <div className="min-h-[calc(100vh-110px)] grid place-items-start md:place-items-center py-10 md:py-16 lg:py-20">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
