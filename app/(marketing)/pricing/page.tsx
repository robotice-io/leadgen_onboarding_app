"use client";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PlanAdvisor } from "@/components/pricing/PlanAdvisor";
import { GrowthWizard } from "@/components/pricing/GrowthWizard";
import { PlanComparison } from "@/components/pricing/PlanComparison";
import { SharedBenefits } from "@/components/pricing/SharedBenefits";
import { FAQGrowthSection } from "@/components/pricing/FAQGrowthSection";
import { PricingFinalCTA } from "@/components/pricing/PricingFinalCTA";

export default function PricingPage() {
	return (
		<main className="min-h-screen w-full bg-[#0b1120] text-white">
			<PricingHero />
			{/* MiniQuiz / Wizard mejorado */}
			<GrowthWizard />
			<PlanComparison />
			<SharedBenefits />
			<FAQGrowthSection />
			<PricingFinalCTA />
		</main>
	);
}
