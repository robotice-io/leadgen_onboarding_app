"use client";

import { cn } from "@/lib/utils";
import { Layers, Search, Zap } from "lucide-react";
import type React from "react";

// The main props for the HowItWorks component
interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {}

// The props for a single step card
interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

/**
 * A single step card within the "How It Works" section.
 * It displays an icon, title, description, and a list of benefits.
 */
const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
}) => (
  <div
    className={cn(
      // Replace shadcn tokens with Tailwind classes fitting the black theme
      "relative rounded-2xl border border-white/10 bg-black p-6 text-white transition-all duration-300 ease-in-out",
      "hover:scale-105 hover:shadow-lg hover:border-blue-500/50 hover:bg-white/5"
    )}
  >
    {/* Icon */}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-blue-400">
      {icon}
    </div>
    {/* Title and Description */}
    <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
    <p className="mb-6 text-white/70">{description}</p>
    {/* Benefits List */}
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-3">
          <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
          <span className="text-white/70">{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * A responsive "How It Works" section that displays a 3-step process.
 * Adapted to a pure black background to match the hero section.
 */
export const HowItWorks: React.FC<HowItWorksProps> = ({
  className,
  ...props
}) => {
  const stepsData = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Enter your query",
      description:
        "Enter part name or article number, and we'll instantly check availability across thousands of stores.",
      benefits: [
        "Smart search understands even imprecise queries",
        "Automatic city detection",
        "Search history for quick access",
      ],
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Choose the best offer",
      description:
        "Compare prices, location and availability, choose the optimal option.",
      benefits: [
        "Sort by price, distance and rating",
        "Filter by availability and manufacturer",
        "Detailed information about each offer",
      ],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Contact the store",
      description:
        "Call the store directly or request a callback through our service.",
      benefits: [
        "Direct contact without intermediaries",
        "Parts reservation capability",
        "Route building to store",
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("w-full bg-black text-white py-16 sm:py-24", className)}
      {...props}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">
            How it works
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Our service uses advanced technologies for instant auto parts search
            across thousands of stores in your city
          </p>
        </div>

        {/* Step Indicators with Connecting Line */}
        <div className="relative mx-auto mb-8 w-full max-w-4xl">
          <div
            aria-hidden="true"
            className="absolute left-[16.6667%] top-1/2 h-0.5 w-[66.6667%] -translate-y-1/2 bg-white/10"
          ></div>
          {/* Use grid to align numbers with the card grid below */}
          <div className="relative grid grid-cols-3">
            {stepsData.map((_, index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center justify-self-center rounded-full bg-white/10 font-semibold text-white ring-4 ring-black"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              benefits={step.benefits}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
