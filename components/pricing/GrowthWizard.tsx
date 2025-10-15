"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Mail,
  BarChart3,
  Building,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { openCalendly } from "@/lib/calendly";
import { useI18n } from "@/lib/i18n";

type ColorKey = "emerald" | "blue" | "purple" | "orange";

const COLOR_MAP: Record<ColorKey, { dot: string; text: string; ring: string; hoverBorder: string; hoverBg: string; bar: string }> = {
  emerald: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    ring: "ring-emerald-400/40",
    hoverBorder: "hover:border-emerald-500/40",
    hoverBg: "hover:bg-emerald-500/10",
    bar: "bg-emerald-500",
  },
  blue: {
    dot: "bg-blue-400",
    text: "text-blue-400",
    ring: "ring-blue-400/40",
    hoverBorder: "hover:border-blue-500/40",
    hoverBg: "hover:bg-blue-500/10",
    bar: "bg-blue-600",
  },
  purple: {
    dot: "bg-violet-400",
    text: "text-violet-400",
    ring: "ring-violet-400/40",
    hoverBorder: "hover:border-violet-500/40",
    hoverBg: "hover:bg-violet-500/10",
    bar: "bg-violet-500",
  },
  orange: {
    dot: "bg-orange-400",
    text: "text-orange-400",
    ring: "ring-orange-400/40",
    hoverBorder: "hover:border-orange-500/40",
    hoverBg: "hover:bg-orange-500/10",
    bar: "bg-orange-500",
  },
};

const QUESTIONS = [
  {
    id: 1,
    icon: Lightbulb,
    title: "wizard.step1.title",
    question: "wizard.step1.question",
    options: [
      { label: "wizard.step1.opt1", value: 1, color: "emerald" as ColorKey },
      { label: "wizard.step1.opt2", value: 2, color: "blue" as ColorKey },
      { label: "wizard.step1.opt3", value: 3, color: "purple" as ColorKey },
      { label: "wizard.step1.opt4", value: 4, color: "orange" as ColorKey },
    ],
  },
  {
    id: 2,
    icon: Mail,
    title: "wizard.step2.title",
    question: "wizard.step2.question",
    options: [
      { label: "wizard.step2.opt1", value: 1, color: "emerald" as ColorKey },
      { label: "wizard.step2.opt2", value: 2, color: "blue" as ColorKey },
      { label: "wizard.step2.opt3", value: 3, color: "purple" as ColorKey },
      { label: "wizard.step2.opt4", value: 4, color: "orange" as ColorKey },
    ],
  },
  {
    id: 3,
    icon: BarChart3,
    title: "wizard.step3.title",
    question: "wizard.step3.question",
    options: [
      { label: "wizard.step3.opt1", value: 1, color: "emerald" as ColorKey },
      { label: "wizard.step3.opt2", value: 2, color: "blue" as ColorKey },
      { label: "wizard.step3.opt3", value: 3, color: "purple" as ColorKey },
      { label: "wizard.step3.opt4", value: 4, color: "orange" as ColorKey },
    ],
  },
];

const PLANS = {
  Startup: {
    color: "emerald" as ColorKey,
    icon: Lightbulb,
    title: "wizard.plan.startup.title",
    desc: "wizard.plan.startup.desc",
    features: [
      "wizard.plan.startup.f1",
      "wizard.plan.startup.f2",
      "wizard.plan.startup.f3",
    ],
  },
  PyME: {
    color: "blue" as ColorKey,
    icon: Mail,
    title: "wizard.plan.pyme.title",
    desc: "wizard.plan.pyme.desc",
    features: [
      "wizard.plan.pyme.f1",
      "wizard.plan.pyme.f2",
      "wizard.plan.pyme.f3",
    ],
  },
  Empresa: {
    color: "purple" as ColorKey,
    icon: BarChart3,
    title: "wizard.plan.empresa.title",
    desc: "wizard.plan.empresa.desc",
    features: [
      "wizard.plan.empresa.f1",
      "wizard.plan.empresa.f2",
      "wizard.plan.empresa.f3",
    ],
  },
  Enterprise: {
    color: "orange" as ColorKey,
    icon: Building,
    title: "wizard.plan.enterprise.title",
    desc: "wizard.plan.enterprise.desc",
    features: [
      "wizard.plan.enterprise.f1",
      "wizard.plan.enterprise.f2",
      "wizard.plan.enterprise.f3",
    ],
  },
};

type PlanKey = keyof typeof PLANS;

function recommendPlan(v: number, c: number, r: number): PlanKey {
  if (v === 1 && c === 1 && r === 1) return "Startup";
  if ((v <= 2 && c <= 2) || r === 2) return "PyME";
  if (v === 3 || c === 3 || r === 3) return "Empresa";
  if (v === 4 || c === 4 || r === 4) return "Enterprise";
  return "PyME";
}

export function GrowthWizard() {
  const { t, lang } = useI18n();
  const totalSteps = QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<PlanKey | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const atFirst = step === 0 && !result;
  const barPercent = ((result ? totalSteps : step) / totalSteps) * 100;

  const activeColor: ColorKey = useMemo(() => {
    if (result) return PLANS[result].color;
    const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
    return q.options[0].color; // color base por paso
  }, [step, result]);

  const goBack = useCallback(() => {
    if (result) {
      setResult(null);
      return;
    }
    if (step > 0) {
      setAnswers((prev) => prev.slice(0, -1));
      setStep((s) => Math.max(0, s - 1));
    }
  }, [result, step]);

  const handleAnswer = (value: number) => {
    setAnswers((prev) => {
      const next = [...prev, value];
      if (next.length === totalSteps) {
        const [v, c, r] = next;
        setResult(recommendPlan(v, c, r));
      } else {
        setStep((s) => s + 1);
      }
      return next;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goBack();
      if (e.key === "Escape") {
        setStep(0); setAnswers([]); setResult(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBack]);

  // Persist state in sessionStorage
  useEffect(() => {
    try {
      const rawStep = sessionStorage.getItem("gw_step");
      const rawAns = sessionStorage.getItem("gw_answers");
      const rawRes = sessionStorage.getItem("gw_result");
      if (rawStep) setStep(parseInt(rawStep, 10) || 0);
      if (rawAns) setAnswers(JSON.parse(rawAns));
      if (rawRes) setResult(rawRes as PlanKey);
    } catch {}
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem("gw_step", String(step)); } catch {}
  }, [step]);
  useEffect(() => {
    try { sessionStorage.setItem("gw_answers", JSON.stringify(answers)); } catch {}
  }, [answers]);
  useEffect(() => {
    try { sessionStorage.setItem("gw_result", result ?? ""); } catch {}
  }, [result]);

  // reset selection when step changes
  useEffect(() => { setSelectedIdx(null); }, [step, result]);

  const ProgressBar = () => (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        className={`h-2 ${COLOR_MAP[activeColor].bar}`}
        style={{ width: `${barPercent}%`, transition: "width 280ms ease" }}
      />
    </div>
  );

  const Stepper = () => (
    <div className="flex items-center justify-center gap-3 mt-4">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-6 rounded-full transition-transform duration-200 ${i <= (result ? totalSteps - 1 : step) ? COLOR_MAP[activeColor].dot : "bg-slate-700"}`}
          style={{ transform: i === step && !result ? "scale(1.06)" : "scale(1)" }}
        />
      ))}
    </div>
  );

  const QuestionContent = () => {
    const q = QUESTIONS[step];
    const Icon = q.icon;
    return (
      <div
        key={step}
        className="relative"
        role="group"
        aria-label={t(q.title as any)}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${COLOR_MAP["blue"].text}`} />
            <span className="text-sm text-slate-300">{t("wizard.step" as any)} {step + 1} {t("wizard.of" as any)} {totalSteps}</span>
          </div>
          <button onClick={goBack} className="inline-flex items-center gap-1 text-slate-300/90 hover:text-white transition disabled:opacity-40" disabled={atFirst} aria-label={t("wizard.action.back" as any)}>
            <ChevronLeft className="w-4 h-4" /> {t("wizard.action.back" as any)}
          </button>
        </div>
        <p className="text-lg font-medium text-white text-center mb-5">{t(q.question as any)}</p>
        <div className="grid gap-3 text-left">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedIdx(i);
                // Micro vibración en móviles si está disponible
                try { if (navigator.vibrate) navigator.vibrate(8); } catch {}
                setTimeout(() => {
                  handleAnswer(opt.value);
                  // limpiar seleccionado para evitar animación fantasma al render del siguiente paso
                  setSelectedIdx(null);
                }, 140);
              }}
              className={`rounded-xl px-4 py-3 text-slate-200 transition-colors duration-200 border ${selectedIdx === i ? `border-transparent ring-2 ${COLOR_MAP[opt.color].ring}` : "border-slate-700/40"} ${COLOR_MAP[opt.color].hoverBorder} ${COLOR_MAP[opt.color].hoverBg} focus:outline-none`}
            >
              <div className="flex items-center justify-between">
                <span>{t(opt.label as any)}</span>
                {selectedIdx === i && (
                  <span
                    className={`ml-3 inline-block w-2.5 h-2.5 rounded-full ${COLOR_MAP[opt.color].dot}`}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end mt-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            {t("wizard.action.next" as any)}
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  };

  const ResultContent = () => {
    if (!result) return null;
    const plan = PLANS[result];
    const Icon = plan.icon;
    return (
      <div key="result" className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Icon className={`w-7 h-7 ${COLOR_MAP[plan.color].text}`} />
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <h3 className="text-3xl font-bold mb-2">
          {t("wizard.result.titlePrefix" as any)} {" "}
          <span className={`${COLOR_MAP[plan.color].text}`}>{t(plan.title as any)}</span>
        </h3>
        <p className="text-slate-300 mb-6">{t(plan.desc as any)}</p>
        <ul className="grid sm:grid-cols-2 gap-2 text-slate-300 mb-8 text-left max-w-md mx-auto">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${COLOR_MAP[plan.color].dot}`} />
              {t(f as any)}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a href="#comparison" className="px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition">
            {t("wizard.cta.details" as any)}
          </a>
          <button onClick={() => openCalendly()} className="px-6 py-3 border border-slate-600 rounded-xl hover:bg-slate-800 transition">
            {t("wizard.cta.demo" as any)}
          </button>
          <button
            onClick={() => { setStep(0); setAnswers([]); setResult(null); }}
            className="px-6 py-3 border border-slate-700/60 rounded-xl hover:bg-slate-800/60 transition"
          >
            {t("wizard.action.restart" as any)}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 md:py-28 bg-[#0b1120] text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">{t("wizard.title" as any)}</h2>
          <p className="text-slate-300 mt-3">{t("wizard.subtitle" as any)}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ProgressBar />
          <Stepper />
          <div className="relative overflow-hidden mt-6">
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-8 md:p-10 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] min-h-[380px]">
              {result ? <ResultContent /> : <QuestionContent />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
