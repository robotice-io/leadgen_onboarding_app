"use client";

import { motion, useSpring } from "framer-motion";
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Check, Star as LucideStar } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// --- MEDIA QUERY HOOK ---
export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const result = matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setValue(event.matches);
    result.addEventListener("change", onChange);
    setValue(result.matches);
    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

// --- BASE UI COMPONENTS (BUTTON) ---
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-600/90",
        destructive: "bg-red-600 text-white hover:bg-red-600/90",
        outline: "border border-white/15 bg-black text-white hover:bg-white/5",
        secondary: "bg-white/10 text-white hover:bg-white/15",
        ghost: "hover:bg-white/5 text-white",
        link: "text-blue-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

// --- INTERACTIVE STARFIELD ---
function Star({ mousePosition, containerRef }: { mousePosition: { x: number | null; y: number | null }; containerRef: React.RefObject<HTMLDivElement>; }) {
  const [initialPos] = useState({ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` });
  const springConfig = { stiffness: 100, damping: 15, mass: 0.1 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    if (!containerRef.current || mousePosition.x === null || mousePosition.y === null) {
      springX.set(0); springY.set(0); return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const starX = rect.left + (parseFloat(initialPos.left) / 100) * rect.width;
    const starY = rect.top + (parseFloat(initialPos.top) / 100) * rect.height;
    const dx = mousePosition.x - starX; const dy = mousePosition.y - starY;
    const distance = Math.hypot(dx, dy);
    const radius = 600;
    if (distance < radius) {
      const force = 1 - distance / radius;
      springX.set(dx * force * 0.5); springY.set(dy * force * 0.5);
    } else { springX.set(0); springY.set(0); }
  }, [mousePosition, initialPos, containerRef, springX, springY]);

  return (
    <motion.div className="absolute bg-white/90 rounded-full"
      style={{ top: initialPos.top, left: initialPos.left, width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`, x: springX, y: springY }}
      initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }} />
  );
}

function InteractiveStarfield({ mousePosition, containerRef }: { mousePosition: { x: number | null; y: number | null }; containerRef: React.RefObject<HTMLDivElement>; }) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {Array.from({ length: 120 }).map((_, i) => (
        <Star key={`star-${i}`} mousePosition={mousePosition} containerRef={containerRef} />
      ))}
    </div>
  );
}

// --- PRICING ---
interface PricingPlan { name: string; price: string; yearlyPrice: string; period: string; features: string[]; description: string; buttonText: string; href: string; isPopular?: boolean; }
interface PricingSectionProps { plans: PricingPlan[]; title?: string; description?: string; className?: string; }

const PricingContext = createContext<{ isMonthly: boolean; setIsMonthly: (v: boolean) => void; }>({ isMonthly: true, setIsMonthly: () => {} });

export function PricingSection({ plans, title = "Elige tu plan", description = "Planes claros y transparentes para cada etapa.", className }: PricingSectionProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => setMousePosition({ x: e.clientX, y: e.clientY });

  return (
    <PricingContext.Provider value={{ isMonthly, setIsMonthly }}>
      <div ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={() => setMousePosition({ x: null, y: null })} className={cn("relative w-full bg-black py-20 sm:py-24", className)}>
        <InteractiveStarfield mousePosition={mousePosition} containerRef={containerRef} />
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-white">{title}</h2>
            <p className="text-white/70 text-lg whitespace-pre-line">{description}</p>
          </div>
          <PricingToggle />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 items-start gap-8">
            {plans.map((plan, index) => (<PricingCard key={index} plan={plan} index={index} />))}
          </div>
        </div>
      </div>
    </PricingContext.Provider>
  );
}

function PricingToggle() {
  const { isMonthly, setIsMonthly } = useContext(PricingContext);
  const confettiRef = useRef<HTMLDivElement>(null);
  const monthlyBtnRef = useRef<HTMLButtonElement>(null);
  const annualBtnRef = useRef<HTMLButtonElement>(null);
  const [pillStyle, setPillStyle] = useState<Record<string, any>>({});

  useEffect(() => {
    const btnRef = isMonthly ? monthlyBtnRef : annualBtnRef;
    if (btnRef.current) {
      setPillStyle({ width: btnRef.current.offsetWidth, transform: `translateX(${btnRef.current.offsetLeft}px)` });
    }
  }, [isMonthly]);

  const handleToggle = (monthly: boolean) => {
    if (isMonthly === monthly) return;
    setIsMonthly(monthly);

    if (!monthly && confettiRef.current) {
      const rect = annualBtnRef.current?.getBoundingClientRect();
      if (!rect) return;
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({ particleCount: 80, spread: 80, origin: { x: originX, y: originY }, colors: ["#3154F0", "#ffffff"], ticks: 280, gravity: 1.2, decay: 0.94, startVelocity: 30 });
    }
  };

  return (
    <div className="flex justify-center">
      <div ref={confettiRef} className="relative flex w-fit items-center rounded-full bg-white/10 p-1 border border-white/15">
        <motion.div className="absolute left-0 top-0 h-full rounded-full bg-white/20" style={pillStyle} transition={{ type: "spring", stiffness: 500, damping: 40 }} />
        <button ref={monthlyBtnRef} onClick={() => handleToggle(true)} className={cn("relative z-10 rounded-full px-4 sm:px-6 py-2 text-sm font-medium transition-colors", isMonthly ? "text-white" : "text-white/60 hover:text-white")}>
          Mensual
        </button>
        <button ref={annualBtnRef} onClick={() => handleToggle(false)} className={cn("relative z-10 rounded-full px-4 sm:px-6 py-2 text-sm font-medium transition-colors", !isMonthly ? "text-white" : "text-white/60 hover:text-white")}>Anual <span className={cn("hidden sm:inline", !isMonthly ? "text-white/80" : "")}> (Ahorra 20%)</span></button>
      </div>
    </div>
  );
}

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const { isMonthly } = useContext(PricingContext);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: plan.isPopular && isDesktop ? -20 : 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20, delay: index * 0.15 }} className={cn("rounded-2xl p-8 flex flex-col relative bg-black/50 backdrop-blur-sm border", plan.isPopular ? "border-blue-500/60 shadow-[0_0_0_1px_rgba(49,84,240,0.35),0_20px_70px_-30px_rgba(49,84,240,0.55)]" : "border-white/10")}> 
      {plan.isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <div className="bg-blue-600 py-1.5 px-4 rounded-full flex items-center gap-1.5">
            <LucideStar className="text-white h-4 w-4 fill-current" />
            <span className="text-white text-sm font-semibold">Más elegido</span>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col text-center">
        <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
        <p className="mt-2 text-sm text-white/70">{plan.description}</p>
        <div className="mt-6 flex items-baseline justify-center gap-x-1">
          <span className="text-5xl font-bold tracking-tight text-white">
            <NumberFlow value={isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)} format={{ style: "currency", currency: "USD", minimumFractionDigits: 0 }} className="font-variant-numeric: tabular-nums" />
          </span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-white/70">/ {plan.period}</span>
        </div>
        <p className="text-xs text-white/60 mt-2">{isMonthly ? "Cobrado mensualmente" : "Cobrado anualmente"}</p>

        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-left text-white/80">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-x-3">
              <Check className="h-6 w-5 flex-none text-blue-500" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <Link href={plan.href} className={cn(buttonVariants({ variant: plan.isPopular ? "default" : "outline", size: "lg" }), "w-full")}>{plan.buttonText}</Link>
        </div>
      </div>
    </motion.div>
  );
}
