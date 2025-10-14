"use client";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PlanAdvisor } from "@/components/pricing/PlanAdvisor";
import { PlanComparison } from "@/components/pricing/PlanComparison";
import { SharedBenefits } from "@/components/pricing/SharedBenefits";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PricingFinalCTA } from "@/components/pricing/PricingFinalCTA";

export default function PricingPage() {
  return (
    <main className="min-h-screen w-full bg-[#0b1120] text-white">
      <PricingHero />
      <PlanAdvisor />
      <PlanComparison />
      <SharedBenefits />
      <PricingFAQ />
      <PricingFinalCTA />
    </main>
  );
}
