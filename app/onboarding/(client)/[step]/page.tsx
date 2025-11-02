"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StepLayout from "@/components/onboarding/StepLayout";
import { CLIENT_STEPS, nextStepHref, prevStepHref } from "@/components/onboarding/StepperProgress";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function ClientOnboardingStepPage() {
  const params = useParams<{ step: string }>();
  const step = (params?.step || "audience") as typeof CLIENT_STEPS[number];
  const { t } = useI18n();
  const router = useRouter();

  const title = useMemo(() => {
    switch (step) {
      case "audience":
        return t("ss.audience.title");
      case "offer":
        return t("ss.offer.title");
      case "operations":
        return t("ss.operations.title");
      case "messaging":
        return t("ss.messaging.title");
      case "summary":
        return t("ss.step.summary");
      default:
        return "";
    }
  }, [step, t]);

  // Local-only mock state (no API yet)
  const [local, setLocal] = useState<Record<string, any>>({});

  const handleFinish = () => {
    router.push("/dashboard");
  };

  if (!CLIENT_STEPS.includes(step as any)) {
    router.replace("/onboarding/audience");
    return null;
  }

  if (step === "summary") {
    return (
      <StepLayout title={title} prevHref={prevStepHref("summary")} isLast onNext={handleFinish}>
        <div className="space-y-4 text-sm text-black/70 dark:text-white/70">
          <p>Resumen de tus respuestas (mock). Puedes finalizar para ir al dashboard.</p>
        </div>
      </StepLayout>
    );
  }

  return (
    <StepLayout title={title} prevHref={step !== "audience" ? prevStepHref(step) : undefined} nextHref={nextStepHref(step)}>
      {step === "audience" && (
        <div className="grid gap-6">
          <Select
            label={t("ss.audience.q1")}
            options={[("--" as string), ...(t("ss.audience.q1.opts") as string).split(",")]}
            value={local.q1}
            onChange={(v) => setLocal((s) => ({ ...s, q1: v }))}
          />
          <TextAreaGroup
            label={t("ss.audience.q2")}
            value={local.q2 || ""}
            onChange={(v) => setLocal((s) => ({ ...s, q2: v }))}
          />
          <InputGroup
            label={t("ss.audience.q3")}
            value={local.q3 || ""}
            onChange={(v) => setLocal((s) => ({ ...s, q3: v }))}
          />
          <InputGroup
            label={t("ss.audience.q4")}
            value={local.q4 || ""}
            onChange={(v) => setLocal((s) => ({ ...s, q4: v }))}
          />
        </div>
      )}

      {step === "offer" && (
        <div className="grid gap-6">
          <TextAreaGroup
            label={t("ss.offer.q1")}
            value={local.o1 || ""}
            onChange={(v) => setLocal((s) => ({ ...s, o1: v }))}
          />
          <TextAreaGroup
            label={t("ss.offer.q2")}
            value={local.o2 || ""}
            onChange={(v) => setLocal((s) => ({ ...s, o2: v }))}
          />
          <TextAreaGroup
            label={t("ss.offer.q3")}
            value={local.o3 || ""}
            onChange={(v) => setLocal((s) => ({ ...s, o3: v }))}
          />
        </div>
      )}

      {step === "operations" && (
        <div className="grid gap-6">
          <InputGroup
            label={t("ss.operations.q1")}
            value={local.op1 || ""}
            onChange={(v) => setLocal((s) => ({ ...s, op1: v }))}
          />
          <TextAreaGroup
            label={t("ss.operations.q2")}
            value={local.op2 || ""}
            onChange={(v) => setLocal((s) => ({ ...s, op2: v }))}
          />
          <Select
            label={t("ss.operations.q3")}
            options={["Calidad (ticket alto)", "Volumen (más leads)"]}
            value={local.op3}
            onChange={(v) => setLocal((s) => ({ ...s, op3: v }))}
          />
        </div>
      )}

      {step === "messaging" && (
        <div className="grid gap-6">
          <Select
            label={t("ss.messaging.q1")}
            options={(t("ss.messaging.q1.opts") as string).split(",")}
            value={local.m1}
            onChange={(v) => setLocal((s) => ({ ...s, m1: v }))}
          />
          <Select
            label={t("ss.messaging.q2")}
            options={(t("ss.messaging.q2.opts") as string).split(",")}
            value={local.m2}
            onChange={(v) => setLocal((s) => ({ ...s, m2: v }))}
          />
          <TextAreaGroup
            label={t("ss.messaging.q3")}
            value={local.m3 || ""}
            onChange={(v) => setLocal((s) => ({ ...s, m3: v }))}
          />
        </div>
      )}
    </StepLayout>
  );
}

function InputGroup({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Input label={label} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextAreaGroup({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-black dark:text-white">{label}</label>
      <textarea
        className="w-full min-h-28 rounded-md border px-3 py-2 outline-none transition-all border-black/10 dark:border-white/15 bg-white dark:bg-black/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// old SelectGroup removed in favor of custom <Select /> component
