"use client";
import { useI18n } from "@/lib/i18n";
import { Shield, Sparkles, BarChart3, PlugZap, Users, Mail } from "lucide-react";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";

export function SharedBenefits() {
  const { t } = useI18n();

  // Migrate legacy cards' information to the new section
  const features = [
    {
      title: t("pricing.shared.item1.title" as any),
      description: t("pricing.shared.item1.desc" as any),
      icon: <Mail className="w-6 h-6 text-blue-400" />,
    },
    {
      title: t("pricing.shared.item2.title" as any),
      description: t("pricing.shared.item2.desc" as any),
      icon: <Sparkles className="w-6 h-6 text-blue-400" />,
    },
    {
      title: t("pricing.shared.item3.title" as any),
      description: t("pricing.shared.item3.desc" as any),
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
    },
    {
      title: t("pricing.shared.item4.title" as any),
      description: t("pricing.shared.item4.desc" as any),
      icon: <Users className="w-6 h-6 text-blue-400" />,
    },
    {
      title: t("pricing.shared.item5.title" as any),
      description: t("pricing.shared.item5.desc" as any),
      icon: <PlugZap className="w-6 h-6 text-blue-400" />,
    },
    {
      title: t("pricing.shared.item6.title" as any),
      description: t("pricing.shared.item6.desc" as any),
      icon: <Shield className="w-6 h-6 text-blue-400" />,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">{t("pricing.shared.heading")}</h2>
          <p className="text-white/70 mt-2">{t("pricing.shared.subtitle")}</p>
        </div>
        <FeaturesSectionWithHoverEffects features={features} />
      </div>
    </section>
  );
}
