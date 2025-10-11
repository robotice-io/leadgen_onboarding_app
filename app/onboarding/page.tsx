"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Wizard from "./_components/Wizard";
import { I18nProvider } from "@/lib/i18n";
import TopBar from "./_components/TopBar";
import { Poppins } from "next/font/google";
import { isAuthenticated, getUserTenant } from "@/lib/auth-client";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      console.log("[OnboardingPage] Not authenticated, redirecting to login");
      router.push("/login");
      return;
    }
    // If already completed, route to dashboard
    (async () => {
      try {
        const tenant = await getUserTenant();
        if (tenant?.onboarding_status === "completed") {
          router.replace("/dashboard");
        }
      } catch (e) {
        // Fail-open: stay in onboarding, logs only
        console.warn("[OnboardingPage] Failed to load tenant info", e);
      }
    })();
  }, [router]);

  return (
    <I18nProvider>
      <div className="min-h-screen w-full bg-[linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0)_60%,rgba(2,6,23,0.03)_100%)]">
        <TopBar />
        <div className={`mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 mt-[30px] py-6 sm:py-10 ${poppins.className} bg-[radial-gradient(ellipse_at_20%_0%,rgba(59,130,246,0.10)_0%,transparent_40%),radial-gradient(ellipse_at_80%_100%,rgba(59,130,246,0.08)_0%,transparent_45%)] rounded-xl` }>
          <Wizard />
        </div>
      </div>
    </I18nProvider>
  );
}

// TopBar moved to a Client Component to avoid server-side hook usage



