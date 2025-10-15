"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    title: "Volumen de contactos",
    question: "¿Cuántos leads B2B quieres contactar cada mes?",
    options: [
      { label: "Menos de 3.000 (validando mercado)", value: 1, color: "emerald" as ColorKey },
      { label: "3.000–6.000 (pipeline activo)", value: 2, color: "blue" as ColorKey },
      { label: "6.000–12.000 (equipo en crecimiento)", value: 3, color: "purple" as ColorKey },
      { label: "Más de 12.000 (escala o múltiples equipos)", value: 4, color: "orange" as ColorKey },
    ],
  },
  {
    id: 2,
    icon: Mail,
    title: "Canales y remitentes",
    question: "¿Desde cuántas cuentas o canales de e-mail trabajas?",
    options: [
      { label: "1 cuenta personal o marca", value: 1, color: "emerald" as ColorKey },
      { label: "2–3 cuentas de equipo", value: 2, color: "blue" as ColorKey },
      { label: "Más de 3 remitentes", value: 3, color: "purple" as ColorKey },
      { label: "Multicanal (e-mail, LinkedIn, WhatsApp…)", value: 4, color: "orange" as ColorKey },
    ],
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Reporting y soporte",
    question: "¿Qué nivel de seguimiento necesitas?",
    options: [
      { label: "Solo métricas básicas", value: 1, color: "emerald" as ColorKey },
      { label: "Dashboard con KPIs", value: 2, color: "blue" as ColorKey },
      { label: "Reportes PDF + CRM", value: 3, color: "purple" as ColorKey },
      { label: "SLA y métricas avanzadas", value: 4, color: "orange" as ColorKey },
    ],
  },
];

const PLANS = {
  Startup: {
    color: "emerald" as ColorKey,
    icon: Lightbulb,
    title: "Startup",
    desc: "Para validar mercado con bajo volumen.",
    features: ["3 000 leads verificados", "1 remitente", "Campañas IA básicas"],
  },
  PyME: {
    color: "blue" as ColorKey,
    icon: Mail,
    title: "PyME",
    desc: "Para equipos pequeños que quieren mantener su pipeline activo.",
    features: ["5 000 leads", "Hasta 3 remitentes", "Dashboard avanzado"],
  },
  Empresa: {
    color: "purple" as ColorKey,
    icon: BarChart3,
    title: "Empresa",
    desc: "Para escalar campañas con reporting e integraciones CRM.",
    features: ["8 000–12 000 leads", "Reporting PDF", "Integraciones CRM"],
  },
  Enterprise: {
    color: "orange" as ColorKey,
    icon: Building,
    title: "Enterprise",
    desc: "Grandes equipos, soporte garantizado e integraciones multicanal.",
    features: ["Volumen alto", "SLA garantizado", "APIs personalizadas"],
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
  const totalSteps = QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<PlanKey | null>(null);

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

  const ProgressBar = () => (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <motion.div
        className={`h-2 ${COLOR_MAP[activeColor].bar}`}
        animate={{ width: `${barPercent}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );

  const Stepper = () => (
    <div className="flex items-center justify-center gap-3 mt-4">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-6 rounded-full ${i <= (result ? totalSteps - 1 : step) ? COLOR_MAP[activeColor].dot : "bg-slate-700"}`}
        />
      ))}
    </div>
  );

  const QuestionCard = () => {
    const q = QUESTIONS[step];
    const Icon = q.icon;
    return (
      <motion.div
        key={step}
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -80, opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-8 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]"
        role="group"
        aria-label={q.title}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${COLOR_MAP["blue"].text}`} />
            <span className="text-sm text-slate-300">Paso {step + 1} de {totalSteps}</span>
          </div>
          <button onClick={goBack} className="inline-flex items-center gap-1 text-slate-300/90 hover:text-white transition disabled:opacity-40" disabled={atFirst} aria-label="Volver">
            <ChevronLeft className="w-4 h-4" /> Volver
          </button>
        </div>
        <p className="text-lg font-medium text-white text-center mb-5">{q.question}</p>
        <div className="grid gap-3 text-left">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.value)}
              className={`rounded-xl border border-slate-700/40 px-4 py-3 text-slate-200 transition ${COLOR_MAP[opt.color].hoverBorder} ${COLOR_MAP[opt.color].hoverBg} focus:outline-none focus:ring-2 ${COLOR_MAP[opt.color].ring}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end mt-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    );
  };

  const ResultCard = () => {
    if (!result) return null;
    const plan = PLANS[result];
    const Icon = plan.icon;
    return (
      <motion.div
        key="result"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-10 backdrop-blur-md text-center shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Icon className={`w-7 h-7 ${COLOR_MAP[plan.color].text}`} />
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <h3 className="text-3xl font-bold mb-2">
          Tu plan ideal es {" "}
          <span className={`${COLOR_MAP[plan.color].text}`}>{plan.title}</span>
        </h3>
        <p className="text-slate-300 mb-6">{plan.desc}</p>
        <ul className="grid sm:grid-cols-2 gap-2 text-slate-300 mb-8 text-left max-w-md mx-auto">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${COLOR_MAP[plan.color].dot}`} />
              {f}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a href="#comparison" className="px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition">
            Ver detalles del plan
          </a>
          <button onClick={() => openCalendly()} className="px-6 py-3 border border-slate-600 rounded-xl hover:bg-slate-800 transition">
            Agendar una demo
          </button>
          <button
            onClick={() => { setStep(0); setAnswers([]); setResult(null); }}
            className="px-6 py-3 border border-slate-700/60 rounded-xl hover:bg-slate-800/60 transition"
          >
            Rehacer quiz
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-20 md:py-28 bg-[#0b1120] text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Encuentra tu nivel de prospección</h2>
          <p className="text-slate-300 mt-3">Un asistente rápido para recomendarte el plan ideal según tu negocio.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ProgressBar />
          <Stepper />
          <div className="relative overflow-hidden min-h-[340px] mt-6">
            <AnimatePresence mode="wait">
              {result ? <ResultCard /> : <QuestionCard />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
