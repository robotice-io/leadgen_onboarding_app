"use client";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Mail, Calendar, ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/ui/how-it-works";
import { WhyLeadGenAI } from "@/components/ui/why-leadgen";
import { Deliverables } from "@/components/landing/Deliverables";
import { Pricing } from "@/components/landing/Pricing";
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

			{/* Planes Section (nuevo) */}
			<div id="planes">
				<Pricing />
			</div>

			{/* Resultados Esperados Section */}
			<section className="py-20 bg-white dark:bg-gray-900">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
							{t("landing.results.heading")}
						</h2>
					</div>
          
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
						<div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 text-center border border-blue-200 dark:border-blue-800">
							<TrendingUp className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
							<div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">65-80%</div>
							<div className="text-gray-700 dark:text-gray-300 font-medium">{t("landing.results.point1")}</div>
						</div>
            
						<div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-8 text-center border border-green-200 dark:border-green-800">
							<Mail className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
							<div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">4-7%</div>
							<div className="text-gray-700 dark:text-gray-300 font-medium">{t("landing.results.point2")}</div>
						</div>
            
						<div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-8 text-center border border-purple-200 dark:border-purple-800">
							<Calendar className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
							<div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">6-12</div>
							<div className="text-gray-700 dark:text-gray-300 font-medium">{t("landing.results.point3")}</div>
						</div>
            
						<div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-8 text-center border border-orange-200 dark:border-orange-800">
							<TrendingUp className="w-12 h-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
							<div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">×6</div>
							<div className="text-gray-700 dark:text-gray-300 font-medium">{t("landing.results.point4")}</div>
						</div>
					</div>
				</div>
			</section>

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
