"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function CancelPage() {
  const { t } = useI18n();
  return (
    <main className="min-h-[70vh] grid place-items-center bg-black text-white">
      <div className="text-center max-w-xl mx-auto px-6">
        <div className="mx-auto mb-6 h-14 w-14 rounded-full grid place-items-center bg-yellow-600/20 text-yellow-400">
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
        </div>
        <h1 className="text-3xl font-semibold">{t("checkout.cancel.title")}</h1>
        <p className="text-white/70 mt-2">{t("checkout.cancel.subtitle")}</p>
        <div className="mt-8">
          <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-[0_10px_30px_-15px_rgba(49,84,240,0.8)]">
            {t("checkout.cancel.cta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
