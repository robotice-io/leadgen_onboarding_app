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
									price: "49",
									yearlyPrice: "39",
									period: "mes",
									features: [
										"3 000 leads verificados",
										"1 remitente",
										"Dashboard básico",
										"Soporte por email",
									],
									description: "Para validar mercado con bajo volumen.",
									buttonText: "Empezar",
									href: "/login",
								},
								{
									name: "Core",
									price: "149",
									yearlyPrice: "119",
									period: "mes",
									features: [
										"5 000 leads",
										"Hasta 3 remitentes",
										"Campañas + contactos",
										"Dashboard avanzado",
									],
									description: "Mantén tu pipeline activo.",
									buttonText: "Elegir Core",
									href: "/pricing#comparison",
									isPopular: true,
								},
								{
									name: "Pro",
									price: "299",
									yearlyPrice: "239",
									period: "mes",
									features: [
										"8 000 – 12 000 leads",
										"Reporte PDF",
										"Integraciones CRM",
										"Soporte prioritario",
									],
									description: "Escala y gestiona todo desde la app.",
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
