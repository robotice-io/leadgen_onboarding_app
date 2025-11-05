"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { useMemo, useState } from "react";

const SOURCES = [
  "Email",
  "Google",
  "LinkedIn",
  "TikTok",
  "Instagram",
  "G2",
  "A friend",
  "Facebook",
  "X",
  "YouTube",
  "Other",
] as const;

const INDUSTRIES = [
  "Recruiting",
  "Agency",
  "Software (SaaS)",
  "Consulting/Coaching",
  "Other",
] as const;

const SIZES = ["1-10", "11-20", "21-50", "51-100", "101-200", "201-500", "501-1000", "1000-5000", "5000+"] as const;

export default function PrecheckoutSurveyPage() {
  const { t } = useI18n();
  const router = useRouter();
  let plan = "starter";
  let nextPath = "/checkout";
  try {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const p = new URLSearchParams(search);
    plan = p.get("plan") || "starter";
    // Allow overriding next step so we can reuse this page after payment
    const next = p.get("next");
    if (next) {
      nextPath = next;
    } else {
      nextPath = `/checkout?plan=${encodeURIComponent(plan)}`;
    }
  } catch {}

  const [source, setSource] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  const canContinue = useMemo(() => Boolean(source), [source]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("survey.title")}</h1>
          <p className="text-white/70 mb-8">{t("survey.subtitle")}</p>

          <section className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-3">{t("survey.where")}</h3>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map((s) => (
                <Chip key={s} label={s} active={source === s} onClick={() => setSource(s)} />
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-3">{t("survey.industry")}</h3>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((s) => (
                <Chip key={s} label={s} active={industry === s} onClick={() => setIndustry(s)} />
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-3">{t("survey.size")}</h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <Chip key={s} label={s} active={size === s} onClick={() => setSize(s)} />
              ))}
            </div>
          </section>

          <div className="mt-10">
            <Button
              onPress={() => router.push(nextPath)}
              isDisabled={!canContinue}
            >
              {t("survey.next")}
            </Button>
          </div>
        </div>

        <aside className="hidden md:flex items-center justify-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-w-md">
            <blockquote className="text-white/80">
              “Email outreach is one of the most effective ways to expand your business and gain new business.”
            </blockquote>
            <div className="mt-4 text-sm text-white/60">— Customer</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Chip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-3 py-1.5 rounded-full border text-sm font-semibold transition-all " +
        (active
          ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.25)_inset]"
          : "border-white/15 text-white/80 hover:border-white/30")
      }
    >
      {label}
    </button>
  );
}
