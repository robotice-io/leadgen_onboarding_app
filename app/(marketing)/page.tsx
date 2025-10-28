"use client";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Mail, Calendar, ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/ui/how-it-works";
import { WhyLeadGenAI } from "@/components/ui/why-leadgen";
import { Deliverables } from "@/components/landing/Deliverables";
import { PricingSection } from "@/components/ui/pricing";
import { StatsSection } from "@/components/ui/stats-section-with-text";
import { useI18n } from "@/lib/i18n";
import { openCalendly } from "@/lib/calendly";
import { CallToAction } from "@/components/ui/cta-3";
import { MinimalFooter } from "@/components/ui/minimal-footer";

export default function Home() {
	const { t, lang } = useI18n();
	return (
	<main className="min-h-screen w-full bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
			<Hero />

			<HowItWorks className="bg-black" />

			<WhyLeadGenAI />

			<Deliverables />

					{/* Planes Section (nuevo tema negro) */}
					<div id="planes">
						<PricingSection
							plans={[
								{
									name: "Starter",
									price: String(390_000),
									yearlyPrice: String(Math.round(390_000 * 0.8)),
									period: "CLP/mes",
									features: [
										"3000 leads verificados",
										"3 plantillas IA",
										"Dashboard básico",
										"1 ICP",
									],
									description:
										"Ideal para validar mercado. 3 000 leads, 3 plantillas IA, dashboard básico.",
									buttonText: "Empezar ahora",
									href: "/login",
								},
								{
									name: "Core",
									price: String(790_000),
									yearlyPrice: String(Math.round(790_000 * 0.8)),
									period: "CLP/mes",
									features: [
										"5000 leads verificados",
										"5 plantillas IA",
										"Campañas + Contactos",
										"Dashboard avanzado",
									],
									description:
										"Para mantener tu pipeline activo. 5 000 leads, campañas + contactos, dashboard avanzado.",
									buttonText: "Elegir Core",
									href: "/pricing#comparison",
									isPopular: true,
								},
								{
									name: "Pro",
									price: String(1_490_000),
									yearlyPrice: String(Math.round(1_490_000 * 0.8)),
									period: "CLP/mes",
									features: [
										"8000–12.000 leads",
										"App completa",
										"Reporting PDF",
										"Integraciones CRM",
									],
									description:
										"Para escalar y gestionar todo desde la app. 8 000 – 12 000 leads, reporting PDF, integraciones CRM.",
									buttonText: "Hablar con ventas",
									href: "/contact",
								},
							]}
							title="Elige el plan que impulsa tu crecimiento"
							description={"IA, estrategia y automatización — en un solo flujo."}
						/>
					</div>

			{/* Resultados: modern black stats section */}
			<StatsSection />

			{/* CTA Final (modern black theme) */}
			<section className="py-24 bg-black">
				<div className="container mx-auto px-6">
					<CallToAction />
				</div>
			</section>

			{/* Footer */}
			<MinimalFooter />
		</main>
	);
}
