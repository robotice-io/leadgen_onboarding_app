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

			{/* CTA Final */}
			<section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950">
				<div className="container mx-auto px-6 text-center">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						{t("landing.finalCta.heading")}
					</h2>
					<p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
						{t("landing.finalCta.subtitle")}
					</p>
          
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/login"
							className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-blue-600 text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
						>
							{t("landing.finalCta.primaryCta")}
							<ArrowRight className="ml-2 w-5 h-5" />
						</Link>
									<button
										onClick={openCalendly}
										className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-blue-700 text-white text-lg font-semibold border-2 border-white hover:bg-blue-600 transition-all"
									>
										<Calendar className="mr-2 w-5 h-5" />
										{t("landing.finalCta.secondaryCta")}
									</button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 dark:bg-black text-gray-300 py-12">
				<div className="container mx-auto px-6 text-center">
					<Image
						src="/landing_logo.png"
						alt="Robotice.io"
						width={120}
						height={40}
						className="mx-auto mb-4 brightness-200"
					/>
					<p className="mb-4">© 2025 Robotice.io - LeadGen. Todos los derechos reservados.</p>
					<div className="flex justify-center gap-6 text-sm">
						<Link href="/login" className="hover:text-white transition-colors">Login</Link>
						<Link href="/pricing#comparison" className="hover:text-white transition-colors">Planes</Link>
						<Link href="/onboarding" className="hover:text-white transition-colors">Onboarding</Link>
					</div>
				</div>
			</footer>
		</main>
	);
}
