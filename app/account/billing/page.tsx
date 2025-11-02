"use client";

import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

export default function BillingPage() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-6">Billing</h1>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/60">Current plan</div>
              <div className="text-xl font-medium">Starter</div>
            </div>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
              Active (mock)
            </span>
          </div>
          <div className="mt-6 flex gap-3">
            <Button isDisabled>Pause (mock)</Button>
            <Button isDisabled>Resume (mock)</Button>
            <Button variant="white" isDisabled>
              Cancel (mock)
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
