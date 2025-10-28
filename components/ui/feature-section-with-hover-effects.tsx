"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Mail,
  Sparkles,
  BarChart3,
  Users,
  PlugZap,
  Shield,
} from "lucide-react";

export type FeatureItem = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export function FeaturesSectionWithHoverEffects({
  features,
  className,
}: {
  features: FeatureItem[];
  className?: string;
}) {
  // Fallback icons in case caller omits one
  const fallbackIcons = [
    <Mail key="m" className="w-6 h-6" />, // 0
    <Sparkles key="s" className="w-6 h-6" />, // 1
    <BarChart3 key="b" className="w-6 h-6" />, // 2
    <Users key="u" className="w-6 h-6" />, // 3
    <PlugZap key="p" className="w-6 h-6" />, // 4
    <Shield key="sh" className="w-6 h-6" />, // 5
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 max-w-6xl mx-auto",
        className
      )}
    >
      {features.map((feature, index) => (
        <Feature
          key={`${feature.title}-${index}`}
          title={feature.title}
          description={feature.description}
          icon={feature.icon ?? fallbackIcons[index % fallbackIcons.length]}
          index={index}
        />
      ))}
    </div>
  );
}

function Feature({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) {
  return (
    <div
      className={cn(
        "flex flex-col py-8 relative group/feature border-white/10",
        // card surface
        "bg-white/[0.03] backdrop-blur-sm",
        // borders layout similar to prompt
        "lg:border-r lg:border-b first:lg:border-l",
        // spacing
        "min-h-[160px]"
      )}
    >
      {/* hover wash */}
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="mb-4 relative z-10 px-8 text-white/70">{icon}</div>
      <div className="text-lg font-semibold mb-2 relative z-10 px-8">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-white/10 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-white/70 max-w-md relative z-10 px-8">{description}</p>
    </div>
  );
}

export default FeaturesSectionWithHoverEffects;
