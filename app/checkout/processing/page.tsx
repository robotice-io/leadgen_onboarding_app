"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function ProcessingPage() {
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      let plan = "starter";
      try {
        const search = typeof window !== "undefined" ? window.location.search : "";
        const p = new URLSearchParams(search);
        plan = p.get("plan") || "starter";
      } catch {}
      router.replace(`/checkout/success?preapproval_id=mock&plan=${encodeURIComponent(plan)}`);
    }, 1200);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="min-h-[70vh] grid place-items-center bg-black text-white">
      <div className="text-center">
        <div className="mx-auto mb-6 h-10 w-10 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
        <h1 className="text-2xl font-semibold">{t("checkout.processing.title")}</h1>
        <p className="text-white/70 mt-2">{t("checkout.processing.subtitle")}</p>
      </div>
    </main>
  );
}
