"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function SuccessPage() {
  const { t } = useI18n();
  let plan = "starter";
  try {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const p = new URLSearchParams(search);
    plan = p.get("plan") || "starter";
  } catch {}
  return (
    <main className="min-h-[70vh] grid place-items-center bg-black text-white">
      <div className="text-center max-w-xl mx-auto px-6">
        <div className="mx-auto mb-6 h-14 w-14 rounded-full grid place-items-center bg-green-600/20 text-green-400">
          <span className="inline-block h-6 w-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <h1 className="text-3xl font-semibold">{t("checkout.success.title")}</h1>
        <p className="text-white/70 mt-2">{t("checkout.success.subtitle")}</p>
        <div className="mt-6">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
            Plan: {plan}
          </span>
        </div>
        <div className="mt-8">
          <Link href="/onboarding/audience" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-[0_10px_30px_-15px_rgba(49,84,240,0.8)]">
            {t("checkout.success.cta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
